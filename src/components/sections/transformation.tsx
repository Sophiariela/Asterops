import { ArrowRight, Check, Minus } from "lucide-react";

import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { homeContent } from "@/config/content";

/**
 * Antes / depois.
 *
 * Duas colunas de texto, sem ícone comemorativo em cada linha: o "antes"
 * usa traço, o "depois" usa marca. A nota no fim existe para não vender
 * negócio 100% automático — ver `transformation.note` em config/content.
 */
export function Transformation() {
  const { transformation } = homeContent;

  return (
    <section className="border-b border-border/60 px-6 py-24">
      <div className="mx-auto max-w-container">
        <SectionHeading
          eyebrow={transformation.eyebrow}
          title={transformation.title}
          description={transformation.description}
        />

        <div className="mt-14 grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-[1fr_auto_1fr]">
          <div className="flex flex-col gap-5 bg-background p-8 sm:p-10">
            <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
              {transformation.before.title}
            </h3>
            <ul className="flex flex-col gap-4">
              {transformation.before.items.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                  <Minus className="mt-[3px] h-4 w-4 shrink-0 text-muted-foreground/50" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div
            className="hidden items-center justify-center bg-background px-4 md:flex"
            aria-hidden
          >
            <ArrowRight className="h-5 w-5 text-accent-ink" />
          </div>

          <div className="flex flex-col gap-5 bg-card p-8 sm:p-10">
            <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-accent-ink">
              {transformation.after.title}
            </h3>
            <ul className="flex flex-col gap-4">
              {transformation.after.items.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-foreground">
                  <Check className="mt-[3px] h-4 w-4 shrink-0 text-accent-ink" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Reveal>
          <p className="measure mt-8 text-sm leading-relaxed text-muted-foreground">
            {transformation.note}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
