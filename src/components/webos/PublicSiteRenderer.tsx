import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Star, UtensilsCrossed, CalendarCheck, CheckCircle2 } from 'lucide-react';
import { api, ApiError, resolveUploadUrl } from '../../lib/api';
import ReservationBookingForm from './ReservationBookingForm';
import { formatMoney } from '../../lib/webos/currency';
import type { PublicSite, PublicPage } from '../../lib/webos/types';

function LeadCaptureForm({ siteId, pageId }: { siteId: string; pageId: string }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.email) {
      setError('Please enter your email.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await api.post('/webos/public/leads', {
        siteId,
        pageId,
        name: form.name || undefined,
        email: form.email,
        message: form.message || undefined,
        source: 'website',
      });
      setSent(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not send this message.');
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center py-8 max-w-lg">
        <CheckCircle2 className="mx-auto text-emerald-600" size={32} />
        <p className="font-display font-bold text-lg text-ink-900 mt-3">Message sent!</p>
        <p className="text-sm text-slate-500 mt-1">Thanks for reaching out — we'll get back to you shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid sm:grid-cols-2 gap-3 max-w-lg">
      <input placeholder="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="border-2 border-ASTER-100 focus:border-ASTER-600 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors" />
      <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="border-2 border-ASTER-100 focus:border-ASTER-600 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors" />
      <textarea placeholder="Message" rows={3} value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} className="sm:col-span-2 border-2 border-ASTER-100 focus:border-ASTER-600 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors resize-none" />
      {error && <p className="sm:col-span-2 text-rose-500 text-sm font-semibold">{error}</p>}
      <button type="submit" disabled={submitting} className="sm:col-span-2 bg-ASTER-600 hover:bg-ASTER-700 disabled:opacity-60 text-white font-bold text-sm py-2.5 rounded-full transition-all">
        {submitting ? 'Sending…' : 'Send message'}
      </button>
    </form>
  );
}

export default function PublicSiteRenderer({ site, page, siteSlug }: { site: PublicSite; page: PublicPage; siteSlug: string }) {
  const isRestaurant = site.playbook === 'RESTAURANT';
  const isMenuPage = isRestaurant && page.slug === 'menu';
  const isReservationsPage = isRestaurant && page.slug === 'reservations';
  const isHomePage = page.slug === 'home';
  const featuredItems = isRestaurant ? site.menuCategories.flatMap((c) => c.items).filter((i) => i.featured) : [];
  const ctaTargetSlug = page.ctaHref?.replace(/^\//, '');
  const ctaTargetPage = ctaTargetSlug ? site.pages.find((p) => p.slug === ctaTargetSlug) : undefined;

  const pageHref = (slug: string) => (slug === 'home' ? `/site/${siteSlug}` : `/site/${siteSlug}/${slug}`);

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <div className="flex items-center justify-between gap-4 px-6 sm:px-10 py-4 border-b border-ASTER-100 flex-wrap sticky top-0 bg-white/95 backdrop-blur z-10">
        <Link to={pageHref('home')} className="flex items-center gap-3 min-w-0">
          {site.logoUrl && (
            <img src={resolveUploadUrl(site.logoUrl) ?? undefined} alt="" className="w-10 h-10 rounded-xl object-cover shrink-0" />
          )}
          <span className="font-display font-extrabold text-lg text-ink-900 truncate">{site.businessName}</span>
        </Link>
        <nav className="flex items-center gap-1 flex-wrap">
          {site.pages.map((p) => (
            <Link
              key={p.id}
              to={pageHref(p.slug)}
              className={`text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${page.id === p.id ? 'text-ASTER-600 bg-ASTER-50' : 'text-slate-500 hover:text-ink-900'}`}
            >
              {p.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Hero */}
      <div className="relative h-72 sm:h-[28rem]">
        {page.heroImageUrl ? (
          <img src={resolveUploadUrl(page.heroImageUrl) ?? undefined} alt="" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-ASTER-100" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/30 to-ink-950/10" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 gap-3">
          <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-white max-w-2xl">{page.heroHeadline}</h1>
          <p className="text-white/90 text-sm sm:text-base max-w-xl">{page.heroSubheadline}</p>
          <div className="mt-1">
            {ctaTargetPage ? (
              <Link to={pageHref(ctaTargetPage.slug)} className="inline-block bg-ASTER-600 hover:bg-ASTER-700 rounded-full text-white font-bold text-sm px-5 py-2.5 transition-colors">
                {page.ctaLabel}
              </Link>
            ) : page.hasLeadForm || isReservationsPage ? (
              <a href="#contact" className="inline-block bg-ASTER-600 hover:bg-ASTER-700 rounded-full text-white font-bold text-sm px-5 py-2.5 transition-colors">
                {page.ctaLabel}
              </a>
            ) : (
              <span className="inline-block bg-ASTER-600 rounded-full text-white font-bold text-sm px-5 py-2.5">{page.ctaLabel}</span>
            )}
          </div>
        </div>
      </div>

      {/* Featured menu items — Home page only */}
      {isHomePage && isRestaurant && featuredItems.length > 0 && (
        <div className="p-6 sm:p-10 border-t border-ASTER-100">
          <p className="font-display font-bold text-xl text-ink-900 mb-5 flex items-center gap-2">
            <Star size={18} className="text-amber-500" fill="currentColor" /> Featured on our menu
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {featuredItems.map((item) => (
              <div key={item.id} className="bg-slate-50 rounded-2xl overflow-hidden">
                {item.imageUrl ? (
                  <img src={resolveUploadUrl(item.imageUrl) ?? undefined} alt="" className="aspect-video w-full object-cover" />
                ) : (
                  <div className="aspect-video bg-ASTER-50" />
                )}
                <div className="p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-bold text-ink-900">{item.name}</p>
                    {item.priceCents !== null && <span className="text-sm font-bold text-ink-900 tabular-nums">{formatMoney(item.priceCents, site.currency)}</span>}
                  </div>
                  {item.description && <p className="text-xs text-slate-500 mt-1">{item.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Restaurant Menu */}
      {isMenuPage && (
        <div className="p-6 sm:p-10 border-t border-ASTER-100">
          <p className="font-display font-bold text-xl text-ink-900 mb-5 flex items-center gap-2"><UtensilsCrossed size={18} className="text-ASTER-600" /> Menu</p>
          {site.menuCategories.length === 0 ? (
            <p className="text-sm text-slate-400">Menu coming soon.</p>
          ) : (
            <div className="space-y-6">
              {site.menuCategories.map((cat) => (
                <div key={cat.id}>
                  <p className="text-xs font-bold text-ASTER-600 uppercase tracking-wide mb-2">{cat.name}</p>
                  <div className="space-y-2">
                    {cat.items.filter((item) => item.available).map((item) => (
                      <div key={item.id} className="flex items-center gap-3 py-2 border-b border-ASTER-50">
                        {item.imageUrl && <img src={resolveUploadUrl(item.imageUrl) ?? undefined} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-ink-900 flex items-center gap-1.5">
                            {item.name}
                            {item.featured && <span className="text-[9px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-full shrink-0">FEATURED</span>}
                          </p>
                          {item.description && <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>}
                        </div>
                        {item.priceCents !== null && <span className="text-sm font-bold text-ink-900 tabular-nums whitespace-nowrap">{formatMoney(item.priceCents, site.currency)}</span>}
                      </div>
                    ))}
                    {cat.items.filter((item) => item.available).length === 0 && <p className="text-xs text-slate-400">No items in this category yet.</p>}
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
            site.testimonials.length > 0 && (
              <div key={i} className="p-6 sm:p-10">
                <h3 className="font-display font-bold text-xl text-ink-900 mb-5">{section.heading}</h3>
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
              </div>
            )
          ) : (
            <div key={i} className={`p-6 sm:p-10 grid sm:grid-cols-2 gap-6 items-center ${i % 2 === 1 ? 'sm:[&>*:first-child]:order-2' : ''}`}>
              {section.imageUrl ? (
                <img src={resolveUploadUrl(section.imageUrl) ?? undefined} alt="" className="aspect-video w-full object-cover rounded-2xl" />
              ) : (
                <div className="aspect-video bg-ASTER-50 rounded-2xl" />
              )}
              <div>
                <h3 className="font-display font-bold text-xl text-ink-900 mb-2">{section.heading}</h3>
                <p className="text-sm text-slate-600">{section.body}</p>
              </div>
            </div>
          ),
        )}
      </div>

      {/* Reservation booking */}
      {isReservationsPage && (
        <div id="contact" className="p-6 sm:p-10 bg-slate-50 border-t border-ASTER-100">
          <p className="font-display font-bold text-lg text-ink-900 mb-4 flex items-center gap-2"><CalendarCheck size={18} className="text-ASTER-600" /> Reserve a table</p>
          <ReservationBookingForm siteId={site.id} />
        </div>
      )}

      {/* Generic lead capture form */}
      {page.hasLeadForm && !isReservationsPage && (
        <div id="contact" className="p-6 sm:p-10 bg-slate-50 border-t border-ASTER-100">
          <p className="font-display font-bold text-lg text-ink-900 mb-4">Get in touch</p>
          <LeadCaptureForm siteId={site.id} pageId={page.id} />
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
            <Link key={p.id} to={pageHref(p.slug)} className="text-xs font-semibold hover:text-white transition-colors">
              {p.name}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
