import { useEffect, useState } from 'react';
import { Star, ArrowUpRight, Trash2 } from 'lucide-react';
import { api } from '../../lib/api';
import type { Review } from '../../lib/webos/types';

export default function ReviewsPanel({ siteId, onPromoted }: { siteId: string; onPromoted?: () => void }) {
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [promotingId, setPromotingId] = useState<string | null>(null);

  const load = () => {
    api.get<{ reviews: Review[] }>(`/webos/sites/${siteId}/reviews`).then((d) => setReviews(d.reviews)).catch(() => setReviews([]));
  };
  useEffect(load, [siteId]);

  const promote = async (id: string) => {
    setPromotingId(id);
    try {
      await api.post(`/webos/sites/${siteId}/reviews/${id}/promote`);
      load();
      onPromoted?.();
    } finally {
      setPromotingId(null);
    }
  };

  const remove = async (id: string) => {
    await api.del(`/webos/sites/${siteId}/reviews/${id}`);
    load();
  };

  if (!reviews) return <p className="text-slate-400">Loading reviews…</p>;

  return (
    <div className="bg-white rounded-[28px] card-shadow border border-ASTER-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Visitor reviews ({reviews.length})</p>
      </div>
      <p className="text-xs text-slate-400 mb-4">Submitted directly from your public site. Promote one to put it on the live site as a testimonial.</p>
      <div className="space-y-3">
        {reviews.map((r) => (
          <div key={r.id} className="flex items-start justify-between gap-3 bg-slate-50 rounded-2xl p-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-semibold text-ink-900">{r.authorName}</p>
                <div className="flex gap-0.5 text-amber-400">
                  {Array.from({ length: r.rating }).map((_, i) => <Star key={i} size={12} fill="currentColor" strokeWidth={0} />)}
                </div>
                {r.status === 'PUBLISHED' && <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">Live as testimonial</span>}
              </div>
              <p className="text-sm text-ink-900 mt-1.5">"{r.comment}"</p>
              {r.source && <p className="text-xs text-slate-400 mt-1">{r.source}</p>}
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {r.status !== 'PUBLISHED' && (
                <button
                  onClick={() => promote(r.id)}
                  disabled={promotingId === r.id}
                  className="flex items-center gap-1 text-xs font-bold text-ASTER-600 hover:text-ASTER-700 disabled:opacity-60 px-2 py-1"
                >
                  {promotingId === r.id ? 'Promoting…' : 'Promote'} <ArrowUpRight size={12} />
                </button>
              )}
              <button onClick={() => remove(r.id)} className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors" aria-label="Delete review">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
        {reviews.length === 0 && <p className="text-sm text-slate-400">No reviews submitted yet.</p>}
      </div>
    </div>
  );
}
