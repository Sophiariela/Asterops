import type { Site } from './types';

export type WebsiteBlueprint = {
  pages: number;
  sections: number;
  leadCapturePoints: number;
  trustElements: number;
  conversionPaths: number;
  status: Site['status'];
};

// Every number here is counted directly from what the generator actually
// created (or what's been added since) — nothing is a fixed target or an
// estimate. Trust Elements = structural trust slots the playbook reserved
// (trust-placeholder sections) plus testimonials actually added, since
// right after generation there are real slots but zero real testimonials.
// Conversion Paths = distinct CTA labels across the site — each unique
// "ask" a visitor could act on, not a measured user journey (WebOS has no
// visitor tracking yet).
export function computeBlueprint(site: Site): WebsiteBlueprint {
  const sections = site.pages.reduce((sum, p) => sum + p.sections.length, 0);
  const leadCapturePoints = site.pages.filter((p) => p.hasLeadForm).length;
  const trustPlaceholderSlots = site.pages.reduce(
    (sum, p) => sum + p.sections.filter((s) => s.type === 'trust-placeholder').length,
    0,
  );
  const conversionPaths = new Set(site.pages.map((p) => p.ctaLabel).filter(Boolean)).size;

  return {
    pages: site.pages.length,
    sections,
    leadCapturePoints,
    trustElements: trustPlaceholderSlots + site.testimonials.length,
    conversionPaths,
    status: site.status,
  };
}
