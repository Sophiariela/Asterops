export type PlaybookKey = 'LOCAL_BUSINESS' | 'SAAS' | 'ECOMMERCE' | 'CONSULTANT' | 'AGENCY' | 'RESTAURANT' | 'FITNESS' | 'CREATOR';
export type SiteStatus = 'DRAFT' | 'PUBLISHED';
export type LeadStatus = 'NEW' | 'QUALIFIED' | 'CONVERTED' | 'LOST';
export type TrustElementType = 'CASE_STUDY' | 'CLIENT_LOGO' | 'CERTIFICATION';

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

export type TrustElement = {
  id: string;
  siteId: string;
  type: TrustElementType;
  title: string;
  description: string | null;
  url: string | null;
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
  trustElements: TrustElement[];
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

export type ArchitectureNode = { type: string; label: string };
export type ArchitecturePage = { pageId: string; slug: string; name: string; nodes: ArchitectureNode[] };

export type ConversionPath = { fromPage: string; toPage: string; ctaLabel: string };
export type DirectCapturePoint = { page: string; ctaLabel: string };
export type LeadFunnelStage = { status: LeadStatus; count: number };
export type ConversionPathsResult = {
  paths: ConversionPath[];
  directCapturePoints: DirectCapturePoint[];
  funnel: LeadFunnelStage[];
};

export type PageInventoryItem = {
  pageId: string;
  name: string;
  purpose: string;
  ctaLabel: string;
  hasLeadCapture: boolean;
  seoStatus: 'complete' | 'incomplete';
  trustElementCount: number;
  performance: null;
};

export type PageSectionInventory = {
  pageId: string;
  name: string;
  sections: { type: string; heading: string }[];
  missingSections: string[];
  optimizationOpportunities: string[];
};

export type TrustCategory = {
  key: 'testimonials' | 'case-studies' | 'client-logos' | 'certifications';
  label: string;
  count: number;
  target: number;
  coverage: number;
};
export type TrustMap = { coverage: number; categories: TrustCategory[]; recommendations: string[] };

export type LeadCapturePoint = { page: string; ctaLabel: string; type: 'direct' | 'routed' };
export type LeadCaptureMap = { coverage: number; points: LeadCapturePoint[] };

export type ReadinessCheck = { label: string; passed: boolean };
export type DeploymentReadiness = { readiness: number; checks: ReadinessCheck[]; missing: string[]; tasksRemaining: number };
