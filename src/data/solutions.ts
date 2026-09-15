export type SolutionSlug = 'ecommerce' | 'operations' | 'automation' | 'customer-experience';

export type Solution = {
  slug: SolutionSlug;
  name: string;
  tagline: string;
  description: string;
  features: string[];
};

export const SOLUTIONS: Solution[] = [
  {
    slug: 'ecommerce',
    name: 'Ecommerce',
    tagline: 'Sell online without stitching five tools together',
    description:
      'A complete ecommerce solution built on CommerceOS — storefront, catalog, checkout and fulfillment as one connected system.',
    features: [
      'Storefront and catalog management',
      'Checkout and payment processing',
      'Shipping and fulfillment tracking',
      'Conversion-rate optimization',
    ],
  },
  {
    slug: 'operations',
    name: 'Operations',
    tagline: 'Run the back office without the back-office overhead',
    description: 'Operational tooling — inventory, orders and reporting — connected to every ASTER OS product you run.',
    features: [
      'Inventory and order management',
      'Cross-channel reporting',
      'Team and role permissions',
      'Real-time operational dashboards',
    ],
  },
  {
    slug: 'automation',
    name: 'Automation',
    tagline: 'Replace manual work with systems that run themselves',
    description: 'Automations that connect your CRM, marketing and operational tools so work happens without someone pushing a button.',
    features: [
      'CRM and lifecycle automation',
      'Cross-tool workflow triggers',
      'Automated notifications and follow-ups',
      'No-code rule builder',
    ],
  },
  {
    slug: 'customer-experience',
    name: 'Customer Experience',
    tagline: 'Support and delight customers at every touchpoint',
    description: 'A unified view of every customer conversation, powered by ASTER AI Agents for instant, consistent responses.',
    features: [
      'Unified customer conversation history',
      'AI Agent-assisted support',
      'Satisfaction tracking and feedback loops',
      'Omnichannel messaging',
    ],
  },
];

export function getSolution(slug: string | undefined) {
  return SOLUTIONS.find((s) => s.slug === slug);
}
