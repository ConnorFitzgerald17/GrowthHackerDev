import Link from "next/link";

import { formatPublishDate } from "@/lib/format";
import type { PostSummary } from "@/types/blog";

type PostCardProps = {
  post: PostSummary;
  isFeatured?: boolean;
};

export function PostCard({ post, isFeatured = false }: PostCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block h-full cursor-pointer rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <article
        className={`relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-line/70 bg-surface p-6 transition-all duration-300 ease-out hover:border-accent/60 hover:shadow-[0_16px_36px_-24px_var(--accent-glow)] ${
          isFeatured ? "min-h-[380px]" : "min-h-[300px]"
        }`}
      >
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="absolute inset-0 bg-gradient-to-br from-accent-soft/80 via-transparent to-transparent" />
        </div>

        <div className="relative z-10">
          <div className="mb-4 flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-line bg-surface-alt px-2.5 py-1 text-xs font-semibold tracking-[0.03em] text-muted transition-colors duration-200 group-hover:border-accent/40 group-hover:text-foreground break-all"
              >
                {tag}
              </span>
            ))}
          </div>

          <h3
            className={`break-words leading-tight tracking-tight text-foreground transition-colors duration-200 group-hover:text-accent ${
              isFeatured ? "text-3xl sm:text-4xl" : "text-2xl"
            }`}
          >
            {post.title}
          </h3>

          <p className="mt-4 line-clamp-3 break-words text-sm leading-relaxed text-muted sm:text-base">
            {post.excerpt || "Dive into the implementation details and architectural decisions."}
          </p>
        </div>

        <div className="relative z-10 mt-8 flex items-center justify-between border-t border-line/70 pt-4 text-xs font-semibold uppercase tracking-[0.08em] text-muted sm:text-sm">
          <span>{formatPublishDate(post.publishDate)}</span>
          <span>{post.readingTime} min read</span>
        </div>
      </article>
    </Link>
  );
}
