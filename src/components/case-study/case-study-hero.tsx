import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Reveal } from "@/components/shared/reveal";
import { AnimatedBackground } from "@/components/sections/animated-background";
import { DeviceMockup } from "./device-mockup";
import type { CaseStudy } from "@/types";

export function CaseStudyHero({ caseStudy }: { caseStudy: CaseStudy }) {
  const heroMockup =
    caseStudy.gallery.mockups.find((mockup) => mockup.device === "desktop") ?? caseStudy.gallery.mockups[0];

  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-28 sm:pt-36">
      <AnimatedBackground />

      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
        <Reveal>
          <Link
            href="/#case-studies"
            className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All Case Studies
          </Link>
        </Reveal>

        <Reveal className="flex flex-col items-center gap-3">
          <span className="font-mono text-xs font-medium uppercase tracking-[0.25em] text-accent">
            {caseStudy.hero.eyebrow}
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            {caseStudy.industry} &middot; {caseStudy.year}
          </span>
        </Reveal>

        <Reveal>
          <h1 className="text-balance text-4xl font-medium leading-[1.1] tracking-tight text-foreground sm:text-5xl">
            {caseStudy.hero.title}
          </h1>
        </Reveal>

        <Reveal>
          <p className="max-w-xl text-lg leading-relaxed text-foreground/90">{caseStudy.hero.subtitle}</p>
        </Reveal>

        <Reveal>
          <p className="max-w-xl text-base leading-relaxed text-muted-foreground">{caseStudy.hero.summary}</p>
        </Reveal>
      </div>

      {heroMockup ? (
        <Reveal className="mx-auto mt-16 max-w-4xl">
          <DeviceMockup
            {...heroMockup}
            priority
            className="shadow-[0_50px_140px_-50px_rgba(0,0,0,0.4)]"
          />
        </Reveal>
      ) : null}
    </section>
  );
}
