import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { RevealItem } from "@/components/shared/reveal";
import type { Product } from "@/types";

export function SystemCard({ product }: { product: Product }) {
  const { homeCard } = product;
  if (!homeCard) return null;

  return (
    <RevealItem>
      <Link
        href={`/product/${product.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-[10px] border border-border bg-card transition-colors duration-[140ms] ease-out hover:border-accent/40"
      >
        <div className="relative aspect-[3/2] w-full border-b border-border/60 bg-neutral-900">
          <Image
            src={homeCard.previewImage}
            alt={`${product.name} preview`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-1 flex-col gap-4 p-8">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-accent">
              {product.name}
            </span>
            <ArrowUpRight className="h-[18px] w-[18px] text-muted-foreground transition-colors group-hover:text-accent" />
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-medium leading-[1.25] tracking-[-0.015em] text-foreground">
              {product.shortDescription}
            </h3>
            <p className="text-[14.5px] leading-[1.6] text-muted-foreground">{product.tagline}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {homeCard.capabilities.map((capability) => (
              <span
                key={capability}
                className="rounded-full border border-border px-[11px] py-[5px] font-mono text-[10.5px] uppercase tracking-[0.06em] text-muted-foreground"
              >
                {capability}
              </span>
            ))}
          </div>

          <div className="mt-auto flex flex-col gap-1.5 border-t border-border/60 pt-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              Outcome
            </span>
            <span className="text-sm text-foreground">{homeCard.outcome}</span>
          </div>
        </div>
      </Link>
    </RevealItem>
  );
}
