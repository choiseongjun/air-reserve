import { guideUpdated, searchGuides } from "./search-guides";

export function escapeXml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;");
}

export function createGuideFeed(base: string): string {
  const date = new Date(`${guideUpdated}T00:00:00+09:00`).toUTCString();
  const items = searchGuides.map(g => {
    const url = `${base}/aircon-guide/${g.slug}`;
    const content = [
      `<p>${escapeXml(g.summary)}</p>`,
      "<p>더에어컨파트너스는 직접 시공하는 업체가 아닌 상담 접수·업체 연결 서비스입니다. 접수만으로 방문이나 업체 배정이 확정되지는 않습니다.</p>",
      ...g.sections.map(s => `<h2>${escapeXml(s.title)}</h2><p>${escapeXml(s.text)}</p>`),
      `<h2>상담 전에 준비할 정보</h2><ul>${g.checklist.map(t => `<li>${escapeXml(t)}</li>`).join("")}</ul>`,
      "<p>사진은 선택 사항입니다. 정확히 모르는 정보는 추측하지 말고 확인이 필요하다고 남겨 주세요.</p>",
      "<h2>자주 묻는 질문</h2>",
      ...g.faq.map(([q, a]) => `<h3>${escapeXml(q)}</h3><p>${escapeXml(a)}</p>`),
      `<h2>참고 자료와 안내 범위</h2><p><a href="${escapeXml(g.source.url)}">${escapeXml(g.source.label)}</a></p>`,
      "<p>제조사 자료는 제품과 작업 범위를 확인하기 위한 참고 자료입니다. 본 서비스가 제조사 공식 서비스이거나 제조사 가격으로 작업한다는 의미는 아닙니다. 현장 정보 준비와 견적 질문은 더에어컨파트너스의 상담 안내이며, 실제 조건은 담당 업체와 확인하세요.</p>",
      `<p><a href="${url}#reservation">청소·설치·이전설치 상담 접수</a></p>`,
    ].join("");
    return `<item><title>${escapeXml(g.title)}</title><link>${url}</link><guid isPermaLink="true">${url}</guid><pubDate>${date}</pubDate><category>${escapeXml(g.category)}</category><description>${escapeXml(g.description)}</description><content:encoded>${escapeXml(content)}</content:encoded></item>`;
  }).join("");
  return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>더에어컨파트너스 에어컨 이용 안내</title><link>${base}/aircon-guide</link><description>에어컨 설치·이전설치·청소 비용과 작업 범위, 공식 자료 기반 에러코드 안내</description><language>ko-KR</language><lastBuildDate>${date}</lastBuildDate><atom:link href="${base}/feed.xml" rel="self" type="application/rss+xml"/>${items}</channel></rss>`;
}
