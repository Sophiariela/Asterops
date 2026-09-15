import { motion } from 'framer-motion';
import { ArrowRight, Layers, Globe2, Store, Truck, Wallet, Cpu, Sparkles, Check } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type Product = {
  icon: LucideIcon;
  tag: string;
  title: string;
  desc: string;
  lis: string;
  cta: string;
  features: string[];
  accent: string;
  bg: string;
  image?: string;
};

const products: Product[] = [
  {
    icon: Layers,
    tag: 'Sistema ERP',
    title: 'Toda a sua operação em um sistema só',
    desc: 'O sistema de gestão completo para emitir notas fiscais, controlar o estoque em todos os canais e fechar as contas, sem trocar de plataforma.',
    lis: 'Antes da rotina começar, a Lis transforma os dados do ERP em prioridades e próximos passos.',
    cta: 'Conhecer o Sistema ERP',
    features: ['NF-e, NFS-e e NFC-e ilimitadas', 'Estoque multicanal unificado', 'Relatórios em tempo real'],
    accent: 'text-ASTER-600',
    bg: 'bg-ASTER-50',
  },
  {
    icon: Store,
    tag: 'Sistema PDV',
    title: 'Ponto de venda integrado',
    desc: 'Venda na frente de caixa e na frente do computador com a mesma agilidade: pedidos e estoque integrados, com controle de caixa preciso.',
    lis: 'Com canais, ecommerce e loja física integrados, a Lis revela o que vende e acelera a criação de produtos com IA.',
    cta: 'Conhecer Sistema PDV',
    features: ['Frente de caixa ultrarrápida', 'Controle de caixa e turnos', 'Sincronizado com o ERP'],
    accent: 'text-amber-500',
    bg: 'bg-amber-50',
    image: '/images/pdv.jpg',
  },
  {
    icon: Truck,
    tag: 'Envios da ASTER',
    title: 'Da venda à porta do cliente, sem dor de cabeça',
    desc: 'Logística simples para vendas online sem contrato e com frete até 50% mais barato. Cotação, etiqueta e rastreio em segundos.',
    lis: 'Antes do prazo apertar, a Lis mostra quais pedidos precisam sair primeiro.',
    cta: 'Conhecer Envios',
    features: ['Até 50% de economia no frete', 'Sem contrato, sem fidelidade', 'Coleta e rastreio inclusos'],
    accent: 'text-emerald-500',
    bg: 'bg-emerald-50',
    image: '/images/expedicao.jpg',
  },
  {
    icon: Wallet,
    tag: 'Soluções Financeiras',
    title: 'Receba, pague e concilie em um só lugar',
    desc: 'Conta Digital, Pix, boleto, link de pagamento, maquininha no celular e multiadquirentes — tudo direto pelo ERP.',
    lis: 'A Lis concilia seus recebimentos e projeta o fluxo de caixa automaticamente.',
    cta: 'Conhecer Conta Digital',
    features: ['Pix e boleto integrados', 'Link de pagamento', 'Antecipação de recebíveis'],
    accent: 'text-rose-500',
    bg: 'bg-rose-50',
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
            <Globe2 size={15} /> Ecossistema ASTER
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight text-ink-900 mt-5 text-balance">
            Um ecossistema único, com tudo o que o seu negócio precisa
          </h2>
          <p className="text-slate-600 text-base sm:text-lg mt-4">Cada solução funciona sozinha. Juntas, elas vendem por você.</p>
        </motion.div>

        {/* Hub + Ecommerce wide cards */}
        <div className="grid lg:grid-cols-2 gap-5 mt-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="relative bg-ink-950 text-white rounded-[28px] p-7 sm:p-10 overflow-hidden group"
          >
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-ASTER-600/50 blur-[100px] rounded-full group-hover:scale-125 transition-transform duration-700" />
            <div className="absolute inset-0 dot-grid opacity-10" />
            <div className="relative">
              <span className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-1.5 text-[13px] font-bold text-volt-400">
                <Globe2 size={14} /> Hub de Integração
              </span>
              <h3 className="font-display font-extrabold text-2xl sm:text-[34px] leading-tight mt-4 text-balance">
                Venda em todo canal sem multiplicar o trabalho
              </h3>
              <p className="text-white/65 mt-3 text-[15px] sm:text-base">
                Conecte-se aos principais marketplaces, plataformas de ecommerce, logística, pagamento e muito mais.
              </p>
              <p className="font-display font-bold text-volt-400 mt-4 text-lg">+170 integrações em um só lugar</p>
              <div className="flex flex-wrap gap-2 mt-5">
                {['Mercado Livre', 'Shopee', 'Amazon', 'TikTok Shop', 'Magalu', 'Nuvemshop', '+164'].map((c) => (
                  <span key={c} className="text-[13px] font-semibold bg-white/10 border border-white/15 rounded-full px-3.5 py-1.5">{c}</span>
                ))}
              </div>
              <button onClick={onCta} className="mt-7 inline-flex items-center gap-2 font-bold text-white hover:gap-3 transition-all">
                Ver todas as integrações <ArrowRight size={18} className="text-volt-400" />
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
                <Cpu size={14} /> Plataforma de Ecommerce
              </span>
              <h3 className="font-display font-extrabold text-2xl sm:text-[34px] leading-tight mt-4 text-ink-900 text-balance">
                Loja virtual completa para sua marca crescer sem limites
              </h3>
              <p className="text-slate-600 mt-3 text-[15px] sm:text-base">
                Ferramentas de crescimento nativas da plataforma e customização avançada. Sua marca, suas regras.
              </p>
              <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-5">
                {[
                  { v: '0%', l: 'taxa por venda*' },
                  { v: '100+', l: 'temas prontos' },
                  { v: 'SEO', l: 'nativo' },
                ].map((s) => (
                  <div key={s.l} className="bg-ASTER-50 rounded-2xl p-3 text-center">
                    <p className="font-display font-extrabold text-ASTER-700 text-lg sm:text-xl">{s.v}</p>
                    <p className="text-[11px] sm:text-xs text-slate-500 font-medium">{s.l}</p>
                  </div>
                ))}
              </div>
              <button onClick={onCta} className="mt-7 inline-flex items-center gap-2 font-bold text-ASTER-600 hover:gap-3 transition-all">
                Conhecer Ecommerce <ArrowRight size={18} />
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
              {p.image && (
                <div className="relative h-48 sm:h-56 overflow-hidden">
                  <img src={p.image} alt={p.tag} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950/40 to-transparent" />
                </div>
              )}
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
                  <p className="text-[13.5px] text-[#2c1a63] leading-relaxed"><strong>Com a Lis:</strong> {p.lis}</p>
                </div>
                <button onClick={onCta} className="mt-6 inline-flex items-center gap-2 font-bold text-ASTER-600 hover:gap-3 transition-all text-[15px]">
                  {p.cta} <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Payments marquee strip */}
        <div id="solucoes" className="mt-12 bg-ink-950 rounded-[28px] py-8 overflow-hidden relative">
          <p className="text-center text-white/60 font-semibold text-sm uppercase tracking-[0.2em] mb-5 px-4">Meios de pagamento integrados</p>
          <div className="overflow-hidden" style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
            <div className="flex gap-4 w-max animate-marquee-slow">
              {Array.from({ length: 2 }).flatMap((_, rep) =>
                ['Pagamento Online', 'Link de Pagamento', 'Maquininha no Celular', 'Multiadquirentes', 'Boleto', 'Pix'].map((m, i) => (
                  <span key={`${rep}-${i}`} className="bg-white/10 border border-white/15 text-white font-display font-semibold text-sm sm:text-base rounded-2xl px-6 py-3 whitespace-nowrap">
                    {m}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
