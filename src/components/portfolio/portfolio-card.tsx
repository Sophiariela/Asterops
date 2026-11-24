import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { PortfolioProjectSummary } from "@/types";

const classificationLabel: Record<PortfolioProjectSummary["classification"], string> = {
  CLIENT_PROJECT: "Projeto de cliente",
  INTERNAL_PRODUCT: "Produto interno",
  PROTOTYPE: "Protótipo",
};

const statusLabel: Record<PortfolioProjectSummary["status"], string> = {
  LIVE: "No ar",
  DELIVERED: "Entregue",
  IN_PROGRESS: "Em andamento",
};

export function PortfolioCard({ project }: { project: PortfolioProjectSummary }) {
  const isLocal = project.coverImage?.startsWith("/");

  return (
    <Link
      href={`/projetos/${project.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-accent/50"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-border/60 bg-secondary">
        {project.coverImage ? (
          isLocal ? (
            <Image
              src={project.coverImage}
              alt={`Captura de tela do projeto ${project.name}.`}
              fill
              sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
              className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element -- capa externa cadastrada no painel; host não está na allowlist do next/image
            <img
              src={project.coverImage}
              alt={`Captura de tela do projeto ${project.name}.`}
              className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
            />
          )
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            {project.name}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{project.category}</Badge>
          <Badge variant="outline">{classificationLabel[project.classification]}</Badge>
        </div>
        <h3 className="flex items-start gap-1.5 text-base font-medium text-foreground">
          {project.name}
          <ArrowUpRight
            className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-accent-ink"
            aria-hidden
          />
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{project.shortDescription}</p>
        <span className="mt-auto pt-2 font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
          {statusLabel[project.status]}
        </span>
      </div>
    </Link>
  );
}

export { classificationLabel, statusLabel };
