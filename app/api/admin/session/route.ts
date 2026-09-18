import { createHmac } from "node:crypto";
import { cookies } from "next/headers";
import { adminCookie, safeEqual, signSession } from "@/lib/admin-auth";
import { getPool } from "@/lib/db";
import { readJson, sameOrigin } from "@/lib/request";
export const runtime = "nodejs";
export async function POST(request: Request) {
  if (!sameOrigin(request))
    return Response.json(
      { error: "허용되지 않은 요청입니다." },
      { status: 403 },
    );
  const password = process.env.ADMIN_PASSWORD;
  if (!password)
    return Response.json(
      { error: "관리자 설정이 필요합니다." },
      { status: 503 },
    );
  let input;
  try {
    input = (await readJson(request, 2000)) as { password?: unknown };
    if (typeof input?.password !== "string") throw new Error();
  } catch {
    return Response.json(
      { error: "비밀번호를 입력해 주세요." },
      { status: 400 },
    );
  }
  try {
    // Only Vercel's overwritten IP header is trusted; local development uses one shared bucket.
    const source = process.env.VERCEL
      ? request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
        "unknown"
      : "local";
    const bucket = createHmac("sha256", password).update(source).digest("hex");
    const result = await getPool().query(
      "INSERT INTO air_reserve.admin_attempts(bucket,expires_at) VALUES($1,now()+interval '15 minutes') ON CONFLICT(bucket) DO UPDATE SET attempts=CASE WHEN air_reserve.admin_attempts.expires_at<now() THEN 1 ELSE air_reserve.admin_attempts.attempts+1 END, expires_at=CASE WHEN air_reserve.admin_attempts.expires_at<now() THEN now()+interval '15 minutes' ELSE air_reserve.admin_attempts.expires_at END RETURNING attempts",
      [bucket],
    );
    if (result.rows[0].attempts > 10)
      return Response.json(
        { error: "로그인 시도가 많습니다. 15분 후 다시 시도해 주세요." },
        { status: 429 },
      );
    if (!safeEqual(input.password as string, password))
      return Response.json(
        { error: "비밀번호를 확인해 주세요." },
        { status: 401 },
      );
    (await cookies()).set(adminCookie, signSession(Date.now() + 8 * 3600000), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 8 * 3600,
    });
    return Response.json(
      { ok: true },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json(
      { error: "로그인을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요." },
      { status: 503 },
    );
  }
}
export async function DELETE(request: Request) {
  if (!sameOrigin(request)) return new Response(null, { status: 403 });
  (await cookies()).delete(adminCookie);
  return Response.json({ ok: true });
}
