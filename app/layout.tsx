import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { pageMetadata, siteUrl } from "@/lib/seo";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  ...pageMetadata(
    "에어컨 설치·이전설치·청소 견적 상담 | 더에어컨파트너스",
    "서울·경기 에어컨 설치·이전·청소 견적 상담. 기종과 배관, 실외기 설치 환경을 확인하고 진행 가능 여부와 견적 절차를 안내합니다.",
    "/",
  ),
  robots:
    process.env.VERCEL_ENV === "preview"
      ? { index: false, follow: false }
      : { index: true, follow: true },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    other: {
      "naver-site-verification":
        process.env.NAVER_SITE_VERIFICATION ||
        "3dde79a811683bd39d8da18b8eec07766d9fbd27",
    },
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
