import type { Metadata } from "next";
import Link from "next/link";
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
        <nav className="container related-regions" aria-label="서비스 정보" style={{ paddingBlock: 24 }}>
          <Link href="/about">더에어컨파트너스 소개·업체 연결 절차</Link>
          <Link href="/aircon-guide">비용·배관·모델·에러코드 안내</Link>
          <a href="/feed.xml">최신 안내 RSS</a>
          <Link href="/aircon-install">설치 비용 안내</Link>
          <Link href="/aircon-relocation">이전설치 안내</Link>
          <Link href="/aircon-cleaning">청소·지역 안내</Link>
        </nav>
        <Analytics />
      </body>
    </html>
  );
}
