import { Check, X } from "lucide-react";

import { RevealGroup, RevealItem } from "@/components/shared/reveal";
import type { Product } from "@/types";

export function ProductProblemSolution({ product }: { product: Product }) {
  return (
    <section className="border-t border-border/60 px-6 py-24">
      <RevealGroup as="div" className="mx-auto grid max-w-container gap-6 lg:grid-cols-2">
        <RevealItem className="flex flex-col gap-5 rounded-lg border border-border bg-card p-8">
          <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            The Problem
          </span>
          <h3 className="text-2xl font-medium tracking-tight text-foreground">{product.problem.title}</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">{product.problem.description}</p>
          <ul className="mt-2 flex flex-col gap-3">
            {product.problem.points.map((point) => (
              <li key={point} className="flex items-start gap-3 text-sm text-muted-foreground">
                <X className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/60" />
                {point}
              </li>
            ))}
          </ul>
        </RevealItem>

        <RevealItem className="flex flex-col gap-5 rounded-lg border border-accent/30 bg-accent/[0.04] p-8">
          <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">
            The Solution
          </span>
          <h3 className="text-2xl font-medium tracking-tight text-foreground">{product.solution.title}</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">{product.solution.description}</p>
          <ul className="mt-2 flex flex-col gap-3">
            {product.solution.points.map((point) => (
              <li key={point} className="flex items-start gap-3 text-sm text-foreground">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                {point}
              </li>
            ))}
          </ul>
        </RevealItem>
      </RevealGroup>
    </section>
  );
}
