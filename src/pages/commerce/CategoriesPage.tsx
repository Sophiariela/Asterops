import { useEffect, useState, type FormEvent } from 'react';
import { Trash2 } from 'lucide-react';
import { api, ApiError } from '../../lib/api';
import type { Category } from '../../lib/commerce/types';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => {
    api.get<{ categories: Category[] }>('/commerce/categories').then((data) => setCategories(data.categories)).catch(() => setCategories([]));
  };

  useEffect(load, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await api.post('/commerce/categories', { name, description: description || undefined });
      setName('');
      setDescription('');
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível criar esta categoria.');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (category: Category) => {
    if (!confirm(`Excluir "${category.name}"? Os produtos nela ficarão sem categoria.`)) return;
    await api.del(`/commerce/categories/${category.id}`);
    load();
  };

  return (
    <div>
      <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-ink-900">Categorias</h1>
      <p className="text-slate-500 mt-2 text-sm">Agrupe produtos para facilitar a busca e os relatórios.</p>

      <div className="mt-8 grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="bg-white rounded-[28px] card-shadow border border-ASTER-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-400 text-left">
              <tr>
                <th className="px-6 py-3 font-semibold">Nome</th>
                <th className="px-6 py-3 font-semibold">Produtos</th>
                <th className="px-6 py-3 font-semibold"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ASTER-100">
              {categories?.map((c) => (
                <tr key={c.id}>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-ink-900">{c.name}</p>
                    {c.description && <p className="text-slate-400 text-xs mt-0.5">{c.description}</p>}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{c._count?.products ?? 0}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => onDelete(c)} className="p-2 rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors" aria-label={`Excluir ${c.name}`}>
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
              {categories && categories.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-10 text-center text-slate-400">Nenhuma categoria ainda.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-[28px] card-shadow border border-ASTER-100 p-6 h-fit">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-4">Nova categoria</p>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="text-[13px] font-bold text-ink-900 block mb-1.5">Nome *</label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-2xl px-4 py-3 text-[15px] outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-[13px] font-bold text-ink-900 block mb-1.5">Descrição</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-2xl px-4 py-3 text-[15px] outline-none transition-colors resize-none"
              />
            </div>
            {error && <p className="text-rose-500 text-sm font-semibold">{error}</p>}
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-ASTER-600 hover:bg-ASTER-700 disabled:opacity-60 text-white font-bold py-3 rounded-full transition-all"
            >
              {saving ? 'Adicionando…' : 'Adicionar categoria'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
