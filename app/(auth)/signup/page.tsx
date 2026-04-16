"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, ArrowLeft, Mail } from "lucide-react"

import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"

// Signup uses the same Supabase OTP flow as login.
// Supabase creates a new user if the email doesn't exist (shouldCreateUser: true).
// The auth callback then routes new users to /onboarding.

type Step = "email" | "otp"
type FieldErrors = { email?: string; otp?: string }

function validateEmail(email: string): string | undefined {
  if (!email) return "Email is required."
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email address."
}

function validateOtp(otp: string): string | undefined {
  if (!otp) return "Enter the code from your email."
  if (!/^\d{6}$/.test(otp)) return "Code must be 6 digits."
}

export default function SignupPage() {
  const [step, setStep] = useState<Step>("email")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [errors, setErrors] = useState<FieldErrors>({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState("")

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault()
    const err = validateEmail(email)
    if (err) { setErrors({ email: err }); return }

    setLoading(true)
    setServerError("")
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    })
    setLoading(false)

    if (error) {
      setServerError(error.message)
    } else {
      setStep("otp")
    }
  }

  async function handleOtpSubmit(e: React.FormEvent) {
    e.preventDefault()
    const err = validateOtp(otp)
    if (err) { setErrors({ otp: err }); return }

    setLoading(true)
    setServerError("")
    const supabase = createClient()
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    })
    setLoading(false)

    if (error) {
      setServerError(error.message)
    }
    // On success, middleware handles redirect (new user → /onboarding)
  }

  async function handleGoogleSignIn() {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  return (
    <div className="w-full max-w-[360px] space-y-6">
      {/* Heading */}
      <div>
        <h1 className="text-content-secondary" style={{ fontSize: "var(--font-size-24)", fontWeight: "var(--font-weight-medium)", lineHeight: "32px" }}>
          {step === "email" ? "Get started" : "Check your email"}
        </h1>
        <p className="text-content-muted mt-1" style={{ fontSize: "var(--font-size-14)" }}>
          {step === "email"
            ? "Build your public trading track record"
            : `We sent a 6-digit code to ${email}`}
        </p>
      </div>

      {/* Card */}
      <div className="rounded-[var(--radius-xl)] bg-surface-raised border border-border-default overflow-hidden">
        {step === "email" ? (
          <>
            {/* Google OAuth */}
            <div className="p-5 border-b border-border-default">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full h-10 rounded-[var(--radius-md)] flex items-center justify-center gap-2.5 border border-border-default bg-surface-base hover:bg-surface-raised transition-colors text-content-primary"
                style={{ fontSize: "var(--font-size-14)", fontWeight: "var(--font-weight-medium)" }}
              >
                <GoogleIcon />
                Continue with Google
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 px-5 py-4">
              <div className="flex-1 h-px bg-border-default" />
              <span className="text-content-disabled uppercase tracking-wide" style={{ fontSize: "var(--font-size-12)", fontWeight: "var(--font-weight-medium)" }}>or</span>
              <div className="flex-1 h-px bg-border-default" />
            </div>

            {/* Email form */}
            <form onSubmit={handleEmailSubmit} noValidate className="px-5 pb-5 space-y-4">
              <ErrorBanner message={serverError} />

              <FormField label="Email" htmlFor="email" error={errors.email}>
                <input
                  id="email" name="email" type="email" autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (errors.email) setErrors({})
                    if (serverError) setServerError("")
                  }}
                  aria-invalid={!!errors.email}
                  className={cn(inputBase, errors.email && inputErrorCls)}
                />
              </FormField>

              <button
                type="submit" disabled={loading}
                className="w-full h-10 rounded-[var(--radius-md)] flex items-center justify-center gap-2 bg-action-primary text-content-inverse hover:bg-action-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontSize: "var(--font-size-14)", fontWeight: "var(--font-weight-medium)" }}
              >
                {loading ? <><Spinner /> Sending code…</> : <>Continue with email <ArrowRight className="w-4 h-4" /></>}
              </button>

              <p className="text-center text-content-disabled leading-relaxed" style={{ fontSize: "var(--font-size-12)" }}>
                By continuing you agree to our{" "}
                <Link href="/terms" className="text-content-accent hover:underline">Terms</Link>
                {" "}and{" "}
                <Link href="/privacy" className="text-content-accent hover:underline">Privacy Policy</Link>.
              </p>
            </form>
          </>
        ) : (
          /* OTP step */
          <form onSubmit={handleOtpSubmit} noValidate className="p-5 space-y-4">
            <ErrorBanner message={serverError} />

            {/* Email icon hint */}
            <div className="flex justify-center py-2">
              <div className="w-12 h-12 rounded-[var(--radius-xl)] bg-surface-accent-subtle flex items-center justify-center">
                <Mail className="w-5 h-5 text-action-primary" />
              </div>
            </div>

            <FormField label="Verification code" htmlFor="otp" error={errors.otp}>
              <input
                id="otp" name="otp" type="text" inputMode="numeric"
                autoComplete="one-time-code" maxLength={6}
                placeholder="123456"
                value={otp}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 6)
                  setOtp(val)
                  if (errors.otp) setErrors({})
                  if (serverError) setServerError("")
                }}
                aria-invalid={!!errors.otp}
                className={cn(inputBase, "text-center tracking-wide", errors.otp && inputErrorCls)}
                style={{ fontSize: "var(--font-size-18)", letterSpacing: "0.2em" }}
              />
            </FormField>

            <button
              type="submit" disabled={loading || otp.length < 6}
              className="w-full h-10 rounded-[var(--radius-md)] flex items-center justify-center gap-2 bg-action-primary text-content-inverse hover:bg-action-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontSize: "var(--font-size-14)", fontWeight: "var(--font-weight-medium)" }}
            >
              {loading ? <><Spinner /> Verifying…</> : <>Verify code <ArrowRight className="w-4 h-4" /></>}
            </button>

            <button
              type="button"
              onClick={() => { setStep("email"); setOtp(""); setErrors({}); setServerError("") }}
              className="w-full flex items-center justify-center gap-1.5 text-content-muted hover:text-content-primary transition-colors"
              style={{ fontSize: "var(--font-size-14)" }}
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Use a different email
            </button>
          </form>
        )}
      </div>

      {/* Log in link */}
      <p className="text-center text-content-muted" style={{ fontSize: "var(--font-size-14)" }}>
        Already have an account?{" "}
        <Link href="/login" className="text-content-accent hover:underline" style={{ fontWeight: "var(--font-weight-medium)" }}>
          Log in
        </Link>
      </p>
    </div>
  )
}

/* ── Sub-components ────────────────────────────────────────────── */

function ErrorBanner({ message }: { message: string }) {
  if (!message) return null
  return (
    <div className="rounded-[var(--radius-md)] bg-loss/8 border border-loss/20 px-4 py-3">
      <p className="text-loss" style={{ fontSize: "var(--font-size-14)", fontWeight: "var(--font-weight-medium)" }}>
        {message}
      </p>
    </div>
  )
}

function FormField({ label, htmlFor, error, children }: {
  label: string; htmlFor: string; error?: string; children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="text-content-primary" style={{ fontSize: "var(--font-size-14)", fontWeight: "var(--font-weight-medium)" }}>
        {label}
      </label>
      {children}
      {error && (
        <p className="text-loss" role="alert" style={{ fontSize: "var(--font-size-12)", fontWeight: "var(--font-weight-medium)" }}>
          {error}
        </p>
      )}
    </div>
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

const inputBase =
  "w-full h-10 rounded-[var(--radius-md)] px-4 bg-surface-base border border-border-default text-content-primary placeholder:text-content-disabled outline-none focus:border-border-accent focus-visible:ring-2 focus-visible:ring-action-primary/20 transition-colors"

const inputErrorCls =
  "border-loss/60 focus:border-loss focus-visible:ring-loss/20"
