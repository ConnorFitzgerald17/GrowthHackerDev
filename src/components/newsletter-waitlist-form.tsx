"use client";

import { FormEvent, useEffect, useState } from "react";
import { z } from "zod";

import { analyticsEvents } from "@/lib/analytics/events";
import { posthog, trackEvent } from "@/lib/posthog";

const emailSchema = z.string().trim().email("Enter a valid email address.");

type NewsletterWaitlistFormProps = {
  source?: string;
  className?: string;
};

export function NewsletterWaitlistForm({
  source = "newsletter_page",
  className,
}: NewsletterWaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [state, setState] = useState<"idle" | "submitting" | "success" | "error">("idle");

  useEffect(() => {
    trackEvent(analyticsEvents.NEWSLETTER_WAITLIST_VIEWED, { source });
  }, [source]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    const parsedEmail = emailSchema.safeParse(email);
    if (!parsedEmail.success) {
      setState("idle");
      setErrorMessage(parsedEmail.error.issues[0]?.message ?? "Enter a valid email address.");
      return;
    }

    setState("submitting");

    try {
      const normalizedEmail = parsedEmail.data.toLowerCase();
      posthog.identify(normalizedEmail, {
        email: normalizedEmail,
        newsletter_waitlist: true,
      });

      trackEvent(analyticsEvents.NEWSLETTER_WAITLIST_SUBMITTED, {
        email: normalizedEmail,
        source,
      });

      setEmail("");
      setState("success");
    } catch {
      setState("error");
      setErrorMessage("We could not reserve your spot right now. Please try again.");
    }
  }

  return (
    <form className={className} onSubmit={onSubmit} noValidate>
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id="newsletter-email"
          name="email"
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (errorMessage) {
              setErrorMessage(null);
            }
            if (state === "success" || state === "error") {
              setState("idle");
            }
          }}
          placeholder="name@company.com"
          autoComplete="email"
          className="h-11 w-full rounded-full border border-line bg-surface px-4 text-sm text-foreground outline-none transition-colors duration-200 placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/35"
          aria-invalid={errorMessage ? "true" : "false"}
          aria-describedby={errorMessage ? "newsletter-email-error" : undefined}
          disabled={state === "submitting"}
          required
        />
        <button
          type="submit"
          className="inline-flex h-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-accent px-6 text-sm font-semibold text-accent-foreground transition-colors duration-200 hover:bg-foreground hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-70"
          disabled={state === "submitting"}
        >
          {state === "submitting" ? "Reserving..." : "Reserve your spot"}
        </button>
      </div>

      {errorMessage ? (
        <p id="newsletter-email-error" className="mt-3 text-sm text-[color:#b42318]">
          {errorMessage}
        </p>
      ) : null}
      {state === "success" ? (
        <p className="mt-3 text-sm text-accent">You are on the list. We will reach out at launch.</p>
      ) : null}
      {state === "error" && !errorMessage ? (
        <p className="mt-3 text-sm text-[color:#b42318]">
          We could not reserve your spot right now. Please try again.
        </p>
      ) : null}
    </form>
  );
}
