import { z } from 'zod';

export const playbookValues = [
  'LOCAL_BUSINESS', 'SAAS', 'ECOMMERCE', 'CONSULTANT', 'AGENCY', 'RESTAURANT', 'FITNESS', 'CREATOR',
  'PERSONAL_BRAND', 'PROFESSIONAL_SERVICES',
] as const;
export const trustElementTypeValues = ['CASE_STUDY', 'CLIENT_LOGO', 'CERTIFICATION'] as const;
export const leadStatusValues = ['NEW', 'QUALIFIED', 'CONVERTED', 'LOST'] as const;
export const templateComplexityValues = ['SIMPLE', 'STANDARD', 'ADVANCED'] as const;

export const generateSiteSchema = z.object({
  businessName: z.string().min(1).max(120),
  industry: z.string().min(1).max(120),
  services: z.array(z.string().min(1).max(80)).min(1).max(10),
  targetAudience: z.string().min(1).max(160),
  playbook: z.enum(playbookValues),
});

export const generateFromTemplateSchema = z.object({
  templateId: z.string().min(1),
  businessName: z.string().min(1).max(120),
  industry: z.string().min(1).max(120),
  services: z.array(z.string().min(1).max(80)).min(1).max(10),
  targetAudience: z.string().min(1).max(160),
});

export const templateFiltersSchema = z.object({
  industry: z.string().max(120).optional(),
  goal: z.string().max(120).optional(),
  complexity: z.enum(templateComplexityValues).optional(),
  ecommerce: z.enum(['true', 'false']).optional(),
  minScore: z.coerce.number().min(0).max(100).optional(),
  q: z.string().max(120).optional(),
});

export const recommendTemplateSchema = z.object({
  industry: z.string().min(1).max(160),
  targetAudience: z.string().min(1).max(200),
  description: z.string().min(1).max(600),
});

const templateSectionInputSchema = z.object({
  type: z.string().min(1).max(40),
  heading: z.string().min(1).max(160),
  bodyPattern: z.string().min(1).max(2000),
});

const templatePageInputSchema = z.object({
  slug: z.string().min(1).max(60),
  name: z.string().min(1).max(80),
  purpose: z.string().min(1).max(200),
  heroHeadlinePattern: z.string().min(1).max(220),
  heroSubheadlinePattern: z.string().min(1).max(300),
  ctaLabel: z.string().min(1).max(60),
  hasLeadForm: z.boolean(),
  seoTitlePattern: z.string().max(200).optional(),
  seoDescriptionPattern: z.string().max(320).optional(),
  sections: z.array(templateSectionInputSchema).max(10),
});

export const createTemplateSchema = z.object({
  key: z.enum(playbookValues),
  name: z.string().min(1).max(100),
  industry: z.string().min(1).max(120),
  primaryGoal: z.string().min(1).max(80),
  complexity: z.enum(templateComplexityValues),
  description: z.string().min(1).max(300),
  recommendedUseCase: z.string().min(1).max(300),
  isEcommerce: z.boolean().optional(),
  pages: z.array(templatePageInputSchema).min(1).max(12),
});

export const updateTemplateMetaSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().min(1).max(300).optional(),
  recommendedUseCase: z.string().min(1).max(300).optional(),
  isEcommerce: z.boolean().optional(),
});

export const updatePageSchema = z.object({
  heroHeadline: z.string().min(1).max(200).optional(),
  heroSubheadline: z.string().min(1).max(400).optional(),
  ctaLabel: z.string().min(1).max(60).optional(),
  ctaHref: z.string().max(300).nullable().optional(),
  seoTitle: z.string().max(160).nullable().optional(),
  seoDescription: z.string().max(300).nullable().optional(),
  hasLeadForm: z.boolean().optional(),
  sections: z.array(z.object({ type: z.string(), heading: z.string(), body: z.string() })).optional(),
});

export const createTrustElementSchema = z.object({
  type: z.enum(trustElementTypeValues),
  title: z.string().min(1).max(160),
  description: z.string().max(1000).optional(),
  url: z.string().url().optional(),
});

export const createTestimonialSchema = z.object({
  authorName: z.string().min(1).max(120),
  authorRole: z.string().max(120).optional(),
  quote: z.string().min(1).max(1000),
  rating: z.number().int().min(1).max(5).optional(),
});

export const publicLeadSchema = z.object({
  siteId: z.string().min(1),
  pageId: z.string().min(1).optional(),
  name: z.string().max(120).optional(),
  email: z.string().email(),
  message: z.string().max(2000).optional(),
  source: z.string().max(60).optional(),
});

export const createLeadSchema = z.object({
  pageId: z.string().min(1).optional(),
  name: z.string().max(120).optional(),
  email: z.string().email(),
  message: z.string().max(2000).optional(),
  source: z.string().max(60).optional(),
});

export const updateLeadStatusSchema = z.object({
  status: z.enum(leadStatusValues),
});
