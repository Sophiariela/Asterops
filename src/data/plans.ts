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
    includedProducts: ['webos', 'launchos', 'commerceos', 'growthos', 'agents'],
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
