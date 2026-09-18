import { safeEqual } from "@/lib/admin-auth";
import { getPool } from "@/lib/db";
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (
    !secret ||
    !safeEqual(request.headers.get("authorization") || "", `Bearer ${secret}`)
  )
    return new Response(null, { status: 401 });
  try {
    const result = await getPool().query(
      "DELETE FROM air_reserve.bookings WHERE created_at < now()-interval '90 days' AND preferred_date < (now() AT TIME ZONE 'Asia/Seoul')::date - 90",
    );
    await getPool().query(
      "DELETE FROM air_reserve.admin_attempts WHERE expires_at<now()",
    );
    return Response.json(
      { deleted: result.rowCount },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json({ error: "Retention job failed" }, { status: 503 });
  }
}
