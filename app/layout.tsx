import type { Metadata } from "next"
import { Inter, Geist_Mono } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import { HawcxAuthProvider } from "@/providers/hawcx-provider"
import { cn } from "@/lib/utils"

// Inter Variable — supports fractional weights (435, 535, 660) per DESIGN.md
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

// Geist Mono — secondary / monospace (Soehne substitute)
const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "TradeSocial",
    template: "%s · TradeSocial",
  },
  description:
    "Build your public trading track record. Follow top traders, log your trades, and see real performance.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(inter.variable, fontMono.variable)}
    >
      <body className="font-sans antialiased">
        <ThemeProvider>
          <HawcxAuthProvider>
            {children}
            <ThemeToggle />
          </HawcxAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
