import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { SectionHeading } from "@/components/shared/section-heading";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";
import { PortfolioCard } from "@/components/portfolio/portfolio-card";
import { Button } from "@/components/ui/button";
import { homeContent } from "@/config/content";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe-query";

/**
 * Trabalho selecionado.
 *
 * Só projeto que está no banco, cada um com a sua classificação à vista
 * (projeto de cliente, produto interno, protótipo). Sem depoimento, logo de
 * cliente ou número de resultado — nada disso existe aqui porque não há
 * versão verificável disso para mostrar.
 */
export async function SelectedWork() {
  const { selectedWork } = homeContent;
  const projects = await safeQuery(
    "selected work",
    () =>
      prisma.portfolioProject.findMany({
        where: { published: true },
        orderBy: { order: "asc" },
        take: 3,
      }),
    [],
  );

  if (projects.length === 0) return null;

  return (
    <section className="border-b border-border/60 px-6 py-24">
      <div className="mx-auto max-w-container">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow={selectedWork.eyebrow}
            title={selectedWork.title}
            description={selectedWork.description}
          />
          <Button asChild variant="outline" className="w-fit shrink-0">
            <Link href="/projects">
              See all projects
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Button>
        </div>

        <RevealGroup className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <RevealItem key={project.id} className="h-full">
              <PortfolioCard project={project} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
