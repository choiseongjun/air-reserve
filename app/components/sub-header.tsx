import Link from "next/link";
import { Icon } from "./icons";
export default function SubHeader() {
  return (
    <header className="header">
      <div className="container header-inner">
        <Link href="/" className="brand">
          <span className="brand-symbol">
            <Icon name="wind" />
          </span>
          더에어컨파트너스
        </Link>
        <nav aria-label="주 메뉴">
          <Link href="/aircon-cleaning">방문 지역 찾기</Link>
          <Link href="/aircon-install">설치</Link>
          <Link href="/aircon-relocation">이전설치</Link>
          <Link href="/aircon-cleaning">청소</Link>
        </nav>
        <a href="#reservation" className="button small">
          예약 상담하기 <Icon name="arrow" />
        </a>
      </div>
    </header>
  );
}
