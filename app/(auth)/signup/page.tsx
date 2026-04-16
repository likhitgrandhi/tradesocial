"use client"

import type { Metadata } from "next"
import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff, ArrowRight, Check } from "lucide-react"

import { cn } from "@/lib/utils"

// Full auth logic wired in TRA-8 (Clerk integration)

type AssetFocus = "STOCKS" | "CRYPTO" | "OPTIONS" | "FUTURES" | "MIXED"

type FormState = {
  displayName: string
  username: string
  email: string
  password: string
  assetFocus: AssetFocus | ""
}

type FieldErrors = Partial<Record<keyof FormState, string>>

const ASSET_OPTIONS: { value: AssetFocus; label: string; emoji: string }[] = [
  { value: "STOCKS", label: "Stocks", emoji: "📈" },
  { value: "CRYPTO", label: "Crypto", emoji: "₿" },
  { value: "OPTIONS", label: "Options", emoji: "📊" },
  { value: "FUTURES", label: "Futures", emoji: "⚡" },
  { value: "MIXED", label: "Mixed", emoji: "🌐" },
]

function validate(values: FormState): FieldErrors {
  const errors: FieldErrors = {}
  if (!values.displayName.trim()) errors.displayName = "Display name is required."
  else if (values.displayName.trim().length < 2)
    errors.displayName = "Display name must be at least 2 characters."

  if (!values.username.trim()) errors.username = "Username is required."
  else if (!/^[a-zA-Z0-9_]{3,20}$/.test(values.username))
    errors.username =
      "3–20 characters, letters, numbers, and underscores only."

  if (!values.email) errors.email = "Email is required."
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
    errors.email = "Enter a valid email address."

  if (!values.password) errors.password = "Password is required."
  else if (values.password.length < 8)
    errors.password = "Password must be at least 8 characters."

  if (!values.assetFocus) errors.assetFocus = "Pick your primary focus."

  return errors
}

export default function SignupPage() {
  const [values, setValues] = useState<FormState>({
    displayName: "",
    username: "",
    email: "",
    password: "",
    assetFocus: "",
  })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState("")

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    // Auto-format username: lowercase, strip spaces, only valid chars
    const formatted =
      name === "username"
        ? value.toLowerCase().replace(/[^a-z0-9_]/g, "")
        : value
    setValues((prev) => ({ ...prev, [name]: formatted }))
    if (errors[name as keyof FormState]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
    if (serverError) setServerError("")
  }

  function handleAssetFocus(focus: AssetFocus) {
    setValues((prev) => ({ ...prev, assetFocus: focus }))
    if (errors.assetFocus) setErrors((prev) => ({ ...prev, assetFocus: undefined }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const fieldErrors = validate(values)
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors)
      return
    }
    setLoading(true)
    // TODO (TRA-8): replace with Clerk signUp()
    await new Promise((r) => setTimeout(r, 1400))
    setLoading(false)
    setServerError("Auth not yet wired — connect Clerk in TRA-8.")
  }

  const passwordStrength = getPasswordStrength(values.password)

  return (
    <div className="w-full max-w-[400px] space-y-7">
      {/* Heading */}
      <div>
        <h1 className="text-[26px] font-semibold tracking-tight text-[#141413] dark:text-[#F3F0EE] leading-tight">
          Create your account
        </h1>
        <p className="text-[14px] text-[#696969] dark:text-[#F3F0EE]/40 mt-1">
          Build your public trading track record
        </p>
      </div>

      {/* Card */}
      <div className="rounded-[20px] bg-white dark:bg-[#1e1c1a] border border-[#F3F0EE] dark:border-white/6 shadow-[0_4px_24px_0_rgba(0,0,0,0.05)] overflow-hidden">
        {/* OAuth */}
        <div className="p-5 space-y-3 border-b border-[#F3F0EE] dark:border-white/6">
          <OAuthButton provider="google" />
          <OAuthButton provider="apple" />
        </div>

        {/* OR */}
        <div className="flex items-center gap-3 px-5 py-4">
          <div className="flex-1 h-px bg-[#E8E4E0] dark:bg-white/8" />
          <span className="text-[12px] text-[#696969] dark:text-[#F3F0EE]/30 font-medium tracking-wide uppercase">
            or
          </span>
          <div className="flex-1 h-px bg-[#E8E4E0] dark:bg-white/8" />
        </div>

        <form onSubmit={handleSubmit} noValidate className="px-5 pb-5 space-y-3">
          {serverError && (
            <div className="rounded-xl bg-[#CF4500]/8 dark:bg-[#CF4500]/12 border border-[#CF4500]/20 px-4 py-3">
              <p className="text-[13px] text-[#CF4500] font-medium">{serverError}</p>
            </div>
          )}

          {/* Name row */}
          <div className="grid grid-cols-2 gap-2">
            <FormField label="Display name" htmlFor="displayName" error={errors.displayName}>
              <input
                id="displayName"
                name="displayName"
                type="text"
                autoComplete="name"
                placeholder="Jane Doe"
                value={values.displayName}
                onChange={handleChange}
                aria-invalid={!!errors.displayName}
                className={cn(inputBase, errors.displayName && inputError)}
              />
            </FormField>
            <FormField label="Username" htmlFor="username" error={errors.username}>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[14px] text-[#D1CDC7] dark:text-[#F3F0EE]/20 pointer-events-none select-none">
                  @
                </span>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  placeholder="janedoe"
                  value={values.username}
                  onChange={handleChange}
                  maxLength={20}
                  aria-invalid={!!errors.username}
                  className={cn(inputBase, "pl-6", errors.username && inputError)}
                />
              </div>
            </FormField>
          </div>

          {/* Email */}
          <FormField label="Email" htmlFor="email" error={errors.email}>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={values.email}
              onChange={handleChange}
              aria-invalid={!!errors.email}
              className={cn(inputBase, errors.email && inputError)}
            />
          </FormField>

          {/* Password */}
          <FormField label="Password" htmlFor="password" error={errors.password}>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Min. 8 characters"
                value={values.password}
                onChange={handleChange}
                aria-invalid={!!errors.password}
                className={cn(inputBase, "pr-10", errors.password && inputError)}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#696969] hover:text-[#141413] dark:hover:text-[#F3F0EE] transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {/* Password strength bar */}
            {values.password.length > 0 && (
              <div className="flex gap-1 mt-1.5" aria-label={`Password strength: ${passwordStrength.label}`}>
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-[3px] flex-1 rounded-full transition-colors",
                      i < passwordStrength.score
                        ? passwordStrength.color
                        : "bg-[#E8E4E0] dark:bg-white/10"
                    )}
                  />
                ))}
                <span className="text-[11px] text-[#696969] dark:text-[#F3F0EE]/30 ml-1 self-center leading-none">
                  {passwordStrength.label}
                </span>
              </div>
            )}
          </FormField>

          {/* Asset focus */}
          <div className="space-y-1.5">
            <p className="text-[13px] font-medium text-[#141413] dark:text-[#F3F0EE]/80">
              Primary trading focus
            </p>
            <div className="flex flex-wrap gap-2">
              {ASSET_OPTIONS.map((opt) => {
                const selected = values.assetFocus === opt.value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleAssetFocus(opt.value)}
                    className={cn(
                      "flex items-center gap-1.5 h-8 px-3 rounded-full text-[13px] font-medium border transition-all",
                      selected
                        ? "bg-[#141413] dark:bg-[#F3F0EE] text-[#F3F0EE] dark:text-[#141413] border-[#141413] dark:border-[#F3F0EE]"
                        : "bg-[#F3F0EE]/60 dark:bg-white/4 text-[#696969] dark:text-[#F3F0EE]/40 border-[#E8E4E0] dark:border-white/10 hover:border-[#141413]/30 dark:hover:border-[#F3F0EE]/20 hover:text-[#141413] dark:hover:text-[#F3F0EE]/70"
                    )}
                  >
                    <span aria-hidden="true">{opt.emoji}</span>
                    {opt.label}
                    {selected && <Check className="w-3 h-3 ml-0.5" />}
                  </button>
                )
              })}
            </div>
            {errors.assetFocus && (
              <p className="text-[12px] text-[#CF4500] font-medium" role="alert">
                {errors.assetFocus}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={cn(
              "w-full h-11 rounded-full flex items-center justify-center gap-2 mt-1",
              "bg-[#141413] dark:bg-[#F3F0EE] text-[#F3F0EE] dark:text-[#141413]",
              "text-[14px] font-medium tracking-tight",
              "hover:opacity-90 transition-opacity",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Spinner />
                Creating account…
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Create account
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </button>

          <p className="text-[11px] text-[#696969]/70 dark:text-[#F3F0EE]/25 text-center leading-relaxed pt-0.5">
            By creating an account you agree to our{" "}
            <Link href="/terms" className="underline underline-offset-2 hover:text-[#141413] dark:hover:text-[#F3F0EE]">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline underline-offset-2 hover:text-[#141413] dark:hover:text-[#F3F0EE]">
              Privacy Policy
            </Link>
            .
          </p>
        </form>
      </div>

      {/* Login link */}
      <p className="text-center text-[13px] text-[#696969] dark:text-[#F3F0EE]/40">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-[#141413] dark:text-[#F3F0EE] hover:opacity-70 transition-opacity"
        >
          Log in
        </Link>
      </p>
    </div>
  )
}

/* ── Shared helpers ──────────────────────────────────────────── */

function getPasswordStrength(password: string): {
  score: number
  label: string
  color: string
} {
  if (password.length === 0) return { score: 0, label: "", color: "" }
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[A-Z]/.test(password) && /[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  const levels = [
    { label: "Weak", color: "bg-[#CF4500]" },
    { label: "Fair", color: "bg-[#F37338]" },
    { label: "Good", color: "bg-[#F59E0B]" },
    { label: "Strong", color: "bg-[#10B981]" },
  ]
  return { score, ...levels[Math.max(0, score - 1)] }
}

function FormField({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string
  htmlFor: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={htmlFor}
        className="text-[13px] font-medium text-[#141413] dark:text-[#F3F0EE]/80"
      >
        {label}
      </label>
      {children}
      {error && (
        <p className="text-[12px] text-[#CF4500] font-medium" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

function OAuthButton({ provider }: { provider: "google" | "apple" }) {
  return (
    <button
      type="button"
      className="w-full h-10 rounded-full flex items-center justify-center gap-2.5 border border-[#E8E4E0] dark:border-white/10 bg-white dark:bg-white/4 hover:bg-[#F3F0EE] dark:hover:bg-white/8 transition-colors text-[13px] font-medium text-[#141413] dark:text-[#F3F0EE]/80"
    >
      {provider === "google" ? <GoogleIcon /> : <AppleIcon />}
      Continue with {provider === "google" ? "Google" : "Apple"}
    </button>
  )
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 814 1000" fill="currentColor" className="text-[#141413] dark:text-[#F3F0EE]" aria-hidden="true">
      <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 411.6 43.5 169.4 138.4 80.1c37.8-36.8 91.2-75.4 153.6-75.4s112.7 39.5 155.5 39.5c42.8 0 121.8-43.3 164-39.5l17.1-3.5C665.4 2 725.3 10.2 755.2 62.5c-31.2 15.5-97.4 84.2-97.4 162.7z" />
      <path d="M551.5 3.3C512.6 17 442.9 52.4 442.9 138.7c0 78.7 65.3 131.5 128.3 134.8-4.4 56.8-63.7 139.3-82.9 163.6-11.3 14.3-31.4 34.1-50 34.1-17.1 0-30.6-13.3-62.2-13.3-32.5 0-54.4 13.3-73.3 13.3-25 0-46.8-22.8-63.6-43.8C184.4 336 154 228.9 154 160.9c0-117.4 77.3-176 151.2-176 53.7 0 99.8 37.8 138.5 37.8 35.8 0 91.2-40.1 107.8-19.4z" />
    </svg>
  )
}

function Spinner() {
  return (
    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

const inputBase =
  "w-full h-10 rounded-xl px-3.5 text-[14px] text-[#141413] dark:text-[#F3F0EE] placeholder:text-[#D1CDC7] dark:placeholder:text-[#F3F0EE]/20 bg-[#F3F0EE]/50 dark:bg-white/4 border border-[#E8E4E0] dark:border-white/10 outline-none focus:border-[#141413] dark:focus:border-[#F3F0EE]/40 focus:bg-white dark:focus:bg-white/6 transition-colors"

const inputError =
  "border-[#CF4500]/60 focus:border-[#CF4500] bg-[#CF4500]/4"
