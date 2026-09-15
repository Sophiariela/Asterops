import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, Package, BrainCircuit, ShoppingCart, Landmark, Play, Pause, ChevronRight, Check } from 'lucide-react';

const tabs = [
  {
    id: 'operacao',
    icon: Package,
    label: 'Operação',
    title: 'Pedidos, estoque e expedição no mesmo ritmo',
    prompt: 'Lis, quais pedidos precisam sair primeiro hoje?',
    answer: 'Separei 12 pedidos prioritários por prazo de entrega. Já gerei as etiquetas com o menor frete e reservei o estoque. É só conferir e despachar.',
    pills: ['12 etiquetas geradas', 'Estoque reservado', 'Romaneio pronto'],
  },
  {
    id: 'inteligencia',
    icon: BrainCircuit,
    label: 'Inteligência',
    title: 'Riscos e oportunidades antes de virarem surpresa',
    prompt: 'Como estão minhas margens este mês?',
    answer: 'Sua margem média subiu para 34,2%. Detectei 3 produtos com margem abaixo de 15% e uma oportunidade: o Kit Skincare vende 2,4x mais às sextas. Quer que eu programe uma campanha?',
    pills: ['Margem +3,1 p.p.', '3 alertas de preço', '1 oportunidade'],
  },
  {
    id: 'vendas',
    icon: ShoppingCart,
    label: 'Vendas',
    title: 'Canais conectados para você vender mais',
    prompt: 'Crie um anúncio para o TikTok Shop',
    answer: 'Anúncio criado a partir do seu catálogo: título otimizado, descrição com SEO e preço com margem protegida. Já publiquei no TikTok Shop e na Shopee.',
    pills: ['2 canais publicados', 'SEO otimizado', 'Preço protegido'],
  },
  {
    id: 'financeiro',
    icon: Landmark,
    label: 'Financeiro',
    title: 'Notas, recebimentos e conciliação em dia',
    prompt: 'Concilie os recebimentos da semana',
    answer: 'Conciliação concluída: 486 lançamentos batidos, 6 divergências encontradas e 2 boletos vencendo amanhã. Preparei o fluxo de caixa projetado dos próximos 30 dias.',
    pills: ['486 lançamentos', '6 divergências', 'Fluxo projetado'],
  },
];

export default function LisSection({ onCta }: { onCta: () => void }) {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setActive((a) => (a + 1) % tabs.length), 6000);
    return () => clearInterval(t);
  }, [playing]);

  const tab = tabs[active];

  return (
    <section id="lis" className="relative bg-ink-950 text-white overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-ASTER-600/30 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-ASTER-800/60 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 dot-grid opacity-[0.15] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-1.5 text-sm font-semibold text-volt-400">
              <Sparkles size={15} /> Lis da ASTER
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight mt-5 text-balance">
              Não use seu ERP. <span className="text-transparent bg-clip-text bg-gradient-to-r from-volt-400 to-mint-400">Comande.</span>
            </h2>
            <p className="text-white/70 text-base sm:text-lg mt-4 text-balance">
              A Lis entende o seu negócio, aciona as soluções certas e transforma dados em ações.
            </p>
          </motion.div>
        </div>

        <div className="mt-10 sm:mt-14 grid lg:grid-cols-[340px_1fr] gap-5 sm:gap-6 items-stretch">
          {/* Tab list */}
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
            {tabs.map((t, i) => (
              <button
                key={t.id}
                onClick={() => setActive(i)}
                className={`relative text-left rounded-2xl p-4 sm:p-5 border transition-all overflow-hidden ${
                  i === active
                    ? 'bg-white text-ink-950 border-white card-shadow'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 text-white'
                }`}
              >
                {i === active && playing && (
                  <motion.span
                    key={active}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 6, ease: 'linear' }}
                    className="absolute top-0 left-0 h-1 w-full origin-left bg-gradient-to-r from-ASTER-600 to-volt-500"
                  />
                )}
                <span className="flex items-center gap-3">
                  <span className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${i === active ? 'bg-ASTER-600 text-white' : 'bg-white/10 text-volt-400'}`}>
                    <t.icon size={19} />
                  </span>
                  <span>
                    <span className="block font-display font-bold text-[15px] sm:text-base">0{i + 1} · {t.label}</span>
                    <span className={`hidden sm:block text-[13px] mt-0.5 ${i === active ? 'text-slate-500' : 'text-white/50'}`}>
                      {i === active ? 'Lis trabalhando…' : 'Aguardando a Lis'}
                    </span>
                  </span>
                </span>
              </button>
            ))}
          </div>

          {/* Chat panel */}
          <div className="relative bg-white/[0.06] border border-white/10 rounded-3xl p-5 sm:p-8 overflow-hidden min-h-[420px] flex flex-col">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-ASTER-400 via-ASTER-600 to-ASTER-800 flex items-center justify-center font-display font-bold text-xl shadow-lg shadow-ASTER-600/40">L</div>
                  <span className="absolute inset-0 rounded-2xl border-2 border-volt-400 animate-pulse-ring" />
                </div>
                <div>
                  <p className="font-display font-bold">Lis</p>
                  <p className="text-xs text-mint-400 font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-mint-400 animate-pulse" /> Online agora
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-white/50 mr-1">0{active + 1} de 04</span>
                <button
                  onClick={() => setPlaying(!playing)}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center transition-colors"
                  aria-label={playing ? 'Pausar' : 'Reproduzir'}
                >
                  {playing ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={tab.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
                className="flex-1 flex flex-col mt-6"
              >
                <h3 className="font-display font-bold text-lg sm:text-2xl text-balance">{tab.title}</h3>
                <div className="mt-5 space-y-4 flex-1">
                  <div className="flex justify-end">
                    <div className="max-w-[85%] bg-ASTER-600 rounded-2xl rounded-tr-md px-4 py-3 text-sm sm:text-[15px]">
                      <p className="text-[11px] font-bold text-white/60 mb-1">VOCÊ PEDE</p>
                      {tab.prompt}
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="max-w-[90%] bg-white/10 border border-white/10 rounded-2xl rounded-tl-md px-4 py-3 text-sm sm:text-[15px] text-white/90">
                      <p className="text-[11px] font-bold text-volt-400 mb-1 flex items-center gap-1"><Check size={12} /> A LIS ENTREGA</p>
                      {tab.answer}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-5">
                  {tab.pills.map((p) => (
                    <span key={p} className="text-xs sm:text-[13px] font-semibold bg-volt-400/15 text-volt-400 border border-volt-400/25 rounded-full px-3.5 py-1.5 flex items-center gap-1.5">
                      <Check size={13} /> {p}
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button onClick={onCta} className="flex-1 bg-volt-400 hover:bg-volt-300 text-ink-950 font-bold px-6 py-3.5 rounded-full transition-all hover:shadow-lg hover:shadow-volt-400/20 flex items-center justify-center gap-2">
                Ver a Lis funcionando <ChevronRight size={18} />
              </button>
              <button onClick={onCta} className="flex-1 sm:flex-none bg-white/10 hover:bg-white/15 border border-white/15 font-bold px-6 py-3.5 rounded-full transition-colors">
                Comece agora
              </button>
            </div>
          </div>
        </div>

        {/* Trust strip */}
        <div className="mt-12 sm:mt-16 text-center">
          <p className="text-white/50 font-semibold text-sm sm:text-base">Mais de <span className="text-white font-display font-bold text-lg sm:text-xl">63 mil clientes</span> confiam na ASTER</p>
          <div className="flex items-center justify-center gap-1.5 mt-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg key={i} width="20" height="20" viewBox="0 0 20 20" fill="#D8FF3E"><path d="M10 1.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L10 14.9l-5.3 2.7 1-5.8L1.5 7.7l5.9-.9z" /></svg>
            ))}
            <span className="text-white/60 text-sm ml-2 font-medium">4.9/5 em satisfação</span>
          </div>
        </div>
      </div>
    </section>
  );
}
