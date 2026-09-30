import { prisma } from '../../lib/prisma.js';
import { CommerceError } from '../../lib/commerceError.js';

async function assertSiteOwned(ownerId: string, siteId: string) {
  const site = await prisma.site.findFirst({ where: { id: siteId, ownerId } });
  if (!site) throw new CommerceError(404, 'Site not found.');
}

// Unauthenticated: fired once per page load from the public site renderer.
// Silently no-ops on an unknown siteId rather than erroring — a stray beacon
// should never surface a visible failure to a real visitor.
export async function recordView(siteId: string, pageSlug: string) {
  const site = await prisma.site.findUnique({ where: { id: siteId }, select: { id: true } });
  if (!site) return;
  await prisma.pageView.create({ data: { siteId, pageSlug } });
}

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export async function getViewStats(ownerId: string, siteId: string) {
  await assertSiteOwned(ownerId, siteId);
  const since = new Date(Date.now() - THIRTY_DAYS_MS);

  const [total, last30Days, grouped] = await Promise.all([
    prisma.pageView.count({ where: { siteId } }),
    prisma.pageView.count({ where: { siteId, createdAt: { gte: since } } }),
    prisma.pageView.groupBy({
      by: ['pageSlug'],
      where: { siteId, createdAt: { gte: since } },
      _count: { pageSlug: true },
      orderBy: { _count: { pageSlug: 'desc' } },
      take: 5,
    }),
  ]);

  return {
    total,
    last30Days,
    topPages: grouped.map((g) => ({ slug: g.pageSlug, views: g._count.pageSlug })),
  };
}
