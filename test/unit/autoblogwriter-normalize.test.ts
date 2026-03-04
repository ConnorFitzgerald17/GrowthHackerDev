import { describe, expect, it } from "vitest";

import { __testables } from "@/lib/autoblogwriter";

describe("autoblogwriter normalization", () => {
  it("normalizes post summary and detail shape", () => {
    const post = {
      id: "post_1",
      title: "Programmatic SEO With Next.js",
      slug: "programmatic-seo-nextjs",
      excerpt: "A technical walkthrough",
      categories: ["SEO", "Next.js"],
      content: "# Hello world",
      status: "PUBLISHED",
      metadata: {
        readingTimeMinutes: 8,
        heroImageUrl: "https://cdn.example.com/hero.png",
        ogImageUrl: "https://cdn.example.com/og.png",
      },
      relatedPosts: [
        {
          id: "post_2",
          slug: "related-post",
          title: "Related",
          excerpt: "Related excerpt",
          updatedAt: "2026-03-01T00:00:00.000Z",
          categories: ["AI"],
        },
      ],
      publishedAt: "2026-03-02T00:00:00.000Z",
      updatedAt: "2026-03-02T00:00:00.000Z",
      seo: {
        title: "SEO Title",
        description: "SEO Description",
      },
      faq: {
        items: [
          {
            question: "What is programmatic SEO?",
            answer: "A system to scale targeted pages with templates and data.",
          },
        ],
      },
    } as const;

    const summary = __testables.toSummary(post as never);
    expect(summary.slug).toBe("programmatic-seo-nextjs");
    expect(summary.readingTime).toBe(8);
    expect(summary.tags).toEqual(["SEO", "Next.js"]);

    const detail = __testables.toDetail(post as never);
    expect(detail.metadata?.title).toBe("SEO Title");
    expect(detail.relatedPosts?.[0]?.slug).toBe("related-post");
    expect(detail.faq?.[0]?.question).toContain("programmatic SEO");
    expect(detail.html).toContain("<h1>");
  });
});
