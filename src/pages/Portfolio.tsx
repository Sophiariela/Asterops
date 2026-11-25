import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Check } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { PORTFOLIO } from '../data/portfolio';
import { usePageMeta } from '../lib/meta';

/**
 * /portfolio — a página completa dos projetos reais.
 *
 * Mais detalhe que a seção da home: descrição inteira, lista de recursos e
 * o screenshot grande. Continua valendo a regra — só projeto no ar, com
 * link que o visitante pode abrir e conferir.
 */
export default function PortfolioPage() {
  const navigate = useNavigate();

  usePageMeta({
    title: 'Portfólio — sites reais feitos com a ASTER',
    description:
      'Projetos desenvolvidos para negócios reais com a ASTER: Good Vibes Va’a, clube de canoa havaiana em Salvador com reservas online, e FULÔ, loja de moda praia em crochê com catálogo e carrinho.',
    path: '/portfolio',
  });

  return (
    <div className="min-h-screen bg-white">
      <Navbar onCta={() => navigate('/plans')} />
      <main>
        <section className="pt-14 sm:pt-20 pb-10 sm:pb-14 bg-gradient-to-b from-ASTER-50/80 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-ASTER-700">
              Portfólio
            </p>
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-ink-900 mt-3 tracking-tight text-balance max-w-4xl">
              Sites reais, feitos com a ASTER
            </h1>
            <p className="text-slate-600 text-base sm:text-xl mt-5 max-w-2xl leading-relaxed">
              Projetos desenvolvidos para negócios reais, com soluções digitais pensadas para cada
              operação. Todos estão no ar — é só abrir e conferir.
            </p>
          </div>
        </section>

        <section className="pb-20 sm:pb-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col gap-16 sm:gap-24">
            {PORTFOLIO.map((project, index) => (
              <article
                key={project.slug}
                id={project.slug}
                className="scroll-mt-32 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
              >
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block rounded-3xl overflow-hidden border border-ASTER-100 card-shadow group focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ASTER-600/40 ${
                    index % 2 === 1 ? 'lg:order-2' : ''
                  }`}
                >
                  <img
                    src={project.image}
                    alt={project.imageAlt}
                    width={1600}
                    height={1000}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                    className="w-full h-auto aspect-[16/10] object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                </a>

                <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                  <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-ASTER-700">
                    {project.category}
                  </p>
                  <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-ink-900 mt-2 tracking-tight">
                    {project.name}
                  </h2>
                  <p className="text-slate-600 text-base sm:text-lg leading-relaxed mt-4">
                    {project.description}
                  </p>

                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 mt-7">
                    {project.features.map((feature) => (
                      <li key={feature.label} className="flex items-center gap-2.5 text-[15px] text-ink-900">
                        <span className="w-6 h-6 rounded-lg bg-ASTER-50 text-ASTER-700 flex items-center justify-center shrink-0">
                          <Check size={14} aria-hidden="true" />
                        </span>
                        {feature.label}
                      </li>
                    ))}
                  </ul>

                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-8 inline-flex items-center gap-2 bg-ASTER-600 hover:bg-ASTER-700 text-white font-bold text-base px-7 py-3.5 rounded-full transition-all hover:shadow-lg hover:shadow-ASTER-600/30 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ASTER-600/40"
                  >
                    Ver site ao vivo
                    <ArrowUpRight size={18} aria-hidden="true" />
                    <span className="sr-only">— {project.name}, abre em uma nova aba</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
