"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export function AdminLogin() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  return (
    <form
      className="detail-form admin-login"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setError("");
        const password = new FormData(e.currentTarget).get("password");
        try {
          const response = await fetch("/api/admin/session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password }),
          });
          const data = await response.json();
          if (!response.ok) throw new Error(data.error);
          router.refresh();
        } catch (error) {
          setError(
            error instanceof Error ? error.message : "로그인에 실패했습니다.",
          );
        } finally {
          setBusy(false);
        }
      }}
    >
      <label>
        관리자 비밀번호
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          maxLength={200}
        />
      </label>
      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}
      <button className="button" disabled={busy}>
        {busy ? "확인 중…" : "로그인"}
      </button>
    </form>
  );
}
export function AdminToolbar() {
  const router = useRouter();
  const [error, setError] = useState("");
  return (
    <div className="admin-toolbar">
      <button className="button small" onClick={() => router.refresh()}>
        새로고침
      </button>
      <button
        className="text-button"
        onClick={async () => {
          try {
            const r = await fetch("/api/admin/session", { method: "DELETE" });
            if (!r.ok) throw new Error();
            router.refresh();
          } catch {
            setError("로그아웃하지 못했습니다.");
          }
        }}
      >
        로그아웃
      </button>
      {error && <p role="alert">{error}</p>}
    </div>
  );
}
export function BookingStatus({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  return (
    <div>
      <select
        aria-label="예약 상태"
        value={status}
        disabled={busy}
        onChange={async (e) => {
          const value = e.target.value;
          setBusy(true);
          setError("");
          try {
            const response = await fetch(`/api/admin/bookings/${id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ status: value }),
            });
            if (!response.ok) {
              const data = await response.json();
              throw new Error(data.error || "변경하지 못했습니다.");
            }
            router.refresh();
          } catch (error) {
            setError(
              error instanceof Error ? error.message : "변경하지 못했습니다.",
            );
          } finally {
            setBusy(false);
          }
        }}
      >
        <option value="pending">접수 대기</option>
        <option value="confirmed">방문 확정</option>
        <option value="completed">작업 완료</option>
        <option value="cancelled">취소</option>
      </select>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
