"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "./button";
import { useTranslations } from "next-intl";

type CodeViewerProps = {
  data: unknown;
  label?: string;
};

function isLikelyUrl(value: string): boolean {
  return (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("/")
  );
}

function prettyMaybeJson(text: string): string {
  try {
    const parsed = JSON.parse(text);
    return JSON.stringify(parsed, null, 2);
  } catch {
    return text;
  }
}

export default function CodeViewer({ data, label = "" }: CodeViewerProps) {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement | null>(null);
  const t = useTranslations();

  useEffect(() => {
    let cancelled = false;

    async function resolveContent() {
      setError(null);

      if (typeof data === "string" && isLikelyUrl(data)) {
        setLoading(true);
        try {
          const res = await fetch(data);
          if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
          }
          const text = await res.text();
          if (!cancelled) {
            setContent(prettyMaybeJson(text));
          }
        } catch (err) {
          if (!cancelled) {
            setError(err instanceof Error ? err.message : "Failed to load");
          }
        } finally {
          if (!cancelled) {
            setLoading(false);
          }
        }
        return;
      }

      if (typeof data === "string") {
        setContent(data);
        return;
      }

      setContent(JSON.stringify(data, null, 2));
    }

    resolveContent();

    return () => {
      cancelled = true;
    };
  }, [data]);

  const copyToClipboard = async () => {
    if (!content) return;

    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);

      if (preRef.current) {
        const range = document.createRange();
        range.selectNodeContents(preRef.current);
        const selection = window.getSelection();
        if (selection) {
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }

      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy to clipboard", err);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[color:var(--foreground)] text-white shadow-[0_18px_40px_-28px_rgba(15,23,42,0.55)]">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-white/55">
        <span>{label}</span>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={copyToClipboard}
          className="h-8 rounded-lg border border-white/10 bg-white/8 px-3 text-[11px] font-medium text-white hover:bg-white/14"
        >
          {copied ? `${t("Common.copied")}!` : t("Common.copy")}
        </Button>
      </div>
      <pre
        ref={preRef}
        className="max-h-[70vh] overflow-auto p-4 text-sm leading-7 whitespace-pre text-white/88"
      >
        {loading && "Loading..."}
        {error && `Error: ${error}`}
        {!loading && !error && content}
      </pre>
    </div>
  );
}
