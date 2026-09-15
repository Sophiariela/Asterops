import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Truck } from 'lucide-react';

export default function FinalCta({ onCta }: { onCta: () => void }) {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="relative bg-gradient-to-br from-ASTER-700 via-ASTER-600 to-ASTER-500 rounded-[32px] overflow-hidden"
        >
          <div className="absolute inset-0 hero-grid opacity-60" style={{ filter: 'invert(1)' }} />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-volt-400/25 blur-[100px] rounded-full" />
          <div className="absolute -bottom-32 -left-16 w-96 h-96 bg-ink-950/40 blur-[100px] rounded-full" />

          <div className="relative grid lg:grid-cols-2 gap-8 items-center p-8 sm:p-12 lg:p-16">
            <div>
              <span className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-4 py-1.5 text-sm font-bold text-white">
                <Truck size={15} className="text-volt-400" /> Envios com até 50% off
              </span>
              <h2 className="font-display font-extrabold text-white text-3xl sm:text-5xl tracking-tight mt-5 leading-[1.05] text-balance">
                Pronto para vender mais e trabalhar menos?
              </h2>
              <p className="text-white/75 text-base sm:text-lg mt-4">
                Junte-se a mais de 63 mil lojistas que comandam a operação com a ASTER e a Lis.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <button onClick={onCta} className="bg-volt-400 hover:bg-volt-300 text-ink-950 font-bold text-base sm:text-lg px-9 py-4 rounded-full transition-all hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2">
                  Criar conta grátis <ArrowRight size={20} />
                </button>
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-2 mt-6 text-sm text-white/80 font-medium">
                <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-volt-400" /> 30 dias grátis</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-volt-400" /> Sem cartão de crédito</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-volt-400" /> Migração assistida</span>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="relative rounded-3xl overflow-hidden card-shadow rotate-2 hover:rotate-0 transition-transform duration-500">
                <img src="/images/lojista.jpg" alt="Lojista usando ASTER" className="w-full h-[420px] object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-ASTER-400 to-ASTER-700 flex items-center justify-center font-display font-bold text-white text-xl shrink-0">L</div>
                  <div>
                    <p className="text-sm font-bold text-ink-900">“Faturei 3x mais no primeiro trimestre.”</p>
                    <p className="text-xs text-slate-500 mt-0.5">Mariana Lopes · ML Store · cliente desde 2023</p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-5 -left-5 bg-white rounded-2xl card-shadow px-5 py-3.5 -rotate-3 animate-float">
                <p className="text-[11px] font-bold text-emerald-500">RECEITA DO MÊS</p>
                <p className="font-display font-extrabold text-ink-900 text-xl">R$ 284.900</p>
                <p className="text-[11px] font-bold text-emerald-500">▲ +32% vs. mês anterior</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
