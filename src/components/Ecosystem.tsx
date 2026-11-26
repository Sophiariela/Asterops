import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Layers, Globe2, Store, Sparkles, Check, CalendarCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { getPortfolioBySegment } from '../data/portfolio';

type Product = {
  icon: LucideIcon;
  tag: string;
  title: string;
  desc: string;
  luna: string;
  cta: string;
  /** Destino do CTA. Externo quando aponta para um projeto real no ar. */
  ctaHref: string;
  ctaExternal?: boolean;
  features: string[];
  accent: string;
  bg: string;
};

const products: Product[] = [
  {
    icon: CalendarCheck,
    tag: 'Reservas e Agendamentos',
    title: 'Suas reservas e agendamentos, funcionando de verdade',
    desc: 'Cada site inclui o fluxo certo para o seu negócio: reserva de mesa para restaurantes, agendamento por serviço e duração para salões e profissionais, ou pedido de orçamento para serviços locais.',
    luna: 'A Luna ajuda a escrever a descrição de cada serviço oferecido.',
    cta: 'Ver exemplo de reservas',
    ctaHref: getPortfolioBySegment('Serviços locais')?.url ?? '/portfolio',
    ctaExternal: true,
    features: ['Confirmação automática por e-mail', 'Bloqueio de horários e folgas', 'Painel de reservas para o dono do negócio'],
    accent: 'text-emerald-500',
    bg: 'bg-emerald-50',
  },
];

export default function Ecosystem() {
  return (
    <section id="ecossistema" className="relative bg-cream-50 py-10 sm:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          className="text-center max-w-3xl mx-auto"
        >
          <span className="inline-flex items-center gap-2 bg-ASTER-50 border border-ASTER-200 rounded-full px-4 py-1.5 text-sm font-semibold text-ASTER-700">
            <Globe2 size={15} /> Plataforma ASTER
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight text-ink-900 mt-5 text-balance">
            Tudo o que o seu negócio precisa para vender online
          </h2>
          <p className="text-slate-600 text-[15px] sm:text-lg mt-3">WebOS cria o seu site, CommerceOS organiza as suas vendas e a Luna ajuda em tudo — sobre a mesma base de dados.</p>
        </motion.div>

        {/* CommerceOS: o site e os setores ficam na grade de setores. */}
        <div className="grid lg:grid-cols-2 gap-5 mt-12">

          <motion.div
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.01, margin: '0px 0px 240px 0px' }} transition={{ duration: 0.35, delay: 0.1, ease: 'easeOut' }}
            className="relative bg-white rounded-[28px] p-5 sm:p-10 overflow-hidden card-shadow border border-ASTER-100 group"
          >
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-volt-400/30 blur-[100px] rounded-full group-hover:scale-125 transition-transform duration-700" />
            <div className="relative">
              <span className="inline-flex items-center gap-2 bg-ASTER-600 text-white rounded-full px-4 py-1.5 text-[13px] font-bold">
                <Store size={14} /> CommerceOS
              </span>
              <h3 className="font-display font-extrabold text-2xl sm:text-[34px] leading-tight mt-4 text-ink-900 text-balance">
                Sua loja online: catálogo, estoque e pedidos
              </h3>
              <p className="text-slate-600 mt-3 text-[15px] sm:text-base">
                Organize produtos, categorias, clientes e pedidos da sua loja — conectado ao catálogo que aparece no seu site.
              </p>
              <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-5">
                {[
                  { v: '✓', l: 'catálogo de produtos' },
                  { v: '✓', l: 'controle de estoque' },
                  { v: '✓', l: 'gestão de pedidos' },
                ].map((s) => (
                  <div key={s.l} className="bg-ASTER-50 rounded-2xl p-3 text-center">
                    <p className="font-display font-extrabold text-ASTER-700 text-lg sm:text-xl">{s.v}</p>
                    <p className="text-[11px] sm:text-xs text-slate-600 font-medium">{s.l}</p>
                  </div>
                ))}
              </div>
              <Link to="/products/commerceos" className="mt-7 inline-flex items-center gap-2 font-bold text-ASTER-600 hover:gap-3 transition-all rounded-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ASTER-600/40">
                Ver recursos da loja <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Product grid */}
        <div className="grid sm:grid-cols-2 gap-3 mt-4">
          {products.map((p, i) => (
            <motion.div
              key={p.tag}
              initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.01, margin: '0px 0px 240px 0px' }} transition={{ duration: 0.35, delay: (i % 2) * 0.05, ease: 'easeOut' }}
              className="bg-white rounded-[28px] card-shadow-sm border border-ASTER-100 overflow-hidden hover:card-shadow hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              <div className="p-4 sm:p-8 flex-1 flex flex-col">
                <div className="flex items-center gap-3">
                  <span className={`w-12 h-12 rounded-2xl ${p.bg} ${p.accent} flex items-center justify-center`}>
                    <p.icon size={22} />
                  </span>
                  <span className="text-[13px] font-bold uppercase tracking-wider text-slate-600">{p.tag}</span>
                </div>
                <h3 className="font-display font-extrabold text-xl sm:text-2xl text-ink-900 mt-4 text-balance">{p.title}</h3>
                <p className="text-slate-600 mt-2.5 text-[15px] leading-relaxed">{p.desc}</p>
                <ul className="mt-3 space-y-1.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm font-medium text-[#2c1a63]">
                      <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0"><Check size={12} strokeWidth={3} /></span>
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 bg-gradient-to-r from-ASTER-50 to-volt-400/10 border border-ASTER-100 rounded-2xl p-4 flex gap-3">
                  <Sparkles size={18} className="text-ASTER-600 shrink-0 mt-0.5" />
                  <p className="text-[13.5px] text-[#2c1a63] leading-relaxed"><strong>Com a Luna:</strong> {p.luna}</p>
                </div>
                {p.ctaExternal ? (
                  <a
                    href={p.ctaHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 font-bold text-ASTER-600 hover:gap-3 transition-all text-[15px] rounded-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ASTER-600/40"
                  >
                    {p.cta} <ArrowRight size={18} aria-hidden="true" />
                    <span className="sr-only">— abre em uma nova aba</span>
                  </a>
                ) : (
                  <Link
                    to={p.ctaHref}
                    className="mt-6 inline-flex items-center gap-2 font-bold text-ASTER-600 hover:gap-3 transition-all text-[15px] rounded-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ASTER-600/40"
                  >
                    {p.cta} <ArrowRight size={18} aria-hidden="true" />
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
