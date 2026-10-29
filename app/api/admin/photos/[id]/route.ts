import { isAdmin } from "@/lib/admin-auth";
import { getPool } from "@/lib/db";
export const runtime = "nodejs";
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const headers = {
    "Cache-Control": "private, no-store",
    "X-Content-Type-Options": "nosniff",
  };
  if (!(await isAdmin())) return new Response(null, { status: 401, headers });
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id))
    return new Response(null, { status: 404, headers });
  try {
    const result = await getPool().query(
      "SELECT image FROM air_reserve.booking_photos WHERE id=$1",
      [id],
    );
    if (!result.rowCount) return new Response(null, { status: 404, headers });
    return new Response(new Uint8Array(result.rows[0].image), {
      headers: {
        ...headers,
        "Content-Type": "image/jpeg",
        "Content-Disposition": "inline; filename=consultation-photo.jpg",
      },
    });
  } catch {
    return new Response(null, { status: 503, headers });
  }
}
