"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, ArrowLeft } from "lucide-react"

import { cn } from "@/lib/utils"
import { OtpInput } from "@/components/auth/otp-input"
import {
  useAuthState,
  useAuthFlags,
  useAuthClient,
  useAuthActions,
  useIdentifierForm,
  useOtpForm,
  isAuthStep,
  isEnterCodeStep,
  isError as isErrorState,
} from "@hawcx/react"

export default function LoginPage() {
  const router = useRouter()
  const state = useAuthState()
  const flags = useAuthFlags()
  const client = useAuthClient()
  const { reset: resetAuth } = useAuthActions()

  const {
    identifier: email,
    setIdentifier: setEmail,
    isSubmitting: emailSubmitting,
    submit: submitEmail,
  } = useIdentifierForm({ flowType: "signin" })

  const {
    code,
    setCode,
    isSubmitting: otpSubmitting,
    submit: submitOtp,
    resend,
    destination,
  } = useOtpForm()

  // When Hawcx auth completes, exchange authCode for an iron-session cookie.
  // Email is read from sessionStorage because Hawcx may complete via a page
  // redirect (POST back), which remounts React and clears form state.
  useEffect(() => {
    if (!flags.isCompleted) return

    // Read directly from the client to get codeVerifier — avoids React closure stale value
    const completion = client.getCompletion()
    const resolvedEmail = email || sessionStorage.getItem("hawcx_pending_email") || ""
    sessionStorage.removeItem("hawcx_pending_email")

    fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        authCode: completion?.authCode,
        codeVerifier: completion?.codeVerifier,
        email: resolvedEmail,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          router.push(data.isNewUser ? "/onboarding" : "/feed")
        }
      })
  }, [flags.isCompleted]) // eslint-disable-line react-hooks/exhaustive-deps

  const isOtpStep = isAuthStep(state) && isEnterCodeStep(state.step)
  const errorMessage = isErrorState(state) ? state.error.message : undefined
  const loading = emailSubmitting || otpSubmitting || (flags.isCompleted && !flags.isError)

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault()
    sessionStorage.setItem("hawcx_pending_email", email)
    try {
      await submitEmail()
    } catch (err) {
      console.error("Hawcx initiateLogin error:", err)
    }
  }

  async function handleOtpSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      await submitOtp()
    } catch (err) {
      console.error("Hawcx verifyOtp error:", err)
    }
  }

  return (
    <div className="w-full max-w-[360px] space-y-6">
      {/* Heading */}
      <div>
        <h1 className="text-content-secondary" style={{ fontSize: "var(--font-size-24)", fontWeight: "var(--font-weight-medium)", lineHeight: "32px" }}>
          {!isOtpStep ? "Welcome back" : "Check your email"}
        </h1>
        <p className="text-content-muted mt-1" style={{ fontSize: "var(--font-size-14)" }}>
          {!isOtpStep
            ? "Log in to your TradeSocial account"
            : `We sent a 6-digit code to ${destination || email}`}
        </p>
      </div>

      {/* Card */}
      <div className="rounded-[var(--radius-xl)] bg-surface-raised border border-border-default overflow-hidden">
        {!isOtpStep ? (
          /* Email step */
          <form onSubmit={handleEmailSubmit} noValidate className="p-5 space-y-4">
            {flags.isError && <ErrorBanner message={errorMessage ?? "Something went wrong"} />}

            <FormField label="Email" htmlFor="email">
              <input
                id="email" name="email" type="email" autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputBase}
              />
            </FormField>

            <button
              type="submit" disabled={loading || !email}
              className="w-full h-10 rounded-[var(--radius-md)] flex items-center justify-center gap-2 bg-action-primary text-content-inverse hover:bg-action-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontSize: "var(--font-size-14)", fontWeight: "var(--font-weight-medium)" }}
            >
              {loading ? <><Spinner /> Sending code…</> : <>Continue with email <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
        ) : (
          /* OTP step */
          <form onSubmit={handleOtpSubmit} noValidate className="p-5 space-y-4">
            {flags.isError && <ErrorBanner message={errorMessage ?? "Invalid code"} />}

            <p className="text-content-primary" style={{ fontSize: "var(--font-size-14)", fontWeight: "var(--font-weight-medium)" }}>
              Verification code
            </p>

            <div className="space-y-1.5">
              <label className="sr-only">Verification code</label>
              <OtpInput
                value={code}
                hasError={flags.isError}
                onChange={setCode}
              />
            </div>

            <button
              type="submit" disabled={loading || code.length < 6}
              className="w-full h-10 rounded-[var(--radius-md)] flex items-center justify-center gap-2 bg-action-primary text-content-inverse hover:bg-action-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontSize: "var(--font-size-14)", fontWeight: "var(--font-weight-medium)" }}
            >
              {loading ? <><Spinner /> Verifying…</> : <>Verify code <ArrowRight className="w-4 h-4" /></>}
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => resend()}
                className="flex-1 flex items-center justify-center text-content-muted hover:text-content-primary transition-colors"
                style={{ fontSize: "var(--font-size-14)" }}
              >
                Resend code
              </button>
              <button
                type="button"
                onClick={() => { resetAuth(); setEmail(""); sessionStorage.removeItem("hawcx_pending_email") }}
                className="flex-1 flex items-center justify-center gap-1.5 text-content-muted hover:text-content-primary transition-colors"
                style={{ fontSize: "var(--font-size-14)" }}
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Different email
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Sign up link */}
      <p className="text-center text-content-muted" style={{ fontSize: "var(--font-size-14)" }}>
        New to TradeSocial?{" "}
        <Link href="/signup" className="text-content-accent hover:underline" style={{ fontWeight: "var(--font-weight-medium)" }}>
          Create an account
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

function FormField({ label, htmlFor, children }: {
  label: string; htmlFor: string; children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="text-content-primary" style={{ fontSize: "var(--font-size-14)", fontWeight: "var(--font-weight-medium)" }}>
        {label}
      </label>
      {children}
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

const inputBase =
  "w-full h-10 rounded-[var(--radius-md)] px-4 bg-surface-base border border-border-default text-content-primary placeholder:text-content-disabled outline-none focus:border-border-accent focus-visible:ring-2 focus-visible:ring-action-primary/20 transition-colors"
