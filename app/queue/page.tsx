"use client"

import { usePlayer } from "@/components/player/player-context"

export default function QueuePage() {
  const p = usePlayer()
  const currentId = p.queue[p.index]?.id

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-semibold text-balance">Queue</h1>
      <p className="mt-1 text-sm text-muted-foreground">Songs in your current playback queue.</p>

      <ul className="mt-6 space-y-2">
        {p.queue.length === 0 ? (
          <li className="text-sm text-muted-foreground">Your queue is empty.</li>
        ) : (
          p.queue.map((s, i) => (
            <li
              key={`${s.id}-${i}`}
              className="flex items-center justify-between rounded-md border border-border bg-card p-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {s.title} {s.id === currentId ? <span className="text-primary">(Now playing)</span> : null}
                </p>
                <p className="truncate text-xs text-muted-foreground">{s.artist}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground hover:bg-primary/90"
                  onClick={() => p.playAt(i)}
                >
                  Play
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}
