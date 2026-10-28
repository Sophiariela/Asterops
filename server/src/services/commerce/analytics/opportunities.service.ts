import { prisma } from '../../../lib/prisma.js';
import { daysAgo, REVENUE_STATUSES } from './dateRanges.js';

export type Opportunity = {
  key: 'restock' | 'reactivation' | 'cart-recovery';
  label: string;
  available: boolean;
  estimate: number; // cents
  basis: string;
  items?: { label: string; estimate: number }[];
};

const RESTOCK_WINDOW_DAYS = 14; // assumed length of a stockout before someone notices and reorders
const REACTIVATION_WIN_BACK_RATE = 0.2; // assumption, shown in the UI — not a measured conversion rate

export async function getOpportunities(ownerId: string): Promise<{ opportunities: Opportunity[]; total: number }> {
  const now = new Date();
  const d60 = daysAgo(60);

  const [outOfStock, salesHistory, customers] = await Promise.all([
    prisma.product.findMany({
      where: { ownerId, status: 'ACTIVE', stockQuantity: { lte: 0 } },
      select: { id: true, name: true, price: true },
    }),
    prisma.commerceOrderItem.findMany({
      where: { order: { ownerId, status: { in: [...REVENUE_STATUSES] }, createdAt: { gte: d60, lt: now } } },
      select: { productId: true, quantity: true },
    }),
    prisma.commerceCustomer.findMany({
      where: { ownerId },
      select: {
        id: true,
        name: true,
        orders: { where: { status: { in: [...REVENUE_STATUSES] } }, select: { createdAt: true, total: true } },
      },
    }),
  ]);

  const dailyVelocity = new Map<string, number>();
  for (const item of salesHistory) {
    dailyVelocity.set(item.productId, (dailyVelocity.get(item.productId) ?? 0) + item.quantity / 60);
  }

  const restockItems = outOfStock
    .map((p) => {
      const velocity = dailyVelocity.get(p.id) ?? 0;
      const estimate = Math.round(velocity * RESTOCK_WINDOW_DAYS * p.price);
      return { label: p.name, estimate };
    })
    .filter((i) => i.estimate > 0)
    .sort((a, b) => b.estimate - a.estimate);

  const dormant = customers
    .map((c) => {
      const paidOrders = c.orders;
      if (paidOrders.length === 0) return null;
      const lastOrderAt = paidOrders.reduce((max, o) => (o.createdAt > max ? o.createdAt : max), paidOrders[0].createdAt);
      if (lastOrderAt >= d60) return null;
      const avgOrderValue = paidOrders.reduce((sum, o) => sum + o.total, 0) / paidOrders.length;
      return { label: c.name, estimate: Math.round(avgOrderValue * REACTIVATION_WIN_BACK_RATE) };
    })
    .filter((x): x is { label: string; estimate: number } => x !== null)
    .sort((a, b) => b.estimate - a.estimate);

  const opportunities: Opportunity[] = [
    {
      key: 'restock',
      label: 'Reabastecer produtos sem estoque',
      available: restockItems.length > 0,
      estimate: restockItems.reduce((s, i) => s + i.estimate, 0),
      basis: `Estimado a partir da venda média diária de cada produto nos últimos 60 dias × ${RESTOCK_WINDOW_DAYS} dias sem estoque.`,
      items: restockItems.slice(0, 5),
    },
    {
      key: 'reactivation',
      label: 'Reengajar clientes inativos',
      available: dormant.length > 0,
      estimate: dormant.reduce((s, i) => s + i.estimate, 0),
      basis: `${dormant.length} cliente(s) inativo(s) há mais de 60 dias, avaliados pelo pedido médio × uma taxa de reconquista assumida de ${Math.round(REACTIVATION_WIN_BACK_RATE * 100)}% — uma suposição, não uma taxa de conversão medida.`,
      items: dormant.slice(0, 5),
    },
    {
      key: 'cart-recovery',
      label: 'Recuperar carrinhos abandonados',
      available: false,
      estimate: 0,
      basis: 'Requer rastreamento de carrinho/sessão, que o CommerceOS ainda não instrumenta.',
    },
  ];

  return { opportunities, total: opportunities.reduce((s, o) => s + o.estimate, 0) };
}
