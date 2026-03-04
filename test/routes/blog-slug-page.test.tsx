/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const notFoundMock = vi.fn(() => {
  throw new Error("NOT_FOUND");
});

vi.mock("next/navigation", () => ({
  notFound: notFoundMock,
}));

vi.mock("next/image", () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} alt={props.alt ?? ""} />
  ),
}));

vi.mock("@/lib/autoblogwriter", () => ({
  getPostBySlug: vi.fn(),
  getPostMetadata: vi.fn(),
  buildBlogPostingJsonLd: vi.fn(() => ({ "@type": "BlogPosting" })),
  buildFaqJsonLd: vi.fn(() => ({ "@type": "FAQPage" })),
}));

const { getPostBySlug } = await import("@/lib/autoblogwriter");
const { default: BlogPostPage } = await import("@/app/blog/[slug]/page");

describe("/blog/[slug] page", () => {
  it("renders valid post", async () => {
    vi.mocked(getPostBySlug).mockResolvedValueOnce({
      slug: "valid-post",
      title: "Valid Post",
      excerpt: "Post excerpt",
      publishDate: "2026-03-01T00:00:00.000Z",
      readingTime: 7,
      tags: ["AI"],
      author: { name: "GrowthHackerDev" },
      html: "<p>Hello</p>",
      metadata: {},
      relatedPosts: [],
    });

    render(await BlogPostPage({ params: Promise.resolve({ slug: "valid-post" }) }));
    expect(
      screen.getByRole("heading", { level: 1, name: "Valid Post" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Reserve your spot" })).toBeInTheDocument();
  });

  it("calls notFound for unknown slug", async () => {
    vi.mocked(getPostBySlug).mockResolvedValueOnce(null);

    await expect(
      BlogPostPage({ params: Promise.resolve({ slug: "missing" }) }),
    ).rejects.toThrow("NOT_FOUND");
  });
});
