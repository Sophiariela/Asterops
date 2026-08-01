import { SectionHeading } from "@/components/shared/section-heading";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";
import type { CaseStudy } from "@/types";

export function CaseStudyResults({ caseStudy }: { caseStudy: CaseStudy }) {
  const { title, statement, metrics } = caseStudy.results;

  return (
    <section className="border-t border-border/60 px-6 py-24">
      <div className="mx-auto max-w-container">
        <SectionHeading
          eyebrow={title}
          title={statement}
          align="center"
          className="mx-auto max-w-2xl items-center text-center"
        />

        <RevealGroup className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {metrics.map((metric) => (
            <RevealItem
              key={metric.label}
              className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border bg-card/50 px-4 py-8 text-center"
            >
              <span className="font-mono text-3xl font-medium tabular-nums text-muted-foreground/40">&mdash;</span>
              <span className="text-sm font-medium text-foreground">{metric.label}</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Future metric
              </span>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
