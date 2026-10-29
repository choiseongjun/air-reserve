import { validateBooking } from "@/lib/booking-validation";
import { createBooking, BookingError } from "@/lib/bookings";
import { readJson, sameOrigin } from "@/lib/request";
import { validatePhotos } from "@/lib/booking-photos";
export const runtime = "nodejs";
export async function POST(request: Request) {
  if (!sameOrigin(request))
    return Response.json(
      { error: "허용되지 않은 요청입니다." },
      { status: 403 },
    );
  let input;
  let photos: Buffer[];
  try {
    const body = await readJson(request, 3200000);
    input = validateBooking(body);
    const raw = body as Record<string, unknown>;
    if (
      Array.isArray(raw.photos) &&
      raw.photos.length &&
      raw.photoConsent !== true
    )
      throw new Error("사진 수집·이용에 동의하거나 첨부를 취소해 주세요.");
    photos = await validatePhotos((body as Record<string, unknown>).photos);
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : "입력 정보를 확인해 주세요.",
      },
      { status: 400 },
    );
  }
  try {
    const result = await createBooking(input, photos);
    return Response.json(
      { id: result.id, status: "pending" },
      {
        status: result.duplicate ? 200 : 201,
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch (error) {
    if (error instanceof BookingError)
      return Response.json({ error: error.message }, { status: error.status });
    console.error("Booking save failed");
    return Response.json(
      {
        error:
          "접수하지 못했습니다. 입력 내용은 유지되니 잠시 후 다시 시도해 주세요.",
      },
      { status: 503 },
    );
  }
}
