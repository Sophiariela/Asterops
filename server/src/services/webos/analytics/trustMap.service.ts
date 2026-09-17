import { loadSiteForAnalysis } from './shared.js';

export type TrustCategory = {
  key: 'testimonials' | 'case-studies' | 'client-logos' | 'certifications';
  label: string;
  count: number;
  target: number;
  coverage: number;
};

export type TrustMap = {
  coverage: number;
  categories: TrustCategory[];
  recommendations: string[];
};

// Targets are minimum-viable bars stated as examples in the brief itself
// ("add 3 testimonials", "add 1 case study"), not scientific benchmarks.
const TARGETS: Record<TrustCategory['key'], number> = {
  testimonials: 3,
  'case-studies': 1,
  'client-logos': 3,
  certifications: 1,
};

export async function getTrustMap(ownerId: string, siteId: string): Promise<TrustMap> {
  const site = await loadSiteForAnalysis(ownerId, siteId);
  const caseStudies = site.trustElements.filter((t) => t.type === 'CASE_STUDY').length;
  const clientLogos = site.trustElements.filter((t) => t.type === 'CLIENT_LOGO').length;
  const certifications = site.trustElements.filter((t) => t.type === 'CERTIFICATION').length;

  const counts: Record<TrustCategory['key'], number> = {
    testimonials: site.testimonials.length,
    'case-studies': caseStudies,
    'client-logos': clientLogos,
    certifications,
  };

  const labels: Record<TrustCategory['key'], string> = {
    testimonials: 'Testimonials & reviews',
    'case-studies': 'Case studies',
    'client-logos': 'Client logos',
    certifications: 'Certifications',
  };

  const singular: Record<TrustCategory['key'], string> = {
    testimonials: 'testimonial',
    'case-studies': 'case study',
    'client-logos': 'client logo',
    certifications: 'certification',
  };

  const categories: TrustCategory[] = (Object.keys(TARGETS) as TrustCategory['key'][]).map((key) => ({
    key,
    label: labels[key],
    count: counts[key],
    target: TARGETS[key],
    coverage: Math.min(100, Math.round((counts[key] / TARGETS[key]) * 100)),
  }));

  const coverage = Math.round(categories.reduce((s, c) => s + c.coverage, 0) / categories.length);

  const recommendations = categories
    .filter((c) => c.count < c.target)
    .map((c) => {
      const remaining = c.target - c.count;
      return `Add ${remaining} more ${remaining === 1 ? singular[c.key] : c.label.toLowerCase()}.`;
    });

  return { coverage, categories, recommendations };
}
