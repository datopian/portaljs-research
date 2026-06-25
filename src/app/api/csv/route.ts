import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  try {
    const upstream = await fetch(url);

    if (!upstream.ok) {
      return new NextResponse(`Upstream error: ${upstream.statusText}`, {
        status: upstream.status,
      });
    }

    const text = await upstream.text();

    return new NextResponse(text, {
      headers: {
        "Content-Type": "text/csv",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    return new NextResponse(`Failed to fetch: ${String(error)}`, {
      status: 502,
    });
  }
}
