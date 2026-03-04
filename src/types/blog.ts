import type { Metadata } from "next";

export type PostSummary = {
  slug: string;
  title: string;
  excerpt: string;
  publishDate: string;
  readingTime: number;
  heroImage?: string;
  tags: string[];
};

export type PostDetail = PostSummary & {
  author?: { name: string; image?: string };
  html?: string;
  markdown?: string;
  faq?: Array<{ question: string; answer: string }>;
  relatedPosts?: PostSummary[];
  metadata?: {
    title?: string;
    description?: string;
    ogImageUrl?: string;
    canonicalUrl?: string;
    jsonLd?: Record<string, unknown>;
  };
};

export type BrandingPolicy = {
  brandingRequired: boolean;
};

export type PostListingResult = {
  posts: PostSummary[];
  nextCursor?: string | null;
};

export type PostMetadataResult = Metadata;

export type AutoBlogWriterWebhookPayload = {
  workspaceSlug: string;
  postSlug: string | null;
  event: string;
  ts: string;
};
