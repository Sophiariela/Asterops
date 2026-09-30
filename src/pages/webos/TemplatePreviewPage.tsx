import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Monitor, Tablet, Smartphone } from 'lucide-react';
import { api } from '../../lib/api';
import PublicSiteRenderer from '../../components/webos/PublicSiteRenderer';
import { buildTemplatePreviewSite } from '../../lib/webos/templatePreview';
import type { TemplateDetail } from '../../lib/webos/types';

type Device = 'desktop' | 'tablet' | 'mobile';
const DEVICE_WIDTH: Record<Device, string> = {
  desktop: 'max-w-full',
  tablet: 'max-w-[768px]',
  mobile: 'max-w-[390px]',
};

// Full-page, immersive equivalent of the old capped modal preview — the
// same real template content (real sections, real menu, real testimonials),
// just given the room to actually look like a finished site.
export default function TemplatePreviewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [detail, setDetail] = useState<TemplateDetail | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [device, setDevice] = useState<Device>('desktop');

  useEffect(() => {
    if (!id) return;
    api.get<{ template: TemplateDetail }>(`/webos/templates/${id}`).then((data) => setDetail(data.template));
  }, [id]);

  const previewSite = useMemo(() => (detail ? buildTemplatePreviewSite(detail) : null), [detail]);
  const page = previewSite?.pages[pageIndex] ?? previewSite?.pages[0];

  if (!detail || !previewSite) {
    return <div className="min-h-screen flex items-center justify-center text-slate-400 text-sm">Loading preview…</div>;
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="sticky top-0 z-40 bg-white border-b border-ASTER-100 px-4 sm:px-6 py-3 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <Link to="/webos/templates" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-ASTER-600 transition-colors shrink-0">
            <ArrowLeft size={16} /> Back
          </Link>
          <span className="text-slate-200 shrink-0">|</span>
          <div className="min-w-0">
            <p className="font-display font-bold text-ink-900 truncate">{detail.name}</p>
            <p className="text-[11px] text-slate-400">{detail.pageCount} pages · {detail.industry}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-wrap">
          {previewSite.pages.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setPageIndex(i)}
              className={`text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${pageIndex === i ? 'bg-ASTER-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
            >
              {p.name}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-100 rounded-full p-1">
            {([{ key: 'desktop' as Device, icon: Monitor }, { key: 'tablet' as Device, icon: Tablet }, { key: 'mobile' as Device, icon: Smartphone }]).map(({ key, icon: Icon }) => (
              <button key={key} onClick={() => setDevice(key)} className={`p-2 rounded-full transition-colors ${device === key ? 'bg-white text-ASTER-600 card-shadow-sm' : 'text-slate-400'}`} aria-label={key}>
                <Icon size={15} />
              </button>
            ))}
          </div>
          <button
            onClick={() => navigate(`/webos/new?template=${detail.id}`)}
            className="bg-ASTER-600 hover:bg-ASTER-700 text-white font-bold text-sm px-4 py-2 rounded-full transition-all inline-flex items-center gap-1.5 whitespace-nowrap"
          >
            Use this template <ArrowRight size={14} />
          </button>
        </div>
      </header>

      <div className="py-8 px-4">
        <div className={`mx-auto bg-white rounded-[28px] card-shadow overflow-hidden transition-all ${DEVICE_WIDTH[device]}`}>
          {page && (
            <PublicSiteRenderer
              site={previewSite}
              page={page}
              siteSlug="preview"
              previewMode
              onNavigate={(slug) => {
                const idx = previewSite.pages.findIndex((p) => p.slug === slug);
                if (idx >= 0) setPageIndex(idx);
              }}
            />
          )}
        </div>
        <p className="text-center text-xs text-slate-400 mt-4">Live preview with example copy and photos. Your generated site uses your real business name, services and content instead.</p>
      </div>
    </div>
  );
}
