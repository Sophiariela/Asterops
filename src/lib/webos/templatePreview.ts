import type { TemplateDetail, TemplatePageDef, PublicSite, PublicPage, PublicTestimonial } from './types';

export function fillVars(pattern: string, vars: Record<string, string>): string {
  return pattern.replace(/\{\{(\w+)\}\}/g, (m, k) => (k in vars ? vars[k] : m));
}

function exampleVars(detail: Pick<TemplateDetail, 'industry'>, page: TemplatePageDef): Record<string, string> {
  return {
    businessName: 'Your Business',
    industry: detail.industry,
    targetAudience: 'your ideal customer',
    services: 'your core offer',
    pageName: page.name,
    purpose: page.purpose,
  };
}

// Mirrors server/src/services/webos/templateEngine.ts exactly, so a
// template's preview and a real generated site render the same way for
// the same section types.
const SERVICES_LIST_SECTION_TYPES = new Set(['benefits', 'program-overview', 'featured-products', 'menu-highlights']);

function sectionBody(type: string, bodyPattern: string, vars: Record<string, string>): string {
  if (SERVICES_LIST_SECTION_TYPES.has(type)) {
    return ['Quality', 'Reliability', 'Results'].map((s) => `• ${s}`).join('\n');
  }
  return fillVars(bodyPattern, vars);
}

// Clearly-generic placeholders so the trust section of a template preview
// renders populated (what a finished site looks like) instead of empty.
const EXAMPLE_TESTIMONIALS: PublicTestimonial[] = [
  { id: 'preview-1', authorName: 'Alex Morgan', authorRole: 'Customer', quote: 'Working with them was seamless from start to finish.', rating: 5, createdAt: '2024-01-01T00:00:00.000Z' },
  { id: 'preview-2', authorName: 'Jamie Lee', authorRole: 'Client', quote: 'Exactly what we needed — professional and reliable.', rating: 5, createdAt: '2024-01-01T00:00:00.000Z' },
  { id: 'preview-3', authorName: 'Taylor Reed', authorRole: 'Customer', quote: 'Would recommend without hesitation.', rating: 5, createdAt: '2024-01-01T00:00:00.000Z' },
];

// Maps a template's pattern data into the exact shape getPublicSiteBySlug
// returns for a real site, so the Template Library can feed the same
// PublicSiteRenderer used for live public sites — the preview and the real
// thing can't visually drift apart because they're the same renderer.
export function buildTemplatePreviewSite(detail: TemplateDetail): PublicSite {
  const orderedPages = [...detail.pages].sort((a, b) => a.order - b.order);
  const primaryCapturePage = orderedPages.find((p) => p.hasLeadForm);

  const pages: PublicPage[] = orderedPages.map((page) => {
    const vars = exampleVars(detail, page);
    return {
      id: page.id,
      slug: page.slug,
      name: page.name,
      heroHeadline: fillVars(page.heroHeadlinePattern, vars),
      heroSubheadline: fillVars(page.heroSubheadlinePattern, vars),
      heroImageUrl: null,
      ctaLabel: page.ctaLabel,
      ctaHref: !page.hasLeadForm && primaryCapturePage && primaryCapturePage.slug !== page.slug ? `/${primaryCapturePage.slug}` : null,
      sections: [...page.sections]
        .sort((a, b) => a.order - b.order)
        .map((s) => ({ type: s.type, heading: fillVars(s.heading, vars), body: sectionBody(s.type, s.bodyPattern, vars), imageUrl: null })),
      seoTitle: page.seoTitlePattern ? fillVars(page.seoTitlePattern, vars) : null,
      seoDescription: page.seoDescriptionPattern ? fillVars(page.seoDescriptionPattern, vars) : null,
      hasLeadForm: page.hasLeadForm,
      order: page.order,
    };
  });

  return {
    id: 'preview',
    businessName: 'Your Business',
    industry: detail.industry,
    logoUrl: null,
    currency: 'USD',
    playbook: detail.key,
    status: 'PUBLISHED',
    slug: 'preview',
    customDomain: null,
    publishedAt: null,
    pages,
    testimonials: EXAMPLE_TESTIMONIALS,
    menuCategories: [],
  };
}
