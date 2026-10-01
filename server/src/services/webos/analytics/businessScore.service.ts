import { prisma } from '../../../lib/prisma.js';
import { CommerceError } from '../../../lib/commerceError.js';

type Factor = {
  key: 'responseTime' | 'followUpRate' | 'reservationCompletion' | 'reviewsCollected' | 'conversionRate';
  label: string;
  available: boolean;
  score: number | null;
  detail: string;
};

export type BusinessScore = {
  siteId: string;
  score: number;
  factors: Factor[];
  recommendations: string[];
};

// A minimum-viable bar for review volume, same shape as TESTIMONIAL_TARGET
// in shared.ts but scoped to raw review submissions, not published ones.
const REVIEW_TARGET = 10;

function scoreFromHours(hours: number): number {
  if (hours <= 1) return 100;
  if (hours <= 4) return 85;
  if (hours <= 24) return 60;
  if (hours <= 72) return 35;
  return 15;
}

// A single 0-100 read on how well the business itself is being run day to
// day, distinct from WebsiteHealth (which scores the site's content).
// Every factor that needs a minimum sample size before it means anything
// is marked unavailable rather than scored as 0 — a brand-new site with
// zero leads isn't "failing at follow-up", it just hasn't started yet.
export async function getBusinessScore(ownerId: string, siteId: string): Promise<BusinessScore> {
  const site = await prisma.site.findFirst({
    where: { id: siteId, ownerId },
    select: {
      leads: { select: { status: true, createdAt: true, updatedAt: true } },
      reservations: { select: { status: true, reservationAt: true } },
      _count: { select: { reviews: true } },
    },
  });
  if (!site) throw new CommerceError(404, 'Site not found.');

  const { leads, reservations } = site;
  const reviewCount = site._count.reviews;

  // 1. Response time — average hours-to-first-action across leads that
  // have moved past Lead (updatedAt then reflects the status change).
  const respondedLeads = leads.filter((l) => l.status !== 'LEAD');
  const responseFactor: Factor = respondedLeads.length
    ? (() => {
        const avgHours = respondedLeads.reduce((sum, l) => sum + (l.updatedAt.getTime() - l.createdAt.getTime()), 0) / respondedLeads.length / 3_600_000;
        return { key: 'responseTime', label: 'Response time', available: true, score: scoreFromHours(avgHours), detail: `Averaging ${avgHours < 1 ? 'under 1 hour' : `${Math.round(avgHours)} hour(s)`} to first respond to a lead` };
      })()
    : { key: 'responseTime', label: 'Response time', available: false, score: null, detail: 'No leads have been responded to yet' };

  // 2. Lead follow-up rate — share of all leads moved out of Lead.
  const followUpFactor: Factor = leads.length
    ? { key: 'followUpRate', label: 'Lead follow-up rate', available: true, score: Math.round((respondedLeads.length / leads.length) * 100), detail: `${respondedLeads.length} of ${leads.length} leads followed up on` }
    : { key: 'followUpRate', label: 'Lead follow-up rate', available: false, score: null, detail: 'No leads yet' };

  // 3. Reservation completion rate — among reservations whose time has
  // passed, the share that ended COMPLETED rather than CANCELLED.
  const pastReservations = reservations.filter((r) => r.reservationAt.getTime() < Date.now() && (r.status === 'COMPLETED' || r.status === 'CANCELLED'));
  const completedCount = pastReservations.filter((r) => r.status === 'COMPLETED').length;
  const reservationFactor: Factor = pastReservations.length
    ? { key: 'reservationCompletion', label: 'Reservation completion rate', available: true, score: Math.round((completedCount / pastReservations.length) * 100), detail: `${completedCount} of ${pastReservations.length} past reservations completed` }
    : { key: 'reservationCompletion', label: 'Reservation completion rate', available: false, score: null, detail: 'No past reservations yet' };

  // 4. Reviews collected — raw submission volume against a floor target.
  const reviewFactor: Factor = { key: 'reviewsCollected', label: 'Reviews collected', available: true, score: Math.min(100, Math.round((reviewCount / REVIEW_TARGET) * 100)), detail: `${reviewCount} review(s) collected (target: ${REVIEW_TARGET})` };

  // 5. Conversion rate — proxy: share of leads that reached Proposal or
  // Client (moved meaningfully through the pipeline, not just touched).
  const progressedCount = leads.filter((l) => l.status === 'PROPOSAL' || l.status === 'CLIENT').length;
  const conversionFactor: Factor = leads.length
    ? { key: 'conversionRate', label: 'Conversion rate', available: true, score: Math.round((progressedCount / leads.length) * 100), detail: `${progressedCount} of ${leads.length} leads reached Proposal or Client` }
    : { key: 'conversionRate', label: 'Conversion rate', available: false, score: null, detail: 'No leads yet' };

  const factors = [responseFactor, followUpFactor, reservationFactor, reviewFactor, conversionFactor];
  const availableScores = factors.filter((f) => f.available && f.score !== null).map((f) => f.score as number);
  const score = availableScores.length ? Math.round(availableScores.reduce((a, b) => a + b, 0) / availableScores.length) : 0;

  const recommendations: string[] = [];
  if (responseFactor.available && (responseFactor.score ?? 100) < 60) recommendations.push('Respond to new leads faster.');
  if (followUpFactor.available && (followUpFactor.score ?? 100) < 70) recommendations.push('Follow up on leads still marked New.');
  if (reservationFactor.available && (reservationFactor.score ?? 100) < 70) recommendations.push('Enable reservation reminders to reduce no-shows.');
  if (reviewFactor.score !== null && reviewFactor.score < 100) recommendations.push('Collect more reviews.');
  if (conversionFactor.available && (conversionFactor.score ?? 100) < 40) recommendations.push('Qualify or close out leads sitting untouched.');
  if (!leads.length) recommendations.push('Publish your site to start receiving leads.');

  return { siteId, score, factors, recommendations };
}
