"use client";

import { analyticsEvents } from "@/lib/analytics/events";
import { trackEvent } from "@/lib/posthog";

type AutoBlogWriterAttributionLinkProps = {
  href: string;
  className?: string;
  label?: string;
};

export function AutoBlogWriterAttributionLink({
  href,
  className,
  label = "Powered by AutoBlogWriter",
}: AutoBlogWriterAttributionLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => {
        trackEvent(analyticsEvents.AUTOBLOGWRITER_OUTBOUND_CLICKED, { href });
      }}
    >
      {label}
    </a>
  );
}
