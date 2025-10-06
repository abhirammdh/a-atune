import Link from "next/link"

export default function AboutPage() {
  return (
    <main className="min-h-dvh bg-background text-foreground">
      <section className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-4xl font-semibold text-balance">About</h1>
        <p className="mt-2 text-muted-foreground">Made by Devulapalli Abhiram</p>

        <div className="mt-8 rounded-2xl border border-border bg-card p-8 md:p-12">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <img
              src="/images/design-mode/my-profile-img.jpg"
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
        </div>
      </section>
    </main>
  )
}
