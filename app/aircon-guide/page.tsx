import Link from "next/link";
import SubHeader from "@/app/components/sub-header";
import { pageMetadata } from "@/lib/seo";
import { searchGuides } from "@/lib/search-guides";
import styles from "./guide.module.css";

export const metadata = pageMetadata(
  "에어컨 설치·이전설치 비용과 청소·에러코드 안내 | 더에어컨파트너스",
  "이전설치 추가 비용, 2in1 이사, 아파트 매립배관, 중고 에어컨 설치, 분해청소 범위와 CH05·C101 안내. 필요한 정보를 확인하고 서울·경기 견적 상담을 접수하세요.",
  "/aircon-guide",
);
export default function GuideIndex() {
  return <><SubHeader /><main>
    <header className={styles.intro}>
      <nav className={styles.crumb} aria-label="현재 위치"><Link href="/">홈</Link><span>/</span><span>에어컨 이용 안내</span></nav>
      <h1>에어컨 비용과 작업 범위,<br />상담 전에 확인하세요</h1>
      <p>이전설치 견적에 무엇이 포함되는지, 청소 범위는 어떻게 비교하는지, 오류가 나면 어디에 문의하는지. 필요한 안내를 찾아 현장 정보를 준비할 수 있습니다.</p>
      <p>더에어컨파트너스는 직접 시공하는 업체가 아닌 상담 접수·업체 연결 서비스입니다. 모델별 점검은 제조사 공식 안내를 우선합니다.</p>
    </header>
    <div className="container section"><div className={styles.grid}>{searchGuides.map(g =>
      <Link className={styles.card} key={g.slug} href={`/aircon-guide/${g.slug}`}><span className={styles.category}>{g.category}</span><h2>{g.title}</h2><p>{g.description}</p><span>자세히 확인하기 →</span></Link>
    )}</div></div>
  </main></>;
}
