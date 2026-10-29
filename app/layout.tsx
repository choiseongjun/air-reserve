import type { Metadata } from "next";
import "./globals.css";
import { pageMetadata, siteUrl } from "@/lib/seo";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  ...pageMetadata(
    "에어컨 설치·이전·청소 견적 상담 | 에어컨파트너",
    "서울·경기 에어컨 설치·이전·청소 견적 상담. 기종과 배관, 실외기 설치 환경을 확인하고 진행 가능 여부와 견적 절차를 안내합니다.",
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
