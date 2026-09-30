export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-200/70 rounded-xl ${className}`} />;
}

export function SiteCardSkeleton() {
  return (
    <div className="bg-white rounded-[28px] card-shadow border border-ASTER-100 p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-3.5 w-1/3" />
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <Skeleton className="h-3 w-3/4 mt-4" />
      <Skeleton className="h-3 w-1/4 mt-4" />
    </div>
  );
}

export function TemplateCardSkeleton() {
  return (
    <div className="bg-white rounded-[28px] card-shadow border border-ASTER-100 overflow-hidden">
      <Skeleton className="aspect-[16/10] w-full rounded-none" />
      <div className="p-6">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-3 w-1/3 mt-2" />
        <Skeleton className="h-3 w-full mt-4" />
        <Skeleton className="h-3 w-5/6 mt-2" />
        <Skeleton className="h-14 w-full mt-4 rounded-2xl" />
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-ASTER-100">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-6 w-8" />
        </div>
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl card-shadow-sm border border-ASTER-100 p-5">
      <Skeleton className="h-3 w-20 mb-3" />
      <Skeleton className="h-8 w-12" />
      <Skeleton className="h-2.5 w-16 mt-2" />
    </div>
  );
}

export function SiteDetailSkeleton() {
  return (
    <div>
      <Skeleton className="h-4 w-24 mb-6" />
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-2">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="h-9 w-32 rounded-full" />
      </div>
      <div className="mt-6 flex items-center gap-4 border-b border-ASTER-100 pb-3">
        {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-4 w-16" />)}
      </div>
      <div className="mt-6 grid grid-cols-2 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => <StatCardSkeleton key={i} />)}
      </div>
    </div>
  );
}
