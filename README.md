# 맑은바람 · 에어컨 청소 예약 사이트

Next.js 16 / React 19 / TypeScript 기반 1차 퍼블리싱입니다.

## 실행

```bash
npm ci
npm run dev
```

http://localhost:3000 에서 확인할 수 있습니다.

```bash
npm run lint
npm run build
npm start
```

## 구현 범위

- PC·모바일 반응형 메인 페이지
- 벽걸이·스탠드·시스템 청소 안내, 청소 과정, FAQ
- 동작·관악·영등포·구로·금천·서초·광명·과천·안양 방문 지역 안내
- 기종·지역·희망일 선택 및 고객 정보 입력, 예약 미리보기
- 필수 입력, 연락처 형식, 과거 날짜 검증

현재 예약은 프런트엔드 미리보기이며 서버 전송·저장·실제 접수는 하지 않습니다.
맑은바람은 임시 브랜드입니다. 요금·사업자 정보·연락처는 운영 정보 확정 후 반영해야 합니다.

## SEO 현황

적용됨:
- 한국어 문서 언어와 서비스·지역을 포함한 title / description
- 검색 로봇이 읽을 수 있는 정적 HTML 본문
- 제목 계층, 이미지 대체 텍스트, 모바일 반응형 레이아웃

운영 공개 전 남은 작업:
- 실제 도메인과 배포 환경 확정
- canonical, robots.txt, sitemap.xml 및 공유 메타데이터
- 지역별 고유 콘텐츠와 `/aircon-cleaning/dongjak` 등 개별 페이지
- 실제 업체 정보에 기반한 구조화 데이터
- 네이버 서치어드바이저·Google Search Console 등록 및 색인 확인
- 실제 작업사례, 확정된 가격 기준과 업체 연락처

현재 지역명은 메인 페이지에서 안내하며 지역별 독립 페이지는 아직 없습니다.
GitHub에 코드를 푸시하는 것만으로 웹사이트가 배포되거나 검색에 노출되는 것은 아닙니다.

## 주요 파일

- `app/page.tsx`: 메인 콘텐츠
- `app/components/booking.tsx`: 예약 미리보기
- `app/components/icons.tsx`: 아이콘과 기종 일러스트
- `app/globals.css`: 반응형 스타일
- `app/layout.tsx`: 공통 레이아웃과 메타데이터

대표 이미지는 Unsplash의 공간 연출 사진이며 실제 작업사례가 아닙니다.
