"use client";

import { Children, type ReactNode, useEffect, useMemo, useState } from "react";
import { Activity, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export type HomeDataSignalSlide = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  badges: string[];
  resourceHref?: string;
};

type HomeDataSignalCarouselClientProps = {
  slides: HomeDataSignalSlide[];
  children: ReactNode;
};

const AUTOPLAY_MS = 7000;

export default function HomeDataSignalCarouselClient({
  slides,
  children,
}: HomeDataSignalCarouselClientProps) {
  const charts = useMemo(() => Children.toArray(children), [children]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const activeSlide = slides[activeIndex];
  const hasMultipleSlides = slides.length > 1;

  useEffect(() => {
    if (!hasMultipleSlides || paused) return;

    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % slides.length);
    }, AUTOPLAY_MS);

    return () => window.clearInterval(timer);
  }, [hasMultipleSlides, paused, slides.length]);

  const goTo = (index: number) => {
    setActiveIndex((index + slides.length) % slides.length);
  };

  if (!activeSlide) return null;

  return (
    <section
      className="mx-auto mt-10 w-full max-w-5xl overflow-hidden rounded-[1.5rem] border border-[color:color-mix(in_srgb,var(--border)_82%,transparent)] bg-white/92 text-left shadow-[var(--shadow-soft)] backdrop-blur"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Featured data signals"
    >
      <div className="grid gap-0 lg:grid-cols-[0.92fr_1.35fr]">
        <div className="flex min-h-[380px] flex-col border-b border-border/70 px-5 py-5 sm:min-h-[350px] sm:px-6 lg:min-h-[330px] lg:border-r lg:border-b-0">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[color:color-mix(in_srgb,var(--brand-accent)_10%,white)] text-[color:var(--brand-accent)]">
            <Activity className="size-5" />
          </div>

          <div className="relative mt-4 min-h-[264px] sm:min-h-[212px] lg:min-h-[202px]">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={cn(
                  "absolute inset-0 flex flex-col transition-all duration-500 ease-out",
                  index === activeIndex
                    ? "translate-y-0 opacity-100"
                    : "pointer-events-none translate-y-2 opacity-0",
                )}
                aria-hidden={index !== activeIndex}
                >
                <div className="space-y-2">
                  <span
                    className="block text-[0.78rem] font-semibold uppercase tracking-[0.16em]"
                    style={{ color: "var(--brand-accent)" }}
                  >
                    {slide.eyebrow}
                  </span>
                  <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                    {slide.title}
                  </h2>
                  <p className="text-sm leading-6 text-muted-foreground sm:max-w-sm">
                    {slide.description}
                  </p>
                </div>

                <div className="mt-5 flex min-h-[4.25rem] flex-wrap content-start gap-2 text-xs font-medium text-muted-foreground sm:min-h-8">
                  {slide.badges.map((badge) => (
                    <span key={badge} className="rounded-full bg-gray-100 px-3 py-1">
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {hasMultipleSlides && (
            <div className="mt-auto flex items-center justify-between gap-4 pt-5">
              <div className="flex items-center gap-1">
                {slides.map((slide, index) => (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => goTo(index)}
                    className={cn(
                      "group inline-flex h-6 w-6 items-center justify-center rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand-accent)] focus-visible:ring-offset-2",
                    )}
                    aria-label={`Show ${slide.title}`}
                    aria-current={index === activeIndex}
                  >
                    <span
                      className={cn(
                        "h-2.5 rounded-full transition-all duration-300",
                        index === activeIndex
                          ? "w-7 bg-[color:var(--brand-accent)]"
                          : "w-2.5 bg-muted-foreground/25 group-hover:bg-muted-foreground/45",
                      )}
                    />
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => goTo(activeIndex - 1)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white text-foreground shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:border-[color:var(--brand-border-tint)] hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand-accent)] focus-visible:ring-offset-2"
                  aria-label="Previous data signal"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => goTo(activeIndex + 1)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white text-foreground shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:border-[color:var(--brand-border-tint)] hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand-accent)] focus-visible:ring-offset-2"
                  aria-label="Next data signal"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="relative flex min-h-[380px] min-w-0 flex-col px-3 pt-4 pb-4 sm:min-h-[350px] sm:px-5 sm:pt-5 lg:min-h-[330px]">
          {activeSlide.resourceHref && (
            <div className="relative z-10 flex justify-end pb-2">
              <Link
                href={activeSlide.resourceHref}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-primary transition hover:gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand-accent)] focus-visible:ring-offset-2"
              >
                Go to dataset
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          )}

          {charts.map((chart, index) => (
            <div
              key={slides[index]?.id ?? index}
              className={cn(
                "absolute inset-x-3 top-1/2 transition-all duration-500 ease-out sm:inset-x-5",
                index === activeIndex
                  ? "-translate-y-1/2 translate-x-0 opacity-100"
                  : "pointer-events-none -translate-y-[46%] translate-x-3 opacity-0",
              )}
              aria-hidden={index !== activeIndex}
            >
              {chart}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
