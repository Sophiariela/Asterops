import { Reveal, RevealGroup, RevealItem } from "@/components/shared/reveal";
import { homeContent } from "@/config/content";

export function Trust() {
  const { trust } = homeContent;

  return (
    <section className="border-t border-border/60 px-6 py-32">
      <div className="mx-auto max-w-container">
        <Reveal>
          <h2 className="text-[clamp(32px,4vw,48px)] font-medium leading-[1.1] tracking-[-0.03em] text-foreground">
            {trust.title}
          </h2>
        </Reveal>

        <RevealGroup className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {trust.placeholders.map((placeholder) => (
            <RevealItem
              key={placeholder.label}
              className="flex flex-col items-center justify-center gap-3 rounded-[10px] border border-dashed border-border px-8 py-14 text-center"
            >
              <span className="font-mono text-2xl font-medium text-accent/[0.28]">{placeholder.glyph}</span>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {placeholder.label}
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-600">
                Coming soon
              </span>
            </RevealItem>
          ))}
        </RevealGroup>

        <div className="mt-16 border-t border-border/60 pt-12 text-center">
          <p className="text-sm text-muted-foreground">{trust.trustedByLabel}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-14">
            {trust.clientPlaceholders.map((client) => (
              <span key={client} className="font-mono text-sm uppercase tracking-[0.1em] text-neutral-600">
                {client}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
