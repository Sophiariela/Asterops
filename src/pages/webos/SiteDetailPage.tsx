import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Sparkles, Pencil, Trash2, Plus, PlayCircle } from 'lucide-react';
import { api, ApiError } from '../../lib/api';
import Modal from '../../components/commerce/Modal';
import type {
  Site, Page, Testimonial, WebsiteHealth, ConversionAudit, TrustGap, RecommendedAction, Lead, LeadStatus,
} from '../../lib/webos/types';

function scoreColor(score: number) {
  if (score >= 70) return 'text-emerald-600';
  if (score >= 45) return 'text-amber-500';
  return 'text-rose-600';
}

const LEAD_STATUSES: LeadStatus[] = ['NEW', 'QUALIFIED', 'CONVERTED', 'LOST'];
const LEAD_STATUS_STYLE: Record<LeadStatus, string> = {
  NEW: 'bg-amber-100 text-amber-700',
  QUALIFIED: 'bg-blue-100 text-blue-700',
  CONVERTED: 'bg-emerald-100 text-emerald-700',
  LOST: 'bg-slate-200 text-slate-500',
};

export default function SiteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [site, setSite] = useState<Site | null>(null);
  const [health, setHealth] = useState<WebsiteHealth | null>(null);
  const [audit, setAudit] = useState<ConversionAudit | null>(null);
  const [auditRunning, setAuditRunning] = useState(false);
  const [trust, setTrust] = useState<TrustGap | null>(null);
  const [actions, setActions] = useState<RecommendedAction[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);

  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [pageForm, setPageForm] = useState({ heroHeadline: '', heroSubheadline: '', ctaLabel: '', seoTitle: '', seoDescription: '' });
  const [pageSaving, setPageSaving] = useState(false);
  const [pageError, setPageError] = useState('');

  const [lunaReview, setLunaReview] = useState<{ pageId: string; lines: string[] } | null>(null);
  const [lunaError, setLunaError] = useState('');
  const [lunaLoadingPageId, setLunaLoadingPageId] = useState<string | null>(null);

  const [showTestimonialForm, setShowTestimonialForm] = useState(false);
  const [testimonialForm, setTestimonialForm] = useState({ authorName: '', authorRole: '', quote: '', rating: '5' });
  const [testimonialError, setTestimonialError] = useState('');
  const [testimonialSaving, setTestimonialSaving] = useState(false);

  const loadCore = () => {
    if (!id) return;
    api.get<{ site: Site }>(`/webos/sites/${id}`).then((data) => setSite(data.site)).catch(() => navigate('/webos', { replace: true }));
    api.get<{ health: WebsiteHealth }>(`/webos/sites/${id}/analytics/health-score`).then((data) => setHealth(data.health)).catch(() => {});
    api.get<{ trust: TrustGap }>(`/webos/sites/${id}/analytics/trust-gaps`).then((data) => setTrust(data.trust)).catch(() => {});
    api.get<{ actions: RecommendedAction[] }>(`/webos/sites/${id}/analytics/action-center`).then((data) => setActions(data.actions)).catch(() => {});
    api.get<{ leads: Lead[] }>(`/webos/sites/${id}/leads`).then((data) => setLeads(data.leads)).catch(() => {});
  };

  useEffect(loadCore, [id]);

  const runAudit = async () => {
    if (!id) return;
    setAuditRunning(true);
    try {
      const data = await api.post<{ audit: ConversionAudit }>(`/webos/sites/${id}/analytics/conversion-audit`);
      setAudit(data.audit);
    } finally {
      setAuditRunning(false);
    }
  };

  const publish = async () => {
    if (!id) return;
    const data = await api.post<{ site: Site }>(`/webos/sites/${id}/publish`);
    setSite((s) => (s ? { ...s, status: data.site.status } : s));
  };

  const openEditPage = (page: Page) => {
    setEditingPage(page);
    setPageForm({
      heroHeadline: page.heroHeadline,
      heroSubheadline: page.heroSubheadline,
      ctaLabel: page.ctaLabel,
      seoTitle: page.seoTitle ?? '',
      seoDescription: page.seoDescription ?? '',
    });
    setPageError('');
  };

  const savePage = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingPage) return;
    setPageError('');
    setPageSaving(true);
    try {
      await api.patch(`/webos/pages/${editingPage.id}`, {
        heroHeadline: pageForm.heroHeadline,
        heroSubheadline: pageForm.heroSubheadline,
        ctaLabel: pageForm.ctaLabel,
        seoTitle: pageForm.seoTitle || null,
        seoDescription: pageForm.seoDescription || null,
      });
      setEditingPage(null);
      loadCore();
    } catch (err) {
      setPageError(err instanceof ApiError ? err.message : 'Could not save this page.');
    } finally {
      setPageSaving(false);
    }
  };

  const askLuna = async (pageId: string) => {
    if (!id) return;
    setLunaError('');
    setLunaReview(null);
    setLunaLoadingPageId(pageId);
    try {
      const data = await api.post<{ review: string[] }>(`/webos/sites/${id}/analytics/luna/${pageId}`);
      setLunaReview({ pageId, lines: data.review });
    } catch (err) {
      setLunaError(err instanceof ApiError ? err.message : 'Could not reach Luna AI.');
      setLunaReview({ pageId, lines: [] });
    } finally {
      setLunaLoadingPageId(null);
    }
  };

  const addTestimonial = async (e: FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setTestimonialError('');
    setTestimonialSaving(true);
    try {
      await api.post(`/webos/sites/${id}/testimonials`, {
        authorName: testimonialForm.authorName,
        authorRole: testimonialForm.authorRole || undefined,
        quote: testimonialForm.quote,
        rating: Number(testimonialForm.rating),
      });
      setShowTestimonialForm(false);
      setTestimonialForm({ authorName: '', authorRole: '', quote: '', rating: '5' });
      loadCore();
    } catch (err) {
      setTestimonialError(err instanceof ApiError ? err.message : 'Could not add this testimonial.');
    } finally {
      setTestimonialSaving(false);
    }
  };

  const deleteTestimonial = async (testimonialId: string) => {
    if (!id) return;
    await api.del(`/webos/sites/${id}/testimonials/${testimonialId}`);
    loadCore();
  };

  const updateLeadStatus = async (leadId: string, status: LeadStatus) => {
    if (!id) return;
    await api.patch(`/webos/sites/${id}/leads/${leadId}/status`, { status });
    setLeads((rows) => rows.map((l) => (l.id === leadId ? { ...l, status } : l)));
  };

  if (!site) {
    return <p className="text-slate-400">Loading site…</p>;
  }

  return (
    <div>
      <Link to="/webos" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-ASTER-600 transition-colors mb-6">
        <ArrowLeft size={16} /> Back to sites
      </Link>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-ink-900">{site.businessName}</h1>
          <p className="text-slate-500 mt-1.5 text-sm">{site.industry} · built for {site.targetAudience}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${site.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{site.status}</span>
          {site.status === 'DRAFT' && (
            <button onClick={publish} className="bg-ASTER-600 hover:bg-ASTER-700 text-white font-bold text-sm px-4 py-2 rounded-full transition-all">
              Mark ready to publish
            </button>
          )}
        </div>
      </div>
      {site.status === 'DRAFT' && (
        <p className="text-xs text-slate-400 mt-2">This flags the site as ready — WebOS doesn't yet serve pages to a live public URL.</p>
      )}

      {/* Health Score */}
      <div className="mt-8 grid lg:grid-cols-[220px_1fr] gap-6">
        <div className="bg-ink-950 text-white rounded-[28px] card-shadow p-6 text-center flex flex-col justify-center">
          <p className="text-white/60 text-xs font-bold uppercase tracking-wide">Website Score</p>
          <p className={`font-display font-extrabold text-5xl mt-2 ${health ? scoreColor(health.score) : ''}`}>{health?.score ?? '—'}</p>
        </div>
        <div className="bg-white rounded-[28px] card-shadow border border-ASTER-100 p-6">
          {health && (
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-wide mb-2">Strengths</p>
                <ul className="space-y-1.5">
                  {health.strengths.map((s, i) => <li key={i} className="text-sm text-ink-900">✓ {s}</li>)}
                </ul>
              </div>
              <div>
                <p className="text-xs font-bold text-amber-600 uppercase tracking-wide mb-2">Issues</p>
                <ul className="space-y-1.5">
                  {health.issues.map((s, i) => <li key={i} className="text-sm text-ink-900">⚠ {s}</li>)}
                  {health.issues.length === 0 && <li className="text-sm text-slate-400">None found.</li>}
                </ul>
              </div>
              <div className="sm:col-span-2 pt-3 border-t border-ASTER-100 flex flex-wrap gap-2">
                {health.factors.map((f) => (
                  <span key={f.key} className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${f.available ? 'bg-ASTER-50 text-ASTER-600' : 'bg-slate-100 text-slate-400'}`}>
                    {f.label}: {f.available ? f.score : 'N/A'}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Center */}
      {actions.length > 0 && (
        <div className="mt-6 bg-white rounded-[28px] card-shadow border border-ASTER-100 p-6">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-4">Recommended actions</p>
          <ol className="space-y-2.5 list-decimal list-inside">
            {actions.map((a, i) => <li key={i} className="text-sm text-ink-900">{a.label}</li>)}
          </ol>
        </div>
      )}

      {/* Conversion Audit */}
      <div className="mt-6 bg-white rounded-[28px] card-shadow border border-ASTER-100 p-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Conversion Audit</p>
          <button onClick={runAudit} disabled={auditRunning} className="flex items-center gap-2 text-sm font-bold text-ASTER-600 hover:text-ASTER-700 disabled:opacity-60">
            <PlayCircle size={16} /> {auditRunning ? 'Running…' : 'Run Website Audit'}
          </button>
        </div>
        {audit && (
          <div className="mt-4">
            <p className={`font-display font-extrabold text-3xl ${scoreColor(audit.score)}`}>{audit.score}<span className="text-base text-slate-300">/100</span></p>
            <ul className="mt-4 space-y-2">
              {audit.recommendations.map((r, i) => <li key={i} className="text-sm text-ink-900">• {r}</li>)}
              {audit.recommendations.length === 0 && <li className="text-sm text-slate-400">No issues found.</li>}
            </ul>
          </div>
        )}
      </div>

      {/* Pages */}
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mt-10 mb-4">Pages</p>
      <div className="space-y-3">
        {site.pages.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl card-shadow-sm border border-ASTER-100 p-5">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <p className="font-semibold text-ink-900">{p.name} <span className="text-slate-400 text-xs font-normal">/{p.slug}</span></p>
                <p className="text-sm text-ink-900 mt-1">{p.heroHeadline}</p>
                <p className="text-xs text-slate-500 mt-0.5">{p.heroSubheadline}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[11px] font-bold text-ASTER-600 bg-ASTER-50 px-2 py-0.5 rounded-full">{p.ctaLabel}</span>
                  {p.hasLeadForm && <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">Lead form</span>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => askLuna(p.id)} disabled={lunaLoadingPageId === p.id} className="flex items-center gap-1.5 text-xs font-bold text-white bg-gradient-to-br from-ASTER-700 to-ASTER-500 px-3 py-2 rounded-full disabled:opacity-60">
                  <Sparkles size={13} /> {lunaLoadingPageId === p.id ? 'Thinking…' : 'Ask Luna'}
                </button>
                <button onClick={() => openEditPage(p)} className="p-2 rounded-full text-slate-400 hover:text-ASTER-600 hover:bg-ASTER-50 transition-colors" aria-label={`Edit ${p.name}`}>
                  <Pencil size={15} />
                </button>
              </div>
            </div>
            {lunaReview?.pageId === p.id && (
              <div className="mt-3 pt-3 border-t border-ASTER-100">
                {lunaReview.lines.length > 0 ? (
                  <ul className="space-y-1.5">
                    {lunaReview.lines.map((l, i) => <li key={i} className="text-sm text-ink-900">• {l}</li>)}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-500">{lunaError}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Trust Engine */}
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mt-10 mb-4">Trust Engine</p>
      <div className="bg-white rounded-[28px] card-shadow border border-ASTER-100 p-6">
        {trust && (
          <p className={`text-sm font-semibold mb-4 ${trust.hasGap ? 'text-amber-600' : 'text-emerald-600'}`}>
            {trust.message} {trust.recommendation && `Recommended: ${trust.recommendation}`}
          </p>
        )}
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Testimonials ({site.testimonials.length})</p>
          <button onClick={() => setShowTestimonialForm(true)} className="flex items-center gap-1.5 text-xs font-bold text-ASTER-600 hover:text-ASTER-700">
            <Plus size={14} /> Add testimonial
          </button>
        </div>
        <div className="space-y-3">
          {site.testimonials.map((t: Testimonial) => (
            <div key={t.id} className="flex items-start justify-between gap-3 bg-slate-50 rounded-2xl p-4">
              <div>
                <p className="text-sm text-ink-900">"{t.quote}"</p>
                <p className="text-xs text-slate-500 mt-1.5 font-semibold">{t.authorName}{t.authorRole ? `, ${t.authorRole}` : ''}</p>
              </div>
              <button onClick={() => deleteTestimonial(t.id)} className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors" aria-label="Delete testimonial">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          {site.testimonials.length === 0 && <p className="text-sm text-slate-400">None yet.</p>}
        </div>
      </div>

      {/* Leads */}
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mt-10 mb-4">Leads</p>
      <div className="bg-white rounded-[28px] card-shadow border border-ASTER-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-400 text-left">
            <tr>
              <th className="px-6 py-3 font-semibold">Contact</th>
              <th className="px-6 py-3 font-semibold">Page</th>
              <th className="px-6 py-3 font-semibold">Message</th>
              <th className="px-6 py-3 font-semibold">Status</th>
              <th className="px-6 py-3 font-semibold">Received</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ASTER-100">
            {leads.map((l) => (
              <tr key={l.id}>
                <td className="px-6 py-4">
                  <p className="font-semibold text-ink-900">{l.name ?? '—'}</p>
                  <p className="text-slate-400 text-xs">{l.email}</p>
                </td>
                <td className="px-6 py-4 text-slate-600">{l.page?.name ?? '—'}</td>
                <td className="px-6 py-4 text-slate-500 text-xs max-w-[220px] truncate">{l.message ?? '—'}</td>
                <td className="px-6 py-4">
                  <select
                    value={l.status}
                    onChange={(e) => updateLeadStatus(l.id, e.target.value as LeadStatus)}
                    className={`text-xs font-bold px-2.5 py-1.5 rounded-full outline-none border-0 ${LEAD_STATUS_STYLE[l.status]}`}
                  >
                    {LEAD_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="px-6 py-4 text-slate-400 text-xs">{new Date(l.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-10 text-center text-slate-400">No leads yet — this needs a live, publicly-hosted page with a lead form to start filling in.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {editingPage && (
        <Modal title={`Edit page — ${editingPage.name}`} onClose={() => setEditingPage(null)}>
          <form onSubmit={savePage} className="space-y-4">
            <div>
              <label className="text-[13px] font-bold text-ink-900 block mb-1.5">Headline</label>
              <input value={pageForm.heroHeadline} onChange={(e) => setPageForm((f) => ({ ...f, heroHeadline: e.target.value }))} className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-2xl px-4 py-3 text-[15px] outline-none transition-colors" />
            </div>
            <div>
              <label className="text-[13px] font-bold text-ink-900 block mb-1.5">Subheadline</label>
              <textarea value={pageForm.heroSubheadline} onChange={(e) => setPageForm((f) => ({ ...f, heroSubheadline: e.target.value }))} rows={2} className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-2xl px-4 py-3 text-[15px] outline-none transition-colors resize-none" />
            </div>
            <div>
              <label className="text-[13px] font-bold text-ink-900 block mb-1.5">CTA label</label>
              <input value={pageForm.ctaLabel} onChange={(e) => setPageForm((f) => ({ ...f, ctaLabel: e.target.value }))} className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-2xl px-4 py-3 text-[15px] outline-none transition-colors" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[13px] font-bold text-ink-900 block mb-1.5">SEO title</label>
                <input value={pageForm.seoTitle} onChange={(e) => setPageForm((f) => ({ ...f, seoTitle: e.target.value }))} className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-2xl px-4 py-3 text-[15px] outline-none transition-colors" />
              </div>
              <div>
                <label className="text-[13px] font-bold text-ink-900 block mb-1.5">SEO description</label>
                <input value={pageForm.seoDescription} onChange={(e) => setPageForm((f) => ({ ...f, seoDescription: e.target.value }))} className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-2xl px-4 py-3 text-[15px] outline-none transition-colors" />
              </div>
            </div>
            {pageError && <p className="text-rose-500 text-sm font-semibold">{pageError}</p>}
            <button type="submit" disabled={pageSaving} className="w-full bg-ASTER-600 hover:bg-ASTER-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-full transition-all">
              {pageSaving ? 'Saving…' : 'Save changes'}
            </button>
          </form>
        </Modal>
      )}

      {showTestimonialForm && (
        <Modal title="Add testimonial" onClose={() => setShowTestimonialForm(false)}>
          <form onSubmit={addTestimonial} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[13px] font-bold text-ink-900 block mb-1.5">Author name *</label>
                <input required value={testimonialForm.authorName} onChange={(e) => setTestimonialForm((f) => ({ ...f, authorName: e.target.value }))} className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-2xl px-4 py-3 text-[15px] outline-none transition-colors" />
              </div>
              <div>
                <label className="text-[13px] font-bold text-ink-900 block mb-1.5">Role/company</label>
                <input value={testimonialForm.authorRole} onChange={(e) => setTestimonialForm((f) => ({ ...f, authorRole: e.target.value }))} className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-2xl px-4 py-3 text-[15px] outline-none transition-colors" />
              </div>
            </div>
            <div>
              <label className="text-[13px] font-bold text-ink-900 block mb-1.5">Quote *</label>
              <textarea required value={testimonialForm.quote} onChange={(e) => setTestimonialForm((f) => ({ ...f, quote: e.target.value }))} rows={3} className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-2xl px-4 py-3 text-[15px] outline-none transition-colors resize-none" />
            </div>
            <div>
              <label className="text-[13px] font-bold text-ink-900 block mb-1.5">Rating</label>
              <select value={testimonialForm.rating} onChange={(e) => setTestimonialForm((f) => ({ ...f, rating: e.target.value }))} className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-2xl px-4 py-3 text-[15px] outline-none transition-colors">
                {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} star{n > 1 ? 's' : ''}</option>)}
              </select>
            </div>
            {testimonialError && <p className="text-rose-500 text-sm font-semibold">{testimonialError}</p>}
            <button type="submit" disabled={testimonialSaving} className="w-full bg-ASTER-600 hover:bg-ASTER-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-full transition-all">
              {testimonialSaving ? 'Saving…' : 'Add testimonial'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
