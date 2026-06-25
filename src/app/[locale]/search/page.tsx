import SearchLayout from "@/components/package/search/SearchLayout";
import { SearchStateProvider } from "@/components/package/search/SearchContext";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { buildLocalizedMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 60;

export default async function SearchPage({ params }: Props) {
  await params;
  return (
    <SearchStateProvider>
      <SearchLayout />
    </SearchStateProvider>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Search" });
  return buildLocalizedMetadata({
    locale,
    pathname: "/search",
    title: t("title"),
    description: t("subtitle"),
  });
}
