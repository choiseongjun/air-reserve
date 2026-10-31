import Image from "next/image";
import Link from "next/link";
import SearchGuideLinks from "./components/search-guide-links";
import Booking from "./components/booking";
import RegionSearch from "./components/region-search";
import { Aircon, Icon } from "./components/icons";
import { siteUrl } from "@/lib/seo";

const options = [
  {
    number: "01",
    name: "새 에어컨 설치",
    type: "wall",
    text: "설치할 공간과 실외기 위치부터. 제품과 현장에 맞는 작업 범위를 상담하세요.",
    tag: "신규 설치",
    href: "/aircon-install",
  },
  {
    number: "02",
    name: "이사 · 이전 설치",
    type: "standing",
    text: "철거할 곳과 다시 설치할 곳을 함께 확인해, 이동부터 재설치까지 상담하세요.",
    tag: "이전 설치 문의",
    href: "/aircon-relocation",
  },
  {
    number: "03",
    name: "에어컨 청소",
    type: "ceiling",
    text: "벽걸이부터 시스템까지. 기종과 대수를 알려주시면 청소 상담을 도와드립니다.",
    tag: "청소 상담",
    href: "/aircon-cleaning",
  },
] as const;
export default function Home() {
  return (
    <>
      <div className="announcement">
        설치부터 이전·청소까지 <span className="announcement-divider">|</span>{" "}
        에어컨 고민에, 든든한 파트너
      </div>
      <header className="header">
        <div className="container header-inner">
          <Link className="brand" href="/" aria-label="더에어컨파트너스 홈">
            <span className="partner-mark">
              ap<span>·</span>
            </span>
            더에어컨파트너스
          </Link>
          <nav aria-label="주 메뉴">
            <a href="#services">상담 서비스</a>
            <a href="#estimate">견적 체크포인트</a>
            <Link href="/aircon-cleaning">지역 찾기</Link>
            <a href="#faq">자주 묻는 질문</a>
          </nav>
          <a className="button small" href="#reservation">
            견적 상담하기 <Icon name="arrow" />
          </a>
        </div>
      </header>
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": `${siteUrl}/#organization`,
                  name: "더에어컨파트너스",
                  url: siteUrl,
                  description:
                    "서울·경기 에어컨 설치·이전설치·청소 견적 상담 서비스",
                },
                {
                  "@type": "WebSite",
                  name: "더에어컨파트너스",
                  url: siteUrl,
                  inLanguage: "ko-KR",
                  publisher: { "@id": `${siteUrl}/#organization` },
                },
              ],
            }).replace(/</g, "\\u003c"),
          }}
        />
        <section className="partner-hero">
          <div className="container hero">
            <div className="hero-copy">
              <div className="eyebrow">
                <span /> THE AIRCON PARTNERS · 에어컨 상담의 시작
              </div>
              <h1>
                에어컨 설치,
                <br />
                혼자 알아보지
                <br />
                <span>마세요.</span>
              </h1>
              <p className="hero-description">
                복잡한 배관 비용부터 설치 일정까지.
                <br />
                우리 집에 필요한 작업, 더에어컨파트너스와 먼저 확인하세요.
              </p>
              <div className="hero-actions">
                <a className="button" href="#reservation">
                  우리 집 견적 상담 <Icon name="arrow" />
                </a>
                <a className="text-button" href="#process">
                  어떻게 진행되나요? ↗
                </a>
              </div>
              <div className="hero-checks">
                <span>
                  <Icon name="check" /> 현장 조건부터 확인
                </span>
                <span>
                  <Icon name="check" /> 비용 항목 안내
                </span>
                <span>
                  <Icon name="check" /> 일정은 상담 후 협의
                </span>
              </div>
            </div>
            <div className="hero-visual">
              <Image
                src="/images/living-room.jpg"
                alt="에어컨 설치 환경을 고려할 수 있는 밝은 거실 연출 이미지"
                fill
                priority
                sizes="(max-width:760px) 100vw, 50vw"
              />
              <div className="image-shade" />
              <div className="photo-label">YOUR HOME. OUR NEXT QUESTION.</div>
              <div className="partner-photo-card">
                <span className="section-kicker">
                  좋은 견적은, 좋은 질문에서.
                </span>
                <h2>어디에 설치하시나요?</h2>
                <p>공간 · 기종 · 배관 · 실외기 위치</p>
                <div>
                  <span>신규 설치</span>
                  <span>이전 설치</span>
                  <span>청소</span>
                </div>
              </div>
              <span className="photo-caption">
                공간 연출 이미지 · 실제 시공사례가 아닙니다
              </span>
            </div>
          </div>
        </section>
        <div className="container partner-note">
          <Icon name="info" />
          <p>
            더에어컨파트너스는 <strong>에어컨 견적·상담 서비스</strong>입니다.
            업체 연결이 필요한 경우 대상 업체와 전달 정보를 먼저 안내하고 별도
            동의를 확인합니다.
          </p>
        </div>
        <SearchGuideLinks />
        <Booking initialJobType="설치" />
        <section className="container section" id="services">
          <div className="section-heading">
            <div>
              <span className="section-kicker">WHAT DO YOU NEED?</span>
              <h2>지금 필요한 상담을 골라보세요.</h2>
              <p>새로 설치할 때도, 이사할 때도, 청소가 필요할 때도.</p>
            </div>
            <span className="subtle-label">
              기종과 현장에 따라 상담 내용이 달라집니다
            </span>
          </div>
          <div className="service-grid">
            {options.map((s) => (
              <article className="service-card" key={s.number}>
                <div className={`service-art art-${s.type}`}>
                  <span className="service-tag">{s.tag}</span>
                  <Aircon type={s.type} />
                  <span className="art-number">{s.number}</span>
                </div>
                <div className="service-body">
                  <span className="service-label">
                    THE AIRCON PARTNERS / {s.number}
                  </span>
                  <h3>{s.name}</h3>
                  <p>{s.text}</p>
                  <Link className="service-link" href={s.href}>
                    비용·절차 알아보기 <Icon name="arrow" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
          <p className="service-footnote">
            이전 설치는 작업 종류에서 ‘설치’를 선택하고, 전달 사항에
            철거·이동·재설치 여부를 남겨주세요.
          </p>
        </section>
        <section id="estimate" className="partner-estimate">
          <div className="container estimate-grid">
            <div>
              <span className="section-kicker">BEFORE THE ESTIMATE</span>
              <h2>
                설치비는 숫자 하나보다,
                <br />
                <span>포함된 항목이 중요하니까.</span>
              </h2>
              <p>
                정확한 금액은 제품과 현장 확인 후 안내합니다.
                <br />
                상담할 때 이 네 가지를 함께 확인해 보세요.
              </p>
              <a href="#reservation" className="text-button">
                설치 조건 남기기 →
              </a>
            </div>
            <div className="estimate-checks">
              {[
                [
                  "01",
                  "기본 작업 범위",
                  "제품 기종, 설치 대수와 기본 설치에 포함되는 작업",
                ],
                [
                  "02",
                  "배관 · 전기 · 배수",
                  "배관 길이, 타공, 전기 작업 등 추가 작업 필요 여부",
                ],
                [
                  "03",
                  "실외기 설치 환경",
                  "실외기 위치, 거치대와 고소 작업 필요 여부",
                ],
                [
                  "04",
                  "철거 · 이동 · 재설치",
                  "이전 설치 시 철거 장소, 이동 거리와 재설치 조건",
                ],
              ].map(([n, t, d]) => (
                <div key={n}>
                  <span>{n}</span>
                  <section>
                    <h3>{t}</h3>
                    <p>{d}</p>
                  </section>
                  <Icon name="check" />
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="container section" id="process">
          <div className="section-heading">
            <div>
              <span className="section-kicker">SIMPLE, STEP BY STEP</span>
              <h2>상담부터 진행 결정까지, 차근차근.</h2>
              <p>요청서를 보낸 것만으로 계약이나 방문이 확정되지 않습니다.</p>
            </div>
          </div>
          <div className="process-grid">
            {[
              ["01", "상담 요청", "지역·기종·희망일과 연락처를 남겨주세요."],
              [
                "02",
                "설치 조건 확인",
                "주소와 제품, 배관·실외기 환경을 확인합니다.",
              ],
              [
                "03",
                "진행 가능 여부 안내",
                "업체 연결이 필요하면 대상과 전달 정보를 먼저 안내합니다.",
              ],
              [
                "04",
                "견적 · 일정 협의",
                "상담 후 비용과 일정에 동의하시면 진행을 결정합니다.",
              ],
            ].map(([n, t, d]) => (
              <article className="process-item" key={n}>
                <div className="process-top">
                  <span>{n}</span>
                  <Icon name="arrow" />
                </div>
                <h3>{t}</h3>
                <p>{d}</p>
              </article>
            ))}
          </div>
        </section>
        <section id="areas" className="container partner-area">
          <div className="section-heading">
            <div>
              <span className="section-kicker">NEAR YOUR HOME</span>
              <h2>우리 동네부터 찾아보세요.</h2>
              <p>
                지역 안내를 확인하고 문의하세요. 실제 대응 가능 여부는 상담 후
                안내합니다.
              </p>
            </div>
          </div>
          <RegionSearch />
        </section>
        <section id="faq" className="container section faq-section">
          <div>
            <span className="section-kicker">GOOD TO KNOW</span>
            <h2>
              문의하기 전,
              <br />
              궁금하실 내용들.
            </h2>
            <p>가능한 것과 확인이 필요한 것을 구분해 안내합니다.</p>
          </div>
          <div className="faq-list">
            {[
              [
                "직접 시공하는 업체인가요?",
                "더에어컨파트너스는 에어컨 견적·상담 서비스입니다. 요청 내용과 진행 가능 여부를 확인하며, 시공업체 연결이 필요하면 대상 업체와 전달 정보를 먼저 안내합니다. 상담 신청만으로 제3자에게 개인정보를 자동 전달하지 않습니다.",
              ],
              [
                "설치 비용을 미리 알 수 있나요?",
                "기종, 배관 길이, 실외기 위치와 추가 작업 여부에 따라 달라집니다. 기본 작업과 추가 비용 항목을 확인한 후 견적을 안내하며, 현장 확인 없이 확정 금액을 약속하지 않습니다.",
              ],
              [
                "중고 에어컨이나 이전 설치도 문의할 수 있나요?",
                "가능 여부를 상담할 수 있습니다. 작업 종류는 ‘설치’를 선택하고 모델명, 제품 상태, 철거할 곳과 다시 설치할 곳을 전달 사항에 남겨주세요.",
              ],
              [
                "요청하면 바로 설치 일정이 잡히나요?",
                "요청은 접수 대기로 저장됩니다. 담당자가 지역과 작업 조건을 확인한 뒤 진행 가능 여부와 일정을 안내합니다. 접수번호를 보관해 주세요.",
              ],
            ].map(([q, a]) => (
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
        <section className="container closing">
          <div>
            <span>에어컨에 관한 다음 질문, 여기서 시작하세요.</span>
            <h2>우리 집 에어컨의 든든한 파트너.</h2>
          </div>
          <a className="button" href="#reservation">
            견적 상담 요청하기 <Icon name="arrow" />
          </a>
        </section>
      </main>
      <footer className="container footer">
        <div className="footer-top">
          <Link href="/" className="brand">
            <span className="partner-mark">
              ap<span>·</span>
            </span>
            더에어컨파트너스
          </Link>
          <span>설치 · 이전 · 청소 상담</span>
          <Link href="/privacy">개인정보 처리 안내 ↗</Link>
        </div>
        <div className="footer-bottom">
          <p>
            에어컨 견적·상담 서비스 · 진행 가능 여부 및 일정은 상담 후 안내
            <br />
            업체 연결 시 전달 대상과 목적을 안내하고 별도 동의를 확인합니다.
          </p>
          <span>© {new Date().getFullYear()} THE AIRCON PARTNERS</span>
        </div>
      </footer>
    </>
  );
}
