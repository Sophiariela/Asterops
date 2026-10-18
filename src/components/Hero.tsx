import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, CheckCircle2, Layers, Store, Palette } from 'lucide-react';

export default function Hero({ onCta }: { onCta: () => void }) {
  return (
    <section id="top" className="relative overflow-hidden bg-gradient-to-b from-ASTER-50/80 via-white to-white">
      <div className="absolute inset-0 hero-grid" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-ASTER-200/40 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-40 -right-40 w-[500px] h-[500px] bg-volt-400/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-10 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <button onClick={() => document.getElementById('luna')?.scrollIntoView({ behavior: 'smooth' })} className="inline-flex items-center gap-2 bg-white border border-ASTER-200 rounded-full pl-2 pr-4 py-1.5 text-[13px] sm:text-sm font-semibold text-ASTER-700 card-shadow-sm hover:shadow-md transition-shadow">
            <span className="bg-ASTER-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
              <Sparkles size={12} /> LUNA
            </span>
            A IA que ajuda a construir o seu site
            <ArrowRight size={14} />
          </button>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display font-extrabold text-balance text-ink-900 mt-6 text-4xl sm:text-6xl lg:text-[76px] leading-[1.02] tracking-tight max-w-5xl mx-auto"
        >
          O site profissional do seu negócio, <span className="text-transparent bg-clip-text bg-gradient-to-r from-ASTER-600 to-ASTER-400">pronto hoje</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
          className="text-slate-600 text-base sm:text-xl mt-5 max-w-2xl mx-auto text-balance"
        >
          Mais de 50 modelos prontos para o seu setor, reservas e agendamentos reais, captação de clientes e um catálogo de produtos — tudo em uma plataforma, com a Luna te ajudando a escrever o conteúdo.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8"
        >
          <button onClick={onCta} className="w-full sm:w-auto bg-ASTER-600 hover:bg-ASTER-700 text-white font-bold text-base sm:text-lg px-9 py-4 rounded-full transition-all hover:shadow-xl hover:shadow-ASTER-600/30 hover:-translate-y-0.5 flex items-center justify-center gap-2">
            Ver planos <ArrowRight size={20} />
          </button>
          <button onClick={() => document.getElementById('ecossistema')?.scrollIntoView({ behavior: 'smooth' })} className="w-full sm:w-auto bg-white border-2 border-ASTER-200 hover:border-ASTER-600 text-ASTER-700 font-bold text-base sm:text-lg px-9 py-[14px] rounded-full transition-all flex items-center justify-center gap-2">
            Conhecer a plataforma
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.6 }}
          className="flex items-center justify-center gap-5 mt-6 text-[13px] sm:text-sm text-slate-500 font-medium flex-wrap"
        >
          <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-emerald-500" /> Site publicado em minutos</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-emerald-500" /> Reservas e agendamentos reais</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-emerald-500" /> Sem precisar programar</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.4 }}
          className="relative mt-12 sm:mt-16 max-w-5xl mx-auto"
        >
          <div className="absolute -inset-x-8 top-8 bottom-0 bg-gradient-to-b from-ASTER-200/50 to-transparent blur-2xl rounded-[40px] pointer-events-none" />
          <div className="relative bg-white rounded-2xl sm:rounded-[28px] card-shadow border border-ASTER-100 overflow-hidden text-left">
            <div className="flex items-center gap-2 px-4 sm:px-5 py-3.5 border-b border-slate-100 bg-slate-50/60">
              <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <span className="w-3 h-3 rounded-full bg-[#28c840]" />
              <div className="ml-3 flex-1 max-w-md bg-white border border-slate-200 rounded-full px-4 py-1 text-[12px] text-slate-400 hidden sm:block">app.aster.com/webos/templates</div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px]">
              <div className="p-4 sm:p-7">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <p className="text-[12px] font-semibold text-slate-400 uppercase tracking-wider">Biblioteca de Templates</p>
                    <h3 className="font-display font-bold text-xl sm:text-2xl text-ink-900">Escolha um modelo para o seu setor</h3>
                  </div>
                  <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 text-xs font-bold px-3 py-1.5 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> 52 modelos disponíveis
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-5">
                  {[
                    { label: 'Restaurantes', icon: Store, color: 'text-ASTER-600 bg-ASTER-50' },
                    { label: 'Serviços', icon: Layers, color: 'text-amber-500 bg-amber-50' },
                    { label: 'Beleza', icon: Palette, color: 'text-emerald-500 bg-emerald-50' },
                  ].map((k) => (
                    <div key={k.label} className="bg-slate-50/80 border border-slate-100 rounded-2xl p-2.5 sm:p-4">
                      <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-xl ${k.color} flex items-center justify-center mb-2`}><k.icon size={16} /></div>
                      <p className="text-[11px] sm:text-xs text-slate-500 font-medium truncate">{k.label}</p>
                      <p className="font-display font-bold text-sm sm:text-xl text-ink-900">e mais</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 bg-slate-50/80 border border-slate-100 rounded-2xl p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs sm:text-sm font-bold text-ink-900">Categorias da biblioteca</p>
                    <p className="text-[11px] sm:text-xs text-slate-400 font-medium">7 segmentos</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['Restaurantes', 'Serviços profissionais', 'Beleza e bem-estar', 'Varejo', 'Criadores', 'Educação', 'Serviços locais'].map((c) => (
                      <span key={c} className="text-[11px] sm:text-xs font-semibold bg-white border border-ASTER-100 text-ink-900 rounded-full px-3 py-1.5">{c}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="bg-ink-950 text-white p-4 sm:p-6 flex flex-col relative overflow-hidden">
                <div className="absolute -top-20 -right-20 w-56 h-56 bg-ASTER-600/50 blur-[80px] rounded-full" />
                <div className="relative flex items-center gap-3">
                  <div className="relative">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-ASTER-400 to-ASTER-700 flex items-center justify-center font-display font-bold text-lg">L</div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-mint-400 border-2 border-ink-950" />
                  </div>
                  <div>
                    <p className="font-display font-bold text-sm">Luna</p>
                    <p className="text-[11px] text-white/60">Pronta para ajudar</p>
                  </div>
                </div>
                <div className="relative mt-4 space-y-2.5 text-[12px] sm:text-[13px] flex-1">
                  <div className="bg-white/10 rounded-2xl rounded-tl-md p-3">
                    <p className="text-white/90">Olá! Posso recomendar um template para o seu negócio e já deixar o conteúdo pronto. O que você vende?</p>
                  </div>
                  <div className="bg-ASTER-600/40 border border-ASTER-500/40 rounded-xl p-2.5 flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-volt-400 shrink-0" />
                    <span className="text-white/90">Recomendação de template por setor</span>
                  </div>
                  <div className="bg-ASTER-600/40 border border-ASTER-500/40 rounded-xl p-2.5 flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-volt-400 shrink-0" />
                    <span className="text-white/90">Sugestões de título e descrição</span>
                  </div>
                </div>
                <button onClick={onCta} className="relative mt-4 w-full bg-volt-400 hover:bg-volt-300 text-ink-950 font-bold text-sm py-2.5 rounded-xl transition-colors">
                  Ver planos
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
