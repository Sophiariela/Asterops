import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, FileText, Search, UtensilsCrossed, Layers, Play, Pause, ChevronRight, Check } from 'lucide-react';

// Each tab mirrors a real Luna AI capability implemented in WebOS
// (lunaStrategist.service.ts): recommendTemplate, improveHomepage,
// improveSeo and generateMenuDescriptions — not invented functionality.
const tabs = [
  {
    id: 'templates',
    icon: Layers,
    label: 'Templates',
    title: 'Recomendação do template certo para o seu setor',
    prompt: 'Luna, qual template combina com uma clínica de estética?',
    answer: 'Recomendo o template Med Spa, construído para agendamento de tratamentos com preço e duração. Também ajusto o texto e as seções para o seu negócio.',
    pills: ['Template recomendado', 'Conteúdo ajustado ao setor'],
  },
  {
    id: 'conteudo',
    icon: FileText,
    label: 'Conteúdo',
    title: 'Textos melhores para a sua página inicial',
    prompt: 'Luna, melhore o título da minha página inicial',
    answer: 'Reescrevi o título e o subtítulo da sua home focando no resultado para o seu cliente, não apenas nas suas características — pronto para revisar e aplicar.',
    pills: ['Título sugerido', 'Subtítulo sugerido'],
  },
  {
    id: 'seo',
    icon: Search,
    label: 'SEO',
    title: 'Metadados de SEO para cada página',
    prompt: 'Luna, minhas páginas de serviços não têm SEO',
    answer: 'Gerei título e descrição de SEO para cada página sem essa informação, usando o conteúdo real que você já tem — é só revisar e salvar.',
    pills: ['3 páginas atualizadas', 'Título + descrição por página'],
  },
  {
    id: 'cardapio',
    icon: UtensilsCrossed,
    label: 'Cardápio',
    title: 'Descrições de cardápio para restaurantes',
    prompt: 'Luna, escreva as descrições do meu cardápio',
    answer: 'Escrevi uma descrição curta para cada item sem descrição, baseada no nome e na categoria — sem inventar ingredientes que você não informou.',
    pills: ['Itens sem descrição preenchidos'],
  },
];

export default function LunaSection({ onCta }: { onCta: () => void }) {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setActive((a) => (a + 1) % tabs.length), 6000);
    return () => clearInterval(t);
  }, [playing]);

  const tab = tabs[active];

  return (
    <section id="luna" className="relative bg-ink-950 text-white overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-ASTER-600/30 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-ASTER-800/60 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 dot-grid opacity-[0.15] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-1.5 text-sm font-semibold text-volt-400">
              <Sparkles size={15} /> Luna AI
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight mt-5 text-balance">
              Ajuda real para construir o seu <span className="text-transparent bg-clip-text bg-gradient-to-r from-volt-400 to-mint-400">conteúdo</span>
            </h2>
            <p className="text-white/70 text-base sm:text-lg mt-4 text-balance">
              A Luna sugere o template certo, melhora os textos do seu site e cuida do SEO — você revisa e aplica.
            </p>
          </motion.div>
        </div>

        <div className="mt-10 sm:mt-14 grid lg:grid-cols-[340px_1fr] gap-5 sm:gap-6 items-stretch">
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
                      {i === active ? 'Luna trabalhando…' : 'Aguardando a Luna'}
                    </span>
                  </span>
                </span>
              </button>
            ))}
          </div>

          <div className="relative bg-white/[0.06] border border-white/10 rounded-3xl p-5 sm:p-8 overflow-hidden min-h-[420px] flex flex-col">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-ASTER-400 via-ASTER-600 to-ASTER-800 flex items-center justify-center font-display font-bold text-xl shadow-lg shadow-ASTER-600/40">L</div>
                  <span className="absolute inset-0 rounded-2xl border-2 border-volt-400 animate-pulse-ring" />
                </div>
                <div>
                  <p className="font-display font-bold">Luna</p>
                  <p className="text-xs text-mint-400 font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-mint-400 animate-pulse" /> Disponível no seu painel
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-white/50 mr-1">0{active + 1} de 0{tabs.length}</span>
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
                      <p className="text-[11px] font-bold text-white/60 mb-1">VOCÊ PERGUNTA</p>
                      {tab.prompt}
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="max-w-[90%] bg-white/10 border border-white/10 rounded-2xl rounded-tl-md px-4 py-3 text-sm sm:text-[15px] text-white/90">
                      <p className="text-[11px] font-bold text-volt-400 mb-1 flex items-center gap-1"><Check size={12} /> A LUNA RESPONDE</p>
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
                Ver planos <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
