import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { PortfolioProjectSummary } from "@/types";

const classificationLabel: Record<PortfolioProjectSummary["classification"], string> = {
  CLIENT_PROJECT: "Client Project",
  INTERNAL_PRODUCT: "Internal Product",
  PROTOTYPE: "Prototype",
};

const statusLabel: Record<PortfolioProjectSummary["status"], string> = {
  LIVE: "Live",
  DELIVERED: "Delivered",
  IN_PROGRESS: "In Progress",
};

export function PortfolioCard({ project }: { project: PortfolioProjectSummary }) {
  return (
    <Link
      href={`/portfolio/${project.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-accent/40"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-border/60 bg-secondary">
        {project.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element -- cover images are arbitrary admin-entered URLs, not whitelisted remote hosts
          <img
            src={project.coverImage}
            alt={project.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            {project.name}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-center gap-2">
          <Badge>{project.category}</Badge>
          <Badge variant="outline">{classificationLabel[project.classification]}</Badge>
        </div>
        <h3 className="flex items-center gap-1.5 text-base font-medium text-foreground">
          {project.name}
          <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-accent" />
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{project.shortDescription}</p>
        <span className="mt-auto font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
          {statusLabel[project.status]}
        </span>
      </div>
    </Link>
  );
}

export { classificationLabel, statusLabel };
