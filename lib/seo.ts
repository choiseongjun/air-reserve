import type { Metadata } from "next";
export const siteUrl = (
  process.env.SITE_URL || "https://air-reserve-three.vercel.app"
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
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "맑은바람",
      locale: "ko_KR",
      type: "website",
      images: [
        {
          url: `${siteUrl}/images/living-room.jpg`,
          alt: "맑은바람 에어컨 청소",
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
