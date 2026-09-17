import { z } from 'zod';

export const playbookValues = ['LOCAL_BUSINESS', 'SAAS', 'ECOMMERCE', 'CONSULTANT', 'AGENCY', 'RESTAURANT', 'FITNESS'] as const;
export const leadStatusValues = ['NEW', 'QUALIFIED', 'CONVERTED', 'LOST'] as const;

export const generateSiteSchema = z.object({
  businessName: z.string().min(1).max(120),
  industry: z.string().min(1).max(120),
  services: z.array(z.string().min(1).max(80)).min(1).max(10),
  targetAudience: z.string().min(1).max(160),
  playbook: z.enum(playbookValues),
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
