export const analyticsEvents = {
  BLOG_INDEX_VIEWED: "blog_index_viewed",
  BLOG_POST_VIEWED: "blog_post_viewed",
  NEWSLETTER_CTA_CLICKED: "newsletter_cta_clicked",
  NEWSLETTER_WAITLIST_VIEWED: "newsletter_waitlist_viewed",
  NEWSLETTER_WAITLIST_SUBMITTED: "newsletter_waitlist_submitted",
  AUTOBLOGWRITER_OUTBOUND_CLICKED: "autoblogwriter_outbound_clicked",
} as const;

export type AnalyticsEventName =
  (typeof analyticsEvents)[keyof typeof analyticsEvents];
