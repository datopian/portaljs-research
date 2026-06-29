"use client";

import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { QUERYLESS_OPEN_EVENT } from "@/lib/queryless";

export default function HomePromptChips({
  prompts,
  querylessEnabled,
}: {
  prompts: string[];
  querylessEnabled: boolean;
}) {
  const router = useRouter();

  const handlePrompt = (prompt: string) => {
    if (querylessEnabled) {
      window.dispatchEvent(
        new CustomEvent(QUERYLESS_OPEN_EVENT, {
          detail: {
            prompt,
            autoSubmit: true,
          },
        }),
      );
      return;
    }

    router.push(`/search?query=${encodeURIComponent(prompt)}`);
  };

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {prompts.map((prompt) => (
        <button
          key={prompt}
          type="button"
          onClick={() => handlePrompt(prompt)}
          className="group cursor-pointer inline-flex min-h-10 items-center gap-2 rounded-full border border-[color:var(--border)] bg-white px-4 py-2 text-left text-sm text-foreground shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:[border-color:var(--brand-accent)] hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand-accent)] focus-visible:ring-offset-2"
        >
          <Sparkles className="size-3.5 text-[color:var(--brand-accent)] transition group-hover:scale-105" />
          <span className="leading-5">{prompt}</span>
        </button>
      ))}
    </div>
  );
}
