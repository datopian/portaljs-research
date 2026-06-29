import Container from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";

function ReportCardSkeleton() {
  return (
    <div className="surface-panel flex h-full flex-col overflow-hidden rounded-2xl bg-white">
      <div className="relative h-52 border-b border-[color:var(--border)] bg-[color:color-mix(in_srgb,var(--brand-accent)_4%,white)] p-5">
        <Skeleton className="h-full w-full rounded-2xl bg-white/70" />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <Skeleton className="h-3 w-28 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-7 w-4/5 rounded-lg" />
          <Skeleton className="h-7 w-3/5 rounded-lg" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full rounded-lg" />
          <Skeleton className="h-4 w-11/12 rounded-lg" />
          <Skeleton className="h-4 w-3/4 rounded-lg" />
        </div>
        <Skeleton className="mt-auto h-5 w-28 rounded-lg" />
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <div>
      <section className="hero-surface border-[color:var(--border)]">
        <Container className="py-12 sm:py-14">
          <div className="max-w-3xl space-y-3.5">
            <Skeleton className="h-3 w-20 rounded-full" />
            <Skeleton className="h-12 w-52 rounded-xl sm:h-14 sm:w-64" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-full max-w-2xl rounded-lg" />
              <Skeleton className="h-5 w-full max-w-xl rounded-lg" />
            </div>
          </div>
        </Container>
      </section>

      <Container className="py-10 sm:py-12">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <ReportCardSkeleton key={index} />
          ))}
        </div>
      </Container>
    </div>
  );
}
