import test from "node:test";
import assert from "node:assert/strict";
import { inquiryMessage, sendInquiryNotification } from "../lib/telegram";
const notice = { id: "test-id", area: "동작구", jobType: "설치", date: "2026-11-12", source: "chat", photoCount: 2 };
test("notification contains useful summary without customer identity or photo payload", () => {
  const text = inquiryMessage({ ...notice, phone: "01012345678", name: "private-name", photos: ["secret-photo"] } as typeof notice);
  assert.ok(text.includes("동작구") && text.includes("채팅") && text.includes("2장"));
  assert.ok(!/01012345678|private-name|secret-photo/.test(text));
});
test("Telegram API failure does not throw; transient failure retries", async () => {
  let calls = 0;
  const fetcher = (async () => { calls++; return Response.json({ ok: calls === 2 }, { status: calls === 2 ? 200 : 503 }); }) as typeof fetch;
  assert.equal(await sendInquiryNotification(notice, {token:"test-token", chatId:"1", fetcher}), true);
  assert.equal(calls, 2);
  assert.equal(await sendInquiryNotification(notice, { token:"test-token", chatId:"1", fetcher: (async () => Response.json({ok:false}, {status:403})) as typeof fetch }), false);
});
