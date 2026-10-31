import type { MetadataRoute } from "next";
import { regions } from "@/lib/regions";
import { siteUrl } from "@/lib/seo";
import { searchGuides, guideUpdated } from "@/lib/search-guides";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${siteUrl}/aircon-guide`, lastModified: guideUpdated, changeFrequency: "monthly", priority: 0.8 },
    ...searchGuides.map(({ slug }) => ({ url: `${siteUrl}/aircon-guide/${slug}`, lastModified: guideUpdated, changeFrequency: "monthly" as const, priority: 0.7 })),
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/about`, changeFrequency: "monthly", priority: 0.6 },
    {
      url: `${siteUrl}/aircon-install`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/aircon-relocation`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
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
