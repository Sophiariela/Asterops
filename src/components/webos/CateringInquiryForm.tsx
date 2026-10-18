import { useState, type FormEvent } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { api, ApiError } from '../../lib/api';

// Catering gets an event inquiry, not a table reservation — event date,
// type, guest count and package interest, mapped into the Lead model's
// free-text `message` with a distinct `source` tag.
export default function CateringInquiryForm({ siteId }: { siteId: string }) {
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({ eventDate: '', eventType: '', guestCount: '', package: '', name: '', email: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.eventDate || !form.name || !form.email) {
      setError('Please fill in the event date, name and email.');
      return;
    }
    setSubmitting(true);
    try {
      const message = [
        `Event date: ${form.eventDate}`,
        form.eventType ? `Event type: ${form.eventType}` : null,
        form.guestCount ? `Guest count: ${form.guestCount}` : null,
        form.package ? `Package: ${form.package}` : null,
        form.message ? `\n${form.message}` : null,
      ].filter(Boolean).join('\n');
      await api.post('/webos/public/leads', {
        siteId, name: form.name, email: form.email, phone: form.phone || undefined, message, source: 'catering-inquiry',
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
        <p className="text-sm text-slate-500 mt-1">We'll follow up with a quote for your event shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid sm:grid-cols-2 gap-3 max-w-lg">
      <div>
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block mb-1">Event date</label>
        <input required type="date" min={today} value={form.eventDate} onChange={(e) => setForm((f) => ({ ...f, eventDate: e.target.value }))} className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors" />
      </div>
      <input placeholder="Event type (e.g. wedding, corporate)" value={form.eventType} onChange={(e) => setForm((f) => ({ ...f, eventType: e.target.value }))} className="border-2 border-ASTER-100 focus:border-ASTER-600 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors" />
      <input type="number" min={1} placeholder="Guest count" value={form.guestCount} onChange={(e) => setForm((f) => ({ ...f, guestCount: e.target.value }))} className="border-2 border-ASTER-100 focus:border-ASTER-600 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors" />
      <input placeholder="Package of interest (optional)" value={form.package} onChange={(e) => setForm((f) => ({ ...f, package: e.target.value }))} className="border-2 border-ASTER-100 focus:border-ASTER-600 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors" />
      <input required placeholder="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="border-2 border-ASTER-100 focus:border-ASTER-600 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors" />
      <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="border-2 border-ASTER-100 focus:border-ASTER-600 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors" />
      <input placeholder="Phone (optional)" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="sm:col-span-2 border-2 border-ASTER-100 focus:border-ASTER-600 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors" />
      <textarea placeholder="Tell us about your event (optional)" rows={2} value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} className="sm:col-span-2 border-2 border-ASTER-100 focus:border-ASTER-600 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors resize-none" />
      {error && <p className="sm:col-span-2 text-rose-500 text-sm font-semibold">{error}</p>}
      <button type="submit" disabled={submitting} className="sm:col-span-2 bg-ASTER-600 hover:bg-ASTER-700 disabled:opacity-60 text-white font-bold text-sm py-2.5 rounded-full transition-all">
        {submitting ? 'Sending…' : 'Request a quote'}
      </button>
    </form>
  );
}
