import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { LogOut, MoreHorizontal } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// Kept visible inline at every width — the tabs used most often.
const PRIMARY_TABS = [
  { to: '/commerce/pulse', label: 'Visão Geral' },
  { to: '/commerce/products', label: 'Produtos' },
  { to: '/commerce/categories', label: 'Categorias' },
  { to: '/commerce/inventory', label: 'Estoque' },
  { to: '/commerce/orders', label: 'Pedidos' },
];

// Collapsed into the "mais" menu below the `lg` breakpoint, where all 8
// tabs no longer fit inline without clipping.
const MORE_TABS = [
  { to: '/commerce/customers', label: 'Clientes' },
  { to: '/commerce/opportunities', label: 'Oportunidades' },
  { to: '/commerce/audit', label: 'Auditoria' },
];

const ALL_TABS = [...PRIMARY_TABS, ...MORE_TABS];

const tabLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-4 py-3.5 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${
    isActive ? 'border-ASTER-600 text-ASTER-600' : 'border-transparent text-slate-400 hover:text-ink-900'
  }`;

export default function CommerceLayout() {
  const { logout } = useAuth();
  const location = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  const isMoreActive = MORE_TABS.some((tab) => location.pathname.startsWith(tab.to));

  useEffect(() => {
    if (!moreOpen) return;
    const onPointerDown = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMoreOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [moreOpen]);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-ASTER-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="font-display text-xl tracking-tight text-ASTER-600" style={{ fontWeight: 800 }}>
            ASTER<span className="text-volt-500">.</span>
          </Link>
          <span className="text-slate-300">/</span>
          <span className="font-display font-bold text-ink-900">CommerceOS</span>
        </div>
        <button onClick={logout} className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-rose-500 transition-colors">
          <LogOut size={16} /> Sair
        </button>
      </header>

      <nav className="bg-white border-b border-ASTER-100 px-6">
        <div className="max-w-6xl mx-auto flex items-center gap-1">
          {/* Wide screens: every tab fits, shown inline with no collapsing. */}
          <div className="hidden lg:flex gap-1">
            {ALL_TABS.map((tab) => (
              <NavLink key={tab.to} to={tab.to} className={tabLinkClass}>
                {tab.label}
              </NavLink>
            ))}
          </div>

          {/* Narrower screens (mobile, or a non-maximized window): the full
              row doesn't fit, so the least-used tabs collapse into a "mais"
              menu instead of clipping off-screen with no way to click them. */}
          <div className="flex lg:hidden items-center gap-1 flex-1 min-w-0 overflow-x-auto no-scrollbar">
            {PRIMARY_TABS.map((tab) => (
              <NavLink key={tab.to} to={tab.to} className={tabLinkClass}>
                {tab.label}
              </NavLink>
            ))}
          </div>
          <div className="lg:hidden relative shrink-0" ref={moreRef}>
            <button
              type="button"
              onClick={() => setMoreOpen((o) => !o)}
              aria-haspopup="menu"
              aria-expanded={moreOpen}
              aria-label="Mais opções do menu"
              className={`p-2.5 rounded-full transition-colors ${
                isMoreActive ? 'text-ASTER-600 bg-ASTER-50' : 'text-slate-400 hover:text-ink-900 hover:bg-slate-50'
              }`}
            >
              <MoreHorizontal size={20} />
            </button>
            {moreOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full mt-1 bg-white border border-ASTER-100 rounded-2xl card-shadow py-2 min-w-[180px] z-50"
              >
                {MORE_TABS.map((tab) => (
                  <NavLink
                    key={tab.to}
                    to={tab.to}
                    role="menuitem"
                    onClick={() => setMoreOpen(false)}
                    className={({ isActive }) =>
                      `block px-4 py-2.5 text-sm font-bold transition-colors ${
                        isActive ? 'text-ASTER-600 bg-ASTER-50' : 'text-slate-600 hover:bg-slate-50'
                      }`
                    }
                  >
                    {tab.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <Outlet />
      </main>
    </div>
  );
}
