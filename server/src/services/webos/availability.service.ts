import type { Site } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import { CommerceError } from '../../lib/commerceError.js';
import { dayOfWeekInTz, localDateStringInTz, timeOfDayInTz, zonedTimeToUtc } from '../../lib/zonedTime.js';

// The real double-booking guard for every non-RESTAURANT bookable site
// (consultant, professional services, salon, education, fitness): working
// days + business hours + blocked dates + a per-site appointment capacity
// (how many simultaneous bookings the business can actually take — 1 for
// a solo consultant, more for a salon with several chairs). Table
// reservations (RESTAURANT) are deliberately out of scope here — those
// keep their own table-assignment system in tables.service.ts.
export type AvailabilitySite = Pick<
  Site,
  'id' | 'timezone' | 'workingDays' | 'openingTime' | 'closingTime' | 'appointmentDurationMinutes' | 'appointmentBufferMinutes' | 'appointmentCapacity'
>;

const DEFAULT_OPENING = '09:00';
const DEFAULT_CLOSING = '17:00';
const MAX_DAYS_AHEAD = 60;

function minutesOf(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}
function toHHMM(mins: number): string {
  const h = Math.floor(mins / 60).toString().padStart(2, '0');
  const m = (mins % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
}

async function isBlockedDate(siteId: string, dateStr: string): Promise<boolean> {
  const blocked = await prisma.blockedDate.findFirst({ where: { siteId, date: new Date(`${dateStr}T00:00:00.000Z`) } });
  return !!blocked;
}

// Unauthenticated: backs the visitor-facing booking form's slot picker.
export async function getPublicAvailableSlots(siteId: string, dateStr: string, serviceId?: string) {
  const site = await prisma.site.findUnique({ where: { id: siteId } });
  if (!site) throw new CommerceError(404, 'Site not found.');
  let durationMinutes: number | undefined;
  if (serviceId) {
    const service = await prisma.service.findFirst({ where: { id: serviceId, siteId, active: true } });
    if (!service) throw new CommerceError(404, 'Service not found.');
    durationMinutes = service.durationMinutes ?? undefined;
  }
  return getAvailableSlots(site, dateStr, durationMinutes);
}

// Candidate "HH:mm" local start times still bookable on `dateStr` — used
// to render real, pickable slots on the public booking form (never a
// blind date/time input). `durationMinutes`, when given, is a specific
// Service's own duration overriding the site default.
export async function getAvailableSlots(site: AvailabilitySite, dateStr: string, durationMinutes?: number): Promise<{ slots: string[]; durationMinutes: number }> {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) throw new CommerceError(400, 'Invalid date.');
  const timezone = site.timezone ?? 'UTC';
  const duration = durationMinutes && durationMinutes > 0 ? durationMinutes : site.appointmentDurationMinutes;
  const buffer = site.appointmentBufferMinutes;

  const requestedDay = zonedTimeToUtc(dateStr, '00:00', timezone);
  const today = new Date();
  const maxDay = new Date(today.getTime() + MAX_DAYS_AHEAD * 24 * 60 * 60 * 1000);
  if (requestedDay.getTime() > maxDay.getTime()) return { slots: [], durationMinutes: duration };

  const dow = dayOfWeekInTz(requestedDay, timezone);
  if (!site.workingDays.includes(dow)) return { slots: [], durationMinutes: duration };
  if (await isBlockedDate(site.id, dateStr)) return { slots: [], durationMinutes: duration };

  const opening = site.openingTime ?? DEFAULT_OPENING;
  const closing = site.closingTime ?? DEFAULT_CLOSING;
  const openMin = minutesOf(opening);
  const closeMin = minutesOf(closing);
  if (closeMin <= openMin) return { slots: [], durationMinutes: duration };

  const dayStartUtc = zonedTimeToUtc(dateStr, '00:00', timezone);
  const dayEndUtc = new Date(dayStartUtc.getTime() + 24 * 60 * 60 * 1000);
  const existing = await prisma.reservation.findMany({
    where: { siteId: site.id, status: { not: 'CANCELLED' }, reservationAt: { gte: dayStartUtc, lt: dayEndUtc } },
    select: { reservationAt: true, durationMinutes: true },
  });

  const now = Date.now();
  const slots: string[] = [];
  for (let start = openMin; start + duration <= closeMin; start += duration) {
    const slotStartUtc = zonedTimeToUtc(dateStr, toHHMM(start), timezone);
    if (slotStartUtc.getTime() <= now) continue;
    const slotEndUtc = new Date(slotStartUtc.getTime() + (duration + buffer) * 60_000);
    const overlapping = existing.filter((r) => {
      const rStart = r.reservationAt.getTime();
      const rEnd = rStart + r.durationMinutes * 60_000;
      return slotStartUtc.getTime() < rEnd && rStart < slotEndUtc.getTime();
    }).length;
    if (overlapping < site.appointmentCapacity) slots.push(toHHMM(start));
  }
  return { slots, durationMinutes: duration };
}

// Re-validated server-side at submission time — the client's slot list can
// always be stale by the time a visitor actually submits, so this (not the
// list above) is the real guard against double-booking.
export async function assertSlotAvailable(
  site: AvailabilitySite,
  reservationAt: Date,
  durationMinutes: number,
  excludeReservationId?: string,
): Promise<void> {
  if (Number.isNaN(reservationAt.getTime())) throw new CommerceError(400, 'Invalid date/time.');
  if (reservationAt.getTime() <= Date.now()) throw new CommerceError(400, 'Appointment time must be in the future.');

  const timezone = site.timezone ?? 'UTC';
  const dow = dayOfWeekInTz(reservationAt, timezone);
  if (!site.workingDays.includes(dow)) throw new CommerceError(400, "We're closed that day. Please pick another date.");

  const time = timeOfDayInTz(reservationAt, timezone);
  const opening = site.openingTime ?? DEFAULT_OPENING;
  const closing = site.closingTime ?? DEFAULT_CLOSING;
  if (time < opening || time >= closing) {
    throw new CommerceError(400, `We're open ${opening}–${closing}. Please pick a time in that window.`);
  }

  const dateStr = localDateStringInTz(reservationAt, timezone);
  if (await isBlockedDate(site.id, dateStr)) {
    throw new CommerceError(400, "We're closed that day. Please pick another date.");
  }

  // Scan a day on either side of the appointment — enough to catch any
  // overlap regardless of how long the existing bookings run.
  const dayStart = new Date(reservationAt);
  dayStart.setUTCHours(0, 0, 0, 0);
  const scanStart = new Date(dayStart.getTime() - 24 * 60 * 60 * 1000);
  const scanEnd = new Date(dayStart.getTime() + 2 * 24 * 60 * 60 * 1000);
  const existing = await prisma.reservation.findMany({
    where: {
      siteId: site.id,
      status: { not: 'CANCELLED' },
      reservationAt: { gte: scanStart, lt: scanEnd },
      ...(excludeReservationId ? { id: { not: excludeReservationId } } : {}),
    },
    select: { reservationAt: true, durationMinutes: true },
  });

  const buffer = site.appointmentBufferMinutes;
  const slotEnd = new Date(reservationAt.getTime() + (durationMinutes + buffer) * 60_000);
  const overlapping = existing.filter((r) => {
    const rStart = r.reservationAt.getTime();
    const rEnd = rStart + r.durationMinutes * 60_000;
    return reservationAt.getTime() < rEnd && rStart < slotEnd.getTime();
  }).length;

  if (overlapping >= site.appointmentCapacity) {
    throw new CommerceError(409, 'That time is no longer available. Please pick another time.');
  }
}
