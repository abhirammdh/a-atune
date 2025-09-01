"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function SearchBar({ onSubmit }: { onSubmit: (q: string) => void }) {
  const [q, setQ] = React.useState("")

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit(q.trim())
      }}
      className="flex w-full items-center gap-2"
      role="search"
      aria-label="Search songs, playlists, and albums"
    >
      <Input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search songs, playlists, albums..."
        className="bg-background text-foreground placeholder:text-muted-foreground"
      />
      <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
        Search
      </Button>
    </form>
  )
}
