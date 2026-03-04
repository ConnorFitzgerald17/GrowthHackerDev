/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/autoblogwriter", () => ({
  getPosts: vi.fn(),
}));

const { getPosts } = await import("@/lib/autoblogwriter");
const { default: BlogPage } = await import("@/app/blog/page");

describe("/blog page", () => {
  it("renders published posts", async () => {
    vi.mocked(getPosts).mockResolvedValueOnce({
      posts: [
        {
          slug: "test-post",
          title: "Test Post",
          excerpt: "Excerpt",
          publishDate: "2026-03-02T00:00:00.000Z",
          readingTime: 6,
          tags: ["SEO"],
        },
      ],
      nextCursor: null,
    });

    render(await BlogPage({ searchParams: Promise.resolve({}) }));
    expect(screen.getByText("Test Post")).toBeInTheDocument();
  });

  it("renders empty state", async () => {
    vi.mocked(getPosts).mockResolvedValueOnce({
      posts: [],
      nextCursor: null,
    });

    render(await BlogPage({ searchParams: Promise.resolve({}) }));
    expect(screen.getByText(/No published posts yet/i)).toBeInTheDocument();
  });
});
