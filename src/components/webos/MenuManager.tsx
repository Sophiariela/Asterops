import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Plus, Trash2, Star, Image as ImageIcon, Pencil } from 'lucide-react';
import { api, ApiError, resolveUploadUrl } from '../../lib/api';
import Modal from '../commerce/Modal';
import type { MenuCategory, MenuItem } from '../../lib/webos/types';

function dollarsToCents(v: string): number | undefined {
  const n = Number(v);
  if (!v || Number.isNaN(n) || n < 0) return undefined;
  return Math.round(n * 100);
}

type ItemModalState = { categoryId: string; categoryName: string; item: MenuItem | null };

export default function MenuManager({ siteId }: { siteId: string }) {
  const [categories, setCategories] = useState<MenuCategory[] | null>(null);

  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [categorySaving, setCategorySaving] = useState(false);

  const [itemModal, setItemModal] = useState<ItemModalState | null>(null);
  const [itemForm, setItemForm] = useState({ name: '', description: '', price: '', available: true, featured: false });
  const [itemImageFile, setItemImageFile] = useState<File | null>(null);
  const [itemImagePreview, setItemImagePreview] = useState<string | null>(null);
  const [itemError, setItemError] = useState('');
  const [itemSaving, setItemSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const openAddItem = (categoryId: string, categoryName: string) => {
    setItemModal({ categoryId, categoryName, item: null });
    setItemForm({ name: '', description: '', price: '', available: true, featured: false });
    setItemImageFile(null);
    setItemImagePreview(null);
    setItemError('');
  };

  const openEditItem = (categoryId: string, categoryName: string, item: MenuItem) => {
    setItemModal({ categoryId, categoryName, item });
    setItemForm({
      name: item.name,
      description: item.description ?? '',
      price: item.priceCents === null ? '' : (item.priceCents / 100).toFixed(2),
      available: item.available,
      featured: item.featured,
    });
    setItemImageFile(null);
    setItemImagePreview(null);
    setItemError('');
  };

  const pickImage = (file: File) => {
    setItemImageFile(file);
    setItemImagePreview(URL.createObjectURL(file));
  };

  const saveItem = async (e: FormEvent) => {
    e.preventDefault();
    if (!itemModal) return;
    setItemError('');
    setItemSaving(true);
    try {
      const payload = {
        name: itemForm.name,
        description: itemForm.description || undefined,
        priceCents: dollarsToCents(itemForm.price),
        available: itemForm.available,
        featured: itemForm.featured,
      };
      let itemId = itemModal.item?.id;
      if (itemModal.item) {
        await api.patch(`/webos/sites/${siteId}/menu/items/${itemModal.item.id}`, payload);
      } else {
        const created = await api.post<{ item: MenuItem }>(`/webos/sites/${siteId}/menu/categories/${itemModal.categoryId}/items`, payload);
        itemId = created.item.id;
      }
      if (itemImageFile && itemId) {
        const fd = new FormData();
        fd.append('image', itemImageFile);
        await api.postForm(`/webos/sites/${siteId}/menu/items/${itemId}/image`, fd);
      }
      setItemModal(null);
      load();
    } catch (err) {
      setItemError(err instanceof ApiError ? err.message : 'Could not save this item.');
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
      <p className="text-sm text-slate-500">Build your menu the way you'd stock a shelf: add a category, then add items to it — each with a name, price, description, and photo.</p>

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
              <button onClick={() => openAddItem(cat.id, cat.name)} className="flex items-center gap-1.5 text-xs font-bold text-ASTER-600 hover:text-ASTER-700">
                <Plus size={13} /> Add item
              </button>
              <button onClick={() => deleteCategory(cat.id)} className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors" aria-label={`Delete ${cat.name}`}>
                <Trash2 size={14} />
              </button>
            </div>
          </div>
          <div className="space-y-2">
            {cat.items.map((item) => {
              const thumb = resolveUploadUrl(item.imageUrl);
              return (
                <div key={item.id} className="flex items-center gap-3 bg-slate-50 rounded-2xl p-3">
                  <button onClick={() => openEditItem(cat.id, cat.name, item)} className="w-12 h-12 shrink-0 rounded-xl overflow-hidden bg-white border border-ASTER-100 flex items-center justify-center text-slate-300">
                    {thumb ? <img src={thumb} alt="" className="w-full h-full object-cover" /> : <ImageIcon size={18} />}
                  </button>
                  <button onClick={() => openEditItem(cat.id, cat.name, item)} className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-semibold text-ink-900 truncate flex items-center gap-1.5">
                      {item.name}
                      {item.featured && <Star size={12} className="text-amber-500 shrink-0" fill="currentColor" />}
                    </p>
                    {item.description && <p className="text-xs text-slate-500 mt-0.5 truncate">{item.description}</p>}
                  </button>
                  <span className="text-sm font-bold text-ink-900 tabular-nums shrink-0">
                    {item.priceCents === null ? <span className="text-slate-400 font-normal italic text-xs">no price</span> : `$${(item.priceCents / 100).toFixed(2)}`}
                  </span>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 cursor-pointer shrink-0">
                    <input type="checkbox" checked={item.available} onChange={(e) => toggleItem(item.id, 'available', e.target.checked)} className="accent-ASTER-600" />
                    Available
                  </label>
                  <button onClick={() => openEditItem(cat.id, cat.name, item)} className="p-1.5 text-slate-400 hover:text-ASTER-600 transition-colors shrink-0" aria-label={`Edit ${item.name}`}>
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => deleteItem(item.id)} className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors shrink-0" aria-label={`Delete ${item.name}`}>
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })}
            {cat.items.length === 0 && <p className="text-sm text-slate-400">No items yet.</p>}
          </div>
        </div>
      ))}
      {categories.length === 0 && (
        <p className="text-sm text-slate-400">No menu categories yet — add one to start building the menu.</p>
      )}

      {showCategoryForm && (
        <Modal title="Add category" onClose={() => setShowCategoryForm(false)}>
          <form onSubmit={addCategory} className="space-y-4">
            <div>
              <label className="text-[13px] font-bold text-ink-900 block mb-1.5">Category name *</label>
              <input required value={categoryName} onChange={(e) => setCategoryName(e.target.value)} placeholder="e.g. Breakfast, Appetizers, Desserts" className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-2xl px-4 py-3 text-[15px] outline-none transition-colors" />
            </div>
            {categoryError && <p className="text-rose-500 text-sm font-semibold">{categoryError}</p>}
            <button type="submit" disabled={categorySaving} className="w-full bg-ASTER-600 hover:bg-ASTER-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-full transition-all">
              {categorySaving ? 'Saving…' : 'Save category'}
            </button>
          </form>
        </Modal>
      )}

      {itemModal && (
        <Modal title={itemModal.item ? `Edit item — ${itemModal.categoryName}` : `Add item — ${itemModal.categoryName}`} onClose={() => setItemModal(null)}>
          <form onSubmit={saveItem} className="space-y-4">
            <div>
              <label className="text-[13px] font-bold text-ink-900 block mb-1.5">Image</label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-32 rounded-2xl border-2 border-dashed border-ASTER-200 hover:border-ASTER-400 bg-slate-50 flex flex-col items-center justify-center gap-1.5 text-slate-400 transition-colors overflow-hidden"
              >
                {itemImagePreview || itemModal.item?.imageUrl ? (
                  <img src={itemImagePreview ?? resolveUploadUrl(itemModal.item?.imageUrl) ?? ''} alt="" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <ImageIcon size={22} />
                    <span className="text-xs font-bold">Click to add a photo</span>
                  </>
                )}
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) pickImage(f); }} />
            </div>
            <div>
              <label className="text-[13px] font-bold text-ink-900 block mb-1.5">Item name *</label>
              <input required value={itemForm.name} onChange={(e) => setItemForm((f) => ({ ...f, name: e.target.value }))} className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-2xl px-4 py-3 text-[15px] outline-none transition-colors" />
            </div>
            <div>
              <label className="text-[13px] font-bold text-ink-900 block mb-1.5">Price (USD)</label>
              <input value={itemForm.price} onChange={(e) => setItemForm((f) => ({ ...f, price: e.target.value }))} placeholder="e.g. 12.50 — leave blank to set later" className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-2xl px-4 py-3 text-[15px] outline-none transition-colors" />
            </div>
            <div>
              <label className="text-[13px] font-bold text-ink-900 block mb-1.5">Description</label>
              <textarea value={itemForm.description} onChange={(e) => setItemForm((f) => ({ ...f, description: e.target.value }))} rows={2} className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-2xl px-4 py-3 text-[15px] outline-none transition-colors resize-none" />
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
              {itemSaving ? 'Saving…' : 'Save'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
