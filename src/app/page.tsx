import type { Metadata } from "next";

import { Hero } from "@/components/sections/hero";
import { Problems } from "@/components/sections/problems";
import { ProductsGrid } from "@/components/sections/products-grid";
import { Industries } from "@/components/sections/industries";
import { DesignInspirations } from "@/components/sections/design-inspirations";
import { CaseStudies } from "@/components/sections/case-studies";
import { HowItWorks } from "@/components/sections/how-it-works";
import { CtaSection } from "@/components/sections/cta-section";
import { homeContent } from "@/config/content";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description: siteConfig.description,
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <Problems />
      <ProductsGrid />
      <Industries />
      <DesignInspirations />
      <CaseStudies />
      <HowItWorks />
      <CtaSection {...homeContent.finalCta} />
    </>
  );
}
