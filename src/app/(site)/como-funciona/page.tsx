import type { Metadata } from "next";

import { HowItWorks } from "@/components/sections/how-it-works";
import { Implementation } from "@/components/sections/implementation";
import { Channels } from "@/components/sections/channels";
import { FaqSection } from "@/components/sections/faq-section";
import { CtaSection } from "@/components/sections/cta-section";
import { SectionHeading } from "@/components/shared/section-heading";
import { homeContent } from "@/config/content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Como funciona",
  description:
    "Do diagnóstico à publicação: como a Aster define escopo, desenvolve, integra, testa e entrega a solução digital do seu negócio.",
  path: "/como-funciona",
});

export const revalidate = 60;

export default function ComoFuncionaPage() {
  return (
    <>
      <section className="border-b border-border/60 px-6 pb-20 pt-24 sm:pt-32">
        <div className="mx-auto max-w-container">
          <SectionHeading
            eyebrow="Como funciona"
            title="Você explica o problema. A gente implementa a solução."
            description="Nenhuma etapa do caminho abaixo fica no seu colo: configuração, integração e publicação são trabalho do estúdio. O que precisamos de você é contexto e as decisões do negócio."
          />
        </div>
      </section>

      <HowItWorks />
      <Implementation />
      <Channels />
      <FaqSection />
      <CtaSection {...homeContent.finalCta} />
    </>
  );
}
