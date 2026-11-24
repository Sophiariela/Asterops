import type { Metadata } from "next";

import { SectionHeading } from "@/components/shared/section-heading";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";
import { PortfolioCard } from "@/components/portfolio/portfolio-card";
import { CtaSection } from "@/components/sections/cta-section";
import { homeContent } from "@/config/content";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe-query";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Projetos",
  description:
    "Sites, lojas e sistemas que a Aster entregou para negócios reais. Projetos no ar, com link para abrir e conferir.",
  path: "/projetos",
});

export const revalidate = 60;

export default async function ProjetosPage() {
  const projects = await safeQuery(
    "projects page",
    () =>
      prisma.portfolioProject.findMany({
        where: { published: true },
        orderBy: { order: "asc" },
      }),
    [],
  );

  return (
    <>
      <section className="border-b border-border/60 px-6 pb-20 pt-24 sm:pt-32">
        <div className="mx-auto max-w-container">
          <SectionHeading
            eyebrow="Projetos"
            title="O que o estúdio já colocou no ar."
            description="Projeto de cliente, produto interno e protótipo aparecem identificados — sem case inventado, sem logo de empresa que nunca foi cliente e sem número de resultado que não dá para comprovar."
          />

          {projects.length === 0 ? (
            <p className="mt-12 text-sm text-muted-foreground">
              Estamos atualizando os projetos — fale com a gente pelo formulário enquanto isso.
            </p>
          ) : (
            <RevealGroup className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <RevealItem key={project.id}>
                  <PortfolioCard project={project} />
                </RevealItem>
              ))}
            </RevealGroup>
          )}
        </div>
      </section>

      <CtaSection {...homeContent.finalCta} />
    </>
  );
}
