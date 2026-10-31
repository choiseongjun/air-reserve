import Link from "next/link";
import SearchGuideLinks from "./search-guide-links";
import Booking from "./booking";
import SubHeader from "./sub-header";
import RegionSearch from "./region-search";
import { serviceGuides } from "@/lib/service-guides";
import { siteUrl } from "@/lib/seo";

export default function ServiceGuide({
  kind,
}: {
  kind: keyof typeof serviceGuides;
}) {
  const guide = serviceGuides[kind];
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: `${guide.name} 견적 상담`,
        serviceType: `${guide.name} 상담`,
        description: guide.description,
        url: `${siteUrl}${guide.path}`,
        provider: {
          "@id": `${siteUrl}/#organization`,
          "@type": "Organization",
          name: "더에어컨파트너스",
          url: siteUrl,
        },
        areaServed: ["서울특별시", "경기도"],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "홈", item: siteUrl },
          {
            "@type": "ListItem",
            position: 2,
            name: guide.name,
            item: `${siteUrl}${guide.path}`,
          },
        ],
      },
    ],
  };
  return (
    <>
      <SubHeader />
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
        <section className="container section region-intro">
          <nav className="breadcrumbs" aria-label="현재 위치">
            <Link href="/">홈</Link>
            <span>/</span>
            <span>{guide.name}</span>
          </nav>
          <span className="section-kicker">서울·경기 서비스 상담</span>
          <h1>
            {guide.name}
            <br />
            <span>비용부터 일정까지.</span>
          </h1>
          <p>{guide.intro}</p>
          <a className="button" href="#reservation">
            {guide.name} 상담 신청 →
          </a>
        </section>
        <section className="container section">
          <h2>{guide.name} 비용, 이 항목을 확인하세요</h2>
          <p>
            정확한 금액은 제품과 현장 조건을 확인한 후 안내합니다. 아래 항목의
            포함 여부를 확인하고 작업 범위를 협의하세요.
          </p>
          <div className="region-tips guide-costs">
            {guide.costs.map(([title, text]) => (
              <article key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="container section guide-preparation">
          <h2>견적 요청 전에 준비할 정보</h2>
          <ol>
            {guide.preparation.map((text) => (
              <li key={text}>{text}</li>
            ))}
          </ol>
          <p>
            상담 접수 → 제품·현장 조건 확인 → 비용·방문 일정 협의 순서로
            진행합니다. 더에어컨파트너스는 견적·상담 서비스이며, 업체 연결 시
            전달 대상과 정보를 안내하고 별도 동의를 확인합니다.
          </p>
        </section>
        <section className="container section">
          <h2>{guide.name} 자주 묻는 질문</h2>
          <div className="faq-list region-faq">
            {guide.faq.map(([q, a]) => (
              <details key={q}>
                <summary>
                  {q}
                  <span>+</span>
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>
        <section className="container section">
          <h2>서울·경기 지역별 방문 안내</h2>
          <p>
            동작·관악·영등포·구로·금천·서초와 광명·과천·안양을 중심으로
            상담합니다. 그 외 지역은 주소와 작업 종류에 따라 진행 가능 여부 및
            일정을 확인합니다. 아래 지역 안내에서 출입·주차 등 준비 사항을
            살펴보세요.
          </p>
          <RegionSearch />
        </section>
        <SearchGuideLinks job={kind === "relocation" ? "이전설치" : guide.jobType} />
        <Booking
          initialJobType={guide.jobType}
          initialNotes={
            kind === "relocation"
              ? "이전설치 문의: 철거할 주소 / 새 설치 주소 / 철거·운반 필요 여부 / 이사 날짜를 알려주세요."
              : ""
          }
        />
        <section className="container section">
          <h2>다른 에어컨 서비스 안내</h2>
          <div className="related-regions">
            {Object.values(serviceGuides)
              .filter((s) => s.path !== guide.path)
              .map((s) => (
                <Link href={s.path} key={s.path}>
                  {s.name} 비용·상담 →
                </Link>
              ))}
          </div>
        </section>
      </main>
      <footer className="container footer">
        <Link href="/">더에어컨파트너스</Link> ·{" "}
        <Link href="/privacy">개인정보 처리 안내</Link>
      </footer>
    </>
  );
}
