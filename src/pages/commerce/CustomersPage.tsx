import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import { api, ApiError } from '../../lib/api';
import type { CommerceCustomer } from '../../lib/commerce/types';
import Modal from '../../components/commerce/Modal';

type FormState = { name: string; email: string; phone: string; notes: string };
const emptyForm: FormState = { name: '', email: '', phone: '', notes: '' };

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CommerceCustomer[] | null>(null);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<CommerceCustomer | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    api.get<{ customers: CommerceCustomer[] }>(`/commerce/customers?${params.toString()}`).then((data) => setCustomers(data.customers)).catch(() => setCustomers([]));
  }, [search]);

  useEffect(() => {
    const timeout = setTimeout(load, 200);
    return () => clearTimeout(timeout);
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setError('');
    setShowForm(true);
  };

  const openEdit = (customer: CommerceCustomer) => {
    setEditing(customer);
    setForm({ name: customer.name, email: customer.email ?? '', phone: customer.phone ?? '', notes: customer.notes ?? '' });
    setError('');
    setShowForm(true);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const body = {
        name: form.name,
        email: form.email || null,
        phone: form.phone || null,
        notes: form.notes || null,
      };
      if (editing) {
        await api.patch(`/commerce/customers/${editing.id}`, body);
      } else {
        await api.post('/commerce/customers', body);
      }
      setShowForm(false);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not save this customer.');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (customer: CommerceCustomer) => {
    if (!confirm(`Delete "${customer.name}"?`)) return;
    try {
      await api.del(`/commerce/customers/${customer.id}`);
      load();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'Could not delete this customer.');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-ink-900">Customers</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-ASTER-600 hover:bg-ASTER-700 text-white font-bold px-5 py-2.5 rounded-full transition-all"
        >
          <Plus size={16} /> New customer
        </button>
      </div>

      <div className="relative mt-6 max-w-sm">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email"
          className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-full pl-11 pr-4 py-2.5 text-sm outline-none transition-colors"
        />
      </div>

      <div className="mt-6 bg-white rounded-[28px] card-shadow border border-ASTER-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-400 text-left">
            <tr>
              <th className="px-6 py-3 font-semibold">Customer</th>
              <th className="px-6 py-3 font-semibold">Contact</th>
              <th className="px-6 py-3 font-semibold">Orders</th>
              <th className="px-6 py-3 font-semibold"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ASTER-100">
            {customers?.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <Link to={`/commerce/customers/${c.id}`} className="font-semibold text-ASTER-600 hover:text-ASTER-700">{c.name}</Link>
                </td>
                <td className="px-6 py-4 text-slate-600">{c.email ?? c.phone ?? '—'}</td>
                <td className="px-6 py-4 text-slate-600">{c._count?.orders ?? 0}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1 justify-end">
                    <button onClick={() => openEdit(c)} className="p-2 rounded-full text-slate-400 hover:text-ASTER-600 hover:bg-ASTER-50 transition-colors" aria-label={`Edit ${c.name}`}>
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => onDelete(c)} className="p-2 rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors" aria-label={`Delete ${c.name}`}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {customers && customers.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-slate-400">No customers yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <Modal title={editing ? 'Edit customer' : 'New customer'} onClose={() => setShowForm(false)}>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="text-[13px] font-bold text-ink-900 block mb-1.5">Name *</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-2xl px-4 py-3 text-[15px] outline-none transition-colors"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[13px] font-bold text-ink-900 block mb-1.5">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-2xl px-4 py-3 text-[15px] outline-none transition-colors"
                />
              </div>
              <div>
                <label className="text-[13px] font-bold text-ink-900 block mb-1.5">Phone</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-2xl px-4 py-3 text-[15px] outline-none transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="text-[13px] font-bold text-ink-900 block mb-1.5">Notes</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                rows={3}
                className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-2xl px-4 py-3 text-[15px] outline-none transition-colors resize-none"
              />
            </div>
            {error && <p className="text-rose-500 text-sm font-semibold">{error}</p>}
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-ASTER-600 hover:bg-ASTER-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-full transition-all"
            >
              {saving ? 'Saving…' : editing ? 'Save changes' : 'Create customer'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
