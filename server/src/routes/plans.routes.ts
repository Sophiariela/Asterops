import { Router } from 'express';
import { prisma } from '../lib/prisma.js';

export const plansRouter = Router();

plansRouter.get('/', async (_req, res) => {
  const plans = await prisma.plan.findMany({
    where: { status: 'ACTIVE' },
    orderBy: { price: 'asc' },
  });
  res.json({ plans });
});

plansRouter.get('/:slug', async (req, res) => {
  const plan = await prisma.plan.findUnique({ where: { slug: req.params.slug } });
  if (!plan || plan.status !== 'ACTIVE') {
    return res.status(404).json({ error: 'Plan not found.' });
  }
  res.json({ plan });
});
