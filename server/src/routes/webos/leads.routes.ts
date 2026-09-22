import { Router, type Request } from 'express';
import { authenticate, requireRole } from '../../middleware/auth.js';
import { createLeadSchema, publicLeadSchema, updateLeadStatusSchema } from '../../validation/webos.js';
import * as leadsService from '../../services/webos/leads.service.js';

type SiteParams = { siteId: string };

// Authenticated: the tenant viewing/managing their own site's leads.
export const leadsRouter = Router({ mergeParams: true });
leadsRouter.use(authenticate, requireRole('CUSTOMER'));

leadsRouter.get('/', async (req: Request<SiteParams>, res) => {
  const leads = await leadsService.listLeads(req.user!.userId, req.params.siteId);
  res.json({ leads });
});

leadsRouter.post('/', async (req: Request<SiteParams>, res) => {
  const parsed = createLeadSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid input.' });
  }
  const lead = await leadsService.createLead(req.user!.userId, req.params.siteId, parsed.data);
  res.status(201).json({ lead });
});

leadsRouter.patch('/:id/status', async (req: Request<SiteParams & { id: string }>, res) => {
  const parsed = updateLeadStatusSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid input.' });
  }
  const lead = await leadsService.updateLeadStatus(req.user!.userId, req.params.siteId, req.params.id, parsed.data.status);
  res.json({ lead });
});

// Unauthenticated: called from the visitor-facing lead form rendered by
// the public site at /site/:slug.
export const publicLeadsRouter = Router();

publicLeadsRouter.post('/', async (req, res) => {
  const parsed = publicLeadSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid input.' });
  }
  const lead = await leadsService.submitPublicLead(parsed.data);
  res.status(201).json({ lead: { id: lead.id } });
});
