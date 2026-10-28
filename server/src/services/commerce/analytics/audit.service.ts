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
      label: 'Sinais de confiança do produto',
      measured: true,
      penalty,
      detail: `${missing} de ${products.length} produtos ativos estão sem descrição ou imagem.`,
      recommendation: penalty > 0 ? `Adicione descrições e imagens aos ${missing} produto(s) que estão sem — anúncios incompletos convertem pior.` : null,
    });
  } else {
    checks.push({ key: 'trust-signals', label: 'Sinais de confiança do produto', measured: false, penalty: 0, detail: 'Nenhum produto ativo ainda.', recommendation: null });
  }

  // 2. Inventory risk
  if (products.length > 0) {
    const atRisk = products.filter((p) => p.stockQuantity <= p.reorderPoint).length;
    const pct = atRisk / products.length;
    const penalty = Math.round(pct * 25);
    checks.push({
      key: 'inventory-risk',
      label: 'Risco de estoque',
      measured: true,
      penalty,
      detail: `${atRisk} de ${products.length} produtos ativos estão no ponto de reposição ou abaixo dele.`,
      recommendation: penalty > 0 ? `${atRisk} produto(s) em risco de estoque — reabasteça antes que faltem.` : null,
    });
  } else {
    checks.push({ key: 'inventory-risk', label: 'Risco de estoque', measured: false, penalty: 0, detail: 'Nenhum produto ativo ainda.', recommendation: null });
  }

  // 3. Returning customer rate
  const customersWithOrders = customers.filter((c) => c.orders.length > 0);
  if (customersWithOrders.length > 0) {
    const returning = customersWithOrders.filter((c) => c.orders.length > 1).length;
    const rate = returning / customersWithOrders.length;
    const penalty = rate >= RETURNING_CUSTOMER_TARGET ? 0 : Math.round((1 - rate / RETURNING_CUSTOMER_TARGET) * 25);
    checks.push({
      key: 'returning-customers',
      label: 'Taxa de clientes recorrentes',
      measured: true,
      penalty,
      detail: `${Math.round(rate * 100)}% dos clientes compraram mais de uma vez (meta: ${Math.round(RETURNING_CUSTOMER_TARGET * 100)}%+).`,
      recommendation: penalty > 0 ? 'A taxa de clientes recorrentes está abaixo da meta — uma oferta de reconquista ou fidelidade ajudaria.' : null,
    });
  } else {
    checks.push({ key: 'returning-customers', label: 'Taxa de clientes recorrentes', measured: false, penalty: 0, detail: 'Nenhum pedido ainda.', recommendation: null });
  }

  // 4. Catalog completeness
  if (products.length > 0) {
    const uncategorized = products.filter((p) => !p.categoryId).length;
    const pct = uncategorized / products.length;
    const penalty = Math.round(pct * 25);
    checks.push({
      key: 'catalog-completeness',
      label: 'Completude do catálogo',
      measured: true,
      penalty,
      detail: `${uncategorized} de ${products.length} produtos ativos estão sem categoria.`,
      recommendation: penalty > 0 ? `Categorize o(s) ${uncategorized} produto(s) sem categoria para que os clientes possam navegar e filtrar.` : null,
    });
  } else {
    checks.push({ key: 'catalog-completeness', label: 'Completude do catálogo', measured: false, penalty: 0, detail: 'Nenhum produto ativo ainda.', recommendation: null });
  }

  // 5. Cart abandonment — explicitly not measured, shown for transparency rather than silently omitted.
  checks.push({
    key: 'cart-abandonment',
    label: 'Abandono de carrinho',
    measured: false,
    penalty: 0,
    detail: 'Ainda não medido — requer rastreamento de carrinho/sessão, que o CommerceOS não instrumenta.',
    recommendation: null,
  });

  const score = Math.max(0, 100 - checks.reduce((s, c) => s + c.penalty, 0));
  const recommendations = checks.map((c) => c.recommendation).filter((r): r is string => r !== null);

  return { score, checks, recommendations };
}
