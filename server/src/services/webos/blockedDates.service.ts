import { prisma } from '../../lib/prisma.js';
import { CommerceError } from '../../lib/commerceError.js';

async function assertSiteOwned(ownerId: string, siteId: string) {
  const site = await prisma.site.findFirst({ where: { id: siteId, ownerId } });
  if (!site) throw new CommerceError(404, 'Site not found.');
}

export async function listBlockedDates(ownerId: string, siteId: string) {
  await assertSiteOwned(ownerId, siteId);
  return prisma.blockedDate.findMany({ where: { siteId }, orderBy: { date: 'asc' } });
}

export async function createBlockedDate(ownerId: string, siteId: string, data: { date: string; reason?: string }) {
  await assertSiteOwned(ownerId, siteId);
  const date = new Date(`${data.date}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) throw new CommerceError(400, 'Invalid date.');
  const existing = await prisma.blockedDate.findFirst({ where: { siteId, date } });
  if (existing) return existing;
  return prisma.blockedDate.create({ data: { siteId, date, reason: data.reason } });
}

export async function deleteBlockedDate(ownerId: string, siteId: string, id: string) {
  await assertSiteOwned(ownerId, siteId);
  const existing = await prisma.blockedDate.findFirst({ where: { id, siteId } });
  if (!existing) throw new CommerceError(404, 'Blocked date not found.');
  await prisma.blockedDate.delete({ where: { id } });
}
