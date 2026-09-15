import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { api } from '../../lib/api';
import { formatBRL } from '../../lib/currency';

type Order = {
  id: string;
  amount: number;
  status: string;
  plan: { name: string };
};

const POLL_INTERVAL_MS = 1500;
const POLL_TIMEOUT_MS = 20000;

export default function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order');
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [timedOut, setTimedOut] = useState(false);
  const startedAt = useRef(Date.now());

  useEffect(() => {
    if (!orderId) return;
    let cancelled = false;

    const poll = async () => {
      try {
        const data = await api.get<{ order: Order }>(`/checkout/${orderId}`);
        if (cancelled) return;
        setOrder(data.order);
        if (data.order.status === 'PAID') return;
      } catch {
        // keep retrying until the timeout
      }
      if (cancelled) return;
      if (Date.now() - startedAt.current > POLL_TIMEOUT_MS) {
        setTimedOut(true);
        return;
      }
      setTimeout(poll, POLL_INTERVAL_MS);
    };

    poll();
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  const confirmed = order?.status === 'PAID';

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <CheckCircle2 size={64} className="text-emerald-500 mx-auto" />
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-ink-900 mt-5">Pagamento confirmado.</h1>
        {order && (
          <p className="text-slate-500 mt-3 text-[15px]">
            Plano <strong className="text-ink-900">{order.plan.name}</strong> — {formatBRL(order.amount)}
          </p>
        )}
        <p className="text-slate-500 mt-2 text-[15px]">
          Agora vamos coletar as informações da sua empresa pra deixar o seu sistema pronto.
        </p>

        {confirmed ? (
          <button
            onClick={() => navigate(orderId ? `/onboarding?order=${orderId}` : '/onboarding')}
            className="mt-7 inline-flex items-center gap-2 bg-ASTER-600 hover:bg-ASTER-700 text-white font-bold px-7 py-3.5 rounded-full transition-all"
          >
            Iniciar onboarding <ArrowRight size={18} />
          </button>
        ) : timedOut ? (
          <p className="mt-7 text-sm text-slate-400">
            Ainda estamos confirmando seu pagamento. Isso pode levar alguns instantes — atualize a página em breve.
          </p>
        ) : (
          <div className="mt-7 inline-flex items-center gap-2 text-slate-400 text-sm font-semibold">
            <Loader2 size={18} className="animate-spin" /> Confirmando pagamento…
          </div>
        )}
      </div>
    </div>
  );
}
