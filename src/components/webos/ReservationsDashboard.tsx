import { useEffect, useState, type FormEvent } from 'react';
import { Plus, Trash2, Users } from 'lucide-react';
import { api, ApiError } from '../../lib/api';
import Modal from '../commerce/Modal';
import { formatDateTime } from '../../lib/webos/locale';
import type { Reservation, ReservationStatus, Table } from '../../lib/webos/types';

const STATUSES: ReservationStatus[] = ['PENDING', 'CONFIRMED', 'CANCELLED'];
const STATUS_STYLE: Record<ReservationStatus, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  CONFIRMED: 'bg-emerald-100 text-emerald-700',
  CANCELLED: 'bg-slate-200 text-slate-500',
};

export default function ReservationsDashboard({ siteId, timezone, country }: { siteId: string; timezone: string | null; country: string | null }) {
  const [reservations, setReservations] = useState<Reservation[] | null>(null);
  const [tables, setTables] = useState<Table[] | null>(null);
  const [filter, setFilter] = useState<'upcoming' | ReservationStatus>('upcoming');

  const [showTableForm, setShowTableForm] = useState(false);
  const [tableForm, setTableForm] = useState({ name: '', capacity: '4' });
  const [tableError, setTableError] = useState('');
  const [tableSaving, setTableSaving] = useState(false);

  const load = () => {
    api.get<{ reservations: Reservation[] }>(`/webos/sites/${siteId}/reservations`).then((d) => setReservations(d.reservations)).catch(() => setReservations([]));
    api.get<{ tables: Table[] }>(`/webos/sites/${siteId}/tables`).then((d) => setTables(d.tables)).catch(() => setTables([]));
  };
  useEffect(load, [siteId]);

  const updateStatus = async (id: string, status: ReservationStatus) => {
    await api.patch(`/webos/sites/${siteId}/reservations/${id}/status`, { status });
    load();
  };

  const [tableAssignError, setTableAssignError] = useState<string | null>(null);
  const assignTable = async (id: string, tableId: string) => {
    setTableAssignError(null);
    try {
      await api.patch(`/webos/sites/${siteId}/reservations/${id}/table`, { tableId: tableId || null });
      load();
    } catch (err) {
      setTableAssignError(err instanceof ApiError ? err.message : 'Could not assign that table.');
    }
  };

  const addTable = async (e: FormEvent) => {
    e.preventDefault();
    setTableError('');
    setTableSaving(true);
    try {
      await api.post(`/webos/sites/${siteId}/tables`, { name: tableForm.name, capacity: Number(tableForm.capacity) });
      setShowTableForm(false);
      setTableForm({ name: '', capacity: '4' });
      load();
    } catch (err) {
      setTableError(err instanceof ApiError ? err.message : 'Could not add this table.');
    } finally {
      setTableSaving(false);
    }
  };

  const deleteTable = async (id: string) => {
    await api.del(`/webos/sites/${siteId}/tables/${id}`);
    load();
  };

  if (!reservations || !tables) return <p className="text-slate-400">Loading reservations…</p>;

  const now = Date.now();
  const upcoming = reservations.filter((r) => r.status !== 'CANCELLED' && new Date(r.reservationAt).getTime() >= now);
  const counts = {
    upcoming: upcoming.length,
    PENDING: reservations.filter((r) => r.status === 'PENDING').length,
    CONFIRMED: reservations.filter((r) => r.status === 'CONFIRMED').length,
    CANCELLED: reservations.filter((r) => r.status === 'CANCELLED').length,
  };

  const filtered = filter === 'upcoming' ? upcoming : reservations.filter((r) => r.status === filter);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {([
          { key: 'upcoming' as const, label: 'Upcoming', value: counts.upcoming, color: 'text-ASTER-600' },
          { key: 'PENDING' as const, label: 'Pending', value: counts.PENDING, color: 'text-amber-600' },
          { key: 'CONFIRMED' as const, label: 'Confirmed', value: counts.CONFIRMED, color: 'text-emerald-600' },
          { key: 'CANCELLED' as const, label: 'Cancelled', value: counts.CANCELLED, color: 'text-slate-400' },
        ]).map((c) => (
          <button
            key={c.key}
            onClick={() => setFilter(c.key)}
            className={`bg-white rounded-2xl card-shadow-sm border p-4 text-left transition-colors ${filter === c.key ? 'border-ASTER-400' : 'border-ASTER-100'}`}
          >
            <p className={`font-display font-extrabold text-3xl ${c.color}`}>{c.value}</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mt-1">{c.label}</p>
          </button>
        ))}
      </div>

      {tableAssignError && <p className="text-rose-500 text-sm font-semibold">{tableAssignError}</p>}

      <div className="bg-white rounded-[28px] card-shadow border border-ASTER-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-400 text-left">
            <tr>
              <th className="px-6 py-3 font-semibold">Customer</th>
              <th className="px-6 py-3 font-semibold">Party</th>
              <th className="px-6 py-3 font-semibold">Date &amp; time</th>
              <th className="px-6 py-3 font-semibold">Table</th>
              <th className="px-6 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ASTER-100">
            {filtered.map((r) => (
              <tr key={r.id}>
                <td className="px-6 py-4">
                  <p className="font-semibold text-ink-900">{r.customerName}</p>
                  <p className="text-slate-400 text-xs">{r.customerEmail}{r.customerPhone ? ` · ${r.customerPhone}` : ''}</p>
                </td>
                <td className="px-6 py-4 text-slate-600 flex items-center gap-1.5"><Users size={13} /> {r.partySize}</td>
                <td className="px-6 py-4 text-slate-600 text-xs">{formatDateTime(r.reservationAt, country, timezone)}</td>
                <td className="px-6 py-4">
                  <select
                    value={r.tableId ?? ''}
                    onChange={(e) => assignTable(r.id, e.target.value)}
                    className="border-2 border-ASTER-100 rounded-full px-2.5 py-1.5 text-xs font-semibold outline-none"
                  >
                    <option value="">Unassigned</option>
                    {tables.map((t) => <option key={t.id} value={t.id}>{t.name} ({t.capacity})</option>)}
                  </select>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={r.status}
                    onChange={(e) => updateStatus(r.id, e.target.value as ReservationStatus)}
                    className={`text-xs font-bold px-2.5 py-1.5 rounded-full outline-none border-0 ${STATUS_STYLE[r.status]}`}
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-10 text-center text-slate-400">No reservations here yet — this needs a live, publicly-hosted reservation form to start filling in.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-[28px] card-shadow border border-ASTER-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Tables ({tables.length})</p>
          <button onClick={() => setShowTableForm(true)} className="flex items-center gap-1.5 text-xs font-bold text-ASTER-600 hover:text-ASTER-700">
            <Plus size={14} /> Add table
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {tables.map((t) => (
            <span key={t.id} className="flex items-center gap-2 bg-slate-50 rounded-full pl-3 pr-1.5 py-1.5 text-sm">
              <span className="font-semibold text-ink-900">{t.name}</span>
              <span className="text-xs text-slate-400">seats {t.capacity}</span>
              <button onClick={() => deleteTable(t.id)} className="p-1 text-slate-400 hover:text-rose-500 transition-colors" aria-label={`Delete ${t.name}`}>
                <Trash2 size={12} />
              </button>
            </span>
          ))}
          {tables.length === 0 && <p className="text-sm text-slate-400">No tables yet.</p>}
        </div>
      </div>

      {showTableForm && (
        <Modal title="Add table" onClose={() => setShowTableForm(false)}>
          <form onSubmit={addTable} className="space-y-4">
            <div>
              <label className="text-[13px] font-bold text-ink-900 block mb-1.5">Name *</label>
              <input required value={tableForm.name} onChange={(e) => setTableForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Table 4, Patio 2" className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-2xl px-4 py-3 text-[15px] outline-none transition-colors" />
            </div>
            <div>
              <label className="text-[13px] font-bold text-ink-900 block mb-1.5">Capacity *</label>
              <input required type="number" min={1} value={tableForm.capacity} onChange={(e) => setTableForm((f) => ({ ...f, capacity: e.target.value }))} className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-2xl px-4 py-3 text-[15px] outline-none transition-colors" />
            </div>
            {tableError && <p className="text-rose-500 text-sm font-semibold">{tableError}</p>}
            <button type="submit" disabled={tableSaving} className="w-full bg-ASTER-600 hover:bg-ASTER-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-full transition-all">
              {tableSaving ? 'Saving…' : 'Add table'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
