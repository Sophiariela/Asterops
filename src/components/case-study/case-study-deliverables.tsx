import { SectionHeading } from "@/components/shared/section-heading";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";
import type { CaseStudy } from "@/types";

export function CaseStudyDeliverables({ caseStudy }: { caseStudy: CaseStudy }) {
  return (
    <section className="border-t border-border/60 px-6 py-24">
      <div className="mx-auto max-w-container">
        <SectionHeading
          eyebrow="Deliverables"
          title="What Aster shipped."
          align="center"
          className="mx-auto items-center text-center"
        />

        <RevealGroup className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {caseStudy.deliverables.map((deliverable) => {
            const Icon = deliverable.icon;
            return (
              <RevealItem
                key={deliverable.title}
                className="flex flex-col gap-4 rounded-lg border border-border bg-card p-8"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-md border border-accent/30 bg-accent/10 text-accent">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="text-base font-medium text-foreground">{deliverable.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{deliverable.description}</p>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
