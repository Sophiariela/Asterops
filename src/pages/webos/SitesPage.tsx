import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Globe2, ArrowRight } from 'lucide-react';
import { api, ApiError } from '../../lib/api';
import type { Playbook, PlaybookKey, Site } from '../../lib/webos/types';

type FormState = {
  businessName: string;
  industry: string;
  services: string;
  targetAudience: string;
  playbook: PlaybookKey | '';
};

const emptyForm: FormState = { businessName: '', industry: '', services: '', targetAudience: '', playbook: '' };

export default function SitesPage() {
  const navigate = useNavigate();
  const [sites, setSites] = useState<Site[] | null>(null);
  const [playbooks, setPlaybooks] = useState<Playbook[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState('');
  const [generating, setGenerating] = useState(false);

  const load = () => {
    api.get<{ sites: Site[] }>('/webos/sites').then((data) => setSites(data.sites)).catch(() => setSites([]));
  };

  useEffect(load, []);
  useEffect(() => {
    api.get<{ playbooks: Playbook[] }>('/webos/sites/playbooks').then((data) => setPlaybooks(data.playbooks)).catch(() => {});
  }, []);

  const openCreate = () => {
    setForm(emptyForm);
    setError('');
    setShowForm(true);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.playbook) {
      setError('Choose a playbook.');
      return;
    }
    setGenerating(true);
    try {
      const data = await api.post<{ site: Site }>('/webos/sites/generate', {
        businessName: form.businessName,
        industry: form.industry,
        targetAudience: form.targetAudience,
        playbook: form.playbook,
        services: form.services.split(',').map((s) => s.trim()).filter(Boolean),
      });
      navigate(`/webos/${data.site.id}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not generate this site.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-ink-900">WebOS</h1>
          <p className="text-slate-500 mt-2 text-sm">Your business acquisition infrastructure — generate a site, then let WebOS help it attract, convert and build trust.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-ASTER-600 hover:bg-ASTER-700 text-white font-bold px-5 py-2.5 rounded-full transition-all whitespace-nowrap"
        >
          <Plus size={16} /> Generate a site
        </button>
      </div>

      {sites && sites.length === 0 && (
        <div className="mt-10 bg-white rounded-[28px] card-shadow border border-ASTER-100 p-10 text-center">
          <Globe2 size={40} className="text-ASTER-600 mx-auto" />
          <p className="text-slate-600 mt-4">No sites yet. Generate your first one from a playbook.</p>
        </div>
      )}

      <div className="mt-8 grid sm:grid-cols-2 gap-5">
        {sites?.map((s) => (
          <button
            key={s.id}
            onClick={() => navigate(`/webos/${s.id}`)}
            className="text-left bg-white rounded-[28px] card-shadow border border-ASTER-100 p-6 hover:-translate-y-0.5 transition-transform"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-display font-bold text-lg text-ink-900">{s.businessName}</p>
                <p className="text-slate-500 text-sm mt-1">{s.industry}</p>
              </div>
              <span className={`text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap ${s.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {s.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-4">{s._count?.pages ?? 0} pages · {s._count?.testimonials ?? 0} testimonials · {s._count?.leads ?? 0} leads</p>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-ASTER-600 mt-4">
              Open <ArrowRight size={13} />
            </span>
          </button>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/40" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-[28px] card-shadow border border-ASTER-100 w-full max-w-lg max-h-[85vh] overflow-y-auto p-7" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-display font-extrabold text-xl text-ink-900 mb-5">Generate a site</h2>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="text-[13px] font-bold text-ink-900 block mb-1.5">Business name *</label>
                <input required value={form.businessName} onChange={(e) => setForm((f) => ({ ...f, businessName: e.target.value }))} className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-2xl px-4 py-3 text-[15px] outline-none transition-colors" />
              </div>
              <div>
                <label className="text-[13px] font-bold text-ink-900 block mb-1.5">Industry *</label>
                <input required value={form.industry} onChange={(e) => setForm((f) => ({ ...f, industry: e.target.value }))} placeholder="e.g. bakery, SaaS analytics, personal training" className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-2xl px-4 py-3 text-[15px] outline-none transition-colors" />
              </div>
              <div>
                <label className="text-[13px] font-bold text-ink-900 block mb-1.5">Services (comma-separated) *</label>
                <input required value={form.services} onChange={(e) => setForm((f) => ({ ...f, services: e.target.value }))} placeholder="e.g. Bread, Cakes, Coffee bar" className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-2xl px-4 py-3 text-[15px] outline-none transition-colors" />
              </div>
              <div>
                <label className="text-[13px] font-bold text-ink-900 block mb-1.5">Target audience *</label>
                <input required value={form.targetAudience} onChange={(e) => setForm((f) => ({ ...f, targetAudience: e.target.value }))} placeholder="e.g. families in the neighborhood" className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-2xl px-4 py-3 text-[15px] outline-none transition-colors" />
              </div>
              <div>
                <label className="text-[13px] font-bold text-ink-900 block mb-1.5">Playbook *</label>
                <div className="grid grid-cols-2 gap-2">
                  {playbooks.map((p) => (
                    <button
                      type="button"
                      key={p.key}
                      onClick={() => setForm((f) => ({ ...f, playbook: p.key }))}
                      className={`text-left border-2 rounded-2xl px-3.5 py-3 transition-colors ${form.playbook === p.key ? 'border-ASTER-600 bg-ASTER-50' : 'border-ASTER-100 hover:border-ASTER-300'}`}
                    >
                      <p className="text-sm font-bold text-ink-900">{p.label}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{p.description}</p>
                    </button>
                  ))}
                </div>
              </div>
              {error && <p className="text-rose-500 text-sm font-semibold">{error}</p>}
              <button type="submit" disabled={generating} className="w-full bg-ASTER-600 hover:bg-ASTER-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-full transition-all">
                {generating ? 'Generating…' : 'Generate site'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
