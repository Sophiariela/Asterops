import { loadSiteForAnalysis } from './shared.js';

export type PageInventoryItem = {
  pageId: string;
  name: string;
  purpose: string;
  ctaLabel: string;
  hasLeadCapture: boolean;
  seoStatus: 'complete' | 'incomplete';
  trustElementCount: number;
  performance: null; // needs a live hosted page — not measured
};

// A page's "purpose" isn't stored anywhere — it's a one-line human label
// of intent. This is a static mapping by slug, not a measurement, so it's
// presented as descriptive copy rather than a computed stat.
const PURPOSE_BY_SLUG: Record<string, string> = {
  home: 'Convert first-time visitors',
  services: 'Explain what you offer',
  shop: 'Drive product sales',
  menu: 'Showcase what you serve',
  about: 'Build trust and credibility',
  'case-studies': 'Prove results with evidence',
  work: 'Showcase past work',
  pricing: 'Remove pricing objections',
  features: 'Explain product capabilities',
  programs: 'Help visitors pick a program',
  trainers: 'Build trust in the team',
  content: 'Showcase recent work or posts',
  offers: 'Present ways to work together',
  reservations: 'Convert intent into a booking',
  contact: 'Capture a direct inquiry',
};

export async function getPageInventory(ownerId: string, siteId: string): Promise<PageInventoryItem[]> {
  const site = await loadSiteForAnalysis(ownerId, siteId);

  return site.pages.map((p) => {
    const sections = Array.isArray(p.sections) ? (p.sections as { type: string }[]) : [];
    return {
      pageId: p.id,
      name: p.name,
      purpose: PURPOSE_BY_SLUG[p.slug] ?? 'Support the visitor journey',
      ctaLabel: p.ctaLabel,
      hasLeadCapture: p.hasLeadForm,
      seoStatus: p.seoTitle && p.seoDescription ? 'complete' : 'incomplete',
      trustElementCount: sections.filter((s) => s.type === 'trust-placeholder').length,
      performance: null,
    };
  });
}
