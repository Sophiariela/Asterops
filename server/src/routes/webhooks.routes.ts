import { Router } from 'express';
import Stripe from 'stripe';
import { prisma } from '../lib/prisma.js';

export const webhooksRouter = Router();

const stripeKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const stripe = stripeKey ? new Stripe(stripeKey) : null;

// Mounted with express.raw() in index.ts — Stripe signature verification
// requires the untouched request body.
webhooksRouter.post('/stripe', async (req, res) => {
  if (!stripe || !webhookSecret) {
    return res.status(503).json({ error: 'Stripe is not configured on this server.' });
  }

  const signature = req.headers['stripe-signature'];
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(req.body, signature as string, webhookSecret);
  } catch (err) {
    return res.status(400).json({ error: `Invalid webhook signature: ${(err as Error).message}` });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;
    if (orderId) {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'PAID',
          payment: { update: { status: 'SUCCEEDED', providerRef: session.id } },
          deployment: { create: { status: 'PENDING' } },
        },
      });
    }
  }

  res.json({ received: true });
});
