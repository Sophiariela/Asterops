import { loadSiteForAnalysis, seoCompleteness, trustScore, isWeakHeadline } from './shared.js';

type Factor = {
  key: 'performance' | 'seo' | 'accessibility' | 'mobile' | 'conversion' | 'trust';
  label: string;
  available: boolean;
  score: number | null;
  detail: string;
};

export type WebsiteHealth = {
  siteId: string;
  score: number;
  factors: Factor[];
  strengths: string[];
  issues: string[];
};

// Performance and accessibility need a real, publicly-hosted page to
// measure (a Lighthouse-style run against a live URL) — WebOS doesn't
// serve pages publicly yet, so both are reported unavailable rather than
// guessed, exactly like CommerceOS marks conversion-rate/satisfaction.
export async function getWebsiteHealth(ownerId: string, siteId: string): Promise<WebsiteHealth> {
  const site = await loadSiteForAnalysis(ownerId, siteId);
  const pages = site.pages;

  const seo = seoCompleteness(pages);
  const seoScore = pages.length ? Math.round((seo.complete / pages.length) * 100) : 0;

  const hasAnyLeadForm = pages.some((p) => p.hasLeadForm);
  const strongHeadlines = pages.filter((p) => !isWeakHeadline(p.heroHeadline)).length;
  const conversionScore = pages.length
    ? Math.round(((strongHeadlines / pages.length) * 0.6 + (hasAnyLeadForm ? 0.4 : 0)) * 100)
    : 0;

  const trust = trustScore(site.testimonials.length);

  const factors: Factor[] = [
    { key: 'performance', label: 'Performance', available: false, score: null, detail: 'Needs a live, publicly-hosted page to measure (not yet available)' },
    { key: 'seo', label: 'SEO', available: true, score: seoScore, detail: `${seo.complete} of ${pages.length} pages have both an SEO title and description` },
    { key: 'accessibility', label: 'Accessibility', available: false, score: null, detail: 'Needs a live rendered page to audit (not yet available)' },
    { key: 'mobile', label: 'Mobile responsiveness', available: true, score: 100, detail: "Guaranteed — every page uses ASTER's responsive template system" },
    { key: 'conversion', label: 'Conversion readiness', available: true, score: conversionScore, detail: `${strongHeadlines}/${pages.length} pages have a strong headline; ${hasAnyLeadForm ? 'has' : 'missing'} a lead capture form` },
    { key: 'trust', label: 'Trust signals', available: true, score: trust, detail: `${site.testimonials.length} testimonial(s) on this site` },
  ];

  const availableScores = factors.filter((f) => f.available && f.score !== null).map((f) => f.score as number);
  const score = availableScores.length ? Math.round(availableScores.reduce((a, b) => a + b, 0) / availableScores.length) : 0;

  const strengths: string[] = [];
  const issues: string[] = [];
  if (seoScore >= 80) strengths.push('SEO metadata is in good shape');
  else if (pages.length) issues.push(`${pages.length - seo.complete} page(s) missing SEO title/description`);
  if (hasAnyLeadForm) strengths.push('Has lead capture in place');
  else issues.push('Missing lead capture');
  if (strongHeadlines === pages.length && pages.length > 0) strengths.push('Headlines are clear across all pages');
  else if (pages.length - strongHeadlines > 0) issues.push(`${pages.length - strongHeadlines} page(s) have a weak or generic headline`);
  if (trust >= 100) strengths.push('Has enough testimonials to build trust');
  else issues.push(site.testimonials.length === 0 ? 'Missing testimonials' : `Only ${site.testimonials.length} testimonial(s) — add more`);
  strengths.push("Mobile optimized (template-guaranteed)");

  return { siteId, score, factors, strengths, issues };
}
