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
          맑은바람
        </Link>
        <nav aria-label="주 메뉴">
          <Link href="/aircon-cleaning">방문 지역 찾기</Link>
          <Link href="/#services">서비스 안내</Link>
          <Link href="/#faq">자주 묻는 질문</Link>
        </nav>
        <a href="#reservation" className="button small">
          예약 상담하기 <Icon name="arrow" />
        </a>
      </div>
    </header>
  );
}
