"use client"

import type { Metadata } from "next"
import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff, ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"

// Full auth logic wired in TRA-8 (Clerk integration)

type FormState = {
  email: string
  password: string
}

type FieldErrors = Partial<Record<keyof FormState, string>>

function validate(values: FormState): FieldErrors {
  const errors: FieldErrors = {}
  if (!values.email) errors.email = "Email is required."
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
    errors.email = "Enter a valid email address."
  if (!values.password) errors.password = "Password is required."
  else if (values.password.length < 8)
    errors.password = "Password must be at least 8 characters."
  return errors
}

export default function LoginPage() {
  const [values, setValues] = useState<FormState>({ email: "", password: "" })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState("")

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
    // Clear field error on change
    if (errors[name as keyof FormState]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
    if (serverError) setServerError("")
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const fieldErrors = validate(values)
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors)
      return
    }
    setLoading(true)
    // TODO (TRA-8): replace with Clerk signIn()
    await new Promise((r) => setTimeout(r, 1200))
    setLoading(false)
    // Simulated error for demo
    setServerError("Auth not yet wired — connect Clerk in TRA-8.")
  }

  return (
    <div className="w-full max-w-[360px] space-y-7">
      {/* Heading */}
      <div>
        <h1 className="text-[26px] font-semibold tracking-tight text-[#141413] dark:text-[#F3F0EE] leading-tight">
          Welcome back
        </h1>
        <p className="text-[14px] text-[#696969] dark:text-[#F3F0EE]/40 mt-1">
          Log in to your TradeSocial account
        </p>
      </div>

      {/* Card */}
      <div className="rounded-[20px] bg-white dark:bg-[#1e1c1a] border border-[#F3F0EE] dark:border-white/6 shadow-[0_4px_24px_0_rgba(0,0,0,0.05)] overflow-hidden">
        {/* OAuth buttons */}
        <div className="p-5 space-y-3 border-b border-[#F3F0EE] dark:border-white/6">
          <OAuthButton provider="google" />
          <OAuthButton provider="apple" />
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 px-5 py-4">
          <div className="flex-1 h-px bg-[#E8E4E0] dark:bg-white/8" />
          <span className="text-[12px] text-[#696969] dark:text-[#F3F0EE]/30 font-medium tracking-wide uppercase">
            or
          </span>
          <div className="flex-1 h-px bg-[#E8E4E0] dark:bg-white/8" />
        </div>

        {/* Email / password form */}
        <form onSubmit={handleSubmit} noValidate className="px-5 pb-5 space-y-3">
          {/* Server error */}
          {serverError && (
            <div className="rounded-xl bg-[#CF4500]/8 dark:bg-[#CF4500]/12 border border-[#CF4500]/20 px-4 py-3">
              <p className="text-[13px] text-[#CF4500] font-medium">{serverError}</p>
            </div>
          )}

          {/* Email */}
          <FormField
            label="Email"
            error={errors.email}
            htmlFor="email"
          >
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
          <FormField
            label="Password"
            error={errors.password}
            htmlFor="password"
            action={
              <Link
                href="/forgot-password"
                className="text-[12px] text-[#696969] dark:text-[#F3F0EE]/40 hover:text-[#141413] dark:hover:text-[#F3F0EE] transition-colors"
              >
                Forgot password?
              </Link>
            }
          >
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
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
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </FormField>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={cn(
              "w-full h-11 rounded-full flex items-center justify-center gap-2",
              "bg-[#141413] dark:bg-[#F3F0EE] text-[#F3F0EE] dark:text-[#141413]",
              "text-[14px] font-medium tracking-tight",
              "hover:opacity-90 transition-opacity",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "mt-1"
            )}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Spinner />
                Logging in…
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Log in
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </button>
        </form>
      </div>

      {/* Sign up link */}
      <p className="text-center text-[13px] text-[#696969] dark:text-[#F3F0EE]/40">
        New to TradeSocial?{" "}
        <Link
          href="/signup"
          className="font-medium text-[#141413] dark:text-[#F3F0EE] hover:opacity-70 transition-opacity"
        >
          Create an account
        </Link>
      </p>
    </div>
  )
}

/* ── Shared sub-components ───────────────────────────────────── */

function FormField({
  label,
  htmlFor,
  error,
  action,
  children,
}: {
  label: string
  htmlFor: string
  error?: string
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label
          htmlFor={htmlFor}
          className="text-[13px] font-medium text-[#141413] dark:text-[#F3F0EE]/80"
        >
          {label}
        </label>
        {action}
      </div>
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
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 814 1000"
      fill="currentColor"
      className="text-[#141413] dark:text-[#F3F0EE]"
      aria-hidden="true"
    >
      <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 411.6 43.5 169.4 138.4 80.1c37.8-36.8 91.2-75.4 153.6-75.4s112.7 39.5 155.5 39.5c42.8 0 121.8-43.3 164-39.5l17.1-3.5C665.4 2 725.3 10.2 755.2 62.5c-31.2 15.5-97.4 84.2-97.4 162.7z" />
      <path d="M551.5 3.3C512.6 17 442.9 52.4 442.9 138.7c0 78.7 65.3 131.5 128.3 134.8-4.4 56.8-63.7 139.3-82.9 163.6-11.3 14.3-31.4 34.1-50 34.1-17.1 0-30.6-13.3-62.2-13.3-32.5 0-54.4 13.3-73.3 13.3-25 0-46.8-22.8-63.6-43.8C184.4 336 154 228.9 154 160.9c0-117.4 77.3-176 151.2-176 53.7 0 99.8 37.8 138.5 37.8 35.8 0 91.2-40.1 107.8-19.4z" />
    </svg>
  )
}

function Spinner() {
  return (
    <svg
      className="animate-spin w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  )
}

const inputBase =
  "w-full h-10 rounded-xl px-3.5 text-[14px] text-[#141413] dark:text-[#F3F0EE] placeholder:text-[#D1CDC7] dark:placeholder:text-[#F3F0EE]/20 bg-[#F3F0EE]/50 dark:bg-white/4 border border-[#E8E4E0] dark:border-white/10 outline-none focus:border-[#141413] dark:focus:border-[#F3F0EE]/40 focus:bg-white dark:focus:bg-white/6 transition-colors"

const inputError =
  "border-[#CF4500]/60 focus:border-[#CF4500] bg-[#CF4500]/4"
