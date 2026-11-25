import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, FileText, Search, UtensilsCrossed, Layers, Play, Pause, ChevronRight, ArrowRight, Check } from 'lucide-react';

/**
 * Demonstração da Luna.
 *
 * Cada aba espelha uma capacidade que existe de verdade no WebOS
 * (lunaStrategist.service.ts): recommendTemplate, improveHomepage,
 * improveSeo e generateMenuDescriptions. Nada de funcionalidade inventada.
 *
 * Os exemplos são pré-definidos e estão rotulados como demonstração — o
 * componente não afirma estar gerando conteúdo em tempo real, porque não
 * está. O "antes" e o "depois" são o que torna o resultado compreensível
 * sem precisar de prova inventada.
 */
const tabs = [
  {
    id: 'templates',
    icon: Layers,
    label: 'Templates',
    /** Substitui o antigo "Aguardando a Luna": diz o que a aba faz. */
    summary: 'Escolhe o modelo do setor',
    title: 'Recomendação do template certo para o seu setor',
    prompt: 'Luna, qual template combina com uma clínica de estética?',
    answer:
      'Recomendo o template Med Spa, construído para agendamento de tratamentos com preço e duração. Também ajusto o texto e as seções para o seu negócio.',
    beforeLabel: 'Sem recomendação',
    before: 'Biblioteca com 52 modelos e nenhuma pista de qual serve para uma clínica de estética.',
    afterLabel: 'Template Med Spa',
    after:
      'Modelo com agenda de tratamentos, preço e duração por serviço, e seções de equipe e depoimentos.',
    result: 'Você começa de um modelo do seu setor em vez de uma página em branco.',
    pills: ['Template recomendado', 'Conteúdo ajustado ao setor'],
  },
  {
    id: 'conteudo',
    icon: FileText,
    label: 'Conteúdo',
    summary: 'Reescreve o título da home',
    title: 'Textos melhores para a sua página inicial',
    prompt: 'Luna, melhore o título da minha página inicial',
    answer:
      'Reescrevi o título e o subtítulo da sua home focando no resultado para o seu cliente, não apenas nas suas características — pronto para revisar e aplicar.',
    beforeLabel: 'Título atual',
    before: 'Bem-vindo ao nosso site',
    afterLabel: 'Sugestão da Luna',
    after: 'Tratamentos de estética com hora marcada, no centro de Salvador',
    result: 'O visitante entende o que você faz e onde, já na primeira linha.',
    pills: ['Título sugerido', 'Subtítulo sugerido'],
  },
  {
    id: 'seo',
    icon: Search,
    label: 'SEO',
    summary: 'Preenche título e descrição',
    title: 'Metadados de SEO para cada página',
    prompt: 'Luna, minhas páginas de serviços não têm SEO',
    answer:
      'Gerei título e descrição de SEO para cada página sem essa informação, usando o conteúdo real que você já tem — é só revisar e salvar.',
    beforeLabel: 'Meta description atual',
    before: '(vazia — o buscador mostra um trecho qualquer da página)',
    afterLabel: 'Sugestão da Luna',
    after:
      'Limpeza de pele, peeling e microagulhamento com avaliação inicial. Agende online na clínica em Salvador.',
    result: '3 páginas de serviço deixam de aparecer sem descrição na busca.',
    pills: ['3 páginas atualizadas', 'Título + descrição por página'],
  },
  {
    id: 'cardapio',
    icon: UtensilsCrossed,
    label: 'Cardápio',
    summary: 'Descreve itens sem texto',
    title: 'Descrições de cardápio para restaurantes',
    prompt: 'Luna, escreva as descrições do meu cardápio',
    answer:
      'Escrevi uma descrição curta para cada item sem descrição, baseada no nome e na categoria — sem inventar ingredientes que você não informou.',
    beforeLabel: 'Item sem descrição',
    before: 'Moqueca de camarão — R$ 89,00',
    afterLabel: 'Sugestão da Luna',
    after:
      'Moqueca de camarão — R$ 89,00. Prato quente da casa, servido na panela de barro, para duas pessoas.',
    result: 'O cardápio fica legível para quem nunca comeu no seu restaurante.',
    pills: ['Itens sem descrição preenchidos'],
  },
];

const ROTATION_MS = 6000;

export default function LunaSection() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hovering, setHovering] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Rotação automática, pausada no hover e quando o visitante pausa.
  useEffect(() => {
    if (!playing || hovering) return;
    const t = setInterval(() => setActive((a) => (a + 1) % tabs.length), ROTATION_MS);
    return () => clearInterval(t);
  }, [playing, hovering]);

  /** Setas, Home e End navegam entre as abas, como manda o padrão ARIA. */
  const onKeyDown = useCallback((event: React.KeyboardEvent, index: number) => {
    const last = tabs.length - 1;
    let next: number | null = null;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = index === last ? 0 : index + 1;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = index === 0 ? last : index - 1;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = last;
    if (next === null) return;
    event.preventDefault();
    setActive(next);
    setPlaying(false); // navegação manual assume o controle
    tabRefs.current[next]?.focus();
  }, []);

  const tab = tabs[active];

  return (
    <section id="luna" className="relative bg-ink-950 text-white overflow-hidden scroll-mt-32">
      <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-ASTER-600/30 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-ASTER-800/60 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 dot-grid opacity-[0.15] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-1.5 text-sm font-semibold text-volt-400">
            <Sparkles size={15} aria-hidden="true" /> Luna AI
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight mt-5 text-balance">
            Ajuda real para construir o seu{' '}
            <span className="text-volt-400">conteúdo</span>
          </h2>
          <p className="text-white/80 text-base sm:text-lg mt-4 text-balance">
            A Luna sugere o template certo, melhora os textos do seu site e cuida do SEO — você
            revisa e aplica.
          </p>
        </div>

        <div
          className="mt-10 sm:mt-14 grid lg:grid-cols-[340px_1fr] gap-5 sm:gap-6 items-stretch"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          <div
            role="tablist"
            aria-label="Exemplos do que a Luna faz"
            aria-orientation="vertical"
            className="grid grid-cols-2 lg:grid-cols-1 gap-3"
          >
            {tabs.map((t, i) => (
              <button
                key={t.id}
                ref={(el) => { tabRefs.current[i] = el; }}
                role="tab"
                id={`luna-tab-${t.id}`}
                aria-selected={i === active}
                aria-controls="luna-panel"
                tabIndex={i === active ? 0 : -1}
                onClick={() => { setActive(i); setPlaying(false); }}
                onKeyDown={(e) => onKeyDown(e, i)}
                className={`relative text-left rounded-2xl p-4 sm:p-5 border transition-all overflow-hidden focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-volt-400/60 ${
                  i === active
                    ? 'bg-white text-ink-950 border-white card-shadow'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 text-white'
                }`}
              >
                {i === active && playing && !hovering && (
                  <motion.span
                    key={active}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: ROTATION_MS / 1000, ease: 'linear' }}
                    className="absolute top-0 left-0 h-1 w-full origin-left bg-gradient-to-r from-ASTER-600 to-volt-500"
                    aria-hidden="true"
                  />
                )}
                <span className="flex items-center gap-3">
                  <span className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${i === active ? 'bg-ASTER-600 text-white' : 'bg-white/10 text-volt-400'}`}>
                    <t.icon size={19} aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block font-display font-bold text-[15px] sm:text-base">
                      0{i + 1} · {t.label}
                    </span>
                    <span className={`hidden sm:block text-[13px] mt-0.5 ${i === active ? 'text-slate-600' : 'text-white/70'}`}>
                      {t.summary}
                    </span>
                  </span>
                </span>
              </button>
            ))}
          </div>

          <div
            id="luna-panel"
            role="tabpanel"
            aria-labelledby={`luna-tab-${tab.id}`}
            tabIndex={0}
            className="relative bg-white/[0.06] border border-white/10 rounded-3xl p-5 sm:p-8 overflow-hidden min-h-[420px] flex flex-col focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-volt-400/40"
          >
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-ASTER-400 via-ASTER-600 to-ASTER-800 flex items-center justify-center font-display font-bold text-xl shadow-lg shadow-ASTER-600/40" aria-hidden="true">L</div>
                </div>
                <div>
                  <p className="font-display font-bold">Luna</p>
                  {/* Rótulo honesto: exemplo pré-definido, não geração ao vivo. */}
                  <p className="text-xs text-white/70 font-semibold">
                    Demonstração · exemplos pré-definidos
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-white/70 mr-1">
                  0{active + 1} de 0{tabs.length}
                </span>
                <button
                  onClick={() => setPlaying(!playing)}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-volt-400/60"
                  aria-label={playing ? 'Pausar a troca automática de exemplos' : 'Retomar a troca automática de exemplos'}
                >
                  {playing ? <Pause size={16} aria-hidden="true" /> : <Play size={16} className="ml-0.5" aria-hidden="true" />}
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={tab.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="flex-1 flex flex-col mt-6"
              >
                <h3 className="font-display font-bold text-lg sm:text-2xl text-balance">{tab.title}</h3>

                <div className="mt-5 space-y-3">
                  <div className="flex justify-end">
                    <div className="max-w-[85%] bg-ASTER-600 rounded-2xl rounded-tr-md px-4 py-3 text-sm sm:text-[15px]">
                      <p className="text-[11px] font-bold text-white/80 mb-1">VOCÊ PERGUNTA</p>
                      {tab.prompt}
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="max-w-[90%] bg-white/10 border border-white/10 rounded-2xl rounded-tl-md px-4 py-3 text-sm sm:text-[15px] text-white/90">
                      <p className="text-[11px] font-bold text-volt-400 mb-1 flex items-center gap-1">
                        <Check size={12} aria-hidden="true" /> A LUNA RESPONDE
                      </p>
                      {tab.answer}
                    </div>
                  </div>
                </div>

                {/* Antes e depois: é o que deixa o resultado concreto. */}
                <div className="mt-5 grid sm:grid-cols-[1fr_auto_1fr] gap-3 sm:gap-4 items-stretch">
                  <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-white/60">
                      {tab.beforeLabel}
                    </p>
                    <p className="text-sm text-white/75 mt-2 leading-relaxed">{tab.before}</p>
                  </div>
                  <div className="hidden sm:flex items-center justify-center text-volt-400" aria-hidden="true">
                    <ArrowRight size={20} />
                  </div>
                  <div className="bg-volt-400/10 border border-volt-400/30 rounded-2xl p-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-volt-400">
                      {tab.afterLabel}
                    </p>
                    <p className="text-sm text-white mt-2 leading-relaxed">{tab.after}</p>
                  </div>
                </div>

                <p className="mt-4 text-sm text-white/80 flex items-start gap-2">
                  <Check size={16} className="text-mint-400 shrink-0 mt-0.5" aria-hidden="true" />
                  {tab.result}
                </p>

                <div className="flex flex-wrap gap-2 mt-5">
                  {tab.pills.map((p) => (
                    <span
                      key={p}
                      className="text-xs sm:text-[13px] font-semibold bg-volt-400/15 text-volt-300 border border-volt-400/25 rounded-full px-3.5 py-1.5 flex items-center gap-1.5"
                    >
                      <Check size={13} aria-hidden="true" /> {p}
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-6">
              {/* CTA contextual: leva à página da Luna, não aos planos. */}
              <Link
                to="/products/luna-ai"
                className="w-full bg-volt-400 hover:bg-volt-300 text-ink-950 font-bold px-6 py-3.5 rounded-full transition-all hover:shadow-lg hover:shadow-volt-400/20 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-volt-400/60"
              >
                Testar a Luna <ChevronRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
