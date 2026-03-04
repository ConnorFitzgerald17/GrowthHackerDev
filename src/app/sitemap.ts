import type { MetadataRoute } from "next";

import { generateBlogSitemap } from "@autoblogwriter/sdk/next";

import { getPosts } from "@/lib/autoblogwriter";
import { getSiteUrl } from "@/lib/env";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();

  try {
    return await generateBlogSitemap();
  } catch {
    const { posts } = await getPosts({ limit: 1000 });
    return posts.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: post.publishDate,
    }));
  }
}
