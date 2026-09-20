import type { ReservationStatus } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import { CommerceError } from '../../lib/commerceError.js';

async function assertSiteOwned(ownerId: string, siteId: string) {
  const site = await prisma.site.findFirst({ where: { id: siteId, ownerId } });
  if (!site) throw new CommerceError(404, 'Site not found.');
}

export async function listReservations(ownerId: string, siteId: string, status?: ReservationStatus) {
  await assertSiteOwned(ownerId, siteId);
  return prisma.reservation.findMany({
    where: { siteId, ...(status ? { status } : {}) },
    orderBy: { reservationAt: 'asc' },
    include: { table: { select: { id: true, name: true } } },
  });
}

// Mirrors leads.service's submitPublicLead: unauthenticated because it's
// meant to be called from a visitor-facing reservation form. No such form
// is publicly served anywhere yet (WebOS has no live hosting), so this is
// real infrastructure ahead of a live caller, exactly like public leads.
export async function submitPublicReservation(data: {
  siteId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  partySize: number;
  reservationAt: string;
  notes?: string;
}) {
  const site = await prisma.site.findUnique({ where: { id: data.siteId } });
  if (!site) throw new CommerceError(404, 'Site not found.');
  const reservationAt = new Date(data.reservationAt);
  if (Number.isNaN(reservationAt.getTime())) throw new CommerceError(400, 'Invalid reservation date/time.');
  if (reservationAt.getTime() < Date.now()) throw new CommerceError(400, 'Reservation time must be in the future.');

  return prisma.reservation.create({
    data: {
      siteId: data.siteId,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      partySize: data.partySize,
      reservationAt,
      notes: data.notes,
    },
  });
}

// Authenticated equivalent — the owner logging a reservation taken by
// phone or walk-in, same distinction leads.service draws for createLead.
export async function createReservation(
  ownerId: string,
  siteId: string,
  data: { customerName: string; customerEmail: string; customerPhone?: string; partySize: number; reservationAt: string; notes?: string },
) {
  await assertSiteOwned(ownerId, siteId);
  const reservationAt = new Date(data.reservationAt);
  if (Number.isNaN(reservationAt.getTime())) throw new CommerceError(400, 'Invalid reservation date/time.');
  return prisma.reservation.create({ data: { siteId, ...data, reservationAt } });
}

export async function updateReservationStatus(ownerId: string, siteId: string, id: string, status: ReservationStatus) {
  await assertSiteOwned(ownerId, siteId);
  const existing = await prisma.reservation.findFirst({ where: { id, siteId } });
  if (!existing) throw new CommerceError(404, 'Reservation not found.');
  return prisma.reservation.update({ where: { id }, data: { status } });
}

// A table can only be double-booked if two non-cancelled reservations at
// that table overlap in time — checked here rather than left for the
// owner to notice by eye in the dashboard.
export async function assignTable(ownerId: string, siteId: string, id: string, tableId: string | null) {
  await assertSiteOwned(ownerId, siteId);
  const reservation = await prisma.reservation.findFirst({ where: { id, siteId } });
  if (!reservation) throw new CommerceError(404, 'Reservation not found.');

  if (tableId) {
    const table = await prisma.table.findFirst({ where: { id: tableId, siteId } });
    if (!table) throw new CommerceError(404, 'Table not found.');

    const start = reservation.reservationAt;
    const end = new Date(start.getTime() + reservation.durationMinutes * 60_000);

    const conflicting = await prisma.reservation.findMany({
      where: { siteId, tableId, status: { not: 'CANCELLED' }, id: { not: id } },
    });
    const overlaps = conflicting.some((r) => {
      const rStart = r.reservationAt;
      const rEnd = new Date(rStart.getTime() + r.durationMinutes * 60_000);
      return start < rEnd && rStart < end;
    });
    if (overlaps) throw new CommerceError(409, 'That table is already booked for an overlapping time.');
  }

  return prisma.reservation.update({ where: { id }, data: { tableId } });
}

export async function listTables(ownerId: string, siteId: string) {
  await assertSiteOwned(ownerId, siteId);
  return prisma.table.findMany({ where: { siteId }, orderBy: { name: 'asc' } });
}

export async function createTable(ownerId: string, siteId: string, data: { name: string; capacity: number }) {
  await assertSiteOwned(ownerId, siteId);
  return prisma.table.create({ data: { siteId, ...data } });
}

export async function deleteTable(ownerId: string, siteId: string, id: string) {
  await assertSiteOwned(ownerId, siteId);
  const existing = await prisma.table.findFirst({ where: { id, siteId } });
  if (!existing) throw new CommerceError(404, 'Table not found.');
  await prisma.table.delete({ where: { id } });
}
