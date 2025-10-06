"use client"

import React from "react"

type NormalizedSong = {
  id: string
  title: string
  artist?: string
  imageUrl?: string
  audioUrl?: string
  durationSec?: number
}

type PlayerState = {
  queue: NormalizedSong[]
  index: number
  isPlaying: boolean
  shuffle: boolean
  repeat: "off" | "one" | "all"
  volume: number // 0..1
  currentTime: number
  duration: number
  isFullscreen?: boolean
}

type PlayerApi = {
  loadQueue: (songs: NormalizedSong[], startIndex?: number) => void
  play: () => void
  pause: () => void
  toggle: () => void
  next: () => void
  prev: () => void
  seek: (time: number) => void
  setVolume: (v: number) => void
  toggleShuffle: () => void
  cycleRepeat: () => void
  addToQueue: (song: NormalizedSong) => void
  playAt: (i: number) => void
  setFullscreen?: (on: boolean) => void
  toggleFullscreen?: () => void
}

const PlayerContext = React.createContext<(PlayerState & PlayerApi) | null>(null)

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = React.useRef<HTMLAudioElement | null>(null)
  const [queue, setQueue] = React.useState<NormalizedSong[]>([])
  const [index, setIndex] = React.useState(0)
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [shuffle, setShuffle] = React.useState(false)
  const [repeat, setRepeat] = React.useState<"off" | "one" | "all">("off")
  const [volume, setVol] = React.useState<number>(() => {
    if (typeof window === "undefined") return 0.8
    const saved = localStorage.getItem("player:volume")
    return saved ? Number(saved) : 0.8
  })
  const [currentTime, setCurrentTime] = React.useState(0)
  const [duration, setDuration] = React.useState(0)
  const [isFullscreen, setIsFullscreen] = React.useState(false)

  // Initialize audio element once
  React.useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio()
      audioRef.current.preload = "metadata"
      audioRef.current.crossOrigin = "anonymous"
      audioRef.current.volume = volume
    }
    const audio = audioRef.current

    if (!audio) return
    const onTime = () => setCurrentTime(audio.currentTime || 0)
    const onLoaded = () => setDuration(audio.duration || 0)
    const onDuration = () => setDuration(audio.duration || 0)
    const onEnded = () => {
      if (repeat === "one") {
        audio.currentTime = 0
        audio.play()
        return
      }
      next()
    }

    audio.addEventListener("timeupdate", onTime)
    audio.addEventListener("loadedmetadata", onLoaded)
    audio.addEventListener("durationchange", onDuration)
    audio.addEventListener("ended", onEnded)
    return () => {
      audio.removeEventListener("timeupdate", onTime)
      audio.removeEventListener("loadedmetadata", onLoaded)
      audio.removeEventListener("durationchange", onDuration)
      audio.removeEventListener("ended", onEnded)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repeat])

  // Volume persistence
  React.useEffect(() => {
    const audio = audioRef.current
    if (audio) audio.volume = volume
    if (typeof window !== "undefined") {
      localStorage.setItem("player:volume", String(volume))
    }
  }, [volume])

  // Helper to route external URLs via local proxy for CORS/Range
  const toProxied = React.useCallback((src?: string) => {
    if (!src) return ""
    if (src.startsWith("/api/media")) return src
    const isHttp = /^https?:\/\//i.test(src)
    // Always proxy external http(s) to avoid CORS/Range issues
    return isHttp ? `/api/media?src=${encodeURIComponent(src)}` : src
  }, [])

  // Load current track into audio when index/queue changes
  React.useEffect(() => {
    const audio = audioRef.current
    const track = queue[index]
    if (!audio) return
    if (!track || !track.audioUrl) {
      setIsPlaying(false)
      return
    }

    const effectiveSrc = toProxied(track.audioUrl)
    console.log("[v0] loading audio src:", effectiveSrc)

    audio.src = effectiveSrc
    audio.currentTime = 0
    setCurrentTime(0)
    audio.load()
    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch((err) => {
        console.log("[v0] audio.play() failed:", err?.message || err)
        setIsPlaying(false)
      })
  }, [index, queue, toProxied]) // eslint-disable-line

  const play = React.useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false))
  }, [])

  const pause = React.useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.pause()
    setIsPlaying(false)
  }, [])

  const toggle = React.useCallback(() => {
    if (isPlaying) pause()
    else play()
  }, [isPlaying, pause, play])

  const loadQueue = React.useCallback((songs: NormalizedSong[], startIndex = 0) => {
    setQueue(songs)
    setIndex(startIndex)
    setIsPlaying(true)
  }, [])

  const addToQueue = React.useCallback((song: NormalizedSong) => {
    setQueue((q) => [...q, song])
  }, [])

  const playAt = React.useCallback(
    (i: number) => {
      setIndex((old) => {
        const nextIndex = Math.max(0, Math.min(i, (queue.length || 1) - 1))
        return nextIndex
      })
      setIsPlaying(true)
    },
    [queue.length],
  )

  const next = React.useCallback(() => {
    if (queue.length === 0) return
    if (shuffle) {
      const nextIdx = Math.floor(Math.random() * queue.length)
      setIndex(nextIdx)
      setIsPlaying(true)
      return
    }
    const last = index >= queue.length - 1
    if (last) {
      if (repeat === "all") {
        setIndex(0)
        setIsPlaying(true)
      } else {
        setIsPlaying(false)
      }
    } else {
      setIndex(index + 1)
      setIsPlaying(true)
    }
  }, [index, queue.length, repeat, shuffle])

  const prev = React.useCallback(() => {
    if (queue.length === 0) return
    if (audioRef.current && audioRef.current.currentTime > 3) {
      // restart song if >3s into track
      audioRef.current.currentTime = 0
      return
    }
    if (shuffle) {
      const prevIdx = Math.floor(Math.random() * queue.length)
      setIndex(prevIdx)
      setIsPlaying(true)
      return
    }
    const first = index <= 0
    if (first) {
      if (repeat === "all") {
        setIndex(queue.length - 1)
        setIsPlaying(true)
      } else {
        setIsPlaying(false)
      }
    } else {
      setIndex(index - 1)
      setIsPlaying(true)
    }
  }, [index, queue.length, repeat, shuffle])

  const seek = React.useCallback((time: number) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = Math.max(0, Math.min(time, audio.duration || time))
    setCurrentTime(audio.currentTime)
  }, [])

  const setVolume = React.useCallback((v: number) => {
    const clamped = Math.max(0, Math.min(1, v))
    setVol(clamped)
  }, [])

  const toggleShuffle = React.useCallback(() => setShuffle((s) => !s), [])
  const cycleRepeat = React.useCallback(() => {
    setRepeat((r) => (r === "off" ? "one" : r === "one" ? "all" : "off"))
  }, [])

  const setFullscreen = React.useCallback((on: boolean) => setIsFullscreen(on), [])
  const toggleFullscreen = React.useCallback(() => setIsFullscreen((v) => !v), [])

  const value: PlayerState & PlayerApi = {
    queue,
    index,
    isPlaying,
    shuffle,
    repeat,
    volume,
    currentTime,
    duration,
    isFullscreen,
    loadQueue,
    play,
    pause,
    toggle,
    next,
    prev,
    seek,
    setVolume,
    toggleShuffle,
    cycleRepeat,
    addToQueue,
    playAt,
    setFullscreen,
    toggleFullscreen,
  }

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
}

export function usePlayer() {
  const ctx = React.useContext(PlayerContext)
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider")
  return ctx
}

export type { NormalizedSong }
