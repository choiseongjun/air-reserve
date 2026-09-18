import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "맑은바람 | 서울·경기 에어컨 청소",
  description:
    "동작구를 중심으로 관악·영등포·구로·금천·서초·광명·과천·안양까지. 벽걸이, 스탠드, 시스템 에어컨 청소 서비스와 방문 상담을 안내합니다.",
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
