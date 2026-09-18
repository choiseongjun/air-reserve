import Link from "next/link";
import SubHeader from "@/app/components/sub-header";
import RegionSearch from "@/app/components/region-search";
import Booking from "@/app/components/booking";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "서울 남서권·경기 남부권 에어컨 청소 지역 찾기 | 맑은바람",
  "동작·관악·영등포·구로·금천·서초·광명·과천·안양 에어컨 청소. 상도동, 신림동, 철산동 등 동 이름으로 방문 권역을 찾고 청소 상담을 신청하세요.",
  "/aircon-cleaning",
);
export default function Areas() {
  return (
    <>
      <SubHeader />
      <main>
        <section className="container section region-intro">
          <nav className="breadcrumbs" aria-label="현재 위치">
            <Link href="/">홈</Link>
            <span> / </span>
            <span>방문 지역</span>
          </nav>
          <span className="section-kicker">FIND YOUR NEIGHBORHOOD</span>
          <h1>
            우리 동네
            <br />
            <span>에어컨 청소.</span>
          </h1>
          <p>
            서울 남서권과 경기 남부권, 가까운 곳에서 상담합니다.
            <br />
            지역별 준비 사항을 살펴보고 희망 방문일을 남겨주세요.
          </p>
          <RegionSearch />
        </section>
        <Booking />
      </main>
      <footer className="container section">
        <Link href="/">맑은바람 홈으로 →</Link>
      </footer>
    </>
  );
}
