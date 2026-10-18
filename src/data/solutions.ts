import type { ProductSlug } from './products';

export type SolutionSlug = 'website' | 'ecommerce' | 'ai-content';

export type Solution = {
  slug: SolutionSlug;
  name: string;
  tagline: string;
  description: string;
  features: string[];
  /** ASTER systems that power this solution — solutions are use cases, not products. */
  poweredBy: ProductSlug[];
};

// Each solution below maps to functionality that actually exists and
// works today — no ERP, POS, shipping/logistics, marketplace sync or
// financial/credit features, since none of those are implemented.
export const SOLUTIONS: Solution[] = [
  {
    slug: 'website',
    name: 'Website & Booking',
    tagline: 'A complete website, built for your industry',
    description:
      'A real, published website generated from an industry-specific template — restaurants, professional services, beauty and wellness, creative brands, education and local services — with real reservations, appointment scheduling and lead capture built in.',
    features: [
      'Industry-specific templates across 7 categories',
      'Real restaurant reservations and service appointments',
      'Lead capture and quote requests',
      'Editable content, branding and images',
    ],
    poweredBy: ['webos', 'luna-ai'],
  },
  {
    slug: 'ecommerce',
    name: 'Ecommerce',
    tagline: 'Sell products from your own catalog',
    description:
      'A product catalog connected to your website — categories, inventory and orders managed from one place.',
    features: [
      'Product catalog and categories',
      'Inventory tracking',
      'Order management',
      'Customer records',
    ],
    poweredBy: ['webos', 'commerceos'],
  },
  {
    slug: 'ai-content',
    name: 'AI Content Assistance',
    tagline: 'Luna helps you write it',
    description:
      'Luna AI reviews your site, recommends the right template for your business, improves your homepage copy and fills in missing SEO metadata — you always review before applying.',
    features: [
      'Template recommendations',
      'Headline and copy suggestions',
      'SEO metadata generation',
      'Menu description writing for restaurants',
    ],
    poweredBy: ['luna-ai', 'webos'],
  },
];

export function getSolution(slug: string | undefined) {
  return SOLUTIONS.find((s) => s.slug === slug);
}
