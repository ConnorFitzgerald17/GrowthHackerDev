"use client";

import posthog from "posthog-js";

let isInitialized = false;

export function initPostHog(): void {
  if (isInitialized || typeof window === "undefined") {
    return;
  }

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) {
    return;
  }

  posthog.init(key, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
    person_profiles: "identified_only",
    capture_pageview: false,
    capture_pageleave: true,
    loaded: (instance) => {
      if (process.env.NODE_ENV === "development") {
        instance.debug();
      }
    },
  });

  isInitialized = true;
}

export function trackEvent(
  event: string,
  properties?: Record<string, string | number | boolean | null | undefined>,
): void {
  posthog.capture(event, properties);
}

export { posthog };
