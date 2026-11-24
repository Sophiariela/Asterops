import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { SectionHeading } from "@/components/shared/section-heading";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";
import { PortfolioCard } from "@/components/portfolio/portfolio-card";
import { Button } from "@/components/ui/button";
import { homeContent } from "@/config/content";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe-query";

export async function PortfolioPreview() {
  const { portfolioPreview } = homeContent;
  const projects = await safeQuery(
    "portfolio preview",
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
            eyebrow={portfolioPreview.eyebrow}
            title={portfolioPreview.title}
            description={portfolioPreview.description}
          />
          <Button asChild variant="outline" className="w-fit shrink-0">
            <Link href="/projetos">
              Ver todos os projetos
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <RevealGroup className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <RevealItem key={project.id}>
              <PortfolioCard project={project} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
