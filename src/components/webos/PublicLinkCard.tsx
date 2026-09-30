import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { ExternalLink, Copy, QrCode as QrCodeIcon, MessageCircle, Mail, Check } from 'lucide-react';

function XIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.9 2H22l-7.6 8.7L23.3 22h-7l-5.5-7.2L4.4 22H1.3l8.1-9.3L1 2h7.2l5 6.6L18.9 2Zm-1.2 18h1.7L7.4 3.9H5.6L17.7 20Z" />
    </svg>
  );
}

export default function PublicLinkCard({ businessName, publicUrl }: { businessName: string; publicUrl: string }) {
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [showQr, setShowQr] = useState(false);

  useEffect(() => {
    QRCode.toDataURL(publicUrl, { margin: 1, width: 240, color: { dark: '#17141f', light: '#ffffff' } })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(null));
  }, [publicUrl]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
    } catch {
      // Clipboard API unavailable — the URL is still visible to copy by hand.
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareText = `Check out ${businessName}`;
  const shareTargets = [
    { label: 'WhatsApp', icon: MessageCircle, href: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${publicUrl}`)}` },
    { label: 'X', icon: XIcon, href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(publicUrl)}` },
    { label: 'Email', icon: Mail, href: `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(publicUrl)}` },
  ];

  const nativeShare = typeof navigator !== 'undefined' && 'share' in navigator
    ? () => navigator.share({ title: businessName, text: shareText, url: publicUrl }).catch(() => {})
    : null;

  return (
    <div>
      <div className="flex items-center gap-2 bg-slate-50 border-2 border-ASTER-100 rounded-2xl px-4 py-3">
        <a href={publicUrl} target="_blank" rel="noreferrer" className="text-sm font-semibold text-ASTER-600 hover:underline truncate flex-1">
          {publicUrl.replace(/^https:\/\//, '')}
        </a>
      </div>

      <div className="flex items-center gap-2 mt-3 flex-wrap">
        <a
          href={publicUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 bg-ASTER-600 hover:bg-ASTER-700 text-white font-bold text-sm px-4 py-2 rounded-full transition-all"
        >
          <ExternalLink size={14} /> Open Live Site
        </a>
        <button
          onClick={copyLink}
          className="inline-flex items-center gap-1.5 border-2 border-ASTER-100 hover:border-ASTER-600 text-ink-900 font-bold text-sm px-4 py-2 rounded-full transition-all"
        >
          {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy Link'}
        </button>
        <button
          onClick={() => setShowQr((v) => !v)}
          className={`inline-flex items-center gap-1.5 border-2 font-bold text-sm px-4 py-2 rounded-full transition-all ${showQr ? 'border-ASTER-600 text-ASTER-600 bg-ASTER-50' : 'border-ASTER-100 hover:border-ASTER-600 text-ink-900'}`}
        >
          <QrCodeIcon size={14} /> QR Code
        </button>
        {nativeShare ? (
          <button onClick={nativeShare} className="inline-flex items-center gap-1.5 border-2 border-ASTER-100 hover:border-ASTER-600 text-ink-900 font-bold text-sm px-4 py-2 rounded-full transition-all">
            Share
          </button>
        ) : (
          shareTargets.map((t) => (
            <a
              key={t.label}
              href={t.href}
              target="_blank"
              rel="noreferrer"
              aria-label={`Share on ${t.label}`}
              title={`Share on ${t.label}`}
              className="inline-flex items-center justify-center w-9 h-9 border-2 border-ASTER-100 hover:border-ASTER-600 hover:text-ASTER-600 text-slate-500 rounded-full transition-all"
            >
              <t.icon size={14} />
            </a>
          ))
        )}
      </div>

      {showQr && qrDataUrl && (
        <div className="mt-4 inline-flex flex-col items-center gap-2 bg-white border-2 border-ASTER-100 rounded-2xl p-4">
          <img src={qrDataUrl} alt={`QR code for ${publicUrl}`} width={160} height={160} className="rounded-lg" />
          <p className="text-[11px] text-slate-400">Scan to open on a phone</p>
        </div>
      )}
    </div>
  );
}
