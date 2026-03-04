import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { PostCard } from "@/components/post-card";
import { getPosts } from "@/lib/autoblogwriter";
import { getSiteUrl } from "@/lib/env";

const BLOG_DESCRIPTION =
  "Growth engineering tutorials for developers across AI workflows, SEO systems, and modern marketing tactics.";

export const metadata: Metadata = {
  title: "Blog | GrowthHackerDev",
  description: BLOG_DESCRIPTION,
  alternates: {
    canonical: `${getSiteUrl()}/blog`,
  },
  openGraph: {
    type: "website",
    title: "Blog | GrowthHackerDev",
    description: BLOG_DESCRIPTION,
    url: `${getSiteUrl()}/blog`,
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | GrowthHackerDev",
    description: BLOG_DESCRIPTION,
  },
};

type BlogPageProps = {
  searchParams?: Promise<{
    cursor?: string;
  }>;
};

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const cursor = resolvedSearchParams.cursor;

  const { posts, nextCursor } = await getPosts({
    cursor,
    limit: 12,
  });

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-20 pt-8 sm:px-8 sm:pt-10">
      <div className="motion-enter" data-delay="1">
        <Breadcrumbs items={[{ label: "Archive" }]} />
      </div>

      <header className="motion-enter relative overflow-hidden rounded-[1.8rem] border border-line/70 bg-surface p-7 sm:p-10" data-delay="1">
        <div className="ambient-orb absolute -left-8 -top-12 h-32 w-32 rounded-full bg-accent-glow blur-3xl" />
        <div className="relative z-10 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-alt px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
              <span className="h-2 w-2 rounded-full bg-accent" />
              Archive
            </p>
            <h1 className="mt-4 text-5xl tracking-tight text-foreground sm:text-6xl">Engineered strategies</h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
              Implementation-first playbooks for technical builders, covering growth loops,
              AI automation, and scalable acquisition architecture.
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-surface-alt px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted">Available entries</p>
            <p className="text-3xl text-foreground">{posts.length}</p>
          </div>
        </div>
      </header>

      <section className="motion-enter mt-10" data-delay="2">
        {posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line bg-surface p-12 text-center">
            <p className="text-2xl text-foreground">No published posts yet</p>
            <p className="mt-2 text-muted">Initialize your first article in AutoBlogWriter to populate this feed.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </section>

      <nav className="motion-enter mt-12 flex items-center justify-center border-t border-line/70 pt-8" data-delay="3">
        {nextCursor ? (
          <Link
            href={`/blog?cursor=${encodeURIComponent(nextCursor)}`}
            className="inline-flex h-11 cursor-pointer items-center justify-center rounded-full border border-line bg-surface-alt px-6 text-sm font-semibold text-foreground transition-colors duration-200 hover:border-accent/50 hover:bg-accent-soft hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Load older entries
          </Link>
        ) : (
          <span className="text-sm font-medium uppercase tracking-[0.14em] text-muted">End of entries</span>
        )}
      </nav>
    </main>
  );
}
