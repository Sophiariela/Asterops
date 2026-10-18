import { useState, type FormEvent } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { api, ApiError } from '../../lib/api';

// Local/home services get a quote request, not a generic appointment —
// the service needed, address/area and a preferred date, mapped into the
// Lead model's free-text `message` with a distinct `source` tag so it
// shows up clearly in the owner's dashboard as a quote, not a vague
// "contact" message.
export default function QuoteRequestForm({ siteId, serviceArea }: { siteId: string; serviceArea?: string | null }) {
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({ service: '', address: '', preferredDate: '', name: '', email: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.service || !form.name || !form.email) {
      setError('Please fill in the service needed, name and email.');
      return;
    }
    setSubmitting(true);
    try {
      const message = [
        `Service needed: ${form.service}`,
        form.address ? `Address/area: ${form.address}` : null,
        form.preferredDate ? `Preferred date: ${form.preferredDate}` : null,
        form.message ? `\n${form.message}` : null,
      ].filter(Boolean).join('\n');
      await api.post('/webos/public/leads', {
        siteId, name: form.name, email: form.email, phone: form.phone || undefined, message, source: 'quote-request',
      });
      setSent(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not send this request.');
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center py-8 max-w-lg">
        <CheckCircle2 className="mx-auto text-emerald-600" size={32} />
        <p className="font-display font-bold text-lg text-ink-900 mt-3">Request sent!</p>
        <p className="text-sm text-slate-500 mt-1">We'll follow up with a quote shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid sm:grid-cols-2 gap-3 max-w-lg">
      <input required placeholder="Service needed" value={form.service} onChange={(e) => setForm((f) => ({ ...f, service: e.target.value }))} className="sm:col-span-2 border-2 border-ASTER-100 focus:border-ASTER-600 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors" />
      <input placeholder={serviceArea ? `Address (we serve ${serviceArea})` : 'Address / area'} value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} className="sm:col-span-2 border-2 border-ASTER-100 focus:border-ASTER-600 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors" />
      <input type="date" min={today} placeholder="Preferred date (optional)" value={form.preferredDate} onChange={(e) => setForm((f) => ({ ...f, preferredDate: e.target.value }))} className="sm:col-span-2 border-2 border-ASTER-100 focus:border-ASTER-600 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors text-slate-500" />
      <input required placeholder="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="border-2 border-ASTER-100 focus:border-ASTER-600 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors" />
      <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="border-2 border-ASTER-100 focus:border-ASTER-600 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors" />
      <input placeholder="Phone (optional)" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="sm:col-span-2 border-2 border-ASTER-100 focus:border-ASTER-600 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors" />
      <textarea placeholder="Details about the job (optional)" rows={2} value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} className="sm:col-span-2 border-2 border-ASTER-100 focus:border-ASTER-600 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors resize-none" />
      {error && <p className="sm:col-span-2 text-rose-500 text-sm font-semibold">{error}</p>}
      <button type="submit" disabled={submitting} className="sm:col-span-2 bg-ASTER-600 hover:bg-ASTER-700 disabled:opacity-60 text-white font-bold text-sm py-2.5 rounded-full transition-all">
        {submitting ? 'Sending…' : 'Request a free quote'}
      </button>
    </form>
  );
}
