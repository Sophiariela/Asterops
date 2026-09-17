import { Router } from 'express';
import { authenticate, requireRole } from '../../middleware/auth.js';
import { adjustStockSchema } from '../../validation/commerce.js';
import * as inventoryService from '../../services/commerce/inventory.service.js';

export const inventoryRouter = Router();
inventoryRouter.use(authenticate, requireRole('CUSTOMER'));

inventoryRouter.get('/', async (req, res) => {
  const lowStockOnly = req.query.lowStock === '1';
  const products = await inventoryService.listInventory(req.user!.userId, { lowStockOnly });
  res.json({ products });
});

inventoryRouter.get('/movements', async (req, res) => {
  const productId = typeof req.query.productId === 'string' ? req.query.productId : undefined;
  const movements = await inventoryService.listMovements(req.user!.userId, productId);
  res.json({ movements });
});

inventoryRouter.post('/adjust', async (req, res) => {
  const parsed = adjustStockSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid input.' });
  }
  const product = await inventoryService.adjustStock(req.user!.userId, parsed.data);
  res.json({ product });
});
