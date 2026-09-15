import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { api, ApiError } from '../lib/api';
import { formatBRL } from '../lib/currency';

type Plan = { id: string; name: string; slug: string; price: number; annualPrice: number | null };
type Order = { id: string; amount: number; status: string };

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const planSlug = searchParams.get('plan') ?? '';
  const billing = searchParams.get('billing') === 'annual' ? 'annual' : 'monthly';
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
      .catch(() => setError('Plano não encontrado.'));
  }, [planSlug]);

  const amountDue = plan ? (billing === 'annual' ? plan.annualPrice ?? plan.price * 12 : plan.price) : 0;

  const startCheckout = async () => {
    setError('');
    setSubmitting(true);
    try {
      const data = await api.post<{ order: Order; checkoutUrl: string | null }>('/checkout', { planSlug, billing });
      setOrder(data.order);
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível iniciar o checkout. Tente novamente.');
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
      setError(err instanceof ApiError ? err.message : 'Não foi possível confirmar o pagamento. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!planSlug || error === 'Plano não encontrado.') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-slate-500">Nenhum plano selecionado.</p>
          <Link to="/plans" className="font-bold text-ASTER-600 hover:text-ASTER-700 mt-2 inline-block">
            Ver planos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-ASTER-50/60 via-white to-white py-16 px-4">
      <div className="max-w-md mx-auto">
        <Link to="/plans" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-ASTER-600 transition-colors mb-8">
          <ArrowLeft size={16} /> Voltar para os planos
        </Link>

        <div className="bg-white rounded-[28px] card-shadow border border-ASTER-100 p-8">
          <h1 className="font-display font-extrabold text-2xl text-ink-900">Checkout</h1>

          {plan && (
            <div className="mt-6 flex items-center justify-between border-b border-ASTER-100 pb-5">
              <div>
                <p className="font-bold text-ink-900">{plan.name}</p>
                <p className="text-sm text-slate-500">{billing === 'annual' ? 'Cobrança anual' : 'Cobrança mensal'}</p>
              </div>
              <p className="font-display font-extrabold text-xl text-ASTER-600">{formatBRL(amountDue)}</p>
            </div>
          )}

          {!order ? (
            <>
              <p className="text-sm text-slate-500 mt-5 flex items-center gap-2">
                <ShieldCheck size={16} className="text-ASTER-600" /> Checkout seguro, via Stripe.
              </p>
              {error && <p className="text-rose-500 text-sm font-semibold mt-4">{error}</p>}
              <button
                onClick={startCheckout}
                disabled={submitting || !plan}
                className="mt-6 w-full bg-ASTER-600 hover:bg-ASTER-700 disabled:opacity-60 text-white font-bold py-4 rounded-full transition-all"
              >
                {submitting ? 'Preparando checkout…' : 'Continuar para pagamento'}
              </button>
            </>
          ) : (
            <>
              <p className="text-sm text-slate-500 mt-5">
                O Stripe ainda não está configurado neste ambiente, então o pagamento é simulado para desenvolvimento.
              </p>
              {error && <p className="text-rose-500 text-sm font-semibold mt-4">{error}</p>}
              <button
                onClick={confirmSimulatedPayment}
                disabled={submitting}
                className="mt-6 w-full bg-ASTER-600 hover:bg-ASTER-700 disabled:opacity-60 text-white font-bold py-4 rounded-full transition-all"
              >
                {submitting ? 'Confirmando…' : `Simular pagamento de ${formatBRL(order.amount)}`}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
