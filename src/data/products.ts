import { Layers, Cpu, Store, Globe2, Sparkles, type LucideIcon } from 'lucide-react';

export type ProductSlug = 'webos' | 'launchos' | 'commerceos' | 'growthos' | 'luna-ai';

export type Product = {
  slug: ProductSlug;
  name: string;
  /** Short, punchy headline — used as the page H1 and reused as the nav/ecosystem descriptor. */
  tagline: string;
  /** Explanation of what the product is and why it exists. A string renders as one paragraph; an array renders as separate paragraphs. */
  subheadline: string | string[];
  /** Optional CTA button rendered directly in the hero, linking to /plans?product=<slug>. */
  heroCta?: string;
  /** Optional "what this actually solves" blocks, rendered as a titled grid ahead of the included-features list. */
  solutions?: { title: string; body: string }[];
  /** Optional "built for growth" section: a title plus a short sequence of paragraphs. */
  growth?: { title: string; paragraphs: string[] };
  included: string[];
  /** Legacy single-paragraph outcome, used when outcomeList isn't set. */
  outcome?: string;
  /** Preferred checklist form of the outcome section. */
  outcomeList?: string[];
  /** Override for the outcome section heading (defaults to "Outcome"). */
  outcomeTitle?: string;
  /** Optional "part of a larger ecosystem" section linking to other ASTER products. */
  ecosystem?: { title: string; body: string; connects: ProductSlug[] };
  /** Override for the bottom CTA section's headline/description/button (defaults to a generic "Ready to deploy <name>?" / "Deploy <name>"). */
  finalCta?: { headline: string; description: string; buttonLabel?: string };
  icon: LucideIcon;
};

export const PRODUCTS: Product[] = [
  {
    slug: 'webos',
    name: 'WebOS',
    tagline: 'The digital foundation your business deserves.',
    subheadline: [
      'Most websites are launched and forgotten.',
      'WebOS is a business-ready digital infrastructure designed to help companies establish credibility, generate opportunities and grow without rebuilding everything from scratch.',
      'Built on the ASTER ecosystem, WebOS combines strategy, performance, design and scalability into a single system.',
    ],
    heroCta: 'Activate WebOS',
    solutions: [
      {
        title: 'Establish credibility',
        body: 'Customers decide in seconds whether they trust your business. WebOS helps you present a professional, modern and premium digital presence from day one.',
      },
      {
        title: 'Capture opportunities',
        body: 'Every page is designed with conversion architecture in mind, helping transform visitors into leads, inquiries and customers.',
      },
      {
        title: 'Eliminate technical chaos',
        body: 'Replace fragmented tools, outdated websites and disconnected workflows with a structured digital foundation.',
      },
      {
        title: 'Grow without rebuilding',
        body: 'WebOS is designed to evolve alongside your business and connect seamlessly with the broader ASTER ecosystem.',
      },
    ],
    growth: {
      title: 'Built for growth, not just launch.',
      paragraphs: [
        "Most websites solve today's problem.",
        'WebOS is built to support where your business will be six months, one year and three years from now.',
        "Whether you're validating an idea, expanding operations or preparing to sell online, your infrastructure is already prepared.",
        'Instead of rebuilding every stage of growth, you continue building on the same foundation.',
      ],
    },
    included: [
      'Professional website infrastructure',
      'Content management system',
      'SEO-ready architecture',
      'Analytics and performance tracking',
      'Lead capture and conversion tools',
      'Landing page support',
      'Brand structure and consistency',
      'ASTER ecosystem integration readiness',
    ],
    outcomeTitle: 'What you leave with',
    outcomeList: [
      'A professional digital presence',
      'A structured customer acquisition channel',
      'A scalable foundation for future growth',
      'Infrastructure ready for expansion',
      'A business that looks established from day one',
    ],
    ecosystem: {
      title: 'Part of a larger ecosystem.',
      body: 'WebOS is the entry point into the ASTER operating system. As your business grows, WebOS can connect directly with:',
      connects: ['commerceos', 'launchos', 'growthos'],
    },
    finalCta: {
      headline: 'Launch a stronger digital foundation.',
      description: 'Start with infrastructure designed to evolve alongside your business.',
      buttonLabel: 'Activate WebOS',
    },
    icon: Layers,
  },
  {
    slug: 'launchos',
    name: 'LaunchOS',
    tagline: 'Launch products, offers and campaigns with speed.',
    subheadline:
      'LaunchOS centralizes landing pages, lead capture, automation and campaign tracking so your team can execute launches without assembling multiple tools.',
    included: [
      'Landing pages',
      'Lead capture',
      'Campaign tracking',
      'Forms',
      'Automations',
      'CRM integrations',
      'Conversion analytics',
    ],
    outcome: 'Move from idea to launch faster while maintaining visibility into results.',
    icon: Cpu,
  },
  {
    slug: 'commerceos',
    name: 'CommerceOS',
    tagline: 'Run your online sales from a single system.',
    subheadline:
      'CommerceOS connects your store, orders, inventory and integrations into one operational environment designed for growth.',
    included: [
      'Ecommerce storefront',
      'Order management',
      'Inventory management',
      'Payment integrations',
      'Marketplace integrations',
      'Customer management',
      'Operational reporting',
    ],
    outcome: 'Sell across channels without increasing operational complexity.',
    icon: Store,
  },
  {
    slug: 'growthos',
    name: 'GrowthOS',
    tagline: 'Turn operational data into business growth.',
    subheadline:
      'GrowthOS brings together analytics, automations and performance visibility so decision-making becomes faster and more predictable.',
    included: [
      'Business dashboards',
      'KPI tracking',
      'Reports',
      'Operational analytics',
      'Automations',
      'Growth monitoring',
      'Performance insights',
    ],
    outcome: 'Spend less time collecting information and more time acting on it.',
    icon: Globe2,
  },
  {
    slug: 'luna-ai',
    name: 'Luna AI',
    tagline: 'AI that works inside your operation.',
    subheadline:
      'Luna AI connects with ASTER systems to automate tasks, support decision-making and reduce repetitive work across your business.',
    included: [
      'Operational assistants',
      'Workflow automations',
      'Internal knowledge access',
      'Reporting assistance',
      'Customer support workflows',
      'Task execution support',
    ],
    outcome: 'More output with fewer manual processes.',
    icon: Sparkles,
  },
];

export function getProduct(slug: string | undefined) {
  return PRODUCTS.find((p) => p.slug === slug);
}
