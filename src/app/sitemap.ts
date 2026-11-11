import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["", "/services", "/portfolio", "/about", "/contact", "/legal/privacy", "/legal/terms"];

  const projects = await prisma.portfolioProject.findMany({
    where: { published: true },
    select: { slug: true },
  });
  const portfolioRoutes = projects.map((project) => `/portfolio/${project.slug}`);

  const routes = [...staticRoutes, ...portfolioRoutes];

  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route.startsWith("/portfolio/") ? 0.8 : 0.6,
  }));
}
