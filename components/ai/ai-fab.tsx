"use client"

import type React from "react"

import { useState } from "react"
import { Sparkles } from "lucide-react"

type LanguageKey = "telugu" | "english" | "tamil" | "hindi" | "kannada" | "malayalam" | "all"
type MoodKey = "upbeat" | "calm" | "neutral" | "romantic" | "sad" | "focus"

export default function AiFab() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  function toLanguageKey(label: string): LanguageKey {
    const v = label.toLowerCase()
    if (v.includes("all")) return "all"
    if (v.includes("telugu")) return "telugu"
    if (v.includes("tamil")) return "tamil"
    if (v.includes("hindi")) return "hindi"
    if (v.includes("kannada")) return "kannada"
    if (v.includes("malayalam")) return "malayalam"
    return "english"
  }

  function toMoodKey(v: string): MoodKey {
    const k = v.toLowerCase()
    if (k.includes("upbeat")) return "upbeat"
    if (k.includes("romantic")) return "romantic"
    if (k.includes("sad")) return "sad"
    if (k.includes("focus")) return "focus"
    if (k.includes("calm")) return "calm"
    return "neutral"
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSuggestions([])
    setError(null)
    const form = e.currentTarget
    const data = new FormData(form)
    const feeling = String(data.get("feeling") || "").trim()
    const languageLabel = String(data.get("language") || "English")
    const modeLabel = String(data.get("mode") || "Neutral")
    const language = toLanguageKey(languageLabel)
    const mood = toMoodKey(modeLabel)

    setLoading(true)
    try {
      const res = await fetch("/api/ai/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: feeling, language, mood }),
      })
      if (!res.ok) throw new Error(`Bad status ${res.status}`)
      const json = (await res.json()) as { queries?: string[] }
      const qs = json.queries ?? []
      if (!qs.length) {
        setError("No suggestions. Try another mood or language.")
      }
      setSuggestions(qs)
    } catch (err) {
      setError("Couldn't get suggestions. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  function runSearch(q: string) {
    const url = new URL(window.location.href)
    url.searchParams.set("q", q)
    window.history.pushState({}, "", url.toString())
    window.dispatchEvent(new Event("popstate"))
    setOpen(false)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="AI song suggestions"
        className="fixed z-50 bottom-4 right-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary px-0 mx-0 my-[69px]"
      >
        <Sparkles className="h-5 w-5" aria-hidden="true" />
        <span className="sr-only">Open AI suggestions</span>
      </button>

      {open ? (
        <div
          role="dialog"
          aria-label="AI Suggestions"
          className="fixed z-50 bottom-20 right-4 w-[90vw] max-w-sm rounded-xl border border-border bg-background/95 p-3 shadow-xl backdrop-blur"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">AI Suggestions</h3>
            <button
              className="rounded px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>

          <p className="mt-2 text-xs text-muted-foreground">
            Tell me your mood (mode) and language. I&apos;ll suggest a search.
          </p>

          <form className="mt-3 grid grid-cols-1 gap-2" onSubmit={handleSubmit}>
            <input
              name="feeling"
              placeholder="e.g., I feel energetic and want upbeat tracks"
              className="h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground"
            />
            <select
              name="mode"
              className="h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground"
              defaultValue="Neutral"
            >
              <option>Upbeat</option>
              <option>Calm</option>
              <option>Romantic</option>
              <option>Sad</option>
              <option>Focus</option>
              <option>Neutral</option>
            </select>
            <select
              name="language"
              className="h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground"
              defaultValue="English"
            >
              <option>All languages</option>
              <option>Telugu</option>
              <option>English</option>
              <option>Tamil</option>
              <option>Hindi</option>
              <option>Kannada</option>
              <option>Malayalam</option>
            </select>

            <button
              type="submit"
              disabled={loading}
              className="mt-1 inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Thinking…" : "Suggest"}
            </button>
          </form>

          {error ? <p className="mt-2 text-xs text-destructive">{error}</p> : null}

          {suggestions.length ? (
            <div className="mt-3">
              <p className="mb-2 text-xs text-muted-foreground">Suggested searches:</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => runSearch(q)}
                    className="rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs text-foreground hover:bg-secondary"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  )
}
