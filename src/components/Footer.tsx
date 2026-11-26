import { Link } from 'react-router-dom';
import { Instagram, Linkedin } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { INSTAGRAM_URL, LINKEDIN_URL } from '../config/site';

const cols: { title: string; links: { label: string; to: string }[] }[] = [
  {
    title: 'Produtos',
    /*
     * 4.4 - So produto operacional entra no rodape.
     *
     * LaunchOS e GrowthOS estao marcados com earlyAccess em
     * src/data/products.ts, ou seja, ainda nao sao funcionalidade entregue.
     * Eles continuam no menu Produtos, onde aparecem com o selo "EM BREVE",
     * e a pagina de cada um segue no ar - o que sai e so o link de rodape,
     * que dava a entender produto disponivel.
     *
     * TODO(aster): decidir se LaunchOS e GrowthOS ganham pagina comercial
     * propria ao sair do acesso antecipado; bastando remover o filtro.
     */
    links: PRODUCTS.filter((p) => !p.earlyAccess).map((p) => ({
      label: p.name,
      to: `/products/${p.slug}`,
    })),
  },
  {
    title: 'Plataforma',
    links: [
      { label: 'Portfólio', to: '/portfolio' },
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

const socials = [
  { Icon: Instagram, href: INSTAGRAM_URL, label: 'Instagram' },
  { Icon: Linkedin, href: LINKEDIN_URL, label: 'LinkedIn' },
].filter((s): s is { Icon: typeof Instagram; href: string; label: string } => Boolean(s.href));

export default function Footer() {
  return (
    <footer id="login" className="bg-ink-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-14 sm:pt-20 pb-8">
        <div className="grid lg:grid-cols-[1.2fr_2fr] gap-10 pb-12 border-b border-white/10">
          <div>
            <p className="font-display text-3xl" style={{ fontWeight: 800 }}>
              ASTER<span className="text-volt-400">.</span>
            </p>
            <p className="text-white/80 text-[15px] mt-4 max-w-sm leading-relaxed">
              Infraestrutura digital para o seu negócio: sites profissionais, comércio e automações com IA.
            </p>
            {/*
              * 6.3 - Icone so aparece com URL confirmada em config/site.ts.
              * Antes os dois apontavam para "#top", o que parecia link de
              * rede social e nao levava a lugar nenhum.
              *
              * TODO(aster): preencher INSTAGRAM_URL e LINKEDIN_URL.
              */}
            {socials.length > 0 && (
              <div className="flex gap-2.5 mt-6">
                {socials.map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${label} da ASTER (abre em uma nova aba)`}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-ASTER-600 border border-white/10 flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-volt-400/60"
                  >
                    <Icon size={17} aria-hidden="true" />
                  </a>
                ))}
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            {cols.map((c) => (
              <div key={c.title}>
                <p className="font-display font-bold text-[15px] text-volt-400 mb-4">{c.title}</p>
                <ul className="space-y-2.5">
                  {c.links.map((l) => (
                    <li key={l.label}>
                      <Link to={l.to} className="text-sm text-white/80 hover:text-white transition-colors">{l.label}</Link>
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
