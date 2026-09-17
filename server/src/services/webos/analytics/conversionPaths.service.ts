import { loadSiteForAnalysis } from './shared.js';

export type ConversionPath = { fromPage: string; toPage: string; ctaLabel: string };
export type DirectCapturePoint = { page: string; ctaLabel: string };
export type LeadFunnelStage = { status: string; count: number };

export type ConversionPathsResult = {
  paths: ConversionPath[];
  directCapturePoints: DirectCapturePoint[];
  funnel: LeadFunnelStage[];
};

// "Visitor" and "Landing Page" aren't included as funnel stages here —
// there's no traffic data behind them (no live public hosting yet). What
// IS real: which pages route to which lead-capture page via their CTA
// (set at generation time), and the actual Lead.status funnel for this
// site's real leads.
export async function getConversionPaths(ownerId: string, siteId: string): Promise<ConversionPathsResult> {
  const site = await loadSiteForAnalysis(ownerId, siteId);
  const bySlug = new Map(site.pages.map((p) => [p.slug, p]));

  const paths: ConversionPath[] = [];
  const directCapturePoints: DirectCapturePoint[] = [];

  for (const p of site.pages) {
    if (p.hasLeadForm) {
      directCapturePoints.push({ page: p.name, ctaLabel: p.ctaLabel });
      continue;
    }
    if (p.ctaHref) {
      const targetSlug = p.ctaHref.replace(/^\//, '');
      const target = bySlug.get(targetSlug);
      if (target) paths.push({ fromPage: p.name, toPage: target.name, ctaLabel: p.ctaLabel });
    }
  }

  const statuses = ['NEW', 'QUALIFIED', 'CONVERTED', 'LOST'];
  const funnel = statuses.map((status) => ({
    status,
    count: site.leads.filter((l) => l.status === status).length,
  }));

  return { paths, directCapturePoints, funnel };
}
