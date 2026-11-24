import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/shared/reveal";
import type { CtaLink } from "@/types";

interface CtaSectionProps {
  title: string;
  description: string;
  primaryCta: CtaLink;
  secondaryCta: CtaLink;
}

/**
 * Fechamento. Painel escuro com a grade de fundo e um fio de bronze no
 * topo — distinto do resto da página sem virar enfeite.
 */
export function CtaSection({ title, description, primaryCta, secondaryCta }: CtaSectionProps) {
  return (
    <section className="px-6 py-24">
      <Reveal className="relative mx-auto max-w-container overflow-hidden rounded-2xl border border-border bg-card">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.07]" aria-hidden />
        <div className="absolute inset-x-0 top-0 h-px bg-accent/60" aria-hidden />
        <div className="relative flex flex-col items-start gap-6 px-8 py-16 sm:px-14 sm:py-20">
          <h2 className="max-w-[20ch] text-3xl font-medium leading-[1.12] tracking-tight text-foreground sm:text-[2.6rem]">
            {title}
          </h2>
          <p className="measure text-base leading-relaxed text-muted-foreground">{description}</p>
          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
            <Button asChild size="lg">
              <Link href={primaryCta.href}>
                {primaryCta.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
