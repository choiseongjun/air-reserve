import "server-only";
import { createHmac, randomUUID } from "node:crypto";
import { getPool } from "./db";
import { consentVersion, type BookingInput } from "./booking-validation";
export class BookingError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}
export async function createBooking(input: BookingInput) {
  const secret = process.env.BOOKING_HASH_SECRET;
  if (!secret) throw new Error("Booking configuration is missing");
  const hash = (v: string) =>
    createHmac("sha256", secret).update(v).digest("hex");
  const phoneHash = hash(input.phone),
    payloadHash = hash(JSON.stringify(input));
  const client = await getPool().connect();
  try {
    await client.query("BEGIN");
    // Serialize the short submission transaction across instances for reliable quotas and retries.
    await client.query("SELECT pg_advisory_xact_lock(9182026, 1)");
    const existing = await client.query(
      "SELECT id, payload_hash FROM air_reserve.bookings WHERE request_id=$1",
      [input.requestId],
    );
    if (existing.rowCount) {
      if (existing.rows[0].payload_hash !== payloadHash)
        throw new BookingError(
          "이전 요청과 내용이 다릅니다. 예약 창을 닫고 다시 신청해 주세요.",
          409,
        );
      await client.query("COMMIT");
      return { id: existing.rows[0].id as string, duplicate: true };
    }
    const counts = await client.query(
      "SELECT count(*)::int AS total, count(*) FILTER (WHERE phone_hash=$1)::int AS phone FROM air_reserve.bookings WHERE created_at > now() - interval '1 hour'",
      [phoneHash],
    );
    if (counts.rows[0].phone >= 3 || counts.rows[0].total >= 100)
      throw new BookingError(
        "신청이 반복되고 있습니다. 잠시 후 다시 시도해 주세요.",
        429,
      );
    const id = randomUUID();
    await client.query(
      "INSERT INTO air_reserve.bookings (id,request_id,payload_hash,customer_name,phone,phone_hash,address,service,area,preferred_date,time_slot,quantity,notes,consent_version) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)",
      [
        id,
        input.requestId,
        payloadHash,
        input.name,
        input.phone,
        phoneHash,
        input.address,
        input.service,
        input.area,
        input.date,
        input.timeSlot,
        input.quantity,
        input.notes,
        consentVersion,
      ],
    );
    await client.query("COMMIT");
    return { id, duplicate: false };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
