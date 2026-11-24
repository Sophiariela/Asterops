import { z } from "zod";

/**
 * Schemas compartilhados entre a rota de coleção e a de item.
 *
 * Eles moram aqui, e não dentro de `route.ts`, porque um arquivo de rota do
 * App Router só pode exportar os handlers HTTP e a configuração de rota —
 * exportar qualquer outro símbolo quebra a checagem de tipos do build.
 */
export const faqSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
  published: z.boolean().default(true),
  order: z.number().int().default(0),
});

export const tierSchema = z.object({
  name: z.string().min(1),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers and hyphens only."),
  audience: z.string().min(1),
  problem: z.string().min(1),
  outcome: z.string().min(1),
  inclusions: z.array(z.string().min(1)).default([]),
  customization: z.string().min(1),
  implementation: z.string().min(1),
  priceLabel: z.string().min(1),
  setupLabel: z.string().min(1),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  order: z.number().int().default(0),
});
