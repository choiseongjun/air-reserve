import Link from "next/link";
import { pageMetadata, siteUrl } from "@/lib/seo";
export const metadata = pageMetadata(
  "서비스 소개·업체 연결 절차 | 더에어컨파트너스",
  "더에어컨파트너스는 서울·경기 에어컨 설치·이전설치·청소 상담 접수 서비스입니다. 사진 상담, 작업 가능 업체 확인, 견적과 예약 확정 절차를 안내합니다.",
  "/about",
);
export default function AboutPage() {
  const data = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${siteUrl}/about#webpage`,
    url: `${siteUrl}/about`,
    name: "더에어컨파트너스 서비스 소개",
    inLanguage: "ko-KR",
    about: {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "더에어컨파트너스",
      url: siteUrl,
      description:
        "서울·경기 에어컨 설치·이전설치·청소 상담 접수 및 업체 연결 서비스",
    },
  };
  return (
    <main className="container section policy-page">
      <nav className="breadcrumbs" aria-label="현재 위치">
        <Link href="/">홈</Link>
        <span>/</span>
        <span>서비스 소개</span>
      </nav>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(data).replace(/</g, "\\u003c"),
        }}
      />
      <h1>더에어컨파트너스는 어떤 서비스인가요?</h1>
      <p>
        더에어컨파트너스는 서울·경기에서 에어컨 설치·이전설치·청소가 필요한
        고객의 상담 요청을 접수하고, 작업 가능한 업체를 확인해 연결을 돕는
        서비스입니다. 직접 시공하는 업체가 아니며, 접수만으로 시공업체나 방문
        일정이 확정되지는 않습니다.
      </p>
      <h2>어떤 작업을 상담할 수 있나요?</h2>
      <ul>
        <li>
          <Link href="/aircon-install">신규·중고 에어컨 설치</Link>: 제품 모델,
          배관 경로, 실외기 위치와 전기·배수 조건을 확인합니다.
        </li>
        <li>
          <Link href="/aircon-relocation">에어컨 이전설치</Link>: 철거할 곳과 새
          설치 장소, 철거·운반·재설치 중 필요한 범위를 확인합니다.
        </li>
        <li>
          <Link href="/aircon-cleaning">에어컨 청소</Link>: 벽걸이·스탠드·시스템
          기종과 대수, 분해·세척 범위를 확인합니다.
        </li>
      </ul>
      <h2>어느 지역에서 이용할 수 있나요?</h2>
      <p>
        동작·관악·영등포·구로·금천·서초와 광명·과천·안양을 중심으로 서울·경기
        지역의 상담을 접수합니다. 지역 안내 페이지가 있다는 이유만으로 해당
        지역에 지점이나 상주 기사가 있다는 뜻은 아닙니다. 상세 주소와 희망일에
        따라 작업 가능한 업체가 있는지 확인합니다.
      </p>
      <p>
        <Link href="/aircon-cleaning">지역별 준비 사항과 상담 지역 찾기 →</Link>
      </p>
      <h2>사진 상담은 어떻게 진행되나요?</h2>
      <ol>
        <li>지역·작업 종류·기종·희망일을 선택합니다.</li>
        <li>
          설치할 벽, 실외기 위치, 제품 모델명 등의 사진을 최대 3장 선택
          첨부합니다. 사진 없이도 접수할 수 있습니다.
        </li>
        <li>연락처와 현장 정보를 남기면 접수번호가 발급됩니다.</li>
        <li>담당자가 작업 조건과 업체의 대응 가능 여부를 확인합니다.</li>
        <li>
          업체 연결 시 전달 대상과 정보를 안내하고 별도 동의를 확인한 뒤
          연결합니다. 견적과 방문 일정을 협의한 후 예약을 확정합니다.
        </li>
      </ol>
      <h2>정확한 비용은 언제 알 수 있나요?</h2>
      <p>
        설치는 배관 길이·실외기 위치·추가 공사, 이전설치는 철거·운반 포함 여부,
        청소는 기종·대수·분해 범위에 따라 비용이 달라집니다. 사진은 상담을 돕기
        위한 자료이며 현장 확인이 추가로 필요할 수 있습니다. 실제 작업 전 견적에
        포함된 항목과 추가 비용 조건을 확인해 주세요.
      </p>
      <h2>당일 방문이나 업체 연결이 보장되나요?</h2>
      <p>
        아닙니다. 당일 요청도 접수할 수 있지만 지역과 업체 일정, 현장 조건에
        따라 진행이 어려울 수 있습니다. 접수는 예약 확정이나 업체 배정을
        보장하지 않습니다.
      </p>
      <h2>사진과 연락처는 공개되나요?</h2>
      <p>
        공개되지 않습니다. 사진과 접수 정보는 인증된 담당자가 확인하며,
        신청만으로 시공업체에 자동 전달하지 않습니다. 보관 기간과 동의 절차는{" "}
        <Link href="/privacy">개인정보 처리 안내</Link>에서 확인할 수 있습니다.
      </p>
      <h2>작업사례와 업체 정보는 어떻게 표시하나요?</h2>
      <p>
        사이트의 거실 이미지는 공간 연출 이미지로, 더에어컨파트너스의 시공
        실적이 아닙니다. 외부 업체의 활동 정보와 실제 제휴·예약 가능 여부는
        구분합니다. 현재 공개된 실제 시공사례는 없습니다.
      </p>
      <p>서비스 안내 기준일: 2026년 10월 29일</p>
      <Link href="/#reservation" className="button">
        사진으로 상담 접수하기 →
      </Link>
    </main>
  );
}
