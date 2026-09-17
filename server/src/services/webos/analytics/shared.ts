import { prisma } from '../../../lib/prisma.js';
import { CommerceError } from '../../../lib/commerceError.js';

export type PageForAnalysis = {
  id: string;
  name: string;
  heroHeadline: string;
  heroSubheadline: string;
  ctaLabel: string;
  seoTitle: string | null;
  seoDescription: string | null;
  hasLeadForm: boolean;
};

export async function loadSiteForAnalysis(ownerId: string, siteId: string) {
  const site = await prisma.site.findFirst({
    where: { id: siteId, ownerId },
    include: {
      pages: { orderBy: { order: 'asc' } },
      testimonials: true,
      trustElements: true,
      leads: { select: { id: true, status: true } },
    },
  });
  if (!site) throw new CommerceError(404, 'Site not found.');
  return site;
}

// A minimum-viable bar, not a scientific benchmark — 3 is the number the
// brief itself recommends ("add 3 testimonials").
export const TESTIMONIAL_TARGET = 3;

export function trustScore(testimonialCount: number): number {
  if (testimonialCount >= TESTIMONIAL_TARGET) return 100;
  if (testimonialCount === 0) return 0;
  return Math.round((testimonialCount / TESTIMONIAL_TARGET) * 100);
}

const WEAK_HEADLINE_LENGTH = 15;

export function isWeakHeadline(headline: string): boolean {
  return headline.trim().length < WEAK_HEADLINE_LENGTH;
}

export function seoCompleteness(pages: PageForAnalysis[]): { complete: number; total: number } {
  const complete = pages.filter((p) => p.seoTitle && p.seoDescription).length;
  return { complete, total: pages.length };
}
