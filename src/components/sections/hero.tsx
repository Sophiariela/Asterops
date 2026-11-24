import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { SiteSettings } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/shared/reveal";
import { homeContent } from "@/config/content";

/** As três capacidades que a Aster comunica, abaixo do CTA. */
const capabilities = [
  "Digital experiences",
  "Software products & business systems",
  "Automation & integrations",
];

/**
 * Hero da home.
 *
 * O visual é prova real: screenshots de projeto que está no ar (Good Vibes
 * Va’a e Fulô Crochet), em moldura de navegador e de celular. Nada de
 * ilustração decorativa de IA nem de interface inventada — o que aparece aqui
 * existe e pode ser aberto na página de projetos.
 *
 * Texto e rótulo saem de `SiteSettings` quando o painel os editou, com
 * `homeContent` como padrão de fábrica.
 */
export function Hero({ settings }: { settings: SiteSettings }) {
  const { hero } = homeContent;
  const eyebrow = settings.heroEyebrow || hero.eyebrow;
  const headline = settings.heroHeadline || hero.headline;
  const description = settings.heroSubheadline || hero.description;
  const primaryLabel = settings.heroPrimaryCta || hero.primaryCta.label;
  const secondaryLabel = settings.heroSecondaryCta || hero.secondaryCta.label;

  return (
    <section className="relative overflow-hidden border-b border-border/60">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid opacity-[0.06] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />
      </div>

      <div className="mx-auto grid max-w-container gap-16 px-6 pb-20 pt-20 sm:pt-28 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center lg:gap-12 lg:pb-28">
        <div className="flex flex-col items-start gap-7">
          <Reveal>
            <span className="eyebrow">{eyebrow}</span>
          </Reveal>

          <Reveal className="w-full">
            <h1 className="max-w-[20ch] text-4xl font-medium leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-[3.4rem]">
              {headline}
            </h1>
          </Reveal>

          <Reveal>
            <p className="measure text-lg leading-relaxed text-muted-foreground">{description}</p>
          </Reveal>

          <Reveal className="flex w-full flex-col gap-3 pt-1 sm:w-auto sm:flex-row sm:items-center">
            <Button asChild size="lg">
              <Link href={hero.primaryCta.href}>
                {primaryLabel}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href={hero.secondaryCta.href}>{secondaryLabel}</Link>
            </Button>
          </Reveal>

          <Reveal className="pt-4">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
              What we build
            </p>
            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
              {capabilities.map((item) => (
                <li key={item} className="text-sm text-muted-foreground">
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal className="w-full">
          <div className="relative">
            {/* Moldura de navegador — fluxo de agendamento do Good Vibes Va’a */}
            <figure className="overflow-hidden rounded-xl border border-border bg-card shadow-[0_24px_80px_-32px_rgba(0,0,0,0.6)]">
              <div className="flex items-center gap-2 border-b border-border/70 bg-secondary/60 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
                <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
                <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
                <span className="ml-3 truncate font-mono text-[11px] text-muted-foreground">
                  goodvibesvaa.vercel.app/agendar
                </span>
              </div>
              <Image
                src="/projects/good-vibes-vaa-agendar.webp"
                alt="Booking flow built for Good Vibes Va’a: experience carousel and a four-step reservation journey."
                width={1600}
                height={1000}
                priority
                sizes="(min-width: 1024px) 640px, 100vw"
                className="w-full"
              />
            </figure>

            {/* Celular sobreposto — loja da Fulô Crochet */}
            <figure className="absolute -bottom-10 -left-6 hidden w-[150px] overflow-hidden rounded-[20px] border border-border bg-card p-1.5 shadow-[0_20px_60px_-24px_rgba(0,0,0,0.7)] sm:block lg:-left-10 lg:w-[172px]">
              <Image
                src="/projects/fulo-crochet-mobile.webp"
                alt="The Fulô Crochet storefront on a phone."
                width={560}
                height={1212}
                sizes="172px"
                className="h-auto w-full rounded-[14px]"
              />
            </figure>
          </div>

          <p className="mt-14 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground sm:mt-6">
            {hero.proofCaption}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
