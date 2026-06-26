"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Link } from "@/i18n/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import {
  Brain,
  ChevronDown,
  MessageSquareText,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { QUERYLESS_OPEN_EVENT, querylessConfig } from "@/lib/queryless";
import { locales } from "@/i18n/config";
import VegaSpecRenderer, { parseVegaSpecText } from "./VegaSpecRenderer";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  variant?: "default" | "context";
};

type ParsedAssistantContent = {
  mainContent: string;
  methodContent: string | null;
};

const QUERYLESS_STORAGE_KEY = "queryless:enabled";
const QUERYLESS_OPEN_STORAGE_KEY = "queryless:open";
const QUERYLESS_RATE_LIMIT_STORAGE_KEY = "queryless:rate-limit";
const QUERYLESS_DAILY_LIMIT_STORAGE_KEY = "queryless:daily-limit";
const QUERYLESS_RATE_LIMIT_MAX_REQUESTS = 4;
const QUERYLESS_RATE_LIMIT_WINDOW_MS = 60_000;
const QUERYLESS_DAILY_LIMIT_MAX_REQUESTS = 20;

function createSessionId() {
  return `queryless-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function stripLocalePrefix(pathname: string) {
  const cleanPath = pathname.split("?")[0] || "/";
  const segments = cleanPath.split("/").filter(Boolean);
  const [first, ...rest] = segments;

  if (first && locales.includes(first)) {
    return `/${rest.join("/")}`;
  }

  return cleanPath;
}

function getPageDirective(pathname: string) {
  const cleanPath = stripLocalePrefix(pathname);
  const segments = cleanPath.split("/").filter(Boolean);
  const first = segments[0] || "";

  if (cleanPath === "/") return "home";
  if (cleanPath === "/search") return "search";
  if (cleanPath === "/groups" || cleanPath === "/organizations" || cleanPath === "/topics") {
    return "search";
  }

  if (first === "groups" && segments[1]) {
    return `group/${segments[1]}`;
  }

  if (first === "topics" && segments[1]) {
    return `topic/${segments[1]}`;
  }

  if (first.startsWith("@")) {
    const org = first.replace(/^@/, "");
    const dataset = segments[1];
    const resourceId = segments[3];

    if (dataset && segments[2] === "r" && resourceId) {
      return `resource/${dataset}/${resourceId}`;
    }

    if (dataset) {
      return `dataset/${dataset}`;
    }

    if (org) {
      return `organization/${org}`;
    }
  }

  return "search";
}

function toTitleCaseFromSlug(value: string) {
  return value
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getFallbackViewingNotice(pageDirective: string) {
  if (pageDirective.startsWith("dataset/")) {
    return `Viewing dataset ${toTitleCaseFromSlug(pageDirective.replace("dataset/", ""))}`;
  }
  if (pageDirective.startsWith("resource/")) {
    const resourcePath = pageDirective.replace("resource/", "");
    return `Viewing resource ${toTitleCaseFromSlug(resourcePath.split("/")[1] || resourcePath)}`;
  }
  if (pageDirective.startsWith("organization/")) {
    return `Viewing organization ${toTitleCaseFromSlug(pageDirective.replace("organization/", ""))}`;
  }
  if (pageDirective.startsWith("group/")) {
    return `Viewing topic ${toTitleCaseFromSlug(pageDirective.replace("group/", ""))}`;
  }
  if (pageDirective.startsWith("topic/")) {
    return `Viewing topic ${toTitleCaseFromSlug(pageDirective.replace("topic/", ""))}`;
  }
  if (pageDirective === "home") return "Viewing home";
  return "Viewing search";
}

type QuerylessPayload = {
  choices?: Array<{
    delta?: { content?: unknown };
    message?: { content?: unknown };
    text?: unknown;
  }>;
  message?: unknown;
  result?: unknown;
  output?: unknown;
  answer?: unknown;
};

function normalizeContent(value: unknown): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object" && "text" in item) {
          const text = (item as { text?: unknown }).text;
          return typeof text === "string" ? text : "";
        }
        return "";
      })
      .join("");
  }
  return "";
}

function extractTextFromPayload(payload: QuerylessPayload): string {
  const deltaContent = payload.choices?.[0]?.delta?.content;
  const messageContent = payload.choices?.[0]?.message?.content;

  return (
    normalizeContent(deltaContent) ||
    normalizeContent(messageContent) ||
    normalizeContent(
      payload.choices?.[0]?.text ??
        payload.message ??
        payload.result ??
        payload.output ??
        payload.answer ??
        ""
    )
  );
}

function isLocalLink(href: string | undefined) {
  if (!href) return false;
  if (href.startsWith("/")) return true;
  if (typeof window === "undefined") return false;
  return href.startsWith(window.location.origin);
}

function maskIncompleteChartBlock(content: string) {
  const chartStart = content.lastIndexOf("```chart");
  const vegaStart = content.lastIndexOf("```vega");
  const blockStart = Math.max(chartStart, vegaStart);

  if (blockStart === -1) return content;

  const closingFence = content.indexOf("```", blockStart + 3);
  if (closingFence === -1) {
    return content.slice(0, blockStart).trimEnd();
  }

  return content;
}

function maskIncompleteAuxiliaryBlocks(content: string) {
  const methodStart = content.lastIndexOf("[[QUERYLESS_METHOD]]");
  const methodEnd = content.indexOf("[[/QUERYLESS_METHOD]]", Math.max(0, methodStart));

  if (methodStart !== -1 && methodEnd === -1) {
    return content.slice(0, methodStart).trimEnd();
  }

  return content;
}

function parseAssistantContent(content: string): ParsedAssistantContent {
  let mainContent = content;
  let methodContent: string | null = null;

  const methodMatch = mainContent.match(
    /\[\[QUERYLESS_METHOD\]\]\s*([\s\S]*?)\s*\[\[\/QUERYLESS_METHOD\]\]/
  );

  if (methodMatch?.[1]) {
    methodContent = methodMatch[1].trim();
    mainContent = mainContent.replace(methodMatch[0], "").trim();
  }

  return { mainContent, methodContent };
}

function isInlineCodeNode(className: string | undefined, children: React.ReactNode) {
  const text = String(children);
  return !className && !text.includes("\n");
}

function getRecentQuestionTimestamps(now = Date.now()) {
  if (typeof window === "undefined") return [];

  const raw = window.localStorage.getItem(QUERYLESS_RATE_LIMIT_STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (value): value is number =>
        typeof value === "number" && now - value < QUERYLESS_RATE_LIMIT_WINDOW_MS
    );
  } catch {
    return [];
  }
}

function persistQuestionTimestamps(timestamps: number[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(QUERYLESS_RATE_LIMIT_STORAGE_KEY, JSON.stringify(timestamps));
}

function getRateLimitState(now = Date.now()) {
  const recent = getRecentQuestionTimestamps(now);
  const isLimited = recent.length >= QUERYLESS_RATE_LIMIT_MAX_REQUESTS;
  const retryAt = isLimited ? recent[0] + QUERYLESS_RATE_LIMIT_WINDOW_MS : null;

  return { recent, isLimited, retryAt };
}

function formatRateLimitMessage(retryAt: number | null, now = Date.now()) {
  if (!retryAt) return null;
  const secondsRemaining = Math.max(1, Math.ceil((retryAt - now) / 1000));

  return `Rate limit reached: ${QUERYLESS_RATE_LIMIT_MAX_REQUESTS} questions per ${Math.round(
    QUERYLESS_RATE_LIMIT_WINDOW_MS / 1000
  )} seconds. Try again in ${secondsRemaining}s.`;
}

function getDailyUsagePillClassName(count: number) {
  if (count >= QUERYLESS_DAILY_LIMIT_MAX_REQUESTS) {
    return "bg-red-100 text-red-700";
  }

  if (count >= QUERYLESS_DAILY_LIMIT_MAX_REQUESTS * 0.75) {
    return "bg-amber-100 text-amber-700";
  }

  return "bg-slate-100 text-slate-600";
}

function getLocalDateKey(now = new Date()) {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getDailyUsageState(now = new Date()) {
  if (typeof window === "undefined") {
    return { dateKey: getLocalDateKey(now), count: 0, isLimited: false };
  }

  const dateKey = getLocalDateKey(now);
  const raw = window.localStorage.getItem(QUERYLESS_DAILY_LIMIT_STORAGE_KEY);

  if (!raw) {
    return { dateKey, count: 0, isLimited: false };
  }

  try {
    const parsed = JSON.parse(raw);
    if (parsed?.dateKey !== dateKey || typeof parsed?.count !== "number") {
      return { dateKey, count: 0, isLimited: false };
    }

    return {
      dateKey,
      count: parsed.count,
      isLimited: parsed.count >= QUERYLESS_DAILY_LIMIT_MAX_REQUESTS,
    };
  } catch {
    return { dateKey, count: 0, isLimited: false };
  }
}

function persistDailyUsage(dateKey: string, count: number) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(QUERYLESS_DAILY_LIMIT_STORAGE_KEY, JSON.stringify({ dateKey, count }));
}

const assistantWelcome =
  "Hi, I’m Queryless. Ask in plain English, and I’ll use the current page context to help you explore the portal.";

function MarkdownContent({ content }: { content: string }) {
  const { mainContent, methodContent } = useMemo(
    () => parseAssistantContent(content),
    [content]
  );

  return (
    <div className="space-y-3">
      {mainContent ? (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            p: ({ ...props }) => <p className="mb-2 last:mb-0 leading-7" {...props} />,
            strong: ({ ...props }) => <strong className="font-semibold" {...props} />,
            a: ({ href, children, ...props }) =>
              isLocalLink(href) ? (
                <Link href={href || "/"} className="font-medium underline underline-offset-4">
                  {children}
                </Link>
              ) : (
                <a
                  href={href}
                  className="font-medium underline underline-offset-4"
                  target="_blank"
                  rel="noopener noreferrer"
                  {...props}
                >
                  {children}
                </a>
              ),
            ul: ({ ...props }) => (
              <ul className="mb-2 list-disc space-y-1 pl-5 last:mb-0" {...props} />
            ),
            ol: ({ ...props }) => (
              <ol className="mb-2 list-decimal space-y-1 pl-5 last:mb-0" {...props} />
            ),
            li: ({ ...props }) => <li className="leading-7" {...props} />,
            blockquote: ({ ...props }) => (
              <blockquote
                className="mb-2 border-l-2 border-[color:var(--brand-accent)] pl-3 text-sm text-muted-foreground last:mb-0"
                {...props}
              />
            ),
            table: ({ ...props }) => (
              <div className="mb-2 overflow-x-auto last:mb-0">
                <table className="w-full border-collapse text-sm" {...props} />
              </div>
            ),
            thead: ({ ...props }) => <thead className="bg-black/5" {...props} />,
            th: ({ ...props }) => (
              <th className="border border-black/10 px-3 py-2 text-left font-semibold" {...props} />
            ),
            td: ({ ...props }) => (
              <td className="border border-black/10 px-3 py-2 align-top" {...props} />
            ),
            code: ({ className, children, ...props }) => {
              if (isInlineCodeNode(className, children)) {
                return (
                  <code className="rounded-md bg-black/5 px-1.5 py-0.5 text-[0.92em]" {...props}>
                    {children}
                  </code>
                );
              }

              const language = (className || "").replace("language-", "");
              const isChartBlock = language === "chart" || language === "vega";

              if (isChartBlock) {
                const specText = String(children).trim();
                if (parseVegaSpecText(specText)) {
                  return <VegaSpecRenderer specText={specText} />;
                }
              }

              return (
                <pre className="mb-2 overflow-x-auto rounded-2xl border border-[color:var(--border)] bg-[#0b1020] p-4 text-sm text-white last:mb-0">
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
              );
            },
          }}
        >
          {mainContent}
        </ReactMarkdown>
      ) : null}

      {methodContent ? (
        <details className="rounded-2xl border border-[color:var(--border)] bg-white/80 px-4 py-3">
          <summary className="cursor-pointer list-none text-sm font-medium text-foreground">
            <span className="inline-flex items-center gap-2">
              <Brain className="size-4 text-[color:var(--brand-accent)]" />
              How this was calculated
            </span>
          </summary>
          <div className="mt-3 text-sm text-muted-foreground">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                p: ({ ...props }) => <p className="mb-2 last:mb-0 leading-7" {...props} />,
                a: ({ href, children, ...props }) =>
                  isLocalLink(href) ? (
                    <Link href={href || "/"} className="font-medium underline underline-offset-4">
                      {children}
                    </Link>
                  ) : (
                    <a
                      href={href}
                      className="font-medium underline underline-offset-4"
                      target="_blank"
                      rel="noopener noreferrer"
                      {...props}
                    >
                      {children}
                    </a>
                  ),
                ul: ({ ...props }) => (
                  <ul className="mb-2 list-disc space-y-1 pl-5 last:mb-0" {...props} />
                ),
                ol: ({ ...props }) => (
                  <ol className="mb-2 list-decimal space-y-1 pl-5 last:mb-0" {...props} />
                ),
                li: ({ ...props }) => <li className="leading-7" {...props} />,
                code: ({ className, children, ...props }) => {
                  if (isInlineCodeNode(className, children)) {
                    return (
                      <code className="rounded-md bg-black/5 px-1.5 py-0.5 text-[0.92em]" {...props}>
                        {children}
                      </code>
                    );
                  }

                  return (
                    <pre className="mb-2 overflow-x-auto rounded-2xl border border-[color:var(--border)] bg-[#0b1020] p-4 text-sm text-white last:mb-0">
                      <code className={className} {...props}>
                        {children}
                      </code>
                    </pre>
                  );
                },
              }}
            >
              {methodContent}
            </ReactMarkdown>
          </div>
        </details>
      ) : null}
    </div>
  );
}

export default function QuerylessAssistant() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "assistant-welcome",
      role: "assistant",
      content: assistantWelcome,
    },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rateLimitMessage, setRateLimitMessage] = useState<string | null>(null);
  const [rateLimitRetryAt, setRateLimitRetryAt] = useState<number | null>(null);
  const [dailyUsageCount, setDailyUsageCount] = useState(0);
  const [viewingNotice, setViewingNotice] = useState("Viewing search");
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const previousMessageCountRef = useRef(0);
  const shouldAutoScrollRef = useRef(true);
  const streamRafRef = useRef<number | null>(null);
  const streamedAnswerRef = useRef("");
  const sessionIdRef = useRef<string>(createSessionId());
  const lastContextPathRef = useRef<string | null>(null);
  const lastContextMessageIdRef = useRef<string | null>(null);
  const hasExchangeSinceLastPageChangeRef = useRef(false);

  const context = useMemo(
    () => ({
      path: pathname,
      pageDirective: getPageDirective(pathname),
    }),
    [pathname]
  );

  useEffect(() => {
    const wasOpen = window.localStorage.getItem(QUERYLESS_OPEN_STORAGE_KEY);
    if (wasOpen === "true") {
      setIsOpen(true);
    }

    const override = window.localStorage.getItem(QUERYLESS_STORAGE_KEY);
    if (override === "false") {
      setIsOpen(false);
    }

    const { isLimited, retryAt } = getRateLimitState();
    const dailyUsage = getDailyUsageState();
    setDailyUsageCount(dailyUsage.count);
    setRateLimitRetryAt(retryAt);
    setRateLimitMessage(
      dailyUsage.isLimited
        ? `Daily limit reached: ${QUERYLESS_DAILY_LIMIT_MAX_REQUESTS} questions used today. Try again tomorrow.`
        : isLimited
          ? formatRateLimitMessage(retryAt)
          : null
    );
  }, []);

  const sendMessage = useCallback(async (questionOverride?: string) => {
    const question = (questionOverride ?? input).trim();
    if (!question || isSending) return;

    const dailyUsage = getDailyUsageState();
    if (dailyUsage.isLimited) {
      setDailyUsageCount(dailyUsage.count);
      setRateLimitMessage(
        `Daily limit reached: ${QUERYLESS_DAILY_LIMIT_MAX_REQUESTS} questions used today. Try again tomorrow.`
      );
      return;
    }

    const now = Date.now();
    const { recent, isLimited, retryAt } = getRateLimitState(now);
    if (isLimited) {
      setRateLimitRetryAt(retryAt);
      setRateLimitMessage(formatRateLimitMessage(retryAt, now));
      return;
    }

    void recent;
    hasExchangeSinceLastPageChangeRef.current = true;
    const assistantMessageId = `assistant-${Date.now()}`;

    const requestMessages: ChatMessage[] = [
      ...messages,
      {
        id: `user-${Date.now()}`,
        role: "user",
        content: question,
      },
    ];

    const nextMessages: ChatMessage[] = [
      ...requestMessages,
      {
        id: assistantMessageId,
        role: "assistant",
        content: "",
      },
    ];

    setMessages(nextMessages);
    setInput("");
    setIsSending(true);
    setError(null);

    try {
      const response = await fetch(querylessConfig.apiRoute, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
          pageDirective: context.pageDirective,
          siteUrl: window.location.origin,
          currentPath: context.path,
          stream: true,
          messages: requestMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) {
        const details = await response
          .json()
          .catch(async () => {
            const text = await response.text().catch(() => "");
            return text ? { details: text } : null;
          });
        const reason =
          details?.error || details?.details || details?.message || "Queryless request failed";
        throw new Error(`${reason} (${response.status})`);
      }

      const contentType = response.headers.get("content-type") || "";
      let answer = "";
      streamedAnswerRef.current = "";

      if (contentType.includes("text/event-stream") && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let isDone = false;
        let streamError: string | null = null;

        while (!isDone) {
          const { value, done } = await reader.read();
          if (done) break;
          if (!value) continue;

          buffer += decoder.decode(value, { stream: true });
          const events = buffer.split("\n\n");
          buffer = events.pop() || "";

          for (const event of events) {
            const lines = event
              .split("\n")
              .map((line) => line.trim())
              .filter(Boolean);

            for (const line of lines) {
              if (!line.startsWith("data:")) continue;
              const raw = line.replace(/^data:\s*/, "");
              if (raw === "[DONE]") {
                isDone = true;
                break;
              }

              try {
                const payload = JSON.parse(raw) as QuerylessPayload & { error?: unknown };
                if (payload?.error) {
                  streamError =
                    typeof payload.error === "string"
                      ? payload.error
                      : (payload.error as { message?: string })?.message || "Streaming response error";
                  continue;
                }

                const token = extractTextFromPayload(payload);
                if (!token) continue;
                answer += token;
                streamedAnswerRef.current = answer;
                if (streamRafRef.current === null) {
                  streamRafRef.current = window.requestAnimationFrame(() => {
                    const partial = maskIncompleteAuxiliaryBlocks(
                      maskIncompleteChartBlock(streamedAnswerRef.current)
                    );
                    setMessages((prev) =>
                      prev.map((message) =>
                        message.id === assistantMessageId ? { ...message, content: partial } : message
                      )
                    );
                    streamRafRef.current = null;
                  });
                }
              } catch {
                // ignore malformed frames
              }
            }
          }
        }

        if (streamError) {
          throw new Error(streamError);
        }
      } else {
        const data = (await response.json()) as QuerylessPayload;
        answer = extractTextFromPayload(data);
      }

      if (!answer || typeof answer !== "string") {
        throw new Error("Queryless response did not include a text answer");
      }

      if (streamRafRef.current !== null) {
        window.cancelAnimationFrame(streamRafRef.current);
        streamRafRef.current = null;
      }

      const successTimestamp = Date.now();
      const successRecent = getRecentQuestionTimestamps(successTimestamp);
      persistQuestionTimestamps([...successRecent, successTimestamp]);
      const successDailyUsage = getDailyUsageState();
      persistDailyUsage(successDailyUsage.dateKey, successDailyUsage.count + 1);
      setDailyUsageCount(successDailyUsage.count + 1);
      setRateLimitRetryAt(null);
      setRateLimitMessage(null);
      setMessages((prev) =>
        prev.map((message) =>
          message.id === assistantMessageId ? { ...message, content: answer } : message
        )
      );
    } catch (err) {
      if (streamRafRef.current !== null) {
        window.cancelAnimationFrame(streamRafRef.current);
        streamRafRef.current = null;
      }

      console.error("[Queryless] Chat request failed", {
        error: err,
        pageDirective: context.pageDirective,
        path: context.path,
        sessionId: sessionIdRef.current,
      });

      const message =
        err instanceof Error ? err.message : "Unexpected error when contacting Queryless";
      setMessages((prev) =>
        prev.map((item) =>
          item.id === assistantMessageId && !item.content
            ? { ...item, content: `I ran into an issue while replying: ${message}` }
            : item
        )
      );
      setError(message);
    } finally {
      setIsSending(false);
    }
  }, [context.pageDirective, context.path, input, isSending, messages]);

  useEffect(() => {
    const handleOpenQueryless = (event: Event) => {
      const customEvent = event as CustomEvent<{
        prompt?: string;
        autoSubmit?: boolean;
      }>;

      const prompt = customEvent.detail?.prompt?.trim();
      if (prompt) {
        setInput(prompt);
      }

      setIsOpen(true);
      customEvent.preventDefault();

      if (customEvent.detail?.autoSubmit && prompt) {
        window.setTimeout(() => {
          void sendMessage(prompt);
        }, 0);
      }
    };

    window.addEventListener(QUERYLESS_OPEN_EVENT, handleOpenQueryless as EventListener);
    return () => {
      window.removeEventListener(QUERYLESS_OPEN_EVENT, handleOpenQueryless as EventListener);
    };
  }, [sendMessage]);

  useEffect(() => {
    if (!rateLimitRetryAt && !rateLimitMessage) return;

    const updateRateLimit = () => {
      const { isLimited, retryAt } = getRateLimitState();
      const dailyUsage = getDailyUsageState();
      setDailyUsageCount(dailyUsage.count);
      setRateLimitRetryAt(retryAt);
      setRateLimitMessage(
        dailyUsage.isLimited
          ? `Daily limit reached: ${QUERYLESS_DAILY_LIMIT_MAX_REQUESTS} questions used today. Try again tomorrow.`
          : isLimited
            ? formatRateLimitMessage(retryAt)
            : null
      );
    };

    updateRateLimit();
    const timer = window.setInterval(updateRateLimit, 1000);
    return () => window.clearInterval(timer);
  }, [rateLimitRetryAt, rateLimitMessage]);

  useEffect(() => {
    if (!isOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const timer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    const fallback = getFallbackViewingNotice(context.pageDirective);
    setViewingNotice(fallback);

    const readTitleFromPage = () => {
      const h1 = document.querySelector("main h1, h1");
      const titleText = h1?.textContent?.trim();
      if (!titleText) return;

      if (context.pageDirective.startsWith("dataset/")) {
        setViewingNotice(`Viewing dataset ${titleText}`);
        return;
      }
      if (context.pageDirective.startsWith("resource/")) {
        setViewingNotice(`Viewing resource ${titleText}`);
        return;
      }
      if (context.pageDirective.startsWith("organization/")) {
        setViewingNotice(`Viewing organization ${titleText}`);
        return;
      }
      if (context.pageDirective.startsWith("group/")) {
        setViewingNotice(`Viewing topic ${titleText}`);
      }
    };

    const frameId = window.requestAnimationFrame(readTitleFromPage);
    const timeoutId = window.setTimeout(readTitleFromPage, 200);
    return () => {
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(timeoutId);
    };
  }, [context.pageDirective, context.path]);

  useEffect(() => {
    const currentPath = context.path;
    const currentNotice = viewingNotice;

    if (!lastContextPathRef.current) {
      const contextMessageId = `assistant-context-${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        {
          id: contextMessageId,
          role: "assistant",
          content: currentNotice,
          variant: "context",
        },
      ]);
      lastContextPathRef.current = currentPath;
      lastContextMessageIdRef.current = contextMessageId;
      hasExchangeSinceLastPageChangeRef.current = false;
      return;
    }

    if (lastContextPathRef.current !== currentPath) {
      if (hasExchangeSinceLastPageChangeRef.current) {
        const contextMessageId = `assistant-context-${Date.now()}`;
        setMessages((prev) => [
          ...prev,
          {
            id: contextMessageId,
            role: "assistant",
            content: currentNotice,
            variant: "context",
          },
        ]);
        lastContextMessageIdRef.current = contextMessageId;
      } else if (lastContextMessageIdRef.current) {
        const lastMessageId = lastContextMessageIdRef.current;
        setMessages((prev) =>
          prev.map((message) =>
            message.id === lastMessageId ? { ...message, content: currentNotice } : message
          )
        );
      }

      lastContextPathRef.current = currentPath;
      hasExchangeSinceLastPageChangeRef.current = false;
      return;
    }

    if (lastContextMessageIdRef.current) {
      const lastMessageId = lastContextMessageIdRef.current;
      setMessages((prev) =>
        prev.map((message) =>
          message.id === lastMessageId ? { ...message, content: currentNotice } : message
        )
      );
    }
  }, [context.path, viewingNotice]);

  useEffect(() => {
    const didAddNewMessage = messages.length > previousMessageCountRef.current;
    if (!shouldAutoScrollRef.current && !didAddNewMessage) {
      previousMessageCountRef.current = messages.length;
      return;
    }

    const container = messagesContainerRef.current;
    if (!container) {
      previousMessageCountRef.current = messages.length;
      return;
    }

    container.scrollTop = container.scrollHeight;
    previousMessageCountRef.current = messages.length;
  }, [messages, isSending]);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("queryless-drawer-open");
      window.localStorage.setItem(QUERYLESS_OPEN_STORAGE_KEY, "true");
      return;
    }

    document.body.classList.remove("queryless-drawer-open");
    window.localStorage.setItem(QUERYLESS_OPEN_STORAGE_KEY, "false");
  }, [isOpen]);

  useEffect(
    () => () => {
      document.body.classList.remove("queryless-drawer-open");
      if (streamRafRef.current !== null) {
        window.cancelAnimationFrame(streamRafRef.current);
        streamRafRef.current = null;
      }
    },
    []
  );

  const clearChat = () => {
    const contextMessageId = `assistant-context-${Date.now()}`;
    setMessages([
      {
        id: "assistant-welcome",
        role: "assistant",
        content: assistantWelcome,
      },
      {
        id: contextMessageId,
        role: "assistant",
        content: viewingNotice,
        variant: "context",
      },
    ]);
    sessionIdRef.current = createSessionId();
    lastContextMessageIdRef.current = contextMessageId;
    hasExchangeSinceLastPageChangeRef.current = false;
    setError(null);
    setRateLimitMessage(null);
    setInput("");
  };


  return (
    <>
      <Button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 z-[60] h-12 rounded-full px-4 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.5)]"
      >
        <Sparkles className="size-4" />
        Ask AI
      </Button>

      {isOpen ? (
        <>
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Queryless AI"
            className="fixed bottom-4 right-4 z-[70] flex h-[min(88vh,52rem)] w-[min(92vw,34rem)] flex-col overflow-hidden rounded-[28px] border border-[color:var(--border)] bg-white shadow-[0_30px_80px_-36px_rgba(15,23,42,0.6)]"
          >
            <div className="flex items-start justify-between gap-4 border-b border-[color:var(--border)] px-5 py-4">
              <div className="min-w-0 space-y-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MessageSquareText className="size-5 text-[color:var(--brand-accent)]" />
                  Queryless AI
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Ask in plain English about this portal and the page you’re viewing.
                </p>
             
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearChat}
                  aria-label="Clear chat"
                  className="panel-icon-button"
                >
                  <Trash2 className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close Queryless assistant"
                  className="panel-icon-button"
                >
                  <X className="size-4" />
                </Button>
              </div>
            </div>

            <div
              ref={messagesContainerRef}
              onScroll={(event) => {
                const container = event.currentTarget;
                const distanceFromBottom =
                  container.scrollHeight - container.scrollTop - container.clientHeight;
                shouldAutoScrollRef.current = distanceFromBottom < 56;
              }}
              className="flex-1 space-y-3 overflow-y-auto bg-[linear-gradient(180deg,rgba(15,23,42,0.015),rgba(15,23,42,0.0))] px-5 py-4"
            >
              {messages.map((message) => {
                const isEmptyAssistantMessage =
                  message.role === "assistant" && message.variant !== "context" && !message.content.trim();

                if (isEmptyAssistantMessage) {
                  return null;
                }

                const isChartMessage =
                  message.role === "assistant" &&
                  (message.content.includes("```chart") || message.content.includes("```vega"));

                return (
                  <div
                    key={message.id}
                    className={
                      message.variant === "context"
                        ? "mx-auto w-fit rounded-full border border-[color:var(--border)] bg-white px-3 py-1 text-xs text-muted-foreground"
                        : `${isChartMessage ? "w-full" : "max-w-[90%]"} ${
                            message.role === "assistant"
                              ? "rounded-2xl border border-[color:var(--border)] bg-white px-4 py-3 text-sm text-foreground"
                              : "ml-auto rounded-2xl bg-[color:var(--brand-accent)] px-4 py-3 text-sm text-[color:var(--brand-accent-foreground)]"
                          }`
                    }
                  >
                    {message.role === "assistant" && message.variant !== "context" ? (
                      <MarkdownContent content={message.content} />
                    ) : (
                      message.content
                    )}
                  </div>
                );
              })}

              {isSending ? (
                <div className="max-w-[90%] rounded-2xl border border-[color:var(--border)] bg-white px-4 py-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1" aria-hidden="true">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[color:var(--brand-accent)] [animation-delay:-0.2s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[color:var(--brand-accent)] [animation-delay:-0.1s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[color:var(--brand-accent)]" />
                    </span>
                    <span>Thinking...</span>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="border-t border-[color:var(--border)] bg-white px-5 py-4">
              {error ? <p className="mb-2 text-sm text-destructive">{error}</p> : null}
              {rateLimitMessage ? (
                <p className="mb-2 text-sm text-amber-700">{rateLimitMessage}</p>
              ) : null}

              <div className="mb-3">
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getDailyUsagePillClassName(
                    dailyUsageCount
                  )}`}
                >
                  Daily questions: {dailyUsageCount} / {QUERYLESS_DAILY_LIMIT_MAX_REQUESTS}
                </span>
              </div>

              <div className="flex items-end gap-2">
                <Textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about this page or your data..."
                  className="min-h-24 resize-none rounded-2xl border-[color:var(--border)] bg-white"
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      void sendMessage();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={() => void sendMessage()}
                  disabled={isSending || !input.trim() || Boolean(rateLimitMessage)}
                  className="h-12 shrink-0 rounded-2xl px-4"
                >
                  Send
                  <ChevronDown className="size-4 rotate-[-90deg]" />
                </Button>
              </div>

              <p className="mt-3 text-center text-xs text-muted-foreground">
                Queryless AI can make mistakes. Use it as a helpful guide, not a
                source of truth.{" "}
                <Link
                  href="/ai-terms-of-use"
                  className="font-medium underline underline-offset-4 inline-block"
                >
                  AI Terms of Use
                </Link>
              </p>
            </div>
          </aside>
        </>
      ) : null}
    </>
  );
}
