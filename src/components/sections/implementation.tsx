import { SectionHeading } from "@/components/shared/section-heading";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";
import { Reveal } from "@/components/shared/reveal";
import { implementationContent } from "@/config/content";

/**
 * "Feito para você" — a implementação como parte visível da oferta.
 *
 * As oito etapas são as do processo real do estúdio. O aviso final existe
 * porque prazo depende de escopo: o site não promete sete dias.
 */
export function Implementation() {
  const content = implementationContent;

  return (
    <section className="border-b border-border/60 px-6 py-24">
      <div className="mx-auto max-w-container">
        <SectionHeading eyebrow={content.eyebrow} title={content.title} description={content.description} />

        <Reveal>
          <p className="mt-10 max-w-3xl border-l-2 border-accent pl-6 text-lg leading-relaxed text-foreground">
            {content.promise}
          </p>
        </Reveal>

        <RevealGroup className="mt-14 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {content.stages.map((stage) => (
            <RevealItem key={stage.step} className="flex flex-col gap-3 bg-background p-6">
              <span className="font-mono text-xs tracking-[0.2em] text-accent-ink">{stage.step}</span>
              <h3 className="text-sm font-medium text-foreground">{stage.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{stage.description}</p>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal>
          <p className="measure mt-8 text-sm leading-relaxed text-muted-foreground">{content.disclaimer}</p>
        </Reveal>
      </div>
    </section>
  );
}
