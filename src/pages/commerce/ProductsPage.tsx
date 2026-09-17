import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import { api, ApiError } from '../../lib/api';
import { formatBRL } from '../../lib/currency';
import type { Category, Product, ProductStatus } from '../../lib/commerce/types';
import Modal from '../../components/commerce/Modal';

type FormState = {
  name: string;
  sku: string;
  description: string;
  price: string;
  compareAtPrice: string;
  categoryId: string;
  status: ProductStatus;
  stockQuantity: string;
  reorderPoint: string;
};

const emptyForm: FormState = {
  name: '',
  sku: '',
  description: '',
  price: '',
  compareAtPrice: '',
  categoryId: '',
  status: 'ACTIVE',
  stockQuantity: '0',
  reorderPoint: '0',
};

const STATUS_STYLE: Record<ProductStatus, string> = {
  ACTIVE: 'bg-emerald-100 text-emerald-700',
  DRAFT: 'bg-amber-100 text-amber-700',
  ARCHIVED: 'bg-slate-200 text-slate-500',
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    api
      .get<{ products: Product[] }>(`/commerce/products?${params.toString()}`)
      .then((data) => setProducts(data.products))
      .catch(() => setProducts([]));
  }, [search]);

  useEffect(() => {
    api.get<{ categories: Category[] }>('/commerce/categories').then((data) => setCategories(data.categories)).catch(() => {});
  }, []);

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

  const openEdit = (product: Product) => {
    setEditing(product);
    setForm({
      name: product.name,
      sku: product.sku,
      description: product.description ?? '',
      price: String(product.price / 100),
      compareAtPrice: product.compareAtPrice ? String(product.compareAtPrice / 100) : '',
      categoryId: product.categoryId ?? '',
      status: product.status,
      stockQuantity: String(product.stockQuantity),
      reorderPoint: String(product.reorderPoint),
    });
    setError('');
    setShowForm(true);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const body: Record<string, unknown> = {
        name: form.name,
        sku: form.sku,
        description: form.description || undefined,
        price: Math.round(parseFloat(form.price || '0') * 100),
        compareAtPrice: form.compareAtPrice ? Math.round(parseFloat(form.compareAtPrice) * 100) : null,
        categoryId: form.categoryId || null,
        status: form.status,
        reorderPoint: Number(form.reorderPoint || 0),
      };
      if (!editing) body.stockQuantity = Number(form.stockQuantity || 0);

      if (editing) {
        await api.patch(`/commerce/products/${editing.id}`, body);
      } else {
        await api.post('/commerce/products', body);
      }
      setShowForm(false);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not save this product.');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (product: Product) => {
    if (!confirm(`Delete "${product.name}"? This can't be undone.`)) return;
    try {
      await api.del(`/commerce/products/${product.id}`);
      load();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'Could not delete this product.');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-ink-900">Products</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-ASTER-600 hover:bg-ASTER-700 text-white font-bold px-5 py-2.5 rounded-full transition-all"
        >
          <Plus size={16} /> New product
        </button>
      </div>

      <div className="relative mt-6 max-w-sm">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or SKU"
          className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-full pl-11 pr-4 py-2.5 text-sm outline-none transition-colors"
        />
      </div>

      <div className="mt-6 bg-white rounded-[28px] card-shadow border border-ASTER-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-400 text-left">
            <tr>
              <th className="px-6 py-3 font-semibold">Product</th>
              <th className="px-6 py-3 font-semibold">Category</th>
              <th className="px-6 py-3 font-semibold">Price</th>
              <th className="px-6 py-3 font-semibold">Stock</th>
              <th className="px-6 py-3 font-semibold">Status</th>
              <th className="px-6 py-3 font-semibold"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ASTER-100">
            {products?.map((p) => (
              <tr key={p.id}>
                <td className="px-6 py-4">
                  <p className="font-semibold text-ink-900">{p.name}</p>
                  <p className="text-slate-400 text-xs">{p.sku}</p>
                </td>
                <td className="px-6 py-4 text-slate-600">{p.category?.name ?? '—'}</td>
                <td className="px-6 py-4 text-slate-600 tabular-nums">{formatBRL(p.price)}</td>
                <td className="px-6 py-4">
                  <span className={p.stockQuantity <= p.reorderPoint ? 'font-bold text-rose-600' : 'text-slate-600'}>
                    {p.stockQuantity}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${STATUS_STYLE[p.status]}`}>{p.status}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1 justify-end">
                    <button onClick={() => openEdit(p)} className="p-2 rounded-full text-slate-400 hover:text-ASTER-600 hover:bg-ASTER-50 transition-colors" aria-label={`Edit ${p.name}`}>
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => onDelete(p)} className="p-2 rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors" aria-label={`Delete ${p.name}`}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products && products.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-slate-400">
                  No products yet. <button onClick={openCreate} className="text-ASTER-600 font-bold">Add your first one</button>.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-slate-400 mt-4">
        Need categories first? Manage them on the <Link to="/commerce/categories" className="text-ASTER-600 font-semibold">Categories</Link> tab.
      </p>

      {showForm && (
        <Modal title={editing ? 'Edit product' : 'New product'} onClose={() => setShowForm(false)}>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Name" required value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} />
              <Field label="SKU" required value={form.sku} onChange={(v) => setForm((f) => ({ ...f, sku: v }))} />
            </div>
            <Field label="Description" textarea value={form.description} onChange={(v) => setForm((f) => ({ ...f, description: v }))} />
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Price (R$)" required type="number" step="0.01" value={form.price} onChange={(v) => setForm((f) => ({ ...f, price: v }))} />
              <Field label="Compare-at price (R$)" type="number" step="0.01" value={form.compareAtPrice} onChange={(v) => setForm((f) => ({ ...f, compareAtPrice: v }))} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[13px] font-bold text-ink-900 block mb-1.5">Category</label>
                <select
                  value={form.categoryId}
                  onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
                  className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-2xl px-4 py-3 text-[15px] outline-none transition-colors"
                >
                  <option value="">Uncategorized</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[13px] font-bold text-ink-900 block mb-1.5">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as ProductStatus }))}
                  className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-2xl px-4 py-3 text-[15px] outline-none transition-colors"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="DRAFT">Draft</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {!editing && (
                <Field label="Initial stock" type="number" value={form.stockQuantity} onChange={(v) => setForm((f) => ({ ...f, stockQuantity: v }))} />
              )}
              <Field label="Reorder point" type="number" value={form.reorderPoint} onChange={(v) => setForm((f) => ({ ...f, reorderPoint: v }))} />
            </div>
            {editing && (
              <p className="text-xs text-slate-400">
                Stock isn't edited here — adjust it from the <Link to="/commerce/inventory" className="text-ASTER-600 font-semibold">Inventory</Link> tab so it stays logged.
              </p>
            )}
            {error && <p className="text-rose-500 text-sm font-semibold">{error}</p>}
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-ASTER-600 hover:bg-ASTER-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-full transition-all"
            >
              {saving ? 'Saving…' : editing ? 'Save changes' : 'Create product'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  type = 'text',
  step,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
  step?: string;
  textarea?: boolean;
}) {
  return (
    <div>
      <label className="text-[13px] font-bold text-ink-900 block mb-1.5">
        {label} {required && '*'}
      </label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-2xl px-4 py-3 text-[15px] outline-none transition-colors resize-none"
        />
      ) : (
        <input
          required={required}
          type={type}
          step={step}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-2xl px-4 py-3 text-[15px] outline-none transition-colors"
        />
      )}
    </div>
  );
}
