import { prisma } from '../../../lib/prisma.js';
import { daysAgo, REVENUE_STATUSES } from './dateRanges.js';

type Factor = {
  key: 'velocity' | 'inventory' | 'margin' | 'conversion' | 'satisfaction';
  label: string;
  available: boolean;
  score: number | null;
  detail: string;
};

export type ProductHealth = {
  productId: string;
  name: string;
  score: number;
  factors: Factor[];
  badges: { tone: 'good' | 'warn'; label: string }[];
};

// Two factors from the original brief — conversion rate and customer
// satisfaction — need data CommerceOS doesn't collect yet (page-view/session
// tracking, reviews). They're returned as unavailable rather than guessed,
// and excluded from the score average so they can't silently drag it down
// or inflate it with a fabricated number.
export async function getProductHealthScores(ownerId: string): Promise<ProductHealth[]> {
  const now = new Date();
  const d30 = daysAgo(30);
  const d60 = daysAgo(60);

  const products = await prisma.product.findMany({
    where: { ownerId, status: 'ACTIVE' },
    select: { id: true, name: true, price: true, costPrice: true, stockQuantity: true, reorderPoint: true },
  });

  const items = await prisma.commerceOrderItem.findMany({
    where: { order: { ownerId, status: { in: [...REVENUE_STATUSES] }, createdAt: { gte: d60, lt: now } } },
    select: { productId: true, quantity: true, order: { select: { createdAt: true } } },
  });

  const velocityByProduct = new Map<string, { recent: number; prior: number }>();
  for (const item of items) {
    const bucket = item.order.createdAt >= d30 ? 'recent' : 'prior';
    const entry = velocityByProduct.get(item.productId) ?? { recent: 0, prior: 0 };
    entry[bucket] += item.quantity;
    velocityByProduct.set(item.productId, entry);
  }
  const maxRecentUnits = Math.max(1, ...[...velocityByProduct.values()].map((v) => v.recent));

  return products.map((p) => {
    const velocity = velocityByProduct.get(p.id) ?? { recent: 0, prior: 0 };
    const velocityScore = Math.round((velocity.recent / maxRecentUnits) * 100);
    const declining = velocity.prior > 0 && velocity.recent < velocity.prior * 0.8;

    let inventoryScore: number;
    if (p.stockQuantity <= 0) inventoryScore = 0;
    else if (p.stockQuantity <= p.reorderPoint) inventoryScore = 40;
    else if (p.stockQuantity <= p.reorderPoint * 2) inventoryScore = 70;
    else inventoryScore = 100;

    const marginAvailable = p.costPrice != null && p.price > 0;
    const marginPct = marginAvailable ? (p.price - (p.costPrice as number)) / p.price : null;
    const marginScore = marginAvailable ? Math.max(0, Math.min(100, Math.round(((marginPct as number) / 0.5) * 100))) : null;

    const factors: Factor[] = [
      {
        key: 'velocity',
        label: 'Velocidade de vendas',
        available: true,
        score: velocityScore,
        detail: `${velocity.recent} unidade(s) vendida(s) nos últimos 30 dias${declining ? ' — queda em relação aos 30 dias anteriores' : ''}`,
      },
      {
        key: 'inventory',
        label: 'Nível de estoque',
        available: true,
        score: inventoryScore,
        detail: `${p.stockQuantity} em estoque, ponto de reposição ${p.reorderPoint}`,
      },
      {
        key: 'margin',
        label: 'Margem de lucro',
        available: marginAvailable,
        score: marginScore,
        detail: marginAvailable ? `${Math.round((marginPct as number) * 100)}% de margem` : 'Defina um preço de custo para acompanhar a margem',
      },
      { key: 'conversion', label: 'Taxa de conversão', available: false, score: null, detail: 'Precisa de rastreamento de visualizações na loja (ainda não instrumentado)' },
      { key: 'satisfaction', label: 'Satisfação do cliente', available: false, score: null, detail: 'Precisa de dados de avaliação/nota (ainda não coletados)' },
    ];

    const availableScores = factors.filter((f) => f.available && f.score !== null).map((f) => f.score as number);
    const score = availableScores.length ? Math.round(availableScores.reduce((a, b) => a + b, 0) / availableScores.length) : 0;

    const badges: ProductHealth['badges'] = [];
    if (velocityScore >= 70) badges.push({ tone: 'good', label: 'Vendas fortes' });
    if (declining) badges.push({ tone: 'warn', label: 'Vendas em queda' });
    if (inventoryScore >= 100) badges.push({ tone: 'good', label: 'Estoque saudável' });
    if (inventoryScore <= 40) badges.push({ tone: 'warn', label: p.stockQuantity <= 0 ? 'Sem estoque' : 'Estoque baixo' });
    if (marginScore !== null && marginScore >= 70) badges.push({ tone: 'good', label: 'Margem alta' });
    if (marginScore !== null && marginScore < 30) badges.push({ tone: 'warn', label: 'Margem baixa' });
    if (velocityScore <= 15 && velocity.recent === 0) badges.push({ tone: 'warn', label: 'Sem vendas recentes' });

    return { productId: p.id, name: p.name, score, factors, badges };
  });
}
