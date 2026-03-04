import type { Metadata } from "next";

import { NewsletterWaitlistForm } from "@/components/newsletter-waitlist-form";
import { getSiteUrl } from "@/lib/env";

export const metadata: Metadata = {
  title: "Newsletter | GrowthHackerDev",
  description:
    "Coming soon: the GrowthHackerDev newsletter. Reserve your spot for implementation-first growth systems, automation playbooks, and SEO architecture deep dives.",
  alternates: {
    canonical: `${getSiteUrl()}/newsletter`,
  },
};

export default function NewsletterPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 pb-20 pt-10 sm:px-8 sm:pt-14">
      <section className="motion-enter relative overflow-hidden rounded-[2rem] border border-line/70 bg-surface p-8 shadow-[0_20px_50px_-35px_var(--accent-glow)] sm:p-12">
        <div className="ambient-orb absolute -left-10 -top-16 h-40 w-40 rounded-full bg-accent-glow blur-3xl" />
        <div className="ambient-orb absolute -right-12 bottom-0 h-48 w-48 rounded-full bg-accent-glow/80 blur-3xl" />

        <div className="relative z-10">
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-alt px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
            <span className="h-2 w-2 rounded-full bg-accent" />
            Coming soon
          </p>
          <h1 className="mt-6 max-w-3xl text-5xl tracking-tight text-foreground sm:text-6xl">
            Reserve your spot in the GrowthHackerDev newsletter.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            Limited spaces for early readers. Get launch access to weekly playbooks on growth
            loops, AI automation, and search architecture for technical products.
          </p>

          <ul className="mt-8 space-y-3 text-sm text-muted sm:text-base">
            <li className="rounded-xl border border-line bg-surface-alt px-4 py-3">
              Weekly implementation breakdowns with real workflows
            </li>
            <li className="rounded-xl border border-line bg-surface-alt px-4 py-3">
              Reusable templates for SEO and distribution systems
            </li>
            <li className="rounded-xl border border-line bg-surface-alt px-4 py-3">
              Early access notes before articles hit the public archive
            </li>
          </ul>

          <NewsletterWaitlistForm className="mt-8 max-w-2xl" />

          <p className="mt-4 text-sm text-muted">No spam. Unsubscribe anytime.</p>
        </div>
      </section>
    </main>
  );
}
