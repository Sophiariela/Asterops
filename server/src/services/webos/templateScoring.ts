export type ScoreFactor = { key: string; label: string; weight: number; achieved: number; detail: string };
export type TemplateScore = { score: number; factors: ScoreFactor[] };

type ScorablePage = { hasLeadForm: boolean; ctaLabel: string; sections: { type: string }[] };

const TRUST_SECTION_TYPES = new Set(['trust-placeholder', 'testimonials', 'results', 'reviews']);

// A deterministic score computed from a template's own real structure —
// not a survey result or an estimate. Every factor is something the
// template definition actually states (which pages capture leads, whether
// a trust section exists, how many distinct CTAs the site asks for),
// mirroring how Health Score and Deployment Readiness compute from real
// site data rather than fabricated numbers.
export function computeLeadGenerationScore(pages: ScorablePage[]): TemplateScore {
  const total = pages.length || 1;
  const leadPages = pages.filter((p) => p.hasLeadForm).length;
  const leadFraction = leadPages / total;

  const hasTrustSection = pages.some((p) => p.sections.some((s) => TRUST_SECTION_TYPES.has(s.type)));

  const ctaLabels = new Set(pages.map((p) => p.ctaLabel));
  const ctaFocus = pages.length <= 1 ? 1 : Math.max(0, 1 - (ctaLabels.size - 1) / (pages.length - 1));

  const homeHasCapture = pages[0]?.hasLeadForm ?? false;

  const factors: ScoreFactor[] = [
    {
      key: 'leadPages',
      label: 'Pages that capture a lead',
      weight: 50,
      achieved: Math.round(leadFraction * 50),
      detail: `${leadPages}/${pages.length} pages capture a lead directly`,
    },
    {
      key: 'trust',
      label: 'Dedicated trust/proof section',
      weight: 25,
      achieved: hasTrustSection ? 25 : 0,
      detail: hasTrustSection ? 'Has a trust, testimonials or results section' : 'No trust or proof section',
    },
    {
      key: 'ctaFocus',
      label: 'Focused call-to-action strategy',
      weight: 15,
      achieved: Math.round(ctaFocus * 15),
      detail: `${ctaLabels.size} distinct call-to-action label(s) across ${pages.length} pages`,
    },
    {
      key: 'homeCapture',
      label: 'Home page captures leads',
      weight: 10,
      achieved: homeHasCapture ? 10 : 0,
      detail: homeHasCapture ? 'Home page has a lead form' : 'Home page routes elsewhere to capture leads',
    },
  ];

  const score = factors.reduce((sum, f) => sum + f.achieved, 0);
  return { score, factors };
}
