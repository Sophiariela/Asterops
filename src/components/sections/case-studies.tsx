import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { SectionHeading } from "@/components/shared/section-heading";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";
import { homeContent } from "@/config/content";

export function CaseStudies() {
  const { caseStudies } = homeContent;

  return (
    <section id="case-studies" className="border-t border-border/60 px-6 py-24">
      <div className="mx-auto max-w-container">
        <SectionHeading
          eyebrow={caseStudies.eyebrow}
          title={caseStudies.title}
          description={caseStudies.description}
        />

        <RevealGroup className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {caseStudies.items.map((item) => {
            const card = (
              <>
                <div className="h-40 w-full bg-gradient-to-br from-accent/20 via-accent/5 to-transparent" />
                <div className="flex flex-col gap-2 p-8">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-medium text-foreground">{item.name}</h3>
                    {item.href ? <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground" /> : null}
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                </div>
              </>
            );

            return (
              <RevealItem
                key={item.name}
                className="flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors has-[a:hover]:border-accent/40"
              >
                {item.href ? (
                  <Link href={item.href} className="flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    {card}
                  </Link>
                ) : (
                  card
                )}
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
