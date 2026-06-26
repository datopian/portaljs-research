import Container from "../ui/container";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import PortalLogo from "./PortalLogo";

export default function Footer() {
  const t = useTranslations();

  return (
    <footer className="mt-16 border-t border-[color:var(--border)] bg-white">
      <Container className="py-10">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <div className="space-y-3">
            <Link href="/" className="inline-flex items-center gap-2">
              <PortalLogo size="sm" />
            </Link>
            <p className="max-w-xl text-sm leading-6 text-muted-foreground">
              {t("Site.description")}
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Explore
              </h2>
              <ul className="mt-3 space-y-2 text-[0.95rem]">
                <li>
                  <Link href="/search" className="inline-flex items-center gap-1">
                    {t("Common.search")}
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </li>
                <li>
                  <Link href="/organizations" className="inline-flex items-center gap-1">
                    {t("Common.organizations")}
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </li>
                <li>
                  <Link href="/reports" className="inline-flex items-center gap-1">
                    {t("Common.reports")}
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </li>
                <li>
                  <Link href="/topics" className="inline-flex items-center gap-1">
                    {t("Common.topics")}
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Contact
              </h2>
              <a
                href="mailto:contact@datopian.com"
                className="mt-3 inline-flex items-center gap-2 text-[0.95rem]"
              >
                <Mail className="size-4" />
                contact@datopian.com
              </a>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
