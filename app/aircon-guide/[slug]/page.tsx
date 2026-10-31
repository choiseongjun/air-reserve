import Link from "next/link";
import { notFound } from "next/navigation";
import SubHeader from "@/app/components/sub-header";
import Booking from "@/app/components/booking";
import { searchGuides, guideUpdated } from "@/lib/search-guides";
import { pageMetadata, siteUrl } from "@/lib/seo";
import styles from "../guide.module.css";

export const dynamicParams = false;
export function generateStaticParams() { return searchGuides.map(({ slug }) => ({ slug })); }
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const guide = searchGuides.find(g => g.slug === slug);
  if (!guide) notFound();
  return pageMetadata(`${guide.title} | 더에어컨파트너스`, guide.description, `/aircon-guide/${slug}`);
}
export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const g = searchGuides.find(g => g.slug === slug);
  if (!g) notFound();
  const url = `${siteUrl}/aircon-guide/${slug}`;
  const schema = { "@context": "https://schema.org", "@graph": [
    { "@type": "Article", headline: g.title, description: g.description, mainEntityOfPage: url,
      datePublished: guideUpdated, dateModified: guideUpdated, inLanguage: "ko-KR",
      author: { "@type": "Organization", name: "더에어컨파트너스", url: `${siteUrl}/about` },
      publisher: { "@id": `${siteUrl}/#organization` }, citation: g.source.url },
    { "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "에어컨 이용 안내", item: `${siteUrl}/aircon-guide` },
      { "@type": "ListItem", position: 3, name: g.title, item: url },
    ] },
  ] };
  return <><SubHeader /><main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
    <article>
      <header className={styles.intro}>
        <nav className={styles.crumb} aria-label="현재 위치"><Link href="/">홈</Link><span>/</span><Link href="/aircon-guide">에어컨 이용 안내</Link><span>/</span><span>{g.category}</span></nav>
        <h1>{g.title}</h1><p>{g.summary}</p>
        <p>작성·확인: 더에어컨파트너스 · <time dateTime={guideUpdated}>2026년 10월 31일</time></p>
        <a className="button" href={g.category === "에러코드" ? "#official-source" : "#reservation"}>{g.category === "에러코드" ? "제조사 공식 점검 안내 보기" : `${g.job} 견적 상담 접수하기`} →</a>
      </header>
      <div className={styles.body}>
        <aside className={styles.notice}><p>직접 시공하지 않는 상담 접수·업체 연결 서비스입니다. 지역과 작업 조건을 확인해 연결을 돕고, 실제 작업 범위·금액·방문 일정은 해당 업체와 협의합니다. 접수만으로 업체 배정이나 방문이 확정되지는 않습니다. <Link href="/about">연결 절차 보기</Link></p></aside>
        {g.sections.map(section => <section key={section.title}><h2>{section.title}</h2><p>{section.text}</p></section>)}
        <section><h2>상담 전에 준비할 정보</h2><ul>{g.checklist.map(item => <li key={item}>{item}</li>)}</ul><p>사진은 선택 사항입니다. 정확히 모르는 정보는 추측하지 말고 확인이 필요하다고 남겨 주세요.</p></section>
        <section><h2>자주 묻는 질문</h2>{g.faq.map(([question, answer]) => <details key={question} open><summary>{question}</summary><p>{answer}</p></details>)}</section>
        <section id="official-source"><h2>참고 자료와 안내 범위</h2><p><a href={g.source.url} target="_blank" rel="noopener noreferrer">{g.source.label} ↗</a></p><p>제조사 자료는 제품과 작업 범위를 확인하기 위한 참고 자료입니다. 본 서비스가 제조사 공식 서비스이거나 제조사 가격으로 작업한다는 의미는 아닙니다. 현장 정보 준비와 견적 질문은 더에어컨파트너스의 상담 안내이며, 실제 조건은 담당 업체와 확인하세요.</p></section>
        <section><h2>함께 확인할 안내</h2><div className={styles.related}>{g.related.map(slug => { const related = searchGuides.find(item => item.slug === slug)!; return <Link key={slug} href={`/aircon-guide/${slug}`}>{related.title} →</Link>; })}<Link href="/aircon-cleaning">서울·경기 지역별 상담 안내 →</Link></div></section>
        <section className={styles.notice}><h2>{g.category === "에러코드" ? "청소·설치 관련 별도 상담이 필요한가요?" : "우리 집 조건으로 견적 상담을 신청하세요"}</h2><p>{g.category === "에러코드" ? "오류가 반복되면 제조사 점검을 먼저 요청하세요. 아래 양식은 공식 AS나 부품 수리 예약이 아닌 청소·설치·이전설치 상담 접수입니다." : "지역과 희망일, 기종을 선택하고 필요한 작업을 남겨 주세요. 담당자가 현장 조건과 업체의 대응 가능 여부를 확인합니다."}</p><a className="button" href="#reservation">상담 요청 남기기 →</a></section>
      </div>
    </article>
    <Booking initialJobType={g.job} initialNotes={`${g.title} 안내를 보고 문의합니다.`} />
  </main></>;
}
