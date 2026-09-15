import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ApiError } from '../../lib/api';
import AuthLayout from './AuthLayout';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
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
      await register(name, email, password);
      navigate('/plans', { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not create your account. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create your ASTER account"
      subtitle="Deploy the operating system your business runs on."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-ASTER-600 hover:text-ASTER-700">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="text-[13px] font-bold text-ink-900 block mb-1.5">Full name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border-2 border-ASTER-100 focus:border-ASTER-600 rounded-2xl px-4 py-3.5 text-[15px] outline-none transition-colors"
            placeholder="Jane Doe"
          />
        </div>
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
          <label className="text-[13px] font-bold text-ink-900 block mb-1.5">Password</label>
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
          className="w-full bg-ASTER-600 hover:bg-ASTER-700 disabled:opacity-60 text-white font-bold py-4 rounded-full transition-all flex items-center justify-center gap-2"
        >
          {submitting ? 'Creating account…' : 'Create account'} <ArrowRight size={18} />
        </button>
      </form>
    </AuthLayout>
  );
}
