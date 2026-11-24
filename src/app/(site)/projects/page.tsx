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
  title: "Projects",
  description:
    "Websites, storefronts and software Aster has delivered for real businesses — each one labelled for what it is, with a link to open where one exists.",
  path: "/projects",
});

export const revalidate = 60;

export default async function ProjectsPage() {
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
            eyebrow="Projects"
            title="What the studio has shipped."
            description="Client projects, internal products and prototypes all appear labelled as such — no invented case studies, no logos of companies that were never clients, and no result figures we cannot show you."
          />

          {projects.length === 0 ? (
            <p className="mt-12 text-sm text-muted-foreground">
              Projects are being updated. Get in touch through the project form in the meantime.
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
