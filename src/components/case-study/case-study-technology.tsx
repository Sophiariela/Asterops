import { SectionHeading } from "@/components/shared/section-heading";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";
import type { CaseStudy } from "@/types";

export function CaseStudyTechnology({ caseStudy }: { caseStudy: CaseStudy }) {
  const { title, description, categories } = caseStudy.technology;

  return (
    <section className="border-t border-border/60 px-6 py-24">
      <div className="mx-auto max-w-container">
        <SectionHeading eyebrow="Technology" title={title} description={description} />

        <RevealGroup className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((category) => (
            <RevealItem
              key={category.label}
              className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6"
            >
              <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">
                {category.label}
              </span>
              <ul className="flex flex-col gap-2">
                {category.items.map((item) => (
                  <li key={item} className="text-sm leading-relaxed text-foreground">
                    {item}
                  </li>
                ))}
              </ul>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
