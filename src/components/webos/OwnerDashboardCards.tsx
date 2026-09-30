import { useEffect, useState } from 'react';
import { CalendarCheck, Inbox, MailWarning, TrendingUp, Star, Eye } from 'lucide-react';
import { api } from '../../lib/api';
import { formatDateTime } from '../../lib/webos/locale';
import type { Lead, Reservation, Review, BusinessScore } from '../../lib/webos/types';
import { StatCardSkeleton } from './Skeleton';

type ViewStats = { total: number; last30Days: number; topPages: { slug: string; views: number }[] };

function scoreColor(score: number) {
  if (score >= 70) return 'text-emerald-600';
  if (score >= 45) return 'text-amber-500';
  return 'text-rose-600';
}

function Card({ icon: Icon, label, value, caption }: { icon: typeof CalendarCheck; label: string; value: string | number; caption: string }) {
  return (
    <div className="bg-white rounded-2xl card-shadow-sm border border-ASTER-100 p-5">
      <div className="flex items-center gap-2 text-ASTER-600">
        <Icon size={16} />
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">{label}</p>
      </div>
      <p className="font-display font-extrabold text-3xl text-ink-900 mt-2">{value}</p>
      <p className="text-xs text-slate-400 mt-1">{caption}</p>
    </div>
  );
}

export default function OwnerDashboardCards({ siteId, timezone, country }: { siteId: string; timezone: string | null; country: string | null }) {
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [reservations, setReservations] = useState<Reservation[] | null>(null);
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [businessScore, setBusinessScore] = useState<BusinessScore | null>(null);
  const [viewStats, setViewStats] = useState<ViewStats | null>(null);

  useEffect(() => {
    api.get<{ leads: Lead[] }>(`/webos/sites/${siteId}/leads`).then((d) => setLeads(d.leads)).catch(() => setLeads([]));
    api.get<{ reservations: Reservation[] }>(`/webos/sites/${siteId}/reservations`).then((d) => setReservations(d.reservations)).catch(() => setReservations([]));
    api.get<{ reviews: Review[] }>(`/webos/sites/${siteId}/reviews`).then((d) => setReviews(d.reviews)).catch(() => setReviews([]));
    api.get<{ businessScore: BusinessScore }>(`/webos/sites/${siteId}/analytics/business-score`).then((d) => setBusinessScore(d.businessScore)).catch(() => setBusinessScore(null));
    api.get<{ views: ViewStats }>(`/webos/sites/${siteId}/analytics/views`).then((d) => setViewStats(d.views)).catch(() => setViewStats(null));
  }, [siteId]);

  if (!leads || !reservations || !reviews) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => <StatCardSkeleton key={i} />)}
      </div>
    );
  }

  const todayReservations = reservations.filter((r) => {
    const at = new Date(r.reservationAt);
    const now = new Date();
    return at.toDateString() === now.toDateString() && r.status !== 'CANCELLED';
  });
  const newLeadsCount = leads.filter((l) => l.status === 'NEW').length;
  // "Unread messages" proxy: leads that haven't been touched at all yet.
  const unreadCount = newLeadsCount;
  // "Revenue opportunities" proxy: warm leads plus reservations still
  // awaiting confirmation — both are real, actionable, pending upside.
  const opportunityCount = leads.filter((l) => l.status === 'QUALIFIED').length + reservations.filter((r) => r.status === 'PENDING').length;
  const recentReviews = reviews.slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card icon={Eye} label="Site Views" value={viewStats?.last30Days ?? 0} caption={viewStats ? `${viewStats.total} all time` : 'Last 30 days'} />
        <Card icon={CalendarCheck} label="Today's Reservations" value={todayReservations.length} caption={todayReservations.length ? `${todayReservations.reduce((a, r) => a + r.partySize, 0)} guests expected` : 'Nothing booked today'} />
        <Card icon={Inbox} label="New Leads" value={newLeadsCount} caption="Not yet contacted" />
        <Card icon={MailWarning} label="Unread Messages" value={unreadCount} caption="Leads awaiting a first response" />
        <Card icon={TrendingUp} label="Revenue Opportunities" value={opportunityCount} caption="Qualified leads + pending reservations" />
      </div>

      <div className="grid lg:grid-cols-[220px_1fr] gap-6">
        <div className="bg-ink-950 text-white rounded-[28px] card-shadow p-6 text-center flex flex-col justify-center">
          <p className="text-white/60 text-xs font-bold uppercase tracking-wide">Business Operating Score</p>
          <p className={`font-display font-extrabold text-5xl mt-2 ${businessScore ? scoreColor(businessScore.score) : ''}`}>{businessScore?.score ?? '—'}</p>
        </div>
        <div className="bg-white rounded-[28px] card-shadow border border-ASTER-100 p-6">
          {businessScore && (
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 flex flex-wrap gap-2">
                {businessScore.factors.map((f) => (
                  <span key={f.key} className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${f.available ? 'bg-ASTER-50 text-ASTER-600' : 'bg-slate-100 text-slate-400'}`} title={f.detail}>
                    {f.label}: {f.available ? f.score : 'Not enough data'}
                  </span>
                ))}
              </div>
              {businessScore.recommendations.length > 0 && (
                <div className="sm:col-span-2 pt-3 border-t border-ASTER-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Recommendations</p>
                  <ul className="space-y-1.5">
                    {businessScore.recommendations.map((r, i) => <li key={i} className="text-sm text-ink-900">• {r}</li>)}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {viewStats && viewStats.topPages.length > 0 && (
        <div className="bg-white rounded-[28px] card-shadow border border-ASTER-100 p-6">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-4 flex items-center gap-1.5"><Eye size={13} /> Top Pages (30 days)</p>
          <div className="space-y-2">
            {viewStats.topPages.map((p) => {
              const pct = Math.round((p.views / viewStats.topPages[0].views) * 100);
              return (
                <div key={p.slug} className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-ink-900 w-28 truncate capitalize">{p.slug}</span>
                  <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="h-full bg-ASTER-600 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-sm font-bold text-ink-900 tabular-nums w-10 text-right">{p.views}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="bg-white rounded-[28px] card-shadow border border-ASTER-100 p-6">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-4 flex items-center gap-1.5"><Star size={13} /> Recent Reviews</p>
        <div className="space-y-3">
          {recentReviews.map((r) => (
            <div key={r.id} className="bg-slate-50 rounded-2xl p-4">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-ink-900">{r.authorName}</p>
                <div className="flex gap-0.5 text-amber-400">
                  {Array.from({ length: r.rating }).map((_, i) => <Star key={i} size={11} fill="currentColor" strokeWidth={0} />)}
                </div>
              </div>
              <p className="text-sm text-ink-900 mt-1">"{r.comment}"</p>
              <p className="text-[11px] text-slate-400 mt-1">{formatDateTime(r.createdAt, country, timezone)}</p>
            </div>
          ))}
          {recentReviews.length === 0 && <p className="text-sm text-slate-400">No reviews yet.</p>}
        </div>
      </div>
    </div>
  );
}
