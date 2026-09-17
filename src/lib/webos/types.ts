export type PlaybookKey = 'LOCAL_BUSINESS' | 'SAAS' | 'ECOMMERCE' | 'CONSULTANT' | 'AGENCY' | 'RESTAURANT' | 'FITNESS';
export type SiteStatus = 'DRAFT' | 'PUBLISHED';
export type LeadStatus = 'NEW' | 'QUALIFIED' | 'CONVERTED' | 'LOST';

export type Playbook = { key: PlaybookKey; label: string; description: string };

export type Section = { type: string; heading: string; body: string };

export type Page = {
  id: string;
  siteId: string;
  slug: string;
  name: string;
  heroHeadline: string;
  heroSubheadline: string;
  ctaLabel: string;
  ctaHref: string | null;
  sections: Section[];
  seoTitle: string | null;
  seoDescription: string | null;
  hasLeadForm: boolean;
  order: number;
};

export type Testimonial = {
  id: string;
  siteId: string;
  authorName: string;
  authorRole: string | null;
  quote: string;
  rating: number | null;
  createdAt: string;
};

export type Site = {
  id: string;
  businessName: string;
  industry: string;
  targetAudience: string;
  playbook: PlaybookKey;
  status: SiteStatus;
  pages: Page[];
  testimonials: Testimonial[];
  createdAt: string;
  updatedAt: string;
  _count?: { pages: number; testimonials: number; leads: number };
};

export type HealthFactor = { key: string; label: string; available: boolean; score: number | null; detail: string };
export type WebsiteHealth = { siteId: string; score: number; factors: HealthFactor[]; strengths: string[]; issues: string[] };

export type ConversionCheck = { key: string; label: string; penalty: number; detail: string; recommendation: string | null };
export type ConversionAudit = { score: number; checks: ConversionCheck[]; recommendations: string[] };

export type TrustGap = { hasGap: boolean; testimonialCount: number; target: number; message: string; recommendation: string | null };

export type RecommendedAction = { label: string; source: 'conversion' | 'trust' | 'leads' };

export type Lead = {
  id: string;
  siteId: string;
  pageId: string | null;
  page?: { name: string } | null;
  name: string | null;
  email: string;
  message: string | null;
  source: string | null;
  status: LeadStatus;
  createdAt: string;
};
