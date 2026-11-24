import type { Metadata } from "next";

import { Hero } from "@/components/sections/hero";
import { Transformation } from "@/components/sections/transformation";
import { Solutions } from "@/components/sections/solutions";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Tiers } from "@/components/sections/tiers";
import { PortfolioPreview } from "@/components/sections/portfolio-preview";
import { FaqSection } from "@/components/sections/faq-section";
import { CtaSection } from "@/components/sections/cta-section";
import { homeContent } from "@/config/content";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { getSiteSettings } from "@/lib/settings";

export const metadata: Metadata = buildMetadata({
  title: "Aster — agendamento, WhatsApp e site implementados para o seu negócio",
  description: siteConfig.description,
  path: "/",
});

/**
 * Serviço, nível, dúvida e projeto da home vêm do banco, então a página não
 * pode ser estática para sempre: sem isso, o que o painel edita só
 * apareceria no próximo build. Mesma janela de /solucoes e /projetos.
 */
export const revalidate = 60;

/**
 * Home: funil curto e numa ordem só.
 *
 * hero → antes/depois → o que implementamos → como funciona → níveis →
 * projetos → dúvidas → fechamento. A profundidade de cada bloco vive nas
 * páginas de /solucoes, /como-funciona e /projetos — aqui nada se repete.
 */
export default async function HomePage() {
  const settings = await getSiteSettings();

  return (
    <>
      <Hero settings={settings} />
      <Transformation />
      <Solutions limit={6} />
      <HowItWorks />
      <Tiers />
      <PortfolioPreview />
      <FaqSection />
      <CtaSection {...homeContent.finalCta} />
    </>
  );
}
