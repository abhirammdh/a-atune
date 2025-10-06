import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Suspense } from "react"
import { PlayerProvider } from "@/components/player/player-context"
import PlayerBar from "@/components/player/player-bar"
import AiFab from "@/components/ai/ai-fab"
import Sidebar from "@/components/sidebar"
import LogoAnimation from "@/components/logo-animation"

export const metadata: Metadata = {
  title: "A2A Tune",
  description: "Music streaming platform",
    generator: 'v0.app'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="antialiased">
      <body className="bg-background text-foreground">
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'){document.documentElement.classList.add('dark');}else{document.documentElement.classList.remove('dark');}}catch(e){}})();`,
          }}
        />
        <LogoAnimation />
        <PlayerProvider>
          <Sidebar />
          <div className="transition-all duration-300 md:ml-64">
            <Suspense fallback={<div className="px-4 py-6">Loading…</div>}>
              <main className="mx-auto min-h-screen max-w-6xl px-4 py-6 pb-32">{children}</main>
            </Suspense>
          </div>
          <PlayerBar />
          <AiFab />
        </PlayerProvider>
      </body>
    </html>
  )
}
