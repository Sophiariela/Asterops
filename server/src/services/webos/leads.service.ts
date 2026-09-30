import type { LeadStatus } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import { CommerceError } from '../../lib/commerceError.js';
import { sendEmail } from '../../lib/mailer.js';
import { leadNotificationEmail } from '../../lib/emailTemplates.js';

async function assertSiteOwned(ownerId: string, siteId: string) {
  const site = await prisma.site.findFirst({ where: { id: siteId, ownerId } });
  if (!site) throw new CommerceError(404, 'Site not found.');
}

export async function listLeads(ownerId: string, siteId: string) {
  await assertSiteOwned(ownerId, siteId);
  return prisma.lead.findMany({ where: { siteId }, orderBy: { createdAt: 'desc' }, include: { page: { select: { name: true } } } });
}

// Called from an authenticated route (the tenant logging a lead manually,
// e.g. from a phone call) — distinct from submitPublicLead below, which
// has no auth because it's meant to be called from a visitor-facing form.
export async function createLead(
  ownerId: string,
  siteId: string,
  data: { pageId?: string; name?: string; email: string; phone?: string; message?: string; source?: string },
) {
  await assertSiteOwned(ownerId, siteId);
  return prisma.lead.create({ data: { siteId, source: data.source ?? 'manual', ...data } });
}

// Unauthenticated (visitor-facing form) — the only lead-creation path that
// notifies the business, since a lead the owner typed in themselves needs
// no notification about itself.
export async function submitPublicLead(data: {
  siteId: string;
  pageId?: string;
  name?: string;
  email: string;
  phone?: string;
  message?: string;
  source?: string;
}) {
  const site = await prisma.site.findUnique({
    where: { id: data.siteId },
    include: { owner: { select: { email: true } } },
  });
  if (!site) throw new CommerceError(404, 'Site not found.');
  if (data.pageId) {
    const page = await prisma.page.findFirst({ where: { id: data.pageId, siteId: data.siteId } });
    if (!page) throw new CommerceError(400, 'Page not found on this site.');
  }
  const lead = await prisma.lead.create({ data: { ...data, source: data.source ?? 'direct' } });

  const to = site.contactEmail ?? site.owner.email;
  await sendEmail({
    to,
    subject: `New lead from ${data.name ?? data.email}`,
    html: leadNotificationEmail(site.businessName, {
      name: data.name ?? null, email: data.email, phone: data.phone ?? null, message: data.message ?? null, source: data.source ?? null,
    }),
  });

  return lead;
}

export async function updateLeadStatus(ownerId: string, siteId: string, leadId: string, status: LeadStatus) {
  await assertSiteOwned(ownerId, siteId);
  const existing = await prisma.lead.findFirst({ where: { id: leadId, siteId } });
  if (!existing) throw new CommerceError(404, 'Lead not found.');
  return prisma.lead.update({ where: { id: leadId }, data: { status } });
}
