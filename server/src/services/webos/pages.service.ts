import { prisma } from '../../lib/prisma.js';
import { CommerceError } from '../../lib/commerceError.js';

type Section = { type: string; heading: string; body: string; imageUrl?: string | null };

type UpdatePageInput = Partial<{
  heroHeadline: string;
  heroSubheadline: string;
  ctaLabel: string;
  ctaHref: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  hasLeadForm: boolean;
  sections: Section[];
}>;

async function assertPageOwned(ownerId: string, pageId: string) {
  const page = await prisma.page.findFirst({ where: { id: pageId, site: { ownerId } } });
  if (!page) throw new CommerceError(404, 'Page not found.');
  return page;
}

export async function getPage(ownerId: string, pageId: string) {
  return assertPageOwned(ownerId, pageId);
}

export async function updatePage(ownerId: string, pageId: string, data: UpdatePageInput) {
  await assertPageOwned(ownerId, pageId);
  return prisma.page.update({ where: { id: pageId }, data });
}

export async function setPageHeroImage(ownerId: string, pageId: string, heroImageUrl: string) {
  await assertPageOwned(ownerId, pageId);
  return prisma.page.update({ where: { id: pageId }, data: { heroImageUrl } });
}

export async function setSectionImage(ownerId: string, pageId: string, index: number, imageUrl: string) {
  const page = await assertPageOwned(ownerId, pageId);
  const sections = (Array.isArray(page.sections) ? page.sections : []) as Section[];
  if (index < 0 || index >= sections.length) throw new CommerceError(404, 'Section not found.');
  const updated = sections.map((s, i) => (i === index ? { ...s, imageUrl } : s));
  return prisma.page.update({ where: { id: pageId }, data: { sections: updated } });
}
