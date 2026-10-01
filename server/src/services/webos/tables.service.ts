import type { TableSection } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import { CommerceError } from '../../lib/commerceError.js';

async function assertSiteOwned(ownerId: string, siteId: string) {
  const site = await prisma.site.findFirst({ where: { id: siteId, ownerId } });
  if (!site) throw new CommerceError(404, 'Site not found.');
}

// A table is free for [start, end) if no non-cancelled reservation already
// assigned to it overlaps that window. Shared by assignment and
// auto-suggestion so the two can never disagree about what's bookable.
export async function isTableFree(siteId: string, tableId: string, start: Date, end: Date, excludeReservationId?: string): Promise<boolean> {
  const conflicting = await prisma.reservation.findMany({
    where: { siteId, tableId, status: { not: 'CANCELLED' }, ...(excludeReservationId ? { id: { not: excludeReservationId } } : {}) },
    select: { reservationAt: true, durationMinutes: true },
  });
  return !conflicting.some((r) => {
    const rStart = r.reservationAt;
    const rEnd = new Date(rStart.getTime() + r.durationMinutes * 60_000);
    return start < rEnd && rStart < end;
  });
}

export async function listTables(ownerId: string, siteId: string) {
  await assertSiteOwned(ownerId, siteId);
  return prisma.table.findMany({ where: { siteId }, orderBy: { name: 'asc' } });
}

export async function createTable(
  ownerId: string,
  siteId: string,
  data: { name: string; capacity: number; section?: TableSection | null; notes?: string },
) {
  await assertSiteOwned(ownerId, siteId);
  return prisma.table.create({ data: { siteId, ...data } });
}

export async function updateTable(
  ownerId: string,
  siteId: string,
  id: string,
  data: Partial<{ name: string; capacity: number; section: TableSection | null; notes: string | null; active: boolean }>,
) {
  await assertSiteOwned(ownerId, siteId);
  const existing = await prisma.table.findFirst({ where: { id, siteId } });
  if (!existing) throw new CommerceError(404, 'Table not found.');
  return prisma.table.update({ where: { id }, data });
}

export async function deleteTable(ownerId: string, siteId: string, id: string) {
  await assertSiteOwned(ownerId, siteId);
  const existing = await prisma.table.findFirst({ where: { id, siteId } });
  if (!existing) throw new CommerceError(404, 'Table not found.');
  await prisma.table.delete({ where: { id } });
}

export type TableLiveStatus = 'AVAILABLE' | 'RESERVED' | 'OCCUPIED' | 'CLOSED';

// A table's floor status is derived live from its own reservations, never
// stored — "active" (below) is the only manual override, for the one
// state (out of service) that has no reservation to derive from.
const RESERVED_LOOKAHEAD_MS = 3 * 60 * 60 * 1000;

function computeLiveStatus(table: { active: boolean }, tableReservations: { status: string; reservationAt: Date; durationMinutes: number }[], now: Date): TableLiveStatus {
  if (!table.active) return 'CLOSED';
  const isOccupiedNow = tableReservations.some((r) => {
    if (r.status !== 'SEATED') return false;
    const start = r.reservationAt;
    const end = new Date(start.getTime() + r.durationMinutes * 60_000);
    return start <= now && now < end;
  });
  if (isOccupiedNow) return 'OCCUPIED';

  const soon = new Date(now.getTime() + RESERVED_LOOKAHEAD_MS);
  const isReservedSoon = tableReservations.some((r) => (
    (r.status === 'PENDING' || r.status === 'CONFIRMED') && r.reservationAt >= now && r.reservationAt <= soon
  ));
  if (isReservedSoon) return 'RESERVED';

  return 'AVAILABLE';
}

export async function listTablesWithStatus(ownerId: string, siteId: string) {
  await assertSiteOwned(ownerId, siteId);
  const now = new Date();
  const dayStart = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const dayEnd = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const [tables, reservations] = await Promise.all([
    prisma.table.findMany({ where: { siteId }, orderBy: { name: 'asc' } }),
    prisma.reservation.findMany({
      where: { siteId, tableId: { not: null }, status: { notIn: ['CANCELLED', 'COMPLETED'] }, reservationAt: { gte: dayStart, lte: dayEnd } },
      select: { tableId: true, status: true, reservationAt: true, durationMinutes: true },
    }),
  ]);

  const byTable = new Map<string, typeof reservations>();
  for (const r of reservations) {
    if (!r.tableId) continue;
    if (!byTable.has(r.tableId)) byTable.set(r.tableId, []);
    byTable.get(r.tableId)!.push(r);
  }

  return tables.map((t) => ({ ...t, liveStatus: computeLiveStatus(t, byTable.get(t.id) ?? [], now) }));
}

export async function getOccupancy(ownerId: string, siteId: string) {
  const tables = await listTablesWithStatus(ownerId, siteId);
  const occupied = tables.filter((t) => t.liveStatus === 'OCCUPIED').length;
  const reserved = tables.filter((t) => t.liveStatus === 'RESERVED').length;
  const closed = tables.filter((t) => t.liveStatus === 'CLOSED').length;
  const available = tables.filter((t) => t.liveStatus === 'AVAILABLE').length;
  const inRotation = tables.length - closed;

  const now = new Date();
  const todayEnd = new Date(now);
  todayEnd.setHours(23, 59, 59, 999);
  const upcomingReservations = await prisma.reservation.count({
    where: { siteId, status: { in: ['PENDING', 'CONFIRMED'] }, reservationAt: { gte: now, lte: todayEnd } },
  });

  return {
    totalTables: tables.length,
    occupied,
    reserved,
    available,
    closed,
    occupancyRate: inRotation > 0 ? Math.round((occupied / inRotation) * 100) : 0,
    upcomingReservations,
  };
}

// Smallest-capacity-that-fits is the right default — it leaves larger
// tables free for larger parties rather than burning a 6-top on a couple.
export async function suggestTable(ownerId: string, siteId: string, partySize: number, reservationAt: Date) {
  await assertSiteOwned(ownerId, siteId);
  const durationMinutes = 90;
  const end = new Date(reservationAt.getTime() + durationMinutes * 60_000);

  const candidates = await prisma.table.findMany({
    where: { siteId, active: true, capacity: { gte: partySize } },
    orderBy: { capacity: 'asc' },
  });

  for (const table of candidates) {
    if (await isTableFree(siteId, table.id, reservationAt, end)) {
      return table;
    }
  }
  return null;
}
