import crypto from "node:crypto";

import { describe, expect, it, vi } from "vitest";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn().mockResolvedValue(undefined),
  revalidateTag: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/lib/autoblogwriter", () => ({
  getCacheTags: vi.fn(() => ({
    posts: "autoblogwriter:demo:posts",
    post: (slug: string) => `autoblogwriter:demo:post:${slug}`,
    sitemap: "autoblogwriter:demo:sitemap",
    workspaceSlug: "demo",
  })),
}));

const { handleRevalidateWebhook } = await import("@/lib/revalidate");

function sign(body: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(body).digest("hex");
}

describe("revalidate handler", () => {
  it("returns 401 for invalid signature", async () => {
    process.env.AUTOBLOGWRITER_REVALIDATE_SECRET = "secret";

    const body = JSON.stringify({
      workspaceSlug: "demo",
      postSlug: "a",
      event: "post.published",
      ts: new Date().toISOString(),
    });

    const request = new Request("http://localhost/api/autoblogwriter/revalidate", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-AutoBlogWriter-Signature": "bad",
      },
      body,
    });

    const response = await handleRevalidateWebhook(request);
    expect(response.status).toBe(401);
  });

  it("returns 409 for stale payload", async () => {
    process.env.AUTOBLOGWRITER_REVALIDATE_SECRET = "secret";

    const body = JSON.stringify({
      workspaceSlug: "demo",
      postSlug: "a",
      event: "post.published",
      ts: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    });

    const request = new Request("http://localhost/api/autoblogwriter/revalidate", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-AutoBlogWriter-Signature": sign(body, "secret"),
      },
      body,
    });

    const response = await handleRevalidateWebhook(request);
    expect(response.status).toBe(409);
  });

  it("returns 200 for valid payload", async () => {
    process.env.AUTOBLOGWRITER_REVALIDATE_SECRET = "secret";

    const body = JSON.stringify({
      workspaceSlug: "demo",
      postSlug: "a",
      event: "post.published",
      ts: new Date().toISOString(),
    });

    const request = new Request("http://localhost/api/autoblogwriter/revalidate", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-AutoBlogWriter-Signature": sign(body, "secret"),
      },
      body,
    });

    const response = await handleRevalidateWebhook(request);
    expect(response.status).toBe(200);
  });
});
