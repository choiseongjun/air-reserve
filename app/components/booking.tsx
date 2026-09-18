"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { regions } from "@/lib/regions";
import {
  services,
  timeSlots,
  seoulDate,
  type BookingInput,
} from "@/lib/booking-validation";
import { Icon } from "./icons";
export default function Booking({
  initialArea = "",
}: {
  initialArea?: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null),
    form = useRef<HTMLFormElement>(null);
  const requestId = useRef("");
  const [dateBounds, setDateBounds] = useState({ min: "", max: "" });
  const [service, setService] = useState(services[0]),
    [area, setArea] = useState(initialArea),
    [date, setDate] = useState("");
  const [pending, setPending] = useState(false),
    [error, setError] = useState("");
  const [receipt, setReceipt] = useState<{ id: string; name: string } | null>(
    null,
  );
  const close = () => {
    if (pending) return;
    dialog.current?.close();
    if (receipt) {
      form.current?.reset();
      setReceipt(null);
      requestId.current = "";
    }
  };
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const data = new FormData(event.currentTarget);
    const input: BookingInput = {
      requestId: requestId.current,
      service,
      area,
      date,
      name: String(data.get("name") || ""),
      phone: String(data.get("phone") || ""),
      address: String(data.get("address") || ""),
      quantity: Number(data.get("quantity")),
      timeSlot: String(data.get("timeSlot") || ""),
      notes: String(data.get("notes") || ""),
      consent: data.get("consent") === "on",
      website: String(data.get("website") || ""),
    };
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
        signal: AbortSignal.timeout(20000),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "예약을 접수하지 못했습니다.");
      setReceipt({ id: result.id, name: input.name });
    } catch (error) {
      setError(
        error instanceof Error &&
          error.name !== "TimeoutError" &&
          error.name !== "TypeError"
          ? error.message
          : "서버 응답을 확인하지 못했습니다. 입력 내용을 유지한 채 다시 눌러주세요. 같은 요청은 중복 접수되지 않습니다.",
      );
    } finally {
      setPending(false);
    }
  }
  return (
    <>
      <section
        className="container booking-wrapper"
        id="reservation"
        aria-labelledby="booking-title"
      >
        <div className="booking-card">
          <div className="booking-intro">
            <span className="mini-icon">
              <Icon name="calendar" />
            </span>
            <div>
              <h2 id="booking-title">우리 집 에어컨, 청소가 필요할 때</h2>
              <p>희망 일정을 남기면 상담 후 방문을 확정합니다.</p>
            </div>
            <span className="preview-badge">온라인 예약 접수</span>
          </div>
          <form
            className="quick-booking"
            onSubmit={(e) => {
              e.preventDefault();
              const data = new FormData(e.currentTarget);
              setService(String(data.get("service")));
              setArea(String(data.get("area")));
              setDate(String(data.get("date")));
              if (!requestId.current || receipt)
                requestId.current = crypto.randomUUID();
              setReceipt(null);
              setError("");
              dialog.current?.showModal();
            }}
          >
            <label>
              <span>
                <Icon name="wind" /> 에어컨 종류
              </span>
              <select
                name="service"
                value={service}
                onChange={(e) => setService(e.target.value)}
              >
                {services.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
            <label>
              <span>
                <Icon name="pin" /> 방문 지역
              </span>
              <select
                name="area"
                required
                value={area}
                onChange={(e) => setArea(e.target.value)}
              >
                <option value="" disabled>
                  지역을 선택해 주세요
                </option>
                {["서울", "경기"].map((province) => (
                  <optgroup label={province} key={province}>
                    {regions
                      .filter((r) => r.province === province)
                      .map((r) => (
                        <option key={r.slug}>{r.name}</option>
                      ))}
                  </optgroup>
                ))}
                <option>기타 지역 (상담 필요)</option>
              </select>
            </label>
            <label>
              <span>
                <Icon name="calendar" /> 희망 날짜
              </span>
              <input
                type="date"
                name="date"
                aria-label="희망 날짜"
                required
                min={dateBounds.min}
                max={dateBounds.max}
                onFocus={() =>
                  setDateBounds({
                    min: seoulDate(),
                    max: seoulDate(new Date(Date.now() + 180 * 86400000)),
                  })
                }
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </label>
            <button className="button">
              예약 상담하기 <Icon name="arrow" />
            </button>
          </form>
          <p className="booking-hint">
            <Icon name="info" /> 예약은 접수 대기 상태로 저장되며, 비용과 방문
            일정은 담당자 상담 후 확정됩니다.
          </p>
        </div>
      </section>
      <dialog
        ref={dialog}
        className="booking-dialog"
        aria-labelledby="dialog-title"
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        <button
          type="button"
          className="dialog-close"
          aria-label="예약 창 닫기"
          disabled={pending}
          onClick={close}
        >
          ×
        </button>
        <span className="section-kicker">BOOK YOUR FRESH AIR</span>
        <h2 id="dialog-title">
          {receipt ? "예약 요청이 접수되었어요" : "조금만 더 알려주세요"}
        </h2>
        <p className="dialog-description">
          {receipt
            ? `${receipt.name}님, 담당자가 연락해 방문 일정을 조율합니다.`
            : "상담과 방문에 필요한 정보를 입력해 주세요."}
        </p>
        <div className="booking-summary">
          <strong>{service}</strong>
          <span>
            {area} · {date}
          </span>
        </div>
        {receipt && (
          <div className="review-result" role="status">
            <span className="result-icon">
              <Icon name="check-circle" />
            </span>
            <h3>접수 대기</h3>
            <p>
              희망 날짜에 방문이 확정된 것은 아닙니다.
              <br />
              아래 접수번호를 보관해 주세요.
            </p>
            <code className="receipt-number">{receipt.id}</code>
            <button className="button" onClick={close}>
              확인했어요
            </button>
          </div>
        )}
        <form
          ref={form}
          className="detail-form"
          hidden={!!receipt}
          onSubmit={submit}
          aria-busy={pending}
        >
          <fieldset disabled={pending} className="booking-fields">
            <label>
              성함
              <input
                name="name"
                autoComplete="name"
                required
                minLength={2}
                maxLength={40}
                placeholder="성함을 입력해 주세요"
              />
            </label>
            <label>
              연락처
              <input
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                pattern="0[0-9]{1,2}-?[0-9]{3,4}-?[0-9]{4}"
                title="숫자와 하이픈으로 연락처를 입력해 주세요"
                placeholder="010-0000-0000"
              />
            </label>
            <label>
              방문 주소
              <input
                name="address"
                autoComplete="street-address"
                required
                minLength={5}
                maxLength={200}
                placeholder="도로명 주소와 상세 주소를 입력해 주세요"
              />
            </label>
            <div className="form-two">
              <label>
                청소 대수
                <select name="quantity" defaultValue="1">
                  {[1, 2, 3, 4].map((n) => (
                    <option key={n} value={n}>
                      {n === 4 ? "4대 이상" : `${n}대`}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                희망 시간대
                <select name="timeSlot">
                  {timeSlots.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </label>
            </div>
            <label>
              전달하실 내용 <span className="optional">선택</span>
              <textarea
                name="notes"
                maxLength={1000}
                rows={3}
                placeholder="모델명, 주차 가능 여부, 불편한 점 등을 알려주세요."
              />
            </label>
            <div className="honeypot" aria-hidden="true">
              <label>
                웹사이트
                <input name="website" tabIndex={-1} autoComplete="off" />
              </label>
            </div>
            <div className="consent-notice">
              <p>
                이름·연락처·주소와 예약 정보를 상담 및 일정 조율 목적으로
                수집하며 접수일과 희망 방문일 중 늦은 날부터 90일간 보관합니다.
              </p>
              <Link href="/privacy" target="_blank" rel="noopener noreferrer">
                개인정보 수집·이용 안내 보기 ↗
              </Link>
              <label className="consent-check">
                <input type="checkbox" name="consent" required /> 개인정보
                수집·이용에 동의합니다. (필수)
              </label>
            </div>
            <p className="booking-hint">
              작업 비용과 방문 가능 여부는 상담 후 안내합니다.
            </p>
          </fieldset>
          {error && (
            <p role="alert" className="form-error">
              {error}
            </p>
          )}
          <button className="button" type="submit" disabled={pending}>
            {pending ? "예약 접수 중…" : "예약 상담 신청하기"}
            <Icon name="arrow" />
          </button>
        </form>
      </dialog>
    </>
  );
}
