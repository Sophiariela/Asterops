import { loadSiteForAnalysis, isWeakHeadline } from './shared.js';

export type PageSectionInventory = {
  pageId: string;
  name: string;
  sections: { type: string; heading: string }[];
  missingSections: string[];
  optimizationOpportunities: string[];
};

const SECTION_LABEL: Record<string, string> = {
  benefits: 'Benefits',
  'trust-placeholder': 'Social proof',
};

// Which section types a page of this kind is expected to have. Pages not
// listed have no strong recommendation either way — a menu or shop page
// doesn't need a "benefits" block the way a home or services page does.
const RECOMMENDED_BY_SLUG: Record<string, string[]> = {
  home: ['benefits', 'trust-placeholder'],
  services: ['benefits'],
  programs: ['benefits'],
  offers: ['benefits'],
  about: ['trust-placeholder'],
  'case-studies': ['trust-placeholder'],
  trainers: ['trust-placeholder'],
};

export async function getSectionInventory(ownerId: string, siteId: string): Promise<PageSectionInventory[]> {
  const site = await loadSiteForAnalysis(ownerId, siteId);

  return site.pages.map((p) => {
    const sections = (Array.isArray(p.sections) ? p.sections : []) as { type: string; heading: string }[];
    const present = new Set(sections.map((s) => s.type));
    const recommended = RECOMMENDED_BY_SLUG[p.slug] ?? [];
    const missingSections = recommended.filter((t) => !present.has(t)).map((t) => SECTION_LABEL[t] ?? t);

    const optimizationOpportunities: string[] = [];
    if (isWeakHeadline(p.heroHeadline)) optimizationOpportunities.push('Headline is short or generic — make it specific to this business.');
    if (missingSections.length > 0) optimizationOpportunities.push(`Missing ${missingSections.join(', ')} — this page type usually needs it.`);

    return {
      pageId: p.id,
      name: p.name,
      sections: sections.map((s) => ({ type: SECTION_LABEL[s.type] ?? s.type, heading: s.heading })),
      missingSections,
      optimizationOpportunities,
    };
  });
}
