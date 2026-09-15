import { useState } from 'react';
import { motion } from 'framer-motion';
import { Quote, ArrowRight, ArrowUpRight, Play, TrendingUp, Package, BadgeCheck } from 'lucide-react';

const cases = [
  {
    quote: 'Sempre acreditei que estaríamos melhor atendidos se usássemos todos os produtos de uma só empresa, pela maior facilidade de conversação entre as soluções.',
    name: 'Diego Costa',
    role: 'Tudo para Moto · Autopeças',
    img: '/images/case-diego.jpg',
    metric: '+212%',
    metricLabel: 'de crescimento em 1 ano',
  },
  {
    quote: 'Saímos de 3 sistemas diferentes para um só. A conciliação que levava 2 dias hoje acontece sozinha, e a Lis ainda aponta onde estamos perdendo margem.',
    name: 'Camila Rodrigues',
    role: 'Bella Cosméticos · Beleza',
    img: '/images/cosmeticos.jpg',
    metric: '-78%',
    metricLabel: 'no tempo de fechamento',
  },
  {
    quote: 'Com os Envios da ASTER, o frete deixou de ser motivo de abandono de carrinho. Economizamos 46% na logística e dobramos a conversão.',
    name: 'Rafael Mendes',
    role: 'Urban Store · Moda',
    img: '/images/moda.jpg',
    metric: '-46%',
    metricLabel: 'no custo de frete',
  },
];

const stats = [
  { icon: BadgeCheck, value: '+63 mil', label: 'clientes' },
  { icon: Package, value: '+170 mil', label: 'vendas por hora' },
  { icon: TrendingUp, value: '+194 mi', label: 'de NFs geradas em 2025' },
];

export default function Cases({ onCta }: { onCta: () => void }) {
  const [active, setActive] = useState(0);
  const c = cases[active];

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-white to-ASTER-50/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto"
        >
          <span className="inline-flex items-center gap-2 bg-volt-400/30 border border-volt-500/30 rounded-full px-4 py-1.5 text-sm font-bold text-ASTER-800">
            Cases de sucesso
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight text-ink-900 mt-5">
            Histórias reais de quem cresce com a ASTER
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="mt-10 sm:mt-12 bg-white rounded-[28px] card-shadow border border-ASTER-100 overflow-hidden grid lg:grid-cols-2"
        >
          <div className="relative min-h-[280px] lg:min-h-[480px]">
            <motion.img
              key={c.img}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              src={c.img}
              alt={c.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 via-transparent to-transparent" />
            <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group" aria-label="Assistir depoimento">
              <span className="absolute inset-0 rounded-full bg-white/40 animate-pulse-ring" />
              <span className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white flex items-center justify-center group-hover:scale-110 transition-transform card-shadow">
                <Play size={26} className="text-ASTER-600 ml-1" fill="currentColor" />
              </span>
            </button>
            <div className="absolute bottom-5 left-5 right-5 sm:bottom-7 sm:left-7 flex items-end justify-between gap-4">
              <div className="bg-volt-400 rounded-2xl px-5 py-3.5 card-shadow">
                <p className="font-display font-extrabold text-ink-950 text-2xl sm:text-3xl leading-none">{c.metric}</p>
                <p className="text-ink-950/70 text-xs sm:text-sm font-semibold mt-1">{c.metricLabel}</p>
              </div>
            </div>
          </div>

          <div className="p-7 sm:p-10 lg:p-12 flex flex-col justify-center">
            <Quote size={40} className="text-ASTER-200" fill="currentColor" />
            <motion.blockquote
              key={c.quote}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
              className="font-display font-semibold text-lg sm:text-2xl text-ink-900 leading-snug mt-4 text-balance"
            >
              “{c.quote}”
            </motion.blockquote>
            <p className="mt-5 font-bold text-ASTER-700">{c.name}</p>
            <p className="text-sm text-slate-500">{c.role}</p>

            <div className="flex gap-2 mt-7">
              {cases.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  aria-label={`Case ${i + 1}`}
                  className={`h-2 rounded-full transition-all ${i === active ? 'w-10 bg-ASTER-600' : 'w-2 bg-ASTER-100 hover:bg-ASTER-300'}`}
                />
              ))}
            </div>

            <div className="flex flex-wrap gap-3 mt-7">
              <button onClick={onCta} className="inline-flex items-center gap-2 bg-ASTER-600 hover:bg-ASTER-700 text-white font-bold px-6 py-3 rounded-full transition-all text-[15px]">
                Conheça a história <ArrowRight size={17} />
              </button>
              <button onClick={onCta} className="inline-flex items-center gap-2 font-bold text-ASTER-700 hover:text-ASTER-600 px-4 py-3 transition-colors text-[15px]">
                Ver mais <ArrowUpRight size={17} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="mt-10 bg-ink-950 rounded-[28px] p-8 sm:p-12 relative overflow-hidden"
        >
          <div className="absolute -top-32 left-1/3 w-[500px] h-[300px] bg-ASTER-600/40 blur-[120px] rounded-full pointer-events-none" />
          <div className="relative text-center">
            <h3 className="font-display font-extrabold text-white text-2xl sm:text-4xl text-balance">
              Negócios que vão longe <span className="text-volt-400">não vão sozinhos</span>
            </h3>
            <p className="text-white/60 mt-3 text-[15px] sm:text-lg">Conte com a ASTER, a parceira nº 1 do empreendedor, para chegar lá.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-9 max-w-3xl mx-auto">
              {stats.map((s) => (
                <div key={s.label} className="bg-white/[0.07] border border-white/10 rounded-3xl p-6">
                  <s.icon size={26} className="text-volt-400 mx-auto" />
                  <p className="font-display font-extrabold text-white text-3xl sm:text-4xl mt-3">{s.value}</p>
                  <p className="text-white/60 text-sm mt-1 font-medium">{s.label}</p>
                </div>
              ))}
            </div>
            <button onClick={onCta} className="mt-9 bg-volt-400 hover:bg-volt-300 text-ink-950 font-bold text-base sm:text-lg px-10 py-4 rounded-full transition-all hover:shadow-xl hover:shadow-volt-400/20 hover:-translate-y-0.5 inline-flex items-center gap-2">
              Comece agora com a ASTER <ArrowRight size={20} />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
