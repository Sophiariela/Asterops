import { SectionHeading } from "@/components/shared/section-heading";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";
import { homeContent } from "@/config/content";

/** Três passos. Sem diagrama, sem seta decorativa: numeral e texto. */
export function HowItWorks() {
  const { howItWorks } = homeContent;

  return (
    <section id="como-funciona" className="scroll-mt-24 border-b border-border/60 px-6 py-24">
      <div className="mx-auto max-w-container">
        <SectionHeading
          eyebrow={howItWorks.eyebrow}
          title={howItWorks.title}
          description={howItWorks.description}
        />

        <RevealGroup className="mt-14 grid gap-10 sm:grid-cols-3 sm:gap-8">
          {howItWorks.steps.map((step) => (
            <RevealItem key={step.step} className="flex flex-col gap-4 border-t border-border pt-6">
              <span className="font-mono text-xs tracking-[0.2em] text-accent-ink">{step.step}</span>
              <h3 className="text-lg font-medium tracking-tight text-foreground">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
