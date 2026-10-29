import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { parseEnv } from "node:util";
import pg from "pg";
import sharp from "sharp";
const env = parseEnv(readFileSync(".env.local", "utf8"));
const base = process.env.TEST_BASE_URL || "http://localhost:3000";
const origin = new URL(base).origin;
const client = new pg.Client({ connectionString: env.DATABASE_URL });
const requestIds = [];
const marker = `개발검증-${randomUUID().slice(0, 8)}`;
const date = new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10);
const input = {
  requestId: randomUUID(),
  jobType: "이전설치",
  service: "벽걸이 에어컨",
  area: "동작구",
  date,
  name: marker,
  phone: "01000000000",
  address: "테스트 전용 주소 (실제 방문 금지)",
  quantity: 1,
  timeSlot: "시간 협의 가능",
  notes: "자동 검증 데이터; 검증 후 삭제",
  consent: true,
  photoConsent: true,
  photos: [(await sharp({ create: { width: 32, height: 32, channels: 3, background: "#2856ef" } }).jpeg().toBuffer()).toString("base64")],
};
async function send(path, body, options = {}) {
  return fetch(base + path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: origin,
      ...options.headers,
    },
    body: JSON.stringify(body),
    ...options,
  });
}
await client.connect();
try {
  assert.equal((await fetch(base + "/api/bookings")).status, 405);
  const badOrigin = await fetch(base + "/api/bookings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: "https://invalid.example",
    },
    body: JSON.stringify(input),
  });
  assert.equal(badOrigin.status, 403);
  for (const change of [
    { consent: false },
    { date: "2020-01-01" },
    { phone: "abc" },
    { quantity: 0 },
    { photoConsent: false },
    { photos: [Buffer.from("not an image").toString("base64")] },
    { photos: Array(4).fill(input.photos[0]) },
  ])
    assert.equal(
      (await send("/api/bookings", { ...input, ...change })).status,
      400,
    );
  requestIds.push(input.requestId);
  const first = await send("/api/bookings", input);
  assert.equal(first.status, 201);
  const saved = await first.json();
  assert.equal(saved.status, "pending");
  const repeat = await send("/api/bookings", input);
  assert.equal(repeat.status, 200);
  assert.equal((await repeat.json()).id, saved.id);
  assert.equal(
    (
      await send("/api/bookings", {
        ...input,
        address: "내용이 변경된 테스트 주소",
      })
    ).status,
    409,
  );
  const row = (
    await client.query(
      "SELECT customer_name, status, consent_version FROM air_reserve.bookings WHERE id=$1",
      [saved.id],
    )
  ).rows[0];
  assert.equal(row.customer_name, marker);
  assert.equal(row.status, "pending");
  assert.ok(row.consent_version);
  const unauthorized = await fetch(base + `/api/admin/bookings/${saved.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Origin: origin },
    body: JSON.stringify({ status: "confirmed" }),
  });
  assert.equal(unauthorized.status, 401);
  const loggedOut = await (await fetch(base + "/admin")).text();
  assert.ok(!loggedOut.includes(marker));
  const login = await send("/api/admin/session", {
    password: env.ADMIN_PASSWORD,
  });
  assert.equal(login.status, 200);
  const cookie = login.headers.get("set-cookie").split(";")[0];
  const photoRow = (await client.query("SELECT id FROM air_reserve.booking_photos WHERE booking_id=$1", [saved.id])).rows;
  assert.equal(photoRow.length, 1, "retry must not duplicate photos");
  assert.ok((await client.query("SELECT photo_consent_at FROM air_reserve.bookings WHERE id=$1", [saved.id])).rows[0].photo_consent_at);
  const photoPath = base + `/api/admin/photos/${photoRow[0].id}`;
  assert.equal((await fetch(photoPath)).status, 401);
  const image = await fetch(photoPath, { headers: { Cookie: cookie } });
  assert.equal(image.status, 200);
  assert.match(image.headers.get("cache-control"), /no-store/);
  assert.equal(image.headers.get("content-type"), "image/jpeg");
  assert.equal((await sharp(Buffer.from(await image.arrayBuffer())).metadata()).format, "jpeg");
  const admin = await (
    await fetch(base + "/admin", { headers: { Cookie: cookie } })
  ).text();
  assert.ok(admin.includes(marker));
  const updated = await fetch(base + `/api/admin/bookings/${saved.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Origin: origin,
      Cookie: cookie,
    },
    body: JSON.stringify({ status: "confirmed" }),
  });
  assert.equal(updated.status, 200);
  assert.equal(
    (
      await client.query(
        "SELECT status FROM air_reserve.bookings WHERE id=$1",
        [saved.id],
      )
    ).rows[0].status,
    "confirmed",
  );
  assert.equal((await fetch(base + "/api/cron/retention")).status, 401);
  for (let i = 0; i < 2; i++) {
    const requestId = randomUUID();
    requestIds.push(requestId);
    assert.equal(
      (await send("/api/bookings", { ...input, requestId })).status,
      201,
    );
  }
  const requestId = randomUUID();
  requestIds.push(requestId);
  assert.equal(
    (await send("/api/bookings", { ...input, requestId })).status,
    429,
  );
  console.log(
    "PASS: photo save/read, photo consent, malformed/too many images, duplicate retry, validation, origin protection, private photo authorization, status update, retention auth, booking quota.",
  );
} finally {
  await client.query(
    "DELETE FROM air_reserve.bookings WHERE request_id=ANY($1::uuid[]) AND customer_name=$2",
    [requestIds, marker],
  );
  assert.equal((await client.query("SELECT count(*)::int AS count FROM air_reserve.booking_photos p LEFT JOIN air_reserve.bookings b ON p.booking_id=b.id WHERE b.id IS NULL")).rows[0].count, 0);
  await client.end();
  console.log("Only synthetic records from this run were removed.");
}
