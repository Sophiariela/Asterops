import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { api, ApiError } from '../../lib/api';
import AuthLayout from './AuthLayout';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not process your request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <AuthLayout title="Check your email" subtitle="">
        <div className="text-center py-4">
          <CheckCircle2 size={56} className="text-emerald-500 mx-auto" />
          <p className="text-slate-500 mt-4 text-[15px]">
            If an account exists for <strong className="text-ink-900">{email}</strong>, we&apos;ve sent a link to reset your password.
          </p>
          <Link to="/login" className="inline-block mt-6 font-bold text-ASTER-600 hover:text-ASTER-700">
            Back to login
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Forgot your password?"
      subtitle="Enter your email and we'll send you a reset link."
      footer={
        <Link to="/login" className="font-bold text-ASTER-600 hover:text-ASTER-700">
          Back to login
        </Link>
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
        {error && <p className="text-rose-500 text-sm font-semibold">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-ASTER-600 hover:bg-ASTER-700 disabled:opacity-60 text-white font-bold py-4 rounded-full transition-all"
        >
          {submitting ? 'Sending…' : 'Send reset link'}
        </button>
      </form>
    </AuthLayout>
  );
}
