import { useEffect, useRef, useState, type ElementType, type KeyboardEvent } from 'react';
import { Monitor, Tablet, Smartphone, Image as ImageIcon, Plus, Star } from 'lucide-react';
import { api, resolveUploadUrl } from '../../lib/api';
import type { Site, Page } from '../../lib/webos/types';

type Device = 'desktop' | 'tablet' | 'mobile';
const DEVICE_WIDTH: Record<Device, string> = {
  desktop: 'max-w-full',
  tablet: 'max-w-[768px]',
  mobile: 'max-w-[390px]',
};

const EDITABLE_HOVER =
  'cursor-text rounded transition-shadow hover:shadow-[0_0_0_2px_rgba(124,58,237,0.4)] hover:shadow-ASTER-400 outline-none';

function EditableText({
  value,
  onSave,
  as: Tag = 'span',
  className = '',
  multiline = false,
  placeholder = 'Click to edit',
}: {
  value: string;
  onSave: (value: string) => void;
  as?: ElementType;
  className?: string;
  multiline?: boolean;
  placeholder?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    if (!editing) setDraft(value);
  }, [value, editing]);

  const commit = () => {
    setEditing(false);
    const trimmed = draft.trim();
    if (trimmed && trimmed !== value) onSave(trimmed);
    else setDraft(value);
  };

  const cancel = () => {
    setDraft(value);
    setEditing(false);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') cancel();
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      commit();
    }
  };

  if (editing) {
    return multiline ? (
      <textarea
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={onKeyDown}
        rows={Math.max(2, draft.split('\n').length)}
        className={`${className} w-full bg-white text-ink-900 rounded-lg px-2 py-1.5 outline-none ring-2 ring-ASTER-500 resize-y`}
      />
    ) : (
      <input
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={onKeyDown}
        className={`${className} w-full bg-white text-ink-900 rounded-lg px-2 py-1 outline-none ring-2 ring-ASTER-500`}
      />
    );
  }

  return (
    <Tag onClick={() => setEditing(true)} className={`${className} ${EDITABLE_HOVER} whitespace-pre-line`} title="Click to edit">
      {value || placeholder}
    </Tag>
  );
}

function EditableImage({
  src,
  onUpload,
  className = '',
  label = 'Add photo',
  rounded = 'rounded-2xl',
}: {
  src: string | null | undefined;
  onUpload: (file: File) => void;
  className?: string;
  label?: string;
  rounded?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const resolved = resolveUploadUrl(src);

  return (
    <div
      className={`relative group ${rounded} overflow-hidden bg-gradient-to-br from-ASTER-100 to-ASTER-50 cursor-pointer ${className}`}
      onClick={() => inputRef.current?.click()}
    >
      {resolved ? (
        <img src={resolved} alt="" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-ASTER-400 gap-1.5 min-h-[80px]">
          <ImageIcon size={24} />
          <span className="text-[11px] font-bold">{label}</span>
        </div>
      )}
      <div className="absolute inset-0 bg-ink-950/0 group-hover:bg-ink-950/35 transition-colors flex items-center justify-center">
        <span className="text-white text-[11px] font-bold bg-ink-950/70 px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          {resolved ? 'Replace photo' : label}
        </span>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onUpload(file);
          e.target.value = '';
        }}
      />
    </div>
  );
}

export default function WebsiteEditor({
  site,
  onRefresh,
  onAddTestimonial,
  onPublish,
}: {
  site: Site;
  onRefresh: () => void;
  onAddTestimonial: () => void;
  onPublish: () => void;
}) {
  const [activePageId, setActivePageId] = useState(site.pages[0]?.id ?? '');
  const [device, setDevice] = useState<Device>('desktop');

  useEffect(() => {
    if (!site.pages.some((p) => p.id === activePageId)) setActivePageId(site.pages[0]?.id ?? '');
  }, [site.pages, activePageId]);

  const page = site.pages.find((p) => p.id === activePageId) ?? site.pages[0];

  const patchSite = (data: Partial<{ businessName: string }>) => api.patch(`/webos/sites/${site.id}`, data).then(onRefresh);
  const patchPage = (pageId: string, data: Record<string, unknown>) => api.patch(`/webos/pages/${pageId}`, data).then(onRefresh);

  const uploadLogo = (file: File) => {
    const fd = new FormData();
    fd.append('logo', file);
    api.postForm(`/webos/sites/${site.id}/logo`, fd).then(onRefresh);
  };
  const uploadHeroImage = (pageId: string, file: File) => {
    const fd = new FormData();
    fd.append('image', file);
    api.postForm(`/webos/pages/${pageId}/hero-image`, fd).then(onRefresh);
  };
  const uploadSectionImage = (pageId: string, index: number, file: File) => {
    const fd = new FormData();
    fd.append('image', file);
    api.postForm(`/webos/pages/${pageId}/sections/${index}/image`, fd).then(onRefresh);
  };

  const saveSectionField = (p: Page, index: number, field: 'heading' | 'body', value: string) => {
    const sections = p.sections.map((s, i) => (i === index ? { ...s, [field]: value } : s));
    patchPage(p.id, { sections });
  };

  if (!page) {
    return <p className="text-slate-400">No pages on this site yet.</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
        <div className="flex items-center gap-1 bg-white border border-ASTER-100 rounded-full p-1 overflow-x-auto max-w-full">
          {site.pages.map((p) => (
            <button
              key={p.id}
              onClick={() => setActivePageId(p.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${page.id === p.id ? 'bg-ASTER-600 text-white' : 'text-slate-500 hover:text-ink-900'}`}
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
          {site.status === 'DRAFT' ? (
            <button onClick={onPublish} className="bg-ASTER-600 hover:bg-ASTER-700 text-white font-bold text-sm px-4 py-2 rounded-full transition-all whitespace-nowrap">
              Publish
            </button>
          ) : (
            <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 whitespace-nowrap">Published</span>
          )}
        </div>
      </div>

      <p className="text-[11px] text-slate-400 mb-3">Click any text or photo below to edit it directly — this is what the finished site will contain once published.</p>

      <div className={`mx-auto bg-white border border-ASTER-100 rounded-[28px] card-shadow overflow-hidden transition-all ${DEVICE_WIDTH[device]}`}>
        {/* Navbar */}
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-ASTER-100 flex-wrap">
          <div className="flex items-center gap-3 min-w-0">
            <EditableImage src={site.logoUrl} onUpload={uploadLogo} className="w-10 h-10 shrink-0" rounded="rounded-xl" label="Logo" />
            <EditableText
              value={site.businessName}
              onSave={(v) => patchSite({ businessName: v })}
              as="span"
              className="font-display font-extrabold text-lg text-ink-900 truncate px-1"
            />
          </div>
          <nav className="flex items-center gap-1 flex-wrap">
            {site.pages.map((p) => (
              <button
                key={p.id}
                onClick={() => setActivePageId(p.id)}
                className={`text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${page.id === p.id ? 'text-ASTER-600 bg-ASTER-50' : 'text-slate-500 hover:text-ink-900'}`}
              >
                {p.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Hero */}
        <div className="relative h-72 sm:h-96">
          <EditableImage src={page.heroImageUrl} onUpload={(f) => uploadHeroImage(page.id, f)} className="absolute inset-0" rounded="rounded-none" label="Add hero photo" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/30 to-ink-950/10 pointer-events-none" />
          <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 gap-3">
            <EditableText
              value={page.heroHeadline}
              onSave={(v) => patchPage(page.id, { heroHeadline: v })}
              as="h1"
              className="font-display font-extrabold text-2xl sm:text-4xl text-white max-w-2xl px-1"
              multiline
            />
            <EditableText
              value={page.heroSubheadline}
              onSave={(v) => patchPage(page.id, { heroSubheadline: v })}
              as="p"
              className="text-white/90 text-sm sm:text-base max-w-xl px-1"
              multiline
            />
            <div className="mt-1">
              <span className="inline-block bg-ASTER-600 rounded-full">
                <EditableText
                  value={page.ctaLabel}
                  onSave={(v) => patchPage(page.id, { ctaLabel: v })}
                  as="span"
                  className="inline-block text-white font-bold text-sm px-5 py-2.5"
                />
              </span>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="divide-y divide-ASTER-100">
          {page.sections.map((section, i) =>
            section.type === 'trust-placeholder' ? (
              <div key={i} className="p-6 sm:p-10">
                <EditableText
                  value={section.heading}
                  onSave={(v) => saveSectionField(page, i, 'heading', v)}
                  as="h3"
                  className="font-display font-bold text-xl text-ink-900 mb-5 inline-block px-1"
                />
                {site.testimonials.length > 0 ? (
                  <div className="grid sm:grid-cols-3 gap-4">
                    {site.testimonials.slice(0, 3).map((t) => (
                      <div key={t.id} className="bg-slate-50 rounded-2xl p-5">
                        <div className="flex gap-0.5 text-amber-400 mb-2">
                          {Array.from({ length: t.rating ?? 5 }).map((_, j) => <Star key={j} size={13} fill="currentColor" strokeWidth={0} />)}
                        </div>
                        <p className="text-sm text-ink-900">"{t.quote}"</p>
                        <p className="text-xs text-slate-500 mt-2 font-semibold">{t.authorName}{t.authorRole ? `, ${t.authorRole}` : ''}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <button onClick={onAddTestimonial} className="w-full border-2 border-dashed border-ASTER-200 rounded-2xl p-8 text-center hover:border-ASTER-400 transition-colors">
                    <p className="text-sm font-bold text-slate-500">No testimonials yet</p>
                    <p className="text-xs text-ASTER-600 font-bold mt-1 flex items-center justify-center gap-1"><Plus size={13} /> Add your first testimonial</p>
                  </button>
                )}
              </div>
            ) : (
              <div key={i} className={`p-6 sm:p-10 grid sm:grid-cols-2 gap-6 items-center ${i % 2 === 1 ? 'sm:[&>*:first-child]:order-2' : ''}`}>
                <EditableImage src={section.imageUrl} onUpload={(f) => uploadSectionImage(page.id, i, f)} className="aspect-video" />
                <div>
                  <EditableText
                    value={section.heading}
                    onSave={(v) => saveSectionField(page, i, 'heading', v)}
                    as="h3"
                    className="font-display font-bold text-xl text-ink-900 mb-2 inline-block px-1"
                  />
                  <EditableText
                    value={section.body}
                    onSave={(v) => saveSectionField(page, i, 'body', v)}
                    as="p"
                    className="text-sm text-slate-600 block px-1"
                    multiline
                  />
                </div>
              </div>
            ),
          )}
        </div>

        {/* Lead capture form */}
        {page.hasLeadForm && (
          <div className="p-6 sm:p-10 bg-slate-50 border-t border-ASTER-100">
            <p className="font-display font-bold text-lg text-ink-900 mb-1">Get in touch</p>
            <p className="text-xs text-slate-400 mb-4">Preview — this form captures real leads once the site is published and live.</p>
            <div className="grid sm:grid-cols-2 gap-3 max-w-lg">
              <input disabled placeholder="Name" className="border-2 border-ASTER-100 rounded-xl px-4 py-2.5 text-sm bg-white" />
              <input disabled placeholder="Email" className="border-2 border-ASTER-100 rounded-xl px-4 py-2.5 text-sm bg-white" />
              <textarea disabled placeholder="Message" rows={3} className="sm:col-span-2 border-2 border-ASTER-100 rounded-xl px-4 py-2.5 text-sm bg-white resize-none" />
              <button disabled className="sm:col-span-2 bg-ASTER-600 text-white font-bold text-sm py-2.5 rounded-full opacity-90">
                Send message
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 sm:px-10 py-8 bg-ink-950 text-white/70 flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="font-display font-bold text-white">{site.businessName}</p>
            <p className="text-xs mt-1">© {new Date().getFullYear()} {site.businessName}. All rights reserved.</p>
          </div>
          <nav className="flex items-center gap-4 flex-wrap">
            {site.pages.map((p) => (
              <button key={p.id} onClick={() => setActivePageId(p.id)} className="text-xs font-semibold hover:text-white transition-colors">
                {p.name}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
