import { useEffect, useState, type FormEvent } from 'react';
import { Monitor, Tablet, Smartphone, Plus, Star, UtensilsCrossed, CalendarCheck, ArrowUpRight, ArrowRight, CheckCircle2 } from 'lucide-react';
import { api, ApiError } from '../../lib/api';
import { EditableText, EditableImage } from './editable';
import type { Site, Page, MenuItem } from '../../lib/webos/types';

type Device = 'desktop' | 'tablet' | 'mobile';
const DEVICE_WIDTH: Record<Device, string> = {
  desktop: 'max-w-full',
  tablet: 'max-w-[768px]',
  mobile: 'max-w-[390px]',
};

function EditablePrice({ cents, onSave }: { cents: number | null; onSave: (cents: number | null) => void }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(cents === null ? '' : (cents / 100).toFixed(2));

  useEffect(() => {
    if (!editing) setDraft(cents === null ? '' : (cents / 100).toFixed(2));
  }, [cents, editing]);

  const commit = () => {
    setEditing(false);
    if (draft.trim() === '') {
      onSave(null);
      return;
    }
    const n = Number(draft);
    if (!Number.isNaN(n) && n >= 0) onSave(Math.round(n * 100));
  };

  if (editing) {
    return (
      <input
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); commit(); } }}
        className="w-20 bg-white text-ink-900 rounded-lg px-2 py-1 outline-none ring-2 ring-ASTER-500 text-sm font-bold text-right"
      />
    );
  }

  return (
    <span
      onClick={(e) => { e.stopPropagation(); setEditing(true); }}
      className="text-sm font-bold text-ink-900 tabular-nums whitespace-nowrap cursor-text rounded transition-shadow hover:shadow-[0_0_0_2px_rgba(124,58,237,0.4)]"
      title="Click to edit price"
    >
      {cents === null ? <span className="text-slate-400 font-normal italic text-xs">no price</span> : `$${(cents / 100).toFixed(2)}`}
    </span>
  );
}

function ReservationBookingForm({ siteId }: { siteId: string }) {
  const [form, setForm] = useState({ date: '', time: '', partySize: '2', name: '', email: '', phone: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [confirmed, setConfirmed] = useState<{ name: string; date: string; time: string; partySize: string } | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.date || !form.time || !form.name || !form.email) {
      setError('Please fill in date, time, name and email.');
      return;
    }
    setSubmitting(true);
    try {
      const reservationAt = new Date(`${form.date}T${form.time}`).toISOString();
      await api.post('/webos/public/reservations', {
        siteId,
        customerName: form.name,
        customerEmail: form.email,
        customerPhone: form.phone || undefined,
        partySize: Number(form.partySize),
        reservationAt,
        notes: form.notes || undefined,
      });
      setConfirmed({ name: form.name, date: form.date, time: form.time, partySize: form.partySize });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not submit this reservation.');
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmed) {
    return (
      <div className="text-center py-8 max-w-lg mx-auto">
        <CheckCircle2 className="mx-auto text-emerald-600" size={32} />
        <p className="font-display font-bold text-lg text-ink-900 mt-3">Reservation requested!</p>
        <p className="text-sm text-slate-500 mt-1">
          {confirmed.name}, party of {confirmed.partySize} on {confirmed.date} at {confirmed.time}. We'll confirm shortly.
        </p>
        <button onClick={() => setConfirmed(null)} className="mt-4 text-sm font-bold text-ASTER-600 hover:text-ASTER-700">
          Make another reservation
        </button>
      </div>
    );
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <form onSubmit={submit} className="grid sm:grid-cols-2 gap-3 max-w-lg">
      <input required type="date" min={today} value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} className="border-2 border-ASTER-100 focus:border-ASTER-600 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors" />
      <input required type="time" value={form.time} onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))} className="border-2 border-ASTER-100 focus:border-ASTER-600 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors" />
      <select value={form.partySize} onChange={(e) => setForm((f) => ({ ...f, partySize: e.target.value }))} className="sm:col-span-2 border-2 border-ASTER-100 focus:border-ASTER-600 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n} {n === 1 ? 'guest' : 'guests'}</option>)}
        <option value={12}>10+ guests</option>
      </select>
      <input required placeholder="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="border-2 border-ASTER-100 focus:border-ASTER-600 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors" />
      <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="border-2 border-ASTER-100 focus:border-ASTER-600 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors" />
      <input placeholder="Phone (optional)" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="sm:col-span-2 border-2 border-ASTER-100 focus:border-ASTER-600 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors" />
      <textarea placeholder="Special requests (optional)" rows={2} value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} className="sm:col-span-2 border-2 border-ASTER-100 focus:border-ASTER-600 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors resize-none" />
      {error && <p className="sm:col-span-2 text-rose-500 text-sm font-semibold">{error}</p>}
      <button type="submit" disabled={submitting} className="sm:col-span-2 bg-ASTER-600 hover:bg-ASTER-700 disabled:opacity-60 text-white font-bold text-sm py-2.5 rounded-full transition-all">
        {submitting ? 'Submitting…' : 'Request reservation'}
      </button>
    </form>
  );
}

export default function WebsiteEditor({
  site,
  onRefresh,
  onAddTestimonial,
  onPublish,
  onManageMenu,
  onManageReservations,
}: {
  site: Site;
  onRefresh: () => void;
  onAddTestimonial: () => void;
  onPublish: () => void;
  onManageMenu?: () => void;
  onManageReservations?: () => void;
}) {
  const [activePageId, setActivePageId] = useState(site.pages[0]?.id ?? '');
  const [device, setDevice] = useState<Device>('desktop');

  useEffect(() => {
    if (!site.pages.some((p) => p.id === activePageId)) setActivePageId(site.pages[0]?.id ?? '');
  }, [site.pages, activePageId]);

  const page = site.pages.find((p) => p.id === activePageId) ?? site.pages[0];

  const patchSite = (data: Partial<{ businessName: string }>) => api.patch(`/webos/sites/${site.id}`, data).then(onRefresh);
  const patchPage = (pageId: string, data: Record<string, unknown>) => api.patch(`/webos/pages/${pageId}`, data).then(onRefresh);
  const patchMenuItem = (id: string, data: Partial<Pick<MenuItem, 'name' | 'priceCents'>>) =>
    api.patch(`/webos/sites/${site.id}/menu/items/${id}`, data).then(onRefresh);

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
  const uploadMenuItemImage = (itemId: string, file: File) => {
    const fd = new FormData();
    fd.append('image', file);
    api.postForm(`/webos/sites/${site.id}/menu/items/${itemId}/image`, fd).then(onRefresh);
  };

  const saveSectionField = (p: Page, index: number, field: 'heading' | 'body', value: string) => {
    const sections = p.sections.map((s, i) => (i === index ? { ...s, [field]: value } : s));
    patchPage(p.id, { sections });
  };

  const goToPageBySlug = (slug: string) => {
    const target = site.pages.find((p) => p.slug === slug);
    if (target) setActivePageId(target.id);
  };

  if (!page) {
    return <p className="text-slate-400">No pages on this site yet.</p>;
  }

  const isRestaurant = site.playbook === 'RESTAURANT';
  const isMenuPage = isRestaurant && page.slug === 'menu';
  const isReservationsPage = isRestaurant && page.slug === 'reservations';
  const isHomePage = page.slug === 'home';
  const featuredItems = isRestaurant ? site.menuCategories.flatMap((c) => c.items).filter((i) => i.featured) : [];
  const ctaTargetSlug = page.ctaHref?.replace(/^\//, '');

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

      <p className="text-[11px] text-slate-400 mb-3">Click any text, price or photo below to edit it directly — this is what the finished site will contain once published.</p>

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
            <div className="mt-1 flex items-center gap-2">
              <span className="inline-block bg-ASTER-600 rounded-full">
                <EditableText
                  value={page.ctaLabel}
                  onSave={(v) => patchPage(page.id, { ctaLabel: v })}
                  as="span"
                  className="inline-block text-white font-bold text-sm px-5 py-2.5"
                />
              </span>
              {ctaTargetSlug && (
                <button
                  onClick={() => goToPageBySlug(ctaTargetSlug)}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
                  title={`This button links to the ${ctaTargetSlug} page — click to go there`}
                >
                  <ArrowRight size={14} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Featured menu items — Home page only, real content pulled from Menu Manager */}
        {isHomePage && isRestaurant && featuredItems.length > 0 && (
          <div className="p-6 sm:p-10 border-t border-ASTER-100">
            <p className="font-display font-bold text-xl text-ink-900 mb-5 flex items-center gap-2">
              <Star size={18} className="text-amber-500" fill="currentColor" /> Featured on our menu
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
              {featuredItems.map((item) => (
                <div key={item.id} className="bg-slate-50 rounded-2xl overflow-hidden">
                  <EditableImage src={item.imageUrl} onUpload={(f) => uploadMenuItemImage(item.id, f)} className="aspect-video" rounded="rounded-none" />
                  <div className="p-4">
                    <div className="flex items-center justify-between gap-2">
                      <EditableText value={item.name} onSave={(v) => patchMenuItem(item.id, { name: v })} as="p" className="text-sm font-bold text-ink-900" />
                      <EditablePrice cents={item.priceCents} onSave={(c) => patchMenuItem(item.id, { priceCents: c })} />
                    </div>
                    {item.description && <p className="text-xs text-slate-500 mt-1">{item.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Restaurant Menu — dynamic from the Menu Manager, editable right here */}
        {isMenuPage && (
          <div className="p-6 sm:p-10 border-t border-ASTER-100">
            <div className="flex items-center justify-between gap-4 mb-5">
              <p className="font-display font-bold text-xl text-ink-900 flex items-center gap-2"><UtensilsCrossed size={18} className="text-ASTER-600" /> Menu</p>
              {onManageMenu && (
                <button onClick={onManageMenu} className="flex items-center gap-1 text-xs font-bold text-ASTER-600 hover:text-ASTER-700">
                  Manage menu <ArrowUpRight size={13} />
                </button>
              )}
            </div>
            {site.menuCategories.length === 0 ? (
              <p className="text-sm text-slate-400">No menu items yet — add categories and items in Menu Manager.</p>
            ) : (
              <div className="space-y-6">
                {site.menuCategories.map((cat) => (
                  <div key={cat.id}>
                    <p className="text-xs font-bold text-ASTER-600 uppercase tracking-wide mb-2">{cat.name}</p>
                    <div className="space-y-2">
                      {cat.items.map((item) => (
                        <div key={item.id} className={`flex items-center gap-3 py-2 border-b border-ASTER-50 ${!item.available ? 'opacity-50' : ''}`}>
                          <EditableImage src={item.imageUrl} onUpload={(f) => uploadMenuItemImage(item.id, f)} className="w-12 h-12 shrink-0" rounded="rounded-lg" label="" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-ink-900 flex items-center gap-1.5">
                              <EditableText value={item.name} onSave={(v) => patchMenuItem(item.id, { name: v })} as="span" />
                              {item.featured && <span className="text-[9px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-full shrink-0">FEATURED</span>}
                              {!item.available && <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-full shrink-0">UNAVAILABLE</span>}
                            </p>
                            {item.description && <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>}
                          </div>
                          <EditablePrice cents={item.priceCents} onSave={(c) => patchMenuItem(item.id, { priceCents: c })} />
                        </div>
                      ))}
                      {cat.items.length === 0 && <p className="text-xs text-slate-400">No items in this category yet.</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Sections */}
        <div className="divide-y divide-ASTER-100">
          {!isMenuPage && page.sections.map((section, i) =>
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

        {/* Reservation booking — a real, functional form (not a preview) on the Reservations page */}
        {isReservationsPage && (
          <div className="p-6 sm:p-10 bg-slate-50 border-t border-ASTER-100">
            <div className="flex items-center justify-between gap-4 mb-1">
              <p className="font-display font-bold text-lg text-ink-900 flex items-center gap-2"><CalendarCheck size={18} className="text-ASTER-600" /> Reserve a table</p>
              {onManageReservations && (
                <button onClick={onManageReservations} className="flex items-center gap-1 text-xs font-bold text-ASTER-600 hover:text-ASTER-700">
                  Manage reservations <ArrowUpRight size={13} />
                </button>
              )}
            </div>
            <p className="text-xs text-slate-400 mb-4">Fully functional — submissions appear in your Reservations dashboard right away.</p>
            <ReservationBookingForm siteId={site.id} />
          </div>
        )}

        {/* Generic lead capture form — everything else (e.g. a restaurant's general Contact page, or any non-restaurant site) */}
        {page.hasLeadForm && !isReservationsPage && (
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
