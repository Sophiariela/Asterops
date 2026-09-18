import type { Template, TemplatePage, TemplateSection } from '@prisma/client';
import { fillTemplate } from '../../lib/textFill.js';

export type GeneratorInput = {
  businessName: string;
  industry: string;
  services: string[];
  targetAudience: string;
};

export type TemplateWithTree = Template & {
  pages: (TemplatePage & { sections: TemplateSection[] })[];
};

export type PageTemplate = {
  slug: string;
  name: string;
  heroHeadline: string;
  heroSubheadline: string;
  ctaLabel: string;
  ctaHref?: string;
  hasLeadForm: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  sections: { type: string; heading: string; body: string; imageUrl: string | null }[];
};

// These section types represent "what we offer" content — the real
// services/products list the business entered, not a stored pattern —
// so they're always regenerated live from services rather than filled
// from a stale stored string. trust-placeholder is likewise forced to
// the same canonical message the Trust Engine cross-references.
const SERVICES_LIST_SECTION_TYPES = new Set(['benefits', 'program-overview', 'featured-products', 'menu-highlights']);

function buildVars(input: GeneratorInput, page: TemplatePage): Record<string, string> {
  return {
    businessName: input.businessName,
    industry: input.industry,
    targetAudience: input.targetAudience,
    services: input.services.length ? input.services.join(', ') : 'what we do best',
    pageName: page.name,
    purpose: page.purpose,
  };
}

function sectionBody(section: TemplateSection, input: GeneratorInput, vars: Record<string, string>): string {
  if (SERVICES_LIST_SECTION_TYPES.has(section.type)) {
    const items = input.services.length ? input.services : ['Quality', 'Reliability', 'Results'];
    return items.map((s) => `• ${s}`).join('\n');
  }
  if (section.type === 'trust-placeholder') {
    return 'No testimonials added yet — the Trust Engine will flag this until at least 3 are added.';
  }
  return fillTemplate(section.bodyPattern, vars);
}

// Pages that don't capture a lead themselves get a real internal link to
// whichever page does — a structural fact about the site's navigation,
// not a claim about how visitors actually move through it (no traffic
// data exists for that). Mirrors the routing rule the old hardcoded
// playbooks used.
export function buildPagesFromTemplate(template: TemplateWithTree, input: GeneratorInput): PageTemplate[] {
  const orderedPages = [...template.pages].sort((a, b) => a.order - b.order);
  const primaryCapturePage = orderedPages.find((p) => p.hasLeadForm);

  return orderedPages.map((page) => {
    const vars = buildVars(input, page);
    const sections = [...page.sections]
      .sort((a, b) => a.order - b.order)
      .map((s) => ({ type: s.type, heading: fillTemplate(s.heading, vars), body: sectionBody(s, input, vars), imageUrl: null }));

    return {
      slug: page.slug,
      name: page.name,
      heroHeadline: fillTemplate(page.heroHeadlinePattern, vars),
      heroSubheadline: fillTemplate(page.heroSubheadlinePattern, vars),
      ctaLabel: page.ctaLabel,
      ctaHref:
        !page.hasLeadForm && primaryCapturePage && primaryCapturePage.slug !== page.slug
          ? `/${primaryCapturePage.slug}`
          : undefined,
      hasLeadForm: page.hasLeadForm,
      seoTitle: page.seoTitlePattern ? fillTemplate(page.seoTitlePattern, vars) : null,
      seoDescription: page.seoDescriptionPattern ? fillTemplate(page.seoDescriptionPattern, vars) : null,
      sections,
    };
  });
}
