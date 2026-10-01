import { useEffect, useState, type FormEvent } from 'react';
import { Plus, Trash2, Pencil, Users, MapPin } from 'lucide-react';
import { api, ApiError } from '../../lib/api';
import { titleCase } from '../../lib/webos/locale';
import Modal from '../commerce/Modal';
import type { TableWithStatus, TableSection, TableLiveStatus } from '../../lib/webos/types';

const SECTIONS: TableSection[] = ['INDOOR', 'OUTDOOR', 'PATIO', 'VIP'];

const STATUS_STYLE: Record<TableLiveStatus, string> = {
  AVAILABLE: 'bg-emerald-100 text-emerald-700',
  RESERVED: 'bg-amber-100 text-amber-700',
  OCCUPIED: 'bg-blue-100 text-blue-700',
  CLOSED: 'bg-slate-200 text-slate-500',
};

type FormState = { name: string; capacity: string; section: TableSection | ''; notes: string };
const emptyForm: FormState = { name: '', capacity: '4', section: '', notes: '' };

export default function TablesManager({ siteId, onChanged }: { siteId: string; onChanged?: () => void }) {
  const [tables, setTables] = useState<TableWithStatus[] | null>(null);

  const [editing, setEditing] = useState<TableWithStatus | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => {
    api.get<{ tables: TableWithStatus[] }>(`/webos/sites/${siteId}/tables/status`).then((d) => setTables(d.tables)).catch(() => setTables([]));
  };
  useEffect(load, [siteId]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormError('');
    setShowForm(true);
  };

  const openEdit = (t: TableWithStatus) => {
    setEditing(t);
    setForm({ name: t.name, capacity: String(t.capacity), section: t.section ?? '', notes: t.notes ?? '' });
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
        capacity: Number(form.capacity),
        section: form.section || null,
        notes: form.notes || undefined,
      };
      if (editing) {
        await api.patch(`/webos/sites/${siteId}/tables/${editing.id}`, payload);
      } else {
        await api.post(`/webos/sites/${siteId}/tables`, payload);
      }
      setShowForm(false);
      load();
      onChanged?.();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'Could not save this table.');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (t: TableWithStatus) => {
    await api.patch(`/webos/sites/${siteId}/tables/${t.id}`, { active: !t.active });
    load();
    onChanged?.();
  };

  const deleteTable = async (id: string) => {
    await api.del(`/webos/sites/${siteId}/tables/${id}`);
    load();
    onChanged?.();
  };

  if (!tables) return <p className="text-slate-400">Loading tables…</p>;

  return (
    <div className="bg-white rounded-[28px] card-shadow border border-ASTER-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Tables ({tables.length})</p>
        <button onClick={openCreate} className="flex items-center gap-1.5 text-xs font-bold text-ASTER-600 hover:text-ASTER-700">
          <Plus size={14} /> Add table
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {tables.map((t) => (
          <div key={t.id} className={`rounded-2xl p-4 border ${t.active ? 'bg-slate-50 border-transparent' : 'bg-slate-50/50 border-dashed border-slate-200 opacity-70'}`}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-ink-900">{t.name}</p>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5"><Users size={12} /> Seats {t.capacity}</p>
                {t.section && <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5"><MapPin size={12} /> {titleCase(t.section)}</p>}
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${STATUS_STYLE[t.liveStatus]}`}>{titleCase(t.liveStatus)}</span>
            </div>
            {t.notes && <p className="text-xs text-slate-400 mt-2 italic">{t.notes}</p>}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-ASTER-100">
              <label className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 cursor-pointer">
                <input type="checkbox" checked={t.active} onChange={() => toggleActive(t)} className="accent-ASTER-600" />
                In rotation
              </label>
              <div className="flex items-center gap-1">
                <button onClick={() => openEdit(t)} className="p-1.5 text-slate-400 hover:text-ASTER-600 transition-colors" aria-label={`Edit ${t.name}`}>
                  <Pencil size={14} />
                </button>
                <button onClick={() => deleteTable(t.id)} className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors" aria-label={`Delete ${t.name}`}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {tables.length === 0 && <p className="text-sm text-slate-400 col-span-full">No tables yet.</p>}
      </div>

      {showForm && (
        <Modal title={editing ? `Edit ${editing.name}` : 'Add table'} onClose={() => setShowForm(false)}>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-[13px] font-bold text-ink-900 block mb-1.5">Table name *</label>
              <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Table 4, Patio 2" className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-2xl px-4 py-3 text-[15px] outline-none transition-colors" />
            </div>
            <div>
              <label className="text-[13px] font-bold text-ink-900 block mb-1.5">Capacity *</label>
              <input required type="number" min={1} value={form.capacity} onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))} className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-2xl px-4 py-3 text-[15px] outline-none transition-colors" />
            </div>
            <div>
              <label className="text-[13px] font-bold text-ink-900 block mb-1.5">Section</label>
              <select value={form.section} onChange={(e) => setForm((f) => ({ ...f, section: e.target.value as TableSection | '' }))} className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-2xl px-4 py-3 text-[15px] outline-none transition-colors">
                <option value="">No section</option>
                {SECTIONS.map((s) => <option key={s} value={s}>{titleCase(s)}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[13px] font-bold text-ink-900 block mb-1.5">Notes</label>
              <textarea value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} rows={2} placeholder="e.g. Near the window, wheelchair accessible" className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-2xl px-4 py-3 text-[15px] outline-none transition-colors resize-none" />
            </div>
            {formError && <p className="text-rose-500 text-sm font-semibold">{formError}</p>}
            <button type="submit" disabled={saving} className="w-full bg-ASTER-600 hover:bg-ASTER-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-full transition-all">
              {saving ? 'Saving…' : 'Save table'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
