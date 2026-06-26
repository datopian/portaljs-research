import Head from "next/head";
import Hero, { BreadcrumbProps, HeroVisualProps } from "./PageHero";
import PageTabs, { PageTabItem } from "./PageTabs";
import Container from "../ui/container";
import { cn } from "@/lib/utils";
import React from "react";
import { Button, buttonVariants } from "../ui/button";
import { Link } from "@/i18n/navigation";

export type PageProps = {
  preTitle?: string;
  title: string;
  description?: string;
  descriptionClampLines?: number;
  breadcrumb?: BreadcrumbProps;
  metadata?: { title?: string; value: React.ReactNode }[];
  actions?: {
    title?: string;
    href?: string;
    icon?: React.ReactNode;
    target?: string;
    variant?: typeof buttonVariants;
    onClick?: () => void;
  }[];
  tabs?: PageTabItem[];
  children?: React.ReactNode;
  heroContent?: React.ReactNode;
  heroClass?: string;
  heroVisual?: HeroVisualProps;
  sidebar?: React.ReactNode;
  sidebarClassName?: string;
};

export default function Page({
  preTitle,
  title,
  description,
  descriptionClampLines,
  breadcrumb,
  tabs = [],
  actions,
  metadata,
  children,
  heroClass,
  heroContent,
  heroVisual,
  sidebar,
  sidebarClassName,
}: PageProps) {
  const hasMainContent = tabs.length > 0 || Boolean(children);

  return (
    <div>
      <Head>
        <title>{title ?? ""}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {(title || description || preTitle) && (
        <Hero
          breadcrumb={breadcrumb}
          preTitle={preTitle}
          title={title}
          description={description}
          descriptionClampLines={descriptionClampLines}
          className={cn("relative", tabs.length > 0 ? "pb-6!" : "", heroClass)}
          visual={heroVisual ?? { intensity: "soft", align: "right" }}
        >
          <div className="space-y-4">
            {((metadata && metadata.length > 0) ||
              (actions && actions.length > 0)) && (
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
                <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-2">
                  {metadata?.map((data, i) => (
                    <div
                      key={`${i}-${data.title ?? "meta"}`}
                      className="flex gap-2"
                    >
                      {data.title && (
                        <span className="font-medium text-foreground">
                          {data.title}
                        </span>
                      )}
                      <span>{data.value}</span>
                    </div>
                  ))}
                </div>
                {actions && actions.length > 0 && (
                  <div className="lg:ml-auto">
                    <div className="flex flex-wrap gap-3">
                      {actions.map((a, i) => (
                        <Button
                          asChild={Boolean(a.href)}
                          key={`${a.title}-${i}`}
                          {...(a.onClick ? { onClick: a.onClick } : null)}
                        >
                          {a.href ? (
                            <Link href={a.href} target={a.target}>
                              {a.icon}
                              {a.title}
                            </Link>
                          ) : (
                            <>
                              {a.icon}
                              {a.title}
                            </>
                          )}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            {heroContent && (
              <div className="text-muted-foreground">{heroContent}</div>
            )}
          </div>
        </Hero>
      )}

      {hasMainContent || sidebar ? (
        <Container className="relative mt-4">
          <div
            className={cn(
              "w-full",
              sidebar
                ? "grid grid-cols-1 gap-8 lg:grid-cols-[320px_minmax(0,1fr)]"
                : "",
            )}
          >
            {sidebar && (
              <aside className={cn("", sidebarClassName)}>{sidebar}</aside>
            )}
            <div className="min-w-0">
              {tabs.length > 0 && <PageTabs contentClass="pt-6" items={tabs} />}
              {children && (
                <section className={cn(tabs.length > 0 ? "pt-6" : "")}>
                  {children}
                </section>
              )}
            </div>
          </div>
        </Container>
      ) : null}
    </div>
  );
}
