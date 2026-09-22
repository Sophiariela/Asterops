import type { SitePlaybook, SiteCurrency } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import { CommerceError } from '../../lib/commerceError.js';
import { getPublishedTemplateByKey, getPublishedTemplateById } from './templates.service.js';
import { buildPagesFromTemplate, type GeneratorInput } from './templateEngine.js';
import { findCountryPreset } from '../../lib/countryPresets.js';
import { slugify } from '../../lib/slugify.js';

async function generateUniqueSiteSlug(businessName: string, excludeId?: string): Promise<string> {
  const base = slugify(businessName);
  let candidate = base;
  let n = 1;
  // eslint-disable-next-line no-await-in-loop
  while (
    await prisma.site.findFirst({
      where: { slug: candidate, ...(excludeId ? { id: { not: excludeId } } : {}) },
    })
  ) {
    n += 1;
    candidate = `${base}-${n}`;
  }
  return candidate;
}

export async function listSites(ownerId: string) {
  return prisma.site.findMany({
    where: { ownerId },
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { pages: true, testimonials: true, leads: true } } },
  });
}

export async function getSite(ownerId: string, id: string) {
  const site = await prisma.site.findFirst({
    where: { id, ownerId },
    include: {
      pages: { orderBy: { order: 'asc' } },
      testimonials: { orderBy: { createdAt: 'desc' } },
      trustElements: { orderBy: { createdAt: 'desc' } },
      menuCategories: { orderBy: { order: 'asc' }, include: { items: { orderBy: { order: 'asc' } } } },
    },
  });
  if (!site) throw new CommerceError(404, 'Site not found.');
  return site;
}

// Unauthenticated: backs the live public site renderer (/site/:slug). Only
// ever returns a PUBLISHED site, and only the fields a visitor-facing page
// needs — no ownerId, no leads, no trust elements (the preview doesn't
// render those either).
export async function getPublicSiteBySlug(slug: string) {
  const site = await prisma.site.findFirst({
    where: { slug, status: 'PUBLISHED' },
    select: {
      id: true,
      businessName: true,
      industry: true,
      logoUrl: true,
      currency: true,
      playbook: true,
      status: true,
      slug: true,
      customDomain: true,
      publishedAt: true,
      pages: {
        orderBy: { order: 'asc' },
        select: {
          id: true, slug: true, name: true, heroHeadline: true, heroSubheadline: true, heroImageUrl: true,
          ctaLabel: true, ctaHref: true, sections: true, seoTitle: true, seoDescription: true, hasLeadForm: true, order: true,
        },
      },
      testimonials: {
        orderBy: { createdAt: 'desc' },
        select: { id: true, authorName: true, authorRole: true, quote: true, rating: true, createdAt: true },
      },
      menuCategories: {
        orderBy: { order: 'asc' },
        select: {
          id: true, name: true, order: true,
          items: {
            orderBy: { order: 'asc' },
            select: { id: true, name: true, description: true, priceCents: true, imageUrl: true, available: true, featured: true, order: true },
          },
        },
      },
    },
  });
  if (!site) throw new CommerceError(404, 'Site not found.');
  return site;
}

export async function generateSite(
  ownerId: string,
  input: GeneratorInput & { playbook?: SitePlaybook; templateId?: string },
) {
  const template = input.templateId
    ? await getPublishedTemplateById(input.templateId)
    : input.playbook
      ? await getPublishedTemplateByKey(input.playbook)
      : null;
  if (!template) throw new CommerceError(400, 'Template not found or not published.');

  const pageTemplates = buildPagesFromTemplate(template, input);
  const slug = await generateUniqueSiteSlug(input.businessName);

  const site = await prisma.site.create({
    data: {
      ownerId,
      businessName: input.businessName,
      industry: input.industry,
      targetAudience: input.targetAudience,
      playbook: template.key,
      templateId: template.id,
      templateVersion: template.version,
      status: 'DRAFT',
      slug,
      pages: {
        create: pageTemplates.map((p, i) => ({
          slug: p.slug,
          name: p.name,
          heroHeadline: p.heroHeadline,
          heroSubheadline: p.heroSubheadline,
          ctaLabel: p.ctaLabel,
          ctaHref: p.ctaHref,
          hasLeadForm: p.hasLeadForm,
          seoTitle: p.seoTitle,
          seoDescription: p.seoDescription,
          sections: p.sections,
          order: i,
        })),
      },
    },
    include: {
      pages: { orderBy: { order: 'asc' } },
      testimonials: { orderBy: { createdAt: 'desc' } },
      trustElements: { orderBy: { createdAt: 'desc' } },
      menuCategories: { orderBy: { order: 'asc' }, include: { items: { orderBy: { order: 'asc' } } } },
    },
  });

  // Restaurant sites start with a real Menu category seeded from the
  // business's own entered offerings — real item names, but no fabricated
  // price (priceCents stays null until the owner sets one in Menu Manager).
  if (template.key === 'RESTAURANT' && input.services.length) {
    await prisma.menuCategory.create({
      data: {
        siteId: site.id,
        name: 'Menu',
        order: 0,
        items: {
          create: input.services.map((name, i) => ({ name, order: i })),
        },
      },
    });
    return getSite(ownerId, site.id);
  }

  return site;
}

export async function deleteSite(ownerId: string, id: string) {
  const existing = await prisma.site.findFirst({ where: { id, ownerId } });
  if (!existing) throw new CommerceError(404, 'Site not found.');
  await prisma.site.delete({ where: { id } });
}

export async function publishSite(ownerId: string, id: string) {
  const existing = await prisma.site.findFirst({ where: { id, ownerId } });
  if (!existing) throw new CommerceError(404, 'Site not found.');
  const slug = existing.slug ?? (await generateUniqueSiteSlug(existing.businessName, existing.id));
  return prisma.site.update({
    where: { id },
    data: { status: 'PUBLISHED', slug, publishedAt: new Date() },
  });
}

export async function updateSite(
  ownerId: string,
  id: string,
  data: Partial<{ businessName: string; industry: string; targetAudience: string; currency: SiteCurrency; country: string }>,
) {
  const existing = await prisma.site.findFirst({ where: { id, ownerId } });
  if (!existing) throw new CommerceError(404, 'Site not found.');

  // Country is a shortcut that fills in Currency + Timezone together —
  // it always wins over a currency sent in the same request, since
  // picking a country is the more specific, more recent intent.
  if (data.country) {
    const preset = findCountryPreset(data.country);
    if (!preset) throw new CommerceError(400, 'Unsupported country.');
    return prisma.site.update({
      where: { id },
      data: { ...data, country: preset.code, currency: preset.currency, timezone: preset.timezone },
    });
  }

  return prisma.site.update({ where: { id }, data });
}

export async function setSiteLogo(ownerId: string, id: string, logoUrl: string) {
  const existing = await prisma.site.findFirst({ where: { id, ownerId } });
  if (!existing) throw new CommerceError(404, 'Site not found.');
  return prisma.site.update({ where: { id }, data: { logoUrl } });
}
