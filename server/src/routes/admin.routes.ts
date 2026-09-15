import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { authenticate, requireRole } from '../middleware/auth.js';

export const adminRouter = Router();

adminRouter.use(authenticate, requireRole('ADMIN'));

adminRouter.get('/overview', async (_req, res) => {
  const [totalCustomers, activeDeployments, pendingDeployments, payments, recentPurchases] = await Promise.all([
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.deploymentStatus.count({ where: { status: { in: ['IN_REVIEW', 'DEPLOYING'] } } }),
    prisma.deploymentStatus.count({ where: { status: 'PENDING' } }),
    prisma.payment.aggregate({ where: { status: 'SUCCEEDED' }, _sum: { amount: true } }),
    prisma.order.findMany({
      where: { status: 'PAID' },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { plan: true, customer: true },
    }),
  ]);

  res.json({
    totalCustomers,
    activeDeployments,
    pendingDeployments,
    revenue: payments._sum.amount ?? 0,
    recentPurchases: recentPurchases.map((o) => ({
      id: o.id,
      customer: { id: o.customer.id, name: o.customer.name, email: o.customer.email },
      plan: o.plan.name,
      amount: o.amount,
      createdAt: o.createdAt,
    })),
  });
});

const customersQuerySchema = z.object({
  search: z.string().optional(),
  plan: z.string().optional(),
  status: z.enum(['PENDING', 'IN_REVIEW', 'DEPLOYING', 'COMPLETED']).optional(),
});

adminRouter.get('/customers', async (req, res) => {
  const parsed = customersQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid query parameters.' });
  }
  const { search, plan, status } = parsed.data;

  const customers = await prisma.user.findMany({
    where: {
      role: 'CUSTOMER',
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: 'desc' },
    include: {
      orders: {
        orderBy: { createdAt: 'desc' },
        include: { plan: true, payment: true, deployment: true },
      },
      onboarding: true,
    },
  });

  const filtered = customers.filter((customer) => {
    const latestOrder = customer.orders[0];
    if (plan && latestOrder?.plan.slug !== plan) return false;
    if (status && latestOrder?.deployment?.status !== status) return false;
    return true;
  });

  res.json({
    customers: filtered.map((customer) => ({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      createdAt: customer.createdAt,
      latestOrder: customer.orders[0]
        ? {
            id: customer.orders[0].id,
            plan: customer.orders[0].plan.name,
            planSlug: customer.orders[0].plan.slug,
            status: customer.orders[0].status,
            amount: customer.orders[0].amount,
            paymentStatus: customer.orders[0].payment?.status ?? null,
            deploymentStatus: customer.orders[0].deployment?.status ?? null,
          }
        : null,
      onboarding: customer.onboarding,
    })),
  });
});

adminRouter.get('/customers/:id', async (req, res) => {
  const customer = await prisma.user.findFirst({
    where: { id: req.params.id, role: 'CUSTOMER' },
    include: {
      orders: { orderBy: { createdAt: 'desc' }, include: { plan: true, payment: true, deployment: true } },
      onboarding: true,
    },
  });
  if (!customer) {
    return res.status(404).json({ error: 'Customer not found.' });
  }
  res.json({ customer });
});

adminRouter.get('/payments', async (_req, res) => {
  const payments = await prisma.payment.findMany({
    orderBy: { createdAt: 'desc' },
    include: { order: { include: { plan: true, customer: true } } },
  });
  res.json({
    payments: payments.map((p) => ({
      id: p.id,
      amount: p.amount,
      status: p.status,
      provider: p.provider,
      providerRef: p.providerRef,
      createdAt: p.createdAt,
      plan: p.order.plan.name,
      customer: { id: p.order.customer.id, name: p.order.customer.name, email: p.order.customer.email },
    })),
  });
});

adminRouter.get('/onboarding', async (_req, res) => {
  const submissions = await prisma.onboardingSubmission.findMany({
    orderBy: { createdAt: 'desc' },
    include: { customer: true },
  });
  res.json({ submissions });
});

const statusSchema = z.object({
  status: z.enum(['PENDING', 'IN_REVIEW', 'DEPLOYING', 'COMPLETED']),
});

adminRouter.patch('/orders/:orderId/deployment-status', async (req, res) => {
  const parsed = statusSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'A valid status is required.' });
  }

  const order = await prisma.order.findUnique({ where: { id: req.params.orderId } });
  if (!order) {
    return res.status(404).json({ error: 'Order not found.' });
  }

  const deployment = await prisma.deploymentStatus.upsert({
    where: { orderId: order.id },
    update: { status: parsed.data.status },
    create: { orderId: order.id, status: parsed.data.status },
  });

  res.json({ deployment });
});
