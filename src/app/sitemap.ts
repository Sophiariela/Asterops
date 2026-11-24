import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe-query";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/solutions",
    "/projects",
    "/about",
    "/contact",
    "/legal/privacy",
    "/legal/terms",
  ];

  // Banco fora do ar não deve deixar o sitemap inteiro fora do ar: as
  // rotas fixas continuam sendo publicadas sem as de projeto.
  const projects = await safeQuery(
    "sitemap projects",
    () =>
      prisma.portfolioProject.findMany({
        where: { published: true },
        select: { slug: true },
      }),
    [] as { slug: string }[],
  );
  const projectRoutes = projects.map((project) => `/projects/${project.slug}`);

  const routes = [...staticRoutes, ...projectRoutes];

  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/contact" ? 0.9 : route.startsWith("/projects/") ? 0.7 : 0.6,
  }));
}
