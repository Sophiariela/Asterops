import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, UserPlus, ShoppingBag, RefreshCcw } from 'lucide-react';
import { api } from '../../lib/api';
import { formatBRL } from '../../lib/currency';
import type { CommerceCustomer, OrderStatus, TimelineEvent } from '../../lib/commerce/types';

const EVENT_ICON: Record<string, typeof UserPlus> = {
  CUSTOMER_CREATED: UserPlus,
  ORDER_PLACED: ShoppingBag,
  ORDER_STATUS_CHANGED: RefreshCcw,
};

const STATUS_STYLE: Record<OrderStatus, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  PROCESSING: 'bg-blue-100 text-blue-700',
  FULFILLED: 'bg-emerald-100 text-emerald-700',
  CANCELLED: 'bg-slate-200 text-slate-500',
  REFUNDED: 'bg-rose-100 text-rose-600',
};

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<CommerceCustomer | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);

  useEffect(() => {
    if (!id) return;
    api
      .get<{ customer: CommerceCustomer }>(`/commerce/customers/${id}`)
      .then((data) => setCustomer(data.customer))
      .catch(() => navigate('/commerce/customers', { replace: true }));
    api
      .get<{ events: TimelineEvent[] }>(`/commerce/analytics/customers/${id}/timeline`)
      .then((data) => setTimeline(data.events))
      .catch(() => setTimeline([]));
  }, [id, navigate]);

  if (!customer) {
    return <p className="text-slate-400">Loading customer…</p>;
  }

  const lifetimeValue = (customer.orders ?? [])
    .filter((o) => o.status !== 'CANCELLED' && o.status !== 'REFUNDED')
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <div>
      <Link to="/commerce/customers" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-ASTER-600 transition-colors mb-6">
        <ArrowLeft size={16} /> Back to customers
      </Link>

      <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-ink-900">{customer.name}</h1>

      <div className="mt-6 grid sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl card-shadow-sm border border-ASTER-100 p-5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Contact</p>
          <p className="text-sm text-ink-900 mt-2 font-semibold">{customer.email ?? '—'}</p>
          <p className="text-sm text-slate-500">{customer.phone ?? '—'}</p>
        </div>
        <div className="bg-white rounded-2xl card-shadow-sm border border-ASTER-100 p-5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Orders</p>
          <p className="font-display font-extrabold text-2xl text-ink-900 mt-2">{customer.orders?.length ?? 0}</p>
        </div>
        <div className="bg-white rounded-2xl card-shadow-sm border border-ASTER-100 p-5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Lifetime value</p>
          <p className="font-display font-extrabold text-2xl text-ink-900 mt-2 tabular-nums">{formatBRL(lifetimeValue)}</p>
        </div>
      </div>

      {customer.notes && (
        <div className="mt-6 bg-white rounded-2xl card-shadow-sm border border-ASTER-100 p-5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Notes</p>
          <p className="text-sm text-slate-600">{customer.notes}</p>
        </div>
      )}

      <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mt-10 mb-4">Customer journey</p>
      <div className="bg-white rounded-[28px] card-shadow border border-ASTER-100 p-6">
        {timeline.length === 0 ? (
          <p className="text-sm text-slate-400">No timeline events yet.</p>
        ) : (
          <ol className="space-y-5">
            {timeline.map((event, i) => {
              const Icon = EVENT_ICON[event.type] ?? ShoppingBag;
              return (
                <li key={i} className="flex items-start gap-3.5">
                  <span className="w-8 h-8 rounded-full bg-ASTER-50 text-ASTER-600 flex items-center justify-center shrink-0">
                    <Icon size={15} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink-900">{event.label}</p>
                    {event.detail && <p className="text-xs text-slate-500 mt-0.5">{event.detail}</p>}
                    <p className="text-xs text-slate-400 mt-0.5">{new Date(event.at).toLocaleString()}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
        <p className="text-xs text-slate-400 mt-6 pt-4 border-t border-ASTER-100">
          Site visits, campaign interactions and abandoned carts will appear here once those are tracked.
        </p>
      </div>

      <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mt-10 mb-4">Order history</p>
      <div className="bg-white rounded-[28px] card-shadow border border-ASTER-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-400 text-left">
            <tr>
              <th className="px-6 py-3 font-semibold">Order</th>
              <th className="px-6 py-3 font-semibold">Total</th>
              <th className="px-6 py-3 font-semibold">Status</th>
              <th className="px-6 py-3 font-semibold">Placed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ASTER-100">
            {(customer.orders ?? []).map((o) => (
              <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <Link to={`/commerce/orders/${o.id}`} className="font-semibold text-ASTER-600 hover:text-ASTER-700">#{o.id.slice(-8)}</Link>
                </td>
                <td className="px-6 py-4 font-semibold text-ink-900 tabular-nums">{formatBRL(o.total)}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${STATUS_STYLE[o.status]}`}>{o.status}</span>
                </td>
                <td className="px-6 py-4 text-slate-400 text-xs">{new Date(o.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {(!customer.orders || customer.orders.length === 0) && (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-slate-400">No orders yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
