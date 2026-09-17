import { loadSiteForAnalysis, isWeakHeadline, seoCompleteness } from './shared.js';
import { getTrustGaps } from './trustEngine.service.js';
import { runConversionAudit } from './conversionAudit.service.js';

export type ReadinessCheck = { label: string; passed: boolean };
export type DeploymentReadiness = {
  readiness: number;
  checks: ReadinessCheck[];
  missing: string[];
  tasksRemaining: number;
};

const CONVERSION_SCORE_BAR = 70;

// A launch checklist, not a new scoring engine — every check reuses the
// same real signals Health Score, Trust Engine and Conversion Audit
// already compute, just reframed as pass/fail launch gates.
export async function getDeploymentReadiness(ownerId: string, siteId: string): Promise<DeploymentReadiness> {
  const [site, trust, audit] = await Promise.all([
    loadSiteForAnalysis(ownerId, siteId),
    getTrustGaps(ownerId, siteId),
    runConversionAudit(ownerId, siteId),
  ]);

  const seo = seoCompleteness(site.pages);
  const hasLeadCapture = site.pages.some((p) => p.hasLeadForm);
  const noWeakHeadlines = site.pages.every((p) => !isWeakHeadline(p.heroHeadline));

  const checks: ReadinessCheck[] = [
    { label: 'Testimonials', passed: !trust.hasGap },
    { label: 'SEO metadata on every page', passed: seo.complete === seo.total && seo.total > 0 },
    { label: 'Lead capture form', passed: hasLeadCapture },
    { label: 'Clear headlines on every page', passed: noWeakHeadlines },
    { label: 'Conversion audit passing', passed: audit.score >= CONVERSION_SCORE_BAR },
  ];

  const passedCount = checks.filter((c) => c.passed).length;
  const readiness = Math.round((passedCount / checks.length) * 100);
  const missing = checks.filter((c) => !c.passed).map((c) => c.label);

  return { readiness, checks, missing, tasksRemaining: missing.length };
}
