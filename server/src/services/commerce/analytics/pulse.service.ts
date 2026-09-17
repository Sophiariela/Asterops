import { prisma } from '../../../lib/prisma.js';
import { daysAgo, pctChange, REVENUE_STATUSES } from './dateRanges.js';

export type BusinessPulse = {
  revenue: { current: number; previous: number; pctChange: number | null };
  orders: { current: number; previous: number; pctChange: number | null };
  newCustomers: { current: number; previous: number; pctChange: number | null };
  lowStockCount: number;
  lowStockProducts: { id: string; name: string; stockQuantity: number; reorderPoint: number }[];
  dormantCustomerCount: number;
  dormantCustomers: { id: string; name: string; lastOrderAt: string }[];
  topProducts: { id: string; name: string; unitsSold: number; revenue: number }[];
  recommendedActions: string[];
};

export async function getBusinessPulse(ownerId: string): Promise<BusinessPulse> {
  const now = new Date();
  const d7 = daysAgo(7);
  const d14 = daysAgo(14);
  const d30 = daysAgo(30);
  const d60 = daysAgo(60);

  const revenueWhere = (from: Date, to: Date) => ({
    ownerId,
    status: { in: [...REVENUE_STATUSES] },
    createdAt: { gte: from, lt: to },
  });

  const [
    ordersLast7,
    ordersPrev7,
    newCustomersLast7,
    newCustomersPrev7,
    lowStockProducts,
    orderItemsLast30,
    activeCustomers,
  ] = await Promise.all([
    prisma.commerceOrder.findMany({ where: revenueWhere(d7, now), select: { total: true } }),
    prisma.commerceOrder.findMany({ where: revenueWhere(d14, d7), select: { total: true } }),
    prisma.commerceCustomer.count({ where: { ownerId, createdAt: { gte: d7, lt: now } } }),
    prisma.commerceCustomer.count({ where: { ownerId, createdAt: { gte: d14, lt: d7 } } }),
    prisma.product.findMany({
      where: { ownerId, status: 'ACTIVE' },
      select: { id: true, name: true, stockQuantity: true, reorderPoint: true },
      orderBy: { stockQuantity: 'asc' },
    }),
    prisma.commerceOrderItem.findMany({
      where: { order: { ownerId, status: { in: [...REVENUE_STATUSES] }, createdAt: { gte: d30, lt: now } } },
      select: { productId: true, quantity: true, unitPrice: true, product: { select: { name: true } } },
    }),
    prisma.commerceCustomer.findMany({
      where: { ownerId },
      select: {
        id: true,
        name: true,
        orders: {
          where: { status: { in: [...REVENUE_STATUSES] } },
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { createdAt: true },
        },
      },
    }),
  ]);

  const revenueCurrent = ordersLast7.reduce((sum, o) => sum + o.total, 0);
  const revenuePrevious = ordersPrev7.reduce((sum, o) => sum + o.total, 0);

  const lowStock = lowStockProducts.filter((p) => p.stockQuantity <= p.reorderPoint);

  const byProduct = new Map<string, { name: string; unitsSold: number; revenue: number }>();
  for (const item of orderItemsLast30) {
    const entry = byProduct.get(item.productId) ?? { name: item.product.name, unitsSold: 0, revenue: 0 };
    entry.unitsSold += item.quantity;
    entry.revenue += item.quantity * item.unitPrice;
    byProduct.set(item.productId, entry);
  }
  const topProducts = [...byProduct.entries()]
    .sort((a, b) => b[1].revenue - a[1].revenue)
    .slice(0, 5)
    .map(([id, v]) => ({ id, ...v }));

  const dormant = activeCustomers
    .filter((c) => c.orders.length > 0 && c.orders[0].createdAt < d60)
    .map((c) => ({ id: c.id, name: c.name, lastOrderAt: c.orders[0].createdAt.toISOString() }));

  const recommendedActions: string[] = [];
  const topLowStock = topProducts.find((tp) => lowStock.some((ls) => ls.id === tp.id));
  if (topLowStock) {
    recommendedActions.push(`"${topLowStock.name}" is a top seller and running low — restock it before it goes out of stock.`);
  } else if (lowStock.length > 0) {
    recommendedActions.push(`${lowStock.length} product(s) are running low on stock — review reorder points.`);
  }
  if (dormant.length > 0) {
    recommendedActions.push(`${dormant.length} customer(s) haven't ordered in 60+ days — consider a win-back offer.`);
  }
  const revTrend = pctChange(revenueCurrent, revenuePrevious);
  if (revTrend !== null && revTrend <= -15) {
    recommendedActions.push(`Revenue is down ${Math.abs(revTrend)}% week-over-week — worth investigating before it compounds.`);
  }
  if (topProducts.length > 0 && recommendedActions.length < 3) {
    recommendedActions.push(`"${topProducts[0].name}" is outperforming everything else — consider featuring it or bundling with slower movers.`);
  }

  return {
    revenue: { current: revenueCurrent, previous: revenuePrevious, pctChange: pctChange(revenueCurrent, revenuePrevious) },
    orders: {
      current: ordersLast7.length,
      previous: ordersPrev7.length,
      pctChange: pctChange(ordersLast7.length, ordersPrev7.length),
    },
    newCustomers: {
      current: newCustomersLast7,
      previous: newCustomersPrev7,
      pctChange: pctChange(newCustomersLast7, newCustomersPrev7),
    },
    lowStockCount: lowStock.length,
    lowStockProducts: lowStock.slice(0, 5),
    dormantCustomerCount: dormant.length,
    dormantCustomers: dormant.slice(0, 5),
    topProducts,
    recommendedActions: recommendedActions.slice(0, 3),
  };
}
