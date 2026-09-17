import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, Minus, Sparkles, ArrowRight, AlertTriangle, Users } from 'lucide-react';
import { api, ApiError } from '../../lib/api';
import { formatBRL } from '../../lib/currency';
import type { BusinessPulse } from '../../lib/commerce/types';

function Trend({ value }: { value: number | null }) {
  if (value === null) return <span className="text-slate-400 text-xs font-semibold">no baseline yet</span>;
  const Icon = value > 0 ? TrendingUp : value < 0 ? TrendingDown : Minus;
  const color = value > 0 ? 'text-emerald-600' : value < 0 ? 'text-rose-600' : 'text-slate-400';
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-bold ${color}`}>
      <Icon size={13} /> {value > 0 ? '+' : ''}{value}%
    </span>
  );
}

export default function PulsePage() {
  const [pulse, setPulse] = useState<BusinessPulse | null>(null);
  const [insights, setInsights] = useState<string[] | null>(null);
  const [lunaError, setLunaError] = useState('');
  const [lunaLoading, setLunaLoading] = useState(false);

  useEffect(() => {
    api.get<{ pulse: BusinessPulse }>('/commerce/analytics/pulse').then((data) => setPulse(data.pulse)).catch(() => setPulse(null));
  }, []);

  const askLuna = async () => {
    setLunaError('');
    setLunaLoading(true);
    setInsights(null);
    try {
      const data = await api.post<{ insights: string[] }>('/commerce/analytics/luna');
      setInsights(data.insights);
    } catch (err) {
      setLunaError(err instanceof ApiError ? err.message : 'Could not reach Luna AI.');
    } finally {
      setLunaLoading(false);
    }
  };

  if (!pulse) {
    return <p className="text-slate-400">Reading your store's pulse…</p>;
  }

  return (
    <div>
      <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-ink-900">Business Pulse</h1>
      <p className="text-slate-500 mt-2 text-sm">What's happening, and what to do about it — not just what happened.</p>

      {pulse.recommendedActions.length > 0 && (
        <div className="mt-6 bg-ink-950 text-white rounded-[28px] card-shadow p-6">
          <p className="text-xs font-bold text-volt-400 uppercase tracking-wide mb-3">Recommended actions</p>
          <ul className="space-y-2.5">
            {pulse.recommendedActions.map((action, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-white/90">
                <ArrowRight size={16} className="text-volt-400 shrink-0 mt-0.5" /> {action}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 grid sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl card-shadow-sm border border-ASTER-100 p-5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Revenue (7 days)</p>
          <p className="font-display font-extrabold text-2xl text-ink-900 mt-2 tabular-nums">{formatBRL(pulse.revenue.current)}</p>
          <div className="mt-1.5"><Trend value={pulse.revenue.pctChange} /></div>
        </div>
        <div className="bg-white rounded-2xl card-shadow-sm border border-ASTER-100 p-5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Orders (7 days)</p>
          <p className="font-display font-extrabold text-2xl text-ink-900 mt-2 tabular-nums">{pulse.orders.current}</p>
          <div className="mt-1.5"><Trend value={pulse.orders.pctChange} /></div>
        </div>
        <div className="bg-white rounded-2xl card-shadow-sm border border-ASTER-100 p-5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">New customers (7 days)</p>
          <p className="font-display font-extrabold text-2xl text-ink-900 mt-2 tabular-nums">{pulse.newCustomers.current}</p>
          <div className="mt-1.5"><Trend value={pulse.newCustomers.pctChange} /></div>
        </div>
      </div>

      <div className="mt-6 grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-[28px] card-shadow border border-ASTER-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
              <AlertTriangle size={14} className="text-amber-500" /> Inventory alerts
            </p>
            <Link to="/commerce/inventory" className="text-xs font-bold text-ASTER-600 hover:text-ASTER-700">View all →</Link>
          </div>
          {pulse.lowStockProducts.length === 0 ? (
            <p className="text-sm text-slate-400">Nothing is running low.</p>
          ) : (
            <ul className="space-y-2.5">
              {pulse.lowStockProducts.map((p) => (
                <li key={p.id} className="flex items-center justify-between text-sm">
                  <span className="text-ink-900 font-semibold">{p.name}</span>
                  <span className="text-rose-600 font-bold">{p.stockQuantity} left</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-[28px] card-shadow border border-ASTER-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Top products (30 days)</p>
            <Link to="/commerce/products" className="text-xs font-bold text-ASTER-600 hover:text-ASTER-700">View all →</Link>
          </div>
          {pulse.topProducts.length === 0 ? (
            <p className="text-sm text-slate-400">No sales yet in the last 30 days.</p>
          ) : (
            <ul className="space-y-2.5">
              {pulse.topProducts.map((p, i) => (
                <li key={p.id} className="flex items-center justify-between text-sm">
                  <span className="text-ink-900 font-semibold">{i + 1}. {p.name}</span>
                  <span className="text-slate-500 tabular-nums">{formatBRL(p.revenue)} · {p.unitsSold} sold</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {pulse.dormantCustomerCount > 0 && (
        <div className="mt-6 bg-white rounded-[28px] card-shadow border border-ASTER-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
              <Users size={14} className="text-slate-400" /> {pulse.dormantCustomerCount} customer(s) inactive 60+ days
            </p>
            <Link to="/commerce/opportunities" className="text-xs font-bold text-ASTER-600 hover:text-ASTER-700">See opportunity →</Link>
          </div>
          <ul className="flex flex-wrap gap-2">
            {pulse.dormantCustomers.map((c) => (
              <li key={c.id} className="text-xs font-semibold text-slate-600 bg-slate-50 border border-ASTER-100 rounded-full px-3 py-1.5">{c.name}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 bg-gradient-to-br from-ASTER-700 via-ASTER-600 to-ASTER-500 rounded-[28px] p-6 text-white">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <p className="font-display font-bold text-lg flex items-center gap-2"><Sparkles size={18} /> Luna AI Insights</p>
          <button
            onClick={askLuna}
            disabled={lunaLoading}
            className="bg-white text-ASTER-700 font-bold text-sm px-5 py-2.5 rounded-full hover:shadow-lg transition-all disabled:opacity-60"
          >
            {lunaLoading ? 'Thinking…' : 'Ask Luna'}
          </button>
        </div>
        {insights && (
          <ul className="mt-4 space-y-2">
            {insights.map((line, i) => (
              <li key={i} className="text-sm text-white/90 flex items-start gap-2">
                <span className="text-volt-400">•</span> {line}
              </li>
            ))}
          </ul>
        )}
        {lunaError && <p className="text-sm text-white/80 mt-4">{lunaError}</p>}
        {!insights && !lunaError && <p className="text-sm text-white/70 mt-3">Ask Luna to explain your trends and suggest what to do next.</p>}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/commerce/opportunities" className="inline-flex items-center gap-2 bg-white border border-ASTER-100 hover:border-ASTER-400 text-ink-900 font-bold px-5 py-2.5 rounded-full transition-colors">
          Opportunity Center <ArrowRight size={15} />
        </Link>
        <Link to="/commerce/audit" className="inline-flex items-center gap-2 bg-white border border-ASTER-100 hover:border-ASTER-400 text-ink-900 font-bold px-5 py-2.5 rounded-full transition-colors">
          Run Commerce Audit <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}
