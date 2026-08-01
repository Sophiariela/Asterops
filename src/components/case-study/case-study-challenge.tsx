import { X } from "lucide-react";

import { SectionHeading } from "@/components/shared/section-heading";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";
import type { CaseStudy } from "@/types";

export function CaseStudyChallenge({ caseStudy }: { caseStudy: CaseStudy }) {
  return (
    <section className="border-t border-border/60 px-6 py-24">
      <div className="mx-auto max-w-container">
        <SectionHeading
          eyebrow="The Challenge"
          title={caseStudy.challenge.title}
          description={caseStudy.challenge.description}
          className="max-w-2xl"
        />

        <RevealGroup className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {caseStudy.challenge.points.map((point) => (
            <RevealItem
              key={point}
              className="flex items-start gap-3 rounded-lg border border-border bg-card p-5 text-sm leading-relaxed text-muted-foreground"
            >
              <X className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/60" />
              {point}
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
