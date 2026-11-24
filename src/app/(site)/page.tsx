import type { Metadata } from "next";

import { Hero } from "@/components/sections/hero";
import { WhatWeBuild } from "@/components/sections/what-we-build";
import { FeaturedSolutions } from "@/components/sections/featured-solutions";
import { SelectedWork } from "@/components/sections/selected-work";
import { Process } from "@/components/sections/process";
import { WhyAster } from "@/components/sections/why-aster";
import { FaqSection } from "@/components/sections/faq-section";
import { CtaSection } from "@/components/sections/cta-section";
import { homeContent } from "@/config/content";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { getSiteSettings } from "@/lib/settings";

export const metadata: Metadata = buildMetadata({
  title: "Aster — Digital Products & Software Studio",
  description: siteConfig.description,
  path: "/",
});

/**
 * Catálogo, projeto e dúvida vêm do banco, então a página não pode ser
 * estática para sempre: sem isso, o que o painel edita só apareceria no
 * próximo build.
 */
export const revalidate = 60;

/**
 * Home: oito blocos, numa ordem só.
 *
 * hero → o que construímos → soluções em destaque → trabalho selecionado →
 * processo → por que a Aster → dúvidas → fechamento. A profundidade de cada
 * assunto vive em /solutions, na página de cada solução e em /projects —
 * aqui nada se repete.
 */
export default async function HomePage() {
  const settings = await getSiteSettings();

  return (
    <>
      <Hero settings={settings} />
      <WhatWeBuild />
      <FeaturedSolutions />
      <SelectedWork />
      <Process />
      <WhyAster />
      <FaqSection />
      <CtaSection {...homeContent.finalCta} />
    </>
  );
}
