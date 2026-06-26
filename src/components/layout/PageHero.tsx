import React from "react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";

import Container from "../ui/container";
import MarkdownRender from "../ui/markdown";
import ClampedContent from "../ui/clamped-content";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";

export type BreadcrumbItemProps = {
  title: string;
  href: string;
};

export type BreadcrumbProps = {
  items?: BreadcrumbItemProps[];
  hide?: boolean;
};

export type HeroVisualProps = {
  hide?: boolean;
  className?: string;
  wrapperClassName?: string;
  intensity?: "soft" | "default" | "strong";
  align?: "center" | "right";
};

export default function Hero({
  className,
  preTitle,
  title,
  description,
  descriptionClampLines,
  children,
  breadcrumb = { items: [], hide: false },
  visual,
}: {
  className?: string;
  breadcrumb?: BreadcrumbProps;
  preTitle?: string;
  title?: string;
  description?: string;
  descriptionClampLines?: number;
  children?: React.ReactNode;
  visual?: HeroVisualProps;
}) {
  const breadcrumbItems = breadcrumb.items ?? [];
  const t = useTranslations();

  const hasVisual = Boolean(visual && !visual.hide);

  return (
    <div
      className={cn(
        "hero-surface relative overflow-hidden py-10 sm:py-12",
        className
      )}
    >
      {hasVisual && (
        <HeroAbstractVisual
          intensity={visual?.intensity}
          align={visual?.align}
          className={visual?.className}
          wrapperClassName={visual?.wrapperClassName}
        />
      )}

      <Container className="relative z-10">
        {breadcrumbItems.length > 0 && !breadcrumb.hide && (
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">{t("Site.homeTitle")}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>

              {breadcrumbItems.length > 0 && <BreadcrumbSeparator />}

              {breadcrumbItems.map((item, index) => {
                const isLast = index === breadcrumbItems.length - 1;

                return (
                  <React.Fragment key={item.href}>
                    <BreadcrumbItem className="max-w-[140px] sm:max-w-none">
                      <BreadcrumbLink
                        asChild
                        className="block overflow-hidden text-ellipsis whitespace-nowrap"
                      >
                        <Link href={item.href}>{item.title}</Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>

                    {!isLast && <BreadcrumbSeparator />}
                  </React.Fragment>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        )}

        <div
          className={cn(
            "max-w-4xl",
            hasVisual && "lg:max-w-[min(64rem,calc(100%-22rem))] xl:max-w-[min(66rem,calc(100%-26rem))]"
          )}
        >
          {(preTitle || title || description) && (
            <div className="space-y-4">
              {preTitle && (
                <span className="inline-flex rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                  {preTitle}
                </span>
              )}

              {title && (
                <h1 className="font-display max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                  {title}
                </h1>
              )}

              {description && (
                <div className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                  {descriptionClampLines ? (
                    <ClampedContent
                      lines={descriptionClampLines}
                      contentClassName="[&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                    >
                      <MarkdownRender content={description} />
                    </ClampedContent>
                  ) : (
                    <MarkdownRender content={description} />
                  )}
                </div>
              )}
            </div>
          )}

          {children && <div className="mt-5">{children}</div>}
        </div>
      </Container>
    </div>
  );
}

export function HeroAbstractVisual({
  intensity = "default",
  align = "right",
  className,
  wrapperClassName,
}: HeroVisualProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-y-0 right-0 hidden w-[28rem] overflow-hidden lg:block xl:w-[34rem]",
        wrapperClassName
      )}
    >
      <div
        className={cn(
          "absolute inset-y-0 w-full",
          align === "right" && "right-0 translate-x-0",
          align === "center" && "right-1/2 translate-x-1/2",
          className
        )}
      >
        <div
          className={cn(
            "absolute right-0 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl",
            intensity === "soft" && "opacity-50",
            intensity === "default" && "opacity-80",
            intensity === "strong" && "opacity-100"
          )}
        />

        <div
          className={cn(
            "absolute right-10 top-10 h-28 w-28 rounded-full border border-primary/15 bg-primary/5",
            intensity === "soft" && "opacity-50",
            intensity === "default" && "opacity-70",
            intensity === "strong" && "opacity-90"
          )}
        />

        <div
          className={cn(
            "absolute bottom-8 right-28 h-44 w-44 rounded-full border border-primary/10 bg-gradient-to-br from-primary/10 to-transparent",
            intensity === "soft" && "opacity-40",
            intensity === "default" && "opacity-70",
            intensity === "strong" && "opacity-90"
          )}
        />

        <div className="absolute right-8 top-16 h-3 w-3 rounded-full bg-primary/70 shadow-lg shadow-primary/30" />
        <div className="absolute bottom-16 right-44 h-2.5 w-2.5 rounded-full bg-primary/50" />
        <div className="absolute bottom-28 right-12 h-2 w-2 rounded-full bg-primary/40" />

        <svg
          className={cn(
            "absolute inset-0 h-full w-full text-primary",
            intensity === "soft" && "opacity-25",
            intensity === "default" && "opacity-35",
            intensity === "strong" && "opacity-50"
          )}
          viewBox="0 0 460 280"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M20 210 C100 140 160 250 250 155 C320 80 365 130 445 60"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          <path
            d="M0 235 C95 165 160 245 250 175 C330 115 375 135 460 90"
            stroke="currentColor"
            strokeWidth="18"
            strokeLinecap="round"
            className="opacity-10"
          />

          <path
            d="M35 190 C120 120 190 220 280 115 C350 35 390 75 455 20"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="7 9"
            strokeLinecap="round"
            className="opacity-50"
          />

          <path
            d="M70 240 C160 195 215 215 295 150 C360 95 395 115 455 75"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            className="opacity-30"
          />
        </svg>

        <div className="absolute right-24 top-24 grid grid-cols-4 gap-2 opacity-40">
          {Array.from({ length: 16 }).map((_, index) => (
            <span
              key={index}
              className="h-1.5 w-1.5 rounded-full bg-primary"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
