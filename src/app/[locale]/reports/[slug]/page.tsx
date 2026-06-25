import Container from "@/components/ui/container";
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
        console.log("dataset", dataset);
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
        console.log("Failed to fetch dataset details for slug:", datasetSlug);
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

export default async function ReportPage({ params }: ReportPageProps) {
  const { slug } = await params;

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
      <Container className="py-10 sm:py-12">
        <div className="mx-auto max-w-4xl">
          <ReportContent
            frontmatter={frontmatter}
            body={body}
            relatedDatasets={relatedDatasets}
          />
        </div>
      </Container>
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
