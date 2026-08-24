import type { Metadata } from "next";

import { Hero } from "@/components/sections/hero";
import { StatBand } from "@/components/sections/stat-band";
import { SystemsGrid } from "@/components/sections/systems-grid";
import { WhyAster } from "@/components/sections/why-aster";
import { CommerceShowcase } from "@/components/sections/commerce-showcase";
import { Industries } from "@/components/sections/industries";
import { Process } from "@/components/sections/process";
import { Trust } from "@/components/sections/trust";
import { FinalCta } from "@/components/sections/final-cta";
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
      <StatBand />
      <SystemsGrid />
      <WhyAster />
      <CommerceShowcase />
      <Industries />
      <Process />
      <Trust />
      <FinalCta />
    </>
  );
}
