# 맑은바람 · 에어컨 청소 예약

운영 주소: https://air-reserve-three.vercel.app

## 실행

`npm ci` → `.env.local` 설정 → `npm run db:migrate` → `npm run dev`

환경 변수 이름은 `.env.example`을 참고하세요. 실제 비밀 값은 Git에 포함하지 않습니다.

## 기능

- 반응형 메인, 기종별 서비스와 작업 과정 안내
- 시·구·동 이름으로 방문 권역 검색: /aircon-cleaning
- 9개 지역별 정적 페이지: dongjak, gwanak, yeongdeungpo, guro, geumcheon, seocho, gwangmyeong, gwacheon, anyang
- PostgreSQL에 실제 예약 요청 저장, 접수번호 반환 (방문 확정은 담당자 상담 후)
- 동의 확인, 서버 입력 검증, 같은 요청의 중복 접수 방지, 시간당 신청 제한
- /admin에서 비밀번호 로그인 후 예약 조회·상태 변경, 20건씩 페이지 이동
- 접수일과 희망 방문일 중 늦은 날부터 90일 경과 예약 삭제: Vercel Cron이 매일 /api/cron/retention 호출

## 환경 설정

- DATABASE_URL: 서버 전용 PostgreSQL 연결 문자열
- BOOKING_HASH_SECRET: 전화번호·요청 해시용 임의의 긴 비밀 값. 운영 중 임의로 바꾸면 기존 요청 재시도에 영향을 줍니다.
- ADMIN_PASSWORD: /admin 로그인 비밀번호. 변경하면 기존 로그인 쿠키도 무효화됩니다.
- CRON_SECRET: 보관 기간 만료 데이터 정리 작업 인증 키
- SITE_URL: https://air-reserve-three.vercel.app
- GOOGLE_SITE_VERIFICATION / NAVER_SITE_VERIFICATION: 검색 도구의 소유권 확인 값 (선택)

현재 로컬 관리자 비밀번호는 Git에서 제외된 .env.local의 ADMIN_PASSWORD에서 확인합니다. 프로덕션 Vercel 환경 변수에도 같은 값을 등록합니다.

기존 recommand-menu와 같은 DB 연결을 사용하되 air_reserve 스키마에만 테이블을 생성합니다. 기존 앱 테이블에는 접근하지 않습니다. 인증서 certs/supabase-ca.crt는 공개 CA 인증서이며 서버 배포 파일에 포함합니다. 비밀번호·토큰·개인 키는 포함하지 않습니다. 스키마와 테이블의 PUBLIC 권한을 제거하고 RLS를 활성화했습니다. 운영용 DB 역할에는 이 스키마에 필요한 권한만 부여하는 것이 권장됩니다.

## SEO

지역마다 고유 title / description / H1, 방문 준비 사항·FAQ·동 목록을 제공합니다. canonical, Open Graph, robots.txt, sitemap.xml, Service 및 BreadcrumbList JSON-LD를 적용했습니다. 지역 검색 결과는 실제 링크로 연결되며 페이지 본문은 정적 HTML로 생성됩니다. 프리뷰 배포는 noindex 처리합니다.

네이버 서치어드바이저와 Google Search Console의 소유권 확인 및 사이트맵 제출은 계정에서 별도로 진행해야 합니다. 실제 작업사례와 확정 요금, 업체 정보는 운영 정보가 준비되면 추가하세요. 가짜 후기나 실적은 사용하지 않습니다.

## 검증

- npm test: 날짜·입력값·동의 검증
- npm run lint
- npm run build
- node scripts/smoke-booking.mjs: 실행 중인 로컬 서버에서 실제 DB 저장·재시도·권한·상태 변경·신청 제한 검증. 생성한 테스트 레코드만 삭제합니다. TEST_BASE_URL을 지정하면 해당 배포 환경을 검사합니다.

실제 연락처로 테스트하지 마세요. 예약 접수는 자동 문자나 이메일을 보내지 않으며, 담당자는 관리자 화면에서 확인 후 고객에게 직접 연락해야 합니다.

## 주요 경로

- app/page.tsx: 홈
- app/aircon-cleaning: 지역 검색과 상세 페이지
- app/components/booking.tsx: 예약 폼
- app/api/bookings: 예약 접수 API
- app/admin: 관리자 UI
- lib/bookings.ts: 트랜잭션·중복 방지·신청 제한
- db/001-bookings.sql: 전용 스키마

대표 이미지는 Unsplash의 공간 연출 사진이며 실제 작업사례가 아닙니다.
