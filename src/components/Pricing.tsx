import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Sparkles, Building2, Rocket } from 'lucide-react';

const plans = [
  {
    icon: Rocket,
    name: 'Essencial',
    desc: 'Para começar a vender com gestão profissional',
    monthly: 79,
    annual: 63,
    features: ['Emissão de NF-e e NFC-e', 'Controle de estoque', '1 usuário + PDV básico', 'Integração com 1 marketplace', 'Suporte por chat'],
    highlight: false,
    cta: 'Começar teste grátis',
  },
  {
    icon: Sparkles,
    name: 'Crescimento',
    desc: 'Para escalar em todos os canais com IA',
    monthly: 149,
    annual: 119,
    features: ['Tudo do Essencial', 'Lis — Agente de IA incluso', 'Hub com marketplaces ilimitados', 'Envios com até 50% off no frete', 'Conta Digital + conciliação automática', 'Até 5 usuários'],
    highlight: true,
    cta: 'Começar teste grátis',
  },
  {
    icon: Building2,
    name: 'Empresas',
    desc: 'Para operações de alto volume e grandes times',
    monthly: 349,
    annual: 279,
    features: ['Tudo do Crescimento', '99.9% de estabilidade garantida', 'API dedicada + gerente de conta', 'Multi-empresa e multi-filial', 'Usuários ilimitados', 'Onboarding assistido'],
    highlight: false,
    cta: 'Falar com especialista',
  },
];

export default function Pricing({ onCta }: { onCta: () => void }) {
  const [annual, setAnnual] = useState(true);

  return (
    <section id="planos" className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto"
        >
          <span className="inline-flex items-center gap-2 bg-ASTER-50 border border-ASTER-200 rounded-full px-4 py-1.5 text-sm font-semibold text-ASTER-700">
            Planos
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight text-ink-900 mt-5">
            Um plano para cada momento do seu negócio
          </h2>
          <p className="text-slate-600 text-base sm:text-lg mt-4">Teste 30 dias grátis. Sem cartão, sem fidelidade, sem letra miúda.</p>

          <div className="inline-flex items-center gap-3 mt-7 bg-ASTER-50 rounded-full p-1.5 pl-5">
            <button onClick={() => setAnnual(false)} className={`text-sm font-bold px-2 py-1.5 transition-colors ${!annual ? 'text-ASTER-700' : 'text-slate-400'}`}>
              Mensal
            </button>
            <button onClick={() => setAnnual(true)} className={`text-sm font-bold px-2 py-1.5 transition-colors ${annual ? 'text-ASTER-700' : 'text-slate-400'}`}>
              Anual
            </button>
            <span className="bg-volt-400 text-ink-950 text-xs font-extrabold px-3 py-2 rounded-full">-20%</span>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-5 mt-12 items-stretch max-w-6xl mx-auto">
          {plans.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative rounded-[28px] p-7 sm:p-8 flex flex-col transition-transform hover:-translate-y-1.5 duration-300 ${
                p.highlight
                  ? 'bg-ink-950 text-white card-shadow lg:scale-[1.04] border-2 border-ASTER-600'
                  : 'bg-white border border-ASTER-100 card-shadow-sm'
              }`}
            >
              {p.highlight && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-volt-400 text-ink-950 text-xs font-extrabold px-5 py-1.5 rounded-full whitespace-nowrap">
                  MAIS ESCOLHIDO
                </span>
              )}
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${p.highlight ? 'bg-ASTER-600' : 'bg-ASTER-50 text-ASTER-600'}`}>
                <p.icon size={22} className={p.highlight ? 'text-white' : ''} />
              </div>
              <h3 className={`font-display font-extrabold text-2xl mt-4 ${p.highlight ? 'text-white' : 'text-ink-900'}`}>{p.name}</h3>
              <p className={`text-sm mt-1.5 ${p.highlight ? 'text-white/60' : 'text-slate-500'}`}>{p.desc}</p>
              <div className="mt-5 flex items-end gap-1.5">
                <span className={`text-sm font-semibold mb-2 ${p.highlight ? 'text-white/60' : 'text-slate-400'}`}>R$</span>
                <span className={`font-display font-extrabold text-5xl ${p.highlight ? 'text-white' : 'text-ink-900'}`}>
                  {annual ? p.annual : p.monthly}
                </span>
                <span className={`text-sm font-medium mb-1.5 ${p.highlight ? 'text-white/60' : 'text-slate-400'}`}>/mês</span>
              </div>
              <p className={`text-xs font-medium mt-1 ${p.highlight ? 'text-volt-400' : 'text-ASTER-600'}`}>
                {annual ? `no plano anual · R$ ${(annual ? p.annual : p.monthly) * 12}/ano` : 'no plano mensal · cancele quando quiser'}
              </p>
              <ul className="mt-6 space-y-3 flex-1">
                {p.features.map((f) => (
                  <li key={f} className={`flex items-start gap-2.5 text-sm font-medium ${p.highlight ? 'text-white/90' : 'text-[#2c1a63]'}`}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${p.highlight ? 'bg-volt-400 text-ink-950' : 'bg-emerald-50 text-emerald-500'}`}>
                      <Check size={12} strokeWidth={3} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={onCta}
                className={`mt-7 w-full font-bold py-3.5 rounded-full transition-all flex items-center justify-center gap-2 ${
                  p.highlight
                    ? 'bg-volt-400 hover:bg-volt-300 text-ink-950 hover:shadow-lg hover:shadow-volt-400/25'
                    : 'bg-ASTER-600 hover:bg-ASTER-700 text-white hover:shadow-lg hover:shadow-ASTER-600/30'
                }`}
              >
                {p.cta} <ArrowRight size={17} />
              </button>
            </motion.div>
          ))}
        </div>
        <p className="text-center text-xs text-slate-400 mt-6">*Valores promocionais de lançamento. Condições especiais para grandes volumes.</p>
      </div>
    </section>
  );
}
