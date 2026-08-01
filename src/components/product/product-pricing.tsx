import Link from "next/link";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/section-heading";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

export function ProductPricing({ product }: { product: Product }) {
  const { pricing } = product;
  if (!pricing) return null;

  return (
    <section id="pricing" className="scroll-mt-24 border-t border-border/60 px-6 py-24">
      <div className="mx-auto max-w-container">
        <SectionHeading
          eyebrow="Pricing"
          title={pricing.title}
          description={pricing.description}
          align="center"
          className="mx-auto items-center text-center"
        />

        <RevealGroup className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {pricing.tiers.map((tier) => (
            <RevealItem
              key={tier.name}
              className={cn(
                "flex flex-col gap-6 rounded-lg border p-8",
                tier.highlighted ? "border-accent/50 bg-accent/[0.04]" : "border-border bg-card",
              )}
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-medium text-foreground">{tier.name}</h3>
                  {tier.highlighted ? (
                    <span className="font-mono text-[10px] font-medium uppercase tracking-wide text-accent">
                      Most Popular
                    </span>
                  ) : null}
                </div>
                <p className="text-sm text-muted-foreground">{tier.description}</p>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-medium tracking-tight text-foreground">{tier.price}</span>
                <span className="text-sm text-muted-foreground">{tier.period}</span>
              </div>

              <ul className="flex flex-1 flex-col gap-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button asChild variant={tier.highlighted ? "default" : "outline"} className="w-full">
                <Link href={tier.cta.href}>{tier.cta.label}</Link>
              </Button>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
