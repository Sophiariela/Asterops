import { useState } from 'react';
import { Sparkles, Wand2, UtensilsCrossed, Search, TrendingUp, Check } from 'lucide-react';
import { api, ApiError } from '../../lib/api';

type ActionKey = 'improve-homepage' | 'generate-menu-descriptions' | 'improve-seo' | 'increase-reservations';

type ActionResult =
  | { kind: 'applied'; message: string }
  | { kind: 'advice'; lines: string[] }
  | { kind: 'error'; message: string };

export default function LunaQuickActions({ siteId, isRestaurant, onChanged }: { siteId: string; isRestaurant: boolean; onChanged: () => void }) {
  const [running, setRunning] = useState<ActionKey | null>(null);
  const [results, setResults] = useState<Partial<Record<ActionKey, ActionResult>>>({});

  const run = async (key: ActionKey) => {
    setRunning(key);
    setResults((r) => ({ ...r, [key]: undefined }));
    try {
      if (key === 'improve-homepage') {
        const data = await api.post<{ page: { heroHeadline: string } }>(`/webos/sites/${siteId}/analytics/luna/actions/improve-homepage`);
        setResults((r) => ({ ...r, [key]: { kind: 'applied', message: `Updated: "${data.page.heroHeadline}"` } }));
        onChanged();
      } else if (key === 'generate-menu-descriptions') {
        const data = await api.post<{ items: { id: string; name: string; description: string }[] }>(`/webos/sites/${siteId}/analytics/luna/actions/generate-menu-descriptions`);
        setResults((r) => ({
          ...r,
          [key]: data.items.length
            ? { kind: 'applied', message: `Wrote descriptions for ${data.items.length} item(s): ${data.items.map((i) => i.name).join(', ')}` }
            : { kind: 'applied', message: 'Every menu item already has a description.' },
        }));
        if (data.items.length) onChanged();
      } else if (key === 'improve-seo') {
        const data = await api.post<{ pages: { id: string; seoTitle: string }[] }>(`/webos/sites/${siteId}/analytics/luna/actions/improve-seo`);
        setResults((r) => ({
          ...r,
          [key]: data.pages.length
            ? { kind: 'applied', message: `Filled in SEO for ${data.pages.length} page(s).` }
            : { kind: 'applied', message: 'Every page already has SEO title and description.' },
        }));
        if (data.pages.length) onChanged();
      } else {
        const data = await api.post<{ review: string[] }>(`/webos/sites/${siteId}/analytics/luna/actions/increase-reservations`);
        setResults((r) => ({ ...r, [key]: { kind: 'advice', lines: data.review } }));
      }
    } catch (err) {
      setResults((r) => ({ ...r, [key]: { kind: 'error', message: err instanceof ApiError ? err.message : 'Could not reach Luna AI.' } }));
    } finally {
      setRunning(null);
    }
  };

  const actions: { key: ActionKey; label: string; icon: typeof Wand2; show: boolean }[] = [
    { key: 'improve-homepage', label: 'Improve my homepage', icon: Wand2, show: true },
    { key: 'generate-menu-descriptions', label: 'Generate menu descriptions', icon: UtensilsCrossed, show: isRestaurant },
    { key: 'improve-seo', label: 'Improve SEO', icon: Search, show: true },
    { key: 'increase-reservations', label: 'Increase reservations', icon: TrendingUp, show: isRestaurant },
  ];

  return (
    <div className="bg-gradient-to-br from-ASTER-700 to-ASTER-500 rounded-[28px] card-shadow p-6 text-white">
      <p className="font-display font-bold text-lg flex items-center gap-2 mb-4"><Sparkles size={18} /> Luna, Business Consultant</p>
      <div className="flex flex-wrap gap-2">
        {actions.filter((a) => a.show).map((a) => (
          <button
            key={a.key}
            onClick={() => run(a.key)}
            disabled={running !== null}
            className="flex items-center gap-1.5 text-xs font-bold bg-white/15 hover:bg-white/25 disabled:opacity-60 px-3.5 py-2 rounded-full transition-colors"
          >
            {running === a.key ? <Sparkles size={13} className="animate-pulse" /> : <a.icon size={13} />}
            {running === a.key ? 'Thinking…' : a.label}
          </button>
        ))}
      </div>

      {Object.entries(results).map(([key, result]) => {
        if (!result) return null;
        return (
          <div key={key} className="mt-4 pt-4 border-t border-white/20">
            {result.kind === 'applied' && (
              <p className="text-sm flex items-start gap-1.5"><Check size={15} className="shrink-0 mt-0.5" /> {result.message}</p>
            )}
            {result.kind === 'advice' && (
              <ul className="space-y-2">
                {result.lines.map((l, i) => <li key={i} className="text-sm">• {l}</li>)}
              </ul>
            )}
            {result.kind === 'error' && <p className="text-sm text-white/80">{result.message}</p>}
          </div>
        );
      })}
    </div>
  );
}
