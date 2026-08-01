import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { getProductSlugs } from "@/config/products";
import { getCaseStudySlugs } from "@/config/case-studies";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/products", "/about", "/contact", "/legal/privacy", "/legal/terms"];

  const productRoutes = getProductSlugs().map((slug) => `/product/${slug}`);
  const caseStudyRoutes = getCaseStudySlugs().map((slug) => `/case-studies/${slug}`);

  const routes = [...staticRoutes, ...productRoutes, ...caseStudyRoutes];

  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route.startsWith("/product/") || route.startsWith("/case-studies/") ? 0.8 : 0.6,
  }));
}
