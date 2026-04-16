import Link from "next/link"

export function NavLogo({ href = "/feed" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2.5 shrink-0 group">
      <svg
        width="30"
        height="30"
        viewBox="0 0 30 30"
        fill="none"
        aria-hidden="true"
      >
        <rect width="30" height="30" rx="8" fill="#141413" />
        {/* Upward-trending chart line */}
        <polyline
          points="5,22 11,16 16,18 24,9"
          stroke="#F3F0EE"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Accent dot at peak */}
        <circle cx="24" cy="9" r="2.5" fill="#F37338" />
      </svg>
      <span className="text-[15px] font-semibold tracking-tight text-[#141413] dark:text-[#F3F0EE] group-hover:opacity-80 transition-opacity">
        TradeSocial
      </span>
    </Link>
  )
}
