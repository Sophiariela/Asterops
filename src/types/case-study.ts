import type { LucideIcon } from "lucide-react";
import type { CtaLink } from "./product";

export interface CaseStudyApproachItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface CaseStudyDeliverable {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface CaseStudyMockup {
  device: "desktop" | "laptop" | "tablet" | "mobile";
  image: string;
  label: string;
}

export interface CaseStudyTechCategory {
  label: string;
  items: string[];
}

export interface CaseStudyMetricPlaceholder {
  label: string;
}

export interface CaseStudy {
  slug: string;
  client: string;
  industry: string;
  year: string;
  /** Set to true once the underlying project can be linked publicly. */
  isPublicLink: boolean;
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    summary: string;
  };
  challenge: {
    title: string;
    description: string;
    points: string[];
  };
  solution: {
    title: string;
    description: string;
    approach: CaseStudyApproachItem[];
  };
  deliverables: CaseStudyDeliverable[];
  gallery: {
    title: string;
    description: string;
    placeholderNotice: string;
    mockups: CaseStudyMockup[];
  };
  technology: {
    title: string;
    description: string;
    categories: CaseStudyTechCategory[];
  };
  results: {
    title: string;
    statement: string;
    metrics: CaseStudyMetricPlaceholder[];
  };
  cta: {
    title: string;
    description: string;
    primaryCta: CtaLink;
  };
}
