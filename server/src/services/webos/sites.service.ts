import type { SitePlaybook } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import { CommerceError } from '../../lib/commerceError.js';
import { getPublishedTemplateByKey, getPublishedTemplateById } from './templates.service.js';
import { buildPagesFromTemplate, type GeneratorInput } from './templateEngine.js';

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
  return prisma.site.update({ where: { id }, data: { status: 'PUBLISHED' } });
}

export async function updateSite(
  ownerId: string,
  id: string,
  data: Partial<{ businessName: string; industry: string; targetAudience: string }>,
) {
  const existing = await prisma.site.findFirst({ where: { id, ownerId } });
  if (!existing) throw new CommerceError(404, 'Site not found.');
  return prisma.site.update({ where: { id }, data });
}

export async function setSiteLogo(ownerId: string, id: string, logoUrl: string) {
  const existing = await prisma.site.findFirst({ where: { id, ownerId } });
  if (!existing) throw new CommerceError(404, 'Site not found.');
  return prisma.site.update({ where: { id }, data: { logoUrl } });
}
