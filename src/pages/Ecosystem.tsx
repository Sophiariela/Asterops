import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ChevronDown } from 'lucide-react';
import { getProduct } from '../data/products';

const FLOW = ['webos', 'commerceos', 'growthos', 'agents'] as const;

export default function EcosystemPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-ASTER-50/60 via-white to-white py-16 sm:py-24 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-ASTER-600 transition-colors mb-8">
          <ArrowLeft size={16} /> Back to home
        </Link>
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-ink-900 leading-tight">The ASTER ecosystem</h1>
        <p className="text-slate-500 mt-4 text-base sm:text-lg">
          Every ASTER product is built to connect to the next one — so your systems compound instead of stacking up.
        </p>
      </div>

      <div className="mt-14 max-w-sm mx-auto flex flex-col items-center">
        {FLOW.map((slug, i) => {
          const product = getProduct(slug);
          if (!product) return null;
          const Icon = product.icon;
          return (
            <div key={slug} className="w-full flex flex-col items-center">
              <Link
                to={`/products/${slug}`}
                className="w-full bg-white rounded-[28px] card-shadow border border-ASTER-100 p-6 flex items-center gap-4 hover:-translate-y-0.5 transition-transform"
              >
                <span className="w-12 h-12 rounded-2xl bg-ASTER-600 text-white flex items-center justify-center shrink-0">
                  <Icon size={22} />
                </span>
                <span>
                  <span className="block font-display font-bold text-lg text-ink-900">{product.name}</span>
                  <span className="block text-sm text-slate-500">{product.tagline}</span>
                </span>
              </Link>
              {i < FLOW.length - 1 && <ChevronDown size={24} className="text-ASTER-400 my-2" />}
            </div>
          );
        })}
      </div>

      <div className="mt-14 max-w-2xl mx-auto text-center">
        <Link
          to="/plans"
          className="inline-flex items-center gap-2 bg-ASTER-600 hover:bg-ASTER-700 text-white font-bold px-8 py-4 rounded-full transition-all"
        >
          Choose your starting point <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
