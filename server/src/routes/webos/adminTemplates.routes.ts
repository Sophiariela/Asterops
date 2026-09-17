import { Router } from 'express';
import { authenticate, requireRole } from '../../middleware/auth.js';
import { createTemplateSchema, updateTemplateMetaSchema } from '../../validation/webos.js';
import * as templatesService from '../../services/webos/templates.service.js';

export const adminTemplatesRouter = Router();
adminTemplatesRouter.use(authenticate, requireRole('ADMIN'));

adminTemplatesRouter.get('/', async (_req, res) => {
  const templates = await templatesService.listAllTemplatesAdmin();
  res.json({ templates });
});

adminTemplatesRouter.post('/', async (req, res) => {
  const parsed = createTemplateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid input.' });
  }
  const template = await templatesService.createTemplate(parsed.data);
  res.status(201).json({ template });
});

adminTemplatesRouter.patch('/:id', async (req, res) => {
  const parsed = updateTemplateMetaSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid input.' });
  }
  const template = await templatesService.updateTemplateMeta(req.params.id, parsed.data);
  res.json({ template });
});

adminTemplatesRouter.post('/:id/clone', async (req, res) => {
  const template = await templatesService.cloneTemplate(req.params.id);
  res.status(201).json({ template });
});

adminTemplatesRouter.post('/:id/publish', async (req, res) => {
  const template = await templatesService.publishTemplate(req.params.id);
  res.json({ template });
});

adminTemplatesRouter.post('/:id/unpublish', async (req, res) => {
  const template = await templatesService.unpublishTemplate(req.params.id);
  res.json({ template });
});
