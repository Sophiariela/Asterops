import { Router } from 'express';
import { authenticate, requireRole } from '../../middleware/auth.js';
import { upload } from '../../middleware/upload.js';
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

pagesRouter.post('/:id/hero-image', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }
  const page = await pagesService.setPageHeroImage(req.user!.userId, req.params.id, `/uploads/${req.file.filename}`);
  res.json({ page });
});

pagesRouter.post('/:id/sections/:index/image', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }
  const index = Number(req.params.index);
  if (!Number.isInteger(index) || index < 0) {
    return res.status(400).json({ error: 'Invalid section index.' });
  }
  const page = await pagesService.setSectionImage(req.user!.userId, req.params.id, index, `/uploads/${req.file.filename}`);
  res.json({ page });
});
