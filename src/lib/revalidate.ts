import "server-only";

import crypto from "node:crypto";

import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";

import { getCacheTags } from "@/lib/autoblogwriter";
import type { AutoBlogWriterWebhookPayload } from "@/types/blog";

const DEFAULT_SKEW_MS = 5 * 60 * 1000;

const payloadSchema = z.object({
  workspaceSlug: z.string().min(1),
  postSlug: z.string().nullable().default(null),
  event: z.string().min(1),
  ts: z.string().datetime(),
});

function normalizeSignature(rawSignature: string): string {
  return rawSignature.startsWith("sha256=")
    ? rawSignature.replace("sha256=", "")
    : rawSignature;
}

function isHexDigest(value: string): boolean {
  return /^[a-f0-9]{64}$/i.test(value);
}

export function isValidSignature(
  body: string,
  rawSignature: string,
  secret: string,
): boolean {
  const expected = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  const provided = normalizeSignature(rawSignature);
  if (!isHexDigest(provided)) {
    return false;
  }

  const expectedBuffer = Buffer.from(expected, "hex");
  const providedBuffer = Buffer.from(provided, "hex");

  if (expectedBuffer.length !== providedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, providedBuffer);
}

export function isFreshTimestamp(isoTimestamp: string, skewMs = DEFAULT_SKEW_MS): boolean {
  const timestamp = new Date(isoTimestamp).getTime();
  if (Number.isNaN(timestamp)) {
    return false;
  }

  return Math.abs(Date.now() - timestamp) <= skewMs;
}

export async function handleRevalidateWebhook(request: Request): Promise<Response> {
  const signature = request.headers.get("X-AutoBlogWriter-Signature");
  const secret = process.env.AUTOBLOGWRITER_REVALIDATE_SECRET;

  if (!signature || !secret) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let bodyText = "";
  try {
    bodyText = await request.text();
  } catch {
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (!isValidSignature(bodyText, signature, secret)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: AutoBlogWriterWebhookPayload;
  try {
    payload = payloadSchema.parse(JSON.parse(bodyText));
  } catch {
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (!isFreshTimestamp(payload.ts)) {
    return Response.json({ error: "Stale timestamp" }, { status: 409 });
  }

  try {
    const tags = getCacheTags();
    if (payload.workspaceSlug !== tags.workspaceSlug) {
      return Response.json({ error: "Workspace mismatch" }, { status: 400 });
    }

    await Promise.all([
      revalidatePath("/blog"),
      revalidatePath("/sitemap.xml"),
      revalidatePath("/robots.txt"),
      revalidateTag(tags.posts, "max"),
      revalidateTag(tags.sitemap, "max"),
      payload.postSlug ? revalidatePath(`/blog/${payload.postSlug}`) : Promise.resolve(),
      payload.postSlug ? revalidateTag(tags.post(payload.postSlug), "max") : Promise.resolve(),
    ]);

    return Response.json({ ok: true }, { status: 200 });
  } catch {
    return Response.json({ error: "Revalidation failed" }, { status: 500 });
  }
}
