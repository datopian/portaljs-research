import DatasetCard from "@/components/package/dataset/DatasetCard";
import HomePromptChips from "@/components/home/HomePromptChips";
import ReportCard from "@/components/reports/ReportCard";
import SearchForm from "@/components/package/search/SearchForm";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { HeroAbstractVisual } from "@/components/layout/PageHero";
import PortalLogoSymbol from "@/components/layout/PortalLogoSymbol";
import { searchDatasets } from "@/lib/ckan/dataset";
import { getAllGroups } from "@/lib/ckan/group";
import { getAllReports } from "@/lib/reports";
import { cn } from "@/lib/utils";
import { isQuerylessEnabled } from "@/lib/queryless";
import { toPublicGroupSlug } from "@/lib/portal-name";
import { ArrowRight, Code2, FolderKanban, Mail } from "lucide-react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { CSSProperties } from "react";
import { Link } from "@/i18n/navigation";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return {
    title: t("Site.title"),
    alternates: {
      canonical: "/",
    },
  };
}

export default async function Home() {
  const t = await getTranslations();
  const querylessEnabled = isQuerylessEnabled();
  const apiDocsUrl = "https://docs.ckan.org/en/2.11/api/index.html";
  const requestDataHref =
    "mailto:data@example.com?subject=Open%20Data%20Request";
  const suggestedPrompts = [
    "How has global temperature changed since 1980?",
    "Compare atmospheric CO2 trends since 2000",
    "Which countries spend most on pharmaceuticals?",
  ];

  const [featuredDatasetsResult, statsResult, visualizationsResult, allGroups] =
    await Promise.all([
      searchDatasets({
        options: {
          limit: 4,
          sort: "metadata_modified desc",
          type: "dataset",
        },
      }),
      searchDatasets({
        options: {
          limit: 0,
          type: "dataset",
        },
        facetFields: ["groups", "organization"],
      }),
      searchDatasets({
        options: {
          limit: 0,
          type: "visualization",
        },
        facetFields: [],
      }),
      getAllGroups(),
    ]);

  const datasets = featuredDatasetsResult.datasets;
  const visualizationCount = visualizationsResult.count ?? 0;
  const groupFacetItems = statsResult.search_facets?.groups?.items ?? [];
  const groupDatasetCounts = new Map(
    groupFacetItems
      .filter((item) => (item.count ?? 0) > 0 && item.name)
      .map((item) => [item.name, item.count ?? 0]),
  );

  const groups = [...allGroups]
    .filter((group) => groupDatasetCounts.has(group.name))
    .sort((a, b) =>
      (a.display_name || a.title || a.name).localeCompare(
        b.display_name || b.title || b.name,
      ),
    )
    .slice(0, 6);
  const groupColumnCount = Math.max(3, Math.min(6, groups.length || 3));
  const reports = getAllReports().slice(0, 2);
  const stats = [
    {
      label: t("Common.datasets"),
      value: statsResult.count ?? 0,
      href: "/search",
    },
    {
      label: t("Common.organizations"),
      value: statsResult.search_facets?.organization?.items?.length ?? 0,
      href: "/organizations",
    },
    {
      label: t("Common.groups"),
      value: statsResult.search_facets?.groups?.items?.length ?? 0,
      href: "/topics",
    },
    ...(visualizationCount > 0
      ? [
          {
            label: t("Common.visualizations"),
            value: visualizationCount,
            href: "/search?type=visualization",
          },
        ]
      : []),
  ];

  return (
    <div>
      <section className="hero-surface relative overflow-hidden">
        <HeroAbstractVisual
          intensity="strong"
          align="right"
          wrapperClassName="top-18 hidden h-[24rem] w-[30rem] lg:block xl:top-16 xl:h-[28rem] xl:w-[36rem] 2xl:h-[30rem] 2xl:w-[40rem]"
          className="top-0"
        />
        <Container className="relative z-10 flex min-h-[calc(100vh-200px)] flex-col px-4 pt-8 pb-8">
          <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center text-center">
            <div className="relative h-18 w-18 sm:h-20 sm:w-20">
              <PortalLogoSymbol />
            </div>

            <div className="mt-6 space-y-4">
              <div className="space-y-4">
                <h1 className="text-[2.5rem] font-[900] leading-[0.96] tracking-tight text-foreground sm:text-[3.8rem] lg:text-[58px]">
                  <span className="block">Research Data</span>
                  <span
                    className="mt-1 block"
                    style={{ color: "var(--brand-accent)" }}
                  >
                    Intelligence
                  </span>
                </h1>
                <p className="mx-auto max-w-2xl text-[1rem] leading-[1.55] text-muted-foreground sm:text-[1.08rem]">
                  Explore academic and scientific datasets. Ask anything in
                  plain English.
                </p>
              </div>
            </div>

            <div className="mt-8 w-full max-w-3xl">
              <SearchForm
                querylessEnabled={querylessEnabled}
                placeholder={
                  querylessEnabled
                    ? "Ask a question about datasets, topics, or organizations..."
                    : "Search datasets, organizations, topics..."
                }
                querylessLabel="Ask AI"
              />
            </div>

            <div className="mt-8 w-full max-w-3xl">
              <HomePromptChips
                prompts={suggestedPrompts}
                querylessEnabled={querylessEnabled}
              />
            </div>
          </div>

          <div className="mx-auto mt-10 w-full max-w-5xl border-t border-[color:color-mix(in_srgb,var(--border)_75%,transparent)] pt-6">
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 sm:gap-x-10">
              {stats.map((stat) => (
                <Link
                  key={stat.label}
                  href={stat.href}
                  className="group flex flex-col items-center justify-center gap-1 text-center transition hover:text-primary"
                >
                  <span
                    className="text-3xl font-[700] tracking-tight sm:text-4xl"
                    style={{ color: "var(--brand-accent)" }}
                  >
                    {stat.value}
                  </span>
                  <span className="text-sm font-medium text-foreground/72 group-hover:text-primary">
                    {stat.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <Container className="space-y-20 pt-20">
        <section>
          <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end">
            <div className="space-y-0">
              <span
                className="block text-[0.82rem] font-semibold uppercase tracking-[0.18em]"
                style={{ color: "var(--brand-accent)" }}
              >
                Highlights
              </span>

              <Heading level={2} className="font-display text-foreground">
                Featured Datasets
              </Heading>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                Explore the latest datasets updated across the portal.
              </p>
            </div>

            <Button asChild className="sm:ml-auto" variant="outline">
              <Link href="/search">{t("Common.exploreAll")}</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-2">
            {datasets?.map((dataset) => (
              <DatasetCard
                key={dataset.id}
                dataset={dataset}
                linkClassName="h-full"
                cardClassName="h-full"
              />
            ))}
          </div>
        </section>

        <section>
          <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end">
            <div className="space-y-0">
              <span
                className="block text-[0.82rem] font-semibold uppercase tracking-[0.18em]"
                style={{ color: "var(--brand-accent)" }}
              >
                Browse
              </span>

              <Heading level={2} className="font-display text-foreground">
                Topics
              </Heading>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                Explore thematic collections that organize datasets across the
                portal.
              </p>
            </div>

            <Button asChild className="sm:ml-auto" variant="outline">
              <Link href="/topics">{t("Common.exploreAll")}</Link>
            </Button>
          </div>

          <div
            className={cn(
              "grid grid-cols-1 gap-4 sm:grid-cols-2",
              groupColumnCount === 3 && "xl:grid-cols-3",
              groupColumnCount === 4 && "xl:grid-cols-4",
              groupColumnCount === 5 && "xl:grid-cols-5",
              groupColumnCount === 6 && "xl:grid-cols-6",
            )}
          >
            {groups.map((group, index) => {
              const groupTitle =
                group.display_name || group.title || group.name;
              const datasetCount =
                groupDatasetCounts.get(group.name) ?? group.package_count ?? 0;
              const imageUrl = group.image_display_url || group.image_url;
              const topicShadeStops = [16, 14, 12, 10, 8, 6];
              const topicShade =
                topicShadeStops[index % topicShadeStops.length];
              return (
                <Link
                  key={group.id}
                  href={`/topics/${toPublicGroupSlug(group.name)}`}
                  className="topic-home-card group surface-panel flex h-full min-h-[200px] flex-col rounded-[1.6rem] bg-white px-5 py-6 transition duration-200 hover:-translate-y-0.5 hover:[border-color:var(--brand-border-tint)] hover:shadow-[0_18px_36px_-28px_rgba(37,99,235,0.3)]"
                  style={
                    {
                      "--topic-card-accent": `color-mix(in srgb, var(--brand-accent) ${topicShade}%, white)`,
                      "--topic-card-accent-strong": `color-mix(in srgb, var(--brand-accent) ${Math.max(topicShade + 8, 12)}%, white)`,
                    } as CSSProperties
                  }
                >
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[color:color-mix(in_srgb,var(--brand-accent)_4%,white)] text-foreground shadow-[0_18px_36px_-30px_rgba(15,23,42,0.2)]">
                    {imageUrl ? (
                      <div className="flex h-full w-full items-center justify-center">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[color:var(--brand-accent)] shadow-[var(--shadow-soft)] sm:h-16 sm:w-16 sm:rounded-2xl">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={imageUrl}
                            alt={groupTitle}
                            width={256}
                            height={256}
                            className="h-full w-full object-contain p-2 sm:p-3"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[color:var(--brand-accent)] shadow-[var(--shadow-soft)] sm:h-16 sm:w-16 sm:rounded-2xl">
                          <FolderKanban className="size-6 sm:size-8" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex flex-1 flex-col">
                    <h3 className="line-clamp-2 text-[1.05rem] font-semibold leading-6 tracking-tight text-foreground">
                      {groupTitle}
                    </h3>
                    <p className="mt-1 text-sm leading-7 text-muted-foreground">
                      {t("Dataset.datasetsCount", {
                        count: datasetCount,
                      })}
                    </p>

                    <div className="mt-auto pt-6">
                      <span className="inline-flex text-sm items-center gap-2 font-medium text-primary transition group-hover:gap-2.5">
                        View collection
                        <ArrowRight className="size-6" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
        <section>
          <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end">
            <div className="space-y-0">
              <span
                className="block text-[0.82rem] font-semibold uppercase tracking-[0.18em]"
                style={{ color: "var(--brand-accent)" }}
              >
                Editorial
              </span>

              <Heading level={2} className="font-display text-foreground">
                Reports
              </Heading>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                Read data-driven narratives built from the datasets published in
                the portal.
              </p>
            </div>

            <Button asChild className="sm:ml-auto" variant="outline">
              <Link href="/reports">{t("Common.exploreAll")}</Link>
            </Button>
          </div>

          {reports.length === 0 ? (
            <p className="text-muted-foreground">No reports published yet.</p>
          ) : (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {reports.map((report) => (
                <ReportCard key={report.slug} report={report} />
              ))}
            </div>
          )}
        </section>
        <section className="mb-12">
          <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end">
            <div className="space-y-0">
              <span
                className="block text-[0.82rem] font-semibold uppercase tracking-[0.18em]"
                style={{ color: "var(--brand-accent)" }}
              >
                Tools
              </span>

              <Heading level={2} className="font-display text-foreground">
                More ways to use the portal
              </Heading>

              <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                Request new datasets or connect directly through the API to
                build apps, workflows, and dashboards.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
            <div className="relative overflow-hidden rounded-3xl border border-[color:color-mix(in_srgb,var(--brand-accent)_45%,white)] px-6 py-6 sm:px-8 sm:py-8">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(135deg, color-mix(in srgb, var(--brand-accent) 88%, black) 0%, var(--brand-accent) 52%, color-mix(in srgb, var(--brand-accent) 78%, white) 100%)",
                }}
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-60"
                style={{
                  background:
                    "radial-gradient(circle at top right, color-mix(in srgb, white 24%, transparent) 0%, transparent 34%)",
                }}
              />

              <div className="relative flex h-full flex-col gap-5">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/16 text-white shadow-[var(--shadow-soft)] ring-1 ring-white/20 backdrop-blur-sm">
                  <Mail className="size-5" />
                </div>

                <div className="space-y-2">
                  <span className="block text-[0.82rem] font-semibold uppercase tracking-[0.18em] text-white/75">
                    Request data
                  </span>

                  <h3 className="text-[1.8rem] font-semibold tracking-tight text-white">
                    Need a dataset that is not here yet?
                  </h3>

                  <p className="max-w-xl text-[0.98rem] leading-7 text-white/78">
                    Send a request and let the data team know what information
                    would be most useful to publish next.
                  </p>
                </div>

                <div className="mt-auto">
                  <Button
                    asChild
                    className="!bg-white !text-[color:var(--brand-accent)] hover:!bg-white/92"
                  >
                    <a href={requestDataHref}>
                      Request data
                      <ArrowRight className="size-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>

            <div className="surface-panel relative overflow-hidden rounded-3xl px-6 py-6 sm:px-8 sm:py-8">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(135deg, color-mix(in srgb, var(--brand-accent) 4%, white) 0%, white 52%)",
                }}
              />

              <div className="relative flex h-full flex-col gap-5">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[color:var(--brand-accent)] shadow-[var(--shadow-soft)]">
                  <Code2 className="size-5" />
                </div>

                <div className="space-y-2">
                  <span
                    className="block text-[0.82rem] font-semibold uppercase tracking-[0.18em]"
                    style={{ color: "var(--brand-accent)" }}
                  >
                    API
                  </span>

                  <h3 className="text-[1.8rem] font-semibold tracking-tight text-foreground">
                    Build with the portal API
                  </h3>

                  <p className="max-w-xl text-[0.98rem] leading-7 text-muted-foreground">
                    Explore the Swagger documentation and connect applications,
                    workflows, or dashboards directly to portal data.
                  </p>
                </div>

                <div className="mt-auto">
                  <Button asChild variant="outline">
                    <a href={apiDocsUrl} target="_blank" rel="noreferrer">
                      Open API docs
                      <ArrowRight className="size-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Container>
    </div>
  );
}

