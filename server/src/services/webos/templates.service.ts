import type { SitePlaybook, TemplateComplexity } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import { CommerceError } from '../../lib/commerceError.js';
import { computeLeadGenerationScore } from './templateScoring.js';

export type TemplateFilters = {
  industry?: string;
  goal?: string;
  complexity?: TemplateComplexity;
  ecommerce?: boolean;
  minScore?: number;
  q?: string;
};

const TREE_INCLUDE = {
  pages: { orderBy: { order: 'asc' as const }, include: { sections: { orderBy: { order: 'asc' as const } } } },
};

async function loadOne(id: string) {
  const template = await prisma.template.findUnique({ where: { id }, include: TREE_INCLUDE });
  if (!template) throw new CommerceError(404, 'Template not found.');
  return template;
}

function summarize(template: Awaited<ReturnType<typeof loadOne>>) {
  const { score, factors } = computeLeadGenerationScore(template.pages);
  return {
    id: template.id,
    key: template.key,
    name: template.name,
    industry: template.industry,
    primaryGoal: template.primaryGoal,
    complexity: template.complexity,
    description: template.description,
    recommendedUseCase: template.recommendedUseCase,
    isEcommerce: template.isEcommerce,
    status: template.status,
    version: template.version,
    parentTemplateId: template.parentTemplateId,
    pageCount: template.pages.length,
    leadGenerationScore: score,
    scoreFactors: factors,
  };
}

export async function listPublishedTemplates(filters: TemplateFilters) {
  const templates = await prisma.template.findMany({
    where: { status: 'PUBLISHED' },
    include: TREE_INCLUDE,
    orderBy: { name: 'asc' },
  });
  let summaries = templates.map(summarize);

  if (filters.industry) {
    const v = filters.industry.toLowerCase();
    summaries = summaries.filter((t) => t.industry.toLowerCase().includes(v));
  }
  if (filters.goal) {
    const v = filters.goal.toLowerCase();
    summaries = summaries.filter((t) => t.primaryGoal.toLowerCase().includes(v));
  }
  if (filters.complexity) summaries = summaries.filter((t) => t.complexity === filters.complexity);
  if (filters.ecommerce !== undefined) summaries = summaries.filter((t) => t.isEcommerce === filters.ecommerce);
  if (filters.minScore !== undefined) summaries = summaries.filter((t) => t.leadGenerationScore >= filters.minScore!);
  if (filters.q) {
    const q = filters.q.toLowerCase();
    summaries = summaries.filter(
      (t) => t.name.toLowerCase().includes(q) || t.industry.toLowerCase().includes(q) || t.description.toLowerCase().includes(q),
    );
  }
  return summaries;
}

export async function getPublishedTemplateDetail(id: string) {
  const template = await loadOne(id);
  if (template.status !== 'PUBLISHED') throw new CommerceError(404, 'Template not found.');
  return { ...summarize(template), pages: template.pages };
}

// Backward-compatible shape for the original /webos/sites/playbooks
// endpoint, now backed by real DB templates instead of a hardcoded object.
export async function listPublishedSummariesForLegacyPicker() {
  const templates = await prisma.template.findMany({ where: { status: 'PUBLISHED' }, orderBy: { name: 'asc' } });
  return templates.map((t) => ({ key: t.key, label: t.name, description: t.description }));
}

export async function getPublishedTemplateByKey(key: SitePlaybook) {
  return prisma.template.findFirst({ where: { key, status: 'PUBLISHED' }, include: TREE_INCLUDE });
}

export async function getPublishedTemplateById(id: string) {
  const template = await prisma.template.findFirst({ where: { id, status: 'PUBLISHED' }, include: TREE_INCLUDE });
  if (!template) throw new CommerceError(400, 'Template not found or not published.');
  return template;
}

// --- Admin -------------------------------------------------------------

export async function listAllTemplatesAdmin() {
  const templates = await prisma.template.findMany({
    include: TREE_INCLUDE,
    orderBy: [{ key: 'asc' }, { version: 'desc' }],
  });
  return templates.map(summarize);
}

type TemplateSectionInput = { type: string; heading: string; bodyPattern: string };
type TemplatePageInput = {
  slug: string;
  name: string;
  purpose: string;
  heroHeadlinePattern: string;
  heroSubheadlinePattern: string;
  ctaLabel: string;
  hasLeadForm: boolean;
  seoTitlePattern?: string;
  seoDescriptionPattern?: string;
  sections: TemplateSectionInput[];
};
export type CreateTemplateInput = {
  key: SitePlaybook;
  name: string;
  industry: string;
  primaryGoal: string;
  complexity: TemplateComplexity;
  description: string;
  recommendedUseCase: string;
  isEcommerce?: boolean;
  pages: TemplatePageInput[];
};

export async function createTemplate(input: CreateTemplateInput) {
  const created = await prisma.template.create({
    data: {
      key: input.key,
      name: input.name,
      industry: input.industry,
      primaryGoal: input.primaryGoal,
      complexity: input.complexity,
      description: input.description,
      recommendedUseCase: input.recommendedUseCase,
      isEcommerce: input.isEcommerce ?? false,
      status: 'DRAFT',
      version: 1,
      pages: {
        create: input.pages.map((p, i) => ({
          slug: p.slug,
          name: p.name,
          order: i,
          purpose: p.purpose,
          heroHeadlinePattern: p.heroHeadlinePattern,
          heroSubheadlinePattern: p.heroSubheadlinePattern,
          ctaLabel: p.ctaLabel,
          hasLeadForm: p.hasLeadForm,
          seoTitlePattern: p.seoTitlePattern,
          seoDescriptionPattern: p.seoDescriptionPattern,
          sections: {
            create: p.sections.map((s, j) => ({ type: s.type, heading: s.heading, bodyPattern: s.bodyPattern, order: j })),
          },
        })),
      },
    },
    include: TREE_INCLUDE,
  });
  return summarize(created);
}

// Cloning bumps the version within the same template family (all rows
// sharing `key`) — that family, not a generic lineage tree, is what
// "version templates" means for this app, since one key maps to one
// site-generation slot in the picker.
export async function cloneTemplate(id: string) {
  const source = await loadOne(id);
  const latest = await prisma.template.findFirst({ where: { key: source.key }, orderBy: { version: 'desc' } });
  const nextVersion = (latest?.version ?? source.version) + 1;

  const cloned = await prisma.template.create({
    data: {
      key: source.key,
      name: source.name,
      industry: source.industry,
      primaryGoal: source.primaryGoal,
      complexity: source.complexity,
      description: source.description,
      recommendedUseCase: source.recommendedUseCase,
      isEcommerce: source.isEcommerce,
      status: 'DRAFT',
      version: nextVersion,
      parentTemplateId: source.id,
      pages: {
        create: source.pages.map((p) => ({
          slug: p.slug,
          name: p.name,
          order: p.order,
          purpose: p.purpose,
          heroHeadlinePattern: p.heroHeadlinePattern,
          heroSubheadlinePattern: p.heroSubheadlinePattern,
          ctaLabel: p.ctaLabel,
          hasLeadForm: p.hasLeadForm,
          seoTitlePattern: p.seoTitlePattern,
          seoDescriptionPattern: p.seoDescriptionPattern,
          sections: {
            create: p.sections.map((s) => ({ type: s.type, heading: s.heading, bodyPattern: s.bodyPattern, order: s.order })),
          },
        })),
      },
    },
    include: TREE_INCLUDE,
  });
  return summarize(cloned);
}

export async function publishTemplate(id: string) {
  const template = await loadOne(id);
  await prisma.$transaction([
    prisma.template.updateMany({ where: { key: template.key, status: 'PUBLISHED' }, data: { status: 'DRAFT' } }),
    prisma.template.update({ where: { id }, data: { status: 'PUBLISHED' } }),
  ]);
  return summarize(await loadOne(id));
}

export async function unpublishTemplate(id: string) {
  await loadOne(id);
  const updated = await prisma.template.update({ where: { id }, data: { status: 'DRAFT' } });
  return summarize(await loadOne(updated.id));
}

export async function updateTemplateMeta(
  id: string,
  data: { name?: string; description?: string; recommendedUseCase?: string; isEcommerce?: boolean },
) {
  await loadOne(id);
  const updated = await prisma.template.update({ where: { id }, data });
  return summarize(await loadOne(updated.id));
}
