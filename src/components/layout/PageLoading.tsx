import Container from "@/components/ui/container";
import React from "react";
import { Skeleton } from "../ui/skeleton";

function SectionHeadingSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-3 w-20 rounded-full" />
      <Skeleton className="h-9 w-56 rounded-xl" />
      <Skeleton className="h-5 w-80 max-w-full rounded-lg" />
    </div>
  );
}

function DatasetCardSkeleton() {
  return (
    <div className="surface-panel space-y-4 rounded-2xl p-5">
      <div className="space-y-2">
        <Skeleton className="h-7 w-4/5 rounded-lg" />
        <Skeleton className="h-5 w-3/5 rounded-lg" />
      </div>
      <Skeleton className="h-16 w-full rounded-xl" />
      <Skeleton className="h-5 w-28 rounded-lg" />
    </div>
  );
}

function HorizontalCardSkeleton() {
  return (
    <div className="surface-panel flex overflow-hidden rounded-2xl">
      <div className="w-22 shrink-0 border-r border-[color:var(--border)] p-2.5 sm:w-32 sm:p-4">
        <Skeleton className="h-full min-h-20 w-full rounded-xl sm:min-h-24" />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <Skeleton className="h-7 w-2/3 rounded-lg" />
        <Skeleton className="h-14 w-full rounded-xl" />
        <Skeleton className="mt-auto h-5 w-24 rounded-lg" />
      </div>
    </div>
  );
}

function DetailHeroSkeleton() {
  return (
    <section className="hero-surface py-10 sm:py-14">
      <Container>
        <div className="max-w-4xl space-y-4">
          <Skeleton className="h-4 w-36 rounded-lg" />
          <Skeleton className="h-12 w-3/4 rounded-xl sm:h-14" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-full max-w-2xl rounded-lg" />
            <Skeleton className="h-5 w-full max-w-xl rounded-lg" />
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            <Skeleton className="h-8 w-28 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>
        </div>
      </Container>
    </section>
  );
}

function SidebarCardSkeleton({
  rows = 4,
  buttonGrid = false,
}: {
  rows?: number;
  buttonGrid?: boolean;
}) {
  return (
    <div className="surface-panel rounded-2xl p-5 sm:p-6">
      <Skeleton className="mb-5 h-6 w-28 rounded-lg" />
      {buttonGrid ? (
        <div className="grid grid-cols-2 gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {Array.from({ length: rows }).map((_, i) => (
            <div
              key={i}
              className="space-y-2 border-t border-[color:var(--border)] pt-4 first:border-t-0 first:pt-0"
            >
              <Skeleton className="h-3 w-20 rounded-lg" />
              <Skeleton className="h-5 w-full rounded-lg" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DetailTabsSkeleton({
  contentRows = 3,
}: {
  contentRows?: number;
}) {
  return (
    <div className="mt-6">
      
      <div className="space-y-4">
        {Array.from({ length: contentRows }).map((_, i) => (
          <div key={i} className="surface-panel rounded-2xl p-5 sm:p-6">
            <Skeleton className="h-7 w-2/5 rounded-lg" />
            <Skeleton className="mt-4 h-4 w-2/3 rounded-lg" />
            <Skeleton className="mt-4 h-16 w-full rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}

function CtaCardSkeleton({ accent = false }: { accent?: boolean }) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl border px-6 py-6 sm:px-8 sm:py-8 ${
        accent
          ? "border-[color:color-mix(in_srgb,var(--brand-accent)_35%,white)]"
          : "surface-panel"
      }`}
    >
      {accent && (
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, color-mix(in srgb, var(--brand-accent) 82%, black) 0%, var(--brand-accent) 56%, color-mix(in srgb, var(--brand-accent) 76%, white) 100%)",
          }}
        />
      )}
      <div className="relative space-y-5">
        <Skeleton
          className={`h-12 w-12 rounded-2xl ${accent ? "bg-white/20" : ""}`}
        />
        <div className="space-y-2">
          <Skeleton
            className={`h-3 w-24 rounded-full ${accent ? "bg-white/30" : ""}`}
          />
          <Skeleton
            className={`h-8 w-64 max-w-full rounded-xl ${
              accent ? "bg-white/30" : ""
            }`}
          />
          <Skeleton
            className={`h-16 w-full rounded-xl ${accent ? "bg-white/20" : ""}`}
          />
        </div>
        <Skeleton
          className={`h-11 w-36 rounded-full ${accent ? "bg-white/90" : ""}`}
        />
      </div>
    </div>
  );
}

function HeroSearchSkeleton({
  withChips = false,
  withStats = false,
}: {
  withChips?: boolean;
  withStats?: boolean;
}) {
  return (
    <section className="hero-surface">
      <Container className="py-12 sm:py-14">
        <div className="grid gap-7 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-center">
          <SectionHeadingSkeleton />

          <div>
            <div className="flex w-full items-center overflow-hidden rounded-2xl border border-[color:var(--border)] bg-white shadow-[var(--shadow-soft)]">
              <Skeleton className="h-15 flex-1 rounded-none bg-transparent" />
              <Skeleton className="h-15 w-32 rounded-none rounded-r-2xl" />
            </div>

            {withChips && (
              <div className="mt-5 flex flex-wrap gap-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-28 rounded-full" />
                ))}
              </div>
            )}

            {withStats && (
              <div className="mt-5 flex flex-wrap gap-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-36 rounded-full" />
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

export function SearchPageSkeleton() {
  return (
    <div>
      <HeroSearchSkeleton withChips />
      <Container className="py-8 sm:py-10">
        <SearchResultsSkeleton />
      </Container>
    </div>
  );
}

export function SearchResultsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[350px_minmax(0,1fr)]">
      <div className="hidden lg:block">
        <div className="surface-panel space-y-5 rounded-2xl p-6">
          <div className="flex items-center justify-between gap-3">
            <Skeleton className="h-6 w-32 rounded-lg" />
            <Skeleton className="h-5 w-14 rounded-lg" />
          </div>
          <Skeleton className="h-11 w-full rounded-xl" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3 border-t border-[color:var(--border)] pt-4 first:border-t-0 first:pt-0">
              <Skeleton className="h-5 w-28 rounded-lg" />
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((__, j) => (
                  <Skeleton key={j} className="h-5 w-full rounded-lg" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="space-y-2">
            <Skeleton className="h-8 w-52 rounded-xl" />
            <Skeleton className="h-4 w-32 rounded-lg" />
          </div>
          <Skeleton className="h-11 w-44 rounded-full sm:ml-auto" />
        </div>

        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-28 rounded-full" />
          ))}
        </div>

        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="surface-panel rounded-2xl p-5 sm:p-6">
            <Skeleton className="h-8 w-3/5 rounded-xl" />
            <div className="mt-4 flex flex-wrap gap-3">
              <Skeleton className="h-5 w-32 rounded-lg" />
              <Skeleton className="h-5 w-24 rounded-lg" />
              <Skeleton className="h-5 w-20 rounded-lg" />
            </div>
            <Skeleton className="mt-4 h-16 w-full rounded-xl" />
            <div className="mt-4 flex gap-2">
              <Skeleton className="h-8 w-16 rounded-full" />
              <Skeleton className="h-8 w-16 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HomePageSkeleton() {
  return (
    <div>
      <HeroSearchSkeleton withStats />
      <Container>
        <section className="my-12 sm:my-14">
          <div className="mb-6 flex items-end justify-between gap-4">
            <SectionHeadingSkeleton />
            <Skeleton className="hidden h-11 w-32 rounded-full sm:block" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <DatasetCardSkeleton key={i} />
            ))}
          </div>
        </section>

        <section className="mb-12 sm:mb-14">
          <div className="mb-6 flex items-end justify-between gap-4">
            <SectionHeadingSkeleton />
            <Skeleton className="hidden h-11 w-32 rounded-full sm:block" />
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <HorizontalCardSkeleton key={i} />
            ))}
          </div>
        </section>

        <section className="mb-12 grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
          <CtaCardSkeleton accent />
          <CtaCardSkeleton />
        </section>
      </Container>
    </div>
  );
}

export function DirectoryPageSkeleton() {
  return (
    <div>
      <HeroSearchSkeleton />
      <Container className="py-8 sm:py-10">
        <section className="pb-20">
          <div className="mb-6 space-y-2">
            <Skeleton className="h-3 w-28 rounded-full" />
            <Skeleton className="h-5 w-36 rounded-lg" />
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <HorizontalCardSkeleton key={i} />
            ))}
          </div>
        </section>
      </Container>
    </div>
  );
}

export function DatasetDetailSkeleton() {
  return (
    <div>
      <DetailHeroSkeleton />
      <Container className="relative">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <DetailTabsSkeleton />
          <div className="space-y-4 lg:pt-20 -mt-30">
            <SidebarCardSkeleton rows={5} />
            <SidebarCardSkeleton buttonGrid />
          </div>
        </div>
      </Container>
    </div>
  );
}

export function ResourceDetailSkeleton() {
  return (
    <div>
      <DetailHeroSkeleton />
      <Container className="relative">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <DetailTabsSkeleton contentRows={2} />
          <div className="space-y-4 lg:pt-20 -mt-30">
            <SidebarCardSkeleton rows={5} />
            <SidebarCardSkeleton rows={2} />
          </div>
        </div>
      </Container>
    </div>
  );
}

export default function PageLoading({
  type = "default",
}: {
  type: "grid" | "list" | "search" | "default" | "home" | "directory";
}) {
  if (type === "home") return <HomePageSkeleton />;
  if (type === "search") return <SearchPageSkeleton />;
  if (type === "directory") return <DirectoryPageSkeleton />;

  return (
    <div>
      <section className="hero-surface py-12 sm:py-14">
        <Container>
          <SectionHeadingSkeleton />
        </Container>
      </section>

      {type === "default" && (
        <Container>
          <div className="my-10 text-muted-foreground">Loading...</div>
        </Container>
      )}

      {type === "list" && (
        <Container className="mt-10">
          <Skeleton className="mb-8 h-8 w-40 rounded-xl" />
          <div className="space-y-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-2xl" />
            ))}
          </div>
        </Container>
      )}

      {type === "grid" && (
        <Container className="relative -mt-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="surface-panel space-y-3 rounded-2xl p-5">
                <Skeleton className="h-5 w-3/4 rounded-lg" />
                <Skeleton className="h-4 w-1/2 rounded-lg" />
              </div>
            ))}
          </div>
        </Container>
      )}
    </div>
  );
}
