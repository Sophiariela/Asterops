import { SectionHeading } from "@/components/shared/section-heading";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";
import { homeContent } from "@/config/content";

export function HowItWorks() {
  const { howItWorks } = homeContent;

  return (
    <section className="border-t border-border/60 px-6 py-24">
      <div className="mx-auto max-w-container">
        <SectionHeading
          eyebrow={howItWorks.eyebrow}
          title={howItWorks.title}
          description={howItWorks.description}
        />

        <RevealGroup className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {howItWorks.steps.map((step, index) => (
            <RevealItem key={step.title} className="relative flex flex-col gap-4">
              <span className="font-mono text-4xl font-medium text-accent/30">{step.index}</span>
              <h3 className="text-lg font-medium text-foreground">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              {index < howItWorks.steps.length - 1 ? (
                <span className="absolute right-[-1rem] top-4 hidden h-px w-8 bg-border lg:block" />
              ) : null}
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
