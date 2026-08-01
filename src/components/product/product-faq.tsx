import { SectionHeading } from "@/components/shared/section-heading";
import { FaqAccordion } from "@/components/shared/faq-accordion";
import type { Product } from "@/types";

export function ProductFaq({ product }: { product: Product }) {
  return (
    <section className="border-t border-border/60 px-6 py-24">
      <div className="mx-auto grid max-w-container gap-12 lg:grid-cols-[1fr_1.4fr]">
        <SectionHeading eyebrow="FAQ" title="Common questions." />
        <FaqAccordion items={product.faq} />
      </div>
    </section>
  );
}
