import { SectionHeading } from "@/components/shared/section-heading";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";
import { Badge } from "@/components/ui/badge";
import { homeContent } from "@/config/content";

export function Industries() {
  const { industries } = homeContent;

  return (
    <section className="border-t border-border/60 px-6 py-24">
      <div className="mx-auto max-w-container">
        <SectionHeading
          eyebrow={industries.eyebrow}
          title={industries.title}
          description={industries.description}
          align="center"
          className="mx-auto items-center text-center"
        />

        <RevealGroup className="mt-12 flex flex-wrap items-center justify-center gap-3">
          {industries.items.map((item) => {
            const Icon = item.icon;
            return (
              <RevealItem key={item.name}>
                <Badge variant="outline" className="gap-2 px-4 py-2 text-sm normal-case tracking-normal">
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Badge>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
