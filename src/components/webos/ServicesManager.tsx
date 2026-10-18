import { useEffect, useState, type FormEvent } from 'react';
import { Plus, Trash2, Pencil, Clock } from 'lucide-react';
import { api, ApiError } from '../../lib/api';
import { formatMoney } from '../../lib/webos/currency';
import Modal from '../commerce/Modal';
import type { Currency, Service } from '../../lib/webos/types';

type FormState = { name: string; description: string; price: string; duration: string; active: boolean };
const emptyForm: FormState = { name: '', description: '', price: '', duration: '', active: true };

// The bookable-offering catalog behind Salon/Education/Professional
// Services/Fitness sites — mirrors TablesManager/MenuManager's pattern.
// Each row's own price/duration (if set) is what AppointmentBookingForm
// and the availability engine use instead of the site default.
export default function ServicesManager({ siteId, currency, onChanged }: { siteId: string; currency: Currency; onChanged?: () => void }) {
  const [services, setServices] = useState<Service[] | null>(null);
  const [editing, setEditing] = useState<Service | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => {
    api.get<{ services: Service[] }>(`/webos/sites/${siteId}/services`).then((d) => setServices(d.services)).catch(() => setServices([]));
  };
  useEffect(load, [siteId]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormError('');
    setShowForm(true);
  };

  const openEdit = (s: Service) => {
    setEditing(s);
    setForm({
      name: s.name,
      description: s.description ?? '',
      price: s.priceCents !== null ? (s.priceCents / 100).toString() : '',
      duration: s.durationMinutes !== null ? String(s.durationMinutes) : '',
      active: s.active,
    });
    setFormError('');
    setShowForm(true);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        description: form.description || undefined,
        priceCents: form.price ? Math.round(Number(form.price) * 100) : null,
        durationMinutes: form.duration ? Number(form.duration) : null,
        active: form.active,
      };
      if (editing) {
        await api.patch(`/webos/sites/${siteId}/services/${editing.id}`, payload);
      } else {
        await api.post(`/webos/sites/${siteId}/services`, payload);
      }
      setShowForm(false);
      load();
      onChanged?.();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'Could not save this service.');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (s: Service) => {
    await api.patch(`/webos/sites/${siteId}/services/${s.id}`, { active: !s.active });
    load();
    onChanged?.();
  };

  const deleteService = async (id: string) => {
    await api.del(`/webos/sites/${siteId}/services/${id}`);
    load();
    onChanged?.();
  };

  if (!services) return <p className="text-slate-400">Loading services…</p>;

  return (
    <div className="bg-white rounded-[28px] card-shadow border border-ASTER-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Services ({services.length})</p>
        <button onClick={openCreate} className="flex items-center gap-1.5 text-xs font-bold text-ASTER-600 hover:text-ASTER-700">
          <Plus size={14} /> Add service
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {services.map((s) => (
          <div key={s.id} className={`rounded-2xl p-4 border ${s.active ? 'bg-slate-50 border-transparent' : 'bg-slate-50/50 border-dashed border-slate-200 opacity-70'}`}>
            <div className="flex items-start justify-between gap-2">
              <p className="font-semibold text-ink-900">{s.name}</p>
              <span className="text-xs font-bold text-ink-900 tabular-nums whitespace-nowrap">{formatMoney(s.priceCents, currency)}</span>
            </div>
            {s.description && <p className="text-xs text-slate-500 mt-1">{s.description}</p>}
            {s.durationMinutes && <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1"><Clock size={12} /> {s.durationMinutes} min</p>}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-ASTER-100">
              <label className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 cursor-pointer">
                <input type="checkbox" checked={s.active} onChange={() => toggleActive(s)} className="accent-ASTER-600" />
                Visible on site
              </label>
              <div className="flex items-center gap-1">
                <button onClick={() => openEdit(s)} className="p-1.5 text-slate-400 hover:text-ASTER-600 transition-colors" aria-label={`Edit ${s.name}`}>
                  <Pencil size={14} />
                </button>
                <button onClick={() => deleteService(s.id)} className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors" aria-label={`Delete ${s.name}`}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {services.length === 0 && <p className="text-sm text-slate-400 col-span-full">No services yet.</p>}
      </div>

      {showForm && (
        <Modal title={editing ? `Edit ${editing.name}` : 'Add service'} onClose={() => setShowForm(false)}>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-[13px] font-bold text-ink-900 block mb-1.5">Service name *</label>
              <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Haircut, 1:1 Consultation" className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-2xl px-4 py-3 text-[15px] outline-none transition-colors" />
            </div>
            <div>
              <label className="text-[13px] font-bold text-ink-900 block mb-1.5">Description</label>
              <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={2} className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-2xl px-4 py-3 text-[15px] outline-none transition-colors resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[13px] font-bold text-ink-900 block mb-1.5">Price</label>
                <input type="number" min={0} step="0.01" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} placeholder="Add price" className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-2xl px-4 py-3 text-[15px] outline-none transition-colors" />
              </div>
              <div>
                <label className="text-[13px] font-bold text-ink-900 block mb-1.5">Duration (min)</label>
                <input type="number" min={5} step={5} value={form.duration} onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))} placeholder="Site default" className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-2xl px-4 py-3 text-[15px] outline-none transition-colors" />
              </div>
            </div>
            {formError && <p className="text-rose-500 text-sm font-semibold">{formError}</p>}
            <button type="submit" disabled={saving} className="w-full bg-ASTER-600 hover:bg-ASTER-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-full transition-all">
              {saving ? 'Saving…' : 'Save service'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
