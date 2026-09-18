import { isAdmin } from "@/lib/admin-auth";
import { getPool } from "@/lib/db";
import { sameOrigin, readJson } from "@/lib/request";
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!sameOrigin(request) || !(await isAdmin()))
    return Response.json(
      { error: "관리자 로그인이 필요합니다." },
      { status: 401 },
    );
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return new Response(null, { status: 400 });
  let status;
  try {
    const input = (await readJson(request, 1000)) as { status?: unknown };
    status = input.status;
    if (
      !["pending", "confirmed", "completed", "cancelled"].includes(
        String(status),
      )
    )
      throw new Error();
  } catch {
    return Response.json(
      { error: "올바른 상태를 선택해 주세요." },
      { status: 400 },
    );
  }
  try {
    const result = await getPool().query(
      "UPDATE air_reserve.bookings SET status=$1,updated_at=now() WHERE id=$2 RETURNING id",
      [status, id],
    );
    return Response.json(
      { ok: !!result.rowCount },
      { status: result.rowCount ? 200 : 404 },
    );
  } catch {
    return Response.json(
      { error: "상태를 변경하지 못했습니다." },
      { status: 503 },
    );
  }
}
