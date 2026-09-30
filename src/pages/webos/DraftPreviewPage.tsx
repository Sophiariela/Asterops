import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { X } from 'lucide-react';
import { api } from '../../lib/api';
import PublicSiteRenderer from '../../components/webos/PublicSiteRenderer';
import type { Site } from '../../lib/webos/types';

// Deliberately outside WebOSLayout: no dashboard nav, no edit affordances,
// no badges. A site owner's own draft rendered exactly as a real visitor
// would see it once published — /site/:slug already does this for
// published sites, this closes the gap for drafts.
export default function DraftPreviewPage() {
  const { id } = useParams<{ id: string }>();
  const [site, setSite] = useState<Site | null>(null);
  const [pageIndex, setPageIndex] = useState(0);

  useEffect(() => {
    if (!id) return;
    api.get<{ site: Site }>(`/webos/sites/${id}`).then((data) => setSite(data.site));
  }, [id]);

  if (!site) {
    return <div className="min-h-screen flex items-center justify-center text-slate-400 text-sm">Loading preview…</div>;
  }

  const page = site.pages[pageIndex] ?? site.pages[0];

  return (
    <div className="min-h-screen bg-white">
      <Link
        to={`/webos/${site.id}`}
        className="fixed top-4 right-4 z-50 w-10 h-10 rounded-full bg-ink-950/80 hover:bg-ink-950 text-white flex items-center justify-center backdrop-blur transition-colors"
        aria-label="Exit preview"
        title="Exit preview"
      >
        <X size={18} />
      </Link>
      {page && (
        <PublicSiteRenderer
          site={site}
          page={page}
          siteSlug={site.slug ?? site.id}
          previewMode
          onNavigate={(slug) => {
            const idx = site.pages.findIndex((p) => p.slug === slug);
            if (idx >= 0) setPageIndex(idx);
          }}
        />
      )}
    </div>
  );
}
