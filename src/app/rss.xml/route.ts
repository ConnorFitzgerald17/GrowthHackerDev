import RSS from "rss";

import { getPosts } from "@/lib/autoblogwriter";
import { getSiteUrl } from "@/lib/env";

export async function GET(): Promise<Response> {
  const siteUrl = getSiteUrl();
  const { posts } = await getPosts({ limit: 100 });

  const feed = new RSS({
    title: "GrowthHackerDev",
    description:
      "Growth engineering playbooks for developers shipping software products.",
    site_url: siteUrl,
    feed_url: `${siteUrl}/rss.xml`,
    language: "en",
  });

  posts.forEach((post) => {
    feed.item({
      title: post.title,
      description: post.excerpt,
      url: `${siteUrl}/blog/${post.slug}`,
      date: post.publishDate,
      categories: post.tags,
    });
  });

  return new Response(feed.xml({ indent: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=300, stale-while-revalidate=300",
    },
  });
}
