import type { Metadata } from "next";

import { SectionHeading } from "@/components/shared/section-heading";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";
import { PortfolioCard } from "@/components/portfolio/portfolio-card";
import { siteConfig } from "@/config/site";
import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Our Work",
  description: `Websites, software, and digital products ${siteConfig.name} has built for real businesses.`,
  path: "/portfolio",
});

export const revalidate = 60;

export default async function PortfolioPage() {
  const projects = await prisma.portfolioProject.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });

  return (
    <section className="px-6 pb-24 pt-28 sm:pt-36">
      <div className="mx-auto max-w-container">
        <SectionHeading
          eyebrow="Our Work"
          title="Projects we've built."
          description="A mix of commissioned client work and internal products that demonstrate what we build."
          align="center"
          className="mx-auto items-center text-center"
        />

        {projects.length === 0 ? (
          <p className="mt-12 text-center text-sm text-muted-foreground">
            Our portfolio is being updated — please check back shortly.
          </p>
        ) : (
          <RevealGroup className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <RevealItem key={project.id}>
                <PortfolioCard project={project} />
              </RevealItem>
            ))}
          </RevealGroup>
        )}
      </div>
    </section>
  );
}
