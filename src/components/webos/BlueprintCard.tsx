import type { WebsiteBlueprint } from '../../lib/webos/blueprint';

const STATS: { key: keyof Omit<WebsiteBlueprint, 'status'>; label: string }[] = [
  { key: 'pages', label: 'Pages' },
  { key: 'sections', label: 'Sections' },
  { key: 'leadCapturePoints', label: 'Lead Capture Points' },
  { key: 'trustElements', label: 'Trust Elements' },
  { key: 'conversionPaths', label: 'Conversion Paths' },
];

export default function BlueprintCard({ blueprint, title }: { blueprint: WebsiteBlueprint; title?: string }) {
  return (
    <div className="bg-ink-950 text-white rounded-[28px] card-shadow p-6">
      {title && <p className="font-display font-bold text-lg mb-4">{title}</p>}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {STATS.map((s) => (
          <div key={s.key}>
            <p className="font-display font-extrabold text-3xl tabular-nums">{blueprint[s.key]}</p>
            <p className="text-white/60 text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
        <span className="text-white/60 text-xs font-bold uppercase tracking-wide">Status</span>
        <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${blueprint.status === 'PUBLISHED' ? 'bg-emerald-400 text-emerald-950' : 'bg-amber-400 text-amber-950'}`}>
          {blueprint.status === 'PUBLISHED' ? 'Published' : 'Draft'}
        </span>
      </div>
    </div>
  );
}
