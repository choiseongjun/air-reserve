"use client";
import { useRef, useState } from "react";
import { Icon } from "./icons";
export default function Booking() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [service, setService] = useState("벽걸이 에어컨");
  const [area, setArea] = useState("");
  const [date, setDate] = useState("");
  const [review, setReview] = useState(false);
  const [customer, setCustomer] = useState("");
  const [today] = useState(() =>
    new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Seoul" }),
  );
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
              <p>간편하게 선택하고 예약 상담을 준비하세요.</p>
            </div>
            <span className="preview-badge">예약 미리보기</span>
          </div>
          <form
            className="quick-booking"
            onSubmit={(event) => {
              event.preventDefault();
              setDate(
                String(new FormData(event.currentTarget).get("date") ?? ""),
              );
              setReview(false);
              dialog.current?.showModal();
            }}
          >
            <label>
              <span>
                <Icon name="wind" /> 에어컨 종류
              </span>
              <select
                value={service}
                onChange={(event) => setService(event.target.value)}
              >
                <option>벽걸이 에어컨</option>
                <option>스탠드 에어컨</option>
                <option>시스템 에어컨</option>
                <option>2in1 에어컨</option>
                <option>종류를 잘 모르겠어요</option>
              </select>
            </label>
            <label>
              <span>
                <Icon name="pin" /> 방문 지역
              </span>
              <select
                required
                value={area}
                onChange={(event) => setArea(event.target.value)}
              >
                <option value="" disabled>
                  지역을 선택해 주세요
                </option>
                <optgroup label="서울">
                  {[
                    "동작구",
                    "관악구",
                    "영등포구",
                    "구로구",
                    "금천구",
                    "서초구",
                  ].map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                </optgroup>
                <optgroup label="경기">
                  {["광명시", "과천시", "안양시"].map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                </optgroup>
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
                min={today}
                value={date}
                onChange={(event) => setDate(event.target.value)}
              />
            </label>
            <button type="submit" className="button">
              예약 상담하기 <Icon name="arrow" />
            </button>
          </form>
          <p className="booking-hint">
            <Icon name="info" /> 방문 일정과 비용은 상담 후 확정됩니다. 현재
            입력 정보는 전송되지 않습니다.
          </p>
        </div>
      </section>
      <dialog
        ref={dialog}
        className="booking-dialog"
        aria-labelledby="dialog-title"
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        <button
          type="button"
          className="dialog-close"
          aria-label="예약 창 닫기"
          onClick={() => dialog.current?.close()}
        >
          ×
        </button>
        <span className="section-kicker">BOOK YOUR FRESH AIR</span>
        <h2 id="dialog-title">
          {review ? "예약 내용을 확인해 주세요" : "조금만 더 알려주세요"}
        </h2>
        <p className="dialog-description">
          {review
            ? `${customer}님이 선택하신 청소 상담 내용입니다.`
            : "상담에 필요한 정보를 미리 작성해 볼 수 있어요."}
        </p>
        <div className="booking-summary">
          <strong>{service}</strong>
          <span>
            {area} · {date}
          </span>
        </div>
        {review && (
          <div className="review-result" role="status">
            <span className="result-icon">
              <Icon name="check-circle" />
            </span>
            <h3>미리보기 작성이 완료되었어요.</h3>
            <p>
              아직 예약이 접수되지는 않았습니다.
              <br />
              서비스 오픈 후 실제 예약을 이용하실 수 있어요.
            </p>
            <button className="button" onClick={() => dialog.current?.close()}>
              확인했어요
            </button>
            <button className="back-button" onClick={() => setReview(false)}>
              입력 내용 수정하기
            </button>
          </div>
        )}
        <form
          className="detail-form"
          hidden={review}
          onSubmit={(event) => {
            event.preventDefault();
            setReview(true);
          }}
        >
          <label>
            성함
            <input
              autoComplete="name"
              required
              maxLength={40}
              placeholder="성함을 입력해 주세요"
              value={customer}
              onChange={(event) => setCustomer(event.target.value)}
            />
          </label>
          <label>
            연락처
            <input
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
              autoComplete="street-address"
              required
              placeholder="도로명 또는 아파트명을 입력해 주세요"
              maxLength={200}
            />
          </label>
          <div className="form-two">
            <label>
              청소 대수
              <select defaultValue="1">
                <option value="1">1대</option>
                <option value="2">2대</option>
                <option value="3">3대</option>
                <option value="4">4대 이상</option>
              </select>
            </label>
            <label>
              희망 시간대
              <select>
                <option>시간 협의 가능</option>
                <option>오전 (9–12시)</option>
                <option>오후 (12–18시)</option>
              </select>
            </label>
          </div>
          <label>
            전달하실 내용 <span className="optional">선택</span>
            <textarea
              maxLength={1000}
              rows={3}
              placeholder="모델명, 주차 가능 여부, 불편한 점 등을 알려주세요."
            />
          </label>
          <div className="form-notice">
            <Icon name="info" />
            <span>
              화면 미리보기 단계입니다. 입력 내용은 서버에 전송되거나 저장되지
              않으며, 실제 예약은 접수되지 않습니다.
            </span>
          </div>
          <button className="button" type="submit">
            예약 내용 확인하기 <Icon name="arrow" />
          </button>
        </form>
      </dialog>
    </>
  );
}
