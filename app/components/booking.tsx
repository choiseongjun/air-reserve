"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { regions } from "@/lib/regions";
import {
  jobTypes,
  services,
  timeSlots,
  seoulDate,
  type BookingInput,
} from "@/lib/booking-validation";
import { Icon } from "./icons";
import { preparePhoto } from "@/lib/prepare-photo";
export default function Booking({
  initialArea = "",
  initialJobType = "청소",
  initialNotes = "",
}: {
  initialArea?: string;
  initialJobType?: string;
  initialNotes?: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null),
    form = useRef<HTMLFormElement>(null);
  const requestId = useRef("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [processingPhotos, setProcessingPhotos] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const [dateBounds, setDateBounds] = useState({ min: "", max: "" });
  const [jobType, setJobType] = useState(
      initialNotes.startsWith("이전설치 문의") ? "이전설치" : initialJobType,
    ),
    [service, setService] = useState(services[0]),
    [area, setArea] = useState(initialArea),
    [date, setDate] = useState("");
  const [pending, setPending] = useState(false),
    [error, setError] = useState("");
  const [receipt, setReceipt] = useState<{ id: string; name: string } | null>(
    null,
  );
  const close = () => {
    if (pending || processingPhotos) return;
    dialog.current?.close();
    if (receipt) {
      form.current?.reset();
      setReceipt(null);
      requestId.current = "";
      setPhotos([]);
      setPhotoError("");
    }
  };
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending || processingPhotos) return;
    const data = new FormData(event.currentTarget);
    const input: BookingInput = {
      requestId: requestId.current,
      jobType,
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
        body: JSON.stringify({
          ...input,
          photos,
          photoConsent: data.get("photoConsent") === "on",
        }),
        signal: AbortSignal.timeout(45000),
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
              <h2 id="booking-title">어떤 에어컨 상담이 필요하세요?</h2>
              <p>
                지역·작업 선택 → 현장 사진 첨부 → 연락처 입력으로 간편하게
                접수하세요.
              </p>
            </div>
            <span className="preview-badge">사진으로 간편 상담</span>
          </div>
          <form
            className="quick-booking"
            onSubmit={(e) => {
              e.preventDefault();
              const data = new FormData(e.currentTarget);
              setJobType(String(data.get("jobType")));
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
                <Icon name="check" /> 작업 종류
              </span>
              <select
                name="jobType"
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
              >
                {jobTypes.map((j) => (
                  <option key={j}>{j}</option>
                ))}
              </select>
            </label>
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
              사진 첨부하고 상담 접수 <Icon name="arrow" />
            </button>
          </form>
          <p className="booking-hint">
            <Icon name="info" /> 상담 접수 → 지역 내 작업 가능 업체 확인 →
            견적·일정 협의 → 예약 확정. 접수만으로 방문이 확정되지는 않습니다.
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
          disabled={pending || processingPhotos}
          onClick={close}
        >
          ×
        </button>
        <span className="section-kicker">BOOK YOUR FRESH AIR</span>
        <h2 id="dialog-title">
          {receipt
            ? "상담 요청이 접수되었어요"
            : `${area} 현장 사진과 연락처를 남겨주세요`}
        </h2>
        <p className="dialog-description">
          {receipt
            ? `${receipt.name}님, ${area} 작업 가능 여부를 확인하고 연락드립니다. 사진 ${photos.length}장도 접수 내용에 저장했습니다.`
            : "사진은 선택 사항입니다. 사진 없이도 상담을 접수할 수 있어요."}
        </p>
        <div className="booking-summary">
          <strong>
            {jobType} · {service}
          </strong>
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
            <div className="photo-upload">
              <h3>
                {area} {jobType} 상담 사진{" "}
                <span className="optional">선택 · 최대 3장</span>
              </h3>
              <p>
                {jobType === "청소"
                  ? "에어컨 전체 모습 · 모델명 · 오염이나 누수가 보이는 부분을 찍어주세요."
                  : jobType === "이전설치"
                    ? "기존 에어컨 · 새집 설치할 벽 · 실외기 놓을 곳을 찍어주세요."
                    : "설치할 벽 · 실외기 놓을 곳 · 제품 모델명을 찍어주세요."}
              </p>
              <p>
                얼굴·문서·비밀번호 등은 제외해 주세요. 사진은 공개되지 않으며
                상담 담당자만 확인합니다.
              </p>
              <label>
                {processingPhotos
                  ? "사진을 준비하고 있어요…"
                  : "현장 사진 선택"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  disabled={processingPhotos || photos.length >= 3}
                  onChange={async (e) => {
                    const files = Array.from(e.target.files || []);
                    e.target.value = "";
                    setPhotoError("");
                    if (files.length + photos.length > 3) {
                      setPhotoError("사진은 최대 3장까지 선택해 주세요.");
                      return;
                    }
                    setProcessingPhotos(true);
                    try {
                      const prepared: string[] = [];
                      for (const file of files)
                        prepared.push(await preparePhoto(file));
                      setPhotos((previous) => [...previous, ...prepared]);
                    } catch (error) {
                      setPhotoError(
                        error instanceof Error
                          ? error.message
                          : "사진을 다시 선택해 주세요.",
                      );
                    } finally {
                      setProcessingPhotos(false);
                    }
                  }}
                />
              </label>
              <small>
                JPG·PNG·WebP, 원본 1장당 20MB 이하. 전송 전 용량을 줄입니다.
              </small>
              <div className="photo-previews">
                {photos.map((photo, index) => (
                  <div key={index}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`data:image/jpeg;base64,${photo}`}
                      alt={`첨부할 현장 사진 ${index + 1}`}
                    />
                    <button
                      type="button"
                      disabled={processingPhotos}
                      onClick={() =>
                        setPhotos((previous) =>
                          previous.filter((_, i) => i !== index),
                        )
                      }
                    >
                      사진 {index + 1} 삭제
                    </button>
                  </div>
                ))}
              </div>
              {photoError && (
                <p role="alert" className="form-error">
                  {photoError}
                </p>
              )}
              {!!photos.length && (
                <label className="consent-check">
                  <input type="checkbox" name="photoConsent" required />
                  현장 사진을 견적 상담 목적으로 수집·이용하는 데 동의합니다.
                  접수일과 희망일 중 늦은 날부터 90일 후 삭제되며, 첨부를
                  취소해도 상담할 수 있습니다.
                </label>
              )}
            </div>
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
              작업할 동네·주소
              <input
                name="address"
                autoComplete="street-address"
                required
                minLength={5}
                maxLength={200}
                placeholder="예: 동작구 상도동 (동·호수는 상담 시 안내)"
              />
            </label>
            <div className="form-two">
              <label>
                {jobType} 대수
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
                defaultValue={initialNotes}
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
          <button
            className="button"
            type="submit"
            disabled={pending || processingPhotos}
          >
            {pending ? "사진과 상담 내용 접수 중…" : "상담 접수 완료하기"}
            <Icon name="arrow" />
          </button>
        </form>
      </dialog>
    </>
  );
}
