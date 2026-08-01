import { SectionHeading } from "@/components/shared/section-heading";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";
import type { CaseStudy } from "@/types";

export function CaseStudySolution({ caseStudy }: { caseStudy: CaseStudy }) {
  return (
    <section className="border-t border-border/60 px-6 py-24">
      <div className="mx-auto max-w-container">
        <SectionHeading
          eyebrow="The Solution"
          title={caseStudy.solution.title}
          description={caseStudy.solution.description}
        />

        <RevealGroup className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {caseStudy.solution.approach.map((item) => {
            const Icon = item.icon;
            return (
              <RevealItem
                key={item.title}
                className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-md border border-accent/30 bg-accent/10 text-accent">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="text-sm font-medium text-foreground">{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
