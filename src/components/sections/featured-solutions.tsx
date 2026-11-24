import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { SectionHeading } from "@/components/shared/section-heading";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";
import { SolutionCard } from "@/components/solutions/solution-card";
import { Button } from "@/components/ui/button";
import { homeContent } from "@/config/content";
import { getFeaturedSolutions } from "@/lib/catalog";

/**
 * Soluções em destaque — uma seleção, não o catálogo inteiro.
 *
 * O destaque é um booleano no banco (`Service.featured`), então muda pelo
 * painel sem tocar em código.
 */
export async function FeaturedSolutions() {
  const { featured } = homeContent;
  const solutions = await getFeaturedSolutions(6);

  if (solutions.length === 0) return null;

  return (
    <section id="featured" className="scroll-mt-24 border-b border-border/60 px-6 py-24">
      <div className="mx-auto max-w-container">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow={featured.eyebrow}
            title={featured.title}
            description={featured.description}
          />
          <Button asChild variant="outline" className="w-fit shrink-0">
            <Link href="/solutions">
              See the full catalogue
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Button>
        </div>

        <RevealGroup className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {solutions.map((solution) =>
            solution.category ? (
              <RevealItem key={solution.id} className="h-full">
                <SolutionCard
                  solution={solution}
                  categorySlug={solution.category.slug}
                  categoryName={solution.category.name}
                />
              </RevealItem>
            ) : null,
          )}
        </RevealGroup>
      </div>
    </section>
  );
}
