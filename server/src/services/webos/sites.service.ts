import type { SitePlaybook } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import { CommerceError } from '../../lib/commerceError.js';
import { PLAYBOOKS, type GeneratorInput } from './playbooks.js';

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
    },
  });
  if (!site) throw new CommerceError(404, 'Site not found.');
  return site;
}

export async function generateSite(
  ownerId: string,
  input: GeneratorInput & { playbook: SitePlaybook },
) {
  const playbook = PLAYBOOKS[input.playbook];
  if (!playbook) throw new CommerceError(400, 'Unknown playbook.');

  const pageTemplates = playbook.pages(input);

  // Pages that don't capture a lead themselves get a real internal link to
  // whichever page does — a structural fact about the site's navigation,
  // not a claim about how visitors actually move through it (no traffic
  // data exists for that).
  const primaryCapturePage = pageTemplates.find((p) => p.hasLeadForm);

  return prisma.site.create({
    data: {
      ownerId,
      businessName: input.businessName,
      industry: input.industry,
      targetAudience: input.targetAudience,
      playbook: input.playbook,
      status: 'DRAFT',
      pages: {
        create: pageTemplates.map((p, i) => ({
          slug: p.slug,
          name: p.name,
          heroHeadline: p.heroHeadline,
          heroSubheadline: p.heroSubheadline,
          ctaLabel: p.ctaLabel,
          ctaHref: !p.hasLeadForm && primaryCapturePage && primaryCapturePage.slug !== p.slug
            ? `/${primaryCapturePage.slug}`
            : undefined,
          hasLeadForm: p.hasLeadForm,
          sections: p.sections,
          order: i,
        })),
      },
    },
    include: {
      pages: { orderBy: { order: 'asc' } },
      testimonials: { orderBy: { createdAt: 'desc' } },
      trustElements: { orderBy: { createdAt: 'desc' } },
    },
  });
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
