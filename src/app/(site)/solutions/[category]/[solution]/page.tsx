import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/shared/reveal";
import { FaqAccordion } from "@/components/shared/faq-accordion";
import { getServiceIcon } from "@/lib/service-icons";
import { getSolution, getSolutionParams, startProjectHref } from "@/lib/catalog";
import { buildMetadata } from "@/lib/seo";
import { availabilityCopy, commercialModelCopy } from "@/config/content";

interface SolutionPageProps {
  params: Promise<{ category: string; solution: string }>;
}

export const revalidate = 60;

export async function generateStaticParams() {
  const rows = await getSolutionParams();
  return rows
    .filter((row) => row.category)
    .map((row) => ({ category: row.category!.slug, solution: row.slug }));
}

export async function generateMetadata({ params }: SolutionPageProps): Promise<Metadata> {
  const { category, solution: slug } = await params;
  const solution = await getSolution(category, slug);
  if (!solution) return {};

  return buildMetadata({
    title: solution.title,
    description: solution.headline || solution.description,
    path: `/solutions/${category}/${solution.slug}`,
  });
}

/** Bloco de lista com marcador — usado em capacidades e casos de uso. */
function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-ink" aria-hidden />
          <span className="text-sm leading-relaxed text-muted-foreground">{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Block({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Reveal className={className}>
      <h2 className="text-xl font-medium tracking-tight text-foreground sm:text-2xl">{title}</h2>
      <div className="mt-5">{children}</div>
    </Reveal>
  );
}

/**
 * Página de uma solução.
 *
 * Cobre os treze pontos que o briefing exige: nome, manchete de resultado,
 * problema, cliente ideal, capacidades, funcionalidade detalhada, casos de
 * uso, prévia visual, implementação, integrações, nota de escopo, dúvidas e
 * fechamento.
 *
 * Duas regras de honestidade aparecem como rótulo, não como letra miúda:
 * `availability` diz se aquilo já roda ou é desenvolvimento sob medida, e
 * `previewCaption` identifica demonstração como demonstração. Preço só
 * aparece como rótulo — sem valor definido, pede estimativa.
 */
export default async function SolutionPage({ params }: SolutionPageProps) {
  const { category: categorySlug, solution: slug } = await params;
  const solution = await getSolution(categorySlug, slug);
  if (!solution || !solution.category) notFound();

  const Icon = getServiceIcon(solution.icon);
  const availability = availabilityCopy[solution.availability];
  const commercial = commercialModelCopy[solution.commercialModel];
  const ctaHref = startProjectHref({
    category: solution.category.name,
    service: solution.title,
  });

  return (
    <>
      {/* 01 nome · 02 manchete de resultado · 08 prévia visual */}
      <section className="border-b border-border/60 px-6 pb-20 pt-24 sm:pt-32">
        <div className="mx-auto max-w-container">
          <Reveal>
            <Link
              href={`/solutions/${solution.category.slug}`}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-accent-ink"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
              {solution.category.name}
            </Link>
          </Reveal>

          <div className="mt-10 grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start lg:gap-12">
            <div className="flex flex-col items-start gap-6">
              <Reveal className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-md border border-accent/30 bg-accent/10 text-accent-ink">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                {availability ? <Badge variant="outline">{availability.label}</Badge> : null}
              </Reveal>

              <Reveal>
                <h1 className="text-3xl font-medium leading-[1.12] tracking-tight text-foreground sm:text-4xl">
                  {solution.title}
                </h1>
              </Reveal>

              <Reveal>
                <p className="measure text-lg leading-relaxed text-accent-ink">
                  {solution.headline || solution.outcome}
                </p>
              </Reveal>

              <Reveal>
                <p className="measure text-base leading-relaxed text-muted-foreground">
                  {solution.description}
                </p>
              </Reveal>

              {/* 13 fechamento forte — repetido ao final da página */}
              <Reveal className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
                <Button asChild size="lg">
                  <Link href={ctaHref}>
                    {solution.ctaLabel}
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </Button>
                <span className="text-sm text-muted-foreground">{solution.priceLabel}</span>
              </Reveal>

              {availability ? (
                <Reveal>
                  <p className="measure border-l-2 border-border pl-4 text-sm leading-relaxed text-muted-foreground">
                    <span className="font-medium text-foreground">{availability.label}.</span>{" "}
                    {availability.description}
                  </p>
                </Reveal>
              ) : null}
            </div>

            {solution.previewImage ? (
              <Reveal className="w-full">
                <figure className="overflow-hidden rounded-xl border border-border bg-card shadow-[0_24px_80px_-32px_rgba(0,0,0,0.55)]">
                  <Image
                    src={solution.previewImage}
                    alt={`Interface preview for ${solution.title}.`}
                    width={1600}
                    height={1000}
                    sizes="(min-width: 1024px) 620px, 100vw"
                    className="w-full"
                  />
                </figure>
                {solution.previewCaption ? (
                  <figcaption className="mt-4 font-mono text-[11px] uppercase leading-relaxed tracking-[0.14em] text-muted-foreground">
                    {solution.previewCaption}
                  </figcaption>
                ) : null}
              </Reveal>
            ) : null}
          </div>
        </div>
      </section>

      {/* 03 problema · 04 cliente ideal */}
      <section className="border-b border-border/60 px-6 py-20">
        <div className="mx-auto grid max-w-container gap-12 lg:grid-cols-2 lg:gap-16">
          <Block title="The problem it solves">
            <p className="text-base leading-relaxed text-muted-foreground">{solution.problem}</p>
          </Block>
          <Block title="Who it is for">
            <p className="text-base leading-relaxed text-muted-foreground">
              {solution.idealCustomer}
            </p>
          </Block>
        </div>
      </section>

      {/* 05 capacidades · 06 funcionalidade detalhada */}
      <section className="border-b border-border/60 px-6 py-20">
        <div className="mx-auto grid max-w-container gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
          {solution.capabilities.length > 0 ? (
            <Block title="Main capabilities">
              <CheckList items={solution.capabilities} />
            </Block>
          ) : null}

          {solution.functionality.length > 0 ? (
            <Block title="What it actually does">
              <ul className="flex flex-col divide-y divide-border/60 border-y border-border/60">
                {solution.functionality.map((item) => (
                  <li
                    key={item}
                    className="py-3.5 text-sm leading-relaxed text-muted-foreground"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </Block>
          ) : null}
        </div>
      </section>

      {/* 07 casos de uso · 10 integrações */}
      {solution.useCases.length > 0 || solution.integrations.length > 0 ? (
        <section className="border-b border-border/60 px-6 py-20">
          <div className="mx-auto grid max-w-container gap-12 lg:grid-cols-2 lg:gap-16">
            {solution.useCases.length > 0 ? (
              <Block title="Example use cases">
                <CheckList items={solution.useCases} />
              </Block>
            ) : null}

            {solution.integrations.length > 0 ? (
              <Block title="Optional integrations">
                <ul className="flex flex-wrap gap-2">
                  {solution.integrations.map((item) => (
                    <li key={item}>
                      <Badge variant="outline">{item}</Badge>
                    </li>
                  ))}
                </ul>
                <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                  Integrations depend on what the third-party platform allows for your account. We
                  verify that during scoping rather than assuming it.
                </p>
              </Block>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* 09 implementação · 11 escopo e customização · modelo comercial */}
      <section className="border-b border-border/60 px-6 py-20">
        <div className="mx-auto grid max-w-container gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          <div className="flex flex-col gap-12">
            {solution.implementationNote ? (
              <Block title="How implementation works">
                <p className="text-base leading-relaxed text-muted-foreground">
                  {solution.implementationNote}
                </p>
              </Block>
            ) : null}

            {solution.scopeNotes ? (
              <Block title="Scope and customisation">
                <p className="text-base leading-relaxed text-muted-foreground">
                  {solution.scopeNotes}
                </p>
              </Block>
            ) : null}
          </div>

          {commercial ? (
            <Reveal>
              <div className="rounded-xl border border-border bg-card p-8">
                <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Commercial model
                </span>
                <h2 className="mt-4 text-xl font-medium tracking-tight text-foreground">
                  {commercial.label}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {commercial.description}
                </p>
                <p className="mt-6 border-t border-border/60 pt-6 text-sm text-foreground">
                  {solution.priceLabel}
                </p>
                <Button asChild className="mt-6 w-full sm:w-fit">
                  <Link href={ctaHref}>
                    {solution.ctaLabel}
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </Button>
              </div>
            </Reveal>
          ) : null}
        </div>
      </section>

      {/* 12 dúvidas */}
      {solution.faqs.length > 0 ? (
        <section className="border-b border-border/60 px-6 py-20">
          <div className="mx-auto grid max-w-container gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
            <Reveal>
              <h2 className="text-xl font-medium tracking-tight text-foreground sm:text-2xl">
                Questions about {solution.title.toLowerCase()}
              </h2>
            </Reveal>
            <FaqAccordion
              items={solution.faqs.map((faq) => ({ question: faq.question, answer: faq.answer }))}
            />
          </div>
        </section>
      ) : null}

      {/* 13 fechamento */}
      <section className="px-6 py-24">
        <Reveal className="relative mx-auto max-w-container overflow-hidden rounded-2xl border border-border bg-card">
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.07]" aria-hidden />
          <div className="absolute inset-x-0 top-0 h-px bg-accent/60" aria-hidden />
          <div className="relative flex flex-col items-start gap-6 px-8 py-16 sm:px-14 sm:py-20">
            <h2 className="max-w-[22ch] text-3xl font-medium leading-[1.12] tracking-tight text-foreground sm:text-[2.4rem]">
              {solution.outcome}
            </h2>
            <p className="measure text-base leading-relaxed text-muted-foreground">
              Tell us how your business works today and what you need this to do. You get back a
              direction, a written scope and a next step.
            </p>
            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
              <Button asChild size="lg">
                <Link href={ctaHref}>
                  {solution.ctaLabel}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href={`/solutions/${solution.category.slug}`}>
                  Other {solution.category.name.toLowerCase()} solutions
                </Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
