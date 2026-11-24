import type { CtaLink } from "./common";

export interface SectionIntro {
  eyebrow: string;
  title: string;
  description: string;
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

export interface ValueItem {
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
  whatWeBuild: SectionIntro;
  featured: SectionIntro;
  selectedWork: SectionIntro;
  process: SectionIntro & { steps: ProcessStep[] };
  whyAster: SectionIntro & { items: ValueItem[] };
  faq: SectionIntro;
  finalCta: {
    title: string;
    description: string;
    primaryCta: CtaLink;
    secondaryCta: CtaLink;
  };
}

export interface AboutContent {
  hero: { eyebrow: string; headline: string; description: string };
  mission: { eyebrow: string; title: string; description: string };
  capabilities: ValueItem[];
  principles: ValueItem[];
  closingCta: {
    title: string;
    description: string;
    primaryCta: CtaLink;
    secondaryCta: CtaLink;
  };
}

export interface ContactContent {
  hero: { eyebrow: string; headline: string; description: string };
  info: { label: string; value: string }[];
}

/** Modelos comerciais, explicados para o cliente na página da solução. */
export interface CommercialModelCopy {
  label: string;
  description: string;
}
