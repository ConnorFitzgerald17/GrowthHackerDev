/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/posthog", () => ({
  posthog: { identify: vi.fn() },
  trackEvent: vi.fn(),
}));

const { default: NewsletterPage } = await import("@/app/newsletter/page");

describe("/newsletter page", () => {
  it("renders coming soon waitlist content and form controls", () => {
    render(<NewsletterPage />);

    expect(screen.getByText(/Coming soon/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /Reserve your spot in the GrowthHackerDev newsletter/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /Email address/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Reserve your spot/i })).toBeInTheDocument();
  });
});
