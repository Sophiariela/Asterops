import type { Metadata } from "next";

import { SectionHeading } from "@/components/shared/section-heading";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";
import { SolutionCard } from "@/components/solutions/solution-card";
import { CtaSection } from "@/components/sections/cta-section";
import { getServiceIcon } from "@/lib/service-icons";
import { getCategories } from "@/lib/catalog";
import { buildMetadata } from "@/lib/seo";
import { homeContent } from "@/config/content";

export const metadata: Metadata = buildMetadata({
  title: "Solutions",
  description:
    "Websites, landing pages, e-commerce and web applications; CRM, booking, dashboards, workflow and inventory software; automation, integrations and AI tooling; and fully custom software development.",
  path: "/solutions",
});

export const revalidate = 60;

/**
 * Catálogo completo.
 *
 * Uma seção por categoria, com todas as soluções dela. A página existe para
 * quem quer varrer o que o estúdio faz; quem já sabe o que quer entra direto
 * pela categoria ou pela solução.
 */
export default async function SolutionsPage() {
  const categories = await getCategories();

  return (
    <>
      <section className="border-b border-border/60 px-6 pb-20 pt-24 sm:pt-32">
        <div className="mx-auto max-w-container">
          <SectionHeading
            eyebrow="Solutions"
            title="What Aster designs, builds and implements."
            description="Four areas of work, each with defined solutions and room for custom scope. Every solution has its own page explaining what it does, who it is for, what it costs to run, and what depends on scope."
          />

          {categories.length === 0 ? (
            <p className="mt-12 text-sm text-muted-foreground">
              The catalogue is being updated. Please check back shortly, or get in touch and we will
              talk through what you need.
            </p>
          ) : (
            <nav aria-label="Solution categories" className="mt-12 flex flex-wrap gap-x-6 gap-y-3">
              {categories.map((category) => (
                <a
                  key={category.id}
                  href={`#${category.slug}`}
                  className="text-sm text-muted-foreground transition-colors hover:text-accent-ink"
                >
                  <span className="font-mono text-xs tracking-[0.18em] text-muted-foreground/70">
                    {category.code}
                  </span>{" "}
                  {category.name}
                </a>
              ))}
            </nav>
          )}
        </div>
      </section>

      {categories.map((category) => {
        const Icon = getServiceIcon(category.icon);

        return (
          <section
            key={category.id}
            id={category.slug}
            className="scroll-mt-24 border-b border-border/60 px-6 py-24"
          >
            <div className="mx-auto max-w-container">
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-md border border-accent/30 bg-accent/10 text-accent-ink">
                    <Icon className="h-[18px] w-[18px]" aria-hidden />
                  </span>
                  <span className="font-mono text-xs tracking-[0.18em] text-muted-foreground/70">
                    {category.code}
                  </span>
                </div>
                <h2 className="max-w-2xl text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
                  {category.name}
                </h2>
                <p className="measure text-base leading-relaxed text-muted-foreground">
                  {category.description}
                </p>
              </div>

              <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {category.services.map((solution) => (
                  <RevealItem key={solution.id} className="h-full">
                    <SolutionCard solution={solution} categorySlug={category.slug} />
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>
          </section>
        );
      })}

      <CtaSection {...homeContent.finalCta} />
    </>
  );
}
