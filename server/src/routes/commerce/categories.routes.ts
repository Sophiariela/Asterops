import { Router } from 'express';
import { authenticate, requireRole } from '../../middleware/auth.js';
import { createCategorySchema, updateCategorySchema } from '../../validation/commerce.js';
import * as categoriesService from '../../services/commerce/categories.service.js';

export const categoriesRouter = Router();
categoriesRouter.use(authenticate, requireRole('CUSTOMER'));

categoriesRouter.get('/', async (req, res) => {
  const categories = await categoriesService.listCategories(req.user!.userId);
  res.json({ categories });
});

categoriesRouter.post('/', async (req, res) => {
  const parsed = createCategorySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid input.' });
  }
  const category = await categoriesService.createCategory(req.user!.userId, parsed.data);
  res.status(201).json({ category });
});

categoriesRouter.patch('/:id', async (req, res) => {
  const parsed = updateCategorySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid input.' });
  }
  const category = await categoriesService.updateCategory(req.user!.userId, req.params.id, parsed.data);
  res.json({ category });
});

categoriesRouter.delete('/:id', async (req, res) => {
  await categoriesService.deleteCategory(req.user!.userId, req.params.id);
  res.status(204).send();
});
