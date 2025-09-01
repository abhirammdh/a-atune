"use client"

import { usePlayer } from "./player-context"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

function fmt(t: number) {
  if (!Number.isFinite(t)) return "0:00"
  const m = Math.floor(t / 60)
  const s = Math.floor(t % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}

export default function PlayerBar() {
  const p = usePlayer()
  const current = p.queue[p.index]

  return (
    <>
      {p.isFullscreen ? (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur">
          <div className="mx-auto flex h-full max-w-3xl flex-col items-center justify-center gap-6 px-6">
            <div className="w-full max-w-sm overflow-hidden rounded-xl border border-border bg-card p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  current?.imageUrl ||
                  "/placeholder.svg?height=600&width=600&query=album%20artwork%20large" ||
                  "/placeholder.svg" ||
                  "/placeholder.svg"
                }
                alt={current?.title ? `Cover of ${current.title}` : "Track cover"}
                className="h-auto w-full object-cover"
              />
            </div>
            <div className="text-center">
              <div className="text-balance text-2xl font-semibold">{current?.title || "Nothing playing"}</div>
              <div className="mt-1 text-muted-foreground">{current?.artist || ""}</div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" aria-label="Previous" onClick={p.prev}>
                <svg width="28" height="28" viewBox="0 0 24 24" className="fill-current">
                  <path d="M6 6h2v12H6zM9.5 12l8.5 6V6z" />
                </svg>
              </Button>
              <Button
                size="icon"
                aria-label={p.isPlaying ? "Pause" : "Play"}
                onClick={p.toggle}
                className="h-12 w-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                title="Play/Pause"
              >
                {/* Note: You asked for Flaticon play/pause by Hilmy Abiyyu A. Provide SVG to swap here. */}
                {p.isPlaying ? (
                  <svg width="28" height="28" viewBox="0 0 24 24" className="fill-current">
                    <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
                  </svg>
                ) : (
                  <svg width="28" height="28" viewBox="0 0 24 24" className="fill-current">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </Button>
              <Button variant="ghost" size="icon" aria-label="Next" onClick={p.next}>
                <svg width="28" height="28" viewBox="0 0 24 24" className="fill-current">
                  <path d="M16 6h2v12h-2zM6 18l8.5-6L6 6z" />
                </svg>
              </Button>
            </div>
            <div>
              <Button variant="outline" onClick={() => p.setFullscreen?.(false)} aria-label="Close fullscreen">
                Close
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
          {/* Now playing (click to open fullscreen) */}
          <button
            type="button"
            onClick={() => p.setFullscreen?.(true)}
            className="flex min-w-0 flex-1 items-center gap-3 text-left"
            aria-label="Open fullscreen player"
            title="Open fullscreen player"
          >
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded bg-secondary">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  current?.imageUrl ||
                  "/placeholder.svg?height=120&width=120&query=now%20playing%20cover" ||
                  "/placeholder.svg" ||
                  "/placeholder.svg" ||
                  "/placeholder.svg"
                }
                alt={current?.title ? `Cover of ${current.title}` : "Track cover"}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-medium">{current?.title || "Nothing playing"}</div>
              <div className="truncate text-xs text-muted-foreground">{current?.artist || ""}</div>
            </div>
          </button>

          {/* Controls */}
          <div className="flex w-full max-w-xl flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Shuffle"
                onClick={p.toggleShuffle}
                className={p.shuffle ? "text-primary" : ""}
              >
                {/* shuffle icon */}
                <span className="sr-only">Shuffle</span>
                <svg width="20" height="20" viewBox="0 0 24 24" className="fill-current">
                  <path d="M17 3h4v4h-2V6h-2V3zM3 7h6l2.293 2.293-1.414 1.414L8 9H3V7zm0 8h5l6-6h5v2h-4l-6 6H3v-2zm12 2h2v-2h2v4h-4v-2z" />
                </svg>
              </Button>
              <Button variant="ghost" size="icon" aria-label="Previous" onClick={p.prev}>
                {/* previous */}
                <svg width="22" height="22" viewBox="0 0 24 24" className="fill-current">
                  <path d="M6 6h2v12H6zM9.5 12l8.5 6V6z" />
                </svg>
              </Button>
              <Button
                variant="default"
                size="icon"
                aria-label={p.isPlaying ? "Pause" : "Play"}
                onClick={p.toggle}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {/* play/pause */}
                {p.isPlaying ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" className="fill-white">
                    <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
                  </svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" className="fill-white">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </Button>
              <Button variant="ghost" size="icon" aria-label="Next" onClick={p.next}>
                {/* next */}
                <svg width="22" height="22" viewBox="0 0 24 24" className="fill-current">
                  <path d="M16 6h2v12h-2zM6 18l8.5-6L6 6z" />
                </svg>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Repeat"
                onClick={p.cycleRepeat}
                className={p.repeat !== "off" ? "text-primary" : ""}
              >
                {/* repeat */}
                <svg width="20" height="20" viewBox="0 0 24 24" className="fill-current">
                  <path d="M7 7h7v2H7a3 3 0 0 0 0 6h2v-2l3 3-3 3v-2H7a5 5 0 1 1 0-10zm10 10h-7v-2h7a3 3 0 1 0 0-6h-2v2l-3-3 3-3v2h2a5 5 0 1 1 0 10z" />
                </svg>
                <span className="ml-1 text-[10px]">{p.repeat === "one" ? "1" : p.repeat === "all" ? "A" : ""}</span>
              </Button>
            </div>
            <div className="flex w-full items-center gap-2">
              <span className="w-10 text-right text-[11px] tabular-nums text-muted-foreground">
                {fmt(p.currentTime)}
              </span>
              <Slider
                className="w-full"
                value={[p.duration ? (p.currentTime / p.duration) * 100 : 0]}
                onValueChange={(v) => {
                  const ratio = (v?.[0] ?? 0) / 100
                  p.seek(ratio * (p.duration || 0))
                }}
                aria-label="Seek"
              />
              <span className="w-10 text-[11px] tabular-nums text-muted-foreground">{fmt(p.duration)}</span>
            </div>
          </div>

          {/* Volume */}
          <div className="hidden min-w-[160px] items-center gap-2 sm:flex">
            <svg width="18" height="18" viewBox="0 0 24 24" className="text-muted-foreground fill-current">
              <path d="M4 9v6h4l5 5V4L8 9H4z" />
            </svg>
            <Slider
              className="w-full"
              value={[p.volume * 100]}
              onValueChange={(v) => p.setVolume(((v?.[0] ?? 100) as number) / 100)}
              aria-label="Volume"
            />
          </div>
        </div>
      </div>
    </>
  )
}
