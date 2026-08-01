import { Sparkles } from "lucide-react";

import { SectionHeading } from "@/components/shared/section-heading";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";
import type { Product } from "@/types";

export function ProductBenefits({ product }: { product: Product }) {
  return (
    <section className="border-t border-border/60 px-6 py-24">
      <div className="mx-auto max-w-container">
        <SectionHeading eyebrow="Benefits" title="Why teams choose this over a custom build." />

        <RevealGroup className="mt-12 grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2">
          {product.benefits.map((benefit) => (
            <RevealItem key={benefit.title} className="flex gap-4">
              <Sparkles className="mt-1 h-4 w-4 shrink-0 text-accent" />
              <div className="flex flex-col gap-1.5">
                <h3 className="text-base font-medium text-foreground">{benefit.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{benefit.description}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
