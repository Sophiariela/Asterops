import { useState, type FormEvent } from 'react';
import { api, ApiError } from '../../lib/api';
import type { Site } from '../../lib/webos/types';

// Local/home services only — the geographic area a quote request applies
// to, shown as a trust-building badge on the public homepage and as a
// placeholder hint on the quote form.
export default function ServiceAreaPanel({ site, onRefresh }: { site: Site; onRefresh: () => void }) {
  const [serviceArea, setServiceArea] = useState(site.serviceArea ?? '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const save = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError('');
    try {
      await api.patch(`/webos/sites/${site.id}`, { serviceArea });
      setSaved(true);
      onRefresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not save your service area.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={save} className="bg-white rounded-[28px] card-shadow border border-ASTER-100 p-6 space-y-4">
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Service Area</p>
        <p className="text-xs text-slate-400 mt-1">Shown on your homepage and quote form, e.g. "Greater Boston Area" or "Austin, TX and surrounding suburbs".</p>
      </div>
      <input value={serviceArea} onChange={(e) => setServiceArea(e.target.value)} placeholder="e.g. Greater Boston Area" className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-2xl px-4 py-3 text-[15px] outline-none transition-colors" />
      {error && <p className="text-rose-500 text-sm font-semibold">{error}</p>}
      <div className="flex items-center gap-3">
        <button type="submit" disabled={saving} className="bg-ASTER-600 hover:bg-ASTER-700 disabled:opacity-60 text-white font-bold px-6 py-3 rounded-full transition-all">
          {saving ? 'Saving…' : 'Save changes'}
        </button>
        {saved && <span className="text-sm font-semibold text-emerald-600">Saved</span>}
      </div>
    </form>
  );
}
