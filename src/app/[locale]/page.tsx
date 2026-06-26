import DatasetCard from "@/components/package/dataset/DatasetCard";
import ReportCard from "@/components/reports/ReportCard";
import SearchForm from "@/components/package/search/SearchForm";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { searchDatasets } from "@/lib/ckan/dataset";
import { getAllGroups } from "@/lib/ckan/group";
import { getAllReports } from "@/lib/reports";
import { isQuerylessEnabled } from "@/lib/queryless";
import { toPublicGroupSlug } from "@/lib/portal-name";
import { ArrowRight, Code2, FolderKanban, Mail } from "lucide-react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
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
  const apiDocsUrl =  `https://docs.ckan.org/en/2.11/api/index.html`;
  const requestDataHref =
    "mailto:data@example.com?subject=Open%20Data%20Request";
  const [
    featuredDatasetsResult,
    statsResult,
    visualizationsResult,
    allGroups,
  ] = await Promise.all([
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
  const groups = [...allGroups]
    .sort((a, b) =>
      (a.display_name || a.title || a.name).localeCompare(
        b.display_name || b.title || b.name,
      ),
    )
    .slice(0, 4);
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
      <section className="hero-surface border-[color:var(--border)]">
        <Container className="pt-10 pb-0  sm:pt-14">
          <div className="grid gap-7 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-end">
            <div className="space-y-3.5">
              <span
                className="block text-[0.82rem] font-semibold uppercase tracking-[0.18em]"
                style={{ color: "var(--brand-accent)" }}
              >
                Explore open data
              </span>
              <div className="max-w-2xl space-y-3.5">
                <h1 className="font-display text-[2.7rem]  leading-[1.02] tracking-tight text-foreground sm:text-[3.35rem]">
                  Find, explore, and reuse public data
                </h1>
                <p className="max-w-xl text-[1rem] leading-7 text-muted-foreground sm:text-[1.05rem]">
                  Search datasets published across the portal and discover the
                  latest information shared by organizations and topics.
                </p>
              </div>
            </div>

            <div>
              <SearchForm
                querylessEnabled={querylessEnabled}
                placeholder={
                  querylessEnabled
                    ? "Ask a question about datasets, topics, or organizations..."
                    : "Search datasets, organizations, topics..."
                }
              />

              <div className="mt-5 flex flex-wrap gap-3">
                {stats.map((stat) => (
                  <Link
                    key={stat.label}
                    href={stat.href}
                    className="group inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-white px-4 py-2.5 text-sm text-foreground shadow-[var(--shadow-soft)] transition hover:[border-color:var(--brand-accent)] hover:[color:var(--brand-accent)]"
                  >
                    <span
                      className="font-semibold tracking-tight"
                      style={{ color: "var(--brand-accent)" }}
                    >
                      {stat.value}
                    </span>
                    <span className="font-medium group-hover:text-primary text-foreground/88">
                      {stat.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Container className="space-y-20 pt-20">
        <section className="">
          <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end">
            <div className="space-y-0">
              <span
                className="block text-[0.82rem] font-semibold uppercase tracking-[0.18em]"
                style={{ color: "var(--brand-accent)" }}
              >
                Editorial
              </span>

              <Heading level={2} className="text-foreground font-display">
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

         <section className="">
          <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end">
            <div className="space-y-0">
              <span
                className="block text-[0.82rem] font-semibold uppercase tracking-[0.18em]"
                style={{ color: "var(--brand-accent)" }}
              >
                Highlights
              </span>

              <Heading level={2} className="text-foreground font-display">
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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
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

        <section className="">
          <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end">
            <div className="space-y-0">
              <span
                className="block text-[0.82rem] font-semibold uppercase tracking-[0.18em]"
                style={{ color: "var(--brand-accent)" }}
              >
                Browse
              </span>

              <Heading level={2} className="text-foreground font-display">
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

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {groups.map((group) => {
              const imageUrl = group.image_display_url || group.image_url;
              const groupTitle =
                group.display_name || group.title || group.name;

              return (
                <Link
                  key={group.id}
                  href={`/topics/${toPublicGroupSlug(group.name)}`}
                  className="group surface-panel flex h-full items-stretch overflow-hidden rounded-2xl bg-white transition duration-200 hover:-translate-y-0.5 hover:[border-color:var(--brand-border-tint)] hover:shadow-[0_18px_36px_-28px_rgba(37,99,235,0.3)]"
                >
                  <div className="relative aspect-square w-22 shrink-0 border-r border-[color:var(--border)] bg-[color:color-mix(in_srgb,var(--brand-accent)_4%,white)] p-2.5 sm:w-32 sm:p-4">
                    {imageUrl ? (
                      <div className="flex h-full w-full items-center justify-center">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[color:var(--brand-accent)] shadow-[var(--shadow-soft)] sm:h-16 sm:w-16 sm:rounded-2xl">
                          {/* CKAN group images can be external; keep a plain image until remote patterns are configured. */}
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

                  <div className="flex flex-1 flex-col gap-2 p-5">
                    <h3 className="line-clamp-2 text-[1.1rem] font-semibold leading-7 tracking-tight text-foreground">
                      {groupTitle}
                    </h3>
                    {group.description ? (
                      <p className="line-clamp-3 text-[0.95rem] leading-7 text-muted-foreground">
                        {group.description.replace(/<\/?[^>]+(>|$)/g, "")}
                      </p>
                    ) : (
                      <p className="text-[0.95rem] leading-7 text-muted-foreground">
                        {t("Dataset.datasetsCount", {
                          count: group.package_count ?? 0,
                        })}
                      </p>
                    )}
                    <div className="mt-auto pt-2 text-[0.92rem] font-medium text-primary/85">
                      {t("Dataset.datasetsCount", {
                        count: group.package_count ?? 0,
                      })}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
       

        

        <section className="mb-12 grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
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
                <h2 className="text-[1.8rem] font-semibold tracking-tight text-white">
                  Need a dataset that is not here yet?
                </h2>
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
                <h2 className="text-[1.8rem] font-semibold tracking-tight text-foreground">
                  Build with the portal API
                </h2>
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
        </section>
      </Container>
    </div>
  );
}
