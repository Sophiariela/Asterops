import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, Clock, Rocket } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { formatBRL } from '../lib/currency';

type DeploymentStage = 'PENDING' | 'IN_REVIEW' | 'DEPLOYING' | 'COMPLETED';

type DashboardData = {
  user: { id: string; name: string | null; email: string } | null;
  plan: { id: string; name: string; slug: string; price: number } | null;
  order: { id: string; status: string; amount: number; createdAt: string } | null;
  deploymentStatus: DeploymentStage | null;
  onboarding: Record<string, unknown> | null;
  activity: { label: string; at: string }[];
};

const STATUS_LABEL: Record<DeploymentStage, string> = {
  PENDING: 'Pending',
  IN_REVIEW: 'In Review',
  DEPLOYING: 'Deploying',
  COMPLETED: 'Completed',
};

const STATUS_COLOR: Record<DeploymentStage, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  IN_REVIEW: 'bg-blue-100 text-blue-700',
  DEPLOYING: 'bg-ASTER-100 text-ASTER-700',
  COMPLETED: 'bg-emerald-100 text-emerald-700',
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    api.get<DashboardData>('/dashboard').then(setData).catch(() => setData(null));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-ASTER-100 px-6 py-4 flex items-center justify-between">
        <Link to="/" className="font-display text-xl tracking-tight text-ASTER-600" style={{ fontWeight: 800 }}>
          ASTER<span className="text-volt-500">.</span>
        </Link>
        <button onClick={logout} className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-rose-500 transition-colors">
          <LogOut size={16} /> Log out
        </button>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-ink-900">
          Welcome back{user?.name ? `, ${user.name}` : ''}
        </h1>

        {!data ? (
          <p className="text-slate-400 mt-6">Loading your dashboard…</p>
        ) : !data.plan ? (
          <div className="mt-8 bg-white rounded-[28px] card-shadow border border-ASTER-100 p-8 text-center">
            <Rocket size={40} className="text-ASTER-600 mx-auto" />
            <p className="text-slate-600 mt-4">You haven&apos;t deployed a system yet.</p>
            <Link to="/plans" className="inline-block mt-5 bg-ASTER-600 hover:bg-ASTER-700 text-white font-bold px-7 py-3.5 rounded-full transition-all">
              Choose your operating system
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid lg:grid-cols-3 gap-6">
            <section className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-[28px] card-shadow border border-ASTER-100 p-7">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Current plan</p>
                    <p className="font-display font-extrabold text-2xl text-ink-900 mt-1">{data.plan.name}</p>
                  </div>
                  <p className="font-display font-extrabold text-xl text-ASTER-600">{formatBRL(data.plan.price)}</p>
                </div>
                <div className="mt-5 pt-5 border-t border-ASTER-100 flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-500">Deployment status</p>
                  {data.deploymentStatus && (
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${STATUS_COLOR[data.deploymentStatus]}`}>
                      {STATUS_LABEL[data.deploymentStatus]}
                    </span>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-[28px] card-shadow border border-ASTER-100 p-7">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Submitted information</p>
                {data.onboarding ? (
                  <dl className="grid sm:grid-cols-2 gap-4 mt-4 text-sm">
                    {Object.entries(data.onboarding)
                      .filter(([key]) => !['id', 'customerId', 'createdAt', 'updatedAt', 'logoUrl', 'brandAssetUrls'].includes(key))
                      .map(([key, value]) => (
                        <div key={key}>
                          <dt className="text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</dt>
                          <dd className="font-semibold text-ink-900">{String(value || '—')}</dd>
                        </div>
                      ))}
                  </dl>
                ) : (
                  <div className="mt-4">
                    <p className="text-sm text-slate-500">You haven&apos;t completed onboarding yet.</p>
                    <Link to="/onboarding" className="inline-block mt-3 font-bold text-ASTER-600 hover:text-ASTER-700">
                      Complete onboarding
                    </Link>
                  </div>
                )}
              </div>
            </section>

            <section className="space-y-6">
              <div className="bg-white rounded-[28px] card-shadow border border-ASTER-100 p-7">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-4">Recent activity</p>
                <ul className="space-y-4">
                  {data.activity.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm">
                      <Clock size={14} className="text-ASTER-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-ink-900 font-semibold">{item.label}</p>
                        <p className="text-slate-400 text-xs">{new Date(item.at).toLocaleString()}</p>
                      </div>
                    </li>
                  ))}
                  {data.activity.length === 0 && <p className="text-sm text-slate-400">No activity yet.</p>}
                </ul>
              </div>

              <div className="bg-white rounded-[28px] card-shadow border border-ASTER-100 p-7">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-4">Account settings</p>
                <p className="text-sm text-slate-500">Name</p>
                <p className="font-semibold text-ink-900">{data.user?.name ?? '—'}</p>
                <p className="text-sm text-slate-500 mt-3">Email</p>
                <p className="font-semibold text-ink-900">{data.user?.email}</p>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
