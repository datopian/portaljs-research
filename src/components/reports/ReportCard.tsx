import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { ReportMeta } from "@/lib/reports";

function formatReportCardDate(dateStr: string): string {
  const [year, month] = dateStr.split("-").map(Number);

  return new Date(year, (month || 1) - 1, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export default function ReportCard({ report }: { report: ReportMeta }) {
  const coverSrc = `/images/report-covers/${report.slug}.svg`;

  return (
    <Link
      href={`/reports/${report.slug}`}
      className="group surface-panel flex h-full flex-col overflow-hidden rounded-2xl bg-white transition duration-200 hover:-translate-y-0.5 hover:[border-color:var(--brand-border-tint)] hover:shadow-[0_18px_36px_-28px_rgba(37,99,235,0.3)]"
    >
      <div className="relative h-52 border-b border-[color:var(--border)] bg-[color:color-mix(in_srgb,var(--brand-accent)_4%,white)] p-5">
        <Image
          src={coverSrc}
          alt=""
          fill
          className="object-contain p-5"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
          {formatReportCardDate(report.date)}
        </p>
        <h3 className="text-[1.15rem] font-semibold leading-7 tracking-tight text-foreground transition-colors group-hover:[color:var(--brand-accent)]">
          {report.title}
        </h3>
        <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
          {report.description}
        </p>
        <span className="mt-auto inline-flex items-center gap-2 pt-2 text-sm font-semibold text-[color:var(--brand-accent)]">
          Read report
          <ArrowRight className="size-4" />
        </span>
      </div>
    </Link>
  );
}
