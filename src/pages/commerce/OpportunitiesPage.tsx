import { useEffect, useState } from 'react';
import { TrendingUp, Lock } from 'lucide-react';
import { api } from '../../lib/api';
import { formatBRL } from '../../lib/currency';
import type { Opportunity } from '../../lib/commerce/types';

export default function OpportunitiesPage() {
  const [data, setData] = useState<{ opportunities: Opportunity[]; total: number } | null>(null);

  useEffect(() => {
    api.get<{ opportunities: Opportunity[]; total: number }>('/commerce/analytics/opportunities').then(setData).catch(() => setData({ opportunities: [], total: 0 }));
  }, []);

  if (!data) {
    return <p className="text-slate-400">Scanning for opportunities…</p>;
  }

  return (
    <div>
      <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-ink-900">Opportunity Center</h1>
      <p className="text-slate-500 mt-2 text-sm">Estimated revenue you could recover with a specific action — not a metric, a to-do list.</p>

      <div className="mt-6 bg-ink-950 text-white rounded-[28px] card-shadow p-7 flex items-center gap-4">
        <span className="w-14 h-14 rounded-2xl bg-ASTER-600 flex items-center justify-center shrink-0">
          <TrendingUp size={26} />
        </span>
        <div>
          <p className="text-white/60 text-sm">Total opportunity</p>
          <p className="font-display font-extrabold text-3xl tabular-nums">{formatBRL(data.total)}</p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {data.opportunities.map((o) => (
          <div key={o.key} className={`bg-white rounded-[28px] card-shadow border p-6 ${o.available ? 'border-ASTER-100' : 'border-ASTER-100 opacity-60'}`}>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <p className="font-display font-bold text-lg text-ink-900">{o.label}</p>
                <p className="text-slate-500 text-sm mt-1 max-w-xl">{o.basis}</p>
              </div>
              {o.available ? (
                <p className="font-display font-extrabold text-2xl text-emerald-600 tabular-nums whitespace-nowrap">+{formatBRL(o.estimate)}</p>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 bg-slate-50 border border-ASTER-100 rounded-full px-3 py-1.5 whitespace-nowrap">
                  <Lock size={12} /> Not yet available
                </span>
              )}
            </div>
            {o.items && o.items.length > 0 && (
              <ul className="mt-4 pt-4 border-t border-ASTER-100 space-y-2">
                {o.items.map((item, i) => (
                  <li key={i} className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">{item.label}</span>
                    <span className="font-semibold text-ink-900 tabular-nums">+{formatBRL(item.estimate)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
