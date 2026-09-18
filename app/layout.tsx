import type { Metadata } from "next";
import "./globals.css";
import { pageMetadata, siteUrl } from "@/lib/seo";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  ...pageMetadata(
    "동작구·서울 남서권·경기 남부권 에어컨 청소 | 맑은바람",
    "동작·관악·영등포·구로·금천·서초·광명·과천·안양 에어컨 청소. 벽걸이·스탠드·시스템 청소 비용 상담과 방문 예약을 신청하세요.",
    "/",
  ),
  robots:
    process.env.VERCEL_ENV === "preview"
      ? { index: false, follow: false }
      : { index: true, follow: true },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    other: process.env.NAVER_SITE_VERIFICATION
      ? { "naver-site-verification": process.env.NAVER_SITE_VERIFICATION }
      : undefined,
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
