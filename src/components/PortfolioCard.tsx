import { ArrowUpRight } from 'lucide-react';
import type { PortfolioProject } from '../data/portfolio';

/**
 * Cartão de um projeto real.
 *
 * O screenshot é captura da página real do cliente. O card precisa ficar
 * completo só com a imagem estática — nada de iframe nem de site embarcado,
 * que seriam lentos e quebrariam no mobile.
 */
export default function PortfolioCard({ project }: { project: PortfolioProject }) {
  return (
    <article className="group flex flex-col bg-white rounded-3xl border border-ASTER-100 card-shadow overflow-hidden transition-shadow hover:shadow-xl">
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block relative overflow-hidden border-b border-ASTER-100/70 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ASTER-600/40"
        tabIndex={-1}
        aria-hidden="true"
      >
        <img
          src={project.image}
          alt=""
          width={1600}
          height={1000}
          loading="lazy"
          decoding="async"
          // A imagem é decorativa aqui: o link textual abaixo já descreve o
          // destino, e o alt completo vive na página /portfolio.
          className="w-full h-auto aspect-[16/9] sm:aspect-[16/10] object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </a>

      <div className="flex flex-col flex-1 p-5 sm:p-7">
        <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-ASTER-700">
          {project.category}
        </p>
        <h3 className="font-display font-bold text-xl sm:text-2xl text-ink-900 mt-2">
          {project.name}
        </h3>
        <p className="text-slate-600 text-sm sm:text-[15px] leading-relaxed mt-3">
          {project.shortDescription}
        </p>

        <ul className="flex flex-wrap gap-2 mt-5">
          {project.features.map((feature, i) => (
            <li
              key={feature.label}
              /* No mobile so as 3 primeiras: a lista completa esta em /portfolio. */
              className={`items-center gap-1.5 text-[11px] sm:text-xs font-semibold bg-ASTER-50 text-ASTER-700 border border-ASTER-100 rounded-full px-3 py-1.5 ${
                i < 3 ? 'inline-flex' : 'hidden sm:inline-flex'
              }`}
            >
              <feature.icon size={13} aria-hidden="true" />
              {feature.label}
            </li>
          ))}
        </ul>

        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto pt-6 inline-flex items-center gap-1.5 text-[15px] font-bold text-ASTER-600 hover:text-ASTER-700 hover:gap-2.5 transition-all w-fit rounded-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ASTER-600/40"
        >
          Ver site ao vivo
          <ArrowUpRight size={18} aria-hidden="true" />
          <span className="sr-only">— {project.name}, abre em uma nova aba</span>
        </a>
      </div>
    </article>
  );
}
