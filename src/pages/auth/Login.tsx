import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ApiError } from '../../lib/api';
import AuthLayout from './AuthLayout';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const from = (location.state as { from?: string })?.from;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const user = await login(email, password);
      navigate(from ?? (user.role === 'ADMIN' ? '/admin' : '/dashboard'), { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not log in. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Log in to ASTER"
      subtitle="Access your dashboard and manage your operating system."
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-bold text-ASTER-600 hover:text-ASTER-700">
            Create one
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="text-[13px] font-bold text-ink-900 block mb-1.5">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-2xl px-4 py-3.5 text-[15px] outline-none transition-colors"
            placeholder="you@company.com"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[13px] font-bold text-ink-900">Password</label>
            <Link to="/forgot-password" className="text-[13px] font-semibold text-ASTER-600 hover:text-ASTER-700">
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-2xl px-4 py-3.5 text-[15px] outline-none transition-colors"
            placeholder="••••••••"
          />
        </div>
        {error && <p className="text-rose-500 text-sm font-semibold">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-ASTER-600 hover:bg-ASTER-700 disabled:opacity-60 text-white font-bold py-4 rounded-full transition-all flex items-center justify-center gap-2"
        >
          {submitting ? 'Logging in…' : 'Log in'} <ArrowRight size={18} />
        </button>
      </form>
    </AuthLayout>
  );
}
