import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';
import { api, ApiError } from '../../lib/api';
import { formatBRL } from '../../lib/currency';
import type { CommerceCustomer, CommerceOrder, OrderChannel, OrderStatus, Product } from '../../lib/commerce/types';
import Modal from '../../components/commerce/Modal';

const STATUS_STYLE: Record<OrderStatus, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  PROCESSING: 'bg-blue-100 text-blue-700',
  FULFILLED: 'bg-emerald-100 text-emerald-700',
  CANCELLED: 'bg-slate-200 text-slate-500',
  REFUNDED: 'bg-rose-100 text-rose-600',
};

type LineItem = { productId: string; quantity: string };

export default function OrdersPage() {
  const [orders, setOrders] = useState<CommerceOrder[] | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [customers, setCustomers] = useState<CommerceCustomer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [customerId, setCustomerId] = useState('');
  const [channel, setChannel] = useState<OrderChannel>('MANUAL');
  const [items, setItems] = useState<LineItem[]>([{ productId: '', quantity: '1' }]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => {
    const params = new URLSearchParams();
    if (statusFilter) params.set('status', statusFilter);
    api.get<{ orders: CommerceOrder[] }>(`/commerce/orders?${params.toString()}`).then((data) => setOrders(data.orders)).catch(() => setOrders([]));
  };

  useEffect(load, [statusFilter]);

  const openCreate = () => {
    api.get<{ customers: CommerceCustomer[] }>('/commerce/customers').then((data) => setCustomers(data.customers)).catch(() => {});
    api.get<{ products: Product[] }>('/commerce/products?status=ACTIVE').then((data) => setProducts(data.products)).catch(() => {});
    setCustomerId('');
    setChannel('MANUAL');
    setItems([{ productId: '', quantity: '1' }]);
    setError('');
    setShowForm(true);
  };

  const updateItem = (index: number, patch: Partial<LineItem>) =>
    setItems((rows) => rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));

  const removeItem = (index: number) => setItems((rows) => rows.filter((_, i) => i !== index));

  const previewTotal = items.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId);
    const qty = Number(item.quantity) || 0;
    return sum + (product ? product.price * qty : 0);
  }, 0);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    const validItems = items.filter((i) => i.productId && Number(i.quantity) > 0);
    if (!customerId || validItems.length === 0) {
      setError('Pick a customer and at least one product.');
      return;
    }
    setSaving(true);
    try {
      await api.post('/commerce/orders', {
        customerId,
        channel,
        items: validItems.map((i) => ({ productId: i.productId, quantity: Number(i.quantity) })),
      });
      setShowForm(false);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not create this order.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-ink-900">Orders</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-ASTER-600 hover:bg-ASTER-700 text-white font-bold px-5 py-2.5 rounded-full transition-all"
        >
          <Plus size={16} /> New order
        </button>
      </div>

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="mt-6 border-2 border-ASTER-100 rounded-full px-4 py-2.5 text-sm outline-none"
      >
        <option value="">All statuses</option>
        {(['PENDING', 'PROCESSING', 'FULFILLED', 'CANCELLED', 'REFUNDED'] as OrderStatus[]).map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <div className="mt-6 bg-white rounded-[28px] card-shadow border border-ASTER-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-400 text-left">
            <tr>
              <th className="px-6 py-3 font-semibold">Order</th>
              <th className="px-6 py-3 font-semibold">Customer</th>
              <th className="px-6 py-3 font-semibold">Channel</th>
              <th className="px-6 py-3 font-semibold">Total</th>
              <th className="px-6 py-3 font-semibold">Status</th>
              <th className="px-6 py-3 font-semibold">Placed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ASTER-100">
            {orders?.map((o) => (
              <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <Link to={`/commerce/orders/${o.id}`} className="font-semibold text-ASTER-600 hover:text-ASTER-700">
                    #{o.id.slice(-8)}
                  </Link>
                  <p className="text-slate-400 text-xs">{o.items.length} item(s)</p>
                </td>
                <td className="px-6 py-4 text-slate-600">{o.customer.name}</td>
                <td className="px-6 py-4 text-slate-600">{o.channel}</td>
                <td className="px-6 py-4 font-semibold text-ink-900 tabular-nums">{formatBRL(o.total)}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${STATUS_STYLE[o.status]}`}>{o.status}</span>
                </td>
                <td className="px-6 py-4 text-slate-400 text-xs">{new Date(o.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {orders && orders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-slate-400">No orders yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <Modal title="New order" onClose={() => setShowForm(false)}>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="text-[13px] font-bold text-ink-900 block mb-1.5">Customer *</label>
              <select
                required
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-2xl px-4 py-3 text-[15px] outline-none transition-colors"
              >
                <option value="">Select a customer…</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {customers.length === 0 && (
                <p className="text-xs text-slate-400 mt-1.5">
                  No customers yet — add one on the <Link to="/commerce/customers" className="text-ASTER-600 font-semibold">Customers</Link> tab.
                </p>
              )}
            </div>

            <div>
              <label className="text-[13px] font-bold text-ink-900 block mb-1.5">Channel</label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value as OrderChannel)}
                className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-2xl px-4 py-3 text-[15px] outline-none transition-colors"
              >
                <option value="MANUAL">Manual</option>
                <option value="POS">Point of sale</option>
                <option value="ONLINE">Online</option>
              </select>
            </div>

            <div>
              <label className="text-[13px] font-bold text-ink-900 block mb-1.5">Items *</label>
              <div className="space-y-2.5">
                {items.map((item, i) => {
                  const product = products.find((p) => p.id === item.productId);
                  return (
                    <div key={i} className="flex items-center gap-2">
                      <select
                        value={item.productId}
                        onChange={(e) => updateItem(i, { productId: e.target.value })}
                        className="flex-1 border-2 border-ASTER-100 focus:border-ASTER-600 rounded-2xl px-3 py-2.5 text-sm outline-none transition-colors"
                      >
                        <option value="">Select a product…</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id} disabled={p.stockQuantity <= 0}>
                            {p.name} — {formatBRL(p.price)} ({p.stockQuantity} in stock)
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        min={1}
                        max={product?.stockQuantity}
                        value={item.quantity}
                        onChange={(e) => updateItem(i, { quantity: e.target.value })}
                        className="w-20 border-2 border-ASTER-100 focus:border-ASTER-600 rounded-2xl px-3 py-2.5 text-sm outline-none transition-colors"
                      />
                      <button type="button" onClick={() => removeItem(i)} className="p-2 text-slate-400 hover:text-rose-500 transition-colors" aria-label="Remove item">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={() => setItems((rows) => [...rows, { productId: '', quantity: '1' }])}
                className="mt-2.5 text-xs font-bold text-ASTER-600 hover:text-ASTER-700"
              >
                + Add another item
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-ASTER-100">
              <span className="text-sm font-semibold text-slate-500">Total</span>
              <span className="font-display font-extrabold text-lg text-ink-900">{formatBRL(previewTotal)}</span>
            </div>

            {error && <p className="text-rose-500 text-sm font-semibold">{error}</p>}
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-ASTER-600 hover:bg-ASTER-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-full transition-all"
            >
              {saving ? 'Placing order…' : 'Place order'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
