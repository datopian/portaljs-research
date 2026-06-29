import Page from "@/components/layout/Page";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildLocalizedMetadata } from "@/lib/seo";
import { getAllReports, getReportSource } from "@/lib/reports";
import ReportContent from "@/components/reports/ReportContent";
import ReportChart from "@/components/reports/ReportChart";
import { ckan } from "@/lib/ckan";

type ReportPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export const revalidate = 60;

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  return getAllReports().map((report) => ({ slug: report.slug }));
}

async function getRelatedDatasets(
  datasetSlugs: string[],
): Promise<Array<{ slug: string; title: string; href: string }>> {
  const results = await Promise.all(
    datasetSlugs.map(async (datasetSlug) => {
      try {
        const dataset = await ckan().getDatasetDetails(datasetSlug);
        const orgName = dataset.organization?.name;
        if (!orgName) {
          return {
            slug: datasetSlug,
            title: dataset.title ?? datasetSlug,
            href: `/search?q=${encodeURIComponent(datasetSlug)}`,
          };
        }

        return {
          slug: datasetSlug,
          title: dataset.title ?? datasetSlug,
          href: `/@${orgName}/${dataset.name}`,
        };
      } catch {
        return {
          slug: datasetSlug,
          title: datasetSlug,
          href: `/search?q=${encodeURIComponent(datasetSlug)}`,
        };
      }
    }),
  );

  return results;
}

function getReportComponents(slug: string) {
  const reportComponents: Record<string, Record<string, React.FC<{ title?: string }>>> = {
    "great-decoupling": {
      CoverChart: ({ title = "" }) => (
        <ReportChart reportSlug={slug} chartId="cover" title={title} />
      ),
      TemperatureChart: ({ title = "" }) => (
        <ReportChart reportSlug={slug} chartId="temperature" title={title} />
      ),
      EmittersChart: ({ title = "" }) => (
        <ReportChart reportSlug={slug} chartId="emitters" title={title} />
      ),
    },
    "biology-got-cheap-medicine-didnt": {
      CoverChart: ({ title = "" }) => (
        <ReportChart reportSlug={slug} chartId="cover" title={title} />
      ),
      PharmaChart: ({ title = "" }) => (
        <ReportChart reportSlug={slug} chartId="pharma" title={title} />
      ),
    },
  };

  return reportComponents[slug] ?? {};
}

function formatReportDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);

  return new Date(year, (month || 1) - 1, day || 1).toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    },
  );
}

export default async function ReportPage({ params }: ReportPageProps) {
  const { slug } = await params;
  const t = await getTranslations();

  try {
    const { content, frontmatter } = getReportSource(slug);
    const relatedDatasets = await getRelatedDatasets(
      frontmatter.relatedDatasets ?? [],
    );
    const { content: body } = await compileMDX({
      source: content,
      components: getReportComponents(slug),
      options: {
        parseFrontmatter: false,
      },
    });

    return (
      <Page
        breadcrumb={{
          items: [
            {
              title: t("Common.reports"),
              href: "/reports",
            },
          ],
        }}
        title={frontmatter.title}
        description={frontmatter.description}
        heroClass="pb-8 sm:pb-10"
        heroInnerClassName="mx-auto max-w-3xl"
        heroContentClassName="max-w-3xl"
        heroVisual={{ hide: true }}
        metadata={[
          {
            value: (
              <span className="text-sm font-medium text-muted-foreground">
                {formatReportDate(frontmatter.date)}
              </span>
            ),
          },
        ]}
      >
        <div className="mx-auto max-w-3xl pb-14 sm:pb-18">
          <ReportContent
            body={body}
            relatedDatasets={relatedDatasets}
          />
        </div>
      </Page>
    );
  } catch {
    notFound();
  }
}

export async function generateMetadata({
  params,
}: ReportPageProps): Promise<Metadata> {
  const { locale, slug } = await params;

  try {
    const { frontmatter } = getReportSource(slug);

    return buildLocalizedMetadata({
      locale,
      pathname: `/reports/${slug}`,
      title: frontmatter.title,
      description: frontmatter.description,
    });
  } catch {
    const t = await getTranslations({ locale });

    return buildLocalizedMetadata({
      locale,
      pathname: `/reports/${slug}`,
      title: t("Common.reports"),
      description: "",
    });
  }
}
