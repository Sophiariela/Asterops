import { Navigate, Outlet } from 'react-router-dom';
import { useAuth, type Role } from '../context/AuthContext';

export default function ProtectedRoute({ roles }: { roles: Role[] }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-slate-400">Loading…</div>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (!roles.includes(user.role)) {
    return <Navigate to={user.role === 'ADMIN' ? '/admin' : '/dashboard'} replace />;
  }
  return <Outlet />;
}
