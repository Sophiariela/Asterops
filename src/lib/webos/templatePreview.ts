import type { TemplateDetail, TemplatePageDef, PublicSite, PublicPage, PublicTestimonial, PlaybookKey } from './types';

// Curated, industry-matched stock photography (Unsplash, free license) —
// preview-only. A freshly generated real site deliberately keeps its
// imageUrl fields null (see templateEngine.ts) so a business never
// publishes a stock photo as if it were their own; the library preview
// has no such constraint and needs to look like a finished site.
function unsplash(id: string, w = 1200) {
  return `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;
}

const PREVIEW_IMAGES: Record<PlaybookKey, { hero: string; sections: string[] }> = {
  FITNESS: {
    hero: unsplash('1517836357463-d25dfeac3438'),
    sections: [unsplash('1571019613454-1cb2f99b2d8b'), unsplash('1534438327276-14e5300c3a48')],
  },
  ECOMMERCE: {
    hero: unsplash('1441986300917-64674bd600d8'),
    sections: [unsplash('1523275335684-37898b6baf30'), unsplash('1472851294608-062f824d29cc')],
  },
  SAAS: {
    hero: unsplash('1551288049-bebda4e38f71'),
    sections: [unsplash('1460925895917-afdab827c52f'), unsplash('1498050108023-c5249f4df085')],
  },
  CONSULTANT: {
    hero: unsplash('1600880292203-757bb62b4baf'),
    sections: [unsplash('1521737604893-d14cc237f11d'), unsplash('1454165804606-c3d57bc86b40')],
  },
  AGENCY: {
    hero: unsplash('1523240795612-9a054b0db644'),
    sections: [unsplash('1522202176988-66273c2fd55f'), unsplash('1542744173-8e7e53415bb0')],
  },
  RESTAURANT: {
    hero: unsplash('1517248135467-4c7edcad34c4'),
    sections: [unsplash('1414235077428-338989a2e8c0'), unsplash('1552566626-52f8b828add9')],
  },
  CREATOR: {
    hero: unsplash('1598488035139-bdbb2231ce04'),
    sections: [unsplash('1516035069371-29a1b244cc32'), unsplash('1493246507139-91e8fad9978e')],
  },
  LOCAL_BUSINESS: {
    hero: unsplash('1441986300917-64674bd600d8'),
    sections: [unsplash('1556742049-0cfed4f6a45d'), unsplash('1556740758-90de374c12ad')],
  },
  PERSONAL_BRAND: {
    hero: unsplash('1580489944761-15a19d654956'),
    sections: [unsplash('1573497019940-1c28c88b4f3e'), unsplash('1519085360753-af0119f7cbe7')],
  },
  PROFESSIONAL_SERVICES: {
    hero: unsplash('1521791136064-7986c2920216'),
    sections: [unsplash('1507003211169-0a1dd7228f2d'), unsplash('1556761175-5973dc0f32e7')],
  },
};

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
  const images = PREVIEW_IMAGES[detail.key];

  const pages: PublicPage[] = orderedPages.map((page) => {
    const vars = exampleVars(detail, page);
    let sectionImageIndex = 0;
    return {
      id: page.id,
      slug: page.slug,
      name: page.name,
      heroHeadline: fillVars(page.heroHeadlinePattern, vars),
      heroSubheadline: fillVars(page.heroSubheadlinePattern, vars),
      heroImageUrl: images.hero,
      ctaLabel: page.ctaLabel,
      ctaHref: !page.hasLeadForm && primaryCapturePage && primaryCapturePage.slug !== page.slug ? `/${primaryCapturePage.slug}` : null,
      sections: [...page.sections]
        .sort((a, b) => a.order - b.order)
        .map((s) => ({
          type: s.type,
          heading: fillVars(s.heading, vars),
          body: sectionBody(s.type, s.bodyPattern, vars),
          imageUrl: s.type === 'trust-placeholder' ? null : images.sections[sectionImageIndex++ % images.sections.length],
        })),
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
