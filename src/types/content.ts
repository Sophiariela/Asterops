import type { CtaLink } from "./common";

export interface HomeContent {
  hero: {
    eyebrow: string;
    headline: string;
    description: string;
    primaryCta: CtaLink;
    secondaryCta: CtaLink;
  };
  servicesPreview: {
    eyebrow: string;
    title: string;
    description: string;
  };
  portfolioPreview: {
    eyebrow: string;
    title: string;
    description: string;
  };
  finalCta: {
    title: string;
    description: string;
    primaryCta: CtaLink;
    secondaryCta: CtaLink;
  };
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
