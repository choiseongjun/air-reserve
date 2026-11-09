type InquiryNotice = { id: string; area: string; jobType: string; date: string; source?: string; photoCount: number };

export function inquiryMessage(input: InquiryNotice) {
  const clean = (value: string) => value.replace(/[\r\n]/g, " ").slice(0, 100);
  return ["[더에어컨파트너스] 새 문의 접수", `접수번호: ${clean(input.id)}`, `지역: ${clean(input.area)}`, `상담: ${clean(input.jobType)}`, `희망일: ${clean(input.date)}`, `접수 방식: ${input.source === "chat" ? "채팅" : "예약 폼"}`, `첨부 사진: ${input.photoCount}장`, "상세 내용: https://airconpartner.kr/admin"].join("\n");
}

// Called only on the server after a newly created booking has committed.
// Do not log errors from fetch: Telegram URLs contain the secret bot token.
export async function sendInquiryNotification(input: InquiryNotice, options: {
  token?: string; chatId?: string; fetcher?: typeof fetch;
} = {}): Promise<boolean> {
  const token = options.token ?? process.env.TELEGRAM_BOT_TOKEN;
  const chatId = options.chatId ?? process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) { console.warn("Telegram inquiry notification is not configured"); return false; }
  const fetcher = options.fetcher ?? fetch;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await fetcher(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: inquiryMessage(input), link_preview_options: { is_disabled: true } }),
        signal: AbortSignal.timeout(5000),
      });
      const result = await response.json() as { ok?: boolean };
      if (response.ok && result.ok === true) return true;
      if (response.status < 500) break;
    } catch { /* One bounded retry; the saved inquiry remains available in admin. */ }
  }
  console.error("Telegram inquiry notification failed; booking remains saved", input.id);
  return false;
}
