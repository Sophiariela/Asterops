import { Router, type Request } from 'express';
import { authenticate, requireRole } from '../../middleware/auth.js';
import { upload } from '../../middleware/upload.js';
import { createMenuCategorySchema, updateMenuCategorySchema, createMenuItemSchema, updateMenuItemSchema } from '../../validation/webos.js';
import * as menuService from '../../services/webos/menu.service.js';

type SiteParams = { siteId: string };

export const menuRouter = Router({ mergeParams: true });
menuRouter.use(authenticate, requireRole('CUSTOMER'));

menuRouter.get('/', async (req: Request<SiteParams>, res) => {
  const categories = await menuService.getMenu(req.user!.userId, req.params.siteId);
  res.json({ categories });
});

menuRouter.post('/categories', async (req: Request<SiteParams>, res) => {
  const parsed = createMenuCategorySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid input.' });
  }
  const category = await menuService.createCategory(req.user!.userId, req.params.siteId, parsed.data);
  res.status(201).json({ category });
});

menuRouter.patch('/categories/:id', async (req: Request<SiteParams & { id: string }>, res) => {
  const parsed = updateMenuCategorySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid input.' });
  }
  const category = await menuService.updateCategory(req.user!.userId, req.params.siteId, req.params.id, parsed.data);
  res.json({ category });
});

menuRouter.delete('/categories/:id', async (req: Request<SiteParams & { id: string }>, res) => {
  await menuService.deleteCategory(req.user!.userId, req.params.siteId, req.params.id);
  res.status(204).send();
});

menuRouter.post('/categories/:categoryId/items', async (req: Request<SiteParams & { categoryId: string }>, res) => {
  const parsed = createMenuItemSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid input.' });
  }
  const item = await menuService.createItem(req.user!.userId, req.params.siteId, req.params.categoryId, parsed.data);
  res.status(201).json({ item });
});

menuRouter.patch('/items/:id', async (req: Request<SiteParams & { id: string }>, res) => {
  const parsed = updateMenuItemSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid input.' });
  }
  const item = await menuService.updateItem(req.user!.userId, req.params.siteId, req.params.id, parsed.data);
  res.json({ item });
});

menuRouter.delete('/items/:id', async (req: Request<SiteParams & { id: string }>, res) => {
  await menuService.deleteItem(req.user!.userId, req.params.siteId, req.params.id);
  res.status(204).send();
});

menuRouter.post('/items/:id/image', upload.single('image'), async (req: Request<SiteParams & { id: string }>, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }
  const item = await menuService.setItemImage(req.user!.userId, req.params.siteId, req.params.id, `/uploads/${req.file.filename}`);
  res.json({ item });
});

// Unauthenticated: kept for callers that only need the menu, though the
// public site page itself now gets menuCategories inline from
// getPublicSiteBySlug.
export const publicMenuRouter = Router();

publicMenuRouter.get('/:siteId', async (req, res) => {
  const categories = await menuService.getPublicMenu(req.params.siteId);
  res.json({ categories });
});
