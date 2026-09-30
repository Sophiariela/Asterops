import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Globe2, ArrowRight, LayoutTemplate, AlertTriangle } from 'lucide-react';
import { api, ApiError } from '../../lib/api';
import { SiteCardSkeleton } from '../../components/webos/Skeleton';
import type { Site } from '../../lib/webos/types';

export default function SitesPage() {
  const navigate = useNavigate();
  const [sites, setSites] = useState<Site[] | null>(null);
  const [loadError, setLoadError] = useState('');

  // A failed request must never render as "you have no sites" — that's
  // indistinguishable from real data loss. Only an actually-empty response
  // clears loadError; any thrown error (network, timeout, 5xx) keeps the
  // previous list on screen and surfaces a retry instead.
  const load = () => {
    api.get<{ sites: Site[] }>('/webos/sites')
      .then((data) => { setSites(data.sites); setLoadError(''); })
      .catch((err) => setLoadError(err instanceof ApiError ? err.message : 'Could not load your sites. Check your connection and try again.'));
  };

  useEffect(load, []);

  return (
    <div>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-ink-900">WebOS</h1>
          <p className="text-slate-500 mt-2 text-sm">Your business acquisition infrastructure. Generate a site, then let WebOS help it attract, convert and build trust.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/webos/templates"
            className="flex items-center gap-2 text-ASTER-600 hover:text-ASTER-700 font-bold text-sm px-4 py-2.5 rounded-full border-2 border-ASTER-100 hover:border-ASTER-300 transition-colors whitespace-nowrap"
          >
            <LayoutTemplate size={16} /> Browse Template Library
          </Link>
          <Link
            to="/webos/new"
            className="flex items-center gap-2 bg-ASTER-600 hover:bg-ASTER-700 text-white font-bold px-5 py-2.5 rounded-full transition-all whitespace-nowrap"
          >
            <Plus size={16} /> Generate a site
          </Link>
        </div>
      </div>

      {loadError && (
        <div className="mt-10 bg-rose-50 border border-rose-200 rounded-[28px] p-8 text-center">
          <AlertTriangle size={32} className="text-rose-500 mx-auto" />
          <p className="text-rose-700 font-semibold mt-3">{loadError}</p>
          <button onClick={load} className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold px-5 py-2.5 rounded-full transition-all mt-5">
            Try again
          </button>
        </div>
      )}

      {!loadError && sites && sites.length === 0 && (
        <div className="mt-10 bg-white rounded-[28px] card-shadow border border-ASTER-100 p-10 text-center">
          <Globe2 size={40} className="text-ASTER-600 mx-auto" />
          <p className="text-slate-600 mt-4">No sites yet. Generate your first one in under 3 minutes.</p>
          <Link
            to="/webos/new"
            className="inline-flex items-center gap-2 bg-ASTER-600 hover:bg-ASTER-700 text-white font-bold px-5 py-2.5 rounded-full transition-all mt-5"
          >
            <Plus size={16} /> Generate a site
          </Link>
        </div>
      )}

      <div className="mt-8 grid sm:grid-cols-2 gap-5">
        {!loadError && sites === null && Array.from({ length: 4 }).map((_, i) => <SiteCardSkeleton key={i} />)}
        {sites?.map((s) => (
          <button
            key={s.id}
            onClick={() => navigate(`/webos/${s.id}`)}
            className="text-left bg-white rounded-[28px] card-shadow border border-ASTER-100 p-6 hover:-translate-y-0.5 transition-transform"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-display font-bold text-lg text-ink-900">{s.businessName}</p>
                <p className="text-slate-500 text-sm mt-1">{s.industry}</p>
              </div>
              <span className={`text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap ${s.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {s.status === 'PUBLISHED' ? 'Published' : 'Draft'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-4">{s._count?.pages ?? 0} pages · {s._count?.testimonials ?? 0} testimonials · {s._count?.leads ?? 0} leads</p>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-ASTER-600 mt-4">
              Open <ArrowRight size={13} />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
