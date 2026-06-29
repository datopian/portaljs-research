import Container from "@/components/ui/container";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildLocalizedMetadata } from "@/lib/seo";
import { getAllReports } from "@/lib/reports";
import ReportCard from "@/components/reports/ReportCard";

type Props = {
  params: Promise<{ locale: string }>;
};

export const revalidate = 60;

export default async function ReportsPage() {
  const reports = getAllReports();

  return (
    <div>
      <section className="hero-surface border-[color:var(--border)]">
        <Container className="py-12 sm:py-14">
          <div className="max-w-3xl space-y-3.5">
            <span
              className="block text-[0.82rem] font-semibold uppercase tracking-[0.18em]"
              style={{ color: "var(--brand-accent)" }}
            >
              Editorial
            </span>
            <h1 className="font-display text-[2.7rem] font-[900] leading-[1.02] tracking-tight text-foreground sm:text-[3.35rem]">
              Reports
            </h1>
            <p className="max-w-2xl text-[1rem] leading-7 text-muted-foreground sm:text-[1.05rem]">
              Data-driven narratives built from the datasets available in this
              portal.
            </p>
          </div>
        </Container>
      </section>

      <Container className="py-10 sm:py-12">
        {reports.length === 0 ? (
          <p className="text-muted-foreground">No reports published yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {reports.map((report) => (
              <ReportCard key={report.slug} report={report} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return buildLocalizedMetadata({
    locale,
    pathname: "/reports",
    title: t("Common.reports"),
    description:
      "Data-driven narratives built from the datasets available in this portal.",
  });
}
