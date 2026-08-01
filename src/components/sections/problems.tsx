import { SectionHeading } from "@/components/shared/section-heading";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";
import { homeContent } from "@/config/content";

export function Problems() {
  const { problems } = homeContent;

  return (
    <section className="border-t border-border/60 px-6 py-24">
      <div className="mx-auto max-w-container">
        <SectionHeading
          eyebrow={problems.eyebrow}
          title={problems.title}
          description={problems.description}
        />

        <RevealGroup className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {problems.items.map((item) => {
            const Icon = item.icon;
            return (
              <RevealItem
                key={item.problem}
                className="flex flex-col gap-4 rounded-lg border border-border bg-card p-8"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-md border border-accent/30 bg-accent/10 text-accent">
                  <Icon className="h-5 w-5" />
                </span>
                <p className="text-base font-medium text-foreground">&ldquo;{item.problem}&rdquo;</p>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.solution}</p>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
