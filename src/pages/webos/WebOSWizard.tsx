import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, Check, Loader2, Sparkles,
} from 'lucide-react';
import { api, ApiError } from '../../lib/api';
import PublicSiteRenderer from '../../components/webos/PublicSiteRenderer';
import PublicLinkCard from '../../components/webos/PublicLinkCard';
import { EditableImage } from '../../components/webos/editable';
import { getPublicSiteUrl } from '../../lib/webos/publicUrl';
import type { Site, TemplateSummary } from '../../lib/webos/types';

const STEPS = ['Sector', 'Template', 'Business', 'Logo', 'Cover photo', 'Publish'];

function StepProgress({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-2 max-w-md mx-auto">
      {STEPS.map((label, i) => (
        <div key={label} className="flex-1 flex items-center gap-2">
          <div className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? 'bg-ASTER-600' : 'bg-ASTER-100'}`} />
          {i < STEPS.length - 1 && <span className="sr-only">{label}</span>}
        </div>
      ))}
    </div>
  );
}

export default function WebOSWizard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedTemplateId = searchParams.get('template');

  const [templates, setTemplates] = useState<TemplateSummary[] | null>(null);
  const [step, setStep] = useState(0);

  const [industry, setIndustry] = useState('');
  const [templateId, setTemplateId] = useState('');

  const [businessName, setBusinessName] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [services, setServices] = useState('');

  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [site, setSite] = useState<Site | null>(null);

  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    api.get<{ templates: TemplateSummary[] }>('/webos/templates').then((data) => {
      setTemplates(data.templates);
      if (preselectedTemplateId) {
        const t = data.templates.find((x) => x.id === preselectedTemplateId);
        if (t) {
          setIndustry(t.industry);
          setTemplateId(t.id);
          setStep(2);
        }
      }
    }).catch(() => setTemplates([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const industries = useMemo(() => Array.from(new Set((templates ?? []).map((t) => t.industry))).sort(), [templates]);
  const templatesForIndustry = useMemo(() => (templates ?? []).filter((t) => t.industry === industry), [templates, industry]);
  const selectedTemplate = useMemo(() => templates?.find((t) => t.id === templateId) ?? null, [templates, templateId]);

  const goNext = () => setStep((s) => Math.min(STEPS.length - 1, s + 1));
  const goBack = () => setStep((s) => Math.max(0, s - 1));

  const createSite = async () => {
    setCreateError('');
    setCreating(true);
    try {
      const data = await api.post<{ site: Site }>('/webos/templates/generate', {
        templateId,
        businessName,
        industry,
        targetAudience,
        services: services.split(',').map((s) => s.trim()).filter(Boolean),
      });
      setSite(data.site);
      goNext();
    } catch (err) {
      setCreateError(err instanceof ApiError ? err.message : 'Could not create this site. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const refreshSite = () => {
    if (!site) return;
    api.get<{ site: Site }>(`/webos/sites/${site.id}`).then((data) => setSite(data.site)).catch(() => {});
  };

  const uploadLogo = (file: File) => {
    if (!site) return Promise.resolve();
    const fd = new FormData();
    fd.append('logo', file);
    return api.postForm(`/webos/sites/${site.id}/logo`, fd).then(refreshSite);
  };

  const homePage = site?.pages.find((p) => p.slug === 'home') ?? site?.pages[0];

  const uploadCover = (file: File) => {
    if (!homePage) return Promise.resolve();
    const fd = new FormData();
    fd.append('image', file);
    return api.postForm(`/webos/pages/${homePage.id}/hero-image`, fd).then(refreshSite);
  };

  const publish = async () => {
    if (!site) return;
    setPublishing(true);
    try {
      const data = await api.post<{ site: Site }>(`/webos/sites/${site.id}/publish`);
      setSite((s) => (s ? { ...s, ...data.site } : s));
    } finally {
      setPublishing(false);
    }
  };

  const publicUrl = site ? getPublicSiteUrl(site) : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-ASTER-50/60 via-white to-white">
      <header className="px-6 py-5 flex items-center justify-between max-w-3xl mx-auto">
        <Link to="/webos" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-ASTER-600 transition-colors">
          <ArrowLeft size={16} /> Exit
        </Link>
        <span className="font-display font-bold text-ink-900 text-sm">Step {step + 1} of {STEPS.length}: {STEPS[step]}</span>
        <span className="w-16" />
      </header>

      <div className="px-6 mb-8">
        <StepProgress step={step} />
      </div>

      <div className="px-6 pb-16">
        {step === 0 && (
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="font-display font-extrabold text-3xl text-ink-900">What's your business?</h1>
            <p className="text-slate-500 mt-2">Pick the closest match. You can fine-tune everything later.</p>
            <div className="mt-8 grid sm:grid-cols-3 gap-3">
              {industries.map((i) => (
                <button
                  key={i}
                  onClick={() => { setIndustry(i); setTemplateId(''); goNext(); }}
                  className={`text-left bg-white rounded-2xl card-shadow-sm border-2 p-5 hover:-translate-y-0.5 transition-all ${industry === i ? 'border-ASTER-600' : 'border-ASTER-100'}`}
                >
                  <p className="font-display font-bold text-ink-900">{i}</p>
                </button>
              ))}
              {templates === null && <p className="col-span-full text-slate-400">Loading sectors…</p>}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="max-w-3xl mx-auto">
            <h1 className="font-display font-extrabold text-3xl text-ink-900 text-center">Choose your template</h1>
            <p className="text-slate-500 mt-2 text-center">Built for {industry.toLowerCase()}, ready to fill with your business.</p>
            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              {templatesForIndustry.map((t) => (
                <button
                  key={t.id}
                  onClick={() => { setTemplateId(t.id); goNext(); }}
                  className={`text-left bg-white rounded-2xl card-shadow-sm border-2 p-5 hover:-translate-y-0.5 transition-all ${templateId === t.id ? 'border-ASTER-600' : 'border-ASTER-100'}`}
                >
                  <p className="font-display font-bold text-ink-900">{t.name}</p>
                  <p className="text-sm text-slate-500 mt-1">{t.description}</p>
                  <p className="text-xs text-slate-400 mt-3">{t.pageCount} pages · built for {t.primaryGoal.toLowerCase()}</p>
                </button>
              ))}
            </div>
            <button onClick={goBack} className="mt-6 text-sm font-semibold text-slate-400 hover:text-ink-900 flex items-center gap-1.5 mx-auto">
              <ArrowLeft size={14} /> Back
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="max-w-md mx-auto">
            <h1 className="font-display font-extrabold text-3xl text-ink-900 text-center">Tell us about your business</h1>
            <p className="text-slate-500 mt-2 text-center">
              {selectedTemplate ? <>Using <strong className="text-ink-900">{selectedTemplate.name}</strong>. </> : null}
              This fills in your site's real copy, everywhere.
            </p>
            <form
              onSubmit={(e) => { e.preventDefault(); createSite(); }}
              className="mt-8 bg-white rounded-[28px] card-shadow border border-ASTER-100 p-7 space-y-4"
            >
              <div>
                <label className="text-[13px] font-bold text-ink-900 block mb-1.5">Business name *</label>
                <input required value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-2xl px-4 py-3 text-[15px] outline-none transition-colors" />
              </div>
              <div>
                <label className="text-[13px] font-bold text-ink-900 block mb-1.5">Who is this for? *</label>
                <input required value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} placeholder="e.g. families in the neighborhood" className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-2xl px-4 py-3 text-[15px] outline-none transition-colors" />
              </div>
              <div>
                <label className="text-[13px] font-bold text-ink-900 block mb-1.5">What do you offer? *</label>
                <input required value={services} onChange={(e) => setServices(e.target.value)} placeholder="Comma-separated, e.g. Coffee, Pastries, Catering" className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-2xl px-4 py-3 text-[15px] outline-none transition-colors" />
              </div>
              {createError && <p className="text-rose-500 text-sm font-semibold">{createError}</p>}
              <button type="submit" disabled={creating || !templateId} className="w-full bg-ASTER-600 hover:bg-ASTER-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-full transition-all flex items-center justify-center gap-2">
                {creating ? <><Loader2 size={16} className="animate-spin" /> Creating your site…</> : <>Create my site <ArrowRight size={16} /></>}
              </button>
            </form>
            <button onClick={goBack} className="mt-6 text-sm font-semibold text-slate-400 hover:text-ink-900 flex items-center gap-1.5 mx-auto">
              <ArrowLeft size={14} /> Back
            </button>
          </div>
        )}

        {step === 3 && site && (
          <div className="max-w-sm mx-auto text-center">
            <h1 className="font-display font-extrabold text-3xl text-ink-900">Add your logo</h1>
            <p className="text-slate-500 mt-2">Optional, you can always add it later.</p>
            <div className="mt-8">
              <EditableImage src={site.logoUrl} onUpload={uploadLogo} className="w-32 h-32 mx-auto" rounded="rounded-3xl" label="Add logo" />
            </div>
            <button onClick={goNext} className="mt-8 bg-ASTER-600 hover:bg-ASTER-700 text-white font-bold px-8 py-3.5 rounded-full transition-all inline-flex items-center gap-2">
              Continue <ArrowRight size={16} />
            </button>
          </div>
        )}

        {step === 4 && site && homePage && (
          <div className="max-w-md mx-auto text-center">
            <h1 className="font-display font-extrabold text-3xl text-ink-900">Add a cover photo</h1>
            <p className="text-slate-500 mt-2">The first thing visitors see. Optional, you can always add it later.</p>
            <div className="mt-8">
              <EditableImage src={homePage.heroImageUrl} onUpload={uploadCover} className="w-full aspect-video" rounded="rounded-2xl" label="Add cover photo" />
            </div>
            <button onClick={goNext} className="mt-8 bg-ASTER-600 hover:bg-ASTER-700 text-white font-bold px-8 py-3.5 rounded-full transition-all inline-flex items-center gap-2">
              Continue <ArrowRight size={16} />
            </button>
          </div>
        )}

        {step === 5 && site && (
          <div>
            {site.status !== 'PUBLISHED' ? (
              <div className="max-w-sm mx-auto text-center">
                <Sparkles size={40} className="text-ASTER-600 mx-auto" />
                <h1 className="font-display font-extrabold text-3xl text-ink-900 mt-4">Ready to go live</h1>
                <p className="text-slate-500 mt-2">{site.businessName} is built. Publish it and get a real, working link.</p>
                <button onClick={publish} disabled={publishing} className="mt-8 bg-ASTER-600 hover:bg-ASTER-700 disabled:opacity-60 text-white font-bold px-8 py-4 rounded-full transition-all inline-flex items-center gap-2">
                  {publishing ? <><Loader2 size={16} className="animate-spin" /> Publishing…</> : <>Publish my site <ArrowRight size={16} /></>}
                </button>
              </div>
            ) : (
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-6">
                  <Check size={40} className="text-emerald-600 mx-auto" />
                  <h1 className="font-display font-extrabold text-3xl text-ink-900 mt-3">{site.businessName} is live</h1>
                  <p className="text-slate-500 mt-2">Under 3 minutes. Here's your real, working site.</p>
                  {publicUrl && (
                    <div className="mt-5 max-w-sm mx-auto text-left">
                      <PublicLinkCard businessName={site.businessName} publicUrl={publicUrl} />
                    </div>
                  )}
                </div>

                <div className="border border-ASTER-100 rounded-[28px] overflow-hidden bg-slate-50 max-h-[55vh] overflow-y-auto">
                  {homePage && <PublicSiteRenderer site={site} page={homePage} siteSlug={site.slug ?? ''} previewMode />}
                </div>

                <div className="text-center mt-8">
                  <button onClick={() => navigate(`/webos/${site.id}`)} className="bg-ink-950 hover:bg-ink-900 text-white font-bold px-8 py-3.5 rounded-full transition-all inline-flex items-center gap-2">
                    Go to dashboard <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
