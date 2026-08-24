import { SectionHeading } from "@/components/shared/section-heading";
import { RevealGroup } from "@/components/shared/reveal";
import { SystemCard } from "@/components/product/system-card";
import { products } from "@/config/products";
import { homeContent } from "@/config/content";

export function SystemsGrid() {
  const { systems } = homeContent;

  return (
    <section id="systems" className="scroll-mt-[68px] border-t border-border/60 px-6 py-32">
      <div className="mx-auto max-w-container">
        <SectionHeading eyebrow={systems.eyebrow} title={systems.title} description={systems.description} />

        <RevealGroup className="mt-12 grid grid-cols-1 gap-5 [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]">
          {products.map((product) => (
            <SystemCard key={product.slug} product={product} />
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
