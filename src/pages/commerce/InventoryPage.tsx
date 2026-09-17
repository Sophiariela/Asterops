import { useEffect, useState, type FormEvent } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { api, ApiError } from '../../lib/api';
import type { InventoryRow, ManualStockReason, StockMovement } from '../../lib/commerce/types';
import Modal from '../../components/commerce/Modal';

const REASON_LABEL: Record<StockMovement['reason'], string> = {
  RESTOCK: 'Restock',
  SALE: 'Sale',
  ADJUSTMENT: 'Adjustment',
  RETURN: 'Return',
};

export default function InventoryPage() {
  const [rows, setRows] = useState<InventoryRow[] | null>(null);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [adjusting, setAdjusting] = useState<InventoryRow | null>(null);
  const [change, setChange] = useState('');
  const [reason, setReason] = useState<ManualStockReason>('RESTOCK');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => {
    api
      .get<{ products: InventoryRow[] }>(`/commerce/inventory${lowStockOnly ? '?lowStock=1' : ''}`)
      .then((data) => setRows(data.products))
      .catch(() => setRows([]));
    api.get<{ movements: StockMovement[] }>('/commerce/inventory/movements').then((data) => setMovements(data.movements)).catch(() => {});
  };

  useEffect(load, [lowStockOnly]);

  const openAdjust = (row: InventoryRow) => {
    setAdjusting(row);
    setChange('');
    setReason('RESTOCK');
    setNote('');
    setError('');
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!adjusting) return;
    setError('');
    setSaving(true);
    try {
      await api.post('/commerce/inventory/adjust', {
        productId: adjusting.id,
        change: Number(change),
        reason,
        note: note || undefined,
      });
      setAdjusting(null);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not adjust stock.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-ink-900">Inventory</h1>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-600 cursor-pointer">
          <input type="checkbox" checked={lowStockOnly} onChange={(e) => setLowStockOnly(e.target.checked)} className="accent-ASTER-600" />
          Low stock only
        </label>
      </div>

      <div className="mt-6 bg-white rounded-[28px] card-shadow border border-ASTER-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-400 text-left">
            <tr>
              <th className="px-6 py-3 font-semibold">Product</th>
              <th className="px-6 py-3 font-semibold">Category</th>
              <th className="px-6 py-3 font-semibold">On hand</th>
              <th className="px-6 py-3 font-semibold">Reorder point</th>
              <th className="px-6 py-3 font-semibold"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ASTER-100">
            {rows?.map((r) => (
              <tr key={r.id}>
                <td className="px-6 py-4">
                  <p className="font-semibold text-ink-900">{r.name}</p>
                  <p className="text-slate-400 text-xs">{r.sku}</p>
                </td>
                <td className="px-6 py-4 text-slate-600">{r.category?.name ?? '—'}</td>
                <td className="px-6 py-4">
                  <span className={r.stockQuantity <= r.reorderPoint ? 'font-bold text-rose-600' : 'font-semibold text-ink-900'}>
                    {r.stockQuantity}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600">{r.reorderPoint}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => openAdjust(r)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-ASTER-600 hover:text-ASTER-700 border border-ASTER-200 hover:border-ASTER-400 rounded-full px-3 py-1.5 transition-colors"
                  >
                    <SlidersHorizontal size={13} /> Adjust
                  </button>
                </td>
              </tr>
            ))}
            {rows && rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-slate-400">
                  {lowStockOnly ? 'Nothing is low on stock.' : 'No products yet.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mt-10 mb-4">Recent stock movements</p>
      <div className="bg-white rounded-[28px] card-shadow border border-ASTER-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-400 text-left">
            <tr>
              <th className="px-6 py-3 font-semibold">Product</th>
              <th className="px-6 py-3 font-semibold">Change</th>
              <th className="px-6 py-3 font-semibold">Reason</th>
              <th className="px-6 py-3 font-semibold">Note</th>
              <th className="px-6 py-3 font-semibold">When</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ASTER-100">
            {movements.map((m) => (
              <tr key={m.id}>
                <td className="px-6 py-4">
                  <p className="font-semibold text-ink-900">{m.product.name}</p>
                  <p className="text-slate-400 text-xs">{m.product.sku}</p>
                </td>
                <td className={`px-6 py-4 font-bold ${m.change > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {m.change > 0 ? `+${m.change}` : m.change}
                </td>
                <td className="px-6 py-4 text-slate-600">{REASON_LABEL[m.reason]}</td>
                <td className="px-6 py-4 text-slate-400 text-xs max-w-[220px] truncate">{m.note ?? '—'}</td>
                <td className="px-6 py-4 text-slate-400 text-xs">{new Date(m.createdAt).toLocaleString()}</td>
              </tr>
            ))}
            {movements.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-slate-400">No stock movements yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {adjusting && (
        <Modal title={`Adjust stock — ${adjusting.name}`} onClose={() => setAdjusting(null)}>
          <form onSubmit={onSubmit} className="space-y-4">
            <p className="text-sm text-slate-500">Currently <strong className="text-ink-900">{adjusting.stockQuantity}</strong> on hand.</p>
            <div>
              <label className="text-[13px] font-bold text-ink-900 block mb-1.5">Change (use a negative number to remove stock) *</label>
              <input
                required
                type="number"
                value={change}
                onChange={(e) => setChange(e.target.value)}
                placeholder="e.g. 20 or -3"
                className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-2xl px-4 py-3 text-[15px] outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-[13px] font-bold text-ink-900 block mb-1.5">Reason</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value as ManualStockReason)}
                className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-2xl px-4 py-3 text-[15px] outline-none transition-colors"
              >
                <option value="RESTOCK">Restock</option>
                <option value="ADJUSTMENT">Adjustment (loss, damage, count correction)</option>
                <option value="RETURN">Return</option>
              </select>
            </div>
            <div>
              <label className="text-[13px] font-bold text-ink-900 block mb-1.5">Note</label>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-2xl px-4 py-3 text-[15px] outline-none transition-colors"
              />
            </div>
            {error && <p className="text-rose-500 text-sm font-semibold">{error}</p>}
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-ASTER-600 hover:bg-ASTER-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-full transition-all"
            >
              {saving ? 'Saving…' : 'Apply adjustment'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
