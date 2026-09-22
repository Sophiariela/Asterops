import { useState, type FormEvent } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { api, ApiError } from '../../lib/api';

export default function ReservationBookingForm({ siteId }: { siteId: string }) {
  const [form, setForm] = useState({ date: '', time: '', partySize: '2', name: '', email: '', phone: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [confirmed, setConfirmed] = useState<{ name: string; date: string; time: string; partySize: string } | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.date || !form.time || !form.name || !form.email) {
      setError('Please fill in date, time, name and email.');
      return;
    }
    setSubmitting(true);
    try {
      const reservationAt = new Date(`${form.date}T${form.time}`).toISOString();
      await api.post('/webos/public/reservations', {
        siteId,
        customerName: form.name,
        customerEmail: form.email,
        customerPhone: form.phone || undefined,
        partySize: Number(form.partySize),
        reservationAt,
        notes: form.notes || undefined,
      });
      setConfirmed({ name: form.name, date: form.date, time: form.time, partySize: form.partySize });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not submit this reservation.');
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmed) {
    return (
      <div className="text-center py-8 max-w-lg mx-auto">
        <CheckCircle2 className="mx-auto text-emerald-600" size={32} />
        <p className="font-display font-bold text-lg text-ink-900 mt-3">Reservation requested!</p>
        <p className="text-sm text-slate-500 mt-1">
          {confirmed.name}, party of {confirmed.partySize} on {confirmed.date} at {confirmed.time}. We'll confirm shortly.
        </p>
        <button onClick={() => setConfirmed(null)} className="mt-4 text-sm font-bold text-ASTER-600 hover:text-ASTER-700">
          Make another reservation
        </button>
      </div>
    );
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <form onSubmit={submit} className="grid sm:grid-cols-2 gap-3 max-w-lg">
      <input required type="date" min={today} value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} className="border-2 border-ASTER-100 focus:border-ASTER-600 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors" />
      <input required type="time" value={form.time} onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))} className="border-2 border-ASTER-100 focus:border-ASTER-600 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors" />
      <select value={form.partySize} onChange={(e) => setForm((f) => ({ ...f, partySize: e.target.value }))} className="sm:col-span-2 border-2 border-ASTER-100 focus:border-ASTER-600 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n} {n === 1 ? 'guest' : 'guests'}</option>)}
        <option value={12}>10+ guests</option>
      </select>
      <input required placeholder="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="border-2 border-ASTER-100 focus:border-ASTER-600 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors" />
      <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="border-2 border-ASTER-100 focus:border-ASTER-600 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors" />
      <input placeholder="Phone (optional)" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="sm:col-span-2 border-2 border-ASTER-100 focus:border-ASTER-600 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors" />
      <textarea placeholder="Special requests (optional)" rows={2} value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} className="sm:col-span-2 border-2 border-ASTER-100 focus:border-ASTER-600 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors resize-none" />
      {error && <p className="sm:col-span-2 text-rose-500 text-sm font-semibold">{error}</p>}
      <button type="submit" disabled={submitting} className="sm:col-span-2 bg-ASTER-600 hover:bg-ASTER-700 disabled:opacity-60 text-white font-bold text-sm py-2.5 rounded-full transition-all">
        {submitting ? 'Submitting…' : 'Request reservation'}
      </button>
    </form>
  );
}
