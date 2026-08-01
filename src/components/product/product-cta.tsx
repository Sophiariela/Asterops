import { CtaSection } from "@/components/sections/cta-section";
import type { Product } from "@/types";

export function ProductCta({ product }: { product: Product }) {
  return <CtaSection {...product.cta} />;
}
