import { MessageCircle, Plug, Code2, ArrowRight } from 'lucide-react';
import { contactHref, CONTACT_EMAIL, WHATSAPP_URL } from '../config/site';

/**
 * "Precisa de algo além de um site?"
 *
 * Três frentes de serviço sob medida, logo antes da FAQ. O CTA usa o
 * contato central de config/site.ts: WhatsApp quando houver, senão e-mail.
 * Se nenhum dos dois estiver confirmado, o botão NÃO é renderizado — nada
 * de link decorativo apontando para "#".
 */
const services = [
  {
    icon: MessageCircle,
    title: 'Automações de atendimento e WhatsApp',
    description:
      'Automação de comunicação, atendimento e fluxos de relacionamento com clientes.',
  },
  {
    icon: Plug,
    title: 'Integrações entre sistemas',
    description:
      'Conecte ferramentas, APIs e plataformas para reduzir tarefas manuais e organizar informações.',
  },
  {
    icon: Code2,
    title: 'Software sob medida',
    description:
      'Desenvolvimento de sistemas, dashboards e aplicações personalizados para as necessidades da sua operação.',
  },
];

export default function CustomServices() {
  const href = contactHref();
  const isWhatsApp = Boolean(WHATSAPP_URL);

  return (
    <section id="servicos" className="scroll-mt-32 py-10 sm:py-24 bg-cream-50 border-y border-ASTER-100/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-ASTER-700">
            Serviços sob medida
          </p>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-ink-900 mt-2 tracking-tight text-balance">
            Precisa de algo além de um site?
          </h2>
          <p className="text-slate-600 text-[15px] sm:text-lg mt-3 leading-relaxed">
            Quando a operação pede mais do que a plataforma entrega pronta, a equipe da ASTER
            desenvolve sob medida.
          </p>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6 mt-8 sm:mt-14">
          {services.map((service) => (
            <li
              key={service.title}
              className="flex flex-row md:flex-col items-start gap-4 md:gap-0 bg-white border border-ASTER-100 rounded-2xl md:rounded-[26px] p-4 sm:p-7 card-shadow-sm"
            >
              <span className="w-11 h-11 md:w-12 md:h-12 shrink-0 rounded-2xl bg-ASTER-50 text-ASTER-700 flex items-center justify-center">
                <service.icon size={22} aria-hidden="true" />
              </span>
              <div className="min-w-0"><h3 className="font-display font-extrabold text-base sm:text-xl text-ink-900 md:mt-5">
                {service.title}
              </h3>
              <p className="text-slate-600 text-[13px] sm:text-[15px] leading-relaxed mt-1 md:mt-3">
                {service.description}
              </p></div>
            </li>
          ))}
        </ul>

        {href ? (
          <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-4">
            <a
              href={href}
              {...(isWhatsApp ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="inline-flex items-center justify-center gap-2 bg-ASTER-600 hover:bg-ASTER-700 text-white font-bold text-base px-8 py-4 rounded-full transition-all hover:shadow-lg hover:shadow-ASTER-600/30 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ASTER-600/40"
            >
              Falar com a equipe
              <ArrowRight size={18} aria-hidden="true" />
            </a>
            <p className="text-sm text-slate-600">
              {isWhatsApp ? 'Resposta pelo WhatsApp em horário comercial.' : `Escreva para ${CONTACT_EMAIL}.`}
            </p>
          </div>
        ) : (
          /*
           * Sem WHATSAPP_URL e sem CONTACT_EMAIL confirmados em
           * config/site.ts, nenhum botão é renderizado — link quebrado ou
           * destino inventado seria pior que a ausência do CTA.
           *
           * TODO(aster): preencher WHATSAPP_URL ou CONTACT_EMAIL para o
           * CTA "Falar com a equipe" aparecer nesta seção.
           */
          null
        )}
      </div>
    </section>
  );
}
