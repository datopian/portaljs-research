"use client";

import {
  FormEventHandler,
  MouseEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import { Search, Sparkles, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { QUERYLESS_OPEN_EVENT } from "@/lib/queryless";

export default function SearchForm({
  value = "",
  placeholder = "Enter a search term...",
  onSubmit,
  onClear,
  className,
  querylessEnabled = false,
  querylessLabel = "Ask AI",
}: {
  value?: string;
  placeholder?: string;
  onSubmit?: (q: string) => void;
  onClear?: () => void;
  className?: string;
  querylessEnabled?: boolean;
  querylessLabel?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const [q, setQuery] = useState(value);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(q ?? "");
      return false;
    }

    if (querylessEnabled && pathname === "/") {
      const event = new CustomEvent(QUERYLESS_OPEN_EVENT, {
        cancelable: true,
        detail: {
          prompt: q ?? "",
          autoSubmit: true,
        },
      });

      const handled = window.dispatchEvent(event);
      if (!handled) {
        return false;
      }

      router.push(`/search?query=${encodeURIComponent(q)}`);
      return false;
    }

    router.push(`${pathname === "/" ? "/search" : pathname}?query=${encodeURIComponent(q)}`);
    return false;
  };

  const handleClearQuery: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    setQuery("");
    ref.current?.focus();

    if (onClear) {
      onClear();
      return false;
    }

    const params = new URLSearchParams(window.location.search);
    params.delete("query");
    const newSearch = params.toString();
    const newPath = newSearch ? `${pathname}?${newSearch}` : pathname;
    router.push(newPath);
    return false;
  };

  return (
    <form onSubmit={handleSubmit} className={cn("w-full", className)}>
      <div className="flex w-full items-stretch gap-1.5 rounded-3xl border border-[color:var(--border)] bg-white p-1.5 shadow-[var(--shadow-soft)]">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
          <input
            ref={ref}
            aria-label={placeholder}
            type="text"
            name="query"
            placeholder={placeholder}
            onChange={(e) => setQuery(e.target.value)}
            value={q}
            className="h-14 w-full border-0 bg-transparent py-3 pl-12 pr-4 text-base text-foreground outline-0 placeholder:text-muted-foreground"
          />
          {q && (
            <button
              type="button"
              aria-label="Clear search"
              className="absolute right-3 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition hover:bg-accent hover:text-foreground"
              onClick={handleClearQuery}
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <Button
          type="submit"
          size="lg"
          className="h-14 shrink-0 font-light tracking-[2px] shadow-lg cursor-pointer rounded-xl px-7 sm:min-w-30"
        >
          {querylessEnabled ? (
            <>
              <Sparkles className="size-4" />
              {querylessLabel}
            </>
          ) : (
            <>
              Search
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
