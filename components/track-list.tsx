"use client"

import { Button } from "@/components/ui/button"
import { usePlayer, type NormalizedSong } from "@/components/player/player-context"

function isAudioLike(u: string) {
  return (
    /\.(mp3|m4a|aac|ogg|wav)(\?|#|$)/i.test(u) || u.toLowerCase().includes("mp3") || u.startsWith("/api/media?src=")
  )
}

function TrackList({ tracks }: { tracks: NormalizedSong[] }) {
  const p = usePlayer()
  if (!tracks?.length) return <div className="text-sm text-muted-foreground">No tracks.</div>

  const canPlay = (x?: string) => typeof x === "string" && isAudioLike(x)

  function recordDownload(track: NormalizedSong, url: string) {
    try {
      const key = "downloads:list"
      const prev = JSON.parse(localStorage.getItem(key) || "[]") as any[]
      prev.unshift({
        id: track.id,
        title: track.title,
        artist: track.artist,
        imageUrl: track.imageUrl,
        url,
        at: Date.now(),
      })
      localStorage.setItem(key, JSON.stringify(prev.slice(0, 100)))
    } catch {}
  }

  return (
    <div className="grid gap-2">
      {tracks.map((s, i) => {
        const playable = canPlay(s.audioUrl)
        let originalSrc: string | undefined = s.audioUrl
        try {
          if (originalSrc?.startsWith("/api/media?")) {
            const u = new URL(originalSrc, typeof window !== "undefined" ? window.location.origin : "http://localhost")
            originalSrc = u.searchParams.get("src") || undefined
          }
        } catch {}
        const downloadHref = originalSrc
          ? `/api/download?src=${encodeURIComponent(originalSrc)}&filename=${encodeURIComponent(
              `${s.title || "track"}.mp3`,
            )}`
          : undefined

        const isCurrent = p.queue[p.index]?.id === s.id

        return (
          <div
            key={`${s.id}-${i}`}
            className="group flex items-center justify-between rounded-md border border-border bg-card px-3 py-2 hover:bg-accent/10"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="h-10 w-10 shrink-0 overflow-hidden rounded bg-secondary">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.imageUrl || "/placeholder.svg?height=80&width=80&query=album%20artwork%20placeholder"}
                  alt={s.title || "Track cover"}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">{s.title || "Unknown Title"}</div>
                <div className="truncate text-xs text-muted-foreground">{s.artist || "Unknown Artist"}</div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                size="icon"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={!playable}
                aria-label={isCurrent && p.isPlaying ? "Pause" : "Play"}
                onClick={() => {
                  const playableQueue = tracks.filter((x) => canPlay(x.audioUrl))
                  if (!playableQueue.length) return
                  // If current track clicked, toggle; else load full queue starting at selected index
                  if (isCurrent) {
                    p.toggle()
                    return
                  }
                  let startIdx = playableQueue.findIndex((x) => x.id === s.id)
                  if (startIdx < 0) startIdx = 0
                  p.loadQueue(playableQueue, startIdx)
                  setTimeout(() => p.play(), 0)
                }}
                title={isCurrent && p.isPlaying ? "Pause" : "Play"}
              >
                {isCurrent && p.isPlaying ? (
                  // Pause icon (inline SVG); can replace with Flaticon asset later
                  <svg width="18" height="18" viewBox="0 0 24 24" className="fill-current">
                    <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
                  </svg>
                ) : (
                  // Play icon (triangle)
                  <svg width="18" height="18" viewBox="0 0 24 24" className="fill-current">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </Button>

              {/* Add to queue (+) */}
              <Button
                variant="ghost"
                size="icon"
                aria-label="Add to queue"
                title="Add to queue"
                onClick={() => p.addToQueue(s)}
              >
                {/* Plus icon (stroke) */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="stroke-current">
                  <path d="M12 5v14M5 12h14" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </Button>

              {/* Download icon */}
              <Button
                variant="outline"
                size="icon"
                aria-label="Download"
                title="Download"
                disabled={!downloadHref}
                onClick={() => {
                  if (!downloadHref) return
                  recordDownload(s, downloadHref)
                  window.open(downloadHref, "_blank", "noreferrer")
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" className="fill-current">
                  <path d="M5 20h14v-2H5v2zM11 4h2v8h3l-4 4-4-4h3V4z" />
                </svg>
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default TrackList
