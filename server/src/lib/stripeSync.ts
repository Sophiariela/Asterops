import Stripe from 'stripe';

const stripeKey = process.env.STRIPE_SECRET_KEY;
export const stripe = stripeKey ? new Stripe(stripeKey) : null;

export type PlanForSync = {
  id: string;
  name: string;
  description: string;
  price: number;
  annualPrice: number | null;
  stripeProductId: string | null;
  stripeMonthlyPriceId: string | null;
  stripeAnnualPriceId: string | null;
};

export type StripeIds = {
  stripeProductId: string;
  stripeMonthlyPriceId: string;
  stripeAnnualPriceId: string;
};

// Creates (or reuses) a Stripe Product + two one-time Prices — monthly and
// annual — for a plan, using the plan's DB price fields as the single
// source of truth. Safe to call repeatedly: existing Stripe objects are
// reused via the ids already stored on the Plan row. Returns null when
// Stripe isn't configured.
export async function ensureStripeProduct(plan: PlanForSync): Promise<StripeIds | null> {
  if (!stripe) return null;

  let productId = plan.stripeProductId;
  if (!productId) {
    const product = await stripe.products.create({
      name: `ASTER — ${plan.name}`,
      description: plan.description,
    });
    productId = product.id;
  }

  let monthlyPriceId = plan.stripeMonthlyPriceId;
  if (!monthlyPriceId) {
    const price = await stripe.prices.create({
      product: productId,
      currency: 'brl',
      unit_amount: plan.price,
      nickname: `${plan.name} — mensal`,
    });
    monthlyPriceId = price.id;
  }

  let annualPriceId = plan.stripeAnnualPriceId;
  if (!annualPriceId) {
    const price = await stripe.prices.create({
      product: productId,
      currency: 'brl',
      unit_amount: plan.annualPrice ?? plan.price * 12,
      nickname: `${plan.name} — anual`,
    });
    annualPriceId = price.id;
  }

  return { stripeProductId: productId, stripeMonthlyPriceId: monthlyPriceId, stripeAnnualPriceId: annualPriceId };
}
