"use client"

import type React from "react"
import { useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { X, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

type LanguageKey = "telugu" | "english" | "tamil" | "hindi" | "kannada" | "malayalam" | "all"
type MoodKey = "upbeat" | "calm" | "romantic" | "sad" | "focus" | "neutral"

export function AiSuggestButton({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const [lang, setLang] = useState<LanguageKey>("english")
  const [mood, setMood] = useState<MoodKey>("neutral")
  const [loading, startTransition] = useTransition()
  const [queries, setQueries] = useState<string[]>([])
  const router = useRouter()
  const params = useSearchParams()

  const onSuggest = () => {
    if (!input.trim()) return
    startTransition(async () => {
      try {
        const res = await fetch("/api/ai/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: input, language: lang, mood }),
        })
        if (!res.ok) throw new Error("Failed to get recommendations")
        const data = (await res.json()) as { queries: string[] }
        setQueries(data.queries ?? [])
      } catch (err) {
        setQueries([])
      }
    })
  }

  const applyQuery = (q: string) => {
    const usp = new URLSearchParams(Array.from(params.entries()))
    usp.set("q", q)
    router.push(`/?${usp.toString()}`)
    setOpen(false)
  }

  return (
    <div className="relative">
      <div onClick={() => setOpen(true)}>{children}</div>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center md:items-center bg-black/50"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full md:max-w-lg rounded-t-2xl md:rounded-2xl bg-background p-4 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                AI Song Suggestions
              </h2>
              <button
                className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-accent"
                onClick={() => setOpen(false)}
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 grid gap-3">
              <label className="text-sm text-muted-foreground">How are you feeling?</label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={3}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                placeholder="e.g., I feel energetic and want upbeat tracks"
              />
              <div className="flex items-center gap-3">
                <label className="text-sm text-muted-foreground">Language</label>
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value as LanguageKey)}
                  className="rounded-md border bg-background px-2 py-1 text-sm"
                >
                  <option value="all">All languages</option>
                  <option value="telugu">Telugu</option>
                  <option value="english">English</option>
                  <option value="tamil">Tamil</option>
                  <option value="hindi">Hindi</option>
                  <option value="kannada">Kannada</option>
                  <option value="malayalam">Malayalam</option>
                </select>

                <label className="text-sm text-muted-foreground">Mode</label>
                <select
                  value={mood}
                  onChange={(e) => setMood(e.target.value as MoodKey)}
                  className="rounded-md border bg-background px-2 py-1 text-sm"
                >
                  <option value="upbeat">Upbeat</option>
                  <option value="calm">Calm</option>
                  <option value="romantic">Romantic</option>
                  <option value="sad">Sad</option>
                  <option value="focus">Focus</option>
                  <option value="neutral">Neutral</option>
                </select>

                <button
                  disabled={loading}
                  onClick={onSuggest}
                  className={cn(
                    "ml-auto inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground",
                    loading && "opacity-70",
                  )}
                >
                  <Sparkles className="h-4 w-4" />
                  {loading ? "Thinking..." : "Suggest"}
                </button>
              </div>

              {queries.length > 0 && (
                <div className="mt-2">
                  <div className="text-sm font-medium mb-2">Recommended searches</div>
                  <div className="flex flex-wrap gap-2">
                    {queries.map((q) => (
                      <button
                        key={q}
                        onClick={() => applyQuery(q)}
                        className="rounded-full border px-3 py-1 text-sm hover:bg-accent"
                        title={`Search: ${q}`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Selecting a chip updates the search and shows icon-only Play / Queue / Download.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
