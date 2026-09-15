import { Router } from 'express';
import Stripe from 'stripe';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { authenticate, requireRole } from '../middleware/auth.js';

export const checkoutRouter = Router();

const stripeKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeKey ? new Stripe(stripeKey) : null;

checkoutRouter.use(authenticate, requireRole('CUSTOMER'));

const createOrderSchema = z.object({ planSlug: z.string().min(1) });

// Creates a pending order + payment record, and — when Stripe keys are
// configured — a real Checkout Session. Without keys, the frontend falls
// back to the /simulate-pay dev endpoint so the flow stays testable.
checkoutRouter.post('/', async (req, res) => {
  const parsed = createOrderSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'A planSlug is required.' });
  }

  const plan = await prisma.plan.findUnique({ where: { slug: parsed.data.planSlug } });
  if (!plan || plan.status !== 'ACTIVE') {
    return res.status(404).json({ error: 'Plan not found.' });
  }

  const order = await prisma.order.create({
    data: {
      customerId: req.user!.userId,
      planId: plan.id,
      amount: plan.price,
      status: 'PENDING',
      payment: { create: { amount: plan.price, provider: 'stripe', status: 'PENDING' } },
    },
    include: { plan: true, payment: true },
  });

  if (stripe) {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: `ASTER — ${plan.name}` },
            unit_amount: plan.price,
          },
          quantity: 1,
        },
      ],
      metadata: { orderId: order.id },
      success_url: `${process.env.FRONTEND_URL}/onboarding?order=${order.id}`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout?plan=${plan.slug}&cancelled=1`,
    });

    await prisma.payment.update({
      where: { orderId: order.id },
      data: { providerRef: session.id },
    });

    return res.status(201).json({ order, checkoutUrl: session.url });
  }

  res.status(201).json({ order, checkoutUrl: null });
});

checkoutRouter.get('/:orderId', async (req, res) => {
  const order = await prisma.order.findFirst({
    where: { id: req.params.orderId, customerId: req.user!.userId },
    include: { plan: true, payment: true, deployment: true },
  });
  if (!order) {
    return res.status(404).json({ error: 'Order not found.' });
  }
  res.json({ order });
});

// Dev-only stand-in for the Stripe webhook, so the checkout → onboarding
// flow works end to end without real payment keys configured.
checkoutRouter.post('/:orderId/simulate-pay', async (req, res) => {
  if (stripe) {
    return res.status(400).json({ error: 'Stripe is configured — complete payment through Checkout instead.' });
  }

  const order = await prisma.order.findFirst({
    where: { id: req.params.orderId, customerId: req.user!.userId },
  });
  if (!order) {
    return res.status(404).json({ error: 'Order not found.' });
  }

  const updated = await prisma.order.update({
    where: { id: order.id },
    data: {
      status: 'PAID',
      payment: { update: { status: 'SUCCEEDED', providerRef: `sim_${order.id}` } },
      deployment: { create: { status: 'PENDING' } },
    },
    include: { plan: true, payment: true, deployment: true },
  });

  res.json({ order: updated });
});
