import type { Metadata } from "next";
export const siteUrl = (
  process.env.SITE_URL || "https://airconpartner.kr"
).replace(/\/$/, "");
export function pageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  const url = `${siteUrl}${path}`;
  return {
    title,
    description,
    robots:
      process.env.VERCEL_ENV === "preview"
        ? { index: false, follow: false }
        : {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
    alternates: { canonical: url, types: { "application/rss+xml": `${siteUrl}/feed.xml` } },
    openGraph: {
      title,
      description,
      url,
      siteName: "더에어컨파트너스",
      locale: "ko_KR",
      type: "website",
      images: [
        {
          url: `${siteUrl}/images/living-room.jpg`,
          alt: "더에어컨파트너스 에어컨 청소·설치",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${siteUrl}/images/living-room.jpg`],
    },
  };
}
