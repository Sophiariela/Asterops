import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Sparkles, Building2, Rocket, Gem } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { api } from '../lib/api';
import { formatBRL } from '../lib/currency';
import { FALLBACK_PLANS, type BackendPlan } from '../data/plans';
import { readCachedPlans, writeCachedPlans } from '../lib/plansCache';
import { SALES_EMAIL, trialMessage } from '../config/site';
import PlanComparison from './PlanComparison';

// Mesmo icone e ordem da pagina /plans, por slug — isto é um resumo do
// preco real, nao uma segunda tabela de precos escrita a mao.
const TIER_ICON: Record<string, LucideIcon> = { starter: Rocket, growth: Sparkles, business: Building2, scale: Gem };
const HIGHLIGHT_SLUG = 'growth';
/** Scale sai da grade principal e ganha faixa propria (5.3). */
const SECONDARY_SLUG = 'scale';

type Billing = 'monthly' | 'annual';

export default function Pricing({ onCta }: { onCta: () => void }) {
  /**
   * 5.2 — Mensal é o padrão.
   *
   * Antes abria em anual mostrando "R$ X/mês" com "no plano anual" em
   * letra pequena, o que faz o visitante achar que paga aquele valor por
   * mês. Agora começa no mensal e, no anual, a cobrança real aparece com
   * o mesmo destaque do valor.
   */
  const [billing, setBilling] = useState<Billing>('monthly');
  const [plans, setPlans] = useState<BackendPlan[]>(() => readCachedPlans() ?? FALLBACK_PLANS);
  const annual = billing === 'annual';

  useEffect(() => {
    let cancelled = false;
    api.get<{ plans: BackendPlan[] }>('/plans')
      .then((data) => {
        if (cancelled) return;
        setPlans(data.plans);
        writeCachedPlans(data.plans);
      })
      .catch(() => {
        // Preco em cache/fallback ja esta na tela — falha em silencio.
      });
    return () => { cancelled = true; };
  }, []);

  /** Desconto anual calculado dos precos reais, nunca fixado no codigo. */
  const annualDiscount = useMemo(() => {
    const withAnnual = plans.filter((p) => p.annualPrice && p.price > 0);
    if (!withAnnual.length) return null;
    const rates = withAnnual.map((p) => 1 - (p.annualPrice as number) / (p.price * 12));
    const avg = rates.reduce((a, b) => a + b, 0) / rates.length;
    const pct = Math.round(avg * 100);
    return pct > 0 ? pct : null;
  }, [plans]);

  const primary = plans.filter((p) => p.slug !== SECONDARY_SLUG);
  const scale = plans.find((p) => p.slug === SECONDARY_SLUG);
  const trial = trialMessage();

  /** Preco mostrado + como a cobranca acontece, sempre juntos. */
  function priceOf(plan: BackendPlan) {
    const annualTotal = plan.annualPrice ?? plan.price * 12;
    const monthlyEquivalent = Math.round(annualTotal / 12);
    return {
      display: annual ? monthlyEquivalent : plan.price,
      billingLine: annual
        ? `Cobrado ${formatBRL(annualTotal)} uma vez por ano`
        : `Cobrado ${formatBRL(plan.price)} todo mês`,
      equivalenceLine: annual ? 'equivalente por mês no plano anual' : 'por mês',
    };
  }

  return (
    <section id="planos" className="scroll-mt-32 py-10 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 bg-ASTER-50 border border-ASTER-200 rounded-full px-4 py-1.5 text-sm font-semibold text-ASTER-700">
            Planos
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight text-ink-900 mt-4">
            Um plano para cada momento do seu negócio
          </h2>
          <p className="text-slate-600 text-[15px] sm:text-lg mt-3">
            Sem contrato de fidelidade. Cancele quando quiser.
          </p>

          {/* Toggle com papel de grupo de radio: estado claro no teclado. */}
          <div
            role="radiogroup"
            aria-label="Forma de cobrança"
            className="inline-flex items-center gap-1 mt-7 bg-ASTER-50 border border-ASTER-200 rounded-full p-1.5"
          >
            {(
              [
                { value: 'monthly' as const, label: 'Mensal' },
                { value: 'annual' as const, label: 'Anual' },
              ]
            ).map((option) => (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={billing === option.value}
                onClick={() => setBilling(option.value)}
                className={`text-sm font-bold px-5 py-2.5 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ASTER-600/40 ${
                  billing === option.value
                    ? 'bg-ASTER-600 text-white shadow-sm'
                    : 'text-ASTER-700 hover:bg-white/70'
                }`}
              >
                {option.label}
              </button>
            ))}
            {annualDiscount && (
              <span className="bg-volt-400 text-ink-950 text-xs font-extrabold px-3 py-2 rounded-full ml-1">
                -{annualDiscount}% no anual
              </span>
            )}
          </div>

          <p className="text-sm font-semibold text-ink-900 mt-4">
            {annual
              ? 'Você paga uma vez por ano. O valor em destaque é o equivalente por mês.'
              : 'Você paga todo mês. Sem compromisso de 12 meses.'}
          </p>

          {/* So aparece com TRIAL_DAYS e TRIAL_REQUIRES_CARD confirmados. */}
          {trial && <p className="text-sm font-semibold text-ASTER-700 mt-2">{trial}</p>}
        </div>

        {/* 5.3 — Starter, Growth e Business na linha principal. */}
        <div
          className="mt-10 flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 -mx-4 px-4 items-stretch
                     sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 sm:mt-12 sm:overflow-visible sm:mx-0 sm:px-0 sm:pb-0
                     max-w-5xl sm:mx-auto"
          role="group"
          aria-label="Planos Starter, Growth e Business"
        >
          {primary.map((p, i) => {
            const Icon = TIER_ICON[p.slug] ?? Rocket;
            const highlight = p.slug === HIGHLIGHT_SLUG;
            const { display, billingLine, equivalenceLine } = priceOf(p);

            return (
              <motion.div
                key={p.slug}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.01, margin: '0px 0px 240px 0px' }}
                transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.12), ease: 'easeOut' }}
                className={`relative rounded-[28px] p-6 sm:p-8 flex flex-col transition-transform sm:hover:-translate-y-1.5 duration-300 min-w-[86%] snap-center shrink-0 sm:min-w-0 sm:shrink ${
                  highlight
                    ? 'bg-ink-950 text-white card-shadow lg:scale-[1.04] border-2 border-ASTER-600'
                    : 'bg-white border border-ASTER-100 card-shadow-sm'
                }`}
              >
                {highlight && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-volt-400 text-ink-950 text-xs font-extrabold px-5 py-1.5 rounded-full whitespace-nowrap">
                    MAIS ESCOLHIDO
                  </span>
                )}
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${highlight ? 'bg-ASTER-600' : 'bg-ASTER-50 text-ASTER-600'}`}>
                  <Icon size={22} className={highlight ? 'text-white' : ''} aria-hidden="true" />
                </div>
                <h3 className={`font-display font-extrabold text-2xl mt-4 ${highlight ? 'text-white' : 'text-ink-900'}`}>
                  {p.name}
                </h3>
                <p className={`text-sm mt-1.5 ${highlight ? 'text-white/80' : 'text-slate-600'}`}>
                  {p.description}
                </p>

                <div className="mt-5 flex items-end gap-1.5">
                  <span className={`text-sm font-semibold mb-2 ${highlight ? 'text-white/80' : 'text-slate-600'}`}>R$</span>
                  <span className={`font-display font-extrabold text-5xl ${highlight ? 'text-white' : 'text-ink-900'}`}>
                    {(display / 100).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                  </span>
                  <span className={`text-sm font-medium mb-1.5 ${highlight ? 'text-white/80' : 'text-slate-600'}`}>
                    /mês
                  </span>
                </div>
                <p className={`text-xs mt-0.5 ${highlight ? 'text-white/70' : 'text-slate-600'}`}>
                  {equivalenceLine}
                </p>
                {/* Como e quando cobra, com o mesmo peso do valor. */}
                <p className={`text-sm font-bold mt-2 ${highlight ? 'text-volt-400' : 'text-ASTER-700'}`}>
                  {billingLine}
                </p>

                <ul className="mt-6 space-y-3 flex-1">
                  {p.features.slice(0, 4).map((f, fi) => (
                    <li key={f} className={`${fi < 3 ? 'flex' : 'hidden sm:flex'} items-start gap-2.5 text-sm font-medium ${highlight ? 'text-white/90' : 'text-[#2c1a63]'}`}>
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${highlight ? 'bg-volt-400 text-ink-950' : 'bg-emerald-50 text-emerald-700'}`}>
                        <Check size={12} strokeWidth={3} aria-hidden="true" />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={onCta}
                  className={`mt-6 w-full font-bold py-3.5 rounded-full transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-4 ${
                    highlight
                      ? 'bg-volt-400 hover:bg-volt-300 text-ink-950 hover:shadow-lg hover:shadow-volt-400/25 focus-visible:ring-volt-400/60'
                      : 'bg-ASTER-600 hover:bg-ASTER-700 text-white hover:shadow-lg hover:shadow-ASTER-600/30 focus-visible:ring-ASTER-600/40'
                  }`}
                >
                  Ver plano {p.name} <ArrowRight size={17} aria-hidden="true" />
                </button>
              </motion.div>
            );
          })}
        </div>

        <p className="sm:hidden text-center text-xs text-slate-600 mt-3">
          Deslize para ver os três planos
        </p>

        {/* 5.3 — Scale em faixa horizontal, sem perder preco nem assinatura. */}
        {scale && (
          <div className="max-w-5xl mx-auto mt-5 rounded-[28px] border border-ASTER-200 bg-ASTER-50/50 p-5 sm:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-10">
              <div className="flex items-start gap-4 flex-1">
                <span className="w-12 h-12 rounded-2xl bg-white border border-ASTER-200 text-ASTER-600 flex items-center justify-center shrink-0">
                  <Gem size={22} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-display font-extrabold text-xl sm:text-2xl text-ink-900">
                    Operações maiores? Fale com vendas.
                  </h3>
                  <p className="text-slate-600 text-sm sm:text-[15px] mt-1.5 max-w-xl">
                    {scale.description} O plano {scale.name} inclui tudo do Business, com suporte
                    prioritário e onboarding assistido.
                  </p>
                </div>
              </div>

              <div className="lg:text-right shrink-0">
                <p className="text-sm text-slate-600">
                  {scale.name} a partir de{' '}
                  <strong className="text-ink-900 font-display font-extrabold text-xl">
                    {formatBRL(priceOf(scale).display)}
                  </strong>
                  /mês
                </p>
                <p className="text-xs text-slate-600 mt-0.5">{priceOf(scale).billingLine}</p>
                <div className="flex flex-col sm:flex-row lg:justify-end gap-3 mt-4">
                  <a
                    href={`mailto:${SALES_EMAIL}?subject=${encodeURIComponent('Plano Scale — operação maior')}`}
                    className="inline-flex items-center justify-center gap-2 bg-ASTER-600 hover:bg-ASTER-700 text-white font-bold px-6 py-3 rounded-full transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ASTER-600/40"
                  >
                    Falar com vendas <ArrowRight size={17} aria-hidden="true" />
                  </a>
                  {/* Assinatura direta do Scale continua disponivel. */}
                  <button
                    onClick={onCta}
                    className="inline-flex items-center justify-center gap-2 bg-white border border-ASTER-200 hover:border-ASTER-600 text-ASTER-700 font-bold px-6 py-3 rounded-full transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ASTER-600/40"
                  >
                    Ver plano {scale.name}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5.4 */}
        <PlanComparison />
      </div>
    </section>
  );
}
