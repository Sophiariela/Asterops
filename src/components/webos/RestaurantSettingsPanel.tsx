import { useEffect, useState, type FormEvent } from 'react';
import { api, ApiError } from '../../lib/api';
import type { Site } from '../../lib/webos/types';

const FIELD_CLASS = 'w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-2xl px-4 py-3 text-[15px] outline-none transition-colors';
const LABEL_CLASS = 'text-[13px] font-bold text-ink-900 block mb-1.5';
const INTERVALS = [15, 30, 45, 60, 90];

type FormState = { maxPartySize: string; reservationIntervalMinutes: number; openingTime: string; closingTime: string };

export default function RestaurantSettingsPanel({ site, onRefresh }: { site: Site; onRefresh: () => void }) {
  const [form, setForm] = useState<FormState>({
    maxPartySize: site.maxPartySize ? String(site.maxPartySize) : '',
    reservationIntervalMinutes: site.reservationIntervalMinutes,
    openingTime: site.openingTime ?? '',
    closingTime: site.closingTime ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setForm({
      maxPartySize: site.maxPartySize ? String(site.maxPartySize) : '',
      reservationIntervalMinutes: site.reservationIntervalMinutes,
      openingTime: site.openingTime ?? '',
      closingTime: site.closingTime ?? '',
    });
  }, [site]);

  const save = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError('');
    try {
      await api.patch(`/webos/sites/${site.id}`, {
        maxPartySize: form.maxPartySize ? Number(form.maxPartySize) : null,
        reservationIntervalMinutes: form.reservationIntervalMinutes,
        openingTime: form.openingTime,
        closingTime: form.closingTime,
      });
      setSaved(true);
      onRefresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not save restaurant settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={save} className="bg-white rounded-[28px] card-shadow border border-ASTER-100 p-6 space-y-4">
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Reservation Settings</p>
        <p className="text-xs text-slate-400 mt-1">Controls what guests can book on your public reservation form. Leave blank for no limit.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={LABEL_CLASS}>Maximum Guests</label>
          <input type="number" min={1} value={form.maxPartySize} onChange={(e) => setForm((f) => ({ ...f, maxPartySize: e.target.value }))} placeholder="No limit" className={FIELD_CLASS} />
          <p className="text-xs text-slate-400 mt-1.5">Larger parties are told to call instead.</p>
        </div>
        <div>
          <label className={LABEL_CLASS}>Reservation Interval</label>
          <select value={form.reservationIntervalMinutes} onChange={(e) => setForm((f) => ({ ...f, reservationIntervalMinutes: Number(e.target.value) }))} className={FIELD_CLASS}>
            {INTERVALS.map((m) => <option key={m} value={m}>Every {m} minutes</option>)}
          </select>
        </div>
        <div>
          <label className={LABEL_CLASS}>Opening Time</label>
          <input type="time" value={form.openingTime} onChange={(e) => setForm((f) => ({ ...f, openingTime: e.target.value }))} className={FIELD_CLASS} />
        </div>
        <div>
          <label className={LABEL_CLASS}>Closing Time</label>
          <input type="time" value={form.closingTime} onChange={(e) => setForm((f) => ({ ...f, closingTime: e.target.value }))} className={FIELD_CLASS} />
        </div>
      </div>
      <p className="text-xs text-slate-400">Set both opening and closing time to reject reservation requests outside your hours. Leave either blank for no restriction.</p>

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
