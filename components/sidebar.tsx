"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, ListMusic, Download, Info, Music } from "lucide-react"
import ThemeToggle from "@/components/theme-toggle"
import { TimeDisplay } from "@/components/nav-time"

export default function Sidebar() {
  const [isOpen, setIsOpen] = React.useState(false)
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/queue", label: "Queue", icon: ListMusic },
    { href: "/downloads", label: "Downloads", icon: Download },
    { href: "/about", label: "About", icon: Info },
  ]

  return (
    <>
      <aside
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className={`fixed left-0 top-0 z-50 h-screen border-r border-border bg-card transition-all duration-300 ${
          isOpen ? "w-64" : "w-16"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center justify-center border-b border-border p-4">
            {isOpen ? (
              <Link href="/" className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/a2atune-logo.png" alt="A2A Tune" className="h-10 w-10 rounded object-cover" />
                <span className="text-lg font-bold">A2A Tune</span>
              </Link>
            ) : (
              <Link href="/" className="flex items-center justify-center" title="A2A Tune">
                
              </Link>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                  title={item.label}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {isOpen && <span className="text-sm font-medium">{item.label}</span>}
                </Link>
              )
            })}
          </nav>

          {/* Bottom section */}
          <div className="border-t border-border p-4">
            {isOpen && (
              <div className="mb-2">
                <TimeDisplay className="text-xs text-muted-foreground" />
              </div>
            )}
            <ThemeToggle />
          </div>
        </div>
      </aside>
    </>
  )
}
