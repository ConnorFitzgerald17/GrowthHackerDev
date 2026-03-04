import { describe, expect, it, vi } from "vitest";

vi.mock("@autoblogwriter/sdk/next", () => ({
  generateBlogSitemap: vi.fn(),
  generateBlogRobots: vi.fn(),
}));

vi.mock("@/lib/autoblogwriter", () => ({
  getPosts: vi.fn(),
}));

const { generateBlogSitemap, generateBlogRobots } = await import(
  "@autoblogwriter/sdk/next"
);
const { getPosts } = await import("@/lib/autoblogwriter");
const { default: sitemap } = await import("@/app/sitemap");
const { default: robots } = await import("@/app/robots");

describe("SEO routes", () => {
  it("sitemap falls back without upstream crash", async () => {
    vi.mocked(generateBlogSitemap).mockRejectedValueOnce(new Error("upstream"));
    vi.mocked(getPosts).mockResolvedValueOnce({
      posts: [
        {
          slug: "hello-world",
          title: "Hello",
          excerpt: "",
          publishDate: "2026-03-01T00:00:00.000Z",
          readingTime: 3,
          tags: [],
        },
      ],
      nextCursor: null,
    });

    const result = await sitemap();
    expect(result[0]?.url).toContain("/blog/hello-world");
  });

  it("robots falls back with sitemap URL", () => {
    vi.mocked(generateBlogRobots).mockImplementationOnce(() => {
      throw new Error("upstream");
    });

    const result = robots();
    expect(result.sitemap).toBeDefined();
  });
});
