import { useEffect, useState, type FormEvent } from 'react';
import { CheckCircle2, Clock, Loader2 } from 'lucide-react';
import { api, ApiError } from '../../lib/api';
import { formatMoney } from '../../lib/webos/currency';
import type { AvailabilityResponse, Currency, PublicService } from '../../lib/webos/types';

// Real, pickable time slots — fetched from the server's availability
// engine for the chosen date (and service, if the site has a catalog),
// never a blind date/time input. The server re-validates the same slot
// at submission time, so this is UX, not the actual double-booking guard.
export default function AppointmentBookingForm({
  siteId, services, currency,
}: {
  siteId: string;
  services: PublicService[];
  currency: Currency;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const [serviceId, setServiceId] = useState('');
  const [date, setDate] = useState(today);
  const [slots, setSlots] = useState<AvailabilityResponse | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotError, setSlotError] = useState('');
  const [slotTime, setSlotTime] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [confirmed, setConfirmed] = useState<{ date: string; time: string } | null>(null);

  useEffect(() => {
    setSlotTime('');
    setSlots(null);
    setSlotError('');
    setLoadingSlots(true);
    const params = new URLSearchParams({ siteId, date });
    if (serviceId) params.set('serviceId', serviceId);
    api.get<AvailabilityResponse>(`/webos/public/reservations/availability?${params.toString()}`)
      .then((data) => setSlots(data))
      .catch((err) => setSlotError(err instanceof ApiError ? err.message : 'Could not load available times.'))
      .finally(() => setLoadingSlots(false));
  }, [siteId, date, serviceId]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!slotTime || !form.name || !form.email) {
      setError('Please pick a time, then fill in your name and email.');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/webos/public/reservations', {
        siteId,
        customerName: form.name,
        customerEmail: form.email,
        customerPhone: form.phone || undefined,
        partySize: 1,
        slotDate: date,
        slotTime,
        serviceId: serviceId || undefined,
        notes: form.notes || undefined,
      });
      setConfirmed({ date, time: slotTime });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not book this time. Please try another.');
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmed) {
    return (
      <div className="text-center py-8 max-w-lg mx-auto">
        <CheckCircle2 className="mx-auto text-emerald-600" size={32} />
        <p className="font-display font-bold text-lg text-ink-900 mt-3">Request received!</p>
        <p className="text-sm text-slate-500 mt-1">{confirmed.date} at {confirmed.time}. We'll confirm shortly by email.</p>
        <button onClick={() => setConfirmed(null)} className="mt-4 text-sm font-bold text-ASTER-600 hover:text-ASTER-700">Book another time</button>
      </div>
    );
  }

  const selectedService = services.find((s) => s.id === serviceId);

  return (
    <form onSubmit={submit} className="max-w-lg space-y-3">
      {services.length > 0 && (
        <select value={serviceId} onChange={(e) => setServiceId(e.target.value)} className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors">
          <option value="">Choose a service (optional)</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}{s.durationMinutes ? ` · ${s.durationMinutes} min` : ''}{s.priceCents !== null ? ` · ${formatMoney(s.priceCents, currency)}` : ''}
            </option>
          ))}
        </select>
      )}
      {selectedService?.description && <p className="text-xs text-slate-500">{selectedService.description}</p>}

      <input required type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)} className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors" />

      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-1.5"><Clock size={12} /> Available times</p>
        {loadingSlots && <p className="text-sm text-slate-400 flex items-center gap-1.5"><Loader2 size={14} className="animate-spin" /> Loading…</p>}
        {!loadingSlots && slotError && <p className="text-sm text-rose-500">{slotError}</p>}
        {!loadingSlots && !slotError && slots && slots.slots.length === 0 && (
          <p className="text-sm text-slate-400">No times available that day. Please try another date.</p>
        )}
        {!loadingSlots && slots && slots.slots.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {slots.slots.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setSlotTime(t)}
                className={`text-xs font-bold px-3 py-2 rounded-xl border-2 transition-colors ${slotTime === t ? 'bg-ASTER-600 border-ASTER-600 text-white' : 'border-ASTER-100 text-ink-900 hover:border-ASTER-600'}`}
              >
                {t}
              </button>
            ))}
          </div>
        )}
      </div>

      <input required placeholder="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors" />
      <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors" />
      <input placeholder="Phone (optional)" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors" />
      <textarea placeholder="Anything we should know? (optional)" rows={2} value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors resize-none" />
      {error && <p className="text-rose-500 text-sm font-semibold">{error}</p>}
      <button type="submit" disabled={submitting || !slotTime} className="bg-ASTER-600 hover:bg-ASTER-700 disabled:opacity-60 text-white font-bold text-sm px-5 py-2.5 rounded-full transition-all">
        {submitting ? 'Booking…' : 'Book this time'}
      </button>
    </form>
  );
}
