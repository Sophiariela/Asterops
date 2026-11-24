import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { getServiceIcon } from "@/lib/service-icons";

interface CategoryCardProps {
  category: {
    code: string;
    name: string;
    slug: string;
    tagline: string;
    description: string;
    icon: string;
  };
  /** Títulos das soluções da categoria, listados como prévia do que há dentro. */
  solutionTitles: string[];
}

/**
 * Cartão de categoria — as quatro frentes do estúdio.
 *
 * Lista os títulos das soluções em vez de só prometer a área: quem chega na
 * home precisa entender o que existe dentro antes de clicar.
 */
export function CategoryCard({ category, solutionTitles }: CategoryCardProps) {
  const Icon = getServiceIcon(category.icon);

  return (
    <Link
      href={`/solutions/${category.slug}`}
      className="group flex h-full flex-col gap-5 rounded-xl border border-border bg-card p-8 transition-colors hover:border-accent/40 focus-visible:border-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-md border border-accent/30 bg-accent/10 text-accent-ink">
          <Icon className="h-[18px] w-[18px]" aria-hidden />
        </span>
        <span className="font-mono text-xs tracking-[0.18em] text-muted-foreground/70">
          {category.code}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-medium tracking-tight text-foreground">{category.name}</h3>
        <p className="text-sm font-medium text-accent-ink">{category.tagline}</p>
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground">{category.description}</p>

      {solutionTitles.length > 0 ? (
        <ul className="flex flex-col gap-1.5 border-t border-border/60 pt-5">
          {solutionTitles.map((title) => (
            <li key={title} className="text-sm text-muted-foreground">
              {title}
            </li>
          ))}
        </ul>
      ) : null}

      <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-medium text-foreground transition-colors group-hover:text-accent-ink">
        View category
        <ArrowRight
          className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
          aria-hidden
        />
      </span>
    </Link>
  );
}
