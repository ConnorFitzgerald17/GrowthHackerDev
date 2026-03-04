/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/autoblogwriter", () => ({
  getPosts: vi.fn(),
}));

const { getPosts } = await import("@/lib/autoblogwriter");
const { default: HomePage } = await import("@/app/page");

describe("/ page", () => {
  it("renders coming soon newsletter CTA", async () => {
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

    render(await HomePage());

    expect(
      screen.getByRole("link", { name: "Coming soon: newsletter" }),
    ).toBeInTheDocument();
  });
});
