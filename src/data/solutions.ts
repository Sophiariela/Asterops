import type { ProductSlug } from './products';

export type SolutionSlug =
  | 'erp'
  | 'ecommerce'
  | 'pos'
  | 'marketplace-integrations'
  | 'financial-management'
  | 'logistics-shipping'
  | 'business-credit'
  | 'ai-automation';

export type Solution = {
  slug: SolutionSlug;
  name: string;
  tagline: string;
  description: string;
  features: string[];
  /** ASTER systems that power this solution — solutions are use cases, not products. */
  poweredBy: ProductSlug[];
};

export const SOLUTIONS: Solution[] = [
  {
    slug: 'erp',
    name: 'ERP',
    tagline: 'Run the back office without the back-office overhead',
    description:
      'A complete resource-planning layer — inventory, orders, finance and reporting — built on top of the ASTER systems you already run.',
    features: [
      'Inventory and order management',
      'Cross-channel reporting',
      'Team and role permissions',
      'Real-time operational dashboards',
    ],
    poweredBy: ['commerceos', 'growthos', 'luna-ai'],
  },
  {
    slug: 'ecommerce',
    name: 'Ecommerce',
    tagline: 'Sell online without stitching five tools together',
    description:
      'A complete ecommerce use case — storefront, catalog, checkout and fulfillment — assembled from ASTER systems as one connected experience.',
    features: [
      'Storefront and catalog management',
      'Checkout and payment processing',
      'Shipping and fulfillment tracking',
      'Conversion-rate optimization',
    ],
    poweredBy: ['webos', 'commerceos', 'luna-ai'],
  },
  {
    slug: 'pos',
    name: 'POS (PDV)',
    tagline: 'One system for the storefront and the counter',
    description:
      'Point-of-sale that shares catalog, inventory and customer data with everything you sell online — no separate system to reconcile.',
    features: [
      'Unified in-person and online inventory',
      'Fast checkout at the counter',
      'Shared customer and order history',
      'Cash and shift management',
    ],
    poweredBy: ['commerceos', 'luna-ai'],
  },
  {
    slug: 'marketplace-integrations',
    name: 'Marketplace Integrations',
    tagline: 'Sell everywhere your customers already are',
    description:
      'Connect your catalog and orders to every major marketplace and sales channel, kept in sync automatically.',
    features: [
      'Two-way catalog and order sync',
      'Centralized multi-channel inventory',
      'Automated price and stock updates',
      'Unified order fulfillment queue',
    ],
    poweredBy: ['commerceos', 'growthos'],
  },
  {
    slug: 'financial-management',
    name: 'Financial Management',
    tagline: 'Receive, pay and reconcile in one place',
    description:
      'Payments, reconciliation and cash-flow visibility across every channel you sell on, without a separate finance stack.',
    features: [
      'Multi-channel payment reconciliation',
      'Cash-flow forecasting',
      'Automated invoicing',
      'Real-time financial reporting',
    ],
    poweredBy: ['commerceos', 'growthos', 'luna-ai'],
  },
  {
    slug: 'logistics-shipping',
    name: 'Logistics & Shipping',
    tagline: 'From sale to doorstep, without the headache',
    description:
      'Shipping and fulfillment built into the same system that runs your sales, with rates, labels and tracking handled automatically.',
    features: [
      'Multi-carrier rate shopping',
      'Automated label generation',
      'Real-time tracking and notifications',
      'Returns management',
    ],
    poweredBy: ['commerceos', 'growthos'],
  },
  {
    slug: 'business-credit',
    name: 'Business Credit',
    tagline: 'Financing that grows with your operating data',
    description:
      'Access working capital and credit lines sized against your real sales and growth data, not a static credit application.',
    features: [
      'Revenue-based credit lines',
      'Receivables anticipation',
      'Data-backed credit scoring',
      'Flexible repayment tied to cash flow',
    ],
    poweredBy: ['growthos', 'luna-ai'],
  },
  {
    slug: 'ai-automation',
    name: 'AI Automation',
    tagline: 'Replace manual work with systems that run themselves',
    description:
      'Automations that connect your operation end to end, powered by Luna AI, so work happens without someone pushing a button.',
    features: [
      'Cross-system workflow triggers',
      'AI-assisted customer support',
      'Automated notifications and follow-ups',
      'No-code rule builder',
    ],
    poweredBy: ['luna-ai', 'growthos'],
  },
];

export function getSolution(slug: string | undefined) {
  return SOLUTIONS.find((s) => s.slug === slug);
}
