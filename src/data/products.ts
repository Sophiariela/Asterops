import { Layers, Cpu, Store, Globe2, Sparkles, type LucideIcon } from 'lucide-react';

export type ProductSlug = 'webos' | 'launchos' | 'commerceos' | 'growthos' | 'luna-ai';

export type Product = {
  slug: ProductSlug;
  name: string;
  /** Short, punchy headline — used as the page H1 and reused as the nav/ecosystem descriptor. */
  tagline: string;
  /** One-paragraph explanation of what the product is and why it exists. */
  subheadline: string;
  included: string[];
  outcome: string;
  icon: LucideIcon;
};

export const PRODUCTS: Product[] = [
  {
    slug: 'webos',
    name: 'WebOS',
    tagline: "Your company's digital foundation.",
    subheadline:
      'More than a website. WebOS gives your business a professional digital presence built to attract customers, generate opportunities and connect with the entire ASTER ecosystem.',
    included: [
      'Professional website',
      'Content management',
      'SEO foundation',
      'Analytics integration',
      'Landing pages',
      'Brand structure',
      'Forms and lead capture',
      'Ecosystem-ready architecture',
    ],
    outcome: 'A digital presence that grows with your business instead of needing to be rebuilt every year.',
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
