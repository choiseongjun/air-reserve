import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
export const metadata = {
  ...pageMetadata(
    "개인정보 수집·이용 안내 | 맑은바람",
    "청소 예약 상담을 위한 개인정보 수집·이용 안내입니다.",
    "/privacy",
  ),
  robots: { index: false, follow: true },
};
export default function Privacy() {
  return (
    <main className="container section policy-page">
      <Link className="brand" href="/">
        맑은바람
      </Link>
      <h1>개인정보 수집·이용 안내</h1>
      <p>에어컨 청소 상담과 방문 일정 조율을 위해 아래 정보를 수집합니다.</p>
      <h2>수집 항목과 이용 목적</h2>
      <p>
        필수: 이름, 연락처, 방문 주소, 서비스 종류, 방문 지역, 희망 날짜·시간대,
        청소 대수, 동의 기록. 선택: 전달 사항. 예약 상담, 방문 일정 협의 및 요청
        관리를 위해 사용합니다.
      </p>
      <h2>보관 기간</h2>
      <p>
        접수일과 희망 방문일 중 늦은 날부터 90일간 보관한 후 일일 정리 작업으로
        삭제합니다. 이 예약 화면에서는 결제 정보를 수집하지 않습니다.
      </p>
      <h2>동의 거부 및 삭제 요청</h2>
      <p>
        동의를 거부할 수 있으며, 거부 시 온라인 예약 상담을 신청할 수 없습니다.
        삭제 또는 수정은 상담 연락 시 접수번호와 함께 요청해 주세요.
      </p>
      <h2>접근과 보안</h2>
      <p>
        예약 내용은 담당자가 인증한 관리자 화면에서 확인합니다. 공개
        페이지에서는 예약자의 연락처와 주소를 조회할 수 없습니다.
      </p>
      <p className="policy-version">안내 버전: 2026-09-18</p>
      <Link href="/#reservation" className="button">
        예약 화면으로 돌아가기 →
      </Link>
    </main>
  );
}
