"use client"

import { Button } from "@/components/ui/button"
import * as React from "react"

export default function ThemeToggle() {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("theme")
    const root = document.documentElement
    if (saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" aria-label="Toggle theme" className="ml-1">
        {/* sun placeholder while mounting */}
        <svg width="18" height="18" viewBox="0 0 24 24" className="fill-current opacity-70">
          <path d="M6.76 4.84l-1.8-1.79L3.17 4.84l1.79 1.79 1.8-1.79zM1 13h3v-2H1v2zm10 10h2v-3h-2v3zM4.84 19.16l1.8-1.79-1.8-1.79-1.67 1.67 1.67 1.91zM20 13h3v-2h-3v2zM12 1h2V-2h-2v3zm7.76 3.84l-1.79-1.79-1.8 1.79 1.8 1.79 1.79-1.79zM12 7a5 5 0 100 10 5 5 0 000-10z" />
        </svg>
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      className="ml-1"
      onClick={() => {
        const root = document.documentElement
        const isDark = root.classList.toggle("dark")
        localStorage.setItem("theme", isDark ? "dark" : "light")
      }}
    >
      {/* Sun/Moon swap based on current theme */}
      {typeof document !== "undefined" && document.documentElement.classList.contains("dark") ? (
        // Moon icon
        <svg width="18" height="18" viewBox="0 0 24 24" className="fill-current">
          <path d="M21 12.79A9 9 0 1111.21 3c.22 0 .44.01.65.03A7 7 0 0021 12.79z" />
        </svg>
      ) : (
        // Sun icon
        <svg width="18" height="18" viewBox="0 0 24 24" className="fill-current">
          <path d="M6.76 4.84l-1.8-1.79L3.17 4.84l1.79 1.79 1.8-1.79zM1 13h3v-2H1v2zm10 10h2v-3h-2v3zM4.84 19.16l1.8-1.79-1.8-1.79-1.67 1.67 1.67 1.91zM20 13h3v-2h-3v2zM12 1h2V-2h-2v3zm7.76 3.84l-1.79-1.79-1.8 1.79 1.8 1.79 1.79-1.79zM12 7a5 5 0 100 10 5 5 0 000-10z" />
        </svg>
      )}
    </Button>
  )
}
