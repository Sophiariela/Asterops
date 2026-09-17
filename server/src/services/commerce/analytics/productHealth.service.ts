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
        label: 'Sales velocity',
        available: true,
        score: velocityScore,
        detail: `${velocity.recent} units sold in the last 30 days${declining ? ' — down from the 30 days before' : ''}`,
      },
      {
        key: 'inventory',
        label: 'Inventory level',
        available: true,
        score: inventoryScore,
        detail: `${p.stockQuantity} on hand, reorder point ${p.reorderPoint}`,
      },
      {
        key: 'margin',
        label: 'Profit margin',
        available: marginAvailable,
        score: marginScore,
        detail: marginAvailable ? `${Math.round((marginPct as number) * 100)}% margin` : 'Set a cost price to track margin',
      },
      { key: 'conversion', label: 'Conversion rate', available: false, score: null, detail: 'Needs storefront page-view tracking (not yet instrumented)' },
      { key: 'satisfaction', label: 'Customer satisfaction', available: false, score: null, detail: 'Needs review/rating data (not yet collected)' },
    ];

    const availableScores = factors.filter((f) => f.available && f.score !== null).map((f) => f.score as number);
    const score = availableScores.length ? Math.round(availableScores.reduce((a, b) => a + b, 0) / availableScores.length) : 0;

    const badges: ProductHealth['badges'] = [];
    if (velocityScore >= 70) badges.push({ tone: 'good', label: 'Strong sales' });
    if (declining) badges.push({ tone: 'warn', label: 'Sales declining' });
    if (inventoryScore >= 100) badges.push({ tone: 'good', label: 'Healthy inventory' });
    if (inventoryScore <= 40) badges.push({ tone: 'warn', label: p.stockQuantity <= 0 ? 'Out of stock' : 'Low stock' });
    if (marginScore !== null && marginScore >= 70) badges.push({ tone: 'good', label: 'High margin' });
    if (marginScore !== null && marginScore < 30) badges.push({ tone: 'warn', label: 'Thin margin' });
    if (velocityScore <= 15 && velocity.recent === 0) badges.push({ tone: 'warn', label: 'No recent sales' });

    return { productId: p.id, name: p.name, score, factors, badges };
  });
}
