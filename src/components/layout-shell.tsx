import Image from "next/image";
import Link from "next/link";

import { AutoBlogWriterAttributionLink } from "@/components/autoblogwriter-attribution-link";
import { ThemeToggle } from "@/components/theme-toggle";
import { AUTOBLOGWRITER_REFERRAL_URL } from "@/lib/constants";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-line/70 bg-background/85 backdrop-blur-lg">
      <div className="mx-auto flex min-h-[4.5rem] w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-8">
        <div className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/"
            className="group inline-flex cursor-pointer items-center gap-2 rounded-full border border-line/70 bg-surface px-2.5 py-1.5 transition-colors duration-200 hover:border-accent/60 hover:bg-surface-alt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <span className="inline-flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-surface-alt">
              <Image
                src="/logo2.png"
                alt="GrowthHackerDev logo"
                width={28}
                height={28}
                className="h-7 w-7 object-cover"
                priority
              />
            </span>
            <span className="hidden pr-2 text-sm font-semibold tracking-[0.07em] text-foreground sm:inline-block sm:text-base">
              GrowthHackerDev
            </span>
          </Link>

          <nav className="hidden items-center gap-5 md:flex">
            <Link
              href="/blog"
              className="cursor-pointer text-sm font-semibold text-muted transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Archive
            </Link>
            <Link
              href="/newsletter"
              className="cursor-pointer text-sm font-semibold text-muted transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Newsletter
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <Link
            href="/newsletter"
            className="inline-flex h-10 cursor-pointer items-center justify-center rounded-full border border-accent/40 bg-accent-soft px-4 text-sm font-semibold text-foreground transition-colors duration-200 hover:border-accent hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Subscribe
          </Link>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line/70 bg-surface/65">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-10 sm:flex-row sm:items-center sm:px-8">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-surface-alt">
            <Image
              src="/logo2.png"
              alt="GrowthHackerDev logo"
              width={24}
              height={24}
              className="h-6 w-6 object-cover"
            />
          </span>
          <div className="space-y-1">
            <p className="text-sm font-semibold tracking-[0.06em] text-foreground">GrowthHackerDev</p>
            <p className="text-sm text-muted">© {new Date().getFullYear()} GrowthHackerDev. Built for technical operators.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-5">
          <Link
            href="/blog"
            className="cursor-pointer text-sm font-medium text-muted transition-colors duration-200 hover:text-foreground"
          >
            Archive
          </Link>
          <Link
            href="/newsletter"
            className="cursor-pointer text-sm font-medium text-muted transition-colors duration-200 hover:text-foreground"
          >
            Newsletter
          </Link>
          <AutoBlogWriterAttributionLink
            href={AUTOBLOGWRITER_REFERRAL_URL}
            className="text-sm font-semibold text-accent transition-colors duration-200 hover:text-foreground"
          />
        </div>
      </div>
    </footer>
  );
}
