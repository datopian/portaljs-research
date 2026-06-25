import Container from "@/components/ui/container";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildLocalizedMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

export default function AiTermsOfUsePage() {
  return (
    <Container className="py-10 sm:py-12">
      <div className="mx-auto max-w-3xl p-6  md:p-8">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">
          AI Terms of Use
        </h1>
        <div className="mt-6 space-y-4 text-sm leading-7 text-muted-foreground md:text-base">
          <p>
            By using the AI on this website, you accept that AI-generated
            responses can contain mistakes, omissions, or outdated information.
          </p>
          <p>
            You are responsible for checking important information before
            relying on it for decisions, compliance, legal matters, financial
            matters, medical matters, or any other high-impact use.
          </p>
          <p>
            The owners of this website, along with their vendors and suppliers,
            are not legally liable for AI-generated responses, including any
            inaccuracies, misinterpretations, or resulting losses.
          </p>
        </div>
      </div>
    </Container>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  await getTranslations({ locale });

  return buildLocalizedMetadata({
    locale,
    pathname: "/ai-terms-of-use",
    title: "AI Terms of Use",
    description: "Terms of use for the AI assistant on this website.",
  });
}
