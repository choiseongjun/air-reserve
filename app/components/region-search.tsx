"use client";
import Link from "next/link";
import { useState } from "react";
import { regions } from "@/lib/regions";
import { Icon } from "./icons";
export default function RegionSearch() {
  const [query, setQuery] = useState("");
  const normalized = query.replace(/\s/g, "").toLowerCase();
  const matches = regions.filter((r) =>
    `${r.province}${r.name}${r.neighborhoods.join("")}`.includes(normalized),
  );
  return (
    <div className="region-search">
      <label htmlFor="region-query">
        <Icon name="pin" /> 우리 동네 방문 지역 찾기
      </label>
      <input
        id="region-query"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="구·시·동 이름 검색 (예: 상도동, 철산동)"
      />
      <p role="status">
        {matches.length
          ? `${matches.length}개 권역에서 상담할 수 있어요.`
          : "안내 권역에서 찾지 못했어요. 기타 지역으로 방문 가능 여부를 문의해 주세요."}
      </p>
      <div className="region-results">
        {matches.map((r) => (
          <Link key={r.slug} href={`/aircon-cleaning/${r.slug}`}>
            <strong>
              {r.name} 에어컨 청소 <span>↗</span>
            </strong>
            <small>{r.neighborhoods.join(" · ")}</small>
          </Link>
        ))}
      </div>
      {!matches.length && (
        <Link className="text-button" href="/#reservation">
          기타 지역 방문 문의 →
        </Link>
      )}
    </div>
  );
}
