import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Menu, X, ArrowRight, Truck } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { PRODUCTS, getProduct } from '../data/products';
import { SOLUTIONS } from '../data/solutions';

export default function Navbar({ onCta }: { onCta: () => void }) {
  const [open, setOpen] = useState<'produtos' | 'solucoes' | null>(null);
  const [mobile, setMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState<'produtos' | 'solucoes' | null>(null);

  const closeAll = () => {
    setOpen(null);
    setMobile(false);
    setMobileOpen(null);
  };

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
          <Link to="/" className="flex items-center gap-1.5 shrink-0" onClick={closeAll}>
            <span className="font-display text-[26px] tracking-tight text-ASTER-600" style={{ fontWeight: 800 }}>
              ASTER<span className="text-volt-500">.</span>
            </span>
          </Link>

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
            <Link to="/products/luna-ai" onClick={closeAll} className="px-4 py-2.5 rounded-full hover:bg-ASTER-50 transition-colors flex items-center gap-1.5">
              Luna AI <span className="text-[10px] font-bold bg-volt-400 text-ink-950 px-1.5 py-0.5 rounded-md">NOVO</span>
            </Link>
            <Link to="/plans" onClick={closeAll} className="px-4 py-2.5 rounded-full hover:bg-ASTER-50 transition-colors">Planos</Link>
            <Link to="/ecosystem" onClick={closeAll} className="px-4 py-2.5 rounded-full hover:bg-ASTER-50 transition-colors">Ecossistema</Link>
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <Link to="/login" className="text-[15px] font-semibold text-[#2c1a63] hover:text-ASTER-600 transition-colors px-3 py-2">Login</Link>
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
                <div className="bg-white rounded-3xl card-shadow border border-ASTER-100 p-4">
                  <p className="px-4 pt-1 pb-2 text-[11px] font-bold text-ASTER-600 uppercase tracking-wide">
                    ASTER Systems — the software you run
                  </p>
                  <div className="grid grid-cols-2 gap-1">
                  {PRODUCTS.map((p) => (
                    <Link key={p.slug} to={`/products/${p.slug}`} onClick={closeAll} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-ASTER-50 transition-colors group">
                      <span className="w-11 h-11 rounded-2xl bg-ASTER-50 group-hover:bg-ASTER-600 text-ASTER-600 group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                        <p.icon size={20} />
                      </span>
                      <span>
                        <span className="block font-display font-semibold text-[15px] text-ink-900">{p.name}</span>
                        <span className="block text-[13px] text-slate-500 mt-0.5">{p.tagline}</span>
                      </span>
                    </Link>
                  ))}
                  </div>
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
                <div className="bg-white rounded-3xl card-shadow border border-ASTER-100 p-4">
                  <p className="px-4 pt-1 pb-2 text-[11px] font-bold text-ASTER-600 uppercase tracking-wide">
                    Business Solutions — powered by ASTER systems
                  </p>
                  <div className="grid grid-cols-2 gap-1">
                    {SOLUTIONS.map((s) => (
                      <Link key={s.slug} to={`/solutions/${s.slug}`} onClick={closeAll} className="flex flex-col gap-0.5 p-4 rounded-2xl hover:bg-ASTER-50 transition-colors">
                        <span className="font-display font-semibold text-[15px] text-ink-900">{s.name}</span>
                        <span className="text-[13px] text-slate-500">{s.tagline}</span>
                        <span className="text-[11px] text-slate-400 mt-1">
                          Powered by {s.poweredBy.map((slug) => getProduct(slug)?.name).filter(Boolean).join(', ')}
                        </span>
                      </Link>
                    ))}
                  </div>
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
                <button
                  onClick={() => setMobileOpen(mobileOpen === 'produtos' ? null : 'produtos')}
                  className="w-full flex items-center justify-between py-3 px-3 font-semibold text-[#2c1a63] border-b border-ASTER-50"
                >
                  Produtos <ChevronDown size={16} className={`transition-transform ${mobileOpen === 'produtos' ? 'rotate-180' : ''}`} />
                </button>
                {mobileOpen === 'produtos' && (
                  <div className="pl-3 pb-1">
                    {PRODUCTS.map((p) => (
                      <Link key={p.slug} to={`/products/${p.slug}`} onClick={closeAll} className="block py-2.5 px-3 text-sm font-medium text-slate-600">
                        {p.name}
                      </Link>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => setMobileOpen(mobileOpen === 'solucoes' ? null : 'solucoes')}
                  className="w-full flex items-center justify-between py-3 px-3 font-semibold text-[#2c1a63] border-b border-ASTER-50"
                >
                  Soluções <ChevronDown size={16} className={`transition-transform ${mobileOpen === 'solucoes' ? 'rotate-180' : ''}`} />
                </button>
                {mobileOpen === 'solucoes' && (
                  <div className="pl-3 pb-1">
                    {SOLUTIONS.map((s) => (
                      <Link key={s.slug} to={`/solutions/${s.slug}`} onClick={closeAll} className="block py-2.5 px-3 text-sm font-medium text-slate-600">
                        {s.name}
                      </Link>
                    ))}
                  </div>
                )}

                <Link to="/products/luna-ai" onClick={closeAll} className="block py-3 px-3 font-semibold text-[#2c1a63] border-b border-ASTER-50">
                  Luna AI
                </Link>
                <Link to="/plans" onClick={closeAll} className="block py-3 px-3 font-semibold text-[#2c1a63] border-b border-ASTER-50">
                  Planos
                </Link>
                <Link to="/ecosystem" onClick={closeAll} className="block py-3 px-3 font-semibold text-[#2c1a63] border-b border-ASTER-50 last:border-0">
                  Ecossistema
                </Link>
                <Link to="/login" onClick={closeAll} className="block py-3 px-3 font-semibold text-ASTER-600">Login</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
