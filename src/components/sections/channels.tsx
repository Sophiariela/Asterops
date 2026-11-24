import { SectionHeading } from "@/components/shared/section-heading";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";
import { Badge } from "@/components/ui/badge";
import { channelsContent } from "@/config/content";

/**
 * WhatsApp e Pix.
 *
 * Cada item diz, na etiqueta, se é implementação padrão ou se depende de
 * escopo (API oficial do WhatsApp, aprovação de template, provedor de
 * pagamento). Integração que não está pronta aparece como possibilidade
 * de implementação — nunca como recurso existente.
 */
export function Channels() {
  const content = channelsContent;

  return (
    <section className="border-b border-border/60 px-6 py-24">
      <div className="mx-auto max-w-container">
        <SectionHeading eyebrow={content.eyebrow} title={content.title} description={content.description} />

        <RevealGroup className="mt-14 grid gap-6 md:grid-cols-3">
          {content.items.map((item) => (
            <RevealItem
              key={item.title}
              className="flex h-full flex-col gap-3 rounded-xl border border-border bg-card p-7"
            >
              <Badge variant={item.availability === "Padrão" ? "solid" : "outline"}>
                {item.availability}
              </Badge>
              <h3 className="mt-1 text-base font-medium text-foreground">{item.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
