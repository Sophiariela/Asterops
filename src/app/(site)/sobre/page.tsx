import type { Metadata } from "next";

import { Reveal, RevealGroup, RevealItem } from "@/components/shared/reveal";
import { CtaSection } from "@/components/sections/cta-section";
import { SectionHeading } from "@/components/shared/section-heading";
import { aboutContent } from "@/config/content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Sobre",
  description:
    "A Aster é um estúdio de automação e software: implementa site, agendamento, WhatsApp e sistemas sob medida para negócios que vivem de atendimento.",
  path: "/sobre",
});

export default function SobrePage() {
  const { hero, mission, principles, closingCta } = aboutContent;

  return (
    <>
      <section className="border-b border-border/60 px-6 pb-20 pt-24 sm:pt-32">
        <div className="mx-auto flex max-w-container flex-col gap-5">
          <Reveal>
            <span className="eyebrow">{hero.eyebrow}</span>
          </Reveal>
          <Reveal>
            <h1 className="max-w-[20ch] text-4xl font-medium leading-[1.1] tracking-tight text-foreground sm:text-5xl">
              {hero.headline}
            </h1>
          </Reveal>
          <Reveal>
            <p className="measure text-lg leading-relaxed text-muted-foreground">{hero.description}</p>
          </Reveal>
        </div>
      </section>

      <section className="border-b border-border/60 px-6 py-24">
        <div className="mx-auto max-w-container">
          <SectionHeading eyebrow={mission.eyebrow} title={mission.title} description={mission.description} />

          <RevealGroup className="mt-14 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
            {principles.map((principle) => (
              <RevealItem key={principle.title} className="flex flex-col gap-3 bg-background p-8">
                <h3 className="text-base font-medium text-foreground">{principle.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{principle.description}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <CtaSection {...closingCta} />
    </>
  );
}
