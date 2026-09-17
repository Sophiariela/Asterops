import { useState } from 'react';
import { PlayCircle, CheckCircle2, AlertCircle, MinusCircle } from 'lucide-react';
import { api } from '../../lib/api';
import type { AuditResult } from '../../lib/commerce/types';

function scoreColor(score: number) {
  if (score >= 80) return 'text-emerald-600';
  if (score >= 60) return 'text-amber-500';
  return 'text-rose-600';
}

export default function AuditPage() {
  const [audit, setAudit] = useState<AuditResult | null>(null);
  const [running, setRunning] = useState(false);

  const run = async () => {
    setRunning(true);
    try {
      const data = await api.post<{ audit: AuditResult }>('/commerce/analytics/audit');
      setAudit(data.audit);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-ink-900">ASTER Commerce Audit</h1>
          <p className="text-slate-500 mt-2 text-sm max-w-xl">A rules-based scan of your catalog, inventory and customer data — with the specific things to fix, not just a grade.</p>
        </div>
        <button
          onClick={run}
          disabled={running}
          className="flex items-center gap-2 bg-ASTER-600 hover:bg-ASTER-700 disabled:opacity-60 text-white font-bold px-5 py-3 rounded-full transition-all whitespace-nowrap"
        >
          <PlayCircle size={18} /> {running ? 'Running…' : 'Run Commerce Audit'}
        </button>
      </div>

      {audit && (
        <div className="mt-8">
          <div className="bg-ink-950 text-white rounded-[28px] card-shadow p-8 text-center">
            <p className="text-white/60 text-sm font-bold uppercase tracking-wide">Commerce Score</p>
            <p className={`font-display font-extrabold text-6xl mt-2 ${scoreColor(audit.score)}`}>{audit.score}<span className="text-2xl text-white/40">/100</span></p>
          </div>

          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            {audit.checks.map((c) => (
              <div key={c.key} className="bg-white rounded-2xl card-shadow-sm border border-ASTER-100 p-5">
                <div className="flex items-start gap-3">
                  {!c.measured ? (
                    <MinusCircle size={18} className="text-slate-300 shrink-0 mt-0.5" />
                  ) : c.penalty === 0 ? (
                    <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-semibold text-ink-900 text-sm">{c.label}</p>
                    <p className="text-slate-500 text-xs mt-1">{c.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {audit.recommendations.length > 0 && (
            <div className="mt-6 bg-white rounded-[28px] card-shadow border border-ASTER-100 p-6">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-4">Recommendations</p>
              <ol className="space-y-2.5 list-decimal list-inside">
                {audit.recommendations.map((r, i) => (
                  <li key={i} className="text-sm text-ink-900">{r}</li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}

      {!audit && !running && (
        <p className="text-slate-400 text-sm mt-10">Click "Run Commerce Audit" to generate your score.</p>
      )}
    </div>
  );
}
