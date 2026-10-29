import Link from "next/link";
import { notFound } from "next/navigation";
import SubHeader from "@/app/components/sub-header";
import Booking from "@/app/components/booking";
import { getRegion, regions } from "@/lib/regions";
import { pageMetadata, siteUrl } from "@/lib/seo";
export const dynamicParams = false;
export function generateStaticParams() {
  return regions.map((region) => ({ region: region.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ region: string }>;
}) {
  const region = getRegion((await params).region);
  if (!region) notFound();
  return pageMetadata(
    `${region.name} 에어컨 청소·설치·이전설치 · ${region.neighborhoods.slice(0, 3).join("·")} | 더에어컨파트너스`,
    `${region.intro} 벽걸이·스탠드·시스템 청소와 신규 설치 예약 상담, 방문 준비 사항과 비용 기준을 확인하세요.`,
    `/aircon-cleaning/${region.slug}`,
  );
}
export default async function RegionPage({
  params,
}: {
  params: Promise<{ region: string }>;
}) {
  const region = getRegion((await params).region);
  if (!region) notFound();
  const path = `/aircon-cleaning/${region.slug}`;
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: `${region.name} 에어컨 청소`,
        serviceType: "에어컨 청소",
        description: region.intro,
        url: `${siteUrl}${path}`,
        provider: {
          "@type": "Organization",
          name: "더에어컨파트너스",
          url: siteUrl,
        },
        areaServed: {
          "@type": "AdministrativeArea",
          name: `${region.province} ${region.name}`,
        },
      },
      {
        "@type": "Service",
        name: `${region.name} 에어컨 설치`,
        serviceType: "에어컨 설치",
        description: `${region.name}에서 벽걸이·스탠드·시스템 에어컨 신규 설치를 상담합니다.`,
        url: `${siteUrl}${path}`,
        provider: {
          "@type": "Organization",
          name: "더에어컨파트너스",
          url: siteUrl,
        },
        areaServed: {
          "@type": "AdministrativeArea",
          name: `${region.province} ${region.name}`,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "홈", item: siteUrl },
          {
            "@type": "ListItem",
            position: 2,
            name: "에어컨 청소·설치·이전설치 지역",
            item: `${siteUrl}/aircon-cleaning`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: region.name,
            item: `${siteUrl}${path}`,
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
            __html: JSON.stringify(data).replace(/</g, "\\u003c"),
          }}
        />
        <section className="container section region-intro">
          <nav className="breadcrumbs" aria-label="현재 위치">
            <Link href="/">홈</Link>
            <span>/</span>
            <Link href="/aircon-cleaning">에어컨 청소·설치·이전설치</Link>
            <span>/</span>
            <span>{region.name}</span>
          </nav>
          <span className="section-kicker">
            {region.province} · {region.name} 방문 상담
          </span>
          <h1>
            {region.name}
            <br />
            <span>에어컨 청소·설치·이전설치</span>
          </h1>
          <h2>{region.headline}</h2>
          <p>{region.intro}</p>
          <a href="#reservation" className="button">
            {region.name} 청소·설치 예약 상담 →
          </a>
        </section>
        <section className="container area-section region-coverage">
          <div>
            <span className="section-kicker">SERVICE AREA</span>
            <h2>{region.name} 출장 상담 지역</h2>
            <p>
              주소에 따라 출입 조건과 이동 시간을 확인한 후 일정을 조율합니다.
            </p>
          </div>
          <div className="region-neighborhoods">
            {region.neighborhoods.map((n) => (
              <span className="area-chip" key={n}>
                {n}
              </span>
            ))}
          </div>
        </section>
        <section className="container section">
          <div className="section-heading">
            <div>
              <span className="section-kicker">BEFORE WE VISIT</span>
              <h2>{region.name} 방문 전 알려주세요</h2>
            </div>
          </div>
          <div className="region-tips">
            {region.tips.map((tip, i) => (
              <article key={tip}>
                <span>0{i + 1}</span>
                <p>{tip}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="container section region-install">
          <div className="section-heading">
            <div>
              <span className="section-kicker">NEW INSTALLATION</span>
              <h2>{region.name} 에어컨 설치도 함께 상담합니다</h2>
              <p>
                신규 구매나 이전 설치 모두 현장 조건을 확인한 뒤 진행합니다.
              </p>
            </div>
          </div>
          <div className="region-tips">
            <article>
              <span>01</span>
              <p>실외기 설치 위치와 배관이 지나갈 경로를 확인해 주세요.</p>
            </article>
            <article>
              <span>02</span>
              <p>
                신축이나 인테리어 공사 중이라면 전기 용량과 배수 경로를 함께
                알려주세요.
              </p>
            </article>
            <article>
              <span>03</span>
              <p>
                기존 제품을 철거하고 이전 설치가 필요한 경우 철거 여부도 남겨
                주세요.
              </p>
            </article>
          </div>
        </section>
        <section className="container regional-pricing">
          <h2>{region.name} 청소·설치 비용과 작업시간 안내</h2>
          <p>
            아래는 1대 기준 예상 시간입니다. 실제 소요 시간과 요금은
            모델·오염도·설치 환경을 확인한 후 안내합니다.
          </p>
          <div className="price-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>구분</th>
                  <th>기종</th>
                  <th>예상 시간</th>
                  <th>확인할 정보</th>
                  <th>비용</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>청소</td>
                  <td>벽걸이</td>
                  <td>1–1.5시간</td>
                  <td>설치 높이·주변 공간</td>
                  <td>상담 후 안내</td>
                </tr>
                <tr>
                  <td>청소</td>
                  <td>스탠드</td>
                  <td>1.5–2시간</td>
                  <td>모델·분해 범위</td>
                  <td>상담 후 안내</td>
                </tr>
                <tr>
                  <td>청소</td>
                  <td>시스템</td>
                  <td>1.5–2.5시간</td>
                  <td>천장 높이·실내기 대수</td>
                  <td>상담 후 안내</td>
                </tr>
                <tr>
                  <td>설치</td>
                  <td>벽걸이</td>
                  <td>1.5–2시간</td>
                  <td>배관 길이·실외기 위치</td>
                  <td>상담 후 안내</td>
                </tr>
                <tr>
                  <td>설치</td>
                  <td>스탠드</td>
                  <td>2–3시간</td>
                  <td>전기 용량·배수 경로</td>
                  <td>상담 후 안내</td>
                </tr>
                <tr>
                  <td>설치</td>
                  <td>시스템</td>
                  <td>3시간~</td>
                  <td>천장 구조·실내기 대수</td>
                  <td>상담 후 안내</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            2in1은 벽걸이와 스탠드 구성을 함께 알려주세요. 주차비나 추가 작업
            비용이 필요한 경우 작업 전에 안내하고 협의합니다.
          </p>
        </section>
        <section className="container section">
          <span className="section-kicker">LOCAL QUESTIONS</span>
          <h2>{region.name} 청소·설치 상담 FAQ</h2>
          <div className="faq-list region-faq">
            <details open>
              <summary>
                {region.question}
                <span>+</span>
              </summary>
              <p>{region.answer}</p>
            </details>
            <details>
              <summary>
                {region.name}에서 에어컨 설치도 신청할 수 있나요?
                <span>+</span>
              </summary>
              <p>
                네, 벽걸이·스탠드·시스템 에어컨 신규 설치도 상담합니다. 예약 시
                작업 종류에서 설치를 선택해 주시면 배관 길이, 실외기 위치, 전기
                용량을 확인한 뒤 비용과 일정을 안내합니다.
              </p>
            </details>
            <details>
              <summary>
                신청한 날짜에 바로 방문하나요?<span>+</span>
              </summary>
              <p>
                예약 요청은 접수 대기 상태로 저장됩니다. 담당자가 연락해 비용과
                방문 일정을 확인한 후 확정합니다. 희망 날짜 선택만으로 방문이
                확정되지 않습니다.
              </p>
            </details>
            <details>
              <summary>
                {region.name} 실제 작업사례를 볼 수 있나요?<span>+</span>
              </summary>
              <p>
                현재 공개된 작업사례는 없습니다. 실제 작업 후 고객 동의를 받은
                사진과 내용을 확인해 게시할 예정입니다. 사이트의 거실 사진은
                작업사례가 아닌 연출 이미지입니다.
              </p>
            </details>
          </div>
        </section>
        <section className="container section">
          <h2>{region.name} 설치·이전설치 견적 준비</h2>
          <p>
            신규 설치는 배관 길이와 실외기 위치를, 이전설치는 철거할 주소와 새
            설치 주소를 함께 확인합니다. 지역별 출입·주차 조건을 위에서 확인하고
            작업 종류에 맞는 비용 안내를 살펴보세요.
          </p>
          <div className="related-regions">
            <Link href="/aircon-install">에어컨 설치 비용·배관 안내 →</Link>
            <Link href="/aircon-relocation">에어컨 이전설치·철거 안내 →</Link>
            <Link href="/aircon-cleaning">에어컨 청소·분해 범위 안내 →</Link>
          </div>
        </section>
        <Booking initialArea={region.name} />
        <section className="container section">
          <h2>인근 지역도 살펴보세요</h2>
          <div className="related-regions">
            {regions
              .filter(
                (r) => r.slug !== region.slug && r.province === region.province,
              )
              .slice(0, 12)
              .map((r) => (
                <Link key={r.slug} href={`/aircon-cleaning/${r.slug}`}>
                  {r.name} 에어컨 청소·설치·이전설치 ↗
                </Link>
              ))}
          </div>
        </section>
      </main>
      <footer className="container footer">
        <Link href="/">더에어컨파트너스 홈으로</Link> ·{" "}
        <Link href="/privacy">개인정보 처리 안내</Link>
      </footer>
    </>
  );
}
