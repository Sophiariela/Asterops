import { Router } from 'express';
import { authenticate, requireRole } from '../../middleware/auth.js';
import * as sitesService from '../../services/webos/sites.service.js';

// A thin, spec-compliant alias over the existing site-detail lookup — the
// "generated website" a template produces IS a Site (see the schema note
// on the Template model), so this doesn't duplicate any logic.
export const generatedSitesRouter = Router();
generatedSitesRouter.use(authenticate, requireRole('CUSTOMER'));

generatedSitesRouter.get('/:id', async (req, res) => {
  const site = await sitesService.getSite(req.user!.userId, req.params.id);
  res.json({ site });
});
