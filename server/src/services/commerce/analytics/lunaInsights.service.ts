import type Anthropic from '@anthropic-ai/sdk';
import { anthropic } from '../../../lib/anthropic.js';
import { CommerceError } from '../../../lib/commerceError.js';
import { translateAnthropicError } from '../../../lib/anthropicErrors.js';
import { prisma } from '../../../lib/prisma.js';
import { getBusinessPulse } from './pulse.service.js';
import { getProductHealthScores } from './productHealth.service.js';
import { getOpportunities } from './opportunities.service.js';
import { runCommerceAudit } from './audit.service.js';
import { REVENUE_STATUSES } from './dateRanges.js';

const SYSTEM_PROMPT = `You are Luna, ASTER's business-intelligence assistant embedded in CommerceOS.
You are given a JSON snapshot of one merchant's real store data — revenue/order/customer trends,
per-product health scores, revenue-recovery opportunities, a rules-based audit, and frequently
co-purchased product pairs.

Write 3 to 5 short insight bullets a busy business owner can act on today. Each bullet:
- states a concrete observation grounded ONLY in the numbers given (never invent a stat not present in the data)
- prefers a causal or comparative framing when the data supports it ("X happened after Y", "A correlates with B")
- ends with a specific recommended action when one is obvious
- is one sentence, plain language, no jargon, no preamble, no markdown headers

Output ONLY the bullets, one per line, each starting with "- ". Nothing else.`;

async function getCoPurchasePairs(ownerId: string, limit = 3) {
  const items = await prisma.commerceOrderItem.findMany({
    where: { order: { ownerId, status: { in: [...REVENUE_STATUSES] } } },
    select: { orderId: true, product: { select: { name: true } } },
  });
  const byOrder = new Map<string, string[]>();
  for (const item of items) {
    const list = byOrder.get(item.orderId) ?? [];
    list.push(item.product.name);
    byOrder.set(item.orderId, list);
  }
  const pairCounts = new Map<string, number>();
  for (const names of byOrder.values()) {
    const unique = [...new Set(names)];
    for (let i = 0; i < unique.length; i += 1) {
      for (let j = i + 1; j < unique.length; j += 1) {
        const key = [unique[i], unique[j]].sort().join(' + ');
        pairCounts.set(key, (pairCounts.get(key) ?? 0) + 1);
      }
    }
  }
  return [...pairCounts.entries()]
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([pair, count]) => ({ pair, orders: count }));
}

export async function getLunaInsights(ownerId: string): Promise<{ insights: string[] }> {
  if (!anthropic) {
    throw new CommerceError(503, 'Luna AI is not configured on this server yet.');
  }

  const [pulse, health, opportunities, audit, coPurchases] = await Promise.all([
    getBusinessPulse(ownerId),
    getProductHealthScores(ownerId),
    getOpportunities(ownerId),
    runCommerceAudit(ownerId),
    getCoPurchasePairs(ownerId),
  ]);

  const snapshot = {
    revenue: pulse.revenue,
    orders: pulse.orders,
    newCustomers: pulse.newCustomers,
    lowStockCount: pulse.lowStockCount,
    dormantCustomerCount: pulse.dormantCustomerCount,
    topProducts: pulse.topProducts.slice(0, 3),
    productHealth: health
      .slice()
      .sort((a, b) => a.score - b.score)
      .slice(0, 3)
      .map((h) => ({ name: h.name, score: h.score, badges: h.badges.map((b) => b.label) })),
    opportunities: opportunities.opportunities.filter((o) => o.available).map((o) => ({ label: o.label, estimateCents: o.estimate })),
    auditScore: audit.score,
    auditRecommendations: audit.recommendations,
    frequentlyCoPurchased: coPurchases,
  };

  if (pulse.orders.current === 0 && pulse.orders.previous === 0 && health.length === 0) {
    return { insights: ["There isn't enough store activity yet for Luna to find a pattern — add products and a few orders first."] };
  }

  let response: Anthropic.Message;
  try {
    response = await anthropic.messages.create({
      model: 'claude-opus-5',
      max_tokens: 1024,
      output_config: { effort: 'medium' },
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: JSON.stringify(snapshot) }],
    });
  } catch (err) {
    translateAnthropicError(err);
  }

  const text = response.content
    .filter((block): block is Extract<typeof block, { type: 'text' }> => block.type === 'text')
    .map((block) => block.text)
    .join('\n');

  const insights = text
    .split('\n')
    .map((line) => line.replace(/^-\s*/, '').trim())
    .filter(Boolean);

  return { insights: insights.length ? insights : [text.trim()].filter(Boolean) };
}
