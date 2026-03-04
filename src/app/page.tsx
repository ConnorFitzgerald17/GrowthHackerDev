import type { Metadata } from "next";
import Link from "next/link";

import { NewsletterCtaLink } from "@/components/newsletter-cta-link";
import { PostCard } from "@/components/post-card";
import { getPosts } from "@/lib/autoblogwriter";
import { getSiteUrl } from "@/lib/env";

const SITE_DESCRIPTION =
  "Growth playbooks for technical builders using automation, AI workflows, and modern marketing tactics.";

export const metadata: Metadata = {
  title: "GrowthHackerDev",
  description: SITE_DESCRIPTION,
  alternates: { canonical: getSiteUrl() },
  openGraph: {
    type: "website",
    url: getSiteUrl(),
    title: "GrowthHackerDev",
    description: SITE_DESCRIPTION,
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "GrowthHackerDev",
    description: SITE_DESCRIPTION,
  },
};

const pillars = [
  {
    name: "Automation Lanes",
    desc: "Agentic workflows that remove manual bottlenecks.",
    icon: (
      <path d="M4 12h16M4 7h9M4 17h6M15 7l2-2 3 3-2 2M14 11l3 3" />
    ),
  },
  {
    name: "Search Architecture",
    desc: "Programmatic SEO systems built for technical products.",
    icon: (
      <path d="M10.5 4a6.5 6.5 0 015.18 10.44L20 18.75M16 10.5A5.5 5.5 0 115 10.5a5.5 5.5 0 0111 0z" />
    ),
  },
  {
    name: "Experiment Loops",
    desc: "Measure, iterate, and compound conversion insights.",
    icon: (
      <path d="M7 3v4l5 5m5 9H7a2 2 0 01-2-2v-2l5-5V7m2 0h6M8 21h8" />
    ),
  },
  {
    name: "Build Pipelines",
    desc: "Execution playbooks for fast operator teams.",
    icon: (
      <path d="M3 7h18M6 7V5a2 2 0 012-2h8a2 2 0 012 2v2m-1 4H7m3 0v6m4-6v6" />
    ),
  },
] as const;

export default async function Home() {
  const { posts } = await getPosts({ limit: 7 });
  const featured = posts[0];
  const latest = posts.slice(1, 7);

  const siteUrl = getSiteUrl();
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "GrowthHackerDev",
    url: siteUrl,
    description: SITE_DESCRIPTION,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/blog?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-20 pt-10 sm:px-8 sm:pt-14">
      <section className="motion-enter relative overflow-hidden rounded-[2rem] border border-line/70 bg-surface p-8 shadow-[0_20px_50px_-35px_var(--accent-glow)] sm:p-12">
        <div className="ambient-orb absolute -left-10 -top-16 h-40 w-40 rounded-full bg-accent-glow blur-3xl" />
        <div className="ambient-orb absolute -right-12 bottom-0 h-48 w-48 rounded-full bg-accent-glow/80 blur-3xl" />

        <div className="relative z-10 grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-alt px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
              <span className="h-2 w-2 rounded-full bg-accent" />
              Editorial Systems for Builders
            </p>
            <h1 className="mt-6 max-w-3xl text-5xl tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Growth engineering
              <span className="block text-accent">for product operators.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
              Tactical implementation logs on automation, SEO architecture, distribution loops,
              and the execution systems behind compounding product growth.
            </p>
            <div className="mt-9 flex flex-wrap gap-3 sm:gap-4">
              <Link
                href="/blog"
                className="inline-flex h-11 cursor-pointer items-center justify-center rounded-full bg-accent px-6 text-sm font-semibold text-accent-foreground! transition-colors duration-200 hover:bg-foreground hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Read latest articles
              </Link>
              <NewsletterCtaLink
                className="inline-flex h-11 items-center justify-center rounded-full border border-line bg-surface-alt px-6 text-sm font-semibold text-foreground transition-colors duration-200 hover:border-accent/50 hover:bg-accent-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                label="Coming soon: newsletter"
              />
            </div>
          </div>

          <div className="grid gap-3 self-end sm:grid-cols-2 lg:grid-cols-1">
            {pillars.map((pillar, index) => (
              <article
                key={pillar.name}
                className="motion-enter rounded-2xl border border-line/70 bg-surface-alt p-4"
                data-delay={(index + 1).toString()}
              >
                <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-surface text-accent">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-4 w-4" aria-hidden="true">
                    {pillar.icon}
                  </svg>
                </div>
                <h2 className="text-xl text-foreground">{pillar.name}</h2>
                <p className="mt-1 text-sm leading-relaxed text-muted">{pillar.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="motion-enter mt-16 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]" data-delay="1">
        <div className="rounded-[1.6rem] border border-line/70 bg-surface p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3 border-b border-line/70 pb-4">
            <h2 className="text-3xl text-foreground">Featured Architecture</h2>
            <span className="rounded-full border border-line bg-surface-alt px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-muted">
              Spotlight
            </span>
          </div>
          {featured ? (
            <div className="overflow-hidden rounded-2xl">
              <PostCard post={featured} isFeatured />
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-line bg-surface-alt p-8 text-center text-muted">
              No featured article yet. Publish your first post in AutoBlogWriter.
            </div>
          )}
        </div>

        <aside className="rounded-[1.6rem] border border-line/70 bg-surface p-5 sm:p-6">
          <h2 className="text-2xl text-foreground">Operator Notes</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Every post ships with practical implementation patterns and measurable outcomes.
          </p>
          <dl className="mt-6 space-y-4">
            <div className="rounded-xl border border-line bg-surface-alt px-4 py-3">
              <dt className="text-xs font-semibold uppercase tracking-[0.15em] text-muted">Coverage</dt>
              <dd className="mt-1 text-2xl text-foreground">AI, SEO, Distribution</dd>
            </div>
            <div className="rounded-xl border border-line bg-surface-alt px-4 py-3">
              <dt className="text-xs font-semibold uppercase tracking-[0.15em] text-muted">Format</dt>
              <dd className="mt-1 text-2xl text-foreground">Implementation-first</dd>
            </div>
            <div className="rounded-xl border border-line bg-surface-alt px-4 py-3">
              <dt className="text-xs font-semibold uppercase tracking-[0.15em] text-muted">Cadence</dt>
              <dd className="mt-1 text-2xl text-foreground">Weekly publication</dd>
            </div>
          </dl>
        </aside>
      </section>

      <section className="motion-enter mt-20" data-delay="2">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4 border-b border-line/70 pb-4">
          <div>
            <h2 className="text-4xl text-foreground">Engineering Logs</h2>
            <p className="mt-1 text-muted">The latest build notes and growth playbooks.</p>
          </div>
          <Link
            href="/blog"
            className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-line bg-surface-alt px-4 py-2 text-sm font-semibold text-foreground transition-colors duration-200 hover:border-accent/50 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            View archive
            <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-3.5 w-3.5" aria-hidden="true">
              <path d="M2 7h10M8 3l4 4-4 4" />
            </svg>
          </Link>
        </div>

        {latest.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-line bg-surface p-8 text-center text-muted">
            No posts available yet. Bootstrapping systems.
          </div>
        )}
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
    </main>
  );
}
