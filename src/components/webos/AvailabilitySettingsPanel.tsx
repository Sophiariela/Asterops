import { useEffect, useState, type FormEvent } from 'react';
import { CalendarOff, X } from 'lucide-react';
import { api, ApiError } from '../../lib/api';
import type { BlockedDate, Site } from '../../lib/webos/types';

const FIELD_CLASS = 'w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-2xl px-4 py-3 text-[15px] outline-none transition-colors';
const LABEL_CLASS = 'text-[13px] font-bold text-ink-900 block mb-1.5';
const DAYS = [
  { value: 0, label: 'Sun' }, { value: 1, label: 'Mon' }, { value: 2, label: 'Tue' }, { value: 3, label: 'Wed' },
  { value: 4, label: 'Thu' }, { value: 5, label: 'Fri' }, { value: 6, label: 'Sat' },
];

type FormState = {
  workingDays: number[];
  appointmentDurationMinutes: number;
  appointmentBufferMinutes: number;
  appointmentCapacity: number;
  openingTime: string;
  closingTime: string;
};

// The real configuration behind appointment booking (Consultant,
// Professional Services, Salon, Education, Fitness): working days,
// business hours, per-appointment duration/buffer, how many
// simultaneous bookings the business can take, and specific days off.
// Every one of these feeds directly into availability.service's slot
// engine and double-booking guard on the server.
export default function AvailabilitySettingsPanel({ site, onRefresh }: { site: Site; onRefresh: () => void }) {
  const [form, setForm] = useState<FormState>({
    workingDays: site.workingDays,
    appointmentDurationMinutes: site.appointmentDurationMinutes,
    appointmentBufferMinutes: site.appointmentBufferMinutes,
    appointmentCapacity: site.appointmentCapacity,
    openingTime: site.openingTime ?? '09:00',
    closingTime: site.closingTime ?? '17:00',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [blockedDates, setBlockedDates] = useState<BlockedDate[] | null>(null);
  const [newBlockedDate, setNewBlockedDate] = useState('');
  const [blockedDateError, setBlockedDateError] = useState('');

  useEffect(() => {
    setForm({
      workingDays: site.workingDays,
      appointmentDurationMinutes: site.appointmentDurationMinutes,
      appointmentBufferMinutes: site.appointmentBufferMinutes,
      appointmentCapacity: site.appointmentCapacity,
      openingTime: site.openingTime ?? '09:00',
      closingTime: site.closingTime ?? '17:00',
    });
  }, [site]);

  const loadBlockedDates = () => {
    api.get<{ blockedDates: BlockedDate[] }>(`/webos/sites/${site.id}/blocked-dates`)
      .then((d) => setBlockedDates(d.blockedDates))
      .catch(() => setBlockedDates([]));
  };
  useEffect(loadBlockedDates, [site.id]);

  const toggleDay = (day: number) => {
    setForm((f) => ({
      ...f,
      workingDays: f.workingDays.includes(day) ? f.workingDays.filter((d) => d !== day) : [...f.workingDays, day].sort(),
    }));
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError('');
    try {
      await api.patch(`/webos/sites/${site.id}`, form);
      setSaved(true);
      onRefresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not save availability settings.');
    } finally {
      setSaving(false);
    }
  };

  const addBlockedDate = async (e: FormEvent) => {
    e.preventDefault();
    if (!newBlockedDate) return;
    setBlockedDateError('');
    try {
      await api.post(`/webos/sites/${site.id}/blocked-dates`, { date: newBlockedDate });
      setNewBlockedDate('');
      loadBlockedDates();
    } catch (err) {
      setBlockedDateError(err instanceof ApiError ? err.message : 'Could not add this date.');
    }
  };

  const removeBlockedDate = async (id: string) => {
    await api.del(`/webos/sites/${site.id}/blocked-dates/${id}`);
    loadBlockedDates();
  };

  return (
    <div className="space-y-5">
      <form onSubmit={save} className="bg-white rounded-[28px] card-shadow border border-ASTER-100 p-6 space-y-4">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Availability Settings</p>
          <p className="text-xs text-slate-400 mt-1">Controls exactly which days and times visitors can book — and how many bookings you can take at once.</p>
        </div>

        <div>
          <label className={LABEL_CLASS}>Working Days</label>
          <div className="flex gap-1.5 flex-wrap">
            {DAYS.map((d) => (
              <button
                key={d.value}
                type="button"
                onClick={() => toggleDay(d.value)}
                className={`text-xs font-bold px-3 py-2 rounded-xl border-2 transition-colors ${form.workingDays.includes(d.value) ? 'bg-ASTER-600 border-ASTER-600 text-white' : 'border-ASTER-100 text-slate-500 hover:border-ASTER-600'}`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={LABEL_CLASS}>Opening Time</label>
            <input type="time" value={form.openingTime} onChange={(e) => setForm((f) => ({ ...f, openingTime: e.target.value }))} className={FIELD_CLASS} />
          </div>
          <div>
            <label className={LABEL_CLASS}>Closing Time</label>
            <input type="time" value={form.closingTime} onChange={(e) => setForm((f) => ({ ...f, closingTime: e.target.value }))} className={FIELD_CLASS} />
          </div>
          <div>
            <label className={LABEL_CLASS}>Appointment Duration</label>
            <select value={form.appointmentDurationMinutes} onChange={(e) => setForm((f) => ({ ...f, appointmentDurationMinutes: Number(e.target.value) }))} className={FIELD_CLASS}>
              {[15, 30, 45, 60, 90, 120].map((m) => <option key={m} value={m}>{m} minutes</option>)}
            </select>
            <p className="text-xs text-slate-400 mt-1.5">Default length — a Service with its own duration overrides this.</p>
          </div>
          <div>
            <label className={LABEL_CLASS}>Buffer Between Appointments</label>
            <select value={form.appointmentBufferMinutes} onChange={(e) => setForm((f) => ({ ...f, appointmentBufferMinutes: Number(e.target.value) }))} className={FIELD_CLASS}>
              {[0, 5, 10, 15, 30].map((m) => <option key={m} value={m}>{m === 0 ? 'None' : `${m} minutes`}</option>)}
            </select>
          </div>
          <div>
            <label className={LABEL_CLASS}>Simultaneous Bookings</label>
            <input type="number" min={1} max={50} value={form.appointmentCapacity} onChange={(e) => setForm((f) => ({ ...f, appointmentCapacity: Number(e.target.value) }))} className={FIELD_CLASS} />
            <p className="text-xs text-slate-400 mt-1.5">How many appointments can overlap the same slot (e.g. chairs, rooms, staff).</p>
          </div>
        </div>

        {error && <p className="text-rose-500 text-sm font-semibold">{error}</p>}
        <div className="flex items-center gap-3">
          <button type="submit" disabled={saving} className="bg-ASTER-600 hover:bg-ASTER-700 disabled:opacity-60 text-white font-bold px-6 py-3 rounded-full transition-all">
            {saving ? 'Saving…' : 'Save changes'}
          </button>
          {saved && <span className="text-sm font-semibold text-emerald-600">Saved</span>}
        </div>
      </form>

      <div className="bg-white rounded-[28px] card-shadow border border-ASTER-100 p-6 space-y-4">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5"><CalendarOff size={13} /> Days Off</p>
          <p className="text-xs text-slate-400 mt-1">Fully blocks booking on a specific date (holidays, vacation) on top of your weekly schedule.</p>
        </div>
        <form onSubmit={addBlockedDate} className="flex items-center gap-2">
          <input type="date" value={newBlockedDate} onChange={(e) => setNewBlockedDate(e.target.value)} className="border-2 border-ASTER-100 focus:border-ASTER-600 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors" />
          <button type="submit" disabled={!newBlockedDate} className="bg-ink-950 hover:bg-ink-900 disabled:opacity-50 text-white font-bold text-sm px-4 py-2.5 rounded-full transition-all">Block date</button>
        </form>
        {blockedDateError && <p className="text-rose-500 text-sm font-semibold">{blockedDateError}</p>}
        <div className="flex flex-wrap gap-2">
          {(blockedDates ?? []).map((b) => (
            <span key={b.id} className="inline-flex items-center gap-1.5 text-xs font-semibold bg-slate-100 text-ink-900 px-3 py-1.5 rounded-full">
              {b.date.slice(0, 10)}
              <button type="button" onClick={() => removeBlockedDate(b.id)} aria-label="Remove"><X size={12} className="text-slate-400 hover:text-rose-600" /></button>
            </span>
          ))}
          {blockedDates && blockedDates.length === 0 && <p className="text-xs text-slate-400">No days off scheduled.</p>}
        </div>
      </div>
    </div>
  );
}
