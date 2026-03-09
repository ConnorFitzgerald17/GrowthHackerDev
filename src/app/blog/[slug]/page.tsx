import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { NewsletterCtaLink } from "@/components/newsletter-cta-link";
import { formatPublishDate } from "@/lib/format";
import {
  buildBlogPostingJsonLd,
  buildFaqJsonLd,
  getPostBySlug,
  getPostMetadata,
} from "@/lib/autoblogwriter";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  return getPostMetadata(slug);
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const jsonLd = post.metadata?.jsonLd ?? buildBlogPostingJsonLd(post);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-20 pt-8 sm:px-8">
      <div className="motion-enter" data-delay="1">
        <Breadcrumbs
          items={[{ label: "Archive", href: "/blog" }, { label: post.title }]}
        />
      </div>

      <article className="motion-enter relative" data-delay="1">
        <div className="ambient-orb pointer-events-none absolute left-1/2 top-0 h-56 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-glow blur-3xl" />

        <header className="relative z-10 rounded-[1.8rem] border border-line/70 bg-surface p-6 sm:p-10">
          <div className="mb-6 flex flex-wrap gap-2">
            {post.tags?.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-line bg-surface-alt px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-muted"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="max-w-4xl text-4xl tracking-tight text-foreground sm:text-5xl md:text-6xl">
            {post.title}
          </h1>

          {/* Powered by badge */}
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-line bg-surface-alt px-3 py-1 text-xs font-medium text-muted">
            ⚡ Powered by{" "}
            <Link
              href={`https://autoblogwriter.app/?utm_source=growthhackerdev&utm_medium=blog&utm_campaign=title_badge_${slug}`}
              target="_blank"
              className="font-semibold text-accent hover:underline"
            >
              AutoBlogWriter
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line/70 pt-4 text-sm font-medium text-muted">
            <span className="inline-flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-line bg-surface-alt text-xs font-semibold text-foreground">
                {post.author?.name?.[0] ?? "G"}
              </span>
              {post.author?.name ?? "GrowthHackerDev"}
            </span>
            <span aria-hidden="true">•</span>
            <time dateTime={post.publishDate}>
              {formatPublishDate(post.publishDate)}
            </time>
            <span aria-hidden="true">•</span>
            <span>{post.readingTime} min read</span>
          </div>
        </header>

        {post.heroImage ? (
          <div className="relative mt-8 overflow-hidden rounded-3xl border border-line bg-surface">
            <Image
              src={post.heroImage}
              alt={post.title}
              width={1400}
              height={700}
              className="h-auto w-full object-cover transition-transform duration-500 ease-out hover:scale-[1.02]"
              priority
            />
          </div>
        ) : (
          <div className="mt-8" />
        )}

        {/* Article */}
        <div className="mt-10 rounded-3xl border border-line/70 bg-surface p-6 sm:p-10">
          <div
            className="ghd-post-content"
            dangerouslySetInnerHTML={{
              __html: post.html ?? "",
            }}
          />
        </div>
      </article>

      {/* Product CTA */}
      <section className="motion-enter mt-14" data-delay="2">
        <div className="relative overflow-hidden rounded-3xl border border-line bg-surface p-8">
          <div className="ambient-orb absolute -right-6 -top-8 h-40 w-40 rounded-full bg-accent-glow blur-3xl" />

          <p className="text-xs uppercase tracking-wider text-muted">
            Behind this blog
          </p>

          <h3 className="mt-2 text-2xl font-semibold text-foreground">
            AutoBlogWriter
          </h3>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
            This blog runs on AutoBlogWriter. It automates the entire content
            pipeline including research, SEO structure, article generation,
            images, and publishing.
          </p>

          <Link
            href={`https://autoblogwriter.app/?utm_source=growthhackerdev&utm_medium=blog&utm_campaign=product_card_${slug}`}
            target="_blank"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2 text-sm font-semibold text-accent-foreground transition-colors hover:bg-foreground hover:text-background"
          >
            See how the system works
          </Link>
        </div>
      </section>

      {/* Related posts */}
      {post.relatedPosts && post.relatedPosts.length > 0 ? (
        <section className="motion-enter mt-16" data-delay="2">
          <div className="mb-6 flex items-center justify-between gap-4 border-b border-line/70 pb-4">
            <h2 className="text-3xl text-foreground">System parallels</h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {post.relatedPosts.slice(0, 4).map((related) => (
              <Link
                key={related.slug}
                href={`/blog/${related.slug}`}
                className="group flex min-h-[190px] flex-col justify-between rounded-2xl border border-line/70 bg-surface p-5 transition-all hover:border-accent/60 hover:bg-surface-alt"
              >
                <div>
                  <h3 className="text-2xl text-foreground group-hover:text-accent">
                    {related.title}
                  </h3>
                  <p className="mt-3 text-sm text-muted">
                    {related.excerpt}
                  </p>
                </div>

                <span className="mt-6 text-sm font-semibold text-accent">
                  Read article →
                </span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {/* Newsletter */}
      <section className="motion-enter relative mt-20 overflow-hidden rounded-[1.9rem] border border-line bg-surface p-8 text-center sm:p-10">
        <div className="ambient-orb absolute -right-6 -top-8 h-36 w-36 rounded-full bg-accent-glow blur-3xl" />

        <h2 className="text-4xl text-foreground">
          Ship growth systems faster
        </h2>

        <p className="mx-auto mt-3 max-w-2xl text-base text-muted">
          Reserve your spot for weekly deep dives into technical growth,
          SEO architecture, and scalable product systems.
        </p>

        <NewsletterCtaLink
          className="mt-7 inline-flex h-11 items-center justify-center rounded-full bg-accent px-8 text-sm font-semibold text-accent-foreground transition-colors hover:bg-foreground hover:text-background"
          label="Reserve your spot"
        />
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}
