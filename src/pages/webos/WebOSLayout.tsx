import { Link, Outlet, useLocation } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function WebOSLayout() {
  const { logout } = useAuth();
  const { pathname } = useLocation();
  const onTemplates = pathname.startsWith('/webos/templates');

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-ASTER-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="font-display text-xl tracking-tight text-ASTER-600" style={{ fontWeight: 800 }}>
            ASTER<span className="text-volt-500">.</span>
          </Link>
          <span className="text-slate-300">/</span>
          <span className="font-display font-bold text-ink-900">WebOS</span>
          <nav className="flex items-center gap-1 ml-4">
            <Link to="/webos" className={`text-sm font-semibold px-3 py-1.5 rounded-full transition-colors ${!onTemplates ? 'bg-ASTER-50 text-ASTER-600' : 'text-slate-400 hover:text-ink-900'}`}>
              My sites
            </Link>
            <Link to="/webos/templates" className={`text-sm font-semibold px-3 py-1.5 rounded-full transition-colors ${onTemplates ? 'bg-ASTER-50 text-ASTER-600' : 'text-slate-400 hover:text-ink-900'}`}>
              Template Library
            </Link>
          </nav>
        </div>
        <button onClick={logout} className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-rose-500 transition-colors">
          <LogOut size={16} /> Log out
        </button>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <Outlet />
      </main>
    </div>
  );
}
