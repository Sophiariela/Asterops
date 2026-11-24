import type { CtaLink } from "./common";

export interface SectionIntro {
  eyebrow: string;
  title: string;
  description: string;
}

export interface TransformationContent extends SectionIntro {
  before: { title: string; items: string[] };
  after: { title: string; items: string[] };
  /** Ressalva honesta: automação reduz trabalho manual, não elimina o negócio. */
  note: string;
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

export interface HomeContent {
  hero: {
    eyebrow: string;
    headline: string;
    description: string;
    primaryCta: CtaLink;
    secondaryCta: CtaLink;
    /** Legenda da composição visual — nomeia os projetos reais mostrados. */
    proofCaption: string;
  };
  transformation: TransformationContent;
  solutions: SectionIntro;
  howItWorks: SectionIntro & { steps: ProcessStep[] };
  tiers: SectionIntro & { note: string };
  portfolioPreview: SectionIntro;
  faq: SectionIntro;
  finalCta: {
    title: string;
    description: string;
    primaryCta: CtaLink;
    secondaryCta: CtaLink;
  };
}

export interface ImplementationContent extends SectionIntro {
  promise: string;
  stages: ProcessStep[];
  /** O que depende de escopo e não pode ser prometido de antemão. */
  disclaimer: string;
}

export interface ChannelsContent extends SectionIntro {
  items: { title: string; description: string; availability: string }[];
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
