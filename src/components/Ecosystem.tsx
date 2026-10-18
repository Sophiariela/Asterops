import { motion } from 'framer-motion';
import { ArrowRight, Layers, Globe2, Store, Sparkles, Check, CalendarCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type Product = {
  icon: LucideIcon;
  tag: string;
  title: string;
  desc: string;
  luna: string;
  cta: string;
  features: string[];
  accent: string;
  bg: string;
};

const products: Product[] = [
  {
    icon: CalendarCheck,
    tag: 'Reservas e Agendamentos',
    title: 'Reservas de restaurante e agendamentos reais',
    desc: 'Cada site inclui o fluxo certo para o seu negócio: reserva de mesa para restaurantes, agendamento por serviço e duração para salões e profissionais, ou pedido de orçamento para serviços locais.',
    luna: 'A Luna ajuda a escrever a descrição de cada serviço oferecido.',
    cta: 'Ver a Biblioteca de Templates',
    features: ['Confirmação automática por e-mail', 'Bloqueio de horários e folgas', 'Painel de reservas para o dono do negócio'],
    accent: 'text-emerald-500',
    bg: 'bg-emerald-50',
  },
  {
    icon: Sparkles,
    tag: 'Luna AI',
    title: 'Conteúdo e SEO com ajuda de IA',
    desc: 'A Luna revisa o texto do seu site, sugere um título melhor para a página inicial e gera metadados de SEO — você sempre revisa antes de aplicar.',
    luna: 'Disponível direto no painel do seu site, sem configuração extra.',
    cta: 'Ver planos',
    features: ['Sugestão de template por setor', 'Melhoria de título e subtítulo', 'Geração de metadados de SEO'],
    accent: 'text-ASTER-600',
    bg: 'bg-ASTER-50',
  },
];

export default function Ecosystem({ onCta }: { onCta: () => void }) {
  return (
    <section id="ecossistema" className="relative bg-cream-50 py-16 sm:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="inline-flex items-center gap-2 bg-ASTER-50 border border-ASTER-200 rounded-full px-4 py-1.5 text-sm font-semibold text-ASTER-700">
            <Globe2 size={15} /> Plataforma ASTER
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight text-ink-900 mt-5 text-balance">
            Tudo o que o seu negócio precisa para vender online
          </h2>
          <p className="text-slate-600 text-base sm:text-lg mt-4">WebOS cria o seu site. CommerceOS organiza as suas vendas. A Luna ajuda em tudo.</p>
        </motion.div>

        {/* WebOS + CommerceOS wide cards */}
        <div className="grid lg:grid-cols-2 gap-5 mt-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="relative bg-ink-950 text-white rounded-[28px] p-7 sm:p-10 overflow-hidden group"
          >
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-ASTER-600/50 blur-[100px] rounded-full group-hover:scale-125 transition-transform duration-700" />
            <div className="absolute inset-0 dot-grid opacity-10" />
            <div className="relative">
              <span className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-1.5 text-[13px] font-bold text-volt-400">
                <Layers size={14} /> WebOS
              </span>
              <h3 className="font-display font-extrabold text-2xl sm:text-[34px] leading-tight mt-4 text-balance">
                Mais de 50 templates prontos para o seu setor
              </h3>
              <p className="text-white/65 mt-3 text-[15px] sm:text-base">
                Restaurantes, serviços profissionais, beleza e bem-estar, varejo, criadores, educação e serviços locais — cada modelo com a estrutura certa para o negócio.
              </p>
              <p className="font-display font-bold text-volt-400 mt-4 text-lg">7 categorias de templates</p>
              <div className="flex flex-wrap gap-2 mt-5">
                {['Restaurantes', 'Serviços profissionais', 'Beleza e bem-estar', 'Varejo', 'Criadores', 'Educação', 'Serviços locais'].map((c) => (
                  <span key={c} className="text-[13px] font-semibold bg-white/10 border border-white/15 rounded-full px-3.5 py-1.5">{c}</span>
                ))}
              </div>
              <button onClick={onCta} className="mt-7 inline-flex items-center gap-2 font-bold text-white hover:gap-3 transition-all">
                Ver planos <ArrowRight size={18} className="text-volt-400" />
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
            className="relative bg-white rounded-[28px] p-7 sm:p-10 overflow-hidden card-shadow border border-ASTER-100 group"
          >
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-volt-400/30 blur-[100px] rounded-full group-hover:scale-125 transition-transform duration-700" />
            <div className="relative">
              <span className="inline-flex items-center gap-2 bg-ASTER-600 text-white rounded-full px-4 py-1.5 text-[13px] font-bold">
                <Store size={14} /> CommerceOS
              </span>
              <h3 className="font-display font-extrabold text-2xl sm:text-[34px] leading-tight mt-4 text-ink-900 text-balance">
                Catálogo, estoque e pedidos em um só lugar
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
                    <p className="text-[11px] sm:text-xs text-slate-500 font-medium">{s.l}</p>
                  </div>
                ))}
              </div>
              <button onClick={onCta} className="mt-7 inline-flex items-center gap-2 font-bold text-ASTER-600 hover:gap-3 transition-all">
                Ver planos <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Product grid */}
        <div className="grid sm:grid-cols-2 gap-5 mt-5">
          {products.map((p, i) => (
            <motion.div
              key={p.tag}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: (i % 2) * 0.1 }}
              className="bg-white rounded-[28px] card-shadow-sm border border-ASTER-100 overflow-hidden hover:card-shadow hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              <div className="p-7 sm:p-8 flex-1 flex flex-col">
                <div className="flex items-center gap-3">
                  <span className={`w-12 h-12 rounded-2xl ${p.bg} ${p.accent} flex items-center justify-center`}>
                    <p.icon size={22} />
                  </span>
                  <span className="text-[13px] font-bold uppercase tracking-wider text-slate-400">{p.tag}</span>
                </div>
                <h3 className="font-display font-extrabold text-xl sm:text-2xl text-ink-900 mt-4 text-balance">{p.title}</h3>
                <p className="text-slate-600 mt-2.5 text-[15px] leading-relaxed">{p.desc}</p>
                <ul className="mt-4 space-y-2">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm font-medium text-[#2c1a63]">
                      <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0"><Check size={12} strokeWidth={3} /></span>
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-5 bg-gradient-to-r from-ASTER-50 to-volt-400/10 border border-ASTER-100 rounded-2xl p-4 flex gap-3">
                  <Sparkles size={18} className="text-ASTER-600 shrink-0 mt-0.5" />
                  <p className="text-[13.5px] text-[#2c1a63] leading-relaxed"><strong>Com a Luna:</strong> {p.luna}</p>
                </div>
                <button onClick={onCta} className="mt-6 inline-flex items-center gap-2 font-bold text-ASTER-600 hover:gap-3 transition-all text-[15px]">
                  {p.cta} <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
