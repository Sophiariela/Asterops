import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { api, ApiError } from '../../lib/api';
import AuthLayout from './AuthLayout';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/auth/reset-password', { token, password });
      navigate('/login', { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'This reset link is invalid or has expired.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!token) {
    return (
      <AuthLayout title="Invalid reset link" subtitle="">
        <p className="text-slate-500 text-[15px]">
          This link is missing its reset token. Request a new one from{' '}
          <Link to="/forgot-password" className="font-bold text-ASTER-600 hover:text-ASTER-700">
            the forgot password page
          </Link>
          .
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Set a new password" subtitle="Choose a new password for your account.">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="text-[13px] font-bold text-ink-900 block mb-1.5">New password</label>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-2xl px-4 py-3.5 text-[15px] outline-none transition-colors"
            placeholder="At least 8 characters"
          />
        </div>
        {error && <p className="text-rose-500 text-sm font-semibold">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-ASTER-600 hover:bg-ASTER-700 disabled:opacity-60 text-white font-bold py-4 rounded-full transition-all"
        >
          {submitting ? 'Updating…' : 'Update password'}
        </button>
      </form>
    </AuthLayout>
  );
}
