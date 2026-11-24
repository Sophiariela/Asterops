import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { RevealGroup, RevealItem } from "@/components/shared/reveal";
import { Reveal } from "@/components/shared/reveal";
import { SolutionCard } from "@/components/solutions/solution-card";
import { CtaSection } from "@/components/sections/cta-section";
import { getServiceIcon } from "@/lib/service-icons";
import { getCategories, getCategoryBySlug } from "@/lib/catalog";
import { buildMetadata } from "@/lib/seo";
import { homeContent } from "@/config/content";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export const revalidate = 60;

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};

  return buildMetadata({
    title: category.name,
    description: category.description,
    path: `/solutions/${category.slug}`,
  });
}

/** Página de uma categoria: a descrição dela e todas as suas soluções. */
export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const Icon = getServiceIcon(category.icon);

  return (
    <>
      <section className="border-b border-border/60 px-6 pb-20 pt-24 sm:pt-32">
        <div className="mx-auto max-w-container">
          <Reveal>
            <Link
              href="/solutions"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-accent-ink"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
              All solutions
            </Link>
          </Reveal>

          <Reveal className="mt-10 flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-md border border-accent/30 bg-accent/10 text-accent-ink">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <span className="font-mono text-xs tracking-[0.18em] text-muted-foreground/70">
                {category.code}
              </span>
            </div>
            <h1 className="max-w-[24ch] text-4xl font-medium leading-[1.1] tracking-tight text-foreground sm:text-5xl">
              {category.name}
            </h1>
            <p className="text-lg font-medium text-accent-ink">{category.tagline}</p>
            <p className="measure text-base leading-relaxed text-muted-foreground">
              {category.description}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-b border-border/60 px-6 py-24">
        <div className="mx-auto max-w-container">
          {category.services.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Solutions in this category are being updated. Get in touch and we will talk through
              the scope directly.
            </p>
          ) : (
            <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {category.services.map((solution) => (
                <RevealItem key={solution.id} className="h-full">
                  <SolutionCard solution={solution} categorySlug={category.slug} />
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
