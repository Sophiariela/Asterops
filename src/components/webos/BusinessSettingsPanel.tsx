import { useEffect, useState, type FormEvent } from 'react';
import { Sparkles, Calendar, CheckCircle2, Loader2 } from 'lucide-react';
import { api, ApiError } from '../../lib/api';
import type { Site } from '../../lib/webos/types';

const FIELD_CLASS = 'w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-2xl px-4 py-3 text-[15px] outline-none transition-colors';
const LABEL_CLASS = 'text-[13px] font-bold text-ink-900 block mb-1.5';

type FormState = {
  contactEmail: string;
  reservationEmail: string;
  reviewEmail: string;
  phone: string;
  whatsappNumber: string;
};

function PremiumBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-white bg-gradient-to-br from-ASTER-700 to-ASTER-500 px-2 py-0.5 rounded-full">
      <Sparkles size={10} /> PREMIUM
    </span>
  );
}

export default function BusinessSettingsPanel({ site, onRefresh }: { site: Site; onRefresh: () => void }) {
  const [form, setForm] = useState<FormState>({
    contactEmail: site.contactEmail ?? '',
    reservationEmail: site.reservationEmail ?? '',
    reviewEmail: site.reviewEmail ?? '',
    phone: site.phone ?? '',
    whatsappNumber: site.whatsappNumber ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [connectingCalendar, setConnectingCalendar] = useState(false);
  const [disconnectingCalendar, setDisconnectingCalendar] = useState(false);

  useEffect(() => {
    setForm({
      contactEmail: site.contactEmail ?? '',
      reservationEmail: site.reservationEmail ?? '',
      reviewEmail: site.reviewEmail ?? '',
      phone: site.phone ?? '',
      whatsappNumber: site.whatsappNumber ?? '',
    });
  }, [site]);

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
      setError(err instanceof ApiError ? err.message : 'Could not save Business Settings.');
    } finally {
      setSaving(false);
    }
  };

  const connectGoogleCalendar = async () => {
    setConnectingCalendar(true);
    try {
      const data = await api.get<{ url: string }>(`/webos/sites/${site.id}/google-calendar/connect`);
      window.location.href = data.url;
    } catch (err) {
      setConnectingCalendar(false);
      alert(err instanceof ApiError ? err.message : 'Could not start Google Calendar connection.');
    }
  };

  const disconnectGoogleCalendar = async () => {
    setDisconnectingCalendar(true);
    try {
      await api.post(`/webos/sites/${site.id}/google-calendar/disconnect`);
      onRefresh();
    } finally {
      setDisconnectingCalendar(false);
    }
  };

  return (
    <form onSubmit={save} className="bg-white rounded-[28px] card-shadow border border-ASTER-100 p-6 space-y-5">
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Business Settings</p>
        <p className="text-xs text-slate-400 mt-1">Every form on your site uses these automatically. Leave a field blank to fall back to your account email.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={LABEL_CLASS}>Contact Email</label>
          <input type="email" placeholder="hello@yourbusiness.com" value={form.contactEmail} onChange={(e) => setForm((f) => ({ ...f, contactEmail: e.target.value }))} className={FIELD_CLASS} />
          <p className="text-xs text-slate-400 mt-1.5">New leads are sent here.</p>
        </div>
        <div>
          <label className={LABEL_CLASS}>Reservation Email</label>
          <input type="email" placeholder="reservations@yourbusiness.com" value={form.reservationEmail} onChange={(e) => setForm((f) => ({ ...f, reservationEmail: e.target.value }))} className={FIELD_CLASS} />
          <p className="text-xs text-slate-400 mt-1.5">New reservations are sent here.</p>
        </div>
        <div>
          <label className={LABEL_CLASS}>Review Email</label>
          <input type="email" placeholder="reviews@yourbusiness.com" value={form.reviewEmail} onChange={(e) => setForm((f) => ({ ...f, reviewEmail: e.target.value }))} className={FIELD_CLASS} />
          <p className="text-xs text-slate-400 mt-1.5">New reviews are sent here.</p>
        </div>
        <div>
          <label className={LABEL_CLASS}>Phone Number</label>
          <input type="tel" placeholder="+1 555 123 4567" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className={FIELD_CLASS} />
        </div>
        <div className="sm:col-span-2">
          <label className={`${LABEL_CLASS} flex items-center gap-2`}>WhatsApp Number <PremiumBadge /></label>
          <input
            type="tel"
            placeholder="+1 555 123 4567"
            value={form.whatsappNumber}
            onChange={(e) => setForm((f) => ({ ...f, whatsappNumber: e.target.value }))}
            disabled={!site.premiumEnabled}
            className={`${FIELD_CLASS} ${!site.premiumEnabled ? 'bg-slate-50 text-slate-400 cursor-not-allowed' : ''}`}
          />
          <p className="text-xs text-slate-400 mt-1.5">
            {site.premiumEnabled
              ? "Receives a WhatsApp alert the moment a reservation comes in."
              : 'Upgrade to Premium to receive reservation alerts on WhatsApp.'}
          </p>
        </div>
      </div>

      {error && <p className="text-rose-500 text-sm font-semibold">{error}</p>}
      <div className="flex items-center gap-3">
        <button type="submit" disabled={saving} className="bg-ASTER-600 hover:bg-ASTER-700 disabled:opacity-60 text-white font-bold px-6 py-3 rounded-full transition-all">
          {saving ? 'Saving…' : 'Save changes'}
        </button>
        {saved && <span className="text-sm font-semibold text-emerald-600">Saved</span>}
      </div>

      <div className="pt-5 border-t border-ASTER-100">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-2 mb-1">
          <Calendar size={13} /> Google Calendar <PremiumBadge />
        </p>
        {!site.premiumEnabled ? (
          <p className="text-sm text-slate-400 mt-2">Upgrade to Premium to sync confirmed reservations to Google Calendar automatically.</p>
        ) : site.googleCalendarConnected ? (
          <div className="flex items-center justify-between gap-3 mt-2">
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
              <CheckCircle2 size={15} /> Connected
            </span>
            <button
              type="button"
              onClick={disconnectGoogleCalendar}
              disabled={disconnectingCalendar}
              className="text-sm font-bold text-slate-400 hover:text-rose-600 disabled:opacity-60 transition-colors"
            >
              {disconnectingCalendar ? 'Disconnecting…' : 'Disconnect'}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={connectGoogleCalendar}
            disabled={connectingCalendar}
            className="mt-2 inline-flex items-center gap-1.5 border-2 border-ASTER-100 hover:border-ASTER-600 text-ink-900 font-bold text-sm px-4 py-2 rounded-full transition-all disabled:opacity-60"
          >
            {connectingCalendar ? <Loader2 size={14} className="animate-spin" /> : <Calendar size={14} />}
            {connectingCalendar ? 'Redirecting…' : 'Connect Google Calendar'}
          </button>
        )}
      </div>

      <div className="pt-5 border-t border-ASTER-100">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-2 mb-1">
          SMS Notifications <PremiumBadge />
        </p>
        <p className="text-sm text-slate-400 mt-2">
          {site.premiumEnabled
            ? 'Included automatically on Premium: guests with a phone number get reservation confirmation and cancellation texts.'
            : 'Upgrade to Premium to text guests reservation confirmations, reminders and cancellations.'}
        </p>
      </div>
    </form>
  );
}
