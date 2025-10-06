"use client"

import SearchBar from "@/components/search/search-bar"
import SearchResultsWrapper from "@/components/search/search-results-wrapper"
import UserPlaylists from "@/components/user-playlists"

export default function Page() {
  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      <section className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <SearchBar
            onSubmit={(q) => {
              if (typeof window !== "undefined") {
                const url = new URL(window.location.href)
                url.searchParams.set("q", q)
                window.history.replaceState(null, "", url.toString())
                window.dispatchEvent(new CustomEvent("app:query-updated"))
              }
            }}
          />
        </div>
        <SearchResultsWrapper />
        <UserPlaylists />
      </section>
    </div>
  )
}
