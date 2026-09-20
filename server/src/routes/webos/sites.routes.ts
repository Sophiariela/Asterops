import { Router } from 'express';
import { authenticate, requireRole } from '../../middleware/auth.js';
import { upload } from '../../middleware/upload.js';
import { generateSiteSchema, updateSiteSchema } from '../../validation/webos.js';
import * as sitesService from '../../services/webos/sites.service.js';
import { listPublishedSummariesForLegacyPicker } from '../../services/webos/templates.service.js';
import { COUNTRY_PRESETS } from '../../lib/countryPresets.js';

export const sitesRouter = Router();
sitesRouter.use(authenticate, requireRole('CUSTOMER'));

sitesRouter.get('/playbooks', async (_req, res) => {
  res.json({ playbooks: await listPublishedSummariesForLegacyPicker() });
});

sitesRouter.get('/country-presets', (_req, res) => {
  res.json({ countries: COUNTRY_PRESETS });
});

sitesRouter.get('/', async (req, res) => {
  const sites = await sitesService.listSites(req.user!.userId);
  res.json({ sites });
});

sitesRouter.get('/:id', async (req, res) => {
  const site = await sitesService.getSite(req.user!.userId, req.params.id);
  res.json({ site });
});

sitesRouter.post('/generate', async (req, res) => {
  const parsed = generateSiteSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid input.' });
  }
  const site = await sitesService.generateSite(req.user!.userId, parsed.data);
  res.status(201).json({ site });
});

sitesRouter.post('/:id/publish', async (req, res) => {
  const site = await sitesService.publishSite(req.user!.userId, req.params.id);
  res.json({ site });
});

sitesRouter.patch('/:id', async (req, res) => {
  const parsed = updateSiteSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid input.' });
  }
  const site = await sitesService.updateSite(req.user!.userId, req.params.id, parsed.data);
  res.json({ site });
});

sitesRouter.post('/:id/logo', upload.single('logo'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }
  const site = await sitesService.setSiteLogo(req.user!.userId, req.params.id, `/uploads/${req.file.filename}`);
  res.json({ site });
});

sitesRouter.delete('/:id', async (req, res) => {
  await sitesService.deleteSite(req.user!.userId, req.params.id);
  res.status(204).send();
});
