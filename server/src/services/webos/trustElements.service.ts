import type { TrustElementType } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import { CommerceError } from '../../lib/commerceError.js';

async function assertSiteOwned(ownerId: string, siteId: string) {
  const site = await prisma.site.findFirst({ where: { id: siteId, ownerId } });
  if (!site) throw new CommerceError(404, 'Site not found.');
}

export async function listTrustElements(ownerId: string, siteId: string) {
  await assertSiteOwned(ownerId, siteId);
  return prisma.trustElement.findMany({ where: { siteId }, orderBy: { createdAt: 'desc' } });
}

export async function createTrustElement(
  ownerId: string,
  siteId: string,
  data: { type: TrustElementType; title: string; description?: string; url?: string },
) {
  await assertSiteOwned(ownerId, siteId);
  return prisma.trustElement.create({ data: { siteId, ...data } });
}

export async function deleteTrustElement(ownerId: string, siteId: string, id: string) {
  await assertSiteOwned(ownerId, siteId);
  const existing = await prisma.trustElement.findFirst({ where: { id, siteId } });
  if (!existing) throw new CommerceError(404, 'Trust element not found.');
  await prisma.trustElement.delete({ where: { id } });
}
