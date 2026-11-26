import { useId, useState } from 'react';
import { Check, Minus, ChevronDown } from 'lucide-react';
import { PLAN_TIERS } from '../data/plans';
import { buildComparison, DOMAIN_TERMS } from '../data/plan-features';

/**
 * "Comparar todos os recursos" — tabela recolhível.
 *
 * As linhas vêm de buildComparison(), derivada de PLAN_TIERS (a mesma
 * lista do seed do servidor). Nenhuma disponibilidade é escrita à mão.
 *
 * Acessibilidade: o gatilho é um <button> com aria-expanded/aria-controls,
 * então teclado e leitor de tela funcionam sem truque. A tabela usa
 * <th scope> de verdade, e cada célula tem texto para leitor de tela —
 * ícone sozinho não comunica "incluído" ou "não incluído".
 *
 * Mobile: a tabela rola na horizontal dentro do próprio contêiner, com a
 * coluna de recurso fixa, em vez de encolher a fonte até ficar ilegível.
 */
export default function PlanComparison() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const rows = buildComparison();

  return (
    <div className="mt-12 max-w-6xl mx-auto">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="w-full flex items-center justify-between gap-4 bg-white border border-ASTER-100 hover:border-ASTER-300 rounded-2xl px-6 py-5 text-left transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ASTER-600/40"
      >
        <span>
          <span className="block font-display font-extrabold text-lg sm:text-xl text-ink-900">
            Comparar todos os recursos
          </span>
          <span className="block text-sm text-slate-600 mt-0.5">
            {rows.length} recursos nos {PLAN_TIERS.length} planos
          </span>
        </span>
        <ChevronDown
          size={22}
          className={`text-ASTER-600 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div id={panelId} className="mt-4 border border-ASTER-100 rounded-2xl overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left border-collapse">
              <caption className="sr-only">
                Comparação de recursos entre os planos {PLAN_TIERS.map((t) => t.name).join(', ')}
              </caption>
              <thead>
                <tr className="bg-ASTER-50/70">
                  <th
                    scope="col"
                    className="sticky left-0 z-10 bg-ASTER-50/70 px-5 py-4 font-display font-bold text-sm text-ink-900 min-w-[220px]"
                  >
                    Recurso
                  </th>
                  {PLAN_TIERS.map((tier) => (
                    <th
                      key={tier.slug}
                      scope="col"
                      className="px-4 py-4 text-center font-display font-bold text-sm text-ink-900 whitespace-nowrap"
                    >
                      {tier.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.feature} className="border-t border-ASTER-100/70">
                    <th
                      scope="row"
                      className="sticky left-0 z-10 bg-white px-5 py-3.5 font-medium text-sm text-[#2c1a63]"
                    >
                      {row.feature}
                    </th>
                    {PLAN_TIERS.map((tier) => {
                      const included = row.included[tier.slug];
                      return (
                        <td key={tier.slug} className="px-4 py-3.5 text-center">
                          {included ? (
                            <span className="inline-flex w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 items-center justify-center">
                              <Check size={14} strokeWidth={3} aria-hidden="true" />
                              <span className="sr-only">Incluído no {tier.name}</span>
                            </span>
                          ) : (
                            <span className="inline-flex w-6 h-6 rounded-full bg-slate-100 text-slate-600 items-center justify-center">
                              <Minus size={14} strokeWidth={3} aria-hidden="true" />
                              <span className="sr-only">Não incluído no {tier.name}</span>
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}

                {/*
                  * Domínio: a linha aparece sempre. Onde a condição não foi
                  * confirmada, aparece "Não informado" em vez de sumir —
                  * a lacuna fica visível em vez de virar silêncio.
                  */}
                <tr className="border-t border-ASTER-100/70 bg-ASTER-50/30">
                    <th
                      scope="row"
                      className="sticky left-0 z-10 bg-ASTER-50/30 px-5 py-3.5 font-medium text-sm text-[#2c1a63]"
                    >
                      Domínio
                    </th>
                    {PLAN_TIERS.map((tier) => (
                      <td key={tier.slug} className="px-4 py-3.5 text-center text-xs text-slate-600">
                        {DOMAIN_TERMS[tier.slug] ?? (
                          <span className="italic text-slate-500">Não informado</span>
                        )}
                      </td>
                    ))}
                </tr>
              </tbody>
            </table>
          </div>

          <p className="px-5 py-4 text-xs text-slate-600 border-t border-ASTER-100/70 bg-slate-50/60">
            Os planos são cumulativos: cada um inclui tudo do anterior. A tabela é gerada a partir
            da configuração de planos do sistema, a mesma que define o que é cobrado.
          </p>
        </div>
      )}
    </div>
  );
}
