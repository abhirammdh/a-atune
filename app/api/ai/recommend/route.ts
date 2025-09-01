import { NextResponse } from "next/server"

type LanguageKey = "telugu" | "english" | "tamil" | "hindi" | "kannada" | "malayalam" | "all" // add kannada, malayalam, all
type MoodKey = "upbeat" | "calm" | "neutral" | "romantic" | "sad" | "focus" // extended moods

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { text?: string; language?: LanguageKey; mood?: MoodKey } // accept mood
    const text = (body.text || "").toString().slice(0, 2000)
    const language = (body.language || "english") as LanguageKey
    const clientMood = body.mood as MoodKey | undefined

    if (!text) {
      return NextResponse.json({ queries: fallbackQueries(language, clientMood ?? "neutral") }) // pass mood
    }

    const apiKey = process.env.GOOGLE_API_KEY
    if (!apiKey) {
      return NextResponse.json({ queries: fallbackQueries(language, clientMood ?? "neutral") }) //
    }

    const res = await fetch(`https://language.googleapis.com/v1/documents:analyzeSentiment?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        document: { type: "PLAIN_TEXT", content: text },
        encodingType: "UTF8",
      }),
    })

    if (!res.ok) {
      return NextResponse.json({ queries: fallbackQueries(language, clientMood ?? "neutral") })
    }

    const data = (await res.json()) as any
    const score: number = data?.documentSentiment?.score ?? 0
    const inferred: MoodKey = score > 0.25 ? "upbeat" : score < -0.25 ? "calm" : "neutral"
    const mood: MoodKey = clientMood ?? inferred // prefer client-provided mode

    return NextResponse.json({ queries: fallbackQueries(language, mood) })
  } catch (err) {
    return NextResponse.json({ queries: fallbackQueries("english", "neutral") })
  }
}

function fallbackQueries(lang: LanguageKey, mood: MoodKey): string[] {
  const base: Record<MoodKey, string[]> = {
    upbeat: ["party hits", "energetic mix", "dance anthems"],
    calm: ["acoustic chill", "soothing melodies", "late-night calm"],
    neutral: ["trending now", "new releases", "top hits today"],
    romantic: ["love ballads", "romantic hits", "soft love songs"],
    sad: ["sad songs", "heartbreak mix", "melancholy vibes"],
    focus: ["focus beats", "instrumental productivity", "deep work ambient"],
  }

  const mapByLang: Record<Exclude<LanguageKey, "all">, Partial<Record<MoodKey, string[]>>> = {
    telugu: {
      upbeat: ["Telugu party hits", "DSP energetic Telugu", "Tollywood dance tracks"],
      calm: ["Telugu acoustic", "Melodic Telugu chill", "Soothing Tollywood"],
      neutral: ["Trending Telugu", "New Telugu releases", "Top Tollywood today"],
      romantic: ["Romantic Telugu hits", "Telugu love ballads", "Tollywood romance"],
      sad: ["Sad Telugu songs", "Tollywood heartbreak", "Emotional Telugu"],
      focus: ["Telugu focus instrumentals", "Tollywood calm study", "Telugu lo-fi"],
    },
    english: {
      upbeat: ["Pop bangers 2025", "EDM workout", "Upbeat indie pop"],
      calm: ["Lo-fi beats", "Acoustic chill", "Ambient focus"],
      neutral: ["Top 50 Global", "Fresh finds", "New Music Friday"],
      romantic: ["Romantic pop", "Love ballads", "Soft pop love"],
      sad: ["Sad pop", "Indie heartbreak", "Melancholy indie"],
      focus: ["Deep focus", "Instrumental study", "Ambient work"],
    },
    tamil: {
      upbeat: ["Tamil kuthu hits", "Anirudh energy", "Kollywood dance"],
      calm: ["Tamil melody", "Acoustic Kollywood", "Calm Tamil classics"],
      neutral: ["Trending Tamil", "New Tamil releases", "Top Kollywood today"],
      romantic: ["Romantic Tamil hits", "Kollywood love ballads", "Soft Tamil romance"],
      sad: ["Sad Tamil songs", "Kollywood heartbreak", "Melancholy Tamil"],
      focus: ["Tamil lo-fi", "Kollywood instrumentals", "Study Tamil vibes"],
    },
    hindi: {
      upbeat: ["Bollywood party", "Punjabi pop hits", "Upbeat Hindi tracks"],
      calm: ["Hindi acoustic", "Soulful ghazals", "Chill Bollywood"],
      neutral: ["Trending Hindi", "New Bollywood releases", "Top Bollywood today"],
      romantic: ["Romantic Bollywood", "Hindi love ballads", "Bollywood romance"],
      sad: ["Sad Hindi songs", "Bollywood heartbreak", "Emotional Hindi"],
      focus: ["Hindi focus", "Instrumental Bollywood", "Chill Hindi study"],
    },
    kannada: {
      upbeat: ["Kannada party hits", "Sandalwood dance", "Upbeat Kannada tracks"],
      calm: ["Kannada acoustic", "Soothing Sandalwood", "Kannada chill"],
      neutral: ["Trending Kannada", "New Kannada releases", "Top Sandalwood today"],
      romantic: ["Romantic Kannada hits", "Kannada love ballads", "Sandalwood romance"],
      sad: ["Sad Kannada songs", "Kannada heartbreak", "Emotional Kannada"],
      focus: ["Kannada lo-fi", "Sandalwood instrumentals", "Study Kannada vibes"],
    },
    malayalam: {
      upbeat: ["Malayalam party hits", "Mollywood dance", "Upbeat Malayalam"],
      calm: ["Malayalam acoustic", "Soothing Mollywood", "Malayalam chill"],
      neutral: ["Trending Malayalam", "New Malayalam releases", "Top Mollywood today"],
      romantic: ["Romantic Malayalam", "Malayalam love ballads", "Mollywood romance"],
      sad: ["Sad Malayalam songs", "Malayalam heartbreak", "Emotional Malayalam"],
      focus: ["Malayalam lo-fi", "Mollywood instrumentals", "Study Malayalam vibes"],
    },
  }

  if (lang === "all") {
    // generic cross-language suggestions
    return base[mood].map((q) => `${q}`)
  }

  const byLang = mapByLang[lang]
  return byLang?.[mood] ?? byLang?.neutral ?? base[mood]
}
