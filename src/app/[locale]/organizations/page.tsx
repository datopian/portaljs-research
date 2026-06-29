import Container from "@/components/ui/container";
import SearchHeroGraphic from "@/components/layout/SearchHeroGraphic";
import PageSearchInput from "@/components/ui/page-search-input";
import { getAllOrganizations } from "@/lib/ckan/organization";
import { toPublicOrgSlug } from "@/lib/portal-name";
import { buildLocalizedMetadata } from "@/lib/seo";
import { Building2 } from "lucide-react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export const revalidate = 60;

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function OrganizationsPage({ searchParams }: Props) {
  const t = await getTranslations();
  const organizations = await getAllOrganizations({});
  const { q } = await searchParams;

  const query = Array.isArray(q) ? q[0].toLowerCase() : q?.toLowerCase() || "";

  const filtered = [...organizations]
    .sort((a, b) =>
      (a.display_name || a.title || a.name).localeCompare(
        b.display_name || b.title || b.name
      )
    )
    .filter((org) =>
      (org.display_name || org.title || org.name).toLowerCase().includes(query)
    );
  const resultLabel =
    filtered.length === 0
      ? "Nothing found"
      : `${filtered.length} ${filtered.length === 1 ? "Organization" : "Organizations"}`;

  return (
    <div>
      <section className="hero-surface relative overflow-hidden border-[color:var(--border)]">
        <Container className="relative z-10 py-14 sm:pt-16 sm:pb-10">
          <SearchHeroGraphic className="w-[20rem] xl:w-[25rem]" />
          <div className="grid relative gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.35fr)] lg:items-center">
            <div className="max-w-xl">
              <span
                className="mb-4 block text-sm font-semibold uppercase tracking-[0.16em]"
                style={{ color: "var(--brand-accent)" }}
              >
                Browse
              </span>

              <h1 className="text-4xl font-display font-[900] tracking-tight text-foreground sm:text-5xl">
                Organizations
              </h1>

              <p className="mt-4 max-w-lg text-base leading-7 text-muted-foreground sm:text-lg">
                {t("OrganizationsPage.description")}
              </p>
            </div>

            <div>
              <PageSearchInput
                defaultValue={query}
                placeholder={t("OrganizationsPage.searchPlaceholder")}
                submitLabel={t("Common.search")}
              />
            </div>
          </div>
        </Container>
      </section>

      <Container className="py-8 sm:py-10">
        <section aria-labelledby="organizations-heading" className="pb-20">
          <div className="mb-6 space-y-1">
            <span
              className="block text-[0.82rem] font-semibold uppercase tracking-[0.18em]"
              style={{ color: "var(--brand-accent)" }}
            >
              {resultLabel}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filtered.map((org) => {
            const imageUrl = org.image_display_url || org.image_url;
            const orgTitle = org.display_name || org.title || org.name;
            const orgSlug = toPublicOrgSlug(org.name);

            return (
              <Link
                key={org.id}
                href={`/@${orgSlug}`}
                className="group surface-panel flex h-full items-stretch overflow-hidden rounded-2xl bg-white transition duration-200 hover:-translate-y-0.5 hover:[border-color:var(--brand-border-tint)] hover:shadow-[0_18px_36px_-28px_rgba(37,99,235,0.3)]"
              >
                <div className="relative aspect-square w-22 shrink-0 border-r border-[color:var(--border)] bg-[color:color-mix(in_srgb,var(--brand-accent)_4%,white)] p-2.5 sm:w-32 sm:p-4">
                  {imageUrl ? (
                    // CKAN organization images can be external; keep a plain image until remote patterns are configured.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imageUrl}
                      alt={orgTitle}
                      width={256}
                      height={256}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[color:var(--brand-accent)] shadow-[var(--shadow-soft)] sm:h-16 sm:w-16 sm:rounded-2xl">
                        <Building2 className="size-6 sm:size-8" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col gap-2 p-5">
                  <h2 className="line-clamp-2 text-[1.1rem] font-semibold leading-7 tracking-tight text-foreground">
                    {orgTitle}
                  </h2>

                  {org.description ? (
                    <p className="line-clamp-3 text-[0.95rem] leading-7 text-muted-foreground">
                      {org.description.replace(/<\/?[^>]+(>|$)/g, "")}
                    </p>
                  ) : (
                    <p className="text-[0.95rem] leading-7 text-muted-foreground">
                      {t("Dataset.datasetsCount", { count: org.package_count ?? 0 })}
                    </p>
                  )}

                  <div className="mt-auto pt-2 text-[0.92rem] font-medium text-primary">
                    {t("Dataset.datasetsCount", { count: org.package_count ?? 0 })}
                  </div>
                </div>
              </Link>
            );
          })}
          </div>
        </section>
      </Container>
    </div>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return buildLocalizedMetadata({
    locale,
    pathname: "/organizations",
    title: t("Common.organizations"),
    description: t("OrganizationsPage.description"),
  });
}
