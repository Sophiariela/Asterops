import type { LucideIcon } from "lucide-react";

export interface CtaLink {
  label: string;
  href: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ProductFeature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface ProductBenefit {
  title: string;
  description: string;
}

export interface ProductExample {
  title: string;
  description: string;
  image: string;
}

export interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: CtaLink;
  highlighted?: boolean;
}

export interface Product {
  slug: string;
  name: string;
  shortDescription: string;
  tagline: string;
  icon: LucideIcon;
  hero: {
    eyebrow: string;
    headline: string;
    description: string;
  };
  problem: {
    title: string;
    description: string;
    points: string[];
  };
  solution: {
    title: string;
    description: string;
    points: string[];
  };
  features: ProductFeature[];
  benefits: ProductBenefit[];
  examples?: ProductExample[];
  pricing?: {
    title: string;
    description: string;
    tiers: PricingTier[];
  };
  faq: FaqItem[];
  cta: {
    title: string;
    description: string;
    primaryCta: CtaLink;
    secondaryCta: CtaLink;
  };
}
