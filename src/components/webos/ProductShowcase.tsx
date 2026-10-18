import { useEffect, useState, type FormEvent } from 'react';
import { CheckCircle2, PackageX, ShoppingBag } from 'lucide-react';
import { api, ApiError, resolveUploadUrl } from '../../lib/api';
import type { Currency, PublicProduct } from '../../lib/webos/types';

function formatPrice(cents: number, currency: Currency): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(cents / 100);
}

// Pulls the real CommerceOS product catalog for this tenant (see
// sites.service.getPublicSiteProducts) — never a fake storefront. There
// is no multi-tenant checkout wired up yet, so "Buy" is an honest
// ordering inquiry (a real Lead the owner sees and fulfills manually)
// instead of a payment flow that doesn't exist.
export default function ProductShowcase({
  siteId, currency, previewProducts, previewMode,
}: {
  siteId: string;
  currency: Currency;
  // Template Library preview: static example products, no network call
  // (there's no real tenant catalog behind a "preview" site id).
  previewProducts?: PublicProduct[];
  previewMode?: boolean;
}) {
  const [products, setProducts] = useState<PublicProduct[] | null>(previewProducts ?? null);
  const [loadError, setLoadError] = useState('');
  const [inquiring, setInquiring] = useState<PublicProduct | null>(null);

  useEffect(() => {
    if (previewProducts) return;
    api.get<{ products: PublicProduct[] }>(`/webos/public/sites/${siteId}/products`)
      .then((data) => setProducts(data.products))
      .catch((err) => setLoadError(err instanceof ApiError ? err.message : 'Could not load products.'));
  }, [siteId, previewProducts]);

  if (loadError) return <p className="text-sm text-rose-500">{loadError}</p>;
  if (products === null) return <p className="text-sm text-slate-400">Loading products…</p>;
  if (products.length === 0) {
    return (
      <div className="text-center py-10 bg-slate-50 rounded-2xl">
        <PackageX className="mx-auto text-slate-300" size={28} />
        <p className="text-sm text-slate-400 mt-2">No products published yet.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p.id} className="bg-white border border-ASTER-100 rounded-2xl overflow-hidden flex flex-col">
            {p.imageUrl ? (
              <img src={resolveUploadUrl(p.imageUrl) ?? undefined} alt="" className="aspect-square w-full object-cover" />
            ) : (
              <div className="aspect-square bg-ASTER-50 flex items-center justify-center"><ShoppingBag className="text-ASTER-200" size={28} /></div>
            )}
            <div className="p-4 flex flex-col flex-1">
              <p className="text-sm font-bold text-ink-900">{p.name}</p>
              {p.description && <p className="text-xs text-slate-500 mt-1 line-clamp-2 flex-1">{p.description}</p>}
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-ink-900 tabular-nums">{formatPrice(p.price, currency)}</span>
                  {p.compareAtPrice && p.compareAtPrice > p.price && (
                    <span className="text-xs text-slate-400 line-through tabular-nums">{formatPrice(p.compareAtPrice, currency)}</span>
                  )}
                </div>
                {p.stockQuantity <= 0 && <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">Out of stock</span>}
              </div>
              <button
                type="button"
                disabled={p.stockQuantity <= 0 || previewMode}
                onClick={() => setInquiring(p)}
                className="mt-3 w-full bg-ASTER-600 hover:bg-ASTER-700 disabled:opacity-50 text-white font-bold text-xs py-2 rounded-full transition-all"
              >
                Order this
              </button>
            </div>
          </div>
        ))}
      </div>
      {previewMode && <p className="text-[11px] text-slate-400 mt-3">Preview. Ordering collects a real request once the site is generated and published.</p>}

      {inquiring && !previewMode && <ProductInquiryModal siteId={siteId} product={inquiring} onClose={() => setInquiring(null)} />}
    </div>
  );
}

function ProductInquiryModal({ siteId, product, onClose }: { siteId: string; product: PublicProduct; onClose: () => void }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email) {
      setError('Please fill in your name and email.');
      return;
    }
    setSubmitting(true);
    try {
      const message = [`Product: ${product.name}`, form.message ? `\n${form.message}` : null].filter(Boolean).join('\n');
      await api.post('/webos/public/leads', {
        siteId, name: form.name, email: form.email, phone: form.phone || undefined, message, source: 'product-inquiry',
      });
      setSent(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not send this order request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/40" onClick={onClose}>
      <div className="bg-white rounded-[28px] card-shadow border border-ASTER-100 w-full max-w-md p-7" onClick={(e) => e.stopPropagation()}>
        {sent ? (
          <div className="text-center py-4">
            <CheckCircle2 className="mx-auto text-emerald-600" size={32} />
            <p className="font-display font-bold text-lg text-ink-900 mt-3">Order request sent!</p>
            <p className="text-sm text-slate-500 mt-1">We'll follow up to confirm details and payment.</p>
            <button onClick={onClose} className="mt-5 text-sm font-bold text-ASTER-600 hover:text-ASTER-700">Close</button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            <h2 className="font-display font-extrabold text-lg text-ink-900">Order: {product.name}</h2>
            <p className="text-xs text-slate-400">Checkout isn't connected on this site yet — send an order request and the business will follow up to confirm payment.</p>
            <input required placeholder="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors" />
            <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors" />
            <input placeholder="Phone (optional)" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors" />
            <textarea placeholder="Quantity, size, notes…" rows={2} value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors resize-none" />
            {error && <p className="text-rose-500 text-sm font-semibold">{error}</p>}
            <div className="flex items-center gap-2">
              <button type="submit" disabled={submitting} className="flex-1 bg-ASTER-600 hover:bg-ASTER-700 disabled:opacity-60 text-white font-bold text-sm py-2.5 rounded-full transition-all">
                {submitting ? 'Sending…' : 'Send order request'}
              </button>
              <button type="button" onClick={onClose} className="text-sm font-semibold text-slate-400 hover:text-ink-900 px-3">Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
