import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/shared/reveal";
import type { CtaLink } from "@/types";

interface CtaSectionProps {
  title: string;
  description: string;
  primaryCta: CtaLink;
  secondaryCta: CtaLink;
}

export function CtaSection({ title, description, primaryCta, secondaryCta }: CtaSectionProps) {
  return (
    <section className="border-t border-border/60 px-6 py-24">
      <Reveal className="mx-auto flex max-w-3xl flex-col items-center gap-6 rounded-xl border border-border bg-card px-8 py-16 text-center">
        <h2 className="text-balance text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
          {title}
        </h2>
        <p className="max-w-xl text-base leading-relaxed text-muted-foreground">{description}</p>
        <div className="flex flex-col items-center gap-4 pt-2 sm:flex-row">
          <Button asChild size="lg">
            <Link href={primaryCta.href}>
              {primaryCta.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
