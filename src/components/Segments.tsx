import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, UtensilsCrossed, Briefcase, Sparkles as SparklesIcon, ShoppingBag, Camera, GraduationCap, Wrench } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { ArrowUpRight } from 'lucide-react';
import { getPortfolioBySegment } from '../data/portfolio';

// The 7 real Template Library categories (see templateCategories.ts) —
// not a generic retail-segment list.
const segments: { name: string; icon: LucideIcon; desc: string; accent: string; bg: string }[] = [
  { name: 'Restaurantes', icon: UtensilsCrossed, desc: 'Cardápio, mesas e reservas', accent: 'text-rose-600', bg: 'from-rose-50 to-rose-100' },
  { name: 'Serviços Profissionais', icon: Briefcase, desc: 'Consultoria, advocacia, contabilidade', accent: 'text-ASTER-600', bg: 'from-ASTER-50 to-ASTER-100' },
  { name: 'Beleza e Bem-estar', icon: SparklesIcon, desc: 'Salões, estética e academias', accent: 'text-violet-600', bg: 'from-violet-50 to-violet-100' },
  { name: 'Varejo', icon: ShoppingBag, desc: 'Catálogo de produtos e pedidos', accent: 'text-amber-600', bg: 'from-amber-50 to-amber-100' },
  { name: 'Criadores', icon: Camera, desc: 'Portfólio, fotógrafos e marca pessoal', accent: 'text-blue-600', bg: 'from-blue-50 to-blue-100' },
  { name: 'Educação', icon: GraduationCap, desc: 'Cursos e programas de ensino', accent: 'text-emerald-700', bg: 'from-emerald-50 to-emerald-100' },
  { name: 'Serviços Locais', icon: Wrench, desc: 'Orçamentos e área de atendimento', accent: 'text-cyan-600', bg: 'from-cyan-50 to-cyan-100' },
];

export default function Segments({ onCta }: { onCta: () => void }) {
  return (
    <section className="py-10 sm:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6"
        >
          <div className="max-w-2xl">
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight text-ink-900 text-balance">
              Um template pronto para o seu setor
            </h2>
            <p className="text-slate-600 text-[15px] sm:text-lg mt-3">7 categorias, mais de 50 modelos — escolha e personalize.</p>
          </div>
          <button
            onClick={onCta}
            className="hidden sm:inline-flex bg-ASTER-600 hover:bg-ASTER-700 text-white font-bold px-7 py-3.5 rounded-full transition-all hover:shadow-lg hover:shadow-ASTER-600/30 items-center gap-2 shrink-0"
          >
            Ver modelos <ArrowRight size={18} aria-hidden="true" />
          </button>
        </motion.div>

        <div className="mt-6 sm:mt-10 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-5">
          {segments.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.01, margin: '0px 0px 240px 0px' }} transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.12), ease: 'easeOut' }}
              className="group flex flex-row sm:flex-col items-center sm:items-start gap-3 sm:gap-0 text-left bg-white border border-ASTER-100 rounded-2xl sm:rounded-[26px] p-4 sm:p-6 sm:hover:-translate-y-1 hover:card-shadow transition-all duration-300"
            >
              <div className={`w-11 h-11 sm:w-14 sm:h-14 shrink-0 rounded-2xl bg-gradient-to-br ${s.bg} ${s.accent} flex items-center justify-center`}>
                <s.icon size={24} aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0"><h3 className="font-display font-extrabold text-ink-900 text-base sm:text-lg sm:mt-4">{s.name}</h3>
              <p className="text-slate-600 text-[13px] sm:text-sm mt-0.5 sm:mt-1">{s.desc}</p></div>

              <Link
                to="/products/webos"
                className="shrink-0 inline-flex items-center gap-1.5 sm:gap-2 sm:mt-4 text-ASTER-600 font-bold text-[12px] sm:text-sm hover:gap-3 transition-all w-fit rounded-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ASTER-600/40"
              >
                <span className="hidden sm:inline">Ver modelos</span>
                <span className="sm:hidden">Modelos</span>
                <ArrowRight size={14} className="sm:hidden" aria-hidden="true" />
                <ArrowRight size={16} className="hidden sm:inline" aria-hidden="true" />
                <span className="sr-only">de {s.name}</span>
              </Link>

              {/* Setor que já tem projeto real no ar ganha o link do exemplo. */}
              {getPortfolioBySegment(s.name) && (
                <a
                  href={getPortfolioBySegment(s.name)!.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 sm:mt-2 hidden min-[420px]:inline-flex sm:inline-flex items-center gap-1.5 text-[12px] sm:text-[13px] font-bold text-ASTER-600 sm:text-ink-900 hover:text-ASTER-600 transition-colors w-fit rounded-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ASTER-600/40"
                >
                  Ver exemplo real <ArrowUpRight size={14} aria-hidden="true" />
                  <span className="sr-only">
                    — {getPortfolioBySegment(s.name)!.name}, abre em uma nova aba
                  </span>
                </a>
              )}
            </motion.div>
          ))}
        </div>

        <div className="mt-8 sm:hidden">
          <Link
            to="/products/webos"
            className="w-full bg-ASTER-600 text-white font-bold px-7 py-4 rounded-full flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ASTER-600/40"
          >
            Ver modelos <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
