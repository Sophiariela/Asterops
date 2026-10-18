import { motion } from 'framer-motion';
import { ArrowRight, UtensilsCrossed, Briefcase, Sparkles as SparklesIcon, ShoppingBag, Camera, GraduationCap, Wrench } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// The 7 real Template Library categories (see templateCategories.ts) —
// not a generic retail-segment list.
const segments: { name: string; icon: LucideIcon; desc: string; accent: string; bg: string }[] = [
  { name: 'Restaurantes', icon: UtensilsCrossed, desc: 'Cardápio, mesas e reservas', accent: 'text-rose-600', bg: 'from-rose-50 to-rose-100' },
  { name: 'Serviços Profissionais', icon: Briefcase, desc: 'Consultoria, advocacia, contabilidade', accent: 'text-ASTER-600', bg: 'from-ASTER-50 to-ASTER-100' },
  { name: 'Beleza e Bem-estar', icon: SparklesIcon, desc: 'Salões, estética e academias', accent: 'text-violet-600', bg: 'from-violet-50 to-violet-100' },
  { name: 'Varejo', icon: ShoppingBag, desc: 'Catálogo de produtos e pedidos', accent: 'text-amber-600', bg: 'from-amber-50 to-amber-100' },
  { name: 'Criadores', icon: Camera, desc: 'Portfólio, fotógrafos e marca pessoal', accent: 'text-blue-600', bg: 'from-blue-50 to-blue-100' },
  { name: 'Educação', icon: GraduationCap, desc: 'Cursos e programas de ensino', accent: 'text-emerald-600', bg: 'from-emerald-50 to-emerald-100' },
  { name: 'Serviços Locais', icon: Wrench, desc: 'Orçamentos e área de atendimento', accent: 'text-cyan-600', bg: 'from-cyan-50 to-cyan-100' },
];

export default function Segments({ onCta }: { onCta: () => void }) {
  return (
    <section className="py-16 sm:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6"
        >
          <div className="max-w-2xl">
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight text-ink-900 text-balance">
              Um template pronto para o seu setor
            </h2>
            <p className="text-slate-600 text-base sm:text-lg mt-4">7 categorias, mais de 50 modelos — escolha e personalize.</p>
          </div>
          <button
            onClick={onCta}
            className="hidden sm:inline-flex bg-ASTER-600 hover:bg-ASTER-700 text-white font-bold px-7 py-3.5 rounded-full transition-all hover:shadow-lg hover:shadow-ASTER-600/30 items-center gap-2 shrink-0"
          >
            Ver planos <ArrowRight size={18} />
          </button>
        </motion.div>

        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {segments.map((s, i) => (
            <motion.button
              key={s.name}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: Math.min(i * 0.07, 0.3) }}
              onClick={onCta}
              className="group text-left bg-white border border-ASTER-100 rounded-[26px] p-6 hover:-translate-y-1 hover:card-shadow transition-all duration-300"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.bg} ${s.accent} flex items-center justify-center`}>
                <s.icon size={24} />
              </div>
              <h3 className="font-display font-extrabold text-ink-900 text-lg mt-4">{s.name}</h3>
              <p className="text-slate-500 text-sm mt-1">{s.desc}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-ASTER-600 font-bold text-sm group-hover:gap-3 transition-all">
                Explorar modelos <ArrowRight size={16} />
              </span>
            </motion.button>
          ))}
        </div>

        <div className="mt-8 sm:hidden">
          <button onClick={onCta} className="w-full bg-ASTER-600 text-white font-bold px-7 py-4 rounded-full flex items-center justify-center gap-2">
            Ver planos <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
