import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { getServiceIcon } from "@/lib/service-icons";
import { solutionHref } from "@/lib/catalog";
import { cn } from "@/lib/utils";

interface SolutionCardProps {
  solution: {
    title: string;
    slug: string;
    description: string;
    outcome: string;
    icon: string;
  };
  categorySlug: string;
  /** Nome da categoria, mostrado quando o cartão aparece fora dela. */
  categoryName?: string;
  className?: string;
}

/**
 * Cartão de solução.
 *
 * O cartão vende o resultado e leva para a página da solução — ele não é o
 * destino. O briefing é explícito: o catálogo não pode ser uma coleção de
 * card raso, então aqui fica só o suficiente para decidir clicar.
 */
export function SolutionCard({
  solution,
  categorySlug,
  categoryName,
  className,
}: SolutionCardProps) {
  const Icon = getServiceIcon(solution.icon);

  return (
    <Link
      href={solutionHref(categorySlug, solution.slug)}
      className={cn(
        "group flex h-full flex-col gap-4 rounded-xl border border-border bg-card p-7",
        "transition-colors hover:border-accent/40 focus-visible:border-accent/40",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40",
        className,
      )}
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-md border border-accent/30 bg-accent/10 text-accent-ink">
        <Icon className="h-[18px] w-[18px]" aria-hidden />
      </span>

      {categoryName ? (
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          {categoryName}
        </span>
      ) : null}

      <h3 className="text-base font-medium text-foreground">{solution.title}</h3>

      <p className="text-sm font-medium text-accent-ink">{solution.outcome}</p>

      <p className="text-sm leading-relaxed text-muted-foreground">{solution.description}</p>

      <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-medium text-foreground transition-colors group-hover:text-accent-ink">
        Explore Solution
        <ArrowRight
          className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
          aria-hidden
        />
      </span>
    </Link>
  );
}
