import { loadSiteForAnalysis, seoCompleteness, trustScore, isWeakHeadline } from './shared.js';

export type ConversionCheck = {
  key: string;
  label: string;
  penalty: number;
  detail: string;
  recommendation: string | null;
};

export type ConversionAudit = {
  score: number;
  checks: ConversionCheck[];
  recommendations: string[];
};

export async function runConversionAudit(ownerId: string, siteId: string): Promise<ConversionAudit> {
  const site = await loadSiteForAnalysis(ownerId, siteId);
  const pages = site.pages;
  const checks: ConversionCheck[] = [];

  // 1. CTA presence
  const missingCta = pages.filter((p) => !p.ctaLabel || !p.ctaLabel.trim()).length;
  const ctaPenalty = pages.length ? Math.round((missingCta / pages.length) * 25) : 0;
  checks.push({
    key: 'cta-presence', label: 'Call-to-action presence', penalty: ctaPenalty,
    detail: `${pages.length - missingCta} of ${pages.length} pages have a clear CTA.`,
    recommendation: ctaPenalty > 0 ? `${missingCta} page(s) have no call-to-action — every page should ask the visitor to do something.` : null,
  });

  // 2. Lead capture presence (sitewide)
  const hasLeadForm = pages.some((p) => p.hasLeadForm);
  checks.push({
    key: 'lead-capture', label: 'Lead capture', penalty: hasLeadForm ? 0 : 25,
    detail: hasLeadForm ? 'At least one page captures leads.' : 'No page on this site captures leads.',
    recommendation: hasLeadForm ? null : 'Add a lead capture form — right now a visitor has no way to become a lead.',
  });

  // 3. Headline clarity
  const weakHeadlines = pages.filter((p) => isWeakHeadline(p.heroHeadline)).length;
  const headlinePenalty = pages.length ? Math.round((weakHeadlines / pages.length) * 25) : 0;
  checks.push({
    key: 'headline-clarity', label: 'Headline clarity', penalty: headlinePenalty,
    detail: `${pages.length - weakHeadlines} of ${pages.length} pages have a substantial headline.`,
    recommendation: headlinePenalty > 0 ? `${weakHeadlines} page(s) have a very short or generic headline — clarity beats cleverness.` : null,
  });

  // 4. Trust signals
  const trust = trustScore(site.testimonials.length);
  const trustPenalty = Math.round((1 - trust / 100) * 15);
  checks.push({
    key: 'trust-signals', label: 'Social proof', penalty: trustPenalty,
    detail: `${site.testimonials.length} testimonial(s) on this site.`,
    recommendation: trustPenalty > 0 ? 'Add social proof — testimonials next to a CTA measurably reduce hesitation.' : null,
  });

  // 5. SEO completeness
  const seo = seoCompleteness(pages);
  const seoPenalty = pages.length ? Math.round(((pages.length - seo.complete) / pages.length) * 10) : 0;
  checks.push({
    key: 'seo-completeness', label: 'SEO completeness', penalty: seoPenalty,
    detail: `${seo.complete} of ${pages.length} pages have SEO title + description.`,
    recommendation: seoPenalty > 0 ? `${pages.length - seo.complete} page(s) are missing SEO metadata — they won't show well in search results.` : null,
  });

  const score = Math.max(0, 100 - checks.reduce((s, c) => s + c.penalty, 0));
  const recommendations = checks.map((c) => c.recommendation).filter((r): r is string => r !== null);

  return { score, checks, recommendations };
}
