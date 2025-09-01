"use client"

import useSWR from "swr"
import { useMemo, useRef, useState } from "react"
import { cn } from "@/lib/utils"

type RawItem = Record<string, any>
type Track = {
  title: string
  artist: string
  image?: string
  src?: string
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function toArray(data: any): any[] {
  if (Array.isArray(data)) return data
  if (!data || typeof data !== "object") return []
  const candidates = [data.data, data.items, data.results, data.tracks, data.songs]
  for (const c of candidates) if (Array.isArray(c)) return c
  return []
}

function pick(obj: any, keys: string[]): any {
  for (const k of keys) {
    const path = k.split(".")
    let cur = obj
    for (const seg of path) {
      if (cur && typeof cur === "object" && seg in cur) cur = cur[seg]
      else {
        cur = undefined
        break
      }
    }
    if (cur != null) return cur
  }
  return undefined
}

function normalizeTrack(item: RawItem): Track {
  const title = item.title ?? item.name ?? pick(item, ["trackName", "snippet.title"]) ?? "Unknown Title"

  const artist =
    item.artist ??
    item.artistName ??
    (Array.isArray(item.artists) && item.artists[0]?.name) ??
    pick(item, ["owner.display_name", "owner.name", "channelTitle", "uploader"]) ??
    "Unknown Artist"

  const image =
    item.image ??
    item.thumbnail ??
    item.coverUrl ??
    item.artworkUrl512 ??
    item.artworkUrl100 ??
    pick(item, ["images.0.url", "thumbnails.0.url", "thumbnailUrl", "album.images.0.url", "album.cover"]) ??
    "/placeholder.svg?height=64&width=64"

  const directAudio =
    item.audioUrl ??
    item.streamUrl ??
    item.preview_url ??
    item.previewUrl ??
    item.url ??
    item.playUrl ??
    item.downloadUrl ??
    pick(item, ["source.url", "track.url", "stream.url"])

  const hasHttp = typeof directAudio === "string" && /^https?:\/\//.test(directAudio)
  const src = hasHttp ? `/api/media?url=${encodeURIComponent(directAudio)}` : undefined

  return { title, artist, image, src }
}

export default function HomeSimplePlayer() {
  const [query, setQuery] = useState("")
  const [submitted, setSubmitted] = useState("")
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [current, setCurrent] = useState<Track | null>(null)
  const [msg, setMsg] = useState<string | null>(null)

  const url =
    submitted.trim().length > 0
      ? `https://apiip-three.vercel.app/api/search/songs?query=${encodeURIComponent(submitted.trim())}`
      : null

  const { data, error, isLoading } = useSWR(url, fetcher, { revalidateOnFocus: false })

  const items: Track[] = useMemo(() => {
    const arr = toArray(data)
    return arr.map(normalizeTrack).filter(Boolean)
  }, [data])

  async function onPlay(t: Track) {
    setMsg(null)
    setCurrent(t)
    if (!t.src) {
      setMsg("No playable source on this result. Try another query.")
      return
    }
    const audio = audioRef.current
    if (!audio) return
    try {
      audio.src = t.src
      audio.crossOrigin = "anonymous"
      audio.preload = "auto"
      audio.load()
      await audio.play()
    } catch (e: any) {
      setMsg(`Playback failed: ${e?.message || "unknown error"}`)
    }
  }

  return (
    <section className="mx-auto w-full max-w-xl p-4 md:p-6">
      <header className="mb-4">
        <h1 className="text-pretty text-xl font-semibold">Search Songs</h1>
        <p className="text-sm text-muted-foreground">
          Type and press Play on a result. Uses an audio proxy for reliable playback.
        </p>
      </header>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          setSubmitted(query)
        }}
        className="flex items-center gap-2"
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Try "weekend"'
          className={cn(
            "flex-1 rounded-md border bg-background px-3 py-2 text-sm outline-none",
            "border-input focus-visible:ring-2 focus-visible:ring-primary",
          )}
          aria-label="Search query"
        />
        <button type="submit" className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">
          Search
        </button>
      </form>

      {isLoading && <p className="mt-4 text-sm text-muted-foreground">Searching…</p>}
      {error && <p className="mt-4 text-sm text-destructive">Error: {(error as any)?.message || "Failed"}</p>}
      {msg && <p className="mt-4 text-sm text-destructive">{msg}</p>}

      <ul className="mt-6 space-y-3">
        {items.length === 0 && submitted && !isLoading ? (
          <li className="text-sm text-muted-foreground">No results.</li>
        ) : null}

        {items.map((t, idx) => (
          <li key={`${t.title}-${idx}`} className="flex items-center gap-3 rounded-lg border border-border bg-card p-2">
            <img
              src={t.image || "/placeholder.svg?height=64&width=64&query=album%20art"}
              alt={`${t.title} cover`}
              className="h-12 w-12 flex-none rounded object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{t.title}</p>
              <p className="truncate text-xs text-muted-foreground">{t.artist}</p>
            </div>
            <button
              onClick={() => onPlay(t)}
              className="flex-none rounded-md bg-foreground/10 px-3 py-1.5 text-xs hover:bg-foreground/20"
            >
              Play
            </button>
          </li>
        ))}
      </ul>

      <audio ref={audioRef} className="mt-4 w-full" controls />
      {current ? (
        <p className="mt-2 text-xs text-muted-foreground">
          Now playing: <span className="font-medium">{current.title}</span> — {current.artist}
        </p>
      ) : null}
    </section>
  )
}
