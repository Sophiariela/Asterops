import { Navigate, Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { getSolution } from '../../data/solutions';

export default function SolutionPage() {
  const { slug } = useParams<{ slug: string }>();
  const solution = getSolution(slug);

  if (!solution) {
    return <Navigate to="/plans" replace />;
  }

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-b from-ASTER-50/70 via-white to-white px-4 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-ASTER-600 transition-colors mb-8">
            <ArrowLeft size={16} /> Back to home
          </Link>
          <p className="text-xs font-bold text-ASTER-600 uppercase tracking-wide">Solution</p>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-ink-900 mt-2">{solution.name}</h1>
          <p className="text-ASTER-600 font-semibold text-lg mt-2">{solution.tagline}</p>
          <p className="text-slate-500 text-base sm:text-lg mt-4 max-w-2xl">{solution.description}</p>
        </div>
      </section>

      <section className="px-4 py-14 border-t border-ASTER-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display font-extrabold text-2xl text-ink-900">What&apos;s included</h2>
          <ul className="mt-6 grid sm:grid-cols-2 gap-4">
            {solution.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3 bg-ASTER-50/60 rounded-2xl p-4 text-sm text-slate-600">
                <Check size={18} className="text-ASTER-600 shrink-0 mt-0.5" /> {feature}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="px-4 py-16 border-t border-ASTER-100">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-ASTER-700 via-ASTER-600 to-ASTER-500 rounded-[32px] p-10 sm:p-14 text-white">
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl">See how to get started</h2>
          <p className="text-white/75 mt-3">Choose the ASTER system that powers this solution.</p>
          <Link
            to="/plans"
            className="inline-flex items-center gap-2 mt-7 bg-white text-ASTER-700 font-bold px-8 py-4 rounded-full hover:shadow-xl transition-all"
          >
            View plans <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
