import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/shared/reveal";
import { homeContent } from "@/config/content";

export function FinalCta() {
  const { finalCta } = homeContent;

  return (
    <section className="border-t border-border/60 px-6 py-32">
      <Reveal className="relative mx-auto flex max-w-[880px] flex-col items-center gap-6 overflow-hidden rounded-[14px] border border-border bg-card px-8 py-[88px] text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[-180px] h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-accent/20 blur-[120px]"
        />

        <h2 className="relative mx-auto max-w-[26ch] text-balance text-[clamp(32px,4vw,48px)] font-medium leading-[1.1] tracking-[-0.03em] text-foreground">
          {finalCta.title}
        </h2>
        <p className="relative max-w-xl text-base leading-relaxed text-muted-foreground">{finalCta.description}</p>
        <div className="relative flex flex-col items-center gap-4 pt-2 sm:flex-row">
          <Button asChild className="h-[52px] px-[34px] text-base">
            <Link href={finalCta.primaryCta.href}>
              {finalCta.primaryCta.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-[52px] px-[34px] text-base">
            <Link href={finalCta.secondaryCta.href}>{finalCta.secondaryCta.label}</Link>
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
