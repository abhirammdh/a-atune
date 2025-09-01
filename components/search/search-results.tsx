"use client"

import useSWR from "swr"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import type { NormalizedSong } from "@/components/player/player-context"
import TrackList from "@/components/track-list"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function toArray(payload: any): any[] {
  if (Array.isArray(payload)) return payload
  if (!payload || typeof payload !== "object") return []
  const keys = ["data", "items", "results", "tracks", "songs", "playlists", "albums", "result", "records", "list"]
  for (const key of keys) {
    const v = (payload as any)[key]
    if (Array.isArray(v)) return v
    if (v && typeof v === "object") {
      // one level deeper (e.g., { data: { songs: [...] } })
      for (const k of keys) {
        const vv = (v as any)[k]
        if (Array.isArray(vv)) return vv
      }
    }
  }
  return []
}

// Parse durations like "03:15" or "3:15"
function parseDuration(input: any): number | undefined {
  if (typeof input === "number") {
    return input > 1000 ? Math.round(input / 1000) : Math.round(input)
  }
  if (typeof input === "string") {
    const m = input.match(/^(\d{1,2}):([0-5]\d)$/)
    if (m) {
      const mins = Number.parseInt(m[1], 10)
      const secs = Number.parseInt(m[2], 10)
      return mins * 60 + secs
    }
    const asNum = Number(input)
    if (!Number.isNaN(asNum)) return parseDuration(asNum)
  }
  return undefined
}

function looksAudioUrl(u: string) {
  return (
    /\.(mp3|m4a|aac|ogg|wav)(\?|#|$)/i.test(u) || u.toLowerCase().includes("mp3") || u.toLowerCase().includes("audio")
  )
}

function pickBestAudio(item: any): string | undefined {
  const cand: Array<unknown> = []

  // arrays like [{quality:"320kbps", url:"..."}, {...}] or [{link:"..."}]
  if (Array.isArray(item?.downloadUrl)) {
    for (const it of item.downloadUrl) {
      if (!it) continue
      if (typeof it === "string") cand.push(it)
      if (typeof it === "object") {
        const u = (it.url || it.link || it.href) as string | undefined
        if (u) cand.push(u)
      }
    }
  }

  // flat fields
  cand.push(
    item?.audioUrl,
    item?.audio,
    item?.stream_url,
    item?.streamUrl,
    item?.mp3Url,
    item?.media_url,
    item?.media?.url,
    item?.audio?.url,
    item?.preview_url,
    item?.previewUrl,
    item?.songUrl,
    item?.song_url,
    item?.streams?.[0]?.url,
    item?.links?.stream,
  )

  // Only accept plausible audio urls
  const strings = cand.filter((u) => typeof u === "string") as string[]
  // Prefer higher quality by simple heuristic (320 > 160 > 128)
  strings.sort((a, b) => {
    const score = (x: string) => (x.includes("320") ? 3 : x.includes("160") ? 2 : x.includes("128") ? 1 : 0)
    return score(b) - score(a)
  })

  const hit = strings.find((u) => looksAudioUrl(u))
  return hit
}

function isPlayableUrl(u: unknown): u is string {
  return typeof u === "string" && (u.startsWith("/api/media?src=") || looksAudioUrl(u) || u.startsWith("/"))
}

function normalizeSong(item: any): NormalizedSong {
  const id = String(item?.id ?? item?.trackId ?? item?.uid ?? item?.url ?? crypto.randomUUID())
  const title = item?.title ?? item?.name ?? item?.trackName ?? "Unknown Title"

  const artist =
    item?.artist ??
    item?.primaryArtists ?? // from your API
    item?.artistName ??
    item?.artist?.name ??
    item?.artists?.[0]?.name ??
    item?.artists?.[0]?.title ??
    item?.owner?.name ??
    item?.album?.artist ??
    item?.album?.artistName ??
    item?.album?.artists?.[0]?.name ??
    "Unknown Artist"

  let imageUrl =
    item?.imageUrl ??
    (Array.isArray(item?.image) ? item?.image?.[1]?.link || item?.image?.[1]?.url : undefined) ??
    item?.image ??
    item?.thumb ??
    item?.poster ??
    item?.cover ??
    item?.coverUrl ??
    item?.cover_medium ??
    item?.cover_big ??
    item?.thumbnail ??
    item?.thumbnailUrl ??
    item?.artwork ??
    item?.artworkUrl ??
    item?.artworkUrl60 ??
    item?.artworkUrl100 ??
    item?.artworkUrl512 ??
    item?.album?.image ??
    item?.album?.cover ??
    item?.album?.coverUrl ??
    item?.album?.thumbnailUrl ??
    item?.album?.artworkUrl ??
    item?.album?.images?.[0]?.url

  if (typeof imageUrl === "string") {
    imageUrl = imageUrl.replace(/150x150/gi, "500x500")
  }

  let audioUrl: string | undefined = typeof item?.src === "string" ? (item.src as string) : undefined

  if (!audioUrl && Array.isArray(item?.downloadUrl) && item.downloadUrl[0]?.url) {
    const upstream = item.downloadUrl[0].url as string
    audioUrl = `/api/media?src=${encodeURIComponent(upstream)}`
  }

  if (!audioUrl) {
    const best = pickBestAudio(item)
    audioUrl = best ? `/api/media?src=${encodeURIComponent(best)}` : undefined
  }

  const durationSec =
    typeof item?.durationSec === "number"
      ? Math.round(item.durationSec)
      : typeof item?.duration_ms === "number"
        ? Math.round(item.duration_ms / 1000)
        : parseDuration(item?.duration)

  return { id, title, artist, imageUrl, audioUrl, durationSec }
}

function TrackSongs({ items }: { items: unknown }) {
  const base = toArray(items)
  const songs: NormalizedSong[] = base.map(normalizeSong)
  if (!songs.length) {
    return <div className="text-sm text-muted-foreground">No songs found.</div>
  }
  return <TrackList tracks={songs} />
}

function GridCards({ items, type }: { items: unknown; type: "playlists" | "albums" }) {
  const list = toArray(items)
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {list.map((it: any, idx: number) => {
        const title = it?.title ?? it?.name ?? "Untitled"
        const subtitle =
          type === "playlists"
            ? (it?.owner?.name ?? it?.owner?.display_name ?? "Playlist")
            : (it?.primaryArtists ??
              it?.artist ??
              it?.artistName ??
              it?.artist?.name ??
              it?.artists?.[0]?.name ??
              "Album")

        let imageUrl: string | undefined =
          type === "albums" && Array.isArray(it?.image) ? it.image?.[1]?.link || it.image?.[1]?.url : undefined
        if (!imageUrl) imageUrl = it?.imageUrl
        if (!imageUrl) {
          imageUrl =
            it?.image ||
            it?.thumb ||
            it?.poster ||
            it?.cover ||
            it?.coverUrl ||
            it?.cover_medium ||
            it?.cover_big ||
            it?.thumbnail ||
            it?.thumbnailUrl ||
            it?.artwork ||
            it?.artworkUrl ||
            it?.images?.[0]?.url
        }

        return (
          <Card key={it?.id ?? idx} className="bg-card transition-colors hover:bg-accent/10">
            <CardContent className="p-3">
              <div className="aspect-square w-full overflow-hidden rounded bg-secondary">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl || "/placeholder.svg?height=300&width=300&query=cover%20art%20placeholder"}
                  alt={title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="mt-3">
                <div className="truncate text-sm font-medium">{title}</div>
                <div className="truncate text-xs text-muted-foreground">{subtitle}</div>
              </div>
            </CardContent>
          </Card>
        )
      })}
      {list.length === 0 && <div className="col-span-full text-sm text-muted-foreground">No {type} found.</div>}
    </div>
  )
}

export default function SearchResults({ query }: { query: string }) {
  const shouldFetch = query.trim().length > 1
  const { data: sData, isLoading: sLoad } = useSWR(
    shouldFetch ? `/api/search/songs?query=${encodeURIComponent(query)}` : null,
    fetcher,
  )
  const { data: pData, isLoading: pLoad } = useSWR(
    shouldFetch ? `/api/search/playlists?query=${encodeURIComponent(query)}` : null,
    fetcher,
  )
  const { data: aData, isLoading: aLoad } = useSWR(
    shouldFetch ? `/api/search/albums?query=${encodeURIComponent(query)}` : null,
    fetcher,
  )

  const songs = toArray(sData?.data)
  const playlists = toArray(pData?.data)
  const albums = toArray(aData?.data)

  return (
    <Tabs defaultValue="songs" className="mt-4">
      <TabsList className="bg-card">
        <TabsTrigger value="songs">Songs</TabsTrigger>
        <TabsTrigger value="playlists">Playlists</TabsTrigger>
        <TabsTrigger value="albums">Albums</TabsTrigger>
      </TabsList>

      <TabsContent value="songs" className="mt-4">
        {sLoad ? <div className="text-sm text-muted-foreground">Loading songs…</div> : <TrackSongs items={songs} />}
      </TabsContent>
      <TabsContent value="playlists" className="mt-4">
        {pLoad ? (
          <div className="text-sm text-muted-foreground">Loading playlists…</div>
        ) : (
          <GridCards items={playlists} type="playlists" />
        )}
      </TabsContent>
      <TabsContent value="albums" className="mt-4">
        {aLoad ? (
          <div className="text-sm text-muted-foreground">Loading albums…</div>
        ) : (
          <GridCards items={albums} type="albums" />
        )}
      </TabsContent>
    </Tabs>
  )
}
