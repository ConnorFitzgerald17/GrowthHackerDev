import type { MetadataRoute } from "next";

import { generateBlogRobots } from "@autoblogwriter/sdk/next";

import { getSiteUrl } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  try {
    return generateBlogRobots();
  } catch {
    const siteUrl = getSiteUrl();
    return {
      rules: [
        { userAgent: "*", allow: "/" },
        { userAgent: "GPTBot", allow: "/" },
        { userAgent: "Claude-Web", allow: "/" },
        { userAgent: "anthropic-ai", allow: "/" },
        { userAgent: "PerplexityBot", allow: "/" },
        { userAgent: "cohere-ai", allow: "/" },
        { userAgent: "Applebot-Extended", allow: "/" },
      ],
      sitemap: `${siteUrl}/sitemap.xml`,
    };
  }
}
