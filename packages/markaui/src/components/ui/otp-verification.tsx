"use client"

import * as React from "react"
import { MailCheck, RotateCcw, ShieldCheck } from "lucide-react"

import { cn } from "../../lib/utils"
import { Button } from "./button"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./input-otp"
import { Label } from "./label"
import { Switch } from "./switch"
import { Textarea } from "./textarea"

/* ----------------------------- OTPVerification ---------------------------- */

export interface OTPVerificationProps extends React.ComponentProps<"div"> {
  /** Called after the simulated verification succeeds */
  onVerify?: (code: string) => void | Promise<void>
  /** Number of OTP digits (default 5) */
  length?: number
  /** Resend countdown in seconds (default 30) */
  resendSeconds?: number
  /** Masked destination shown above the input */
  destination?: string
}

export function OTPVerification({
  className,
  onVerify,
  length = 5,
  resendSeconds = 30,
  destination = "+91 98•••• ••210",
  ...props
}: OTPVerificationProps) {
  const [value, setValue] = React.useState("")
  const [countdown, setCountdown] = React.useState(resendSeconds)
  const [phase, setPhase] = React.useState<"idle" | "verifying" | "success">("idle")
  const timeoutRef = React.useRef<number | null>(null)

  React.useEffect(() => {
    if (countdown <= 0) return
    const interval = window.setInterval(() => {
      setCountdown((seconds) => (seconds <= 1 ? 0 : seconds - 1))
    }, 1000)
    return () => window.clearInterval(interval)
  }, [countdown])

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current)
    }
  }, [])

  const complete = value.length >= length

  function handleVerify() {
    if (!complete || phase !== "idle") return
    setPhase("verifying")
    timeoutRef.current = window.setTimeout(() => {
      setPhase("success")
      void onVerify?.(value)
    }, 1300)
  }

  function handleResend() {
    setValue("")
    setCountdown(resendSeconds)
    setPhase("idle")
  }

  if (phase === "success") {
    return (
      <div
        data-slot="otp-verification-success"
        className={cn("flex flex-col items-center gap-4 py-6 text-center", className)}
        {...props}
      >
        <span className="flex size-14 items-center justify-center rounded-full bg-success/15 text-success">
          <MailCheck className="size-7" />
        </span>
        <div className="space-y-1.5">
          <h3 className="font-serif text-xl font-semibold">Verified</h3>
          <p className="text-sm text-muted-foreground">
            Your code was confirmed. Welcome aboard!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      data-slot="otp-verification"
      className={cn("flex flex-col items-center gap-5", className)}
      {...props}
    >
      <div className="space-y-1.5 text-center">
        <h3 className="font-serif text-xl font-semibold">Enter verification code</h3>
        <p className="text-sm text-muted-foreground">
          We sent a {length}-digit code to <span className="font-medium text-foreground">{destination}</span>
        </p>
      </div>

      <InputOTP
        maxLength={length}
        value={value}
        onChange={setValue}
        disabled={phase === "verifying"}
      >
        <InputOTPGroup>
          {Array.from({ length }).map((_, index) => (
            <InputOTPSlot key={index} index={index} className="size-11 text-base" />
          ))}
        </InputOTPGroup>
      </InputOTP>

      <Button
        variant="gold"
        className="w-full max-w-xs cursor-pointer"
        onClick={handleVerify}
        loading={phase === "verifying"}
        loadingText="Verifying…"
        disabled={!complete}
      >
        Verify code
      </Button>

      <p className="text-xs text-muted-foreground" aria-live="polite">
        {countdown > 0 ? (
          <>
            Resend code in{" "}
            <span className="font-mono font-medium text-foreground">{countdown}s</span>
          </>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            className="inline-flex cursor-pointer items-center gap-1 font-medium text-primary underline-offset-4 hover:underline"
          >
            <RotateCcw className="size-3" />
            Resend code
          </button>
        )}
      </p>
    </div>
  )
}

/* ------------------------------ TwoFactorAuth ----------------------------- */

export interface TwoFactorAuthProps extends React.ComponentProps<"div"> {
  /** Called after the OTP code is verified (simulated) */
  onVerify?: (code: string) => void | Promise<void>
  /** Called after a backup code is submitted (simulated) */
  onBackupCode?: (code: string) => void | Promise<void>
}

export function TwoFactorAuth({
  className,
  onVerify,
  onBackupCode,
  ...props
}: TwoFactorAuthProps) {
  const [mode, setMode] = React.useState<"otp" | "backup">("otp")
  const [code, setCode] = React.useState("")
  const [backup, setBackup] = React.useState("")
  const [trust, setTrust] = React.useState(true)
  const [loading, setLoading] = React.useState(false)
  const timeoutRef = React.useRef<number | null>(null)

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current)
    }
  }, [])

  function handleVerify() {
    if (loading) return
    if (mode === "otp" && code.length < 6) return
    if (mode === "backup" && !backup.trim()) return
    setLoading(true)
    timeoutRef.current = window.setTimeout(() => {
      setLoading(false)
      if (mode === "otp") void onVerify?.(code)
      else void onBackupCode?.(backup)
    }, 1300)
  }

  function switchMode() {
    if (mode === "otp") {
      setMode("backup")
      setCode("")
    } else {
      setMode("otp")
      setBackup("")
    }
  }

  return (
    <div data-slot="two-factor-auth" className={cn("space-y-5", className)} {...props}>
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <ShieldCheck className="size-5" />
        </span>
        <div className="space-y-1">
          <h3 className="font-serif text-lg font-semibold leading-tight">
            Two-factor authentication
          </h3>
          <p className="text-sm text-muted-foreground">
            {mode === "otp"
              ? "Enter the 6-digit code from your authenticator app."
              : "Enter one of the backup codes you saved when enabling 2FA."}
          </p>
        </div>
      </div>

      {mode === "otp" ? (
        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            value={code}
            onChange={setCode}
            disabled={loading}
          >
            <InputOTPGroup>
              {Array.from({ length: 6 }).map((_, index) => (
                <InputOTPSlot key={index} index={index} className="size-10 text-base" />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="twofactor-backup">Backup code</Label>
          <Textarea
            id="twofactor-backup"
            placeholder="e.g. 4F9K-2QWP-7TZX"
            value={backup}
            onChange={(event) => setBackup(event.target.value)}
            disabled={loading}
            className="font-mono"
          />
        </div>
      )}

      <div className="flex items-center justify-between gap-4 rounded-lg border bg-muted/30 px-4 py-3">
        <div className="space-y-0.5">
          <Label htmlFor="twofactor-trust" className="text-sm font-normal">
            Trust this device for 30 days
          </Label>
          <p className="text-xs text-muted-foreground">
            You will not be asked again on this browser.
          </p>
        </div>
        <Switch
          id="twofactor-trust"
          checked={trust}
          onCheckedChange={setTrust}
          disabled={loading}
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={switchMode}
          className="cursor-pointer text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          {mode === "otp" ? "Use a backup code" : "Use authenticator instead"}
        </button>
        <Button
          variant="gold"
          onClick={handleVerify}
          loading={loading}
          loadingText="Verifying…"
          disabled={mode === "otp" ? code.length < 6 : !backup.trim()}
        >
          Verify
        </Button>
      </div>
    </div>
  )
}
