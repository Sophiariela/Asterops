import { prisma } from '../../lib/prisma.js';
import { CommerceError } from '../../lib/commerceError.js';

async function assertSiteOwned(ownerId: string, siteId: string) {
  const site = await prisma.site.findFirst({ where: { id: siteId, ownerId } });
  if (!site) throw new CommerceError(404, 'Site not found.');
}

export async function listTestimonials(ownerId: string, siteId: string) {
  await assertSiteOwned(ownerId, siteId);
  return prisma.testimonial.findMany({ where: { siteId }, orderBy: { createdAt: 'desc' } });
}

export async function createTestimonial(
  ownerId: string,
  siteId: string,
  data: { authorName: string; authorRole?: string; quote: string; rating?: number },
) {
  await assertSiteOwned(ownerId, siteId);
  return prisma.testimonial.create({ data: { siteId, ...data } });
}

export async function deleteTestimonial(ownerId: string, siteId: string, testimonialId: string) {
  await assertSiteOwned(ownerId, siteId);
  const existing = await prisma.testimonial.findFirst({ where: { id: testimonialId, siteId } });
  if (!existing) throw new CommerceError(404, 'Testimonial not found.');
  await prisma.testimonial.delete({ where: { id: testimonialId } });
}
