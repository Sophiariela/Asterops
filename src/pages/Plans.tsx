import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Check, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { formatBRL } from '../lib/currency';
import { PLAN_TIERS, ENTERPRISE_TIER, findTierForProduct } from '../data/plans';
import PaymentMethods from '../components/PaymentMethods';
import Footer from '../components/Footer';

type BackendPlan = {
  id: string;
  name: string;
  slug: string;
  description: string;
  features: string[];
  price: number;
  annualPrice: number | null;
  status: 'ACTIVE' | 'ARCHIVED';
};

export default function Plans() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productParam = searchParams.get('product');
  const highlightedTier = findTierForProduct(productParam)?.slug;
  const wasCancelled = searchParams.get('cancelled') === '1';

  const [backendPlans, setBackendPlans] = useState<BackendPlan[] | null>(null);
  const [error, setError] = useState('');
  const [annual, setAnnual] = useState(true);

  useEffect(() => {
    api
      .get<{ plans: BackendPlan[] }>('/plans')
      .then((data) => setBackendPlans(data.plans))
      .catch(() => setError('Não foi possível carregar os planos agora. Tente novamente em instantes.'));
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
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-ASTER-600 transition-colors mb-8">
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
          <p className="text-slate-500 mt-4 text-base sm:text-lg">
            Assine o plano ASTER que acompanha o seu momento — sem contrato de fidelidade.
          </p>

          <div className="inline-flex items-center gap-3 mt-7 bg-ASTER-50 rounded-full p-1.5 pl-5">
            <button onClick={() => setAnnual(false)} className={`text-sm font-bold px-2 py-1.5 transition-colors ${!annual ? 'text-ASTER-700' : 'text-slate-400'}`}>
              Mensal
            </button>
            <button onClick={() => setAnnual(true)} className={`text-sm font-bold px-2 py-1.5 transition-colors ${annual ? 'text-ASTER-700' : 'text-slate-400'}`}>
              Anual
            </button>
            <span className="bg-volt-400 text-ink-950 text-xs font-extrabold px-3 py-2 rounded-full">2 meses grátis</span>
          </div>
        </div>

        {error && <p className="text-center text-rose-500 font-semibold mt-10">{error}</p>}

        {!backendPlans && !error && (
          <p className="text-center text-slate-400 mt-16">Carregando planos…</p>
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
                  <p className="text-slate-500 text-sm mt-2 min-h-[40px]">{tier.description}</p>

                  <div className="mt-5 flex items-end gap-1.5">
                    <span className="text-sm font-semibold mb-2 text-slate-400">R$</span>
                    <span className="font-display font-extrabold text-4xl text-ink-900">
                      {(price / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="text-sm font-medium mb-1.5 text-slate-400">/mês</span>
                  </div>
                  {annual ? (
                    <div className="mt-1.5 space-y-0.5">
                      <p className="text-xs font-medium text-slate-400">Cobrado anualmente · {formatBRL(annualTotal)}/ano</p>
                      <p className="text-xs font-bold text-ASTER-600">Economize {annualSavingsPct}% no plano anual</p>
                    </div>
                  ) : (
                    <p className="text-xs font-medium mt-1.5 text-slate-400">Cobrança mensal · cancele quando quiser</p>
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

            <div className="relative bg-ink-950 text-white rounded-[28px] p-7 sm:p-8 flex flex-col border border-ink-950">
              <h2 className="font-display font-extrabold text-2xl">{ENTERPRISE_TIER.name}</h2>
              <p className="text-white/60 text-sm mt-2 min-h-[40px]">{ENTERPRISE_TIER.description}</p>
              <div className="mt-5">
                <span className="font-display font-extrabold text-2xl">Personalizado</span>
              </div>
              <p className="text-xs font-medium mt-1 text-volt-400">condições sob consulta</p>
              <ul className="mt-6 space-y-3 flex-1">
                {ENTERPRISE_TIER.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-white/90">
                    <Check size={16} className="text-volt-400 shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                href={ENTERPRISE_TIER.contactHref}
                className="mt-8 w-full bg-volt-400 hover:bg-volt-300 text-ink-950 font-bold py-3.5 rounded-full transition-all flex items-center justify-center gap-2"
              >
                {ENTERPRISE_TIER.cta} <ArrowRight size={18} />
              </a>
            </div>
          </div>
        )}

        <div className="mt-14">
          <PaymentMethods />
        </div>
      </div>
      </div>

      <Footer />
    </div>
  );
}
