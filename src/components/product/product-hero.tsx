import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/shared/reveal";
import { AnimatedBackground } from "@/components/sections/animated-background";
import type { Product } from "@/types";

export function ProductHero({ product }: { product: Product }) {
  const Icon = product.icon;

  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-28 sm:pt-36">
      <AnimatedBackground />

      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
        <Reveal>
          <Link
            href="/products"
            className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All Solutions
          </Link>
        </Reveal>

        <Reveal className="flex flex-col items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-md border border-accent/30 bg-accent/10 text-accent">
            <Icon className="h-6 w-6" />
          </span>
          <span className="font-mono text-xs font-medium uppercase tracking-[0.25em] text-accent">
            {product.hero.eyebrow}
          </span>
        </Reveal>

        <Reveal>
          <h1 className="text-balance text-4xl font-medium leading-[1.1] tracking-tight text-foreground sm:text-5xl">
            {product.hero.headline}
          </h1>
        </Reveal>

        <Reveal>
          <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
            {product.hero.description}
          </p>
        </Reveal>

        <Reveal className="flex flex-col items-center gap-4 pt-2 sm:flex-row">
          <Button asChild size="lg">
            <Link href={product.cta.primaryCta.href}>
              {product.cta.primaryCta.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          {product.pricing ? (
            <Button asChild variant="outline" size="lg">
              <Link href="#pricing">View Pricing</Link>
            </Button>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}
