/** @vitest-environment jsdom */

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { trackEventMock, identifyMock } = vi.hoisted(() => ({
  trackEventMock: vi.fn(),
  identifyMock: vi.fn(),
}));

vi.mock("@/lib/posthog", () => ({
  posthog: {
    identify: identifyMock,
  },
  trackEvent: trackEventMock,
}));

const { analyticsEvents } = await import("@/lib/analytics/events");
const { NewsletterWaitlistForm } = await import("@/components/newsletter-waitlist-form");

describe("NewsletterWaitlistForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  afterEach(() => {
    cleanup();
  });

  it("shows validation error for invalid email", async () => {
    render(<NewsletterWaitlistForm />);

    fireEvent.change(screen.getByRole("textbox", { name: /Email address/i }), {
      target: { value: "not-an-email" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Reserve your spot/i }));

    expect(await screen.findByText("Enter a valid email address.")).toBeInTheDocument();
  });

  it("tracks and identifies on valid submit", async () => {
    render(<NewsletterWaitlistForm source="newsletter_page" />);

    fireEvent.change(screen.getByRole("textbox", { name: /Email address/i }), {
      target: { value: "USER@Example.com " },
    });
    fireEvent.click(screen.getByRole("button", { name: /Reserve your spot/i }));

    await waitFor(() => {
      expect(identifyMock).toHaveBeenCalledWith("user@example.com", {
        email: "user@example.com",
        newsletter_waitlist: true,
      });
    });

    expect(trackEventMock).toHaveBeenCalledWith(
      analyticsEvents.NEWSLETTER_WAITLIST_SUBMITTED,
      expect.objectContaining({
        email: "user@example.com",
        source: "newsletter_page",
      }),
    );
    expect(
      screen.getByText("You are on the list. We will reach out at launch."),
    ).toBeInTheDocument();
  });

  it("shows fallback error if tracking fails", async () => {
    trackEventMock.mockImplementation((eventName: string) => {
      if (eventName === analyticsEvents.NEWSLETTER_WAITLIST_SUBMITTED) {
        throw new Error("posthog failed");
      }
    });

    render(<NewsletterWaitlistForm />);

    fireEvent.change(screen.getByRole("textbox", { name: /Email address/i }), {
      target: { value: "user@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Reserve your spot/i }));

    expect(
      await screen.findByText("We could not reserve your spot right now. Please try again."),
    ).toBeInTheDocument();
  });
});
