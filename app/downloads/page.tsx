"use client"

import * as React from "react"

type DlItem = {
  id?: string
  title?: string
  artist?: string
  imageUrl?: string
  url: string
  at?: number
}

export default function DownloadsPage() {
  const [items, setItems] = React.useState<DlItem[]>([])

  React.useEffect(() => {
    try {
      const key = "downloads:list"
      const list = JSON.parse(localStorage.getItem(key) || "[]") as DlItem[]
      setItems(list)
    } catch {
      setItems([])
    }
  }, [])

  const clear = () => {
    localStorage.removeItem("downloads:list")
    setItems([])
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-balance">Downloads</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Click the download icon next to any song to add it here and trigger a download.
          </p>
        </div>
        <button className="rounded-md border border-border px-3 py-1.5 text-xs hover:bg-secondary" onClick={clear}>
          Clear
        </button>
      </div>

      <ul className="mt-6 space-y-2">
        {items.length === 0 ? (
          <li className="text-sm text-muted-foreground">No downloads yet.</li>
        ) : (
          items.map((it, idx) => (
            <li
              key={`${it.url}-${idx}`}
              className="flex items-center justify-between rounded-md border border-border bg-card p-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="h-10 w-10 overflow-hidden rounded bg-secondary">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={it.imageUrl || "/placeholder.svg?height=80&width=80&query=album%20cover"}
                    alt={it.title || "cover"}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{it.title || "Track"}</p>
                  <p className="truncate text-xs text-muted-foreground">{it.artist || ""}</p>
                </div>
              </div>
              <a
                href={it.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground hover:bg-primary/90"
              >
                Download
              </a>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}
