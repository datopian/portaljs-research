import { SearchStateProvider } from "@/components/package/search/SearchContext";
import { notFound } from "next/navigation";
import SearchResultsSection from "@/components/package/search/SearchResultsSection";
import Page from "@/components/layout/Page";
import { getGroup } from "@/lib/ckan/group";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { buildLocalizedMetadata } from "@/lib/seo";
import {
  getCkanGroupNameCandidates,
  toPublicGroupSlug,
} from "@/lib/portal-name";

type TopicPageParams = {
  locale: string;
  topic: string;
};

type TopicPageProps = {
  params: Promise<TopicPageParams>;
};

async function getTopicByPublicSlug(topicSlug: string) {
  const candidates = getCkanGroupNameCandidates(topicSlug);

  for (const candidate of candidates) {
    const group = await getGroup({
      name: candidate,
      include_datasets: true,
    });

    if (group) {
      return group;
    }
  }

  return null;
}

async function getTopicForMetadata(topicSlug: string) {
  const candidates = getCkanGroupNameCandidates(topicSlug);

  for (const candidate of candidates) {
    const group = await getGroup({
      name: candidate,
      include_datasets: false,
    });

    if (group) {
      return group;
    }
  }

  return null;
}

export const revalidate = 60;

export async function generateStaticParams(): Promise<
  Array<{ topic: string }>
> {
  return [];
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { locale, topic } = await params;
  const t = await getTranslations({ locale });
  const publicTopicSlug = decodeURIComponent(topic);

  if (!publicTopicSlug) {
    return notFound();
  }
  const topicData = await getTopicByPublicSlug(publicTopicSlug);

  if (!topicData) {
    return notFound();
  }

  return (
    <Page
      breadcrumb={{
        items: [
          {
            title: t("Common.topics"),
            href: "/topics",
          },
        ],
      }}
      title={topicData.title}
      description={topicData.description}
    >
      <SearchStateProvider defaultGroup={topicData.name}>
        <SearchResultsSection embedded showSearchForm />
      </SearchStateProvider>
    </Page>
  );
}

export async function generateMetadata({
  params,
}: TopicPageProps): Promise<Metadata> {
  const { locale, topic } = await params;
  const publicTopicSlug = decodeURIComponent(topic);
  const topicData = await getTopicForMetadata(publicTopicSlug);

  const title = topicData?.title ?? publicTopicSlug;
  const description = topicData?.description ?? "";

  return buildLocalizedMetadata({
    locale,
    pathname: `/topics/${toPublicGroupSlug(topicData?.name ?? publicTopicSlug)}`,
    title,
    description,
  });
}
