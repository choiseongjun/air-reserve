export function Icon({ name }: { name: string }) {
  const paths: Record<string, React.ReactNode> = {
    wind: (
      <path d="M3 8h12a3 3 0 1 0-3-3M3 12h16a3 3 0 1 1-3 3M3 16h5a3 3 0 1 1-3 3" />
    ),
    arrow: <path d="M4 12h15m-6-6 6 6-6 6" />,
    check: <path d="m5 12 4 4L19 6" />,
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    pin: (
      <>
        <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
        <circle cx="12" cy="10" r="2" />
      </>
    ),
    calendar: (
      <>
        <rect x="4" y="5" width="16" height="16" rx="3" />
        <path d="M8 3v4m8-4v4M4 10h16m-11 5h2" />
      </>
    ),
    info: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v6m0-10v.1" />
      </>
    ),
    shield: (
      <>
        <path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6Z" />
        <path d="m8 12 3 3 5-6" />
      </>
    ),
    drop: (
      <>
        <path d="M12 3S5 11 5 15a7 7 0 0 0 14 0c0-4-7-12-7-12Z" />
        <path d="M9 15a3 3 0 0 0 3 3" />
      </>
    ),
    "check-circle": (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m8 12 3 3 5-6" />
      </>
    ),
  };
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] ?? paths.wind}
    </svg>
  );
}
export function Aircon({ type }: { type: "wall" | "standing" | "ceiling" }) {
  return (
    <svg
      className={`aircon-illustration ${type}`}
      width="320"
      height="180"
      viewBox="0 0 320 180"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`body-${type}`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#fff" />
          <stop offset="1" stopColor="#e8eded" />
        </linearGradient>
        <filter
          id={`shadow-${type}`}
          x="-50%"
          y="-50%"
          width="200%"
          height="220%"
        >
          <feDropShadow
            dx="0"
            dy="12"
            stdDeviation="10"
            floodColor="#254f49"
            floodOpacity=".13"
          />
        </filter>
      </defs>
      {type === "wall" && (
        <g filter="url(#shadow-wall)">
          <rect
            x="43"
            y="48"
            width="234"
            height="78"
            rx="14"
            fill="url(#body-wall)"
            stroke="#d5dfdb"
          />
          <path d="M44 105h232l-8 14H53Z" fill="#dce5e1" />
          <path d="M56 109h207m-203 5h198" stroke="#9aaea7" strokeWidth="2" />
          <path d="M60 62h200" stroke="white" strokeWidth="3" />
          <circle cx="254" cy="92" r="2" fill="#0b9f85" />
          <text x="151" y="83" fontSize="5" fill="#9baea8" letterSpacing="1">
            CLEAR AIR
          </text>
          <path
            d="M111 140v9m49-9v17m49-17v9"
            stroke="#9dcfc0"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>
      )}
      {type === "standing" && (
        <g filter="url(#shadow-standing)">
          <rect
            x="126"
            y="12"
            width="68"
            height="148"
            rx="15"
            fill="url(#body-standing)"
            stroke="#d4dfda"
          />
          <rect x="133" y="19" width="54" height="137" rx="11" stroke="#fff" />
          <circle cx="160" cy="53" r="22" fill="#d4e0dc" />
          <circle cx="160" cy="53" r="18" fill="#eef4f1" stroke="#b9cac3" />
          <circle cx="160" cy="101" r="22" fill="#d4e0dc" />
          <circle cx="160" cy="101" r="18" fill="#eef4f1" stroke="#b9cac3" />
          <path
            d="M146 48h28m-30 5h32m-30 5h28m-28 38h28m-30 5h32m-30 5h28"
            stroke="#b3c5bd"
          />
          <circle cx="160" cy="137" r="2" fill="#19a68b" />
          <path d="M135 160h50" stroke="#adbbb6" strokeWidth="3" />
        </g>
      )}
      {type === "ceiling" && (
        <g filter="url(#shadow-ceiling)">
          <path d="m160 26 106 38v52l-106 41-106-41V64Z" fill="#d6e1dc" />
          <path
            d="m160 19 106 39-106 41L54 58Z"
            fill="url(#body-ceiling)"
            stroke="#d0dcd6"
          />
          <path d="m160 34 73 26-73 28-73-28Z" fill="#a6bbb1" />
          <path d="m160 39 62 22-62 23-62-23Z" fill="#d5e1db" />
          <path
            d="m110 57 62 22m-50-27 63 22m-50-27 63 22m-50-27 62 22"
            stroke="#a8bcb1"
            strokeWidth="2"
          />
          <path d="M54 58v13l106 40 106-40V58L160 99Z" fill="#f7faf8" />
          <path
            d="m68 83 79 30v13L68 96Zm105 30 79-30v13l-79 30Z"
            fill="#9bafa5"
          />
          <path d="m77 89 61 23m44 0 61-23" stroke="#dce6e0" />
          <circle cx="160" cy="142" r="2" fill="#09a784" />
        </g>
      )}
    </svg>
  );
}
