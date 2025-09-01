"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export function TimeDisplay({ className }: { className?: string }) {
  const [now, setNow] = useState<Date>(() => new Date())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <time aria-label="Current time" dateTime={now.toISOString()} className={cn("tabular-nums", className)}>
      {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
    </time>
  )
}
