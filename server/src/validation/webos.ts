import { z } from 'zod';

export const playbookValues = [
  'LOCAL_BUSINESS', 'SAAS', 'ECOMMERCE', 'CONSULTANT', 'AGENCY', 'RESTAURANT', 'FITNESS', 'CREATOR',
  'PERSONAL_BRAND', 'PROFESSIONAL_SERVICES',
] as const;
export const trustElementTypeValues = ['CASE_STUDY', 'CLIENT_LOGO', 'CERTIFICATION'] as const;
export const leadStatusValues = ['NEW', 'CONTACTED', 'QUALIFIED', 'CLOSED'] as const;
export const templateComplexityValues = ['SIMPLE', 'STANDARD', 'ADVANCED'] as const;
export const reservationStatusValues = ['PENDING', 'CONFIRMED', 'SEATED', 'COMPLETED', 'CANCELLED'] as const;
export const siteCurrencyValues = ['USD', 'BRL', 'EUR', 'GBP', 'INR', 'CAD', 'AUD'] as const;
export const reviewStatusValues = ['NEW', 'PUBLISHED', 'HIDDEN'] as const;
export const tableSectionValues = ['INDOOR', 'OUTDOOR', 'PATIO', 'VIP'] as const;

const timeOfDay = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Use 24-hour HH:mm, e.g. 09:00.');

export const generateSiteSchema = z.object({
  businessName: z.string().min(1).max(120),
  industry: z.string().min(1).max(120),
  services: z.array(z.string().min(1).max(80)).min(1).max(10),
  targetAudience: z.string().min(1).max(160),
  playbook: z.enum(playbookValues),
});

// A blank string from an emptied form field clears the setting (falls
// back to the owner's account email / no notification) rather than
// failing validation, so `z.literal('')` is accepted alongside a real
// email for each Business Settings contact field.
const optionalEmail = z.union([z.string().email(), z.literal('')]).optional();

export const updateSiteSchema = z.object({
  businessName: z.string().min(1).max(120).optional(),
  industry: z.string().min(1).max(120).optional(),
  targetAudience: z.string().min(1).max(160).optional(),
  currency: z.enum(siteCurrencyValues).optional(),
  country: z.string().length(2).optional(),
  timezone: z.string().max(60).optional(),
  contactEmail: optionalEmail,
  reservationEmail: optionalEmail,
  reviewEmail: optionalEmail,
  phone: z.union([z.string().max(40), z.literal('')]).optional(),
  whatsappNumber: z.union([z.string().max(40), z.literal('')]).optional(),
  primaryColor: z.union([z.string().regex(/^#[0-9a-fA-F]{6}$/), z.literal('')]).optional(),
  // Restaurant operating settings — all optional, non-restaurant sites
  // never send these.
  maxPartySize: z.number().int().min(1).max(200).nullable().optional(),
  reservationIntervalMinutes: z.number().int().min(5).max(240).optional(),
  openingTime: z.union([timeOfDay, z.literal('')]).optional(),
  closingTime: z.union([timeOfDay, z.literal('')]).optional(),
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
  sections: z.array(z.object({
    type: z.string(),
    heading: z.string(),
    body: z.string(),
    imageUrl: z.string().max(300).nullable().optional(),
  })).optional(),
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
  phone: z.string().max(40).optional(),
  message: z.string().max(2000).optional(),
  source: z.string().max(60).optional(),
});

export const createLeadSchema = z.object({
  pageId: z.string().min(1).optional(),
  name: z.string().max(120).optional(),
  email: z.string().email(),
  phone: z.string().max(40).optional(),
  message: z.string().max(2000).optional(),
  source: z.string().max(60).optional(),
});

export const updateLeadStatusSchema = z.object({
  status: z.enum(leadStatusValues),
});

const reservationFields = {
  customerName: z.string().min(1).max(120),
  customerEmail: z.string().email(),
  customerPhone: z.string().max(40).optional(),
  partySize: z.number().int().min(1).max(30),
  reservationAt: z.string().min(1),
  notes: z.string().max(500).optional(),
};

export const publicReservationSchema = z.object({ siteId: z.string().min(1), ...reservationFields });
export const createReservationSchema = z.object(reservationFields);
export const updateReservationStatusSchema = z.object({ status: z.enum(reservationStatusValues) });
export const assignTableSchema = z.object({ tableId: z.string().min(1).nullable() });

export const createTableSchema = z.object({
  name: z.string().min(1).max(60),
  capacity: z.number().int().min(1).max(50),
  section: z.enum(tableSectionValues).nullable().optional(),
  notes: z.string().max(500).optional(),
});

export const updateTableSchema = z.object({
  name: z.string().min(1).max(60).optional(),
  capacity: z.number().int().min(1).max(50).optional(),
  section: z.enum(tableSectionValues).nullable().optional(),
  notes: z.string().max(500).nullable().optional(),
  active: z.boolean().optional(),
});

export const createReviewPublicSchema = z.object({
  siteId: z.string().min(1),
  authorName: z.string().min(1).max(120),
  authorEmail: z.string().email().optional(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(1).max(2000),
  source: z.string().max(60).optional(),
});

export const updateReviewStatusSchema = z.object({ status: z.enum(reviewStatusValues) });

export const createMenuCategorySchema = z.object({ name: z.string().min(1).max(80) });
export const updateMenuCategorySchema = z.object({
  name: z.string().min(1).max(80).optional(),
  order: z.number().int().min(0).optional(),
});

export const createMenuItemSchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().max(500).optional(),
  priceCents: z.number().int().min(0).max(10_000_00).optional(),
  available: z.boolean().optional(),
  featured: z.boolean().optional(),
});

export const updateMenuItemSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  description: z.string().max(500).nullable().optional(),
  priceCents: z.number().int().min(0).max(10_000_00).nullable().optional(),
  available: z.boolean().optional(),
  featured: z.boolean().optional(),
  order: z.number().int().min(0).optional(),
});
