function CardMark({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <svg width="22" height="16" viewBox="0 0 22 16" fill="none" aria-hidden="true" className="text-slate-400">
        <rect x="0.5" y="0.5" width="21" height="15" rx="2.5" stroke="currentColor" />
        <rect x="0.5" y="4" width="21" height="2.4" fill="currentColor" />
      </svg>
      <span className="text-[13px] font-bold tracking-wide text-slate-500">{label}</span>
    </span>
  );
}

function MastercardMark() {
  return (
    <span className="inline-flex items-center gap-1.5">
      <svg width="22" height="16" viewBox="0 0 22 16" fill="none" aria-hidden="true" className="text-slate-400">
        <circle cx="8.5" cy="8" r="6" stroke="currentColor" />
        <circle cx="13.5" cy="8" r="6" stroke="currentColor" />
      </svg>
      <span className="text-[13px] font-bold tracking-wide text-slate-500">Mastercard</span>
    </span>
  );
}

function PixMark() {
  return (
    <span className="inline-flex items-center gap-1.5">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="text-slate-400">
        <path d="M1 5.5V1h4.5M15 5.5V1h-4.5M1 10.5V15h4.5M15 10.5V15h-4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="6" y="6" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.2" />
      </svg>
      <span className="text-[13px] font-bold tracking-wide text-slate-500">Pix</span>
    </span>
  );
}

function BoletoMark() {
  return (
    <span className="inline-flex items-center gap-1.5">
      <svg width="18" height="16" viewBox="0 0 18 16" fill="none" aria-hidden="true" className="text-slate-400">
        {[0, 2, 3.5, 5.5, 7, 8.5, 10.5, 12, 14, 15.5, 17].map((x, i) => (
          <rect key={x} x={x} y="1" width={i % 3 === 0 ? 1.4 : 0.8} height="14" fill="currentColor" />
        ))}
      </svg>
      <span className="text-[13px] font-bold tracking-wide text-slate-500">Boleto</span>
    </span>
  );
}

export default function PaymentMethods() {
  return (
    <div className="flex flex-col items-center gap-3" role="group" aria-label="Formas de pagamento aceitas">
      <p className="text-sm font-semibold text-slate-500">Formas de pagamento aceitas</p>
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 max-w-md">
        <CardMark label="Visa" />
        <MastercardMark />
        <CardMark label="Elo" />
        <CardMark label="Amex" />
        <PixMark />
        <BoletoMark />
      </div>
    </div>
  );
}
