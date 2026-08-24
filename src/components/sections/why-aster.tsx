import { Check, X } from "lucide-react";

import { Reveal, RevealGroup, RevealItem } from "@/components/shared/reveal";
import { homeContent } from "@/config/content";

export function WhyAster() {
  const { whyAster } = homeContent;

  return (
    <section className="border-t border-border/60 px-6 py-32">
      <div className="mx-auto max-w-container">
        <Reveal>
          <h2 className="mx-auto max-w-2xl text-balance text-center text-[clamp(32px,4vw,48px)] font-medium leading-[1.1] tracking-[-0.03em] text-foreground">
            {whyAster.title}
          </h2>
        </Reveal>

        <RevealGroup className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2">
          <RevealItem className="flex flex-col gap-5 rounded-[10px] border border-border p-9">
            <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
              {whyAster.traditional.label}
            </span>
            <ul className="flex flex-col gap-4">
              {whyAster.traditional.items.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[14.5px] leading-[1.6] text-neutral-400">
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-neutral-600" />
                  {item}
                </li>
              ))}
            </ul>
          </RevealItem>

          <RevealItem className="flex flex-col gap-5 rounded-[10px] border border-accent/40 bg-card p-9 shadow-elevated">
            <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">
              {whyAster.aster.label}
            </span>
            <ul className="flex flex-col gap-4">
              {whyAster.aster.items.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[14.5px] leading-[1.6] text-foreground">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  );
}
