"use client";

import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";

export type SearchTopicHintItem = {
  label: string;
  value: string;
  type: "groups" | "tags";
};

export default function SearchTopicHints({
  items,
  className,
  onSelect,
}: {
  items: SearchTopicHintItem[];
  className?: string;
  onSelect?: (item: SearchTopicHintItem) => void;
}) {
  if (!items.length) return null;

  return (
    <div className={cn("mt-5 flex flex-wrap gap-3", className)}>
      {items.map((item) => {
        const content = (
          <span className="rounded-full border border-[color:var(--border)] bg-white px-4 py-2 text-sm text-foreground transition hover:[border-color:var(--brand-accent)] hover:[color:var(--brand-accent)]">
            {item.label}
          </span>
        );

        if (onSelect) {
          return (
            <button
              key={`${item.type}-${item.value}`}
              type="button"
              className="flex"
              onClick={() => onSelect(item)}
            >
              {content}
            </button>
          );
        }

        const params = new URLSearchParams();
        params.append(item.type, item.value);

        return (
          <Link
            key={`${item.type}-${item.value}`}
            href={`/search?${params.toString()}`}
          >
            {content}
          </Link>
        );
      })}
    </div>
  );
}
