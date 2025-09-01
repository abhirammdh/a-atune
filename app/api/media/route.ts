import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)

    // Accept both ?src and ?url for compatibility
    let srcParam = url.searchParams.get("src") || url.searchParams.get("url") || ""
    if (!srcParam) {
      return NextResponse.json({ error: "Missing src" }, { status: 400 })
    }

    // Decode if it was encoded
    try {
      srcParam = decodeURIComponent(srcParam)
    } catch {
      // ignore decode errors and use as-is
    }

    // Validate and ensure http(s)
    let target: URL
    try {
      target = new URL(srcParam)
    } catch {
      return NextResponse.json({ error: "Invalid src" }, { status: 400 })
    }
    if (target.protocol !== "http:" && target.protocol !== "https:") {
      return NextResponse.json({ error: "Unsupported protocol" }, { status: 400 })
    }

    // Forward Range to support seeking
    const range = req.headers.get("range") || undefined

    // Add timeout to avoid hanging requests
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 20000) // 20s
    let upstream: Response
    try {
      upstream = await fetch(target.toString(), {
        headers: {
          ...(range ? { Range: range } : {}),
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
          Accept: "audio/*,application/octet-stream,*/*;q=0.8",
          Referer: `${target.origin}/`,
          Origin: target.origin,
        },
        redirect: "follow",
        cache: "no-store",
        signal: controller.signal,
      })
    } finally {
      clearTimeout(timeout)
    }

    if (!upstream.ok || !upstream.body) {
      return NextResponse.json(
        { error: "Upstream fetch failed", status: upstream.status, url: target.toString() },
        { status: 502 },
      )
    }

    // Preserve important streaming headers
    const headers = new Headers()
    const pass = [
      "content-type",
      "content-length",
      "accept-ranges",
      "content-range",
      "content-disposition",
      "etag",
      "last-modified",
    ]
    for (const key of pass) {
      const val = upstream.headers.get(key)
      if (val) headers.set(key, val)
    }

    // Fallbacks
    if (!headers.has("content-type")) {
      headers.set("content-type", "audio/mpeg")
    }
    if (!headers.has("accept-ranges")) {
      headers.set("accept-ranges", "bytes")
    }

    // Avoid caching in preview; tweak if you want CDN cache
    headers.set("cache-control", "no-store")

    return new Response(upstream.body, {
      status: upstream.status,
      headers,
    })
  } catch (err: any) {
    // Return clean errors rather than throwing (prevents unhandled rejections)
    const isAbort = err?.name === "AbortError"
    const message = isAbort ? "Upstream timeout" : err?.message || "Fetch error"
    const status = isAbort ? 504 : 502
    return NextResponse.json({ error: message }, { status })
  }
}
