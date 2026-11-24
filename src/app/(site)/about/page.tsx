import type { Metadata } from "next";

import { Reveal, RevealGroup, RevealItem } from "@/components/shared/reveal";
import { CtaSection } from "@/components/sections/cta-section";
import { SectionHeading } from "@/components/shared/section-heading";
import { aboutContent } from "@/config/content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description:
    "Aster is a digital products and software studio. We combine product strategy, design and engineering to build websites, applications, business systems and automation.",
  path: "/about",
});

export default function AboutPage() {
  const { hero, mission, capabilities, principles, closingCta } = aboutContent;

  return (
    <>
      <section className="border-b border-border/60 px-6 pb-20 pt-24 sm:pt-32">
        <div className="mx-auto flex max-w-container flex-col gap-5">
          <Reveal>
            <span className="eyebrow">{hero.eyebrow}</span>
          </Reveal>
          <Reveal>
            <h1 className="max-w-[22ch] text-4xl font-medium leading-[1.1] tracking-tight text-foreground sm:text-5xl">
              {hero.headline}
            </h1>
          </Reveal>
          <Reveal>
            <p className="measure text-lg leading-relaxed text-muted-foreground">
              {hero.description}
            </p>
          </Reveal>
        </div>
      </section>

      {/* As três capacidades que o estúdio comunica. */}
      <section className="border-b border-border/60 px-6 py-24">
        <div className="mx-auto max-w-container">
          <SectionHeading
            eyebrow="What the studio does"
            title="Three capabilities, one team."
            description="Most projects use more than one of these, which is the reason they sit in the same studio rather than being handed between suppliers."
          />

          <RevealGroup as="ul" className="mt-14 flex flex-col border-t border-border/60">
            {capabilities.map((capability, index) => (
              <RevealItem
                key={capability.title}
                as="li"
                className="grid gap-3 border-b border-border/60 py-7 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-10"
              >
                <span className="font-mono text-sm tracking-[0.18em] text-accent-ink sm:pt-0.5">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="flex flex-col gap-2 sm:grid sm:grid-cols-[minmax(0,0.6fr)_minmax(0,1fr)] sm:gap-10">
                  <h3 className="text-base font-medium text-foreground">{capability.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {capability.description}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="border-b border-border/60 px-6 py-24">
        <div className="mx-auto max-w-container">
          <SectionHeading
            eyebrow={mission.eyebrow}
            title={mission.title}
            description={mission.description}
          />

          <RevealGroup className="mt-14 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
            {principles.map((principle) => (
              <RevealItem key={principle.title} className="flex flex-col gap-3 bg-background p-8">
                <h3 className="text-base font-medium text-foreground">{principle.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {principle.description}
                </p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <CtaSection {...closingCta} />
    </>
  );
}
