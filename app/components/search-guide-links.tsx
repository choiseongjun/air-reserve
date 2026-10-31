import Link from "next/link";
import { searchGuides } from "@/lib/search-guides";

export default function SearchGuideLinks({ job }: { job?: string }) {
  const guides = searchGuides.filter(g => g.category !== "에러코드" && (!job || g.job === job));
  return <section className="container section" aria-labelledby="search-guide-heading">
    <span className="section-kicker">견적 전 궁금한 점</span>
    <h2 id="search-guide-heading">비용과 작업 범위부터 확인하세요</h2>
    <p>철거·운반·배관 추가 항목과 분해청소 범위를 확인하고, 필요한 현장 정보로 상담을 시작하세요.</p>
    <div className="region-tips guide-costs">{guides.map(g => <article key={g.slug}>
      <h3><Link href={`/aircon-guide/${g.slug}`}>{g.title} →</Link></h3><p>{g.summary}</p>
    </article>)}</div>
    <div className="related-regions"><Link href="/aircon-guide">전체 비용·모델·에러코드 안내 →</Link></div>
  </section>;
}
