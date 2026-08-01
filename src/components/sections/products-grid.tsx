import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { SectionHeading } from "@/components/shared/section-heading";
import { RevealGroup } from "@/components/shared/reveal";
import { ProductCard } from "@/components/product/product-card";
import { products } from "@/config/products";
import { homeContent } from "@/config/content";

export function ProductsGrid() {
  const { solutions } = homeContent;

  return (
    <section className="border-t border-border/60 px-6 py-24">
      <div className="mx-auto max-w-container">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow={solutions.eyebrow}
            title={solutions.title}
            description={solutions.description}
          />
          <Link
            href="/products"
            className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-accent"
          >
            View all solutions
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <RevealGroup className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
