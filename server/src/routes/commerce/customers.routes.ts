import { Router } from 'express';
import { authenticate, requireRole } from '../../middleware/auth.js';
import { createCustomerSchema, updateCustomerSchema } from '../../validation/commerce.js';
import * as customersService from '../../services/commerce/customers.service.js';

export const customersRouter = Router();
customersRouter.use(authenticate, requireRole('CUSTOMER'));

customersRouter.get('/', async (req, res) => {
  const search = typeof req.query.search === 'string' ? req.query.search : undefined;
  const customers = await customersService.listCustomers(req.user!.userId, search);
  res.json({ customers });
});

customersRouter.get('/:id', async (req, res) => {
  const customer = await customersService.getCustomer(req.user!.userId, req.params.id);
  res.json({ customer });
});

customersRouter.post('/', async (req, res) => {
  const parsed = createCustomerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid input.' });
  }
  const customer = await customersService.createCustomer(req.user!.userId, parsed.data);
  res.status(201).json({ customer });
});

customersRouter.patch('/:id', async (req, res) => {
  const parsed = updateCustomerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid input.' });
  }
  const customer = await customersService.updateCustomer(req.user!.userId, req.params.id, parsed.data);
  res.json({ customer });
});

customersRouter.delete('/:id', async (req, res) => {
  await customersService.deleteCustomer(req.user!.userId, req.params.id);
  res.status(204).send();
});
