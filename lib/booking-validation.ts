import { regions } from "./regions";
export const services = [
  "벽걸이 에어컨",
  "스탠드 에어컨",
  "시스템 에어컨",
  "2in1 에어컨",
  "종류를 잘 모르겠어요",
];
export const timeSlots = ["시간 협의 가능", "오전 (9–12시)", "오후 (12–18시)"];
export const consentVersion = "2026-09-18";
export function seoulDate(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}
export type BookingInput = {
  requestId: string;
  service: string;
  area: string;
  date: string;
  name: string;
  phone: string;
  address: string;
  quantity: number;
  timeSlot: string;
  notes: string;
  consent: boolean;
  website?: string;
};
export function validateBooking(
  value: unknown,
  now = new Date(),
): BookingInput {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("예약 정보를 확인해 주세요.");
  const v = value as Record<string, unknown>;
  const text = (key: string, min: number, max: number) => {
    const t = typeof v[key] === "string" ? v[key].trim() : "";
    if (
      t.length < min ||
      t.length > max ||
      /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(t)
    )
      throw new Error("입력한 정보의 길이와 형식을 확인해 주세요.");
    return t;
  };
  const requestId = text("requestId", 36, 36);
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      requestId,
    )
  )
    throw new Error("예약 화면을 새로 열어 주세요.");
  const service = text("service", 1, 40),
    area = text("area", 1, 40),
    date = text("date", 10, 10);
  if (
    !services.includes(service) ||
    ![...regions.map((r) => r.name), "기타 지역 (상담 필요)"].includes(area)
  )
    throw new Error("서비스와 방문 지역을 확인해 주세요.");
  const parsed = new Date(`${date}T00:00:00Z`);
  const max = seoulDate(new Date(now.getTime() + 180 * 86400000));
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    !Number.isFinite(parsed.getTime()) ||
    parsed.toISOString().slice(0, 10) !== date ||
    date < seoulDate(now) ||
    date > max
  )
    throw new Error("희망 날짜는 오늘부터 180일 이내로 선택해 주세요.");
  const phone = text("phone", 9, 20).replace(/[\s-]/g, "");
  if (!/^0\d{8,10}$/.test(phone))
    throw new Error("연락처 형식을 확인해 주세요.");
  if (
    !Number.isInteger(v.quantity) ||
    Number(v.quantity) < 1 ||
    Number(v.quantity) > 4
  )
    throw new Error("청소 대수를 선택해 주세요.");
  const timeSlot = text("timeSlot", 1, 40);
  if (!timeSlots.includes(timeSlot))
    throw new Error("희망 시간대를 확인해 주세요.");
  if (v.consent !== true)
    throw new Error("개인정보 수집·이용에 동의해 주세요.");
  if (v.website) throw new Error("정상적인 예약 요청이 아닙니다.");
  return {
    requestId,
    service,
    area,
    date,
    name: text("name", 2, 40),
    phone,
    address: text("address", 5, 200),
    quantity: Number(v.quantity),
    timeSlot,
    notes: text("notes", 0, 1000),
    consent: true,
  };
}
