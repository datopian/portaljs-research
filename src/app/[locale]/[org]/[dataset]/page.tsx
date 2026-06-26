import { Dataset } from "@/schemas/ckan";
import { ckan } from "@/lib/ckan";
import Page from "@/components/layout/Page";
import DatasetResources from "@/components/package/dataset/DatasetResource";
import DatasetSidebar from "@/components/package/dataset/DatasetSidebar";
import VisualizationPreview from "@/components/package/dataset/VisualizationPreview";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { buildLocalizedMetadata } from "@/lib/seo";
import { Link } from "@/i18n/navigation";
import { Files, FolderKanban } from "lucide-react";
import { toPublicGroupSlug } from "@/lib/portal-name";

type DatasetPageParams = {
  locale: string;
  org: string;
  dataset: string;
};

type DatasetPageProps = {
  params: Promise<DatasetPageParams>;
};

export const revalidate = 60;

export async function generateStaticParams(): Promise<
  Array<{ org: string; dataset: string }>
> {
  return [];
}

export default async function DatasetPage({ params }: DatasetPageProps) {
  let dataset: Dataset | null = null;

  const { locale, dataset: datasetName, org } = await params;

  const t = await getTranslations({ locale });

  let orgName = decodeURIComponent(org);

  if (!orgName.includes("@")) {
    return notFound();
  }

  orgName = orgName.split("@")[1];

  try {
    if (!datasetName || !orgName) {
      return notFound();
    }

    dataset = await ckan().getDatasetDetails(datasetName);

    if (!dataset) {
      return notFound();
    }

    if (orgName !== dataset?.organization?.name) {
      return notFound();
    }
  } catch {
    return notFound();
  }

  const uniqueFormats = [
    ...new Set(
      (dataset.resources ?? [])
        .map((resource) => resource.format)
        .filter(Boolean),
    ),
  ];

  return (
    <Page
      breadcrumb={{
        items: [
          {
            title: t("Common.organizations"),
            href: "/organizations",
          },
          {
            title: dataset.organization?.title ?? t("Common.organization"),
            href: `/@${dataset.organization?.name}`,
          },
        ],
      }}
      title={dataset?.title ?? ""}
      description={dataset.notes}
      descriptionClampLines={4}
      metadata={[
        {
          value: dataset.groups?.length ? (
            <span className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5">
                <FolderKanban className="size-4 text-primary/80" />
                <span className="font-medium text-foreground">
                  {t("Common.groups")}
                </span>
              </span>
              <span className="flex flex-wrap items-center gap-2">
                {dataset.groups.map((group) => (
                  <Link
                    key={group.id}
                    href={`/topics/${toPublicGroupSlug(group.name)}`}
                    className="rounded-full border border-[color:var(--border)] bg-white px-2.5 py-1 text-xs font-medium text-foreground transition hover:[border-color:var(--brand-accent)] hover:[color:var(--brand-accent)]"
                  >
                    {group.display_name}
                  </Link>
                ))}
              </span>
            </span>
          ) : null,
        },
        {
          value: uniqueFormats.length ? (
            <span className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5">
                <Files className="size-4 text-primary/80" />
                <span className="font-medium text-foreground">
                  {t("Common.formats")}
                </span>
              </span>
              <span className="flex flex-wrap items-center gap-x-1 gap-y-1 text-sm text-foreground/88">
                {uniqueFormats.map((format) => (
                  <span
                    key={format}
                    className="rounded-full border border-[color:var(--border)] bg-white px-2.5 py-1 text-xs font-medium text-foreground"
                  >
                    {String(format)}
                  </span>
                ))}
              </span>
            </span>
          ) : null,
        },
      ].filter((item) => item.value)}
      sidebar={<DatasetSidebar dataset={dataset} />}
      
    >
      {dataset.type === "visualization" ? (
        <VisualizationPreview
          title={dataset.title}
          externalUrl={dataset.external_url}
        />
      ) : (
        <DatasetResources
          dataset={dataset}
          resources={dataset?.resources || []}
        />
      )}
    </Page>
  );
}

export async function generateMetadata({
  params,
}: DatasetPageProps): Promise<Metadata> {
  const { locale, org, dataset } = await params;
  const ds = await ckan().getDatasetDetails(dataset);
  const datasetTitle = ds?.title ?? decodeURIComponent(dataset);
  const description = ds?.notes ?? "";

  return buildLocalizedMetadata({
    locale,
    pathname: `/${decodeURIComponent(org)}/${dataset}`,
    title: datasetTitle,
    description,
  });
}
