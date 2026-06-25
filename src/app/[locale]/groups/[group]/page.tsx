import { permanentRedirect } from "next/navigation";

type GroupPageParams = {
  locale: string;
  group: string;
};

type GroupPageProps = {
  params: Promise<GroupPageParams>;
};

export const revalidate = 60;

export async function generateStaticParams(): Promise<Array<{ group: string }>> {
  return [];
}

export default async function GroupPage({ params }: GroupPageProps) {
  const { group } = await params;
  const publicGroupSlug = decodeURIComponent(group);
  permanentRedirect(`/topics/${encodeURIComponent(publicGroupSlug)}`);
}
