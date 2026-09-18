import Link from "next/link";
import { isAdmin } from "@/lib/admin-auth";
import { getPool } from "@/lib/db";
import { AdminLogin, AdminToolbar, BookingStatus } from "./controls";
export const metadata = {
  title: "예약 관리 | 맑은바람",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";
export default async function Admin({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const authenticated = await isAdmin();
  if (!authenticated)
    return (
      <main className="container section">
        <Link className="brand" href="/">
          맑은바람
        </Link>
        <h1 className="admin-title">예약 관리</h1>
        <p>담당자 전용 화면입니다.</p>
        <AdminLogin />
      </main>
    );
  const rawPage = Number((await searchParams).page);
  const page =
    Number.isSafeInteger(rawPage) && rawPage > 0 ? Math.min(rawPage, 10000) : 1;
  let rows;
  try {
    rows = (
      await getPool().query(
        "SELECT id,customer_name,phone,address,service,area,to_char(preferred_date,'YYYY-MM-DD') AS preferred_date,time_slot,quantity,notes,status,created_at FROM air_reserve.bookings ORDER BY created_at DESC LIMIT 21 OFFSET $1",
        [(page - 1) * 20],
      )
    ).rows;
  } catch {
    return (
      <main className="container section">
        <h1 className="admin-title">예약을 불러오지 못했습니다.</h1>
        <AdminToolbar />
      </main>
    );
  }
  return (
    <main className="container section">
      <div className="section-heading">
        <div>
          <Link href="/" className="brand">
            맑은바람
          </Link>
          <h1 className="admin-title">예약 접수 내역</h1>
          <p>
            접수 대기 → 고객 연락 → 방문 확정 순서로 관리해 주세요. 상태 변경은
            고객에게 자동 발송되지 않습니다.
          </p>
        </div>
        <AdminToolbar />
      </div>
      {!rows.length && <p>아직 접수된 예약이 없습니다.</p>}
      <div className="admin-bookings">
        {rows.slice(0, 20).map((row) => (
          <article key={row.id}>
            <div className="admin-booking-heading">
              <h2>
                {row.customer_name} · {row.area}
              </h2>
              <BookingStatus id={row.id} status={row.status} />
            </div>
            <dl>
              <dt>접수번호</dt>
              <dd>{row.id}</dd>
              <dt>연락처</dt>
              <dd>
                <a href={`tel:${row.phone}`}>{row.phone}</a>
              </dd>
              <dt>서비스</dt>
              <dd>
                {row.service} ·{" "}
                {row.quantity === 4 ? "4대 이상" : `${row.quantity}대`}
              </dd>
              <dt>희망 일정</dt>
              <dd>
                {row.preferred_date} · {row.time_slot}
              </dd>
              <dt>방문 주소</dt>
              <dd>{row.address}</dd>
              <dt>전달 사항</dt>
              <dd>{row.notes || "없음"}</dd>
              <dt>접수 시각</dt>
              <dd>
                {new Date(row.created_at).toLocaleString("ko-KR", {
                  timeZone: "Asia/Seoul",
                })}
              </dd>
            </dl>
          </article>
        ))}
      </div>
      <div className="admin-toolbar">
        {page > 1 && <Link href={`/admin?page=${page - 1}`}>← 이전</Link>}
        <span>{page} 페이지</span>
        {rows.length > 20 && (
          <Link href={`/admin?page=${page + 1}`}>다음 →</Link>
        )}
      </div>
    </main>
  );
}
