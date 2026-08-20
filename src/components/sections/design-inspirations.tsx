import { SectionHeading } from "@/components/shared/section-heading";
import { RevealGroup } from "@/components/shared/reveal";
import { InspirationCard } from "@/components/inspiration/inspiration-card";
import { designInspirations, designInspirationsContent } from "@/config/inspirations";

/**
 * Homepage "Design Inspirations" section — visual references illustrating
 * Aster's design and execution standard. Never frame these as products,
 * templates, or anything purchasable; the disclaimer under the grid exists to
 * keep that line explicit for visitors too.
 */
export function DesignInspirations() {
  const { eyebrow, title, description, disclaimer } = designInspirationsContent;

  return (
    <section id="design-inspirations" className="border-t border-border/60 px-6 py-24">
      <div className="mx-auto max-w-container">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />

        <RevealGroup className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {designInspirations.map((inspiration) => (
            <InspirationCard key={inspiration.slug} inspiration={inspiration} />
          ))}
        </RevealGroup>

        <p className="mx-auto mt-10 max-w-xl text-center text-xs italic leading-relaxed text-muted-foreground/80">
          {disclaimer}
        </p>
      </div>
    </section>
  );
}
