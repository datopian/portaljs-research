import { permanentRedirect } from "next/navigation";

export const revalidate = 60;

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function GroupsPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = Array.isArray(q) ? q[0] : q;
  const target = query ? `/topics?q=${encodeURIComponent(query)}` : "/topics";
  permanentRedirect(target);
}
