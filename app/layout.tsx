import type { Metadata } from "next";
import "./globals.css";
import { pageMetadata, siteUrl } from "@/lib/seo";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  ...pageMetadata(
    "서울 전체·경기 전체 에어컨 청소·설치 | 맑은바람",
    "서울 25개 구와 경기 전 지역 에어컨 청소·설치. 벽걸이·스탠드·시스템 청소와 신규 설치 비용 상담과 방문 예약을 신청하세요.",
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
