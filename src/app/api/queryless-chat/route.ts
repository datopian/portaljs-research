import { NextRequest, NextResponse } from "next/server";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type RequestBody = {
  messages?: ChatMessage[];
  pageDirective?: string;
  sessionId?: string;
  siteUrl?: string;
  currentPath?: string;
  stream?: boolean;
};

function getRequiredEnv(name: "QUERYLESS_URL" | "QUERYLESS_TOKEN" | "QUERYLESS_MODEL") {
  const value = process.env[name];
  return value?.trim() ? value.trim() : null;
}

export async function POST(req: NextRequest) {
  const querylessUrl = getRequiredEnv("QUERYLESS_URL");
  const querylessToken = getRequiredEnv("QUERYLESS_TOKEN");
  const querylessModel = getRequiredEnv("QUERYLESS_MODEL");
  const portalUrl = process.env.NEXT_PUBLIC_DMS || "";

  if (!querylessUrl) {
    return NextResponse.json(
      { error: "Missing QUERYLESS_URL server environment variable" },
      { status: 500 }
    );
  }

  if (!querylessToken) {
    return NextResponse.json(
      { error: "Missing QUERYLESS_TOKEN server environment variable" },
      { status: 500 }
    );
  }

  if (!querylessModel) {
    return NextResponse.json(
      { error: "Missing QUERYLESS_MODEL server environment variable" },
      { status: 500 }
    );
  }

  let body: RequestBody;

  try {
    body = (await req.json()) as RequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const {
    messages = [],
    pageDirective = "search",
    sessionId,
    siteUrl: rawSiteUrl = "",
    currentPath = "",
    stream = false,
  } = body;

  if (!Array.isArray(messages)) {
    return NextResponse.json(
      { error: "Invalid request: messages must be an array" },
      { status: 400 }
    );
  }

  const siteUrl =
    typeof rawSiteUrl === "string" && rawSiteUrl.trim()
      ? rawSiteUrl.trim()
      : process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";

  const routesBlock = [
    "Routes:",
    "  dataset: /@{org}/{name}",
    "  resource: /@{org}/{dataset}/r/{resource}",
    "  organization: /@{name}",
    "  group: /groups/{name}",
    "  search: /search",
  ].join("\n");

  try {
    const upstream = await fetch(querylessUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${querylessToken}`,
      },
      body: JSON.stringify({
        model: querylessModel,
        stream: Boolean(stream),
        user: sessionId,
        messages: [
          {
            role: "system",
            content: `Portal: ${portalUrl}\nSite: ${siteUrl}\nPage: ${pageDirective}\nCurrentPath: ${currentPath}\n${routesBlock}`,
          },
          ...messages,
        ],
      }),
    });

    if (stream) {
      if (!upstream.ok || !upstream.body) {
        const details = await upstream.text();
        return NextResponse.json(
          {
            error: "Queryless upstream request failed",
            details,
          },
          { status: upstream.status || 502 }
        );
      }

      return new NextResponse(upstream.body, {
        status: upstream.status,
        headers: {
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          Connection: "keep-alive",
          "X-Accel-Buffering": "no",
        },
      });
    }

    const contentType = upstream.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await upstream.json()
      : await upstream.text();

    if (!upstream.ok) {
      return NextResponse.json(
        {
          error: "Queryless upstream request failed",
          details: data,
        },
        { status: upstream.status || 502 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("[Queryless API] Unexpected error while contacting Queryless", {
      error,
      pageDirective,
      currentPath,
    });

    return NextResponse.json(
      { error: "Unexpected error while contacting Queryless" },
      { status: 500 }
    );
  }
}
