import { useState } from 'react';
import { ChevronDown, Menu, X, ArrowRight, Sparkles, Truck, FileText, Store, Wallet, Globe2, Cpu, Layers, HandCoins } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const productLinks = [
  { icon: Layers, title: 'Sistema ERP', desc: 'Gestão com controle, eficiência e escala' },
  { icon: Globe2, title: 'Hub de Integração', desc: 'Integração com marketplaces e canais' },
  { icon: HandCoins, title: 'Crédito', desc: 'Capital de giro rápido e 100% digital' },
  { icon: Store, title: 'Sistema PDV', desc: 'PDV para loja física integrado ao ERP' },
  { icon: Truck, title: 'Envios', desc: 'Fretes com economia, rápido e eficiente' },
  { icon: Cpu, title: 'Ecommerce', desc: 'Loja virtual exclusiva para sua marca' },
  { icon: Wallet, title: 'Soluções financeiras', desc: 'Crédito, pagamentos e gestão' },
  { icon: Sparkles, title: 'Lis — Agente de IA', desc: 'Onde IA e a sua operação se conectam' },
];

const solutionLinks = [
  'Vender no Mercado Livre',
  'Vender no TikTok Shop',
  'Integrações com marketplaces',
  'Emissão de Nota fiscal',
  'Cotação de frete',
  'Gestão de estoque',
  'Maquininha de cartão no celular',
  'Link de pagamento',
  'Pix e Boleto bancário',
  'Conciliação bancária',
  'Gestão do financeiro',
  'Relatório de vendas',
];

export default function Navbar({ onCta }: { onCta: () => void }) {
  const [open, setOpen] = useState<'produtos' | 'solucoes' | null>(null);
  const [mobile, setMobile] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-ink-950 text-white text-center text-[13px] sm:text-sm py-2.5 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-ASTER-600/40 via-transparent to-volt-400/20" />
        <p className="relative flex items-center justify-center gap-2 flex-wrap">
          <Truck size={15} className="text-volt-400" />
          <span>Economize até <strong className="text-volt-400">50% no frete</strong> com Envios da ASTER</span>
          <button onClick={onCta} className="hidden sm:inline-flex items-center gap-1 text-volt-400 font-semibold hover:gap-2 transition-all">
            Começar agora <ArrowRight size={14} />
          </button>
        </p>
      </div>

      <nav className="glass border-b border-ASTER-100/70" onMouseLeave={() => setOpen(null)}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[68px] flex items-center justify-between gap-4">
          <a href="#top" className="flex items-center gap-1.5 shrink-0">
            <span className="font-display text-[26px] tracking-tight text-ASTER-600" style={{ fontWeight: 800 }}>
              ASTER<span className="text-volt-500">.</span>
            </span>
          </a>

          <div className="hidden lg:flex items-center gap-1 text-[15px] font-medium text-[#2c1a63]">
            <button
              onMouseEnter={() => setOpen('produtos')}
              onClick={() => setOpen(open === 'produtos' ? null : 'produtos')}
              className={`flex items-center gap-1 px-4 py-2.5 rounded-full transition-colors ${open === 'produtos' ? 'bg-ASTER-50 text-ASTER-600' : 'hover:bg-ASTER-50'}`}
            >
              Produtos <ChevronDown size={16} className={`transition-transform ${open === 'produtos' ? 'rotate-180' : ''}`} />
            </button>
            <button
              onMouseEnter={() => setOpen('solucoes')}
              onClick={() => setOpen(open === 'solucoes' ? null : 'solucoes')}
              className={`flex items-center gap-1 px-4 py-2.5 rounded-full transition-colors ${open === 'solucoes' ? 'bg-ASTER-50 text-ASTER-600' : 'hover:bg-ASTER-50'}`}
            >
              Soluções <ChevronDown size={16} className={`transition-transform ${open === 'solucoes' ? 'rotate-180' : ''}`} />
            </button>
            <a href="#lis" className="px-4 py-2.5 rounded-full hover:bg-ASTER-50 transition-colors flex items-center gap-1.5">
              Agentes de IA <span className="text-[10px] font-bold bg-volt-400 text-ink-950 px-1.5 py-0.5 rounded-md">NOVO</span>
            </a>
            <a href="#planos" className="px-4 py-2.5 rounded-full hover:bg-ASTER-50 transition-colors">Planos</a>
            <a href="#ecossistema" className="px-4 py-2.5 rounded-full hover:bg-ASTER-50 transition-colors">Ecossistema</a>
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <a href="#login" className="text-[15px] font-semibold text-[#2c1a63] hover:text-ASTER-600 transition-colors px-3 py-2">Login</a>
            <button
              onClick={onCta}
              className="bg-ASTER-600 hover:bg-ASTER-700 text-white text-[15px] font-semibold px-6 py-3 rounded-full transition-all hover:shadow-lg hover:shadow-ASTER-600/30 hover:-translate-y-0.5"
            >
              Teste grátis
            </button>
          </div>

          <div className="flex lg:hidden items-center gap-2">
            <button onClick={onCta} className="bg-ASTER-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full">Teste grátis</button>
            <button onClick={() => setMobile(!mobile)} className="p-2 text-[#2c1a63]" aria-label="Menu">
              {mobile ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open === 'produtos' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.18 }}
              className="absolute left-0 right-0 top-full hidden lg:block"
            >
              <div className="max-w-5xl mx-auto px-6">
                <div className="bg-white rounded-3xl card-shadow border border-ASTER-100 p-4 grid grid-cols-2 gap-1">
                  {productLinks.map((p) => (
                    <a key={p.title} href="#ecossistema" onClick={() => setOpen(null)} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-ASTER-50 transition-colors group">
                      <span className="w-11 h-11 rounded-2xl bg-ASTER-50 group-hover:bg-ASTER-600 text-ASTER-600 group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                        <p.icon size={20} />
                      </span>
                      <span>
                        <span className="block font-display font-semibold text-[15px] text-ink-900">{p.title}</span>
                        <span className="block text-[13px] text-slate-500 mt-0.5">{p.desc}</span>
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
          {open === 'solucoes' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.18 }}
              className="absolute left-0 right-0 top-full hidden lg:block"
            >
              <div className="max-w-4xl mx-auto px-6">
                <div className="bg-white rounded-3xl card-shadow border border-ASTER-100 p-6 grid grid-cols-3 gap-x-6 gap-y-1">
                  {solutionLinks.map((s) => (
                    <a key={s} href="#solucoes" onClick={() => setOpen(null)} className="flex items-center gap-2 py-2.5 text-[14px] font-medium text-[#2c1a63] hover:text-ASTER-600 transition-colors">
                      <FileText size={15} className="text-ASTER-300 shrink-0" /> {s}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {mobile && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden bg-white border-t border-ASTER-100"
            >
              <div className="px-5 py-4 space-y-1 max-h-[70vh] overflow-y-auto">
                {['Produtos', 'Soluções', 'Agentes de IA', 'Planos', 'Ecossistema'].map((item) => (
                  <a key={item} href={item === 'Agentes de IA' ? '#lis' : item === 'Planos' ? '#planos' : '#ecossistema'} onClick={() => setMobile(false)} className="block py-3 px-3 font-semibold text-[#2c1a63] border-b border-ASTER-50 last:border-0">
                    {item}
                  </a>
                ))}
                <a href="#login" onClick={() => setMobile(false)} className="block py-3 px-3 font-semibold text-ASTER-600">Login</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
