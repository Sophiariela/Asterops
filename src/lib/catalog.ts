import { cache } from "react";

import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe-query";

/**
 * Acesso de leitura ao catálogo.
 *
 * Centralizado para que seção e página não repitam a mesma consulta, e para
 * que todas passem pelo mesmo `safeQuery`: falha de banco esconde a seção em
 * vez de derrubar a página. `cache` evita consulta repetida dentro do mesmo
 * render — a home usa categoria e destaque na mesma passada.
 */

export const getCategories = cache(async () =>
  safeQuery(
    "solution categories",
    () =>
      prisma.serviceCategory.findMany({
        where: { published: true },
        orderBy: { order: "asc" },
        include: {
          services: {
            where: { active: true },
            orderBy: { order: "asc" },
          },
        },
      }),
    [],
  ),
);

export const getCategoryBySlug = cache(async (slug: string) =>
  safeQuery(
    `category "${slug}"`,
    () =>
      prisma.serviceCategory.findFirst({
        where: { slug, published: true },
        include: {
          services: {
            where: { active: true },
            orderBy: { order: "asc" },
          },
        },
      }),
    null,
  ),
);

export const getFeaturedSolutions = cache(async (limit = 6) =>
  safeQuery(
    "featured solutions",
    () =>
      prisma.service.findMany({
        where: { active: true, featured: true },
        orderBy: { order: "asc" },
        take: limit,
        include: { category: true },
      }),
    [],
  ),
);

export const getSolution = cache(async (categorySlug: string, solutionSlug: string) =>
  safeQuery(
    `solution "${solutionSlug}"`,
    () =>
      prisma.service.findFirst({
        where: {
          slug: solutionSlug,
          active: true,
          category: { slug: categorySlug, published: true },
        },
        include: {
          category: true,
          faqs: { orderBy: { order: "asc" } },
        },
      }),
    null,
  ),
);

/** Usado por `generateStaticParams` das páginas de solução. */
export const getSolutionParams = cache(async () =>
  safeQuery(
    "solution params",
    () =>
      prisma.service.findMany({
        where: { active: true, category: { published: true } },
        select: { slug: true, category: { select: { slug: true } } },
      }),
    [] as { slug: string; category: { slug: string } | null }[],
  ),
);

/** Caminho canônico de uma solução. */
export function solutionHref(categorySlug: string, solutionSlug: string): string {
  return `/solutions/${categorySlug}/${solutionSlug}`;
}

/**
 * Link para o formulário com a solução já selecionada.
 *
 * A página da solução é o lugar onde a intenção é mais específica, então o
 * CTA carrega categoria e serviço — o formulário lê os dois de searchParams.
 */
export function startProjectHref(options?: { category?: string; service?: string }): string {
  const params = new URLSearchParams();
  if (options?.category) params.set("category", options.category);
  if (options?.service) params.set("service", options.service);
  const query = params.toString();
  return query ? `/contact?${query}` : "/contact";
}
