import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

type EmptyStateProps =
  | { message: string; cta: string; onAction: () => void; to?: undefined }
  | { message: string; cta: string; to: string; onAction?: undefined };

export default function EmptyState({ message, cta, onAction, to }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2.5 py-8">
      <p className="text-slate-400 text-sm">{message}</p>
      {to ? (
        <Link to={to} className="inline-flex items-center gap-1.5 text-sm font-bold text-ASTER-600 hover:text-ASTER-700">
          {cta} <ArrowRight size={15} />
        </Link>
      ) : (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-ASTER-600 hover:text-ASTER-700"
        >
          {cta} <ArrowRight size={15} />
        </button>
      )}
    </div>
  );
}
