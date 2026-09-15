import { Layers, Cpu, Store, Globe2, Sparkles, type LucideIcon } from 'lucide-react';

export type ProductSlug = 'webos' | 'launchos' | 'commerceos' | 'growthos' | 'agents';

export type Product = {
  slug: ProductSlug;
  name: string;
  tagline: string;
  description: string;
  features: string[];
  benefits: string[];
  icon: LucideIcon;
};

export const PRODUCTS: Product[] = [
  {
    slug: 'webos',
    name: 'WebOS',
    tagline: 'The operating system for your web presence',
    description:
      'WebOS gives your business a premium, high-performance website built on the ASTER design system — launched in weeks, not months.',
    features: [
      'Custom-built website on our design system',
      'Copy, SEO and analytics setup',
      'Brand assets and style guide',
      'Launch in 2-3 weeks',
    ],
    benefits: [
      'A site that converts, not just exists',
      'One system to maintain instead of five vendors',
      'Built to plug into LaunchOS and CommerceOS later',
    ],
    icon: Layers,
  },
  {
    slug: 'launchos',
    name: 'LaunchOS',
    tagline: 'The operating system for product and offer launches',
    description:
      'LaunchOS turns a new product, offer or campaign into a working funnel — pages, automation and tracking, deployed as one system.',
    features: [
      'Everything in WebOS',
      'Landing pages and lead capture flows',
      'Automation and CRM setup',
      'Paid traffic-ready tracking',
    ],
    benefits: [
      'Launch in days, not quarters',
      "No stitching five tools together by hand",
      'Every lead tracked from click to close',
    ],
    icon: Cpu,
  },
  {
    slug: 'commerceos',
    name: 'CommerceOS',
    tagline: 'The operating system for scaling online sales',
    description: 'CommerceOS is the full storefront and checkout system for businesses ready to sell online at scale.',
    features: [
      'Everything in LaunchOS',
      'Full storefront build (Shopify-ready)',
      'Catalog, checkout and conversion optimization',
      'Ongoing performance monitoring',
    ],
    benefits: [
      'A storefront built to convert, not just list products',
      'Continuous optimization instead of a one-time build',
      'Room to grow into GrowthOS without a rebuild',
    ],
    icon: Store,
  },
  {
    slug: 'growthos',
    name: 'GrowthOS',
    tagline: 'The operating system for sustained growth',
    description:
      'GrowthOS layers retention, lifecycle and multi-channel growth systems on top of what WebOS, LaunchOS and CommerceOS already built.',
    features: [
      'Everything in CommerceOS',
      'Lifecycle and retention automation',
      'Multi-channel growth reporting',
      'Dedicated growth strategist',
    ],
    benefits: [
      'Growth that compounds instead of resetting every campaign',
      'One dashboard for every channel',
      'A strategist accountable to your numbers',
    ],
    icon: Globe2,
  },
  {
    slug: 'agents',
    name: 'AI Agents',
    tagline: 'Autonomous agents that run your operation',
    description: 'AI Agents connect to your ASTER systems and handle the operational work — support, ops, follow-ups — end to end.',
    features: [
      'Connects to every ASTER OS product',
      'Handles support, ops and follow-up tasks',
      'Learns from your operation over time',
      'Human handoff whenever it matters',
    ],
    benefits: [
      'Operational work that runs while you sleep',
      'Fewer repetitive tasks for your team',
      'Consistent execution, every time',
    ],
    icon: Sparkles,
  },
];

export function getProduct(slug: string | undefined) {
  return PRODUCTS.find((p) => p.slug === slug);
}
