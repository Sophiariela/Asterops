export type PlanTier = {
  slug: 'starter' | 'growth' | 'business' | 'scale';
  name: string;
  description: string;
  features: string[];
  highlight?: boolean;
  cta: string;
};

// Display config for the real DB-backed plans (see server/prisma/seed.ts).
// Prices themselves are never hardcoded here — only name/description/
// features/cta, which are safe presentation concerns. The actual price
// and annualPrice always come from GET /api/plans.
export const PLAN_TIERS: PlanTier[] = [
  {
    slug: 'starter',
    name: 'Starter',
    description: 'Para pequenos negócios que estão estruturando a presença digital.',
    features: [
      'Site profissional com WebOS',
      'Acesso à Biblioteca de Templates',
      'Personalização de texto, cores e imagens',
      'Publicação com domínio ASTER',
    ],
    cta: 'Começar com Starter',
  },
  {
    slug: 'growth',
    name: 'Growth',
    description: 'Para negócios que precisam de reservas, agendamentos e mais geração de clientes.',
    features: [
      'Tudo do Starter',
      'Reservas, agendamentos e pedidos de orçamento',
      'Captação e gestão de clientes (leads)',
      'Avaliações de clientes',
      'Sugestões da Luna AI',
    ],
    highlight: true,
    cta: 'Assinar Growth',
  },
  {
    slug: 'business',
    name: 'Business',
    description: 'Para negócios com catálogo de produtos e operação comercial mais robusta.',
    features: [
      'Tudo do Growth',
      'Catálogo de produtos com CommerceOS',
      'Controle de estoque e pedidos',
      'Painel de análise do negócio',
    ],
    cta: 'Assinar Business',
  },
  {
    slug: 'scale',
    name: 'Scale',
    description: 'Para operações maiores, com necessidades específicas de suporte e integração.',
    features: [
      'Tudo do Business',
      'Suporte prioritário',
      'Onboarding assistido',
      'Condições sob consulta para necessidades maiores',
    ],
    cta: 'Assinar Scale',
  },
];

export function findTierForSlug(slug: string | null): PlanTier | undefined {
  if (!slug) return undefined;
  return PLAN_TIERS.find((tier) => tier.slug === slug);
}

// Which plan tier to highlight when a visitor arrives from a specific
// product page's "Ver planos" CTA (/plans?product=<slug>) — a direct
// mapping instead of a product-bundling list, since tiers are no longer
// structured as "N systems included".
const PRODUCT_TO_TIER: Record<string, PlanTier['slug']> = {
  webos: 'starter',
  'luna-ai': 'growth',
  commerceos: 'business',
};

export function findTierForProduct(productSlug: string | null): PlanTier | undefined {
  if (!productSlug) return undefined;
  const tierSlug = PRODUCT_TO_TIER[productSlug];
  return tierSlug ? findTierForSlug(tierSlug) : undefined;
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
// before /api/plans responds (or if it's ever unavailable). Values here
// are a presentation fallback only — the DB (and Stripe) remain the
// actual billing source of truth.
export const FALLBACK_PLANS: BackendPlan[] = [
  {
    id: 'fallback-starter',
    name: 'Starter',
    slug: 'starter',
    description: 'Para pequenos negócios que estão estruturando a presença digital.',
    features: PLAN_TIERS[0].features,
    price: 9900,
    annualPrice: 100800,
    status: 'ACTIVE',
  },
  {
    id: 'fallback-growth',
    name: 'Growth',
    slug: 'growth',
    description: 'Para negócios que precisam de reservas, agendamentos e mais geração de clientes.',
    features: PLAN_TIERS[1].features,
    price: 19900,
    annualPrice: 202800,
    status: 'ACTIVE',
  },
  {
    id: 'fallback-business',
    name: 'Business',
    slug: 'business',
    description: 'Para negócios com catálogo de produtos e operação comercial mais robusta.',
    features: PLAN_TIERS[2].features,
    price: 39900,
    annualPrice: 406800,
    status: 'ACTIVE',
  },
  {
    id: 'fallback-scale',
    name: 'Scale',
    slug: 'scale',
    description: 'Para operações maiores, com necessidades específicas de suporte e integração.',
    features: PLAN_TIERS[3].features,
    price: 79900,
    annualPrice: 814800,
    status: 'ACTIVE',
  },
];
