import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Check, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { formatBRL } from '../lib/currency';
import { PLAN_TIERS, FALLBACK_PLANS, findTierForProduct, type BackendPlan } from '../data/plans';
import { readCachedPlans, writeCachedPlans } from '../lib/plansCache';
import PaymentMethods from '../components/PaymentMethods';
import PlanComparison from '../components/PlanComparison';
import { SALES_EMAIL } from '../config/site';
import Footer from '../components/Footer';
import { usePageMeta } from '../lib/meta';
import { ROUTE_META } from '../config/route-meta';

function PricingCardSkeleton() {
  return (
    <div className="bg-white rounded-[28px] p-7 sm:p-8 border border-ASTER-100 card-shadow-sm animate-pulse">
      <div className="h-6 w-24 bg-slate-200 rounded-full" />
      <div className="h-4 w-full bg-slate-100 rounded-full mt-4" />
      <div className="h-4 w-2/3 bg-slate-100 rounded-full mt-2" />
      <div className="h-9 w-32 bg-slate-200 rounded-full mt-6" />
      <div className="space-y-3 mt-7">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-4 w-full bg-slate-100 rounded-full" />
        ))}
      </div>
      <div className="h-12 w-full bg-slate-200 rounded-full mt-8" />
    </div>
  );
}

export default function Plans() {
  usePageMeta(ROUTE_META.plans);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productParam = searchParams.get('product');
  const highlightedTier = findTierForProduct(productParam)?.slug;
  const wasCancelled = searchParams.get('cancelled') === '1';

  const [backendPlans, setBackendPlans] = useState<BackendPlan[] | null>(
    () => readCachedPlans() ?? FALLBACK_PLANS,
  );
  /*
   * 5.2 - Mensal e o padrao. Este estado tambem define o billing enviado
   * ao checkout (ver subscribe), entao o que o visitante ve em destaque e
   * exatamente o que ele vai contratar.
   */
  const [annual, setAnnual] = useState(false);

  useEffect(() => {
    let cancelled = false;

    // No abort/timeout on the request itself — a Render cold start can take
    // well past 2s, and we still want the silent update whenever it lands.
    // The "timeout protection" is architectural: cached/fallback plans are
    // already the initial render, so nothing here ever blocks paint.
    api
      .get<{ plans: BackendPlan[] }>('/plans')
      .then((data) => {
        if (cancelled) return;
        setBackendPlans(data.plans);
        writeCachedPlans(data.plans);
      })
      .catch(() => {
        // Cached/fallback pricing is already on screen — fail silently.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!backendPlans || !highlightedTier) return;
    document.getElementById(`plan-${highlightedTier}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [backendPlans, highlightedTier]);

  const subscribe = (slug: string) => {
    const billing = annual ? 'annual' : 'monthly';
    if (!user) {
      navigate('/login', { state: { from: `/checkout?plan=${slug}&billing=${billing}` } });
      return;
    }
    navigate(`/checkout?plan=${slug}&billing=${billing}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-ASTER-50/60 via-white to-white">
      <div className="py-16 sm:py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-ASTER-600 transition-colors mb-8">
          <ArrowLeft size={16} /> Voltar para a home
        </Link>

        {wasCancelled && (
          <div className="max-w-2xl mx-auto mb-8 flex items-center gap-2.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-2xl px-5 py-3.5 text-sm font-semibold">
            <AlertCircle size={18} className="shrink-0" /> Seu pagamento não foi concluído.
          </div>
        )}

        <div className="text-center max-w-2xl mx-auto">
          <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-ink-900 leading-tight">
            Escolha o plano da sua operação
          </h1>
          <p className="text-slate-600 mt-4 text-base sm:text-lg">
            Assine o plano ASTER que acompanha o seu momento — sem contrato de fidelidade.
          </p>

          <div
            role="radiogroup"
            aria-label="Forma de cobranca"
            className="inline-flex items-center gap-1 mt-7 bg-ASTER-50 border border-ASTER-200 rounded-full p-1.5"
          >
            <button
              type="button"
              role="radio"
              aria-checked={!annual}
              onClick={() => setAnnual(false)}
              className={`text-sm font-bold px-5 py-2.5 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ASTER-600/40 ${!annual ? 'bg-ASTER-600 text-white shadow-sm' : 'text-ASTER-700 hover:bg-white/70'}`}
            >
              Mensal
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={annual}
              onClick={() => setAnnual(true)}
              className={`text-sm font-bold px-5 py-2.5 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ASTER-600/40 ${annual ? 'bg-ASTER-600 text-white shadow-sm' : 'text-ASTER-700 hover:bg-white/70'}`}
            >
              Anual
            </button>
          </div>

          <p className="text-sm font-semibold text-ink-900 mt-4">
            {annual
              ? 'Voce paga uma vez por ano. O valor em destaque e o equivalente por mes.'
              : 'Voce paga todo mes. Sem compromisso de 12 meses.'}
          </p>
        </div>

        {!backendPlans && (
          <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {Array.from({ length: 4 }).map((_, i) => (
              <PricingCardSkeleton key={i} />
            ))}
          </div>
        )}

        {backendPlans && (
          <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {PLAN_TIERS.map((tier) => {
              const backendPlan = backendPlans.find((p) => p.slug === tier.slug);
              const isHighlighted = highlightedTier === tier.slug;
              const annualTotal = backendPlan?.annualPrice ?? (backendPlan ? backendPlan.price * 12 : 0);
              const annualMonthlyEquivalent = Math.round(annualTotal / 12);
              const price = backendPlan ? (annual ? annualMonthlyEquivalent : backendPlan.price) : 0;
              const annualSavingsPct = backendPlan ? Math.round((1 - annualMonthlyEquivalent / backendPlan.price) * 100) : 0;

              return (
                <div
                  key={tier.slug}
                  id={`plan-${tier.slug}`}
                  className={`relative bg-white rounded-[28px] p-7 sm:p-8 flex flex-col transition-all ${
                    isHighlighted || tier.highlight
                      ? 'border-2 border-ASTER-600 card-shadow lg:scale-[1.03]'
                      : 'border border-ASTER-100 card-shadow-sm'
                  }`}
                >
                  {(isHighlighted || tier.highlight) && (
                    <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-volt-400 text-ink-950 text-xs font-extrabold px-5 py-1.5 rounded-full whitespace-nowrap">
                      {isHighlighted ? 'RECOMENDADO PARA VOCÊ' : 'MAIS ESCOLHIDO'}
                    </span>
                  )}
                  <h2 className="font-display font-extrabold text-2xl text-ink-900">{tier.name}</h2>
                  <p className="text-slate-600 text-sm mt-2 min-h-[40px]">{tier.description}</p>

                  <div className="mt-5 flex items-end gap-1.5">
                    <span className="text-sm font-semibold mb-2 text-slate-600">R$</span>
                    <span className="font-display font-extrabold text-4xl text-ink-900">
                      {(price / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="text-sm font-medium mb-1.5 text-slate-600">/mês</span>
                  </div>
                  {annual ? (
                    <div className="mt-1 space-y-1">
                      <p className="text-xs text-slate-600">equivalente por mês no plano anual</p>
                      <p className="text-sm font-bold text-ASTER-700">
                        Cobrado {formatBRL(annualTotal)} uma vez por ano
                      </p>
                      <p className="text-xs font-semibold text-emerald-700">
                        Economia de {annualSavingsPct}% frente ao mensal
                      </p>
                    </div>
                  ) : (
                    <div className="mt-1 space-y-1">
                      <p className="text-xs text-slate-600">por mês</p>
                      <p className="text-sm font-bold text-ASTER-700">
                        Cobrado {formatBRL(backendPlan?.price ?? 0)} todo mês
                      </p>
                      <p className="text-xs text-slate-600">Cancele quando quiser</p>
                    </div>
                  )}

                  <ul className="mt-6 space-y-3 flex-1">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm text-slate-600">
                        <Check size={16} className="text-ASTER-600 shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => backendPlan && subscribe(backendPlan.slug)}
                    disabled={!backendPlan}
                    className="mt-8 w-full bg-ASTER-600 hover:bg-ASTER-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-full transition-all flex items-center justify-center gap-2"
                  >
                    {tier.cta} <ArrowRight size={18} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {backendPlans && (
          <p className="text-center text-sm text-slate-600 mt-8">
            Precisa de uma necessidade maior ou condições específicas no plano Scale?{' '}
            <a href={`mailto:${SALES_EMAIL}?subject=${encodeURIComponent('Plano Scale personalizado')}`} className="font-bold text-ASTER-600 hover:underline">
              Fale com vendas
            </a>
            .
          </p>
        )}

        <PlanComparison />

        <div className="mt-14">
          <PaymentMethods />
        </div>
      </div>
      </div>

      <Footer />
    </div>
  );
}
