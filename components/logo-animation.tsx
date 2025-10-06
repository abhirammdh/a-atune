"use client"

import * as React from "react"

export default function LogoAnimation() {
  const [isAnimating, setIsAnimating] = React.useState(true)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  if (!isAnimating) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background animate-fade-out">
      <div className="flex flex-col items-center gap-4 animate-scale-in">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://i.ibb.co/Hpbfnpmv/Untitled-design.png"
          alt="A2A Tune"
          className="h-24 w-24 rounded-lg object-cover"
        />
        <h1 className="text-4xl font-bold">A2A Tune</h1>
      </div>
    </div>
  )
}
