import type { ReservationStatus, Site } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import { CommerceError } from '../../lib/commerceError.js';
import { sendEmail } from '../../lib/mailer.js';
import { reservationConfirmationEmail, reservationNotificationEmail } from '../../lib/emailTemplates.js';
import { sendSms, smsConfigured } from '../../lib/sms.js';
import { sendWhatsAppMessage, whatsappConfigured } from '../../lib/whatsapp.js';
import { createCalendarEvent, updateCalendarEvent, deleteCalendarEvent } from '../../lib/googleCalendar.js';
import { isTableFree } from './tables.service.js';

async function assertSiteOwned(ownerId: string, siteId: string) {
  const site = await prisma.site.findFirst({ where: { id: siteId, ownerId } });
  if (!site) throw new CommerceError(404, 'Site not found.');
}

function formatWhen(at: Date, timezone: string | null): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
    timeZone: timezone ?? 'UTC',
  }).format(at);
}

// "HH:mm" in the site's own timezone, not UTC — openingTime/closingTime
// are stored the same way, since that's how an owner set them.
function timeOfDayIn(at: Date, timezone: string | null): string {
  const parts = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: timezone ?? 'UTC' }).formatToParts(at);
  const hour = parts.find((p) => p.type === 'hour')?.value ?? '00';
  const minute = parts.find((p) => p.type === 'minute')?.value ?? '00';
  return `${hour}:${minute}`;
}

// Enforces the restaurant's own party-size cap and opening/closing hours
// (both optional — unset means unrestricted). Hours that wrap past
// midnight (closingTime < openingTime, e.g. 18:00-01:00) are supported.
function assertWithinRestaurantRules(site: Pick<Site, 'maxPartySize' | 'openingTime' | 'closingTime' | 'timezone'>, partySize: number, reservationAt: Date) {
  if (site.maxPartySize && partySize > site.maxPartySize) {
    throw new CommerceError(400, `Parties larger than ${site.maxPartySize} aren't supported online. Please call us.`);
  }
  if (site.openingTime && site.closingTime) {
    const time = timeOfDayIn(reservationAt, site.timezone);
    const wrapsMidnight = site.closingTime < site.openingTime;
    const withinHours = wrapsMidnight
      ? time >= site.openingTime || time <= site.closingTime
      : time >= site.openingTime && time <= site.closingTime;
    if (!withinHours) {
      throw new CommerceError(400, `We're open ${site.openingTime}–${site.closingTime}. Please pick a time in that window.`);
    }
  }
}

// Fires every side-effect a brand-new reservation should have: notify the
// business (email + WhatsApp, WhatsApp gated to premium sites), confirm to
// the guest (email + SMS, SMS gated to premium), and create the calendar
// event if Google Calendar is connected. Shared by both the public and
// owner-entered creation paths so a phoned-in booking gets the same guest
// confirmation a self-serve one does.
async function fireReservationCreatedSideEffects(
  site: Site & { owner: { email: string } },
  reservation: { id: string; customerName: string; customerEmail: string; customerPhone: string | null; partySize: number; reservationAt: Date; notes: string | null },
) {
  const whenLabel = formatWhen(reservation.reservationAt, site.timezone);

  const businessTo = site.reservationEmail ?? site.owner.email;
  await sendEmail({
    to: businessTo,
    subject: `New reservation: ${reservation.customerName} (${reservation.partySize})`,
    html: reservationNotificationEmail(site.businessName, {
      customerName: reservation.customerName, customerEmail: reservation.customerEmail, customerPhone: reservation.customerPhone,
      partySize: reservation.partySize, whenLabel, notes: reservation.notes,
    }),
  });

  await sendEmail({
    to: reservation.customerEmail,
    subject: 'Reservation Confirmed',
    html: reservationConfirmationEmail(site.businessName, { partySize: reservation.partySize, whenLabel }),
  });

  if (site.premiumEnabled) {
    if (whatsappConfigured && site.whatsappNumber) {
      await sendWhatsAppMessage(
        site.whatsappNumber,
        `New Reservation\n\n${reservation.customerName}\n${reservation.partySize} guests\n${whenLabel}`,
      );
    }
    if (smsConfigured && reservation.customerPhone) {
      await sendSms(reservation.customerPhone, `${site.businessName}: your reservation for ${reservation.partySize} on ${whenLabel} is confirmed.`);
    }
  }

  if (site.googleCalendarConnected && site.googleCalendarRefreshToken) {
    const durationMinutes = 90;
    const end = new Date(reservation.reservationAt.getTime() + durationMinutes * 60_000);
    const eventId = await createCalendarEvent(site.googleCalendarRefreshToken, site.googleCalendarId ?? 'primary', {
      summary: `${reservation.customerName} (${reservation.partySize})`,
      description: reservation.notes ?? undefined,
      startIso: reservation.reservationAt.toISOString(),
      endIso: end.toISOString(),
    });
    if (eventId) {
      await prisma.reservation.update({ where: { id: reservation.id }, data: { googleEventId: eventId } });
    }
  }
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
// meant to be called from a visitor-facing reservation form.
export async function submitPublicReservation(data: {
  siteId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  partySize: number;
  reservationAt: string;
  notes?: string;
}) {
  const site = await prisma.site.findUnique({ where: { id: data.siteId }, include: { owner: { select: { email: true } } } });
  if (!site) throw new CommerceError(404, 'Site not found.');
  const reservationAt = new Date(data.reservationAt);
  if (Number.isNaN(reservationAt.getTime())) throw new CommerceError(400, 'Invalid reservation date/time.');
  if (reservationAt.getTime() < Date.now()) throw new CommerceError(400, 'Reservation time must be in the future.');
  assertWithinRestaurantRules(site, data.partySize, reservationAt);

  const reservation = await prisma.reservation.create({
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

  await fireReservationCreatedSideEffects(site, { ...reservation, customerPhone: reservation.customerPhone ?? null, notes: reservation.notes ?? null });
  return reservation;
}

// Authenticated equivalent — the owner logging a reservation taken by
// phone or walk-in, same distinction leads.service draws for createLead.
// Still fires the guest-facing confirmation (email/SMS): a phoned-in
// booking's guest wants that just as much as a self-serve one's does.
export async function createReservation(
  ownerId: string,
  siteId: string,
  data: { customerName: string; customerEmail: string; customerPhone?: string; partySize: number; reservationAt: string; notes?: string },
) {
  await assertSiteOwned(ownerId, siteId);
  const site = await prisma.site.findUniqueOrThrow({ where: { id: siteId }, include: { owner: { select: { email: true } } } });
  const reservationAt = new Date(data.reservationAt);
  if (Number.isNaN(reservationAt.getTime())) throw new CommerceError(400, 'Invalid reservation date/time.');
  const reservation = await prisma.reservation.create({ data: { siteId, ...data, reservationAt } });

  await fireReservationCreatedSideEffects(site, { ...reservation, customerPhone: reservation.customerPhone ?? null, notes: reservation.notes ?? null });
  return reservation;
}

export async function updateReservationStatus(ownerId: string, siteId: string, id: string, status: ReservationStatus) {
  await assertSiteOwned(ownerId, siteId);
  const site = await prisma.site.findUniqueOrThrow({ where: { id: siteId } });
  const existing = await prisma.reservation.findFirst({ where: { id, siteId } });
  if (!existing) throw new CommerceError(404, 'Reservation not found.');
  const updated = await prisma.reservation.update({ where: { id }, data: { status } });

  if (status === 'CANCELLED') {
    if (site.premiumEnabled && smsConfigured && existing.customerPhone) {
      const whenLabel = formatWhen(existing.reservationAt, site.timezone);
      await sendSms(existing.customerPhone, `${site.businessName}: your reservation for ${whenLabel} has been cancelled.`);
    }
    if (site.googleCalendarConnected && site.googleCalendarRefreshToken && existing.googleEventId) {
      await deleteCalendarEvent(site.googleCalendarRefreshToken, site.googleCalendarId ?? 'primary', existing.googleEventId);
    }
  } else if (site.googleCalendarConnected && site.googleCalendarRefreshToken && existing.googleEventId) {
    const durationMinutes = 90;
    const end = new Date(existing.reservationAt.getTime() + durationMinutes * 60_000);
    await updateCalendarEvent(site.googleCalendarRefreshToken, site.googleCalendarId ?? 'primary', existing.googleEventId, {
      summary: `${existing.customerName} (${existing.partySize}), ${status}`,
      startIso: existing.reservationAt.toISOString(),
      endIso: end.toISOString(),
    });
  }

  return updated;
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
    const free = await isTableFree(siteId, tableId, start, end, id);
    if (!free) throw new CommerceError(409, 'That table is already booked for an overlapping time.');
  }

  return prisma.reservation.update({ where: { id }, data: { tableId } });
}
