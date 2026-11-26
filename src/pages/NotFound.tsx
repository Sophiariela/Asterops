import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { usePageMeta } from '../lib/meta';

/**
 * Pagina 404.
 *
 * Existe por um motivo de SEO concreto: o vercel.json reescrevia TODA URL
 * para o index.html, entao qualquer endereco digitado errado respondia 200
 * com a home. Isso e um "soft 404" — o buscador indexa como pagina valida
 * cada link quebrado que aponte para o dominio.
 *
 * Agora a rota curinga do router renderiza esta pagina, e o build grava
 * uma copia dela como dist/404.html, que a Vercel serve com status HTTP
 * 404 de verdade. A meta robots=noindex garante que, mesmo servida por
 * engano com 200, ela nao entre no indice.
 */
export default function NotFound() {
  const navigate = useNavigate();

  usePageMeta({
    title: 'Página não encontrada — ASTER',
    description: 'A página que você procurou não existe ou mudou de endereço.',
    path: '/404',
    noindex: true,
  });

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar onCta={() => navigate('/plans')} />

      <main className="flex-1 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28 w-full">
          <div className="max-w-2xl">
            <p className="font-display font-extrabold text-6xl sm:text-8xl text-ASTER-600 leading-none">
              404
            </p>
            <h1 className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight text-ink-900 mt-6 text-balance">
              Essa página não existe
            </h1>
            <p className="text-slate-600 text-base sm:text-lg mt-4 leading-relaxed">
              O endereço pode ter mudado, ou o link que te trouxe até aqui está quebrado. Abaixo
              estão os caminhos mais usados.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 bg-ASTER-600 hover:bg-ASTER-700 text-white font-bold px-7 py-3.5 rounded-full transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ASTER-600/40"
              >
                <ArrowLeft size={18} aria-hidden="true" />
                Voltar para a home
              </Link>
              <Link
                to="/plans"
                className="inline-flex items-center justify-center gap-2 bg-white border-2 border-ASTER-200 hover:border-ASTER-600 text-ASTER-700 font-bold px-7 py-3 rounded-full transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ASTER-600/40"
              >
                Ver planos
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>

            <nav aria-label="Páginas principais" className="mt-10 border-t border-ASTER-100 pt-6">
              <ul className="flex flex-wrap gap-x-6 gap-y-2">
                {[
                  { to: '/portfolio', label: 'Portfólio' },
                  { to: '/plans', label: 'Planos' },
                  { to: '/ecosystem', label: 'Ecossistema' },
                  { to: '/products/webos', label: 'WebOS' },
                  { to: '/products/luna-ai', label: 'Luna AI' },
                ].map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm font-semibold text-ASTER-600 hover:text-ASTER-700 hover:underline rounded-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ASTER-600/40"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
