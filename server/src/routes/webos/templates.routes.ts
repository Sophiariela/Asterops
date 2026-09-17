import { Router } from 'express';
import { authenticate, requireRole } from '../../middleware/auth.js';
import { generateFromTemplateSchema, templateFiltersSchema, recommendTemplateSchema } from '../../validation/webos.js';
import * as templatesService from '../../services/webos/templates.service.js';
import * as sitesService from '../../services/webos/sites.service.js';
import { recommendTemplate } from '../../services/webos/analytics/lunaStrategist.service.js';

export const templatesRouter = Router();
templatesRouter.use(authenticate, requireRole('CUSTOMER'));

templatesRouter.get('/', async (req, res) => {
  const parsed = templateFiltersSchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid filters.' });
  }
  const { ecommerce, ...rest } = parsed.data;
  const templates = await templatesService.listPublishedTemplates({
    ...rest,
    ecommerce: ecommerce === undefined ? undefined : ecommerce === 'true',
  });
  res.json({ templates });
});

templatesRouter.post('/recommend', async (req, res) => {
  const parsed = recommendTemplateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid input.' });
  }
  const data = await recommendTemplate(parsed.data);
  res.json(data);
});

templatesRouter.get('/:id', async (req, res) => {
  const template = await templatesService.getPublishedTemplateDetail(req.params.id);
  res.json({ template });
});

templatesRouter.post('/generate', async (req, res) => {
  const parsed = generateFromTemplateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid input.' });
  }
  const site = await sitesService.generateSite(req.user!.userId, parsed.data);
  res.status(201).json({ site });
});
