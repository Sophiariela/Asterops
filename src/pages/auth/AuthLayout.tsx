import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

export default function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-ASTER-50/80 via-white to-white flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <Link to="/" className="flex justify-center mb-8">
          <span className="font-display text-2xl tracking-tight text-ASTER-600" style={{ fontWeight: 800 }}>
            ASTER<span className="text-volt-500">.</span>
          </span>
        </Link>
        <div className="bg-white rounded-[28px] card-shadow border border-ASTER-100 px-7 sm:px-9 py-9">
          <h1 className="font-display font-extrabold text-2xl sm:text-[28px] text-ink-900">{title}</h1>
          <p className="text-slate-500 text-sm sm:text-[15px] mt-2">{subtitle}</p>
          <div className="mt-7">{children}</div>
        </div>
        {footer && <div className="text-center mt-6 text-sm text-slate-500">{footer}</div>}
      </div>
    </div>
  );
}
