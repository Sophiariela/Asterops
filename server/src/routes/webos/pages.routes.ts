import { Router } from 'express';
import { authenticate, requireRole } from '../../middleware/auth.js';
import { updatePageSchema } from '../../validation/webos.js';
import * as pagesService from '../../services/webos/pages.service.js';

export const pagesRouter = Router();
pagesRouter.use(authenticate, requireRole('CUSTOMER'));

pagesRouter.get('/:id', async (req, res) => {
  const page = await pagesService.getPage(req.user!.userId, req.params.id);
  res.json({ page });
});

pagesRouter.patch('/:id', async (req, res) => {
  const parsed = updatePageSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid input.' });
  }
  const page = await pagesService.updatePage(req.user!.userId, req.params.id, parsed.data);
  res.json({ page });
});
