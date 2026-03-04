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
  const faqJsonLd = post.faq?.length ? buildFaqJsonLd(post.faq) : null;

  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-20 pt-8 sm:px-8">
      <div className="motion-enter" data-delay="1">
        <Breadcrumbs items={[{ label: "Archive", href: "/blog" }, { label: post.title }]} />
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

          <h1 className="max-w-4xl text-4xl tracking-tight text-foreground sm:text-5xl md:text-6xl">{post.title}</h1>

          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line/70 pt-4 text-sm font-medium text-muted">
            <span className="inline-flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-line bg-surface-alt text-xs font-semibold text-foreground">
                {post.author?.name?.[0] ?? "G"}
              </span>
              {post.author?.name ?? "GrowthHackerDev"}
            </span>
            <span aria-hidden="true">•</span>
            <time dateTime={post.publishDate}>{formatPublishDate(post.publishDate)}</time>
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

        <div className="mt-10 rounded-3xl border border-line/70 bg-surface p-6 sm:p-10">
          <div
            className="ghd-post-content"
            dangerouslySetInnerHTML={{
              __html: post.html ?? "",
            }}
          />
        </div>
      </article>

      {post.relatedPosts && post.relatedPosts.length > 0 ? (
        <section className="motion-enter mt-16" data-delay="2">
          <div className="mb-6 flex items-center justify-between gap-4 border-b border-line/70 pb-4">
            <h2 className="text-3xl text-foreground">System parallels</h2>
            <span className="rounded-full border border-line bg-surface-alt px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              Related reads
            </span>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {post.relatedPosts.slice(0, 4).map((related) => (
              <Link
                key={related.slug}
                href={`/blog/${related.slug}`}
                className="group flex min-h-[190px] cursor-pointer flex-col justify-between rounded-2xl border border-line/70 bg-surface p-5 transition-all duration-200 hover:border-accent/60 hover:bg-surface-alt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <div>
                  <h3 className="text-2xl leading-tight text-foreground transition-colors duration-200 group-hover:text-accent">
                    {related.title}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">{related.excerpt}</p>
                </div>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent">
                  Read article
                  <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-3.5 w-3.5" aria-hidden="true">
                    <path d="M2 7h10M8 3l4 4-4 4" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {post.faq && post.faq.length > 0 ? (
        <section className="motion-enter mt-16" data-delay="2">
          <h2 className="mb-6 text-center text-3xl text-foreground">Implementation FAQ</h2>
          <div className="mx-auto max-w-3xl space-y-3">
            {post.faq.map((item) => (
              <details
                key={item.question}
                className="group overflow-hidden rounded-2xl border border-line/70 bg-surface [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-left text-lg font-semibold text-foreground transition-colors duration-200 hover:bg-surface-alt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background">
                  {item.question}
                  <span className="ml-4 inline-flex h-7 w-7 items-center justify-center rounded-full border border-line bg-surface-alt text-muted transition-transform duration-200 group-open:rotate-180 group-open:text-accent">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden="true">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </span>
                </summary>
                <div className="border-t border-line/70 px-5 py-4 text-muted">
                  <p className="leading-relaxed">{item.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </section>
      ) : null}

      <section className="motion-enter relative mt-20 overflow-hidden rounded-[1.9rem] border border-line bg-surface p-8 text-center sm:p-10" data-delay="3">
        <div className="ambient-orb absolute -right-6 -top-8 h-36 w-36 rounded-full bg-accent-glow blur-3xl" />
        <h2 className="relative text-4xl text-foreground">Ship growth systems faster</h2>
        <p className="relative mx-auto mt-3 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
          Coming soon: reserve your spot in the newsletter. Limited spaces for early readers
          getting weekly deep dives into scaling technical products and SEO architecture.
        </p>
        <NewsletterCtaLink
          className="relative mt-7 inline-flex h-11 items-center justify-center rounded-full bg-accent px-8 text-sm font-semibold text-accent-foreground! transition-colors duration-200 hover:bg-foreground hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          label="Reserve your spot"
        />
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {faqJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      ) : null}
    </main>
  );
}
