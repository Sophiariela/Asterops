import type { CaseStudy } from "@/types";

/**
 * Client case study library.
 *
 * The Fulô Crochet build previously lived here. It is now presented as a
 * "Design Inspirations" reference on the homepage instead — see
 * `src/config/inspirations.ts` — so `/case-studies/fulo` redirects to that
 * section (see `next.config.ts`).
 *
 * Add a `CaseStudy` object here (see `src/types/case-study.ts`) to publish a new
 * one; the route tree, metadata and OG image all read from this array.
 */
export const caseStudies: CaseStudy[] = [];

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find((caseStudy) => caseStudy.slug === slug);
}

export function getCaseStudySlugs(): string[] {
  return caseStudies.map((caseStudy) => caseStudy.slug);
}
