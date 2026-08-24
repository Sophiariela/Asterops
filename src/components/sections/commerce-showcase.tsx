import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "@/components/shared/reveal";
import { homeContent } from "@/config/content";

export function CommerceShowcase() {
  const { showcase } = homeContent;

  return (
    <section id="showcase" className="scroll-mt-[68px] border-t border-border/60">
      <div className="relative aspect-[21/9] w-full overflow-hidden">
        <Image
          src="/design-inspirations/fulo-crochet/storefront-desktop.svg"
          alt="Fulô Crochet storefront, a CommerceOS implementation in production"
          fill
          sizes="100vw"
          className="object-cover object-top"
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage: [
              "linear-gradient(to top, hsl(var(--background)) 26%, color-mix(in srgb, hsl(var(--background)) 88%, transparent) 48%, color-mix(in srgb, hsl(var(--background)) 32%, transparent) 70%, transparent 92%)",
              "linear-gradient(to bottom, color-mix(in srgb, hsl(var(--background)) 55%, transparent), transparent 18%)",
            ].join(", "),
          }}
        />

        <Reveal className="absolute inset-x-0 bottom-0">
          <div className="mx-auto flex max-w-container flex-col gap-4 px-6 pb-[52px]">
            <span className="h-7 w-[2px] bg-accent" />
            <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-foreground">
              {showcase.kicker}
            </span>
            <h2 className="text-balance text-[clamp(30px,4.4vw,54px)] font-medium leading-[1.05] tracking-[-0.03em] text-foreground">
              {showcase.title}
            </h2>
          </div>
        </Reveal>
      </div>

      <div className="px-6 py-32">
        <div className="mx-auto max-w-container">
          <Reveal>
            <p className="max-w-[64ch] text-base leading-relaxed text-muted-foreground">{showcase.description}</p>
          </Reveal>

          <RevealGroup className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {showcase.facts.map((fact) => (
              <RevealItem key={fact.label} className="flex flex-col gap-3 border-t border-border/60 pt-5">
                <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">
                  {fact.label}
                </span>
                <p className="text-[14.5px] leading-relaxed text-neutral-300">{fact.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal className="mt-12 flex flex-col items-start gap-4 sm:flex-row">
            <Button asChild className="h-[52px] px-[34px] text-base">
              <Link href={showcase.primaryCta.href} target="_blank" rel="noopener">
                {showcase.primaryCta.label}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-[52px] px-[34px] text-base">
              <Link href={showcase.secondaryCta.href}>{showcase.secondaryCta.label}</Link>
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
