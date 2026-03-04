import "server-only";

import {
  NotFoundError,
  createAutoBlogWriterFromEnv,
  renderMarkdownToHtml,
  type BlogPost,
} from "@autoblogwriter/sdk";
import { generatePostMetadata } from "@autoblogwriter/sdk/next";
import type { Metadata } from "next";

import { getSiteUrl } from "@/lib/env";
import type {
  BrandingPolicy,
  PostDetail,
  PostListingResult,
  PostMetadataResult,
  PostSummary,
} from "@/types/blog";

const DEFAULT_REVALIDATE_SECONDS = 300;
const DEFAULT_AUTHOR = "GrowthHackerDev";

function getClientConfigOrNull() {
  try {
    return createAutoBlogWriterFromEnv();
  } catch {
    return null;
  }
}

function toSummary(post: BlogPost): PostSummary {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt ?? "",
    publishDate: post.publishedAt ?? post.updatedAt,
    readingTime: post.metadata?.readingTimeMinutes ?? 5,
    heroImage: post.metadata?.heroImageUrl ?? post.images?.hero?.url,
    tags: post.categories ?? [],
  };
}

function toDetail(post: BlogPost): PostDetail {
  const summary = toSummary(post);

  return {
    ...summary,
    author: { name: DEFAULT_AUTHOR },
    markdown: post.content,
    html: renderMarkdownToHtml(post.content),
    faq: post.faq?.items ?? [],
    relatedPosts:
      post.relatedPosts?.map((related) => ({
        slug: related.slug,
        title: related.title,
        excerpt: related.excerpt ?? "",
        publishDate: related.publishedAt ?? related.updatedAt,
        readingTime: 5,
        tags: related.categories ?? [],
      })) ?? [],
    metadata: {
      title: post.seo?.title ?? post.title,
      description: post.seo?.description ?? post.excerpt ?? "",
      ogImageUrl: post.metadata?.ogImageUrl,
      canonicalUrl: post.metadata?.canonicalUrl,
      jsonLd: post.metadata?.jsonLd,
    },
  };
}

export async function getPosts(options?: {
  cursor?: string;
  limit?: number;
}): Promise<PostListingResult> {
  const cfg = getClientConfigOrNull();
  if (!cfg) {
    return { posts: [], nextCursor: null };
  }

  try {
    const response = await cfg.client.getPosts({
      limit: options?.limit,
      cursor: options?.cursor,
      next: {
        revalidate: DEFAULT_REVALIDATE_SECONDS,
        tags: [cfg.tags.posts],
      },
    });

    return {
      posts: response.posts.map(toSummary),
      nextCursor: response.nextCursor ?? null,
    };
  } catch {
    return { posts: [], nextCursor: null };
  }
}

export async function getPostBySlug(slug: string): Promise<PostDetail | null> {
  const cfg = getClientConfigOrNull();
  if (!cfg) {
    return null;
  }

  try {
    const post = await cfg.client.getPostBySlug(slug, {
      next: {
        revalidate: DEFAULT_REVALIDATE_SECONDS,
        tags: [cfg.tags.post(slug)],
      },
    });

    if (!post) {
      return null;
    }

    return toDetail(post);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return null;
    }
    return null;
  }
}

export async function getBrandingPolicy(): Promise<BrandingPolicy> {
  const cfg = getClientConfigOrNull();
  if (!cfg) {
    return { brandingRequired: false };
  }

  try {
    const response = await cfg.client.getPosts({
      limit: 1,
      next: {
        revalidate: DEFAULT_REVALIDATE_SECONDS,
        tags: [cfg.tags.posts],
      },
    });

    return {
      brandingRequired: Boolean(response.branding?.brandingRequired),
    };
  } catch {
    return { brandingRequired: false };
  }
}

export async function getPostMetadata(slug: string): Promise<PostMetadataResult> {
  const siteUrl = getSiteUrl();

  try {
    const sdkMeta = await generatePostMetadata(slug);
    return {
      ...sdkMeta,
      alternates: {
        ...sdkMeta.alternates,
        canonical: `${siteUrl}/blog/${slug}`,
      },
    } satisfies Metadata;
  } catch {
    const post = await getPostBySlug(slug);
    if (!post) {
      return {
        title: "Post not found | GrowthHackerDev",
        description: "This article could not be found.",
      };
    }

    return {
      title: post.metadata?.title ?? post.title,
      description: post.metadata?.description ?? post.excerpt,
      alternates: {
        canonical: post.metadata?.canonicalUrl ?? `${siteUrl}/blog/${slug}`,
      },
      openGraph: {
        title: post.metadata?.title ?? post.title,
        description: post.metadata?.description ?? post.excerpt,
        url: `${siteUrl}/blog/${slug}`,
        images: post.metadata?.ogImageUrl
          ? [{ url: post.metadata.ogImageUrl }]
          : undefined,
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: post.metadata?.title ?? post.title,
        description: post.metadata?.description ?? post.excerpt,
        images: post.metadata?.ogImageUrl ? [post.metadata.ogImageUrl] : undefined,
      },
      robots: {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
      },
    } satisfies Metadata;
  }
}

export function getCacheTags(): {
  posts: string;
  post: (slug: string) => string;
  sitemap: string;
  workspaceSlug: string;
} {
  const cfg = createAutoBlogWriterFromEnv();
  return {
    posts: cfg.tags.posts,
    post: cfg.tags.post,
    sitemap: cfg.tags.sitemap,
    workspaceSlug: cfg.workspaceSlug,
  };
}

export function buildBlogPostingJsonLd(post: PostDetail): Record<string, unknown> {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishDate,
    dateModified: post.publishDate,
    author: {
      "@type": "Person",
      name: post.author?.name ?? DEFAULT_AUTHOR,
    },
    image: post.heroImage,
    url: `${siteUrl}/blog/${post.slug}`,
  };
}

export function buildFaqJsonLd(
  faqItems: Array<{ question: string; answer: string }>,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export const __testables = {
  toSummary,
  toDetail,
};
