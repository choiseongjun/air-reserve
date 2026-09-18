import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { parseEnv } from "node:util";
import pg from "pg";
const env = parseEnv(readFileSync(".env.local", "utf8"));
const base = process.env.TEST_BASE_URL || "http://localhost:3000";
const origin = new URL(base).origin;
const client = new pg.Client({ connectionString: env.DATABASE_URL });
const requestIds = [];
const marker = `개발검증-${randomUUID().slice(0, 8)}`;
const date = new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10);
const input = {
  requestId: randomUUID(),
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
    "PASS: save/read, duplicate retry, changed retry, validation, origin protection, admin authorization, status update, retention auth, booking quota.",
  );
} finally {
  await client.query(
    "DELETE FROM air_reserve.bookings WHERE request_id=ANY($1::uuid[]) AND customer_name=$2",
    [requestIds, marker],
  );
  await client.end();
  console.log("Only synthetic records from this run were removed.");
}
