import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Headset } from 'lucide-react';

const faqs = [
  {
    q: 'Como funciona a criação do site?',
    a: 'Você escolhe um template da Biblioteca de Templates (mais de 50 modelos em 7 categorias), preenche as informações do seu negócio e o site já é gerado com a estrutura completa. Depois é só personalizar textos, imagens e cores no editor.',
  },
  {
    q: 'O que é a Luna, a IA da ASTER?',
    a: 'A Luna é a assistente de IA integrada ao WebOS. Ela recomenda o template certo para o seu negócio, sugere melhorias de texto para a página inicial, gera metadados de SEO e escreve descrições de cardápio — você sempre revisa antes de aplicar.',
  },
  {
    q: 'Posso receber reservas e agendamentos pelo site?',
    a: 'Sim. Restaurantes recebem reservas de mesa reais, e negócios de serviço (salões, consultorias, academias) recebem agendamentos por horário disponível, com proteção contra conflito de horários. Cada template usa o fluxo certo para o setor.',
  },
  {
    q: 'Como funciona o pagamento?',
    a: 'A assinatura é cobrada no cartão de crédito ou boleto, mensal ou anual. No plano anual, o desconto já está aplicado no valor total cobrado uma vez por ano.',
  },
  {
    q: 'Posso trocar de plano depois?',
    a: 'Sim, você pode mudar de plano quando o seu negócio precisar de mais recursos, como catálogo de produtos com o CommerceOS.',
  },
  {
    q: 'Existe suporte em português?',
    a: 'Sim, suporte em português por e-mail e chat. Os planos Scale incluem atendimento prioritário e onboarding assistido.',
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
