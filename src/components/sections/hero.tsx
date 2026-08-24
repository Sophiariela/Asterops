import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/shared/reveal";
import { AnimatedBackground } from "@/components/sections/animated-background";
import { homeContent } from "@/config/content";

export function Hero() {
  const { hero } = homeContent;

  return (
    <section className="relative overflow-hidden px-6 pb-24 pt-40 sm:pt-[160px]">
      <AnimatedBackground />

      <div className="mx-auto flex max-w-[960px] flex-col items-center gap-8 text-center">
        <Reveal>
          <span className="font-mono text-xs font-medium uppercase tracking-[0.25em] text-accent">
            {hero.eyebrow}
          </span>
        </Reveal>

        <Reveal className="w-full">
          <h1 className="mx-auto max-w-[19ch] text-balance text-[clamp(44px,7vw,84px)] font-medium leading-[1.02] tracking-[-0.035em] text-foreground">
            {hero.headline}
          </h1>
        </Reveal>

        <Reveal>
          <p className="mx-auto flex max-w-[60ch] flex-col text-[clamp(18px,2.1vw,21px)] leading-[1.6] text-muted-foreground">
            {hero.subheadlineLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </p>
        </Reveal>

        <Reveal className="flex flex-col items-center gap-4 pt-4 sm:flex-row">
          <Button asChild className="h-[52px] px-[34px] text-base">
            <Link href={hero.primaryCta.href}>
              {hero.primaryCta.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-[52px] px-[34px] text-base">
            <Link href={hero.secondaryCta.href}>{hero.secondaryCta.label}</Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
