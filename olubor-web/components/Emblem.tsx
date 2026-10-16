/**
 * Olubor emblem — sun rays, globe and open book.
 *
 * Rendered inline (rather than as an <img>) so the mark can adapt to the
 * surface it sits on: the globe/book inherit `currentColor`, so set a
 * `text-*` colour on the element. The sun rays keep the brand gold on every
 * background.
 */
export default function Emblem({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="121 139 248 158"
      className={className}
      fill="none"
      role="img"
      aria-label="Olubor sun-and-globe emblem"
    >
      {/* Sun rays */}
      <g stroke="#d97706" strokeWidth={7} strokeLinecap="round">
        <path d="M245 150V178M215 158l11 24M276 158l-11 24M190 172l22 18M300 172l-22 18M162 192l28 12M328 192l-28 12" />
      </g>
      {/* Globe */}
      <g stroke="currentColor" strokeWidth={9}>
        <circle cx="245" cy="215" r="55" />
        <ellipse cx="245" cy="215" rx="28" ry="55" />
        <path d="M245 160V270M190 215H300M200 188H290M200 242H290" />
      </g>
      {/* Open book */}
      <g stroke="currentColor" strokeWidth={10} strokeLinecap="round">
        <path d="M132 285Q190 262 243 285M247 285Q300 262 358 285M140 267Q192 248 243 270M247 270Q298 248 350 267M150 250Q195 236 243 254M247 254Q295 236 340 250" />
      </g>
    </svg>
  );
}
