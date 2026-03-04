# Launch Runbook (v1)

## 1. Environment Verification

1. Confirm required vars exist in deployment:
- `AUTOBLOGWRITER_API_KEY`
- `AUTOBLOGWRITER_WORKSPACE_SLUG`
- `AUTOBLOGWRITER_REVALIDATE_SECRET`
- `SITE_URL`
- `NEXT_PUBLIC_POSTHOG_KEY`
2. Confirm optional vars where applicable:
- `AUTOBLOGWRITER_API_URL`
- `AUTOBLOGWRITER_WORKSPACE_ID`
- `AUTOBLOGWRITER_DEBUG`
- `NEXT_PUBLIC_POSTHOG_HOST`

## 2. Webhook Validation Sequence

1. Publish or update one article in AutoBlogWriter.
2. Confirm webhook sends `POST /api/autoblogwriter/revalidate`.
3. Confirm endpoint returns HTTP `200`.
4. Confirm `/blog`, `/blog/{slug}`, `/sitemap.xml`, and `/robots.txt` refresh within 5 minutes.
5. Confirm invalid signature test returns HTTP `401`.
6. Confirm stale timestamp test returns HTTP `409`.

## 3. Post-Publish Verification

1. Verify post appears on `/blog` and `/blog/{slug}`.
2. Verify canonical, OG, and JSON-LD on article page.
3. Verify sitemap includes new URL with `lastModified`.
4. Verify robots file includes sitemap URL.
5. Verify RSS includes newly published post.
6. Verify PostHog captures:
- `blog_index_viewed`
- `blog_post_viewed`
- `newsletter_cta_clicked`
- `autoblogwriter_outbound_clicked`
