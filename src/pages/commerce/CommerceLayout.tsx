import { Link, NavLink, Outlet } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const TABS = [
  { to: '/commerce/products', label: 'Products' },
  { to: '/commerce/categories', label: 'Categories' },
  { to: '/commerce/inventory', label: 'Inventory' },
  { to: '/commerce/orders', label: 'Orders' },
  { to: '/commerce/customers', label: 'Customers' },
];

export default function CommerceLayout() {
  const { logout } = useAuth();

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
          <LogOut size={16} /> Log out
        </button>
      </header>

      <nav className="bg-white border-b border-ASTER-100 px-6">
        <div className="max-w-6xl mx-auto flex gap-1 overflow-x-auto no-scrollbar">
          {TABS.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                `px-4 py-3.5 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${
                  isActive ? 'border-ASTER-600 text-ASTER-600' : 'border-transparent text-slate-400 hover:text-ink-900'
                }`
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <Outlet />
      </main>
    </div>
  );
}
