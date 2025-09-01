"use client"

import * as React from "react"
import TrendingSections from "@/components/trending-sections"
import SearchResults from "@/components/search/search-results"

export default function SearchResultsWrapper() {
  const [query, setQuery] = React.useState<string>(() => {
    if (typeof window === "undefined") return ""
    return new URL(window.location.href).searchParams.get("q") || ""
  })

  React.useEffect(() => {
    const handler = () => {
      setQuery(new URL(window.location.href).searchParams.get("q") || "")
    }
    window.addEventListener("app:query-updated", handler)
    return () => window.removeEventListener("app:query-updated", handler)
  }, [])

  if (!query) {
    return <TrendingSections />
  }

  return <SearchResults query={query} />
}
