import type { Metadata } from "next";

import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal, RevealGroup, RevealItem } from "@/components/shared/reveal";
import { CtaSection } from "@/components/sections/cta-section";
import { aboutContent } from "@/config/content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description:
    "Aster is a digital systems studio building the intelligent infrastructure ambitious businesses run on — not a web design agency, not a page builder.",
  path: "/about",
});

export default function AboutPage() {
  const { hero, mission, principles, closingCta } = aboutContent;

  return (
    <>
      <section className="px-6 pb-16 pt-28 sm:pt-36">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
          <Reveal>
            <span className="font-mono text-xs font-medium uppercase tracking-[0.25em] text-accent">
              {hero.eyebrow}
            </span>
          </Reveal>
          <Reveal>
            <h1 className="text-balance text-4xl font-medium leading-[1.1] tracking-tight text-foreground sm:text-5xl">
              {hero.headline}
            </h1>
          </Reveal>
          <Reveal>
            <p className="text-lg leading-relaxed text-muted-foreground">{hero.description}</p>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-border/60 px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            eyebrow={mission.eyebrow}
            title={mission.title}
            description={mission.description}
            align="center"
            className="mx-auto items-center text-center"
          />
        </div>
      </section>

      <section className="border-t border-border/60 px-6 py-24">
        <div className="mx-auto max-w-container">
          <SectionHeading eyebrow="Principles" title="How we build." />

          <RevealGroup className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {principles.map((principle) => {
              const Icon = principle.icon;
              return (
                <RevealItem
                  key={principle.title}
                  className="flex flex-col gap-4 rounded-lg border border-border bg-card p-8"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-md border border-accent/30 bg-accent/10 text-accent">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="text-base font-medium text-foreground">{principle.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{principle.description}</p>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </section>

      <CtaSection {...closingCta} />
    </>
  );
}
