import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { stripe } from '../lib/stripeSync.js';

export const checkoutRouter = Router();

checkoutRouter.use(authenticate, requireRole('CUSTOMER'));

const createOrderSchema = z.object({
  planSlug: z.string().min(1),
  billing: z.enum(['monthly', 'annual']).default('monthly'),
});

// Creates a pending order + payment record, and — when Stripe keys are
// configured — a real Checkout Session against the plan's pre-created
// Stripe Price (falls back to inline price_data if a plan hasn't been
// synced to Stripe yet). Without keys, the frontend falls back to the
// /simulate-pay dev endpoint so the flow stays testable.
checkoutRouter.post('/', async (req, res) => {
  const parsed = createOrderSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'A planSlug is required.' });
  }

  const [plan, user] = await Promise.all([
    prisma.plan.findUnique({ where: { slug: parsed.data.planSlug } }),
    prisma.user.findUnique({ where: { id: req.user!.userId } }),
  ]);
  if (!plan || plan.status !== 'ACTIVE') {
    return res.status(404).json({ error: 'Plan not found.' });
  }
  if (!user) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }

  const isAnnual = parsed.data.billing === 'annual';
  const amount = isAnnual ? plan.annualPrice ?? plan.price * 12 : plan.price;
  const stripePriceId = isAnnual ? plan.stripeAnnualPriceId : plan.stripeMonthlyPriceId;

  const order = await prisma.order.create({
    data: {
      customerId: user.id,
      planId: plan.id,
      amount,
      status: 'PENDING',
      payment: { create: { amount, provider: 'stripe', status: 'PENDING' } },
    },
    include: { plan: true, payment: true },
  });

  if (stripe) {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      // Pix isn't included: for Brazil-based Stripe accounts, Pix is invite-only
      // (not self-serve in Dashboard settings or via the Accounts API) — add it
      // back here once Stripe grants access. https://docs.stripe.com/payments/pix
      payment_method_types: ['card', 'boleto'],
      payment_method_options: { card: { installments: { enabled: true } } },
      line_items: [
        stripePriceId
          ? { price: stripePriceId, quantity: 1 }
          : {
              price_data: {
                currency: 'brl',
                product_data: { name: `ASTER — ${plan.name} (${isAnnual ? 'anual' : 'mensal'})` },
                unit_amount: amount,
              },
              quantity: 1,
            },
      ],
      ...(user.stripeCustomerId
        ? { customer: user.stripeCustomerId }
        : { customer_email: user.email, customer_creation: 'always' as const }),
      metadata: { orderId: order.id },
      success_url: `${process.env.FRONTEND_URL}/checkout/success?order=${order.id}`,
      cancel_url: `${process.env.FRONTEND_URL}/plans?cancelled=1`,
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
