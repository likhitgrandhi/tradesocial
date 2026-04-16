"use client"

import { useRef, ClipboardEvent, KeyboardEvent } from "react"
import { cn } from "@/lib/utils"

interface OtpInputProps {
  value: string
  onChange: (value: string) => void
  hasError?: boolean
}

export function OtpInput({ value, onChange, hasError }: OtpInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([])

  // Pad/trim to exactly 6 slots
  const digits = Array.from({ length: 6 }, (_, i) => value[i] ?? "")

  function handleChange(index: number, raw: string) {
    const digit = raw.replace(/\D/g, "").slice(-1)
    const next = [...digits]
    next[index] = digit
    onChange(next.join(""))
    if (digit && index < 5) {
      refs.current[index + 1]?.focus()
    }
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      e.preventDefault()
      if (digits[index]) {
        const next = [...digits]
        next[index] = ""
        onChange(next.join(""))
      } else if (index > 0) {
        const next = [...digits]
        next[index - 1] = ""
        onChange(next.join(""))
        refs.current[index - 1]?.focus()
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      refs.current[index - 1]?.focus()
    } else if (e.key === "ArrowRight" && index < 5) {
      refs.current[index + 1]?.focus()
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault()
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    onChange(text)
    const focusIndex = Math.min(text.length, 5)
    refs.current[focusIndex]?.focus()
  }

  return (
    <div className="flex gap-2">
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          autoComplete={i === 0 ? "one-time-code" : "off"}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          aria-label={`Digit ${i + 1} of 6`}
          className={cn(
            "w-full min-w-0 h-10 text-center rounded-[var(--radius-md)] bg-surface-base border border-border-default text-content-primary outline-none focus:border-border-accent focus-visible:ring-2 focus-visible:ring-action-primary/20 transition-colors",
            hasError && "border-loss/60 focus:border-loss focus-visible:ring-loss/20"
          )}
          style={{ fontSize: "var(--font-size-20)", fontWeight: "var(--font-weight-bold)" }}
        />
      ))}
    </div>
  )
}
