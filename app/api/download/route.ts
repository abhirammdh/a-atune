export async function GET(req: Request) {
  const url = new URL(req.url)
  const src = url.searchParams.get("src")
  const filename = (url.searchParams.get("filename") || "track.mp3").replace(/["/\\]/g, "")
  if (!src || !/^https?:\/\//i.test(src)) return new Response("Missing or invalid src", { status: 400 })

  const upstream = await fetch(src, { cache: "no-store", redirect: "follow" })
  if (!upstream.ok || !upstream.body) {
    return new Response("Upstream failed", { status: upstream.status || 502 })
  }
  const headers = new Headers()
  headers.set("content-type", upstream.headers.get("content-type") || "audio/mpeg")
  headers.set("content-disposition", `attachment; filename="${filename}"`)
  headers.set("cache-control", "no-store")
  return new Response(upstream.body, { status: 200, headers })
}
