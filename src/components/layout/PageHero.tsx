import { cn } from "@/lib/utils";
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
import React from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export type BreadcrumbItemProps = {
  title: string;
  href: string;
};

export type BreadcrumbProps = {
  items?: BreadcrumbItemProps[];
  hide?: boolean;
};

export default function Hero({
  className,
  preTitle,
  title,
  description,
  descriptionClampLines,
  children,
  breadcrumb = { items: [], hide: false },
}: {
  className?: string;
  breadcrumb?: BreadcrumbProps;
  preTitle?: string;
  title?: string;
  description?: string;
  descriptionClampLines?: number;
  children?: React.ReactNode;
}) {
  const breadcrumbItems = breadcrumb.items ?? [];
  const t = useTranslations();

  return (
    <div
      className={cn(
        "hero-surface py-10 sm:py-14",
        className
      )}
    >
      <Container>
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

        <div className="max-w-4xl">
          {(preTitle || title || description) && (
            <div className="space-y-4">
              {preTitle && (
                <span className="block text-sm font-semibold uppercase tracking-[0.16em] text-primary">
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
        </div>
        <div className="mt-4">{children}</div>
      </Container>
    </div>
  );
}
