"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { analyticsEvents } from "@/lib/analytics/events";
import { initPostHog, trackEvent } from "@/lib/posthog";

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    initPostHog();
  }, []);

  useEffect(() => {
    if (!pathname) {
      return;
    }

    if (pathname === "/blog") {
      trackEvent(analyticsEvents.BLOG_INDEX_VIEWED, {
        path: pathname,
      });
    }

    if (pathname.startsWith("/blog/") && pathname !== "/blog") {
      trackEvent(analyticsEvents.BLOG_POST_VIEWED, {
        path: pathname,
      });
    }

    trackEvent("$pageview", {
      $current_url: window.location.href,
    });
  }, [pathname]);

  return <>{children}</>;
}
