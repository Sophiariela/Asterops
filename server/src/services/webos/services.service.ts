import { prisma } from '../../lib/prisma.js';
import { CommerceError } from '../../lib/commerceError.js';

async function assertSiteOwned(ownerId: string, siteId: string) {
  const site = await prisma.site.findFirst({ where: { id: siteId, ownerId } });
  if (!site) throw new CommerceError(404, 'Site not found.');
}

// The bookable-offering catalog for Salon/Education/Professional
// Services/Fitness sites — deliberately separate from MenuItem (see
// schema.prisma) so the restaurant vertical is never touched by this.

export async function listServices(ownerId: string, siteId: string) {
  await assertSiteOwned(ownerId, siteId);
  return prisma.service.findMany({ where: { siteId }, orderBy: { order: 'asc' } });
}

export async function listPublicServices(siteId: string) {
  return prisma.service.findMany({ where: { siteId, active: true }, orderBy: { order: 'asc' } });
}

export async function createService(
  ownerId: string,
  siteId: string,
  data: { name: string; description?: string; priceCents?: number; durationMinutes?: number; active?: boolean },
) {
  await assertSiteOwned(ownerId, siteId);
  const count = await prisma.service.count({ where: { siteId } });
  return prisma.service.create({ data: { siteId, order: count, ...data } });
}

export async function updateService(
  ownerId: string,
  siteId: string,
  id: string,
  data: Partial<{ name: string; description: string | null; priceCents: number | null; durationMinutes: number | null; active: boolean; order: number }>,
) {
  await assertSiteOwned(ownerId, siteId);
  const existing = await prisma.service.findFirst({ where: { id, siteId } });
  if (!existing) throw new CommerceError(404, 'Service not found.');
  return prisma.service.update({ where: { id }, data });
}

export async function deleteService(ownerId: string, siteId: string, id: string) {
  await assertSiteOwned(ownerId, siteId);
  const existing = await prisma.service.findFirst({ where: { id, siteId } });
  if (!existing) throw new CommerceError(404, 'Service not found.');
  await prisma.service.delete({ where: { id } });
}
