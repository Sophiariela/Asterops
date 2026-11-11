import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { SectionHeading } from "@/components/shared/section-heading";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";
import { PortfolioCard } from "@/components/portfolio/portfolio-card";
import { Button } from "@/components/ui/button";
import { homeContent } from "@/config/content";
import { prisma } from "@/lib/prisma";

export async function PortfolioPreview() {
  const { portfolioPreview } = homeContent;
  const projects = await prisma.portfolioProject.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
    take: 3,
  });

  if (projects.length === 0) return null;

  return (
    <section className="border-t border-border/60 px-6 py-24">
      <div className="mx-auto max-w-container">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow={portfolioPreview.eyebrow}
            title={portfolioPreview.title}
            description={portfolioPreview.description}
          />
          <Button asChild variant="outline" className="w-fit">
            <Link href="/portfolio">
              Explore our work
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <RevealGroup className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
