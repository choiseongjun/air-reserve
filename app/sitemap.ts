import type { MetadataRoute } from "next";
import { regions } from "@/lib/regions";
import { siteUrl } from "@/lib/seo";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    {
      url: `${siteUrl}/aircon-cleaning`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...regions.map((r) => ({
      url: `${siteUrl}/aircon-cleaning/${r.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
