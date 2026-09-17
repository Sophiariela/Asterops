import { prisma } from '../../../lib/prisma.js';
import { runConversionAudit } from './conversionAudit.service.js';
import { getTrustGaps } from './trustEngine.service.js';

export type RecommendedAction = { label: string; source: 'conversion' | 'trust' | 'leads' };

// Conversion Audit and the Trust Engine both surface a "missing
// testimonials" signal — Trust Engine's wording is the one shown here,
// so this check's own recommendation is skipped rather than shown twice.
const SUPERSEDED_BY_TRUST_ENGINE = 'trust-signals';

export async function getRecommendedActions(ownerId: string, siteId: string): Promise<RecommendedAction[]> {
  const [audit, trust, newLeadCount] = await Promise.all([
    runConversionAudit(ownerId, siteId),
    getTrustGaps(ownerId, siteId),
    prisma.lead.count({ where: { siteId, status: 'NEW' } }),
  ]);

  const actions: RecommendedAction[] = [];

  if (newLeadCount > 0) {
    actions.push({ label: `Follow up with ${newLeadCount} new lead(s) waiting for a response.`, source: 'leads' });
  }
  if (trust.recommendation) {
    actions.push({ label: trust.recommendation, source: 'trust' });
  }
  for (const check of audit.checks) {
    if (check.key === SUPERSEDED_BY_TRUST_ENGINE) continue;
    if (check.recommendation) actions.push({ label: check.recommendation, source: 'conversion' });
  }

  return actions.slice(0, 6);
}
