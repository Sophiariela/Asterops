import { useEffect, useMemo, useState } from 'react';
import { Search, Download, ArrowUpDown } from 'lucide-react';
import { api } from '../../lib/api';
import { titleCase } from '../../lib/webos/locale';
import type { Lead, LeadStatus } from '../../lib/webos/types';

const STATUSES: LeadStatus[] = ['LEAD', 'CONSULTATION', 'PROPOSAL', 'CLIENT'];
const STATUS_STYLE: Record<LeadStatus, string> = {
  LEAD: 'bg-amber-100 text-amber-700',
  CONSULTATION: 'bg-blue-100 text-blue-700',
  PROPOSAL: 'bg-violet-100 text-violet-700',
  CLIENT: 'bg-slate-200 text-slate-500',
};

function toCsvValue(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

function downloadCsv(filename: string, rows: string[][]) {
  const csv = rows.map((row) => row.map(toCsvValue).join(',')).join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function LeadsDashboard({ siteId, onChanged }: { siteId: string; onChanged?: () => void }) {
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | LeadStatus>('ALL');
  const [sortDir, setSortDir] = useState<'desc' | 'asc'>('desc');

  const load = () => {
    api.get<{ leads: Lead[] }>(`/webos/sites/${siteId}/leads`).then((d) => setLeads(d.leads)).catch(() => setLeads([]));
  };
  useEffect(load, [siteId]);

  const updateStatus = async (id: string, status: LeadStatus) => {
    await api.patch(`/webos/sites/${siteId}/leads/${id}/status`, { status });
    setLeads((rows) => (rows ? rows.map((l) => (l.id === id ? { ...l, status } : l)) : rows));
    onChanged?.();
  };

  const filtered = useMemo(() => {
    if (!leads) return [];
    const q = search.trim().toLowerCase();
    return leads
      .filter((l) => statusFilter === 'ALL' || l.status === statusFilter)
      .filter((l) => {
        if (!q) return true;
        return [l.name, l.email, l.phone, l.message].filter(Boolean).some((v) => v!.toLowerCase().includes(q));
      })
      .sort((a, b) => {
        const diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        return sortDir === 'asc' ? diff : -diff;
      });
  }, [leads, search, statusFilter, sortDir]);

  const exportCsv = () => {
    const rows = [
      ['Name', 'Email', 'Phone', 'Message', 'Source Page', 'Status', 'Date Created'],
      ...filtered.map((l) => [
        l.name ?? '', l.email, l.phone ?? '', l.message ?? '', l.page?.name ?? l.source ?? '', l.status, new Date(l.createdAt).toISOString(),
      ]),
    ];
    downloadCsv(`leads-${siteId}.csv`, rows);
  };

  if (!leads) return <p className="text-slate-400">Loading leads…</p>;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {(['ALL', ...STATUSES] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`bg-white rounded-2xl card-shadow-sm border p-4 text-left transition-colors ${statusFilter === s ? 'border-ASTER-400' : 'border-ASTER-100'}`}
          >
            <p className="font-display font-extrabold text-2xl text-ink-900">{s === 'ALL' ? leads.length : leads.filter((l) => l.status === s).length}</p>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mt-1">{s === 'ALL' ? 'All leads' : titleCase(s)}</p>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, phone or message"
            className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-full pl-10 pr-4 py-2.5 text-sm outline-none transition-colors"
          />
        </div>
        <button
          onClick={() => setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'))}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-ink-900 border-2 border-ASTER-100 rounded-full px-3.5 py-2.5 transition-colors"
        >
          <ArrowUpDown size={13} /> {sortDir === 'desc' ? 'Newest first' : 'Oldest first'}
        </button>
        <button
          onClick={exportCsv}
          disabled={filtered.length === 0}
          className="flex items-center gap-1.5 text-xs font-bold text-white bg-ASTER-600 hover:bg-ASTER-700 disabled:opacity-50 rounded-full px-4 py-2.5 transition-colors"
        >
          <Download size={13} /> Export CSV
        </button>
      </div>

      <div className="bg-white rounded-[28px] card-shadow border border-ASTER-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-400 text-left">
            <tr>
              <th className="px-6 py-3 font-semibold">Contact</th>
              <th className="px-6 py-3 font-semibold">Source Page</th>
              <th className="px-6 py-3 font-semibold">Message</th>
              <th className="px-6 py-3 font-semibold">Status</th>
              <th className="px-6 py-3 font-semibold">Date Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ASTER-100">
            {filtered.map((l) => (
              <tr key={l.id}>
                <td className="px-6 py-4">
                  <p className="font-semibold text-ink-900">{l.name ?? 'Not provided'}</p>
                  <p className="text-slate-400 text-xs">{l.email}{l.phone ? ` · ${l.phone}` : ''}</p>
                </td>
                <td className="px-6 py-4 text-slate-600">{l.page?.name ?? l.source ?? 'Not provided'}</td>
                <td className="px-6 py-4 text-slate-500 text-xs max-w-[220px] truncate">{l.message ?? 'Not provided'}</td>
                <td className="px-6 py-4">
                  <select
                    value={l.status}
                    onChange={(e) => updateStatus(l.id, e.target.value as LeadStatus)}
                    className={`text-xs font-bold px-2.5 py-1.5 rounded-full outline-none border-0 ${STATUS_STYLE[l.status]}`}
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{titleCase(s)}</option>)}
                  </select>
                </td>
                <td className="px-6 py-4 text-slate-400 text-xs">{new Date(l.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-10 text-center text-slate-400">{leads.length === 0 ? 'No form submissions yet. This needs a live, publicly-hosted page to start filling in.' : 'No leads match this search.'}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
