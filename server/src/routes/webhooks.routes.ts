import { Router } from 'express';
import Stripe from 'stripe';
import { prisma } from '../lib/prisma.js';
import { stripe } from '../lib/stripeSync.js';

export const webhooksRouter = Router();

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

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
      const order = await prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'PAID',
          payment: { update: { status: 'SUCCEEDED', providerRef: session.id } },
          deployment: { create: { status: 'PENDING' } },
        },
      });

      const customerId = typeof session.customer === 'string' ? session.customer : session.customer?.id;
      if (customerId) {
        await prisma.user.update({
          where: { id: order.customerId },
          data: { stripeCustomerId: customerId },
        });
      }
    }
  }

  res.json({ received: true });
});
