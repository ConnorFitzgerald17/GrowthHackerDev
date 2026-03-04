import crypto from "node:crypto";

import { describe, expect, it } from "vitest";

import { isFreshTimestamp, isValidSignature } from "@/lib/revalidate";

describe("revalidate security utils", () => {
  it("validates webhook signatures", () => {
    const secret = "topsecret";
    const body = JSON.stringify({ hello: "world" });
    const signature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    expect(isValidSignature(body, signature, secret)).toBe(true);
    expect(isValidSignature(body, `${signature}broken`, secret)).toBe(false);
  });

  it("rejects stale timestamps", () => {
    const fresh = new Date().toISOString();
    const stale = new Date(Date.now() - 10 * 60 * 1000).toISOString();

    expect(isFreshTimestamp(fresh)).toBe(true);
    expect(isFreshTimestamp(stale)).toBe(false);
  });
});
