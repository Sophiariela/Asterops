import type { LucideIcon } from "lucide-react";
import type { CtaLink } from "./product";

export interface HeroContent {
  eyebrow: string;
  headline: string;
  subheadlineLines: string[];
  primaryCta: CtaLink;
  secondaryCta: CtaLink;
}

export interface ProblemCard {
  icon: LucideIcon;
  problem: string;
  solution: string;
}

export interface IndustryItem {
  icon: LucideIcon;
  name: string;
}

export interface CaseStudyItem {
  name: string;
  description: string;
  href?: string;
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

export interface HomeContent {
  hero: HeroContent;
  problems: {
    eyebrow: string;
    title: string;
    description: string;
    items: ProblemCard[];
  };
  solutions: {
    eyebrow: string;
    title: string;
    description: string;
  };
  industries: {
    eyebrow: string;
    title: string;
    description: string;
    items: IndustryItem[];
  };
  caseStudies: {
    eyebrow: string;
    title: string;
    description: string;
    items: CaseStudyItem[];
  };
  howItWorks: {
    eyebrow: string;
    title: string;
    description: string;
    steps: HowItWorksStep[];
  };
  finalCta: {
    title: string;
    description: string;
    primaryCta: CtaLink;
    secondaryCta: CtaLink;
  };
}
