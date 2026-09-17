import { Router } from 'express';
import { authenticate, requireRole } from '../../middleware/auth.js';
import { createProductSchema, updateProductSchema } from '../../validation/commerce.js';
import * as productsService from '../../services/commerce/products.service.js';

export const productsRouter = Router();
productsRouter.use(authenticate, requireRole('CUSTOMER'));

productsRouter.get('/', async (req, res) => {
  const { search, categoryId, status } = req.query as Record<string, string | undefined>;
  const products = await productsService.listProducts(req.user!.userId, { search, categoryId, status });
  res.json({ products });
});

productsRouter.get('/:id', async (req, res) => {
  const product = await productsService.getProduct(req.user!.userId, req.params.id);
  res.json({ product });
});

productsRouter.post('/', async (req, res) => {
  const parsed = createProductSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid input.' });
  }
  const product = await productsService.createProduct(req.user!.userId, parsed.data);
  res.status(201).json({ product });
});

productsRouter.patch('/:id', async (req, res) => {
  const parsed = updateProductSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid input.' });
  }
  const product = await productsService.updateProduct(req.user!.userId, req.params.id, parsed.data);
  res.json({ product });
});

productsRouter.delete('/:id', async (req, res) => {
  await productsService.deleteProduct(req.user!.userId, req.params.id);
  res.status(204).send();
});
