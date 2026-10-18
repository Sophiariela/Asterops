import type { PlaybookKey, TemplateSummary } from './types';

// A marketplace-facing grouping on top of the playbook key — purely a
// display/filtering concern (the key is still what determines actual
// site functionality; see PublicSiteRenderer).
export type TemplateCategory =
  | 'Restaurants & Hospitality' | 'Professional Services' | 'Beauty & Wellness' | 'Retail & Ecommerce'
  | 'Creative & Personal Brands' | 'Education' | 'Local Services' | 'General & SaaS';

export const CATEGORY_BY_PLAYBOOK: Record<PlaybookKey, TemplateCategory> = {
  RESTAURANT: 'Restaurants & Hospitality',
  HOTEL: 'Restaurants & Hospitality',
  CATERING: 'Restaurants & Hospitality',
  CONSULTANT: 'Professional Services',
  PROFESSIONAL_SERVICES: 'Professional Services',
  AGENCY: 'Professional Services',
  SALON: 'Beauty & Wellness',
  FITNESS: 'Beauty & Wellness',
  ECOMMERCE: 'Retail & Ecommerce',
  CREATOR: 'Creative & Personal Brands',
  PERSONAL_BRAND: 'Creative & Personal Brands',
  EDUCATION: 'Education',
  LOCAL_SERVICES: 'Local Services',
  LOCAL_BUSINESS: 'General & SaaS',
  SAAS: 'General & SaaS',
};

export const ALL_CATEGORIES: TemplateCategory[] = [
  'Restaurants & Hospitality', 'Professional Services', 'Beauty & Wellness', 'Retail & Ecommerce',
  'Creative & Personal Brands', 'Education', 'Local Services', 'General & SaaS',
];

// Playbooks that book a real time slot via the appointment-availability
// engine or RESTAURANT's table system — kept distinct from "ecommerce"
// and "quote/inquiry" capability so the Template Library can filter by
// exactly what the brief asks for ("booking support", "ecommerce
// support", "lead generation support").
const BOOKING_PLAYBOOKS = new Set<PlaybookKey>(['RESTAURANT', 'CONSULTANT', 'PROFESSIONAL_SERVICES', 'SALON', 'EDUCATION', 'FITNESS']);
const QUOTE_INQUIRY_PLAYBOOKS = new Set<PlaybookKey>(['HOTEL', 'CATERING', 'LOCAL_SERVICES']);

export function templateCapabilities(t: Pick<TemplateSummary, 'key' | 'isEcommerce'>) {
  return {
    booking: BOOKING_PLAYBOOKS.has(t.key),
    quoteOrInquiry: QUOTE_INQUIRY_PLAYBOOKS.has(t.key),
    ecommerce: t.isEcommerce,
    // Every template captures leads in some form (even booking/ecommerce
    // ones keep a generic contact page) — "lead generation support" in
    // the filter means a template whose PRIMARY mechanism is a lead/
    // inquiry form rather than booking or checkout.
    leadGeneration: !BOOKING_PLAYBOOKS.has(t.key) && !t.isEcommerce,
  };
}
