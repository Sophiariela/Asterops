import { Navigate, Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Sparkles } from 'lucide-react';
import { getProduct } from '../../data/products';
import Footer from '../../components/Footer';

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const product = getProduct(slug);

  if (!product) {
    return <Navigate to="/plans" replace />;
  }

  const Icon = product.icon;
  const subheadlineParagraphs = Array.isArray(product.subheadline) ? product.subheadline : [product.subheadline];
  const ecosystemProducts = product.ecosystem?.connects.map((s) => getProduct(s)).filter(Boolean) ?? [];

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-b from-ASTER-50/70 via-white to-white px-4 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-ASTER-600 transition-colors mb-8">
            <ArrowLeft size={16} /> Back to home
          </Link>
          <div className="w-14 h-14 rounded-2xl bg-ASTER-600 text-white flex items-center justify-center">
            <Icon size={26} />
          </div>
          <p className="text-xs font-bold text-ASTER-600 uppercase tracking-wide mt-6">{product.name}</p>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-ink-900 mt-2">{product.tagline}</h1>
          <div className="mt-4 max-w-2xl space-y-4">
            {subheadlineParagraphs.map((paragraph) => (
              <p key={paragraph} className="text-slate-500 text-base sm:text-lg">
                {paragraph}
              </p>
            ))}
          </div>
          {product.heroCta && (
            <Link
              to={`/plans?product=${product.slug}`}
              className="inline-flex items-center gap-2 mt-7 bg-ASTER-600 hover:bg-ASTER-700 text-white font-bold px-7 py-3.5 rounded-full transition-all hover:shadow-lg hover:shadow-ASTER-600/30"
            >
              {product.heroCta} <ArrowRight size={18} />
            </Link>
          )}
        </div>
      </section>

      {product.solutions && (
        <section className="px-4 py-14 border-t border-ASTER-100">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display font-extrabold text-2xl text-ink-900">What {product.name} actually solves</h2>
            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              {product.solutions.map((item) => (
                <div key={item.title} className="bg-ASTER-50/60 rounded-2xl p-6">
                  <h3 className="font-display font-semibold text-base text-ink-900">{item.title}</h3>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {product.growth && (
        <section className="px-4 py-14 border-t border-ASTER-100 bg-slate-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display font-extrabold text-2xl text-ink-900">{product.growth.title}</h2>
            <div className="mt-6 space-y-4 max-w-2xl">
              {product.growth.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-slate-600 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="px-4 py-14 border-t border-ASTER-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display font-extrabold text-2xl text-ink-900">What&apos;s included</h2>
          <ul className="mt-6 grid sm:grid-cols-2 gap-4">
            {product.included.map((item) => (
              <li key={item} className="flex items-start gap-3 bg-ASTER-50/60 rounded-2xl p-4 text-sm text-slate-600">
                <Check size={18} className="text-ASTER-600 shrink-0 mt-0.5" /> {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="px-4 py-14 border-t border-ASTER-100 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display font-extrabold text-2xl text-ink-900">{product.outcomeTitle ?? 'Outcome'}</h2>
          {product.outcomeList ? (
            <ul className="mt-6 grid sm:grid-cols-2 gap-4">
              {product.outcomeList.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-slate-600">
                  <span className="w-6 h-6 rounded-full bg-ASTER-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={13} strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-6 flex items-start gap-4">
              <span className="w-11 h-11 rounded-2xl bg-ASTER-600 text-white flex items-center justify-center shrink-0">
                <Sparkles size={20} />
              </span>
              <p className="font-display font-semibold text-xl sm:text-2xl text-ink-900 leading-relaxed">{product.outcome}</p>
            </div>
          )}
        </div>
      </section>

      {product.ecosystem && (
        <section className="px-4 py-14 border-t border-ASTER-100">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display font-extrabold text-2xl text-ink-900">{product.ecosystem.title}</h2>
            <p className="text-slate-600 mt-4 max-w-2xl leading-relaxed">{product.ecosystem.body}</p>
            <div className="mt-6 grid sm:grid-cols-3 gap-4">
              {ecosystemProducts.map((connected) => {
                if (!connected) return null;
                const ConnectedIcon = connected.icon;
                return (
                  <Link
                    key={connected.slug}
                    to={`/products/${connected.slug}`}
                    className="flex items-start gap-3 bg-ASTER-50/60 rounded-2xl p-4 hover:bg-ASTER-50 transition-colors"
                  >
                    <span className="w-9 h-9 rounded-xl bg-ASTER-600 text-white flex items-center justify-center shrink-0">
                      <ConnectedIcon size={16} />
                    </span>
                    <span className="font-display font-semibold text-sm text-ink-900 mt-1.5">{connected.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="px-4 py-16 border-t border-ASTER-100">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-ASTER-700 via-ASTER-600 to-ASTER-500 rounded-[32px] p-10 sm:p-14 text-white">
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl">
            {product.finalCta?.headline ?? `Ready to deploy ${product.name}?`}
          </h2>
          <p className="text-white/75 mt-3">{product.finalCta?.description ?? 'Choose your plan and get started today.'}</p>
          <Link
            to={`/plans?product=${product.slug}`}
            className="inline-flex items-center gap-2 mt-7 bg-white text-ASTER-700 font-bold px-8 py-4 rounded-full hover:shadow-xl transition-all"
          >
            {product.finalCta?.buttonLabel ?? `Deploy ${product.name}`} <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
