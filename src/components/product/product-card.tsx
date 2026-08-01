import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { RevealItem } from "@/components/shared/reveal";
import type { Product } from "@/types";

export function ProductCard({ product }: { product: Product }) {
  const Icon = product.icon;

  return (
    <RevealItem>
      <Link
        href={`/product/${product.slug}`}
        className="group flex h-full flex-col gap-6 rounded-lg border border-border bg-card p-8 transition-colors hover:border-accent/40"
      >
        <div className="flex items-start justify-between">
          <span className="flex h-11 w-11 items-center justify-center rounded-md border border-accent/30 bg-accent/10 text-accent">
            <Icon className="h-5 w-5" />
          </span>
          <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-medium text-foreground">{product.name}</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">{product.shortDescription}</p>
        </div>
      </Link>
    </RevealItem>
  );
}
