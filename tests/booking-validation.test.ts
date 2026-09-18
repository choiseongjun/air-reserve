import assert from "node:assert/strict";
import { test } from "node:test";
import { randomUUID } from "node:crypto";
import { validateBooking, seoulDate } from "../lib/booking-validation";
const now = new Date("2026-09-18T16:00:00Z");
const sample = () => ({
  requestId: randomUUID(),
  service: "벽걸이 에어컨",
  area: "동작구",
  date: "2026-09-20",
  name: "테스트 고객",
  phone: "010-0000-0000",
  address: "테스트 주소 123",
  quantity: 1,
  timeSlot: "시간 협의 가능",
  notes: "",
  consent: true,
});
test("normalizes phone and trims user text", () => {
  const value = validateBooking({ ...sample(), name: "  테스트 고객  " }, now);
  assert.equal(value.phone, "01000000000");
  assert.equal(value.name, "테스트 고객");
});
test("Korean day boundary rejects yesterday", () => {
  assert.equal(seoulDate(now), "2026-09-19");
  assert.throws(() =>
    validateBooking({ ...sample(), date: "2026-09-18" }, now),
  );
});
test("rejects impossible and distant calendar dates", () => {
  for (const date of ["2026-02-30", "2026-13-01", "2027-12-01", "20-09-2026"])
    assert.throws(() => validateBooking({ ...sample(), date }, now));
});
test("requires explicit consent, valid enums, and bounded fields", () => {
  for (const change of [
    { consent: false },
    { consent: "true" },
    { quantity: 0 },
    { quantity: 1.5 },
    { quantity: 5 },
    { area: "부산" },
    { service: "설치" },
    { phone: "abc" },
    { notes: "x".repeat(1001) },
    { address: "" },
    { website: "bot" },
    { requestId: "not-a-uuid" },
  ])
    assert.throws(() => validateBooking({ ...sample(), ...change }, now));
});
test("rejects malformed body", () => {
  for (const value of [null, [], "text", {}, 42])
    assert.throws(() => validateBooking(value, now));
});
