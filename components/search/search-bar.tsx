"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export default function SearchBar({ onSubmit }: { onSubmit: (q: string) => void }) {
  const [q, setQ] = React.useState("")
  const [suggestions, setSuggestions] = React.useState<Array<{ title: string; artist: string }>>([])
  const [showSuggestions, setShowSuggestions] = React.useState(false)

  React.useEffect(() => {
    if (q.trim().length < 2) {
      setSuggestions([])
      return
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search/songs?query=${encodeURIComponent(q.trim())}&limit=10`)
        if (res.ok) {
          const data = await res.json()
          const songs = (data.data || []).slice(0, 8).map((s: any) => ({
            title: s.title || "Unknown",
            artist: s.artist || "",
          }))
          setSuggestions(songs)
        }
      } catch (err) {
        console.error("[v0] Autocomplete error:", err)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [q])

  return (
    <div className="relative w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit(q.trim())
          setShowSuggestions(false)
        }}
        className="flex w-full items-center gap-2"
        role="search"
        aria-label="Search songs, playlists, and albums"
      >
        <div className="relative flex-1">
          <Input
            value={q}
            onChange={(e) => {
              setQ(e.target.value)
              setShowSuggestions(true)
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="Search songs, playlists, albums..."
            className="bg-background text-foreground placeholder:text-muted-foreground pr-10"
          />
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
        <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
          Search
        </Button>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-lg border border-border bg-card shadow-lg max-h-64 overflow-y-auto">
          {suggestions.map((suggestion, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setQ(suggestion.title)
                onSubmit(suggestion.title)
                setShowSuggestions(false)
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-secondary transition-colors first:rounded-t-lg last:rounded-b-lg"
            >
              <div className="font-medium">{suggestion.title}</div>
              {suggestion.artist && <div className="text-xs text-muted-foreground">{suggestion.artist}</div>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
