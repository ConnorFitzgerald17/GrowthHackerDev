"use client";

import Link from "next/link";

import { analyticsEvents } from "@/lib/analytics/events";
import { trackEvent } from "@/lib/posthog";

type NewsletterCtaLinkProps = {
  href?: string;
  className?: string;
  label?: string;
};

export function NewsletterCtaLink({
  href = "/newsletter",
  className,
  label = "Reserve your spot",
}: NewsletterCtaLinkProps) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => {
        trackEvent(analyticsEvents.NEWSLETTER_CTA_CLICKED, { href });
      }}
    >
      {label}
    </Link>
  );
}
