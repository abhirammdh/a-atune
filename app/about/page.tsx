import Link from "next/link"

export default function AboutPage() {
  return (
    <main className="min-h-dvh bg-background text-foreground">
      <section className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-4xl font-semibold text-balance">About</h1>
        <p className="mt-2 text-muted-foreground">Made by Devulapalli Abhiram</p>

        <div className="mt-8 rounded-2xl border border-border bg-card p-10 md:p-14 shadow-lg">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <img
              src="https://i.ibb.co/M59pYPm8/my-profile-img.jpg"
              alt="Devulapalli Abhiram"
              width={176}
              height={176}
              className="h-44 w-44 rounded-xl object-cover"
              loading="eager"
              decoding="async"
            />
            <div className="min-w-0">
              <h2 className="text-2xl md:text-3xl font-semibold">Devulapalli Abhiram</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                I&apos;m pursuing a B.S. in Computer Science at Sri Sathya Sai Institute of Higher Learning (SSSIHL). I
                focus on building music experiences and clean, accessible interfaces, with a strong foundation in modern
                web technologies and product design principles.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-secondary px-2.5 py-1 text-xs text-secondary-foreground">
                  Web Development
                </span>
                <span className="rounded-md bg-secondary px-2.5 py-1 text-xs text-secondary-foreground">UI/UX</span>
                <span className="rounded-md bg-secondary px-2.5 py-1 text-xs text-secondary-foreground">
                  Music Apps
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Link
              href="https://github.com/abhirammdh"
              className="rounded-lg border border-border p-3 hover:bg-accent/10"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit GitHub profile"
            >
              <div className="text-sm font-medium">GitHub</div>
              <div className="text-xs text-muted-foreground truncate">github.com/abhirammdh</div>
            </Link>
            <Link
              href="https://www.linkedin.com/in/devulapalli-abhiram-2bb634249"
              className="rounded-lg border border-border p-3 hover:bg-accent/10"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit LinkedIn profile"
            >
              <div className="text-sm font-medium">LinkedIn</div>
              <div className="text-xs text-muted-foreground truncate">
                linkedin.com/in/devulapalli-abhiram-2bb634249
              </div>
            </Link>

            <Link
              href="mailto:abhiramdevulapalli8@gmail.com"
              className="rounded-lg border border-border p-3 hover:bg-accent/10"
              aria-label="Send email"
            >
              <div className="text-sm font-medium">Email</div>
              <div className="text-xs text-muted-foreground truncate">abhiramdevulapalli8@gmail.com</div>
            </Link>
          </div>

          {/* Professional sections: summary, education, skills, languages, focus, contact */}
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            <section className="rounded-xl border border-border p-6">
              <h3 className="text-lg font-semibold">Professional Summary</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Aspiring software engineer passionate about music-tech and user-centered product design. I enjoy
                building performant, responsive, and accessible interfaces with a clean architecture and attention to
                detail, from component systems to data flows.
              </p>
              <ul className="mt-4 list-disc pl-5 text-sm text-muted-foreground space-y-1">
                <li>Front-end: Next.js (App Router), React Server/Client Components, Tailwind + shadcn/ui</li>
                <li>State &amp; data: SWR, simple server actions, API route handlers</li>
                <li>Quality: a11y-first, semantic HTML, sensible defaults, and design tokens</li>
              </ul>
            </section>

            <section className="rounded-xl border border-border p-6">
              <h3 className="text-lg font-semibold">Education</h3>
              <div className="mt-2 text-sm text-muted-foreground">
                B.S. in Computer Science, SSSIHL
                <div className="text-xs">Sri Sathya Sai Institute of Higher Learning</div>
              </div>
              <h4 className="mt-4 text-sm font-medium">Core Coursework</h4>
              <ul className="mt-2 grid grid-cols-1 gap-1 text-sm text-muted-foreground sm:grid-cols-2">
                <li>Data Structures &amp; Algorithms</li>
                <li>Databases</li>
                <li>Operating Systems</li>
                <li>Computer Networks</li>
                <li>Web Engineering</li>
                <li>Software Engineering</li>
              </ul>
            </section>

            <section className="rounded-xl border border-border p-6">
              <h3 className="text-lg font-semibold">Skills</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {["Next.js", "React", "TypeScript", "Tailwind", "shadcn/ui", "SWR", "API Routes", "Git/GitHub"].map(
                  (s) => (
                    <span key={s} className="rounded-md bg-secondary px-2.5 py-1 text-xs text-secondary-foreground">
                      {s}
                    </span>
                  ),
                )}
              </div>
              <h4 className="mt-4 text-sm font-medium">Languages I speak</h4>
              <div className="mt-2 flex flex-wrap gap-2">
                {["Telugu", "English", "Tamil", "Hindi", "Kannada", "Malayalam"].map((l) => (
                  <span key={l} className="rounded-md bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                    {l}
                  </span>
                ))}
              </div>
            </section>

            <section className="rounded-xl border border-border p-6">
              <h3 className="text-lg font-semibold">What I’m focusing on</h3>
              <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground space-y-1">
                <li>Personalized music discovery with simple, fast UI</li>
                <li>Accessible design systems and consistent component APIs</li>
                <li>Clean data flows with predictable state and caching</li>
              </ul>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href="mailto:abhiramdevulapalli8@gmail.com"
                  className="inline-flex items-center rounded-md border border-border px-3 py-1.5 text-sm hover:bg-accent/10"
                >
                  Contact
                </Link>
                <Link
                  href="https://www.linkedin.com/in/devulapalli-abhiram-2bb634249"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:opacity-90"
                >
                  Connect on LinkedIn
                </Link>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  )
}
