import { cn } from "@/lib/utils";

function Skeleton({ className = "" }) {
  return <div className={cn("animate-pulse rounded-2xl bg-slate-200/80", className)} />;
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="surface-card p-6">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="mt-4 h-9 w-72" />
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="mt-4 h-8 w-16" />
              <Skeleton className="mt-6 h-10 w-10 rounded-2xl" />
            </div>
          ))}
        </div>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="surface-card p-6">
          <Skeleton className="h-5 w-28" />
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <Skeleton className="h-10 w-10 rounded-2xl" />
                <Skeleton className="mt-4 h-4 w-28" />
                <Skeleton className="mt-2 h-3 w-full" />
              </div>
            ))}
          </div>
        </div>
        <div className="surface-card p-6">
          <Skeleton className="h-5 w-28" />
          <div className="mt-5 space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ReviewListSkeleton() {
  return (
    <div className="space-y-6">
      <div className="surface-card p-6">
        <Skeleton className="h-5 w-40" />
        <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <Skeleton className="h-11 w-full lg:max-w-md" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-9 w-20 rounded-full" />
            ))}
          </div>
        </div>
      </div>
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="surface-card p-5">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="mt-3 h-4 w-24" />
            <Skeleton className="mt-4 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-5/6" />
            <div className="mt-5 flex items-center justify-between">
              <Skeleton className="h-4 w-28" />
              <div className="flex gap-2">
                <Skeleton className="h-9 w-20 rounded-full" />
                <Skeleton className="h-9 w-20 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <div className="surface-card p-6">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="mt-3 h-8 w-60" />
        <div className="mt-5 flex items-start gap-4 rounded-3xl border border-slate-200 bg-white p-5">
          <Skeleton className="h-16 w-16 rounded-[1.5rem]" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
        <div className="mt-5 space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </div>
      <div className="surface-card p-6">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="mt-3 h-4 w-48" />
        <Skeleton className="mt-5 h-48 w-full rounded-[1.75rem]" />
        <Skeleton className="mt-5 h-11 w-36 rounded-2xl" />
      </div>
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="surface-card p-6">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="mt-3 h-4 w-80" />
      <div className="mt-6 space-y-5">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-11 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Skeleton;
