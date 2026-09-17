import { loadSiteForAnalysis } from './shared.js';

export type LeadCapturePoint = { page: string; ctaLabel: string; type: 'direct' | 'routed' };

export type LeadCaptureMap = {
  points: LeadCapturePoint[];
  coverage: number; // % of pages that either capture a lead directly or route to a page that does
};

export async function getLeadCaptureMap(ownerId: string, siteId: string): Promise<LeadCaptureMap> {
  const site = await loadSiteForAnalysis(ownerId, siteId);
  const bySlug = new Map(site.pages.map((p) => [p.slug, p]));

  const points: LeadCapturePoint[] = [];
  let coveredCount = 0;

  for (const p of site.pages) {
    if (p.hasLeadForm) {
      points.push({ page: p.name, ctaLabel: p.ctaLabel, type: 'direct' });
      coveredCount += 1;
      continue;
    }
    if (p.ctaHref) {
      const targetSlug = p.ctaHref.replace(/^\//, '');
      const target = bySlug.get(targetSlug);
      if (target?.hasLeadForm) {
        points.push({ page: p.name, ctaLabel: p.ctaLabel, type: 'routed' });
        coveredCount += 1;
      }
    }
  }

  const coverage = site.pages.length ? Math.round((coveredCount / site.pages.length) * 100) : 0;
  return { points, coverage };
}
