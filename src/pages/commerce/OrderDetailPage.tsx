import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { api, ApiError } from '../../lib/api';
import { formatBRL } from '../../lib/currency';
import type { CommerceOrder, OrderStatus, Product } from '../../lib/commerce/types';

const STATUS_STYLE: Record<OrderStatus, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  PROCESSING: 'bg-blue-100 text-blue-700',
  FULFILLED: 'bg-emerald-100 text-emerald-700',
  CANCELLED: 'bg-slate-200 text-slate-500',
  REFUNDED: 'bg-rose-100 text-rose-600',
};

const STATUSES: OrderStatus[] = ['PENDING', 'PROCESSING', 'FULFILLED', 'CANCELLED', 'REFUNDED'];

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<CommerceOrder | null>(null);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    if (!id) return;
    api.get<{ order: CommerceOrder }>(`/commerce/orders/${id}`).then((data) => setOrder(data.order)).catch(() => navigate('/commerce/orders', { replace: true }));
  };

  useEffect(load, [id]);

  const changeStatus = async (status: OrderStatus) => {
    if (!id) return;
    setError('');
    setUpdating(true);
    try {
      const data = await api.patch<{ order: CommerceOrder }>(`/commerce/orders/${id}/status`, { status });
      setOrder(data.order);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not update this order.');
    } finally {
      setUpdating(false);
    }
  };

  if (!order) {
    return <p className="text-slate-400">Loading order…</p>;
  }

  return (
    <div>
      <Link to="/commerce/orders" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-ASTER-600 transition-colors mb-6">
        <ArrowLeft size={16} /> Back to orders
      </Link>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-ink-900">Order #{order.id.slice(-8)}</h1>
          <p className="text-slate-500 mt-1.5 text-sm">Placed {new Date(order.createdAt).toLocaleString()} via {order.channel}</p>
        </div>
        <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${STATUS_STYLE[order.status]}`}>{order.status}</span>
      </div>

      <div className="mt-8 grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="bg-white rounded-[28px] card-shadow border border-ASTER-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-400 text-left">
              <tr>
                <th className="px-6 py-3 font-semibold">Product</th>
                <th className="px-6 py-3 font-semibold">Qty</th>
                <th className="px-6 py-3 font-semibold">Unit price</th>
                <th className="px-6 py-3 font-semibold">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ASTER-100">
              {order.items.map((item) => {
                const product = item.product as Product | undefined;
                return (
                  <tr key={item.id}>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-ink-900">{product?.name ?? '—'}</p>
                      <p className="text-slate-400 text-xs">{product?.sku}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{item.quantity}</td>
                    <td className="px-6 py-4 text-slate-600 tabular-nums">{formatBRL(item.unitPrice)}</td>
                    <td className="px-6 py-4 font-semibold text-ink-900 tabular-nums">{formatBRL(item.unitPrice * item.quantity)}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} className="px-6 py-4 text-right font-semibold text-slate-500">Total</td>
                <td className="px-6 py-4 font-display font-extrabold text-ink-900 tabular-nums">{formatBRL(order.total)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-[28px] card-shadow border border-ASTER-100 p-6">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Customer</p>
            <p className="font-semibold text-ink-900">{order.customer.name}</p>
            {order.customer.email && <p className="text-slate-500 text-sm mt-0.5">{order.customer.email}</p>}
            {order.customer.phone && <p className="text-slate-500 text-sm mt-0.5">{order.customer.phone}</p>}
            <Link to={`/commerce/customers/${order.customer.id}`} className="inline-block mt-3 text-xs font-bold text-ASTER-600 hover:text-ASTER-700">
              View customer →
            </Link>
          </div>

          <div className="bg-white rounded-[28px] card-shadow border border-ASTER-100 p-6">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Update status</p>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  disabled={updating || s === order.status}
                  onClick={() => changeStatus(s)}
                  className={`text-xs font-bold px-3 py-2 rounded-full border transition-colors disabled:opacity-40 ${
                    s === order.status ? 'border-ASTER-600 bg-ASTER-50 text-ASTER-600' : 'border-ASTER-100 text-slate-500 hover:border-ASTER-400 hover:text-ASTER-600'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            {(order.status === 'CANCELLED' || order.status === 'REFUNDED') && (
              <p className="text-xs text-slate-400 mt-3">Items from this order were restocked automatically.</p>
            )}
            {error && <p className="text-rose-500 text-xs font-semibold mt-3">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
