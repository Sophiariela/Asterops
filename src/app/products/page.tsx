import type { Metadata } from "next";

import { SectionHeading } from "@/components/shared/section-heading";
import { RevealGroup } from "@/components/shared/reveal";
import { ProductCard } from "@/components/product/product-card";
import { CtaSection } from "@/components/sections/cta-section";
import { products } from "@/config/products";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Solutions",
  description:
    "Aster Foundation, Aster Automation and Aster Intelligence — the three systems that make up the technology infrastructure behind modern businesses.",
  path: "/products",
});

export default function ProductsPage() {
  return (
    <>
      <section className="px-6 pb-16 pt-28 sm:pt-36">
        <div className="mx-auto max-w-container">
          <SectionHeading
            eyebrow="Solutions"
            title="The systems that run your business."
            description="Every Aster solution is a standalone, production-ready system — and a piece of the same infrastructure. Combine what you need; leave the rest for later."
          />
        </div>
      </section>

      <section className="px-6 pb-24">
        <RevealGroup className="mx-auto grid max-w-container grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </RevealGroup>
      </section>

      <CtaSection
        title="Not sure which system fits your business?"
        description={`Tell us where you're at and we'll help you find the right starting point.`}
        primaryCta={{ label: "Talk to Us", href: "/contact" }}
        secondaryCta={{ label: "About Aster", href: "/about" }}
      />
    </>
  );
}
