import type { LucideIcon } from "lucide-react";
import type { CtaLink } from "./product";

export interface HeroContent {
  eyebrow: string;
  headline: string;
  subheadlineLines: string[];
  primaryCta: CtaLink;
  secondaryCta: CtaLink;
}

export interface IndustryItem {
  icon: LucideIcon;
  name: string;
}

export interface HowItWorksStep {
  index: string;
  title: string;
  description: string;
}

export interface AboutContent {
  hero: {
    eyebrow: string;
    headline: string;
    description: string;
  };
  mission: {
    eyebrow: string;
    title: string;
    description: string;
  };
  principles: {
    icon: LucideIcon;
    title: string;
    description: string;
  }[];
  closingCta: {
    title: string;
    description: string;
    primaryCta: CtaLink;
    secondaryCta: CtaLink;
  };
}

export interface ContactContent {
  hero: {
    eyebrow: string;
    headline: string;
    description: string;
  };
  info: { label: string; value: string }[];
}

export interface StatItem {
  value: string;
  label: string;
}

export interface ComparisonColumn {
  label: string;
  items: string[];
}

export interface ShowcaseFact {
  label: string;
  body: string;
}

export interface TrustPlaceholder {
  glyph: string;
  label: string;
}

export interface HomeContent {
  hero: HeroContent;
  stats: StatItem[];
  systems: {
    eyebrow: string;
    title: string;
    description: string;
  };
  whyAster: {
    title: string;
    traditional: ComparisonColumn;
    aster: ComparisonColumn;
  };
  showcase: {
    kicker: string;
    title: string;
    description: string;
    facts: ShowcaseFact[];
    primaryCta: CtaLink;
    secondaryCta: CtaLink;
  };
  industries: {
    eyebrow: string;
    title: string;
    description: string;
    items: IndustryItem[];
  };
  process: {
    eyebrow: string;
    title: string;
    steps: HowItWorksStep[];
  };
  trust: {
    title: string;
    placeholders: TrustPlaceholder[];
    trustedByLabel: string;
    clientPlaceholders: string[];
  };
  finalCta: {
    title: string;
    description: string;
    primaryCta: CtaLink;
    secondaryCta: CtaLink;
  };
}
