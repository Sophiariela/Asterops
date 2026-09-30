import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Plus, Trash2, Users, ChevronLeft, ChevronRight, List as ListIcon, Calendar as CalendarIcon, Columns } from 'lucide-react';
import { api, ApiError } from '../../lib/api';
import Modal from '../commerce/Modal';
import { formatDateTime, formatTime, localDateKey } from '../../lib/webos/locale';
import type { Reservation, ReservationStatus, Table } from '../../lib/webos/types';

const STATUSES: ReservationStatus[] = ['PENDING', 'CONFIRMED', 'SEATED', 'COMPLETED', 'CANCELLED'];
const STATUS_STYLE: Record<ReservationStatus, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  CONFIRMED: 'bg-emerald-100 text-emerald-700',
  SEATED: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-slate-200 text-slate-500',
  CANCELLED: 'bg-rose-100 text-rose-600',
};

type ViewMode = 'list' | 'day' | 'week' | 'month';

function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function dateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function startOfMonthGrid(date: Date): Date {
  const first = new Date(date.getFullYear(), date.getMonth(), 1);
  return startOfWeek(first);
}

export default function ReservationsDashboard({ siteId, timezone, country }: { siteId: string; timezone: string | null; country: string | null }) {
  const [reservations, setReservations] = useState<Reservation[] | null>(null);
  const [tables, setTables] = useState<Table[] | null>(null);
  const [filter, setFilter] = useState<'upcoming' | ReservationStatus>('upcoming');
  const [view, setView] = useState<ViewMode>('list');
  const [cursor, setCursor] = useState(() => new Date());

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

  // Grouped by the business's own local day (timezone-aware), not the
  // viewer's — otherwise a late-night booking can land on the wrong
  // calendar day for someone viewing from elsewhere.
  const byDay = useMemo(() => {
    const map = new Map<string, Reservation[]>();
    for (const r of reservations ?? []) {
      const key = localDateKey(r.reservationAt, timezone);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(r);
    }
    for (const list of map.values()) list.sort((a, b) => new Date(a.reservationAt).getTime() - new Date(b.reservationAt).getTime());
    return map;
  }, [reservations, timezone]);

  if (!reservations || !tables) return <p className="text-slate-400">Loading reservations…</p>;

  const now = Date.now();
  const upcoming = reservations.filter((r) => r.status !== 'CANCELLED' && new Date(r.reservationAt).getTime() >= now);
  const counts = {
    upcoming: upcoming.length,
    PENDING: reservations.filter((r) => r.status === 'PENDING').length,
    CONFIRMED: reservations.filter((r) => r.status === 'CONFIRMED').length,
    SEATED: reservations.filter((r) => r.status === 'SEATED').length,
    COMPLETED: reservations.filter((r) => r.status === 'COMPLETED').length,
    CANCELLED: reservations.filter((r) => r.status === 'CANCELLED').length,
  };

  const filtered = filter === 'upcoming' ? upcoming : reservations.filter((r) => r.status === filter);

  const ReservationRow = ({ r, compact }: { r: Reservation; compact?: boolean }) => (
    <div className={`flex items-center gap-3 ${compact ? 'py-1.5' : 'py-2'}`}>
      <span className="text-xs font-bold text-ink-900 tabular-nums w-16 shrink-0">{formatTime(r.reservationAt, country, timezone)}</span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-ink-900 truncate">{r.customerName}</p>
        {!compact && <p className="text-xs text-slate-400">{r.partySize} guests{r.table ? ` · ${r.table.name}` : ''}</p>}
      </div>
      <select
        value={r.status}
        onChange={(e) => updateStatus(r.id, e.target.value as ReservationStatus)}
        className={`text-[10px] font-bold px-2 py-1 rounded-full outline-none border-0 shrink-0 ${STATUS_STYLE[r.status]}`}
      >
        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {([
          { key: 'upcoming' as const, label: 'Upcoming', value: counts.upcoming, color: 'text-ASTER-600' },
          { key: 'PENDING' as const, label: 'Pending', value: counts.PENDING, color: 'text-amber-600' },
          { key: 'CONFIRMED' as const, label: 'Confirmed', value: counts.CONFIRMED, color: 'text-emerald-600' },
          { key: 'SEATED' as const, label: 'Seated', value: counts.SEATED, color: 'text-blue-600' },
          { key: 'COMPLETED' as const, label: 'Completed', value: counts.COMPLETED, color: 'text-slate-500' },
          { key: 'CANCELLED' as const, label: 'Cancelled', value: counts.CANCELLED, color: 'text-rose-500' },
        ]).map((c) => (
          <button
            key={c.key}
            onClick={() => setFilter(c.key)}
            className={`bg-white rounded-2xl card-shadow-sm border p-3.5 text-left transition-colors ${filter === c.key ? 'border-ASTER-400' : 'border-ASTER-100'}`}
          >
            <p className={`font-display font-extrabold text-2xl ${c.color}`}>{c.value}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-1">{c.label}</p>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-1 bg-slate-100 rounded-full p-1 w-fit">
        {([
          { key: 'list' as const, label: 'List', icon: ListIcon },
          { key: 'day' as const, label: 'Daily', icon: Columns },
          { key: 'week' as const, label: 'Weekly', icon: Columns },
          { key: 'month' as const, label: 'Calendar', icon: CalendarIcon },
        ]).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setView(key)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-colors ${view === key ? 'bg-white text-ASTER-600 card-shadow-sm' : 'text-slate-500'}`}
          >
            <Icon size={13} /> {label}
          </button>
        ))}
      </div>

      {tableAssignError && <p className="text-rose-500 text-sm font-semibold">{tableAssignError}</p>}

      {view === 'list' && (
        <div className="bg-white rounded-[28px] card-shadow border border-ASTER-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-400 text-left">
              <tr>
                <th className="px-6 py-3 font-semibold">Customer</th>
                <th className="px-6 py-3 font-semibold">Party</th>
                <th className="px-6 py-3 font-semibold">Date &amp; time</th>
                <th className="px-6 py-3 font-semibold">Notes</th>
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
                  <td className="px-6 py-4 text-slate-500 text-xs max-w-[180px] truncate">{r.notes ?? '—'}</td>
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
                <tr><td colSpan={6} className="px-6 py-10 text-center text-slate-400">No reservations here yet. This needs a live, publicly-hosted reservation form to start filling in.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {view === 'day' && (
        <div className="bg-white rounded-[28px] card-shadow border border-ASTER-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setCursor((c) => addDays(c, -1))} className="p-2 rounded-full hover:bg-slate-100 text-slate-500"><ChevronLeft size={16} /></button>
            <p className="font-display font-bold text-ink-900">{cursor.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            <button onClick={() => setCursor((c) => addDays(c, 1))} className="p-2 rounded-full hover:bg-slate-100 text-slate-500"><ChevronRight size={16} /></button>
          </div>
          <div className="divide-y divide-ASTER-50">
            {(byDay.get(dateKey(cursor)) ?? []).map((r) => <ReservationRow key={r.id} r={r} />)}
            {(byDay.get(dateKey(cursor)) ?? []).length === 0 && <p className="text-sm text-slate-400 py-6 text-center">No reservations this day.</p>}
          </div>
        </div>
      )}

      {view === 'week' && (
        <div className="bg-white rounded-[28px] card-shadow border border-ASTER-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setCursor((c) => addDays(c, -7))} className="p-2 rounded-full hover:bg-slate-100 text-slate-500"><ChevronLeft size={16} /></button>
            <p className="font-display font-bold text-ink-900">Week of {startOfWeek(cursor).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}</p>
            <button onClick={() => setCursor((c) => addDays(c, 7))} className="p-2 rounded-full hover:bg-slate-100 text-slate-500"><ChevronRight size={16} /></button>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(cursor), i)).map((d) => {
              const dayReservations = byDay.get(dateKey(d)) ?? [];
              return (
                <div key={dateKey(d)} className="border border-ASTER-50 rounded-2xl p-2.5 min-h-[140px]">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">{d.toLocaleDateString(undefined, { weekday: 'short' })}</p>
                  <p className="text-sm font-bold text-ink-900 mb-2">{d.getDate()}</p>
                  <div className="space-y-1">
                    {dayReservations.slice(0, 4).map((r) => (
                      <div key={r.id} className={`text-[10px] font-semibold rounded-lg px-1.5 py-1 truncate ${STATUS_STYLE[r.status]}`} title={`${r.customerName} · ${r.partySize} guests`}>
                        {formatTime(r.reservationAt, country, timezone)} {r.customerName}
                      </div>
                    ))}
                    {dayReservations.length > 4 && <p className="text-[10px] text-slate-400">+{dayReservations.length - 4} more</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {view === 'month' && (
        <div className="bg-white rounded-[28px] card-shadow border border-ASTER-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setCursor((c) => new Date(c.getFullYear(), c.getMonth() - 1, 1))} className="p-2 rounded-full hover:bg-slate-100 text-slate-500"><ChevronLeft size={16} /></button>
            <p className="font-display font-bold text-ink-900">{cursor.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</p>
            <button onClick={() => setCursor((c) => new Date(c.getFullYear(), c.getMonth() + 1, 1))} className="p-2 rounded-full hover:bg-slate-100 text-slate-500"><ChevronRight size={16} /></button>
          </div>
          <div className="grid grid-cols-7 gap-1.5 text-center mb-1.5">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <p key={i} className="text-[10px] font-bold text-slate-400">{d}</p>)}
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: 42 }, (_, i) => addDays(startOfMonthGrid(cursor), i)).map((d) => {
              const inMonth = d.getMonth() === cursor.getMonth();
              const dayReservations = byDay.get(dateKey(d)) ?? [];
              return (
                <button
                  key={dateKey(d)}
                  onClick={() => { setCursor(d); setView('day'); }}
                  className={`aspect-square rounded-xl p-1.5 text-left transition-colors ${inMonth ? 'hover:bg-ASTER-50' : 'opacity-30'} ${dayReservations.length > 0 ? 'bg-ASTER-50' : ''}`}
                >
                  <p className="text-xs font-semibold text-ink-900">{d.getDate()}</p>
                  {dayReservations.length > 0 && <p className="text-[10px] font-bold text-ASTER-600 mt-0.5">{dayReservations.length}</p>}
                </button>
              );
            })}
          </div>
        </div>
      )}

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
