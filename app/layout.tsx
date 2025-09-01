import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import Link from "next/link"
import { Suspense } from "react" // Suspense must come from react
import Script from "next/script"
// import Image from "next/image"
import ThemeToggle from "@/components/theme-toggle"
import { PlayerProvider } from "@/components/player/player-context"
import PlayerBar from "@/components/player/player-bar"
import { TimeDisplay } from "@/components/nav-time"
import AiFab from "@/components/ai/ai-fab"

export const metadata: Metadata = {
  title: "TuneStream",
  description: "Ad Free Music player",
    generator: 'v0.app'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="antialiased">
      <body className="bg-background text-foreground">
        <Script id="theme-init" strategy="beforeInteractive">
          {`
            (function () {
              try {
                var t = localStorage.getItem('theme');
                if (t === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            })();
          `}
        </Script>
        <PlayerProvider>
          <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
            <div className="mx-auto grid max-w-6xl grid-cols-3 items-center px-4 py-3">
              <Link href="/" className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://i.ibb.co/Hpbfnpmv/Untitled-design.png"
                  alt="TuneStream logo"
                  width={128}
                  height={128}
                  className="h-14 w-14 md:h-16 md:w-16 rounded-md object-cover"
                />
                <span className="text-pretty text-3xl md:text-4xl font-bold">A&amp;A Tune</span>
              </Link>
              <div className="justify-self-center">
                <TimeDisplay className="text-sm md:text-base text-muted-foreground" />
              </div>
              <nav role="navigation" aria-label="Primary" className="flex items-center justify-end gap-1">
                <Link
                  href="/"
                  className="rounded-md px-3 py-1.5 text-sm text-foreground/80 hover:bg-secondary hover:text-secondary-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  Home
                </Link>
                <Link
                  href="/queue"
                  className="rounded-md px-3 py-1.5 text-sm text-foreground/80 hover:bg-secondary hover:text-secondary-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  Queue
                </Link>
                <Link
                  href="/downloads"
                  className="rounded-md px-3 py-1.5 text-sm text-foreground/80 hover:bg-secondary hover:text-secondary-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  Downloads
                </Link>
                <Link
                  href="/about"
                  className="rounded-md px-3 py-1.5 text-sm text-foreground/80 hover:bg-secondary hover:text-secondary-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  About
                </Link>
                <ThemeToggle />
              </nav>
            </div>
          </header>
          <Suspense fallback={<div className="px-4 py-6">Loading…</div>}>
            <main className="mx-auto min-h-screen max-w-6xl px-4 py-6">{children}</main>
          </Suspense>
          <PlayerBar />
          <AiFab />
        </PlayerProvider>

        <Script src="https://www.googletagmanager.com/gtag/js?id=G-HL97P0WZET" strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-HL97P0WZET');
          `}
        </Script>
      </body>
    </html>
  )
}
