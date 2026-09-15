import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { api, ApiError } from '../lib/api';

type Plan = { id: string; name: string; slug: string; price: number };
type Order = { id: string; amount: number; status: string };

function formatPrice(cents: number) {
  return (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const planSlug = searchParams.get('plan') ?? '';
  const navigate = useNavigate();

  const [plan, setPlan] = useState<Plan | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!planSlug) return;
    api
      .get<{ plan: Plan }>(`/plans/${planSlug}`)
      .then((data) => setPlan(data.plan))
      .catch(() => setError('This plan could not be found.'));
  }, [planSlug]);

  const startCheckout = async () => {
    setError('');
    setSubmitting(true);
    try {
      const data = await api.post<{ order: Order; checkoutUrl: string | null }>('/checkout', { planSlug });
      setOrder(data.order);
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not start checkout. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmSimulatedPayment = async () => {
    if (!order) return;
    setSubmitting(true);
    setError('');
    try {
      await api.post(`/checkout/${order.id}/simulate-pay`);
      navigate(`/onboarding?order=${order.id}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Payment could not be confirmed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!planSlug || error === 'This plan could not be found.') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-slate-500">No plan selected.</p>
          <Link to="/plans" className="font-bold text-ASTER-600 hover:text-ASTER-700 mt-2 inline-block">
            View plans
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-ASTER-50/60 via-white to-white py-16 px-4">
      <div className="max-w-md mx-auto">
        <Link to="/plans" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-ASTER-600 transition-colors mb-8">
          <ArrowLeft size={16} /> Back to plans
        </Link>

        <div className="bg-white rounded-[28px] card-shadow border border-ASTER-100 p-8">
          <h1 className="font-display font-extrabold text-2xl text-ink-900">Checkout</h1>

          {plan && (
            <div className="mt-6 flex items-center justify-between border-b border-ASTER-100 pb-5">
              <div>
                <p className="font-bold text-ink-900">{plan.name}</p>
                <p className="text-sm text-slate-500">Billed once, deployed within days.</p>
              </div>
              <p className="font-display font-extrabold text-xl text-ASTER-600">{formatPrice(plan.price)}</p>
            </div>
          )}

          {!order ? (
            <>
              <p className="text-sm text-slate-500 mt-5 flex items-center gap-2">
                <ShieldCheck size={16} className="text-ASTER-600" /> Secure checkout, powered by Stripe.
              </p>
              {error && <p className="text-rose-500 text-sm font-semibold mt-4">{error}</p>}
              <button
                onClick={startCheckout}
                disabled={submitting || !plan}
                className="mt-6 w-full bg-ASTER-600 hover:bg-ASTER-700 disabled:opacity-60 text-white font-bold py-4 rounded-full transition-all"
              >
                {submitting ? 'Preparing checkout…' : 'Continue to payment'}
              </button>
            </>
          ) : (
            <>
              <p className="text-sm text-slate-500 mt-5">
                Stripe isn&apos;t configured on this environment yet, so payment is simulated for development.
              </p>
              {error && <p className="text-rose-500 text-sm font-semibold mt-4">{error}</p>}
              <button
                onClick={confirmSimulatedPayment}
                disabled={submitting}
                className="mt-6 w-full bg-ASTER-600 hover:bg-ASTER-700 disabled:opacity-60 text-white font-bold py-4 rounded-full transition-all"
              >
                {submitting ? 'Confirming…' : `Simulate payment of ${formatPrice(order.amount)}`}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
