import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticate, requireRole } from '../middleware/auth.js';

export const dashboardRouter = Router();

dashboardRouter.use(authenticate, requireRole('CUSTOMER'));

dashboardRouter.get('/', async (req, res) => {
  const userId = req.user!.userId;

  const [user, latestOrder, onboarding] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.order.findFirst({
      where: { customerId: userId },
      orderBy: { createdAt: 'desc' },
      include: { plan: true, payment: true, deployment: true },
    }),
    prisma.onboardingSubmission.findUnique({ where: { customerId: userId } }),
  ]);

  const activity: Array<{ label: string; at: Date }> = [];
  if (latestOrder) {
    activity.push({ label: `Selected the ${latestOrder.plan.name} plan`, at: latestOrder.createdAt });
    if (latestOrder.payment?.status === 'SUCCEEDED') {
      activity.push({ label: 'Payment confirmed', at: latestOrder.payment.updatedAt });
    }
  }
  if (onboarding) {
    activity.push({ label: 'Submitted onboarding information', at: onboarding.createdAt });
  }
  if (latestOrder?.deployment) {
    activity.push({ label: `Deployment status: ${latestOrder.deployment.status.replace('_', ' ')}`, at: latestOrder.deployment.updatedAt });
  }
  activity.sort((a, b) => b.at.getTime() - a.at.getTime());

  res.json({
    user: user ? { id: user.id, name: user.name, email: user.email } : null,
    plan: latestOrder?.plan ?? null,
    order: latestOrder
      ? { id: latestOrder.id, status: latestOrder.status, amount: latestOrder.amount, createdAt: latestOrder.createdAt }
      : null,
    deploymentStatus: latestOrder?.deployment?.status ?? null,
    onboarding,
    activity,
  });
});
