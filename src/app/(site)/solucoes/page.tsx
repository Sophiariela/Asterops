import type { Metadata } from "next";

import { SectionHeading } from "@/components/shared/section-heading";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";
import { ServiceCard } from "@/components/services/service-card";
import { Tiers } from "@/components/sections/tiers";
import { Implementation } from "@/components/sections/implementation";
import { Channels } from "@/components/sections/channels";
import { CtaSection } from "@/components/sections/cta-section";
import { homeContent } from "@/config/content";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe-query";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Soluções",
  description:
    "Presença digital, agendamento online, automação de WhatsApp, gestão de clientes, vendas online e software sob medida — implementados pela Aster para o seu negócio.",
  path: "/solucoes",
});

export const revalidate = 60;

export default async function SolucoesPage() {
  const services = await safeQuery(
    "solutions page services",
    () =>
      prisma.service.findMany({
        where: { active: true },
        orderBy: { order: "asc" },
      }),
    [],
  );

  return (
    <>
      <section className="border-b border-border/60 px-6 pb-20 pt-24 sm:pt-32">
        <div className="mx-auto max-w-container">
          <SectionHeading
            eyebrow="O que implementamos"
            title="Soluções entregues configuradas e funcionando."
            description="Cada frente abaixo resolve um problema de operação. Você não recebe uma ferramenta para aprender: recebe a solução montada com o seu serviço, o seu conteúdo e o seu jeito de atender dentro dela."
          />

          {services.length === 0 ? (
            <p className="mt-12 text-sm text-muted-foreground">
              Estamos atualizando as soluções — fale com a gente pelo formulário enquanto isso.
            </p>
          ) : (
            <RevealGroup className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <RevealItem key={service.id} className="bg-background">
                  <ServiceCard service={service} />
                </RevealItem>
              ))}
            </RevealGroup>
          )}
        </div>
      </section>

      <Channels />
      <Tiers />
      <Implementation />
      <CtaSection {...homeContent.finalCta} />
    </>
  );
}
