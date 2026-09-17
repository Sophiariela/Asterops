import { Router } from 'express';
import type { CommerceOrderStatus } from '@prisma/client';
import { authenticate, requireRole } from '../../middleware/auth.js';
import { createOrderSchema, updateOrderStatusSchema } from '../../validation/commerce.js';
import * as ordersService from '../../services/commerce/orders.service.js';

export const ordersRouter = Router();
ordersRouter.use(authenticate, requireRole('CUSTOMER'));

ordersRouter.get('/', async (req, res) => {
  const status = typeof req.query.status === 'string' ? (req.query.status as CommerceOrderStatus) : undefined;
  const customerId = typeof req.query.customerId === 'string' ? req.query.customerId : undefined;
  const orders = await ordersService.listOrders(req.user!.userId, { status, customerId });
  res.json({ orders });
});

ordersRouter.get('/:id', async (req, res) => {
  const order = await ordersService.getOrder(req.user!.userId, req.params.id);
  res.json({ order });
});

ordersRouter.post('/', async (req, res) => {
  const parsed = createOrderSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid input.' });
  }
  const order = await ordersService.createOrder(req.user!.userId, parsed.data);
  res.status(201).json({ order });
});

ordersRouter.patch('/:id/status', async (req, res) => {
  const parsed = updateOrderStatusSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid input.' });
  }
  const order = await ordersService.updateOrderStatus(req.user!.userId, req.params.id, parsed.data.status);
  res.json({ order });
});
