import { SectionHeading } from "@/components/shared/section-heading";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";
import { homeContent } from "@/config/content";

export function Process() {
  const { process } = homeContent;

  return (
    <section id="process" className="scroll-mt-[68px] border-t border-border/60 px-6 py-32">
      <div className="mx-auto max-w-container">
        <SectionHeading eyebrow={process.eyebrow} title={process.title} />

        <RevealGroup className="mt-12 grid grid-cols-1 gap-9 [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]">
          {process.steps.map((step) => (
            <RevealItem key={step.title} className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="font-mono text-4xl font-medium leading-none tracking-[-0.04em] text-accent/[0.32]">
                  {step.index}
                </span>
                <span className="h-px flex-1 bg-border" />
              </div>
              <h3 className="text-lg font-medium text-foreground">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
