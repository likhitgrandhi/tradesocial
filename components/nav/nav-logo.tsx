import Link from "next/link"

export function NavLogo({ href = "/feed" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center shrink-0 group">
      <span className="text-[15px] text-content-primary group-hover:text-content-accent transition-colors"
        style={{ fontWeight: "var(--font-weight-medium)" }}>
        TradeSocial
      </span>
    </Link>
  )
}
