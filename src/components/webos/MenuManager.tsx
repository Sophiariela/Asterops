import { useEffect, useState, type FormEvent } from 'react';
import { Plus, Trash2, Star } from 'lucide-react';
import { api, ApiError } from '../../lib/api';
import Modal from '../commerce/Modal';
import type { MenuCategory } from '../../lib/webos/types';

function dollarsToCents(v: string): number | undefined {
  const n = Number(v);
  if (!v || Number.isNaN(n) || n < 0) return undefined;
  return Math.round(n * 100);
}

export default function MenuManager({ siteId }: { siteId: string }) {
  const [categories, setCategories] = useState<MenuCategory[] | null>(null);

  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [categorySaving, setCategorySaving] = useState(false);

  const [itemFormCategoryId, setItemFormCategoryId] = useState<string | null>(null);
  const [itemForm, setItemForm] = useState({ name: '', description: '', price: '', available: true, featured: false });
  const [itemError, setItemError] = useState('');
  const [itemSaving, setItemSaving] = useState(false);

  const load = () => {
    api.get<{ categories: MenuCategory[] }>(`/webos/sites/${siteId}/menu`).then((d) => setCategories(d.categories)).catch(() => setCategories([]));
  };
  useEffect(load, [siteId]);

  const addCategory = async (e: FormEvent) => {
    e.preventDefault();
    setCategoryError('');
    setCategorySaving(true);
    try {
      await api.post(`/webos/sites/${siteId}/menu/categories`, { name: categoryName });
      setShowCategoryForm(false);
      setCategoryName('');
      load();
    } catch (err) {
      setCategoryError(err instanceof ApiError ? err.message : 'Could not add this category.');
    } finally {
      setCategorySaving(false);
    }
  };

  const deleteCategory = async (id: string) => {
    await api.del(`/webos/sites/${siteId}/menu/categories/${id}`);
    load();
  };

  const openItemForm = (categoryId: string) => {
    setItemFormCategoryId(categoryId);
    setItemForm({ name: '', description: '', price: '', available: true, featured: false });
    setItemError('');
  };

  const addItem = async (e: FormEvent) => {
    e.preventDefault();
    if (!itemFormCategoryId) return;
    setItemError('');
    setItemSaving(true);
    try {
      await api.post(`/webos/sites/${siteId}/menu/categories/${itemFormCategoryId}/items`, {
        name: itemForm.name,
        description: itemForm.description || undefined,
        priceCents: dollarsToCents(itemForm.price),
        available: itemForm.available,
        featured: itemForm.featured,
      });
      setItemFormCategoryId(null);
      load();
    } catch (err) {
      setItemError(err instanceof ApiError ? err.message : 'Could not add this item.');
    } finally {
      setItemSaving(false);
    }
  };

  const toggleItem = async (id: string, field: 'available' | 'featured', value: boolean) => {
    await api.patch(`/webos/sites/${siteId}/menu/items/${id}`, { [field]: value });
    load();
  };

  const deleteItem = async (id: string) => {
    await api.del(`/webos/sites/${siteId}/menu/items/${id}`);
    load();
  };

  if (!categories) return <p className="text-slate-400">Loading menu…</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Categories ({categories.length})</p>
        <button onClick={() => setShowCategoryForm(true)} className="flex items-center gap-1.5 text-xs font-bold text-ASTER-600 hover:text-ASTER-700">
          <Plus size={14} /> Add category
        </button>
      </div>

      {categories.map((cat) => (
        <div key={cat.id} className="bg-white rounded-[28px] card-shadow border border-ASTER-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="font-display font-bold text-lg text-ink-900">{cat.name}</p>
            <div className="flex items-center gap-3">
              <button onClick={() => openItemForm(cat.id)} className="flex items-center gap-1.5 text-xs font-bold text-ASTER-600 hover:text-ASTER-700">
                <Plus size={13} /> Add item
              </button>
              <button onClick={() => deleteCategory(cat.id)} className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors" aria-label={`Delete ${cat.name}`}>
                <Trash2 size={14} />
              </button>
            </div>
          </div>
          <div className="space-y-2">
            {cat.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 bg-slate-50 rounded-2xl p-4">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink-900 truncate">{item.name}</p>
                  {item.description && <p className="text-xs text-slate-500 mt-0.5 truncate">{item.description}</p>}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm font-bold text-ink-900 tabular-nums">{item.priceCents === null ? <span className="text-slate-400 font-normal italic">no price</span> : `$${(item.priceCents / 100).toFixed(2)}`}</span>
                  <button
                    onClick={() => toggleItem(item.id, 'featured', !item.featured)}
                    className={`p-1.5 rounded-full transition-colors ${item.featured ? 'text-amber-500' : 'text-slate-300 hover:text-amber-400'}`}
                    aria-label="Toggle featured"
                    title="Featured"
                  >
                    <Star size={15} fill={item.featured ? 'currentColor' : 'none'} />
                  </button>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 cursor-pointer">
                    <input type="checkbox" checked={item.available} onChange={(e) => toggleItem(item.id, 'available', e.target.checked)} className="accent-ASTER-600" />
                    Available
                  </label>
                  <button onClick={() => deleteItem(item.id)} className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors" aria-label={`Delete ${item.name}`}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
            {cat.items.length === 0 && <p className="text-sm text-slate-400">No items yet.</p>}
          </div>
        </div>
      ))}
      {categories.length === 0 && (
        <p className="text-sm text-slate-400">No menu categories yet — add one to start building the menu.</p>
      )}

      {showCategoryForm && (
        <Modal title="Add menu category" onClose={() => setShowCategoryForm(false)}>
          <form onSubmit={addCategory} className="space-y-4">
            <div>
              <label className="text-[13px] font-bold text-ink-900 block mb-1.5">Name *</label>
              <input required value={categoryName} onChange={(e) => setCategoryName(e.target.value)} placeholder="e.g. Appetizers, Mains, Desserts" className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-2xl px-4 py-3 text-[15px] outline-none transition-colors" />
            </div>
            {categoryError && <p className="text-rose-500 text-sm font-semibold">{categoryError}</p>}
            <button type="submit" disabled={categorySaving} className="w-full bg-ASTER-600 hover:bg-ASTER-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-full transition-all">
              {categorySaving ? 'Saving…' : 'Add category'}
            </button>
          </form>
        </Modal>
      )}

      {itemFormCategoryId && (
        <Modal title="Add menu item" onClose={() => setItemFormCategoryId(null)}>
          <form onSubmit={addItem} className="space-y-4">
            <div>
              <label className="text-[13px] font-bold text-ink-900 block mb-1.5">Name *</label>
              <input required value={itemForm.name} onChange={(e) => setItemForm((f) => ({ ...f, name: e.target.value }))} className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-2xl px-4 py-3 text-[15px] outline-none transition-colors" />
            </div>
            <div>
              <label className="text-[13px] font-bold text-ink-900 block mb-1.5">Description</label>
              <textarea value={itemForm.description} onChange={(e) => setItemForm((f) => ({ ...f, description: e.target.value }))} rows={2} className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-2xl px-4 py-3 text-[15px] outline-none transition-colors resize-none" />
            </div>
            <div>
              <label className="text-[13px] font-bold text-ink-900 block mb-1.5">Price (USD)</label>
              <input value={itemForm.price} onChange={(e) => setItemForm((f) => ({ ...f, price: e.target.value }))} placeholder="e.g. 12.50 — leave blank to set later" className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-2xl px-4 py-3 text-[15px] outline-none transition-colors" />
            </div>
            <div className="flex items-center gap-5">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                <input type="checkbox" checked={itemForm.available} onChange={(e) => setItemForm((f) => ({ ...f, available: e.target.checked }))} className="accent-ASTER-600" />
                Available
              </label>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                <input type="checkbox" checked={itemForm.featured} onChange={(e) => setItemForm((f) => ({ ...f, featured: e.target.checked }))} className="accent-ASTER-600" />
                Featured
              </label>
            </div>
            {itemError && <p className="text-rose-500 text-sm font-semibold">{itemError}</p>}
            <button type="submit" disabled={itemSaving} className="w-full bg-ASTER-600 hover:bg-ASTER-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-full transition-all">
              {itemSaving ? 'Saving…' : 'Add item'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
