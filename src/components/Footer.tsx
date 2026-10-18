import { Link } from 'react-router-dom';
import { Instagram, Linkedin } from 'lucide-react';
import { PRODUCTS } from '../data/products';

const cols: { title: string; links: { label: string; to: string }[] }[] = [
  {
    title: 'Produtos',
    links: PRODUCTS.map((p) => ({ label: p.name, to: `/products/${p.slug}` })),
  },
  {
    title: 'Plataforma',
    links: [
      { label: 'Biblioteca de Templates', to: '/plans' },
      { label: 'Planos', to: '/plans' },
      { label: 'Ecossistema', to: '/ecosystem' },
    ],
  },
  {
    title: 'Conta',
    links: [
      { label: 'Entrar', to: '/login' },
      { label: 'Criar conta', to: '/register' },
    ],
  },
];

export default function Footer() {
  return (
    <footer id="login" className="bg-ink-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-14 sm:pt-20 pb-8">
        <div className="grid lg:grid-cols-[1.2fr_2fr] gap-10 pb-12 border-b border-white/10">
          <div>
            <p className="font-display text-3xl" style={{ fontWeight: 800 }}>
              ASTER<span className="text-volt-400">.</span>
            </p>
            <p className="text-white/60 text-[15px] mt-4 max-w-sm leading-relaxed">
              Infraestrutura digital para o seu negócio: sites profissionais, comércio e automações com IA.
            </p>
            <div className="flex gap-2.5 mt-6">
              {[Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#top" aria-label="Rede social" className="w-10 h-10 rounded-full bg-white/10 hover:bg-ASTER-600 border border-white/10 flex items-center justify-center transition-colors">
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            {cols.map((c) => (
              <div key={c.title}>
                <p className="font-display font-bold text-[15px] text-volt-400 mb-4">{c.title}</p>
                <ul className="space-y-2.5">
                  {c.links.map((l) => (
                    <li key={l.label}>
                      <Link to={l.to} className="text-sm text-white/60 hover:text-white transition-colors">{l.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="pt-7 flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-white/40">
          <p>ASTER — plataforma de infraestrutura digital</p>
          <p>© 2026 ASTER · Todos os direitos reservados</p>
        </div>
      </div>
    </footer>
  );
}
