import { SearchStateProvider } from "@/components/package/search/SearchContext";
import { notFound } from "next/navigation";
import SearchResultsSection from "@/components/package/search/SearchResultsSection";
import Page from "@/components/layout/Page";
import { formatDateToDDMMYYYY } from "@/lib/utils";
import { getGroup } from "@/lib/ckan/group";
import ActivityStream from "@/components/activity/ActivityStream";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { buildLocalizedMetadata } from "@/lib/seo";
import { getCkanGroupNameCandidates, toPublicGroupSlug } from "@/lib/portal-name";

type GroupPageParams = {
  locale: string;
  group: string;
};

type GroupPageProps = {
  params: Promise<GroupPageParams>;
};

async function getGroupByPublicSlug(groupSlug: string) {
  const candidates = getCkanGroupNameCandidates(groupSlug);

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

async function getGroupForMetadata(groupSlug: string) {
  const candidates = getCkanGroupNameCandidates(groupSlug);

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

export async function generateStaticParams(): Promise<Array<{ group: string }>> {
  return [];
}

export default async function GroupPage({ params }: GroupPageProps) {
  const { locale, group } = await params;
  const t = await getTranslations({ locale });
  const publicGroupSlug = decodeURIComponent(group);

  if (!publicGroupSlug) {
    return notFound();
  }
  const groupData = await getGroupByPublicSlug(publicGroupSlug);

  if (!groupData) {
    return notFound();
  }

  return (
    <Page
      breadcrumb={{
        items: [
          {
            title: t("Common.groups"),
            href: "/groups",
          },
        ],
      }}
      title={groupData.title}
      description={groupData.description}
      metadata={[
        {
          title: t("Common.created"),
          value: formatDateToDDMMYYYY(groupData.created ?? ""),
        },
        {
          title: t("Dataset.total"),
          value: groupData.package_count ?? 0,
        },
      ]}
      tabs={[
        {
          title: t("Common.datasets"),
          id: "datasets",
          content: (
            <SearchStateProvider defaultGroup={groupData.name}>
              <SearchResultsSection embedded showSearchForm />
            </SearchStateProvider>
          ),
        },
        {
          title: t("Common.activityStream"),
          id: "activity",
          content: (
            <div>
              <ActivityStream type="group" id={groupData.name} />
            </div>
          ),
        },
      ]}
    />
  );
}

export async function generateMetadata({
  params,
}: GroupPageProps): Promise<Metadata> {
  const { locale, group } = await params;
  const publicGroupSlug = decodeURIComponent(group);
  const groupData = await getGroupForMetadata(publicGroupSlug);

  const title = groupData?.title ?? publicGroupSlug;
  const description = groupData?.description ?? "";

  return buildLocalizedMetadata({
    locale,
    pathname: `/groups/${toPublicGroupSlug(groupData?.name ?? publicGroupSlug)}`,
    title,
    description,
  });
}
