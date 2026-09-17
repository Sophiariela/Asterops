import { prisma } from '../../lib/prisma.js';
import { CommerceError } from '../../lib/commerceError.js';

type UpdatePageInput = Partial<{
  heroHeadline: string;
  heroSubheadline: string;
  ctaLabel: string;
  ctaHref: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  hasLeadForm: boolean;
  sections: { type: string; heading: string; body: string }[];
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
