import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Star } from 'lucide-react';

const segments = [
  { name: 'Moda', img: '/images/moda.jpg', desc: 'Grade, variação e coleções' },
  { name: 'Cosméticos', img: '/images/cosmeticos.jpg', desc: 'Kits, validade e ANVISA' },
  { name: 'Autopeças', img: '/images/autopecas.jpg', desc: 'Compatibilidade e catálogo' },
  { name: 'Casa e decoração', img: '/images/casa.jpg', desc: 'Volumes, montagem e entrega' },
  { name: 'Celular e acessórios', img: '/images/celular.jpg', desc: 'IMEI, garantia e séries' },
  { name: 'Construção', img: '/images/construcao.jpg', desc: 'Orçamentos e multi-unidades' },
];

export default function Segments({ onCta }: { onCta: () => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const scroll = (dir: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 340, behavior: 'smooth' });
  };

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 10);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
  };

  return (
    <section className="py-16 sm:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6"
        >
          <div className="max-w-2xl">
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight text-ink-900 text-balance">
              Não importa o seu segmento, a ASTER é a parceira ideal
            </h2>
            <p className="text-slate-600 text-base sm:text-lg mt-4">Recursos pensados para a realidade de cada operação.</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onCta}
              className="hidden sm:inline-flex bg-ASTER-600 hover:bg-ASTER-700 text-white font-bold px-7 py-3.5 rounded-full transition-all hover:shadow-lg hover:shadow-ASTER-600/30 items-center gap-2"
            >
              Teste grátis 30 dias <ArrowRight size={18} />
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => scroll(-1)}
                disabled={!canLeft}
                className="w-12 h-12 rounded-full border-2 border-ASTER-100 flex items-center justify-center text-ASTER-600 hover:border-ASTER-600 transition-colors disabled:opacity-30"
                aria-label="Anterior"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => scroll(1)}
                disabled={!canRight}
                className="w-12 h-12 rounded-full border-2 border-ASTER-100 flex items-center justify-center text-ASTER-600 hover:border-ASTER-600 transition-colors disabled:opacity-30"
                aria-label="Próximo"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="mt-10 flex gap-5 overflow-x-auto no-scrollbar snap-x snap-mandatory px-4 sm:px-6 lg:px-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] pb-2"
      >
        {segments.map((s, i) => (
          <motion.button
            key={s.name}
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: Math.min(i * 0.07, 0.3) }}
            onClick={onCta}
            className="group relative shrink-0 w-[270px] sm:w-[320px] h-[400px] sm:h-[440px] rounded-[26px] overflow-hidden snap-start text-left"
          >
            <img src={s.img} alt={s.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <div className="flex items-center gap-1 mb-2">
                {Array.from({ length: 5 }).map((_, st) => (
                  <Star key={st} size={13} className="fill-volt-400 text-volt-400" />
                ))}
              </div>
              <h3 className="font-display font-extrabold text-white text-2xl">{s.name}</h3>
              <p className="text-white/70 text-sm mt-1">{s.desc}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-volt-400 font-bold text-sm group-hover:gap-3 transition-all">
                Explorar segmento <ArrowRight size={16} />
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 sm:hidden">
        <button onClick={onCta} className="w-full bg-ASTER-600 text-white font-bold px-7 py-4 rounded-full flex items-center justify-center gap-2">
          Teste grátis 30 dias <ArrowRight size={18} />
        </button>
      </div>
    </section>
  );
}
