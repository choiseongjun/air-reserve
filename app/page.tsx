import Image from "next/image";
import Booking from "./components/booking";
import { Aircon, Icon } from "./components/icons";
const services = [
  {
    name: "벽걸이 에어컨",
    type: "wall",
    label: "작은 방부터 거실까지",
    description: "눈에 보이지 않는 내부 오염까지 꼼꼼하게",
    time: "약 1–1.5시간",
    tag: "가정용",
  },
  {
    name: "스탠드 에어컨",
    type: "standing",
    label: "우리 집 여름의 중심",
    description: "필터부터 송풍팬까지, 구석구석 깨끗하게",
    time: "약 1.5–2시간",
    tag: "가정용",
  },
  {
    name: "시스템 에어컨",
    type: "ceiling",
    label: "넓은 공간도 쾌적하게",
    description: "천장형 에어컨도 공간에 맞춰 세심하게",
    time: "약 1.5–2.5시간",
    tag: "가정용 · 상업용",
  },
] as const;
export default function Home() {
  return (
    <>
      <div className="announcement">
        <span className="status-dot" /> 동작구에서 시작하는, 우리 동네 에어컨
        케어 <span className="announcement-divider">|</span>
        <span className="announcement-extra">서울 남서권 · 경기 남부권</span>
      </div>
      <header className="header">
        <div className="container header-inner">
          <a href="#" className="brand" aria-label="맑은바람 홈">
            <span className="brand-symbol">
              <Icon name="wind" />
            </span>
            맑은바람<span className="brand-en">CLEAR AIR</span>
          </a>
          <nav aria-label="주 메뉴">
            <a href="#services">서비스 안내</a>
            <a href="#process">청소 과정</a>
            <a href="#areas">방문 가능 지역</a>
            <a href="#faq">자주 묻는 질문</a>
          </nav>
          <a href="#reservation" className="button small">
            예약 상담하기 <Icon name="arrow" />
          </a>
        </div>
      </header>
      <main>
        <section className="hero container">
          <div className="hero-copy">
            <div className="eyebrow">
              <span /> 깨끗한 바람, 기분 좋은 일상
            </div>
            <h1>
              우리 집 공기를
              <br />
              다시, <span>맑게.</span>
            </h1>
            <p className="hero-description">
              매일 숨 쉬는 공간이니까.
              <br />
              에어컨 속 보이지 않는 곳까지 세심하게 청소합니다.
            </p>
            <div className="hero-actions">
              <a className="button" href="#reservation">
                에어컨 청소 예약하기 <Icon name="arrow" />
              </a>
              <a className="text-button" href="#services">
                서비스 살펴보기 <span>↗</span>
              </a>
            </div>
            <div className="hero-checks">
              <span>
                <Icon name="check" /> 기종별 맞춤 청소
              </span>
              <span>
                <Icon name="check" /> 작업 전 비용 안내
              </span>
              <span>
                <Icon name="check" /> 꼼꼼한 마무리
              </span>
            </div>
          </div>
          <div className="hero-visual">
            <Image
              src="/images/living-room.jpg"
              alt="햇살이 들어오는 밝고 편안한 거실"
              fill
              priority
              sizes="(max-width: 760px) 100vw, 55vw"
            />
            <div className="image-shade" />
            <div className="photo-label">
              <span className="status-dot" /> A FRESH START FOR YOUR HOME
            </div>
            <div className="air-note">
              <span className="note-icon">
                <Icon name="wind" />
              </span>
              <div>
                <strong>바람이 달라지면, 일상이 달라집니다.</strong>
                <span>에어컨 청소로 시작하는 쾌적한 우리 집</span>
              </div>
              <span className="note-sparkle">✧</span>
            </div>
            <span className="photo-caption">
              맑은바람이 생각하는 쾌적한 공간 · 연출 이미지
            </span>
          </div>
        </section>
        <Booking />
        <section id="services" className="section container services">
          <div className="section-heading">
            <div>
              <span className="section-kicker">OUR SERVICES</span>
              <h2>어떤 에어컨을 사용하시나요?</h2>
              <p>에어컨 종류에 맞는 청소로, 바람부터 달라지도록.</p>
            </div>
            <span className="heading-note">
              <Icon name="info" /> 정확한 비용은 기종 확인 후 안내해 드려요
            </span>
          </div>
          <div className="service-grid">
            {services.map((service, index) => (
              <article className="service-card" key={service.type}>
                <div className={`service-art art-${service.type}`}>
                  <span className="service-tag">{service.tag}</span>
                  <Aircon type={service.type} />
                  <span className="art-number">0{index + 1}</span>
                </div>
                <div className="service-body">
                  <span className="service-label">{service.label}</span>
                  <h3>{service.name} 청소</h3>
                  <p>{service.description}</p>
                  <div className="service-facts">
                    <span>
                      <Icon name="clock" /> {service.time}
                    </span>
                    <strong>상담 후 요금 안내</strong>
                  </div>
                  <a href="#reservation" className="service-link">
                    이 서비스 상담하기 <Icon name="arrow" />
                  </a>
                </div>
              </article>
            ))}
          </div>
          <p className="service-footnote">
            작업시간은 1대 기준 예상 시간이며, 모델과 오염 정도에 따라 달라질 수
            있습니다. 2in1 에어컨은 예약 시 함께 알려주세요.
          </p>
        </section>
        <section className="promise-section">
          <div className="container promise-inner">
            <div>
              <span className="section-kicker">THE CLEAR AIR WAY</span>
              <h2>
                맡기는 마음까지,
                <br />
                편안할 수 있도록.
              </h2>
            </div>
            <div className="promise-item">
              <Icon name="shield" />
              <h3>시작 전에 충분히 설명해요</h3>
              <p>
                제품 상태와 작업 범위, 비용을
                <br />
                확인하고 청소를 시작합니다.
              </p>
            </div>
            <div className="promise-item">
              <Icon name="drop" />
              <h3>공간도 소중하게 다뤄요</h3>
              <p>
                주변 가구와 바닥을 보양하고
                <br />
                청소 후 주변까지 정리합니다.
              </p>
            </div>
            <div className="promise-item">
              <Icon name="check-circle" />
              <h3>마지막 바람까지 확인해요</h3>
              <p>
                세척 후 재조립과 작동 점검으로
                <br />
                마무리 상태를 함께 확인합니다.
              </p>
            </div>
          </div>
        </section>
        <section className="section container" id="process">
          <div className="section-heading">
            <div>
              <span className="section-kicker">HOW WE CARE</span>
              <h2>깨끗한 바람을 만드는 과정</h2>
              <p>보이는 곳부터 보이지 않는 곳까지, 순서대로 꼼꼼하게.</p>
            </div>
            <span className="subtle-label">기종과 현장에 맞춰 진행합니다</span>
          </div>
          <div className="process-grid">
            {[
              [
                "01",
                "상태 확인 · 주변 보양",
                "작동 상태를 점검하고 가구와 바닥을 보호합니다.",
                "shield",
              ],
              [
                "02",
                "분해 · 내부 세척",
                "모델별 분해 범위에 맞춰 필터와 내부를 세척합니다.",
                "drop",
              ],
              [
                "03",
                "건조 · 재조립",
                "세척한 부품을 건조하고 제자리에 조립합니다.",
                "wind",
              ],
              [
                "04",
                "작동 점검 · 정리",
                "정상 작동을 확인하고 관리 방법을 안내합니다.",
                "check-circle",
              ],
            ].map(([number, title, desc, icon]) => (
              <div className="process-item" key={number}>
                <div className="process-top">
                  <span>{number}</span>
                  <Icon name={icon} />
                </div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </section>
        <section id="areas" className="container area-section">
          <div className="area-copy">
            <span className="section-kicker">ALWAYS NEAR YOU</span>
            <h2>
              멀지 않은 곳에서,
              <br />
              깨끗한 바람을 전합니다.
            </h2>
            <p>
              동작구를 중심으로 서울 남서권과 경기 남부권을 방문합니다.
              <br />
              방문 일정은 주소와 작업 내용을 확인한 후 안내해 드려요.
            </p>
            <a href="#reservation" className="text-button">
              우리 동네 방문 상담하기 <Icon name="arrow" />
            </a>
          </div>
          <div className="area-list">
            <div className="area-group">
              <span className="area-category">
                <Icon name="pin" /> 서울
              </span>
              <div>
                {[
                  "동작구",
                  "관악구",
                  "영등포구",
                  "구로구",
                  "금천구",
                  "서초구",
                ].map((area) => (
                  <span
                    className={
                      area === "동작구" ? "area-chip home-area" : "area-chip"
                    }
                    key={area}
                  >
                    {area}
                    {area === "동작구" && <small>거점</small>}
                  </span>
                ))}
              </div>
            </div>
            <div className="area-group">
              <span className="area-category">
                <Icon name="pin" /> 경기
              </span>
              <div>
                {["광명시", "과천시", "안양시"].map((area) => (
                  <span className="area-chip" key={area}>
                    {area}
                  </span>
                ))}
              </div>
            </div>
            <p>
              <Icon name="info" /> 인근 지역은 상담을 통해 방문 가능 여부를
              확인해 주세요.
            </p>
          </div>
        </section>
        <section id="faq" className="section container faq-section">
          <div>
            <span className="section-kicker">GOOD TO KNOW</span>
            <h2>궁금한 점이 있으신가요?</h2>
            <p>예약 전에 많이 궁금해하시는 내용을 모았어요.</p>
            <span className="faq-decoration">
              <Icon name="wind" />
            </span>
          </div>
          <div className="faq-list">
            {[
              [
                "에어컨 청소 비용은 어떻게 정해지나요?",
                "벽걸이·스탠드·시스템 등 기종과 대수, 모델, 설치 환경에 따라 달라집니다. 상담 시 모델과 현장 정보를 확인한 뒤 작업 범위와 비용을 안내합니다.",
              ],
              [
                "예약하면 바로 방문 일정이 확정되나요?",
                "희망 날짜를 남겨주시면 방문 가능 여부를 확인하고 일정을 조율하는 방식입니다. 현재 사이트는 사전 공개 화면으로, 입력한 예약 정보는 전송되지 않습니다.",
              ],
              [
                "청소 전에 미리 준비할 것이 있나요?",
                "에어컨 주변의 작은 물건을 치워주시고 물을 사용할 수 있는 장소를 확인해 주세요. 주차 가능 여부, 높은 천장이나 좁은 설치 공간도 미리 알려주시면 도움이 됩니다.",
              ],
              [
                "에어컨 설치나 이전도 가능한가요?",
                "현재는 에어컨 청소 서비스를 우선 준비하고 있습니다. 설치와 이전 서비스는 추후 제공 여부가 정해지면 별도로 안내하겠습니다.",
              ],
            ].map(([question, answer]) => (
              <details key={question}>
                <summary>
                  {question}
                  <span>+</span>
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>
        <section className="container closing">
          <div>
            <span>새로운 계절을 준비하는 가장 산뜻한 방법</span>
            <h2>깨끗한 바람, 지금부터 준비하세요.</h2>
          </div>
          <a className="button" href="#reservation">
            청소 예약 상담하기 <Icon name="arrow" />
          </a>
        </section>
      </main>
      <footer className="footer container">
        <div className="footer-top">
          <a className="brand" href="#">
            <span className="brand-symbol">
              <Icon name="wind" />
            </span>
            맑은바람
          </a>
          <span>공간을 맑게, 일상을 가볍게.</span>
          <a href="#reservation">
            예약 상담 <span>↗</span>
          </a>
        </div>
        <div className="footer-bottom">
          <p>
            서울 남서권 · 경기 남부권 에어컨 청소
            <br />
            <span>
              서비스 오픈 준비 중 · 예약 신청은 현재 미리보기로 제공됩니다.
            </span>
          </p>
          <span>
            © {new Date().getFullYear()} 맑은바람. All rights reserved.
          </span>
        </div>
      </footer>
    </>
  );
}
