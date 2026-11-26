import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PORTFOLIO } from '../data/portfolio';
import PortfolioCard from './PortfolioCard';

/**
 * "Sites reais, feitos com a ASTER" — prova real, logo abaixo do hero.
 *
 * É a primeira coisa depois da promessa do hero de propósito: antes de
 * explicar a plataforma, mostra site de cliente que está no ar e pode ser
 * aberto. Sem depoimento inventado e sem logo de empresa que nunca foi
 * cliente — só os dois projetos que existem.
 */
export default function Portfolio() {
  return (
    <section id="portfolio" className="scroll-mt-32 py-10 sm:py-24 bg-white border-y border-ASTER-100/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-ASTER-700">
              Portfólio
            </p>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-ink-900 mt-2 tracking-tight text-balance">
              Sites reais, feitos com a ASTER
            </h2>
            <p className="text-slate-600 text-[15px] sm:text-lg mt-3 leading-relaxed">
              Projetos desenvolvidos para negócios reais, com soluções digitais pensadas para cada
              operação.
            </p>
          </div>

          <Link
            to="/portfolio"
            className="inline-flex items-center gap-2 shrink-0 font-bold text-[15px] text-ASTER-600 hover:text-ASTER-700 hover:gap-3 transition-all rounded-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ASTER-600/40"
          >
            Ver o portfólio completo
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8 mt-8 sm:mt-14">
          {PORTFOLIO.map((project) => (
            <PortfolioCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
