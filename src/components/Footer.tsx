import { Instagram, Facebook, Youtube, Linkedin, Twitter, MapPin } from 'lucide-react';

const cols = [
  {
    title: 'ASTER é para quem',
    links: ['Vende em marketplace', 'Tem uma loja virtual', 'Tem loja física', 'Atua como distribuidor', 'Presta serviços'],
  },
  {
    title: 'Produtos',
    links: ['Sistema ERP', 'Conta Digital', 'HUB de Integração', 'E-commerce', 'Envios', 'Sistema PDV'],
  },
  {
    title: 'Categorias',
    links: ['Moda', 'Casa e Decoração', 'Autopeças', 'Construção', 'Beleza', 'Celular e Acessórios', 'Petshop'],
  },
  {
    title: 'Ecossistema',
    links: ['Sobre a ASTER', 'Imprensa', 'Cases de sucesso', 'Novidades da ASTER', 'Blog', 'Carreira'],
  },
  {
    title: 'Atendimento',
    links: ['Central de ajuda', 'Perguntas frequentes', 'Termos de uso', 'Política de privacidade', 'Código de conduta e ética'],
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
              A parceira do empreendedor brasileiro para fortalecer seu negócio e impulsionar sua vida.
            </p>
            <div className="flex gap-2.5 mt-6">
              {[Instagram, Facebook, Youtube, Linkedin, Twitter].map((Icon, i) => (
                <a key={i} href="#top" aria-label="Rede social" className="w-10 h-10 rounded-full bg-white/10 hover:bg-ASTER-600 border border-white/10 flex items-center justify-center transition-colors">
                  <Icon size={17} />
                </a>
              ))}
            </div>
            <div className="flex gap-3 mt-7">
              <a href="#top" className="bg-white/10 hover:bg-white/15 border border-white/10 rounded-2xl px-5 py-3 text-left transition-colors">
                <p className="text-[11px] text-white/60 font-medium">Sistema da ASTER</p>
                <p className="text-sm font-bold">ERP, PDV, HUB e Envios</p>
              </a>
              <a href="#top" className="bg-white/10 hover:bg-white/15 border border-white/10 rounded-2xl px-5 py-3 text-left transition-colors">
                <p className="text-[11px] text-white/60 font-medium">Plataforma de</p>
                <p className="text-sm font-bold">Ecommerce ASTER</p>
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
            {cols.map((c) => (
              <div key={c.title}>
                <p className="font-display font-bold text-[15px] text-volt-400 mb-4">{c.title}</p>
                <ul className="space-y-2.5">
                  {c.links.map((l) => (
                    <li key={l}>
                      <a href="#top" className="text-sm text-white/60 hover:text-white transition-colors">{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="pt-7 flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-white/40">
          <p className="flex items-center gap-2 text-center sm:text-left">
            <MapPin size={14} className="shrink-0" /> Avenida João Gualberto, n° 1.698, Curitiba/PR, CEP 80030-001.
          </p>
          <p>© 2026 ASTER · Todos os direitos reservados</p>
        </div>
      </div>
    </footer>
  );
}
