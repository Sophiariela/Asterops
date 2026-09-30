import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles, ArrowRight, Layers, Target, AlertTriangle } from 'lucide-react';
import { api, ApiError } from '../../lib/api';
import { titleCase } from '../../lib/webos/locale';
import { getTemplateThumbnail } from '../../lib/webos/templatePreview';
import { TemplateCardSkeleton } from '../../components/webos/Skeleton';
import type { TemplateSummary, TemplateComplexity } from '../../lib/webos/types';

function scoreColor(score: number) {
  if (score >= 70) return 'text-emerald-600';
  if (score >= 45) return 'text-amber-500';
  return 'text-rose-600';
}

const COMPLEXITY_STYLE: Record<TemplateComplexity, string> = {
  SIMPLE: 'bg-emerald-50 text-emerald-700',
  STANDARD: 'bg-blue-50 text-blue-700',
  ADVANCED: 'bg-violet-50 text-violet-700',
};

export default function TemplateLibraryPage() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<TemplateSummary[] | null>(null);
  const [loadError, setLoadError] = useState('');
  const [q, setQ] = useState('');
  const [industry, setIndustry] = useState('');
  const [goal, setGoal] = useState('');
  const [complexity, setComplexity] = useState<TemplateComplexity | ''>('');
  const [ecommerceOnly, setEcommerceOnly] = useState(false);

  const [showLuna, setShowLuna] = useState(false);
  const [lunaForm, setLunaForm] = useState({ industry: '', targetAudience: '', description: '' });
  const [lunaLines, setLunaLines] = useState<string[] | null>(null);
  const [lunaRecommendedId, setLunaRecommendedId] = useState<string | null>(null);
  const [lunaError, setLunaError] = useState('');
  const [lunaLoading, setLunaLoading] = useState(false);

  const load = () => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (industry) params.set('industry', industry);
    if (goal) params.set('goal', goal);
    if (complexity) params.set('complexity', complexity);
    if (ecommerceOnly) params.set('ecommerce', 'true');
    // A failed request must never render as "no templates match" — that's
    // indistinguishable from the library actually being empty. Only a
    // successful response updates the list; any thrown error (network,
    // timeout, 5xx) leaves it untouched and surfaces a retry instead.
    api.get<{ templates: TemplateSummary[] }>(`/webos/templates?${params.toString()}`)
      .then((data) => { setTemplates(data.templates); setLoadError(''); })
      .catch((err) => setLoadError(err instanceof ApiError ? err.message : 'Could not load the template library. Check your connection and try again.'));
  };

  useEffect(() => {
    const timeout = setTimeout(load, 200);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, industry, goal, complexity, ecommerceOnly]);

  const industries = useMemo(() => Array.from(new Set((templates ?? []).map((t) => t.industry))).sort(), [templates]);
  const goals = useMemo(() => Array.from(new Set((templates ?? []).map((t) => t.primaryGoal))).sort(), [templates]);

  const openPreview = (t: TemplateSummary) => {
    navigate(`/webos/templates/${t.id}/preview`);
  };

  const askLuna = async (e: FormEvent) => {
    e.preventDefault();
    setLunaError('');
    setLunaLines(null);
    setLunaRecommendedId(null);
    setLunaLoading(true);
    try {
      const data = await api.post<{ review: string[]; recommendedTemplateId: string | null }>('/webos/templates/recommend', lunaForm);
      setLunaLines(data.review);
      setLunaRecommendedId(data.recommendedTemplateId);
    } catch (err) {
      setLunaError(err instanceof ApiError ? err.message : 'Could not reach Luna AI.');
      setLunaLines([]);
    } finally {
      setLunaLoading(false);
    }
  };

  const jumpToRecommended = () => {
    const t = templates?.find((x) => x.id === lunaRecommendedId);
    setShowLuna(false);
    if (t) openPreview(t);
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-ink-900">Template Library</h1>
          <p className="text-slate-500 mt-2 text-sm">Choose a proven, industry-specific structure and generate a complete website in seconds.</p>
        </div>
        <button
          onClick={() => { setShowLuna(true); setLunaLines(null); setLunaError(''); }}
          className="flex items-center gap-2 bg-gradient-to-br from-ASTER-700 to-ASTER-500 text-white font-bold px-5 py-2.5 rounded-full transition-all whitespace-nowrap"
        >
          <Sparkles size={16} /> Ask Luna to recommend one
        </button>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search templates" className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-full pl-11 pr-4 py-2.5 text-sm outline-none transition-colors" />
        </div>
        <select value={industry} onChange={(e) => setIndustry(e.target.value)} className="border-2 border-ASTER-100 rounded-full px-4 py-2.5 text-sm outline-none">
          <option value="">All industries</option>
          {industries.map((i) => <option key={i} value={i}>{i}</option>)}
        </select>
        <select value={goal} onChange={(e) => setGoal(e.target.value)} className="border-2 border-ASTER-100 rounded-full px-4 py-2.5 text-sm outline-none">
          <option value="">All goals</option>
          {goals.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
        <select value={complexity} onChange={(e) => setComplexity(e.target.value as TemplateComplexity | '')} className="border-2 border-ASTER-100 rounded-full px-4 py-2.5 text-sm outline-none">
          <option value="">Any complexity</option>
          <option value="SIMPLE">Simple</option>
          <option value="STANDARD">Standard</option>
          <option value="ADVANCED">Advanced</option>
        </select>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-600 px-3">
          <input type="checkbox" checked={ecommerceOnly} onChange={(e) => setEcommerceOnly(e.target.checked)} className="accent-ASTER-600" />
          Ecommerce only
        </label>
      </div>

      {loadError && (
        <div className="mt-10 bg-rose-50 border border-rose-200 rounded-[28px] p-8 text-center">
          <AlertTriangle size={32} className="text-rose-500 mx-auto" />
          <p className="text-rose-700 font-semibold mt-3">{loadError}</p>
          <button onClick={load} className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold px-5 py-2.5 rounded-full transition-all mt-5">
            Try again
          </button>
        </div>
      )}

      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {!loadError && templates === null && Array.from({ length: 6 }).map((_, i) => <TemplateCardSkeleton key={i} />)}
        {!loadError && templates?.map((t) => {
          return (
            <button key={t.id} onClick={() => openPreview(t)} className="text-left bg-white rounded-[28px] card-shadow border border-ASTER-100 overflow-hidden hover:-translate-y-0.5 transition-transform flex flex-col">
              <div className="relative aspect-[16/10]">
                <img src={getTemplateThumbnail(t.key)} alt="" className="w-full h-full object-cover" loading="lazy" />
                <span className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${COMPLEXITY_STYLE[t.complexity]}`}>{titleCase(t.complexity)}</span>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <p className="font-display font-bold text-lg text-ink-900">{t.name}</p>
                <p className="text-slate-500 text-xs mt-1">{t.industry}</p>
                <p className="text-sm text-slate-600 mt-3 flex-1">{t.description}</p>
                <div className="mt-4 bg-slate-50 rounded-2xl p-3 text-[11px] text-slate-500 italic">
                  {t.recommendedUseCase}
                </div>
                <div className="flex items-center gap-4 mt-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Layers size={13} /> {t.pageCount} pages</span>
                  <span className="flex items-center gap-1"><Target size={13} /> {t.primaryGoal}</span>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-ASTER-100">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Estimated conversion</span>
                  <span className={`font-display font-extrabold text-xl ${scoreColor(t.leadGenerationScore)}`}>{t.leadGenerationScore}</span>
                </div>
              </div>
            </button>
          );
        })}
        {templates && templates.length === 0 && (
          <p className="col-span-full text-center text-slate-400 py-10">No templates match these filters.</p>
        )}
      </div>

      {/* Luna recommend modal */}
      {showLuna && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/40" onClick={() => setShowLuna(false)}>
          <div className="bg-white rounded-[28px] card-shadow border border-ASTER-100 w-full max-w-md p-7" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-display font-extrabold text-xl text-ink-900 mb-1 flex items-center gap-2"><Sparkles size={18} className="text-ASTER-600" /> Ask Luna</h2>
            <p className="text-slate-500 text-sm mb-5">Tell Luna about the business and she'll recommend one real template from the library.</p>
            {lunaLines === null ? (
              <form onSubmit={askLuna} className="space-y-4">
                <div>
                  <label className="text-[13px] font-bold text-ink-900 block mb-1.5">Industry *</label>
                  <input required value={lunaForm.industry} onChange={(e) => setLunaForm((f) => ({ ...f, industry: e.target.value }))} className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-2xl px-4 py-3 text-[15px] outline-none transition-colors" />
                </div>
                <div>
                  <label className="text-[13px] font-bold text-ink-900 block mb-1.5">Target audience *</label>
                  <input required value={lunaForm.targetAudience} onChange={(e) => setLunaForm((f) => ({ ...f, targetAudience: e.target.value }))} className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-2xl px-4 py-3 text-[15px] outline-none transition-colors" />
                </div>
                <div>
                  <label className="text-[13px] font-bold text-ink-900 block mb-1.5">Describe the business *</label>
                  <textarea required rows={3} value={lunaForm.description} onChange={(e) => setLunaForm((f) => ({ ...f, description: e.target.value }))} className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-2xl px-4 py-3 text-[15px] outline-none transition-colors resize-none" />
                </div>
                <button type="submit" disabled={lunaLoading} className="w-full bg-ASTER-600 hover:bg-ASTER-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-full transition-all">
                  {lunaLoading ? 'Thinking…' : 'Ask Luna'}
                </button>
              </form>
            ) : (
              <div>
                {lunaLines.length > 0 ? (
                  <ul className="space-y-2.5">
                    {lunaLines.map((l, i) => <li key={i} className="text-sm text-ink-900">• {l}</li>)}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-500">{lunaError}</p>
                )}
                {lunaRecommendedId && (
                  <button onClick={jumpToRecommended} className="w-full mt-5 bg-ASTER-600 hover:bg-ASTER-700 text-white font-bold py-3 rounded-full transition-all flex items-center justify-center gap-2">
                    View recommended template <ArrowRight size={15} />
                  </button>
                )}
                <button onClick={() => setLunaLines(null)} className="w-full mt-3 text-sm font-semibold text-slate-500 hover:text-ink-900">Ask again</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
