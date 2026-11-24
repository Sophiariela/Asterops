import { SectionHeading } from "@/components/shared/section-heading";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";
import { homeContent } from "@/config/content";

/**
 * "Why Aster".
 *
 * Sem número inventado, sem selo e sem lista de checkmark: cada item é uma
 * afirmação sobre como o trabalho é conduzido, que dá para checar depois
 * contra o contrato. O briefing proíbe estatística não comprovável, então
 * aqui não existe nenhuma.
 */
export function WhyAster() {
  const { whyAster } = homeContent;

  return (
    <section className="border-b border-border/60 px-6 py-24">
      <div className="mx-auto max-w-container">
        <SectionHeading
          eyebrow={whyAster.eyebrow}
          title={whyAster.title}
          description={whyAster.description}
        />

        <RevealGroup as="ul" className="mt-14 grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
          {whyAster.items.map((item) => (
            <RevealItem key={item.title} as="li" className="flex flex-col gap-2.5">
              <h3 className="text-base font-medium text-foreground">{item.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
