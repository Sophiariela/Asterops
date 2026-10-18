import { useState, type FormEvent } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { api, ApiError } from '../../lib/api';

// Hotels get an accommodation inquiry, not a restaurant table reservation
// form — check-in/out, guests and room type map into the existing Lead
// model's free-text `message`, tagged with a distinct `source` so the
// owner dashboard (and notification email) can tell it apart from a
// generic contact message.
export default function HotelInquiryForm({ siteId }: { siteId: string }) {
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({ checkIn: '', checkOut: '', guests: '2', roomType: '', name: '', email: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.checkIn || !form.checkOut || !form.name || !form.email) {
      setError('Please fill in check-in, check-out, name and email.');
      return;
    }
    setSubmitting(true);
    try {
      const message = [
        `Check-in: ${form.checkIn}`,
        `Check-out: ${form.checkOut}`,
        `Guests: ${form.guests}`,
        form.roomType ? `Room type: ${form.roomType}` : null,
        form.message ? `\n${form.message}` : null,
      ].filter(Boolean).join('\n');
      await api.post('/webos/public/leads', {
        siteId, name: form.name, email: form.email, phone: form.phone || undefined, message, source: 'accommodation-inquiry',
      });
      setSent(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not send this inquiry.');
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center py-8 max-w-lg">
        <CheckCircle2 className="mx-auto text-emerald-600" size={32} />
        <p className="font-display font-bold text-lg text-ink-900 mt-3">Inquiry sent!</p>
        <p className="text-sm text-slate-500 mt-1">We'll check availability and get back to you shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid sm:grid-cols-2 gap-3 max-w-lg">
      <div>
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block mb-1">Check-in</label>
        <input required type="date" min={today} value={form.checkIn} onChange={(e) => setForm((f) => ({ ...f, checkIn: e.target.value }))} className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors" />
      </div>
      <div>
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block mb-1">Check-out</label>
        <input required type="date" min={form.checkIn || today} value={form.checkOut} onChange={(e) => setForm((f) => ({ ...f, checkOut: e.target.value }))} className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors" />
      </div>
      <select value={form.guests} onChange={(e) => setForm((f) => ({ ...f, guests: e.target.value }))} className="border-2 border-ASTER-100 focus:border-ASTER-600 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors">
        {Array.from({ length: 8 }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n} {n === 1 ? 'guest' : 'guests'}</option>)}
      </select>
      <input placeholder="Preferred room type (optional)" value={form.roomType} onChange={(e) => setForm((f) => ({ ...f, roomType: e.target.value }))} className="border-2 border-ASTER-100 focus:border-ASTER-600 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors" />
      <input required placeholder="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="border-2 border-ASTER-100 focus:border-ASTER-600 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors" />
      <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="border-2 border-ASTER-100 focus:border-ASTER-600 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors" />
      <input placeholder="Phone (optional)" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="sm:col-span-2 border-2 border-ASTER-100 focus:border-ASTER-600 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors" />
      <textarea placeholder="Anything else we should know? (optional)" rows={2} value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} className="sm:col-span-2 border-2 border-ASTER-100 focus:border-ASTER-600 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors resize-none" />
      {error && <p className="sm:col-span-2 text-rose-500 text-sm font-semibold">{error}</p>}
      <button type="submit" disabled={submitting} className="sm:col-span-2 bg-ASTER-600 hover:bg-ASTER-700 disabled:opacity-60 text-white font-bold text-sm py-2.5 rounded-full transition-all">
        {submitting ? 'Sending…' : 'Check availability'}
      </button>
    </form>
  );
}
