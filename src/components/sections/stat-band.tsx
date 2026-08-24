import { RevealGroup, RevealItem } from "@/components/shared/reveal";
import { homeContent } from "@/config/content";

export function StatBand() {
  const { stats } = homeContent;

  return (
    <section className="border-t border-border/60 px-6 pb-32 pt-[120px]">
      <RevealGroup className="mx-auto grid max-w-container grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
        {stats.map((stat) => (
          <RevealItem key={stat.label} className="flex flex-col gap-2">
            <span className="font-mono text-[clamp(30px,3.4vw,42px)] font-medium leading-none tracking-[-0.04em] text-foreground">
              {stat.value}
            </span>
            <span className="text-[13.5px] leading-relaxed text-muted-foreground">{stat.label}</span>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
