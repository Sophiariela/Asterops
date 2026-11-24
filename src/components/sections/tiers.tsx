import Link from "next/link";
import { Check } from "lucide-react";

import { SectionHeading } from "@/components/shared/section-heading";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { homeContent } from "@/config/content";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe-query";
import { cn } from "@/lib/utils";

/**
 * Níveis de solução (Presença / Agenda / Operação).
 *
 * Preço e taxa de implementação vêm do banco como RÓTULO, não como número:
 * enquanto o estúdio não publicar um valor, o cartão mostra "Solicite uma
 * proposta personalizada" em vez de inventar preço. O CTA leva ao
 * formulário com o nível já selecionado.
 */
export async function Tiers() {
  const { tiers } = homeContent;
  const rows = await safeQuery(
    "solution tiers",
    () =>
      prisma.solutionTier.findMany({
        where: { published: true },
        orderBy: { order: "asc" },
      }),
    [],
  );

  if (rows.length === 0) return null;

  return (
    <section id="niveis" className="scroll-mt-24 border-b border-border/60 px-6 py-24">
      <div className="mx-auto max-w-container">
        <SectionHeading eyebrow={tiers.eyebrow} title={tiers.title} description={tiers.description} />

        <RevealGroup className="mt-14 grid gap-6 lg:grid-cols-3">
          {rows.map((tier) => (
            <RevealItem
              key={tier.id}
              className={cn(
                "flex h-full flex-col gap-6 rounded-xl border bg-card p-8",
                tier.featured ? "border-accent/50" : "border-border",
              )}
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-medium tracking-tight text-foreground">{tier.name}</h3>
                  {tier.featured ? <Badge variant="outline">Mais pedido</Badge> : null}
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{tier.audience}</p>
              </div>

              <div className="flex flex-col gap-1.5 border-y border-border py-5">
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  Resultado
                </span>
                <p className="text-sm leading-relaxed text-foreground">{tier.outcome}</p>
              </div>

              <div className="flex flex-col gap-2">
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  Resolve
                </span>
                <p className="text-sm leading-relaxed text-muted-foreground">{tier.problem}</p>
              </div>

              {tier.inclusions.length > 0 ? (
                <div className="flex flex-col gap-3">
                  <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                    Inclui
                  </span>
                  <ul className="flex flex-col gap-2.5">
                    {tier.inclusions.map((item) => (
                      <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
                        <Check className="mt-[3px] h-3.5 w-3.5 shrink-0 text-accent-ink" aria-hidden />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="flex flex-col gap-2">
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  Customização
                </span>
                <p className="text-sm leading-relaxed text-muted-foreground">{tier.customization}</p>
              </div>

              <div className="flex flex-col gap-2">
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  Implementação
                </span>
                <p className="text-sm leading-relaxed text-muted-foreground">{tier.implementation}</p>
              </div>

              <div className="mt-auto flex flex-col gap-4 border-t border-border pt-6">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-foreground">{tier.priceLabel}</p>
                  <p className="text-xs leading-relaxed text-muted-foreground">{tier.setupLabel}</p>
                </div>
                <Button asChild variant={tier.featured ? "default" : "outline"} className="w-full">
                  <Link href={`/contato?plano=${encodeURIComponent(tier.name)}`}>Quero este plano</Link>
                </Button>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        <p className="measure mt-8 text-sm leading-relaxed text-muted-foreground">{tiers.note}</p>
      </div>
    </section>
  );
}
