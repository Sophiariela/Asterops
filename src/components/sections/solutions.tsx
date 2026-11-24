import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { SectionHeading } from "@/components/shared/section-heading";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";
import { ServiceCard } from "@/components/services/service-card";
import { Button } from "@/components/ui/button";
import { homeContent } from "@/config/content";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe-query";

/**
 * "O que implementamos" — lê os serviços publicados no banco, então o
 * painel controla o que aparece aqui. São soluções (resultado para o
 * negócio), não os nomes internos de produto do estúdio.
 */
export async function Solutions({ limit }: { limit?: number } = {}) {
  const { solutions } = homeContent;
  const services = await safeQuery(
    "services",
    () =>
      prisma.service.findMany({
        where: { active: true },
        orderBy: { order: "asc" },
        ...(limit ? { take: limit } : {}),
      }),
    [],
  );

  if (services.length === 0) return null;

  return (
    <section id="solucoes" className="scroll-mt-24 border-b border-border/60 px-6 py-24">
      <div className="mx-auto max-w-container">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow={solutions.eyebrow}
            title={solutions.title}
            description={solutions.description}
          />
          <Button asChild variant="outline" className="w-fit shrink-0">
            <Link href="/solucoes">
              Ver tudo em detalhe
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <RevealGroup className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <RevealItem key={service.id} className="bg-background">
              <ServiceCard service={service} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
