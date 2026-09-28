import type { ProductSlug } from './products';

export type PlanTier = {
  slug: 'starter' | 'growth' | 'scale';
  name: string;
  description: string;
  features: string[];
  includedProducts: ProductSlug[];
  highlight?: boolean;
  cta: string;
};

export const PLAN_TIERS: PlanTier[] = [
  {
    slug: 'starter',
    name: 'Starter',
    description: 'Para quem está começando a estruturar a operação digital.',
    features: [
      'Até 3 usuários',
      '1 sistema ASTER incluso (WebOS)',
      'Até 1.000 visitas/mês',
      'Suporte por chat',
      'Integrações essenciais (analytics, e-mail)',
    ],
    includedProducts: ['webos'],
    cta: 'Começar agora',
  },
  {
    slug: 'growth',
    name: 'Growth',
    description: 'Para quem já vende e precisa escalar com automação.',
    features: [
      'Até 10 usuários',
      '2 sistemas ASTER inclusos (LaunchOS + CommerceOS)',
      'Até 10.000 visitas/mês',
      'Suporte prioritário',
      'Integrações ilimitadas + API',
    ],
    includedProducts: ['launchos', 'commerceos'],
    highlight: true,
    cta: 'Assinar Growth',
  },
  {
    slug: 'scale',
    name: 'Scale',
    description: 'Para operações de alto volume e múltiplos canais.',
    features: [
      'Usuários ilimitados',
      'Todos os sistemas ASTER inclusos (WebOS, LaunchOS, CommerceOS, GrowthOS)',
      'Visitas ilimitadas',
      'Agentes de IA inclusos',
      'Gerente de conta dedicado',
    ],
    includedProducts: ['webos', 'launchos', 'commerceos', 'growthos', 'luna-ai'],
    cta: 'Assinar Scale',
  },
];

export const ENTERPRISE_TIER = {
  name: 'Enterprise',
  description: 'Para empresas com necessidades específicas de integração e SLA.',
  features: [
    'Tudo do Scale',
    'SLA contratual e ambiente dedicado',
    'Integrações e automações sob medida',
    'Onboarding assistido',
  ],
  cta: 'Falar com vendas',
  contactHref: 'mailto:vendas@aster.com.br?subject=Plano%20Enterprise',
};

export function findTierForProduct(productSlug: string | null): PlanTier | undefined {
  if (!productSlug) return undefined;
  return PLAN_TIERS.find((tier) => tier.includedProducts.includes(productSlug as ProductSlug));
}

export type BackendPlan = {
  id: string;
  name: string;
  slug: string;
  description: string;
  features: string[];
  price: number;
  annualPrice: number | null;
  status: 'ACTIVE' | 'ARCHIVED';
};

// Mirrors server/prisma/seed.ts so the pricing page can render instantly,
// before /api/plans responds (or if it's ever unavailable).
export const FALLBACK_PLANS: BackendPlan[] = [
  {
    id: 'fallback-starter',
    name: 'Starter',
    slug: 'starter',
    description: 'Para quem está começando a estruturar a operação digital.',
    features: [
      'Até 3 usuários',
      '1 sistema ASTER incluso (WebOS)',
      'Até 1.000 visitas/mês',
      'Suporte por chat',
      'Integrações essenciais (analytics, e-mail)',
    ],
    price: 19700,
    annualPrice: 196800,
    status: 'ACTIVE',
  },
  {
    id: 'fallback-growth',
    name: 'Growth',
    slug: 'growth',
    description: 'Para quem já vende e precisa escalar com automação.',
    features: [
      'Até 10 usuários',
      '2 sistemas ASTER inclusos (LaunchOS + CommerceOS)',
      'Até 10.000 visitas/mês',
      'Suporte prioritário',
      'Integrações ilimitadas + API',
    ],
    price: 69700,
    annualPrice: 697200,
    status: 'ACTIVE',
  },
  {
    id: 'fallback-scale',
    name: 'Scale',
    slug: 'scale',
    description: 'Para operações de alto volume e múltiplos canais.',
    features: [
      'Usuários ilimitados',
      'Todos os sistemas ASTER inclusos (WebOS, LaunchOS, CommerceOS, GrowthOS)',
      'Visitas ilimitadas',
      'Agentes de IA inclusos',
      'Gerente de conta dedicado',
    ],
    price: 179700,
    annualPrice: 1796400,
    status: 'ACTIVE',
  },
];
