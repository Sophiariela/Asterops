import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/shared/json-ld";
import { ProductHero } from "@/components/product/product-hero";
import { ProductProblemSolution } from "@/components/product/product-problem-solution";
import { ProductFeatures } from "@/components/product/product-features";
import { ProductBenefits } from "@/components/product/product-benefits";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductPricing } from "@/components/product/product-pricing";
import { ProductFaq } from "@/components/product/product-faq";
import { ProductCta } from "@/components/product/product-cta";
import { getProductBySlug, getProductSlugs } from "@/config/products";
import { buildMetadata, productJsonLd } from "@/lib/seo";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getProductSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};

  return buildMetadata({
    title: product.name,
    description: product.hero.description,
    path: `/product/${product.slug}`,
    image: `/product/${product.slug}/opengraph-image`,
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) notFound();

  return (
    <>
      <JsonLd data={productJsonLd(product)} />
      <ProductHero product={product} />
      <ProductProblemSolution product={product} />
      <ProductFeatures product={product} />
      <ProductBenefits product={product} />
      <ProductPricing product={product} />
      <ProductFaq product={product} />
      <ProductGallery examples={product.examples} />
      <ProductCta product={product} />
    </>
  );
}
