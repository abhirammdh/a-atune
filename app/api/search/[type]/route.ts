import { NextResponse } from "next/server"

const BASE = "https://devplay-ashy.vercel.app/api/search"


// Simple server-side normalizer to guarantee an array
function toArray(payload: any): any[] {
  if (Array.isArray(payload)) return payload
  if (!payload || typeof payload !== "object") return []
  const keys = ["data", "items", "results", "tracks", "songs", "playlists", "albums", "result", "records", "list"]
  for (const key of keys) {
    const v = (payload as any)[key]
    if (Array.isArray(v)) return v
    if (v && typeof v === "object") {
      for (const k of keys) {
        const vv = (v as any)[k]
        if (Array.isArray(vv)) return vv
      }
    }
  }
  return []
}

function pickDownloadUrl(input: any): string | null {
  if (!input) return null
  if (typeof input === "string") return input
  if (Array.isArray(input)) {
    const candidates = input
      .map((v) => {
        if (typeof v === "string") return v
        if (v && typeof v === "object") {
          return (v.url as string) || (v.link as string) || null
        }
        return null
      })
      .filter(Boolean) as string[]
    return candidates.length ? candidates[0] : null
  }
  if (typeof input === "object") {
    return (input.url as string) || (input.link as string) || null
  }
  return null
}

function pickImageUrl(images: any): string | null {
  if (!images) return null
  if (Array.isArray(images)) {
    const idx1 = images[1]?.link || images[1]?.url
    if (idx1) return idx1 as string
    const firstWithLink = images.find((im: any) => im?.link || im?.url)
    if (firstWithLink) return (firstWithLink.link as string) || (firstWithLink.url as string)
  }
  if (typeof images === "object") {
    return (images.link as string) || (images.url as string) || null
  }
  if (typeof images === "string") return images
  return null
}

function normalizeSong(item: any) {
  const originalSrc = pickDownloadUrl(item?.downloadUrl) || null
  const imageUrl = pickImageUrl(item?.image) || null
  const artist = (item?.primaryArtists as string) || ""
  const title = (item?.title as string) || (item?.name as string) || "Unknown"

  // Always proxy through /api/media to support CORS + Range seeking
  const src = originalSrc ? `/api/media?src=${encodeURIComponent(originalSrc)}` : null

  return {
    id: item?.id ?? item?._id ?? item?.songid ?? crypto.randomUUID(),
    title,
    artist,
    imageUrl,
    src,
    originalSrc,
    raw: item,
  }
}

export async function GET(req: Request, { params }: { params: { type: string } }) {
  const { type } = params
  const url = new URL(req.url)
  const q = url.searchParams.get("query") || ""

  const allowed = new Set(["songs", "playlists", "albums"])
  if (!allowed.has(type)) {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 })
  }

  if (!q.trim()) {
    return NextResponse.json({ data: [], query: q })
  }

  try {
    const upstream = `${BASE}/${type}?query=${encodeURIComponent(q)}`
    const res = await fetch(upstream, { headers: { accept: "application/json" } })
    if (!res.ok) {
      return NextResponse.json({ error: "Upstream error", status: res.status }, { status: 502 })
    }
    const raw = await res.json()
    const data = toArray(raw)

    if (type === "songs") {
      const normalized = data.map(normalizeSong)
      return NextResponse.json({ data: normalized, query: q })
    }

    // Normalize albums to expose album art from image[1].link and artist
    if (type === "albums") {
      const normalizedAlbums = data.map((item: any) => ({
        ...item,
        imageUrl: pickImageUrl(item?.image) || item?.imageUrl || null,
        artist: item?.primaryArtists || item?.artist || item?.artistName || null,
      }))
      return NextResponse.json({ data: normalizedAlbums, query: q })
    }

    // For playlists, return as-is for now
    return NextResponse.json({ data, query: q })
  } catch (e) {
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 })
  }
}
