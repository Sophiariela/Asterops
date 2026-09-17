import { prisma } from '../../../lib/prisma.js';
import { REVENUE_STATUSES } from './dateRanges.js';

export type AuditCheck = {
  key: string;
  label: string;
  measured: boolean;
  penalty: number;
  detail: string;
  recommendation: string | null;
};

export type AuditResult = {
  score: number;
  checks: AuditCheck[];
  recommendations: string[];
};

const RETURNING_CUSTOMER_TARGET = 0.25; // a common ecommerce benchmark, used only as a comparison point in the UI

export async function runCommerceAudit(ownerId: string): Promise<AuditResult> {
  const [products, customers] = await Promise.all([
    prisma.product.findMany({
      where: { ownerId, status: 'ACTIVE' },
      select: { description: true, imageUrl: true, categoryId: true, stockQuantity: true, reorderPoint: true },
    }),
    prisma.commerceCustomer.findMany({
      where: { ownerId },
      select: { orders: { where: { status: { in: [...REVENUE_STATUSES] } }, select: { id: true } } },
    }),
  ]);

  const checks: AuditCheck[] = [];

  // 1. Trust signals
  if (products.length > 0) {
    const missing = products.filter((p) => !p.description || !p.imageUrl).length;
    const pct = missing / products.length;
    const penalty = Math.round(pct * 25);
    checks.push({
      key: 'trust-signals',
      label: 'Product trust signals',
      measured: true,
      penalty,
      detail: `${missing} of ${products.length} active products are missing a description or image.`,
      recommendation: penalty > 0 ? `Add descriptions and images to the ${missing} product(s) missing them — bare listings convert worse.` : null,
    });
  } else {
    checks.push({ key: 'trust-signals', label: 'Product trust signals', measured: false, penalty: 0, detail: 'No active products yet.', recommendation: null });
  }

  // 2. Inventory risk
  if (products.length > 0) {
    const atRisk = products.filter((p) => p.stockQuantity <= p.reorderPoint).length;
    const pct = atRisk / products.length;
    const penalty = Math.round(pct * 25);
    checks.push({
      key: 'inventory-risk',
      label: 'Inventory risk',
      measured: true,
      penalty,
      detail: `${atRisk} of ${products.length} active products are at or below their reorder point.`,
      recommendation: penalty > 0 ? `${atRisk} product(s) are at inventory risk — restock before they stock out.` : null,
    });
  } else {
    checks.push({ key: 'inventory-risk', label: 'Inventory risk', measured: false, penalty: 0, detail: 'No active products yet.', recommendation: null });
  }

  // 3. Returning customer rate
  const customersWithOrders = customers.filter((c) => c.orders.length > 0);
  if (customersWithOrders.length > 0) {
    const returning = customersWithOrders.filter((c) => c.orders.length > 1).length;
    const rate = returning / customersWithOrders.length;
    const penalty = rate >= RETURNING_CUSTOMER_TARGET ? 0 : Math.round((1 - rate / RETURNING_CUSTOMER_TARGET) * 25);
    checks.push({
      key: 'returning-customers',
      label: 'Returning customer rate',
      measured: true,
      penalty,
      detail: `${Math.round(rate * 100)}% of customers have ordered more than once (target: ${Math.round(RETURNING_CUSTOMER_TARGET * 100)}%+).`,
      recommendation: penalty > 0 ? 'Returning customer rate is below target — a win-back or loyalty offer would help.' : null,
    });
  } else {
    checks.push({ key: 'returning-customers', label: 'Returning customer rate', measured: false, penalty: 0, detail: 'No orders yet.', recommendation: null });
  }

  // 4. Catalog completeness
  if (products.length > 0) {
    const uncategorized = products.filter((p) => !p.categoryId).length;
    const pct = uncategorized / products.length;
    const penalty = Math.round(pct * 25);
    checks.push({
      key: 'catalog-completeness',
      label: 'Catalog completeness',
      measured: true,
      penalty,
      detail: `${uncategorized} of ${products.length} active products have no category.`,
      recommendation: penalty > 0 ? `Categorize the ${uncategorized} uncategorized product(s) so customers can browse and filter.` : null,
    });
  } else {
    checks.push({ key: 'catalog-completeness', label: 'Catalog completeness', measured: false, penalty: 0, detail: 'No active products yet.', recommendation: null });
  }

  // 5. Cart abandonment — explicitly not measured, shown for transparency rather than silently omitted.
  checks.push({
    key: 'cart-abandonment',
    label: 'Cart abandonment',
    measured: false,
    penalty: 0,
    detail: 'Not measured yet — requires cart/session tracking, which CommerceOS does not instrument.',
    recommendation: null,
  });

  const score = Math.max(0, 100 - checks.reduce((s, c) => s + c.penalty, 0));
  const recommendations = checks.map((c) => c.recommendation).filter((r): r is string => r !== null);

  return { score, checks, recommendations };
}
