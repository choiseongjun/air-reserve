import { createGuideFeed } from "@/lib/guide-feed";
import { siteUrl } from "@/lib/seo";

export const dynamic = "force-static";
export function GET() {
  return new Response(createGuideFeed(siteUrl), {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8", "X-Content-Type-Options": "nosniff" },
  });
}
