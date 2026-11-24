import { z } from "zod";

/**
 * Schemas compartilhados entre a rota de coleção e a de item.
 *
 * Eles moram aqui, e não dentro de `route.ts`, porque um arquivo de rota do
 * App Router só pode exportar os handlers HTTP e a configuração de rota —
 * exportar qualquer outro símbolo quebra a checagem de tipos do build.
 */
const slug = z
  .string()
  .min(1)
  .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers and hyphens only.");

export const faqSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
  published: z.boolean().default(true),
  order: z.number().int().default(0),
});

export const categorySchema = z.object({
  code: z.string().min(1).max(8),
  name: z.string().min(1),
  slug,
  tagline: z.string().default(""),
  description: z.string().default(""),
  icon: z.string().min(1),
  order: z.number().int().default(0),
  published: z.boolean().default(true),
});

/** Uma solução do catálogo — cartão e página de detalhe no mesmo registro. */
export const serviceSchema = z.object({
  title: z.string().min(1),
  slug,
  description: z.string().min(1),
  icon: z.string().min(1),
  active: z.boolean().default(true),
  order: z.number().int().default(0),
  categoryId: z.string().min(1).nullable().optional(),
  outcome: z.string().default(""),
  headline: z.string().default(""),
  problem: z.string().default(""),
  idealCustomer: z.string().default(""),
  capabilities: z.array(z.string().min(1)).default([]),
  functionality: z.array(z.string().min(1)).default([]),
  useCases: z.array(z.string().min(1)).default([]),
  integrations: z.array(z.string().min(1)).default([]),
  scopeNotes: z.string().default(""),
  implementationNote: z.string().default(""),
  commercialModel: z
    .enum(["FIXED_SCOPE", "CUSTOM_QUOTE", "SETUP_PLUS_MAINTENANCE", "SUBSCRIPTION"])
    .default("CUSTOM_QUOTE"),
  availability: z
    .enum(["OPERATIONAL_PRODUCT", "CUSTOM_DEVELOPMENT", "DEMONSTRATION"])
    .default("CUSTOM_DEVELOPMENT"),
  priceLabel: z.string().min(1).default("Request a project estimate."),
  ctaLabel: z.string().min(1).default("Start a Project"),
  previewImage: z.string().nullable().optional(),
  previewCaption: z.string().nullable().optional(),
  featured: z.boolean().default(false),
});
