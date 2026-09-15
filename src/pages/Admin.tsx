import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, Users, Rocket, Clock3, DollarSign, Search } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { formatBRL } from '../lib/currency';

type DeploymentStage = 'PENDING' | 'IN_REVIEW' | 'DEPLOYING' | 'COMPLETED';

type Overview = {
  totalCustomers: number;
  activeDeployments: number;
  pendingDeployments: number;
  revenue: number;
  recentPurchases: {
    id: string;
    customer: { name: string | null; email: string };
    plan: string;
    amount: number;
    createdAt: string;
  }[];
};

type Customer = {
  id: string;
  name: string | null;
  email: string;
  createdAt: string;
  latestOrder: {
    id: string;
    plan: string;
    planSlug: string;
    status: string;
    amount: number;
    paymentStatus: string | null;
    deploymentStatus: DeploymentStage | null;
  } | null;
  onboarding: unknown | null;
};

const STAGES: DeploymentStage[] = ['PENDING', 'IN_REVIEW', 'DEPLOYING', 'COMPLETED'];

export default function Admin() {
  const { logout } = useAuth();
  const [overview, setOverview] = useState<Overview | null>(null);
  const [customers, setCustomers] = useState<Customer[] | null>(null);
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    api.get<Overview>('/admin/overview').then(setOverview).catch(() => setOverview(null));
  }, []);

  const loadCustomers = useCallback(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (planFilter) params.set('plan', planFilter);
    if (statusFilter) params.set('status', statusFilter);
    api
      .get<{ customers: Customer[] }>(`/admin/customers?${params.toString()}`)
      .then((data) => setCustomers(data.customers))
      .catch(() => setCustomers([]));
  }, [search, planFilter, statusFilter]);

  useEffect(() => {
    const timeout = setTimeout(loadCustomers, 250);
    return () => clearTimeout(timeout);
  }, [loadCustomers]);

  const updateStatus = async (orderId: string, status: DeploymentStage) => {
    await api.patch(`/admin/orders/${orderId}/deployment-status`, { status });
    loadCustomers();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-ASTER-100 px-6 py-4 flex items-center justify-between">
        <Link to="/" className="font-display text-xl tracking-tight text-ASTER-600" style={{ fontWeight: 800 }}>
          ASTER<span className="text-volt-500">.</span> <span className="text-slate-400 font-sans text-sm font-semibold ml-1">Admin</span>
        </Link>
        <button onClick={logout} className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-rose-500 transition-colors">
          <LogOut size={16} /> Log out
        </button>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-ink-900">Admin panel</h1>

        {overview && (
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card icon={Users} label="Total customers" value={overview.totalCustomers} />
            <Card icon={Rocket} label="Active deployments" value={overview.activeDeployments} />
            <Card icon={Clock3} label="Pending deployments" value={overview.pendingDeployments} />
            <Card icon={DollarSign} label="Revenue" value={formatBRL(overview.revenue)} />
          </div>
        )}

        {overview && overview.recentPurchases.length > 0 && (
          <div className="mt-6 bg-white rounded-[28px] card-shadow border border-ASTER-100 p-6">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-4">Recent purchases</p>
            <ul className="divide-y divide-ASTER-100">
              {overview.recentPurchases.map((p) => (
                <li key={p.id} className="py-3 flex items-center justify-between text-sm">
                  <span className="font-semibold text-ink-900">{p.customer.name ?? p.customer.email}</span>
                  <span className="text-slate-500">{p.plan}</span>
                  <span className="font-bold text-ASTER-600">{formatBRL(p.amount)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customers by name or email"
              className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-full pl-11 pr-4 py-2.5 text-sm outline-none transition-colors"
            />
          </div>
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="border-2 border-ASTER-100 rounded-full px-4 py-2.5 text-sm outline-none"
          >
            <option value="">All plans</option>
            <option value="starter">Starter</option>
            <option value="growth">Growth</option>
            <option value="scale">Scale</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border-2 border-ASTER-100 rounded-full px-4 py-2.5 text-sm outline-none"
          >
            <option value="">All statuses</option>
            {STAGES.map((s) => (
              <option key={s} value={s}>
                {s.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-6 bg-white rounded-[28px] card-shadow border border-ASTER-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-400 text-left">
              <tr>
                <th className="px-6 py-3 font-semibold">Customer</th>
                <th className="px-6 py-3 font-semibold">Plan</th>
                <th className="px-6 py-3 font-semibold">Payment</th>
                <th className="px-6 py-3 font-semibold">Deployment</th>
                <th className="px-6 py-3 font-semibold">Onboarding</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ASTER-100">
              {customers?.map((c) => (
                <tr key={c.id}>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-ink-900">{c.name ?? '—'}</p>
                    <p className="text-slate-400 text-xs">{c.email}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{c.latestOrder?.plan ?? '—'}</td>
                  <td className="px-6 py-4 text-slate-600">{c.latestOrder?.paymentStatus ?? '—'}</td>
                  <td className="px-6 py-4">
                    {c.latestOrder ? (
                      <select
                        value={c.latestOrder.deploymentStatus ?? 'PENDING'}
                        onChange={(e) => updateStatus(c.latestOrder!.id, e.target.value as DeploymentStage)}
                        className="border-2 border-ASTER-100 rounded-full px-3 py-1.5 text-xs font-bold outline-none"
                      >
                        {STAGES.map((s) => (
                          <option key={s} value={s}>
                            {s.replace('_', ' ')}
                          </option>
                        ))}
                      </select>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {c.onboarding ? 'Submitted' : 'Pending'}
                  </td>
                </tr>
              ))}
              {customers && customers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-400">
                    No customers match these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

function Card({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: string | number }) {
  return (
    <div className="bg-white rounded-2xl card-shadow-sm border border-ASTER-100 p-5">
      <div className="w-10 h-10 rounded-xl bg-ASTER-50 text-ASTER-600 flex items-center justify-center">
        <Icon size={18} />
      </div>
      <p className="text-2xl font-display font-extrabold text-ink-900 mt-3">{value}</p>
      <p className="text-sm text-slate-400">{label}</p>
    </div>
  );
}
