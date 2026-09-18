import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
export const adminCookie = "air_admin";
export function safeEqual(a: string, b: string) {
  return timingSafeEqual(
    createHash("sha256").update(a).digest(),
    createHash("sha256").update(b).digest(),
  );
}
export function signSession(expires: number) {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) throw new Error("Admin not configured");
  return `${expires}.${createHmac("sha256", secret).update(`air-admin:${expires}`).digest("hex")}`;
}
export async function isAdmin() {
  const value = (await cookies()).get(adminCookie)?.value;
  if (!value || !process.env.ADMIN_PASSWORD) return false;
  const expires = Number(value.split(".")[0]);
  if (
    !Number.isSafeInteger(expires) ||
    expires <= Date.now() ||
    expires > Date.now() + 8 * 3600000
  )
    return false;
  return safeEqual(value, signSession(expires));
}
