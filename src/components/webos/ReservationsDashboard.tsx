import { useEffect, useMemo, useState } from 'react';
import { Users, ChevronLeft, ChevronRight, List as ListIcon, Calendar as CalendarIcon, Columns, AlertTriangle } from 'lucide-react';
import { api, ApiError } from '../../lib/api';
import { formatDateTime, formatTime, localDateKey, titleCase } from '../../lib/webos/locale';
import TablesManager from './TablesManager';
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
  const [loadError, setLoadError] = useState('');

  // A failed request must never render as "no reservations" / "no tables" —
  // that's indistinguishable from a real empty state and is exactly why
  // assigned tables could silently read back as Unassigned. Only an actually
  // -empty response clears loadError; any thrown error keeps the previous
  // lists on screen and surfaces a retry instead.
  const load = () => {
    api.get<{ reservations: Reservation[] }>(`/webos/sites/${siteId}/reservations`)
      .then((d) => { setReservations(d.reservations); setLoadError(''); })
      .catch((err) => setLoadError(err instanceof ApiError ? err.message : 'Could not load reservations. Check your connection and try again.'));
    api.get<{ tables: Table[] }>(`/webos/sites/${siteId}/tables`)
      .then((d) => { setTables(d.tables); setLoadError(''); })
      .catch((err) => setLoadError(err instanceof ApiError ? err.message : 'Could not load tables. Check your connection and try again.'));
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

  // Best-fit, non-conflicting table for a reservation — mirrors the
  // server's own overlap rule (reservationAt/durationMinutes windows on
  // non-cancelled reservations) so the hint matches what assignTable will
  // actually accept. UI hint only; the server is still the final say.
  const suggestTableFor = (r: Reservation): Table | null => {
    if (!tables) return null;
    const start = new Date(r.reservationAt).getTime();
    const end = start + 90 * 60_000;
    const candidates = tables
      .filter((t) => t.active && t.capacity >= r.partySize)
      .sort((a, b) => a.capacity - b.capacity);
    for (const t of candidates) {
      const conflict = (reservations ?? []).some((other) => {
        if (other.id === r.id || other.tableId !== t.id || other.status === 'CANCELLED') return false;
        const oStart = new Date(other.reservationAt).getTime();
        const oEnd = oStart + 90 * 60_000;
        return start < oEnd && oStart < end;
      });
      if (!conflict) return t;
    }
    return null;
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

  if ((!reservations || !tables) && loadError) {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-[28px] p-8 text-center">
        <AlertTriangle size={32} className="text-rose-500 mx-auto" />
        <p className="text-rose-700 font-semibold mt-3">{loadError}</p>
        <button onClick={load} className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold px-5 py-2.5 rounded-full transition-all mt-5">
          Try again
        </button>
      </div>
    );
  }
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
        {STATUSES.map((s) => <option key={s} value={s}>{titleCase(s)}</option>)}
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
              {filtered.map((r) => {
                const suggested = !r.tableId ? suggestTableFor(r) : null;
                return (
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
                      {(tables ?? []).map((t) => (
                        <option key={t.id} value={t.id} disabled={!t.active}>
                          {t.name} ({t.capacity}){t.id === suggested?.id ? ' — suggested' : ''}{!t.active ? ' — closed' : ''}
                        </option>
                      ))}
                    </select>
                    {suggested && (
                      <button
                        type="button"
                        onClick={() => assignTable(r.id, suggested.id)}
                        className="block mt-1 text-[10px] font-bold text-ASTER-600 hover:text-ASTER-700"
                      >
                        Use suggested: {suggested.name}
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={r.status}
                      onChange={(e) => updateStatus(r.id, e.target.value as ReservationStatus)}
                      className={`text-xs font-bold px-2.5 py-1.5 rounded-full outline-none border-0 ${STATUS_STYLE[r.status]}`}
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{titleCase(s)}</option>)}
                    </select>
                  </td>
                </tr>
                );
              })}
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

      <TablesManager siteId={siteId} onChanged={load} />
    </div>
  );
}
