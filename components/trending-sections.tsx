"use client"

type TrendItem = { title: string; query: string; image: string }

const trends: Record<string, TrendItem[]> = {
  Telugu: [
    { title: "Telugu Top Hits", query: "Telugu Top Hits", image: "/telugu-top-hits-cover.png" },
    { title: "Tollywood Best", query: "Tollywood Best Songs", image: "/tollywood-best-cover.png" },
    { title: "Latest Telugu", query: "Latest Telugu 2025", image: "/latest-telugu-cover.png" },
  ],
  English: [
    { title: "Today’s Hits", query: "English Today's Hits", image: "/today-s-hits-cover.png" },
    { title: "Pop Classics", query: "English Pop Classics", image: "/pop-classics-cover.png" },
    { title: "Fresh Finds", query: "English Fresh Finds", image: "/fresh-finds-cover.png" },
  ],
  Tamil: [
    { title: "Tamil Beats", query: "Tamil Beats", image: "/tamil-beats-cover.png" },
    { title: "Kollywood Mix", query: "Kollywood Mix", image: "/kollywood-mix-cover.png" },
    { title: "Latest Tamil", query: "Latest Tamil 2025", image: "/latest-tamil-cover.png" },
  ],
  Hindi: [
    { title: "Bollywood Hits", query: "Bollywood Hits", image: "/bollywood-hits-cover.png" },
    { title: "Romantic Hindi", query: "Romantic Hindi", image: "/romantic-hindi-cover.png" },
    { title: "Desi Vibes", query: "Hindi Desi Vibes", image: "/desi-vibes-cover.png" },
  ],
}

export default function TrendingSections() {
  const onClickCard = (q: string) => {
    if (typeof window === "undefined") return
    const url = new URL(window.location.href)
    url.searchParams.set("q", q)
    window.history.replaceState(null, "", url.toString())
    window.dispatchEvent(new CustomEvent("app:query-updated"))
  }

  return (
    <div className="mt-6 space-y-8">
      {Object.entries(trends).map(([lang, items]) => (
        <section key={lang} aria-labelledby={`section-${lang}`} className="space-y-3">
          <h2 id={`section-${lang}`} className="text-pretty text-lg font-semibold">
            {lang} • Trending Playlists
          </h2>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {items.map((it) => (
              <li key={it.title}>
                <button
                  onClick={() => onClickCard(it.query)}
                  className="group flex w-full items-center gap-3 rounded-lg border border-border bg-card p-2 text-left hover:bg-accent/10 focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={it.image || "/placeholder.svg"}
                    alt={`${it.title} cover`}
                    className="h-16 w-16 flex-none rounded object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{it.title}</p>
                    <p className="truncate text-xs text-muted-foreground">Tap to search</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
