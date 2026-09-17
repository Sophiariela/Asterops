import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Monitor, Smartphone, Sparkles, ArrowRight, Layers, Target } from 'lucide-react';
import { api, ApiError } from '../../lib/api';
import type { TemplateSummary, TemplateDetail, TemplateComplexity } from '../../lib/webos/types';

function fillVars(pattern: string, vars: Record<string, string>): string {
  return pattern.replace(/\{\{(\w+)\}\}/g, (m, k) => (k in vars ? vars[k] : m));
}

function exampleVars(t: Pick<TemplateSummary, 'industry' | 'primaryGoal'>) {
  return {
    businessName: 'Your Business',
    industry: t.industry,
    targetAudience: 'your ideal customer',
    services: 'your core offer',
    pageName: '',
    purpose: t.primaryGoal,
  };
}

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

type Device = 'desktop' | 'mobile';

type GenerateForm = { businessName: string; industry: string; targetAudience: string; services: string };
const emptyGenerateForm: GenerateForm = { businessName: '', industry: '', targetAudience: '', services: '' };

export default function TemplateLibraryPage() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<TemplateSummary[] | null>(null);
  const [q, setQ] = useState('');
  const [industry, setIndustry] = useState('');
  const [goal, setGoal] = useState('');
  const [complexity, setComplexity] = useState<TemplateComplexity | ''>('');
  const [ecommerceOnly, setEcommerceOnly] = useState(false);

  const [detail, setDetail] = useState<TemplateDetail | null>(null);
  const [detailDevice, setDetailDevice] = useState<Device>('desktop');
  const [detailPageIndex, setDetailPageIndex] = useState(0);

  const [generatingFor, setGeneratingFor] = useState<TemplateSummary | null>(null);
  const [form, setForm] = useState<GenerateForm>(emptyGenerateForm);
  const [formError, setFormError] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatedSiteId, setGeneratedSiteId] = useState<string | null>(null);

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
    api.get<{ templates: TemplateSummary[] }>(`/webos/templates?${params.toString()}`).then((data) => setTemplates(data.templates)).catch(() => setTemplates([]));
  };

  useEffect(() => {
    const timeout = setTimeout(load, 200);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, industry, goal, complexity, ecommerceOnly]);

  const industries = useMemo(() => Array.from(new Set((templates ?? []).map((t) => t.industry))).sort(), [templates]);
  const goals = useMemo(() => Array.from(new Set((templates ?? []).map((t) => t.primaryGoal))).sort(), [templates]);

  const openDetail = async (t: TemplateSummary) => {
    setDetailDevice('desktop');
    setDetailPageIndex(0);
    const data = await api.get<{ template: TemplateDetail }>(`/webos/templates/${t.id}`);
    setDetail(data.template);
  };

  const openGenerate = (t: TemplateSummary) => {
    setGeneratingFor(t);
    setForm({ ...emptyGenerateForm, industry: t.industry });
    setFormError('');
    setGeneratedSiteId(null);
    setDetail(null);
  };

  const submitGenerate = async (e: FormEvent) => {
    e.preventDefault();
    if (!generatingFor) return;
    setFormError('');
    setGenerating(true);
    try {
      const data = await api.post<{ site: { id: string } }>('/webos/templates/generate', {
        templateId: generatingFor.id,
        businessName: form.businessName,
        industry: form.industry,
        targetAudience: form.targetAudience,
        services: form.services.split(',').map((s) => s.trim()).filter(Boolean),
      });
      setGeneratedSiteId(data.site.id);
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'Could not generate this site.');
    } finally {
      setGenerating(false);
    }
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
    if (t) openDetail(t);
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

      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {templates?.map((t) => {
          return (
            <button key={t.id} onClick={() => openDetail(t)} className="text-left bg-white rounded-[28px] card-shadow border border-ASTER-100 p-6 hover:-translate-y-0.5 transition-transform flex flex-col">
              <div className="flex items-start justify-between gap-2">
                <p className="font-display font-bold text-lg text-ink-900">{t.name}</p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${COMPLEXITY_STYLE[t.complexity]}`}>{t.complexity}</span>
              </div>
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
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Lead-gen score</span>
                <span className={`font-display font-extrabold text-xl ${scoreColor(t.leadGenerationScore)}`}>{t.leadGenerationScore}</span>
              </div>
            </button>
          );
        })}
        {templates && templates.length === 0 && (
          <p className="col-span-full text-center text-slate-400 py-10">No templates match these filters.</p>
        )}
      </div>

      {/* Template detail modal */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/40" onClick={() => setDetail(null)}>
          <div className="bg-white rounded-[28px] card-shadow border border-ASTER-100 w-full max-w-3xl max-h-[90vh] overflow-y-auto p-7" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display font-extrabold text-xl text-ink-900">{detail.name}</h2>
                <p className="text-slate-500 text-sm mt-1">{detail.industry} · {detail.recommendedUseCase}</p>
              </div>
              <button onClick={() => openGenerate(detail)} className="bg-ASTER-600 hover:bg-ASTER-700 text-white font-bold text-sm px-4 py-2.5 rounded-full transition-all whitespace-nowrap flex items-center gap-1.5">
                Use this template <ArrowRight size={15} />
              </button>
            </div>

            <div className="flex items-center gap-4 mt-4 flex-wrap">
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${COMPLEXITY_STYLE[detail.complexity]}`}>{detail.complexity}</span>
              <span className="text-xs text-slate-500">{detail.pageCount} pages</span>
              <span className="text-xs text-slate-500">Goal: {detail.primaryGoal}</span>
              <span className={`text-xs font-bold ${scoreColor(detail.leadGenerationScore)}`}>Lead-gen score {detail.leadGenerationScore}/100</span>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {detail.scoreFactors.map((f) => (
                <span key={f.key} className="text-[10px] font-semibold text-slate-500 bg-slate-50 px-2 py-1 rounded-full">{f.detail}</span>
              ))}
            </div>

            <div className="grid sm:grid-cols-[160px_1fr] gap-5 mt-6">
              <div className="space-y-1.5">
                {detail.pages.map((p, i) => (
                  <button
                    key={p.id}
                    onClick={() => setDetailPageIndex(i)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${detailPageIndex === i ? 'bg-ASTER-50 text-ASTER-600' : 'text-slate-500 hover:bg-slate-50'}`}
                  >
                    {p.name}
                    {p.hasLeadForm && <span className="ml-1.5 text-[9px] font-bold text-emerald-600">●</span>}
                  </button>
                ))}
              </div>

              <div>
                <div className="flex items-center justify-end gap-1 bg-slate-100 rounded-full p-1 mb-3 w-fit ml-auto">
                  {([{ key: 'desktop' as Device, icon: Monitor }, { key: 'mobile' as Device, icon: Smartphone }]).map(({ key, icon: Icon }) => (
                    <button key={key} onClick={() => setDetailDevice(key)} className={`p-2 rounded-full transition-colors ${detailDevice === key ? 'bg-white text-ASTER-600 card-shadow-sm' : 'text-slate-400'}`} aria-label={key}>
                      <Icon size={15} />
                    </button>
                  ))}
                </div>
                {(() => {
                  const page = detail.pages[detailPageIndex];
                  if (!page) return null;
                  const vars = { ...exampleVars(detail), pageName: page.name, purpose: page.purpose };
                  return (
                    <div className={`border border-ASTER-100 rounded-2xl overflow-hidden bg-slate-50 p-6 mx-auto transition-all ${detailDevice === 'mobile' ? 'max-w-[320px]' : 'max-w-full'}`}>
                      <h3 className="font-display font-extrabold text-xl text-ink-900">{fillVars(page.heroHeadlinePattern, vars)}</h3>
                      <p className="text-slate-500 text-sm mt-2">{fillVars(page.heroSubheadlinePattern, vars)}</p>
                      <button className="mt-4 bg-ASTER-600 text-white font-bold text-xs px-4 py-2 rounded-full">{page.ctaLabel}</button>
                      <div className="mt-6 space-y-4 pt-6 border-t border-ASTER-100">
                        {page.sections.map((s) => (
                          <div key={s.id}>
                            <p className="font-display font-bold text-sm text-ink-900">{fillVars(s.heading, vars)}</p>
                            <p className="text-xs text-slate-500 mt-1">{s.type === 'trust-placeholder' ? 'Real testimonials appear here once added.' : 'Real content, generated from your services.'}</p>
                          </div>
                        ))}
                        {page.hasLeadForm && <div className="bg-white rounded-xl p-3 text-xs font-semibold text-slate-500">Lead capture form</div>}
                      </div>
                    </div>
                  );
                })()}
                <p className="text-[11px] text-slate-400 mt-3">Structure preview with example copy — your generated site uses your real business name and services instead.</p>
              </div>
            </div>
          </div>
        </div>
      )}

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

      {/* Generate form modal */}
      {generatingFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/40" onClick={() => setGeneratingFor(null)}>
          <div className="bg-white rounded-[28px] card-shadow border border-ASTER-100 w-full max-w-lg max-h-[85vh] overflow-y-auto p-7" onClick={(e) => e.stopPropagation()}>
            {generatedSiteId ? (
              <div>
                <h2 className="font-display font-extrabold text-xl text-ink-900 mb-1">Site generated</h2>
                <p className="text-slate-500 text-sm mb-5">{form.businessName} is scaffolded from {generatingFor.name} and ready to build on.</p>
                <button onClick={() => navigate(`/webos/${generatedSiteId}`)} className="w-full bg-ASTER-600 hover:bg-ASTER-700 text-white font-bold py-3.5 rounded-full transition-all flex items-center justify-center gap-2">
                  Continue to site <ArrowRight size={16} />
                </button>
              </div>
            ) : (
              <>
                <h2 className="font-display font-extrabold text-xl text-ink-900 mb-1">Generate from {generatingFor.name}</h2>
                <p className="text-slate-500 text-sm mb-5">{generatingFor.pageCount} pages, built for {generatingFor.primaryGoal.toLowerCase()}.</p>
                <form onSubmit={submitGenerate} className="space-y-4">
                  <div>
                    <label className="text-[13px] font-bold text-ink-900 block mb-1.5">Business name *</label>
                    <input required value={form.businessName} onChange={(e) => setForm((f) => ({ ...f, businessName: e.target.value }))} className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-2xl px-4 py-3 text-[15px] outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="text-[13px] font-bold text-ink-900 block mb-1.5">Industry *</label>
                    <input required value={form.industry} onChange={(e) => setForm((f) => ({ ...f, industry: e.target.value }))} className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-2xl px-4 py-3 text-[15px] outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="text-[13px] font-bold text-ink-900 block mb-1.5">Services (comma-separated) *</label>
                    <input required value={form.services} onChange={(e) => setForm((f) => ({ ...f, services: e.target.value }))} className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-2xl px-4 py-3 text-[15px] outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="text-[13px] font-bold text-ink-900 block mb-1.5">Target audience *</label>
                    <input required value={form.targetAudience} onChange={(e) => setForm((f) => ({ ...f, targetAudience: e.target.value }))} className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-2xl px-4 py-3 text-[15px] outline-none transition-colors" />
                  </div>
                  {formError && <p className="text-rose-500 text-sm font-semibold">{formError}</p>}
                  <button type="submit" disabled={generating} className="w-full bg-ASTER-600 hover:bg-ASTER-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-full transition-all">
                    {generating ? 'Generating…' : 'Generate site'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
