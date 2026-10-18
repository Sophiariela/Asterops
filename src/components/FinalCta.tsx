import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

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
                <Sparkles size={15} className="text-volt-400" /> Mais de 50 templates prontos
              </span>
              <h2 className="font-display font-extrabold text-white text-3xl sm:text-5xl tracking-tight mt-5 leading-[1.05] text-balance">
                Pronto para ter o site que o seu negócio merece?
              </h2>
              <p className="text-white/75 text-base sm:text-lg mt-4">
                Escolha um template, personalize e publique — com a Luna te ajudando no conteúdo.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <button onClick={onCta} className="bg-volt-400 hover:bg-volt-300 text-ink-950 font-bold text-base sm:text-lg px-9 py-4 rounded-full transition-all hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2">
                  Ver planos <ArrowRight size={20} />
                </button>
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-2 mt-6 text-sm text-white/80 font-medium">
                <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-volt-400" /> Sem precisar programar</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-volt-400" /> Reservas e agendamentos reais</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-volt-400" /> Suporte em português</span>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="relative rounded-3xl overflow-hidden card-shadow bg-ink-950/40 border border-white/15 p-8 flex flex-col justify-center min-h-[420px]">
                <div className="space-y-3">
                  {['Restaurantes & Hospitalidade', 'Serviços Profissionais', 'Beleza & Bem-estar', 'Varejo & Ecommerce', 'Criativos & Marca Pessoal', 'Educação', 'Serviços Locais'].map((c) => (
                    <div key={c} className="bg-white/10 border border-white/15 rounded-2xl px-5 py-3.5 text-white font-semibold text-sm sm:text-base flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-volt-400 shrink-0" />
                      {c}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
