import Link from "next/link";
import { ArrowRight, PlayCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/shared/reveal";
import { AnimatedBackground } from "@/components/sections/animated-background";
import { homeContent } from "@/config/content";

export function Hero() {
  const { hero } = homeContent;

  return (
    <section className="relative overflow-hidden px-6 pb-24 pt-28 sm:pt-36">
      <AnimatedBackground />

      <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 text-center">
        <Reveal>
          <span className="font-mono text-xs font-medium uppercase tracking-[0.25em] text-accent">
            {hero.eyebrow}
          </span>
        </Reveal>

        <Reveal className="w-full">
          <h1 className="text-balance text-4xl font-medium leading-[1.1] tracking-tight text-foreground sm:text-6xl">
            {hero.headline}
          </h1>
        </Reveal>

        <Reveal>
          <p className="flex flex-col text-lg leading-relaxed text-muted-foreground sm:text-xl">
            {hero.subheadlineLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </p>
        </Reveal>

        <Reveal className="flex flex-col items-center gap-4 pt-4 sm:flex-row">
          <Button asChild size="lg">
            <Link href={hero.primaryCta.href}>
              {hero.primaryCta.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href={hero.secondaryCta.href}>
              <PlayCircle className="h-4 w-4" />
              {hero.secondaryCta.label}
            </Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
