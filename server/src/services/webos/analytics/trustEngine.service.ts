import { loadSiteForAnalysis, TESTIMONIAL_TARGET } from './shared.js';

export type TrustGap = {
  hasGap: boolean;
  testimonialCount: number;
  target: number;
  message: string;
  recommendation: string | null;
};

// "Case studies", "reviews", "certifications" and "logos" from the brief
// aren't separate models yet — only Testimonial is real. Everything else
// is reported as not tracked rather than implied to exist.
export async function getTrustGaps(ownerId: string, siteId: string): Promise<TrustGap> {
  const site = await loadSiteForAnalysis(ownerId, siteId);
  const count = site.testimonials.length;
  const hasGap = count < TESTIMONIAL_TARGET;

  return {
    hasGap,
    testimonialCount: count,
    target: TESTIMONIAL_TARGET,
    message: count === 0
      ? 'Your website has no customer proof.'
      : hasGap
        ? `Your website has ${count} testimonial(s) — below the recommended minimum of ${TESTIMONIAL_TARGET}.`
        : `Your website has ${count} testimonial(s) — enough to build trust.`,
    recommendation: hasGap ? `Add ${TESTIMONIAL_TARGET - count} more testimonial(s).` : null,
  };
}
