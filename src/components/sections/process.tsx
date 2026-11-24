import { SectionHeading } from "@/components/shared/section-heading";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";
import { homeContent } from "@/config/content";

/**
 * Processo de entrega, em cinco etapas.
 *
 * Numeração em coluna estreita e texto em coluna larga — sem diagrama e sem
 * ícone comemorativo por etapa. É uma lista ordenada de verdade, porque a
 * ordem é a informação.
 */
export function Process() {
  const { process } = homeContent;

  return (
    <section id="process" className="scroll-mt-24 border-b border-border/60 px-6 py-24">
      <div className="mx-auto max-w-container">
        <SectionHeading
          eyebrow={process.eyebrow}
          title={process.title}
          description={process.description}
        />

        <RevealGroup as="ul" className="mt-14 flex flex-col border-t border-border/60">
          {process.steps.map((step) => (
            <RevealItem
              key={step.step}
              as="li"
              className="grid gap-3 border-b border-border/60 py-7 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-10"
            >
              <span className="font-mono text-sm tracking-[0.18em] text-accent-ink sm:pt-0.5">
                {step.step}
              </span>
              <div className="flex flex-col gap-2 sm:grid sm:grid-cols-[minmax(0,0.5fr)_minmax(0,1fr)] sm:gap-10">
                <h3 className="text-base font-medium text-foreground">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
