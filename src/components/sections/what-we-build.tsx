import { SectionHeading } from "@/components/shared/section-heading";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";
import { CategoryCard } from "@/components/solutions/category-card";
import { homeContent } from "@/config/content";
import { getCategories } from "@/lib/catalog";

/**
 * "What we build" — as quatro categorias comerciais.
 *
 * Vem do banco, então o painel controla o que aparece. Cada cartão leva para
 * a página da própria categoria, que é onde o catálogo abre.
 */
export async function WhatWeBuild() {
  const { whatWeBuild } = homeContent;
  const categories = await getCategories();

  if (categories.length === 0) return null;

  return (
    <section id="what-we-build" className="scroll-mt-24 border-b border-border/60 px-6 py-24">
      <div className="mx-auto max-w-container">
        <SectionHeading
          eyebrow={whatWeBuild.eyebrow}
          title={whatWeBuild.title}
          description={whatWeBuild.description}
        />

        <RevealGroup className="mt-14 grid gap-6 md:grid-cols-2">
          {categories.map((category) => (
            <RevealItem key={category.id} className="h-full">
              <CategoryCard
                category={category}
                solutionTitles={category.services.map((service) => service.title)}
              />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
