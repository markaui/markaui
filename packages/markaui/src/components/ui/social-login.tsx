"use client"

import * as React from "react"
import { Apple, BadgeCheck, Chrome, Facebook, Fingerprint, Mail } from "lucide-react"

import { cn } from "../../lib/utils"
import { Button } from "./button"

/* -------------------------------- SocialLogin ------------------------------ */

export type SocialProvider = "google" | "apple" | "facebook" | "email"

const PROVIDER_META: Record<SocialProvider, { label: string; icon: React.ReactNode }> = {
  google: { label: "Google", icon: <Chrome /> },
  apple: { label: "Apple", icon: <Apple /> },
  facebook: { label: "Facebook", icon: <Facebook /> },
  email: { label: "Email", icon: <Mail /> },
}

export interface SocialLoginProps extends React.ComponentProps<"div"> {
  providers?: SocialProvider[]
  /** Called after the per-provider loading simulation completes */
  onProviderClick?: (provider: SocialProvider) => void | Promise<void>
  /** Show text labels next to the icons (default true) */
  showLabels?: boolean
}

export function SocialLogin({
  className,
  providers = ["google", "apple", "facebook"],
  onProviderClick,
  showLabels = true,
  ...props
}: SocialLoginProps) {
  const [loadingProvider, setLoadingProvider] = React.useState<SocialProvider | null>(null)
  const timeoutRef = React.useRef<number | null>(null)

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current)
    }
  }, [])

  function handleClick(provider: SocialProvider) {
    if (loadingProvider) return
    setLoadingProvider(provider)
    timeoutRef.current = window.setTimeout(() => {
      setLoadingProvider(null)
      void onProviderClick?.(provider)
    }, 1200)
  }

  return (
    <div
      data-slot="social-login"
      className={cn("flex flex-wrap gap-2", className)}
      role="group"
      aria-label="Continue with a social provider"
      {...props}
    >
      {providers.map((provider) => {
        const meta = PROVIDER_META[provider]
        const isLoading = loadingProvider === provider
        return (
          <Button
            key={provider}
            type="button"
            variant="outline"
            className="min-w-0 flex-1 cursor-pointer"
            loading={isLoading}
            loadingText={showLabels ? "Connecting…" : undefined}
            disabled={loadingProvider !== null && !isLoading}
            onClick={() => handleClick(provider)}
          >
            {meta.icon}
            {showLabels && <span className="truncate">{meta.label}</span>}
          </Button>
        )
      })}
    </div>
  )
}

/* ------------------------------ PasskeyButton ----------------------------- */

export interface PasskeyButtonProps extends React.ComponentProps<"button"> {
  /** Called after the simulated passkey ceremony succeeds */
  onPasskey?: () => void | Promise<void>
  /** Stretch to the full width of the container */
  fullWidth?: boolean
}

export function PasskeyButton({
  className,
  children,
  onPasskey,
  fullWidth,
  ...props
}: PasskeyButtonProps) {
  const [phase, setPhase] = React.useState<"idle" | "loading" | "success">("idle")
  const timersRef = React.useRef<number[]>([])

  React.useEffect(() => {
    const timers = timersRef.current
    return () => {
      timers.forEach((timer) => window.clearTimeout(timer))
    }
  }, [])

  function handleClick() {
    if (phase !== "idle") return
    setPhase("loading")
    timersRef.current.push(
      window.setTimeout(() => {
        setPhase("success")
        void onPasskey?.()
        timersRef.current.push(window.setTimeout(() => setPhase("idle"), 2000))
      }, 1200)
    )
  }

  return (
    <Button
      type="button"
      variant="outline"
      fullWidth={fullWidth}
      onClick={handleClick}
      loading={phase === "loading"}
      loadingText="Waiting for device…"
      disabled={phase === "success"}
      className={cn(
        "border-gold/50 font-medium hover:border-gold hover:bg-gold/10 hover:text-gold-foreground dark:hover:text-gold",
        className
      )}
      {...props}
    >
      {phase === "success" ? <BadgeCheck className="text-success" /> : <Fingerprint />}
      {phase === "success" ? "Passkey verified" : (children ?? "Sign in with passkey")}
    </Button>
  )
}
