import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

type Plan = {
  id: string;
  name: string;
  slug: string;
  description: string;
  features: string[];
  price: number;
  status: 'ACTIVE' | 'ARCHIVED';
};

function formatPrice(cents: number) {
  return (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

export default function Plans() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [plans, setPlans] = useState<Plan[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get<{ plans: Plan[] }>('/plans')
      .then((data) => setPlans(data.plans))
      .catch(() => setError('Could not load plans right now. Please try again shortly.'));
  }, []);

  const deploy = (slug: string) => {
    if (!user) {
      navigate('/login', { state: { from: `/checkout?plan=${slug}` } });
      return;
    }
    navigate(`/checkout?plan=${slug}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-ASTER-50/60 via-white to-white py-16 sm:py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-ASTER-600 transition-colors mb-8">
          <ArrowLeft size={16} /> Back to home
        </Link>

        <div className="text-center max-w-2xl mx-auto">
          <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-ink-900 leading-tight">
            Choose your operating system
          </h1>
          <p className="text-slate-500 mt-4 text-base sm:text-lg">
            Select the system that matches your business stage.
          </p>
        </div>

        {error && <p className="text-center text-rose-500 font-semibold mt-10">{error}</p>}

        {!plans && !error && (
          <p className="text-center text-slate-400 mt-16">Loading plans…</p>
        )}

        {plans && (
          <div className="mt-14 grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="bg-white rounded-[28px] card-shadow border border-ASTER-100 p-7 sm:p-8 flex flex-col"
              >
                <h2 className="font-display font-extrabold text-2xl text-ink-900">{plan.name}</h2>
                <p className="text-slate-500 text-sm mt-2 min-h-[60px]">{plan.description}</p>
                <p className="font-display font-extrabold text-3xl text-ASTER-600 mt-5">
                  {formatPrice(plan.price)}
                </p>
                <ul className="mt-6 space-y-3 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <Check size={16} className="text-ASTER-600 shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => deploy(plan.slug)}
                  className="mt-8 w-full bg-ASTER-600 hover:bg-ASTER-700 text-white font-bold py-3.5 rounded-full transition-all flex items-center justify-center gap-2"
                >
                  Deploy <ArrowRight size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
