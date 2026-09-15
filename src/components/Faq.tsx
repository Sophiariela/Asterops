import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Headset } from 'lucide-react';

const faqs = [
  {
    q: 'Como funciona o teste grátis de 30 dias?',
    a: 'Você cria sua conta com CNPJ e CEP de coleta e usa todos os recursos do plano escolhido por 30 dias, sem informar cartão de crédito. Se não gostar, é só não assinar — sem multas ou burocracia.',
  },
  {
    q: 'O que é a Lis, a agente de IA da ASTER?',
    a: 'A Lis é a inteligência artificial integrada ao ecossistema ASTER. Ela analisa pedidos, estoque, vendas e financeiro em tempo real, aponta prioridades, automatiza tarefas como emissão de etiquetas e conciliação, e responde em linguagem natural.',
  },
  {
    q: 'Quais marketplaces posso integrar?',
    a: 'Mercado Livre, Shopee, Amazon, TikTok Shop, Magalu, Shein, Americanas, Netshoes e mais de 170 integrações entre marketplaces, plataformas de ecommerce, logística, pagamentos e contabilidade.',
  },
  {
    q: 'Como funciona a economia de até 50% no frete?',
    a: 'Os Envios da ASTER negociam tabelas corporativas com as principais transportadoras e repassam o desconto para você, sem contrato ou volume mínimo. Você cota, compara e gera etiquetas em segundos, direto do ERP.',
  },
  {
    q: 'Posso emitir notas fiscais pelo sistema?',
    a: 'Sim. NF-e, NFC-e, NFS-e e guias GNRE com emissão em lote, cálculo automático de impostos e atualização para a reforma tributária — tudo integrado aos seus canais de venda.',
  },
  {
    q: 'Existe suporte em português?',
    a: 'Sim! Suporte especializado em português por chat, e-mail e central de ajuda, além de onboarding assistido nos planos Empresas e uma comunidade com mais de 63 mil lojistas.',
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-16 sm:py-24 bg-cream-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-2 bg-white border border-ASTER-200 rounded-full px-4 py-1.5 text-sm font-semibold text-ASTER-700 card-shadow-sm">
            <Headset size={15} /> Ajuda e atendimento
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight text-ink-900 mt-5">
            Perguntas frequentes
          </h2>
        </motion.div>

        <div className="mt-10 space-y-3">
          {faqs.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }}
              className={`bg-white rounded-2xl border transition-colors overflow-hidden ${open === i ? 'border-ASTER-300 card-shadow-sm' : 'border-ASTER-100'}`}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 text-left px-6 py-5"
              >
                <span className="font-display font-bold text-[15px] sm:text-lg text-ink-900">{f.q}</span>
                <span className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all ${open === i ? 'bg-ASTER-600 text-white rotate-45' : 'bg-ASTER-50 text-ASTER-600'}`}>
                  <Plus size={18} />
                </span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="px-6 pb-6 text-slate-600 text-[15px] leading-relaxed">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
