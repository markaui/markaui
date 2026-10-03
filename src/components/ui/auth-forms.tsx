"use client"

import * as React from "react"
import { Eye, EyeOff, Lock, Mail, MailCheck, CircleCheck, User } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { SocialLogin } from "@/components/ui/social-login"

/* ---------------------------------- Login --------------------------------- */

export interface LoginData {
  email: string
  password: string
  remember: boolean
}

export interface LoginFormProps extends Omit<React.ComponentProps<"form">, "onSubmit"> {
  /** Called after the simulated submit completes */
  onSubmit?: (data: LoginData) => void | Promise<void>
  /** Show the "or continue with" social section (default true) */
  showSocial?: boolean
  /** Called when the forgot-password link is clicked */
  onForgotPassword?: () => void
}

export function LoginForm({
  className,
  onSubmit,
  showSocial = true,
  onForgotPassword,
  ...props
}: LoginFormProps) {
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [remember, setRemember] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const timeoutRef = React.useRef<number | null>(null)

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current)
    }
  }, [])

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (loading) return
    setLoading(true)
    timeoutRef.current = window.setTimeout(() => {
      setLoading(false)
      void onSubmit?.({ email, password, remember })
    }, 1200)
  }

  return (
    <form
      data-slot="login-form"
      className={cn("space-y-5", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <div className="space-y-2">
        <Label htmlFor="login-email">Email</Label>
        <Input
          id="login-email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          leadingIcon={<Mail />}
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="login-password">Password</Label>
          <button
            type="button"
            onClick={onForgotPassword}
            className="cursor-pointer text-xs font-medium text-primary underline-offset-4 hover:underline"
          >
            Forgot password?
          </button>
        </div>
        <Input
          id="login-password"
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          autoComplete="current-password"
          leadingIcon={<Lock />}
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={loading}
          trailingIcon={
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          }
        />
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="login-remember"
          checked={remember}
          onCheckedChange={(checked) => setRemember(checked === true)}
          disabled={loading}
        />
        <Label htmlFor="login-remember" className="font-normal text-muted-foreground">
          Remember me
        </Label>
      </div>

      <Button
        type="submit"
        variant="gold"
        size="lg"
        fullWidth
        loading={loading}
        loadingText="Signing in…"
      >
        Sign in
      </Button>

      {showSocial && (
        <div className="space-y-4 pt-1">
          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">or continue with</span>
            <Separator className="flex-1" />
          </div>
          <SocialLogin providers={["google", "apple", "facebook"]} />
        </div>
      )}
    </form>
  )
}

/* --------------------------------- Signup --------------------------------- */

export interface SignupData {
  fullName: string
  email: string
  phone: string
  password: string
  gender: string
}

export interface SignupFormProps extends Omit<React.ComponentProps<"form">, "onSubmit"> {
  /** Called after the simulated submit completes */
  onSubmit?: (data: SignupData) => void | Promise<void>
}

const STRENGTH_LEVELS = [
  { label: "", text: "", bar: "", hint: "Use 8+ characters with a mix of letters and numbers." },
  { label: "Weak", text: "text-destructive", bar: "w-1/3 bg-destructive", hint: "Add more characters and digits." },
  { label: "Good", text: "text-warning", bar: "w-2/3 bg-warning", hint: "Almost there — add a symbol or make it longer." },
  { label: "Strong", text: "text-success", bar: "w-full bg-success", hint: "Excellent password." },
] as const

function passwordStrength(pw: string): 0 | 1 | 2 | 3 {
  if (!pw) return 0
  let score = 1
  if (pw.length >= 8) score++
  if (/[A-Za-z]/.test(pw) && /\d/.test(pw)) score++
  if (pw.length >= 12 || /[^A-Za-z0-9]/.test(pw)) score++
  return Math.min(3, score) as 1 | 2 | 3
}

const GENDERS = ["Male", "Female", "Other"] as const

export function SignupForm({ className, onSubmit, ...props }: SignupFormProps) {
  const [fullName, setFullName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [gender, setGender] = React.useState("")
  const [terms, setTerms] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const timeoutRef = React.useRef<number | null>(null)

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current)
    }
  }, [])

  const strength = passwordStrength(password)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (loading || !terms) return
    setLoading(true)
    timeoutRef.current = window.setTimeout(() => {
      setLoading(false)
      void onSubmit?.({ fullName, email, phone, password, gender })
    }, 1300)
  }

  return (
    <form
      data-slot="signup-form"
      className={cn("space-y-5", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <div className="space-y-2">
        <Label htmlFor="signup-name">Full name</Label>
        <Input
          id="signup-name"
          placeholder="Noah Bennett"
          autoComplete="name"
          leadingIcon={<User />}
          required
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-email">Email</Label>
        <Input
          id="signup-email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          leadingIcon={<Mail />}
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-phone">Phone</Label>
        <Input
          id="signup-phone"
          type="tel"
          placeholder="98765 43210"
          autoComplete="tel-national"
          leadingIcon={
            <span className="text-sm font-medium text-muted-foreground">+91</span>
          }
          required
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-password">Password</Label>
        <Input
          id="signup-password"
          type="password"
          placeholder="Create a password"
          autoComplete="new-password"
          leadingIcon={<Lock />}
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={loading}
        />
        {password && (
          <div className="space-y-1.5" aria-live="polite">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={cn("h-full rounded-full transition-all duration-300", STRENGTH_LEVELS[strength].bar)}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              <span className={cn("font-medium", STRENGTH_LEVELS[strength].text)}>
                {STRENGTH_LEVELS[strength].label}
              </span>
              {" — "}
              {STRENGTH_LEVELS[strength].hint}
            </p>
          </div>
        )}
      </div>

      <div className="space-y-2.5">
        <Label>I am a</Label>
        <RadioGroup
          value={gender}
          onValueChange={setGender}
          className="flex flex-wrap gap-x-6 gap-y-2"
        >
          {GENDERS.map((option) => (
            <div key={option} className="flex items-center gap-2">
              <RadioGroupItem
                value={option.toLowerCase()}
                id={"signup-gender-" + option.toLowerCase()}
                disabled={loading}
              />
              <Label
                htmlFor={"signup-gender-" + option.toLowerCase()}
                className="font-normal"
              >
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="flex items-start gap-2.5">
        <Checkbox
          id="signup-terms"
          checked={terms}
          onCheckedChange={(checked) => setTerms(checked === true)}
          disabled={loading}
          className="mt-0.5"
        />
        <Label htmlFor="signup-terms" className="font-normal leading-snug text-muted-foreground">
          I agree to the <span className="font-medium text-primary underline-offset-4 hover:underline">Terms of Service</span>
          {" "}and{" "}
          <span className="font-medium text-primary underline-offset-4 hover:underline">Privacy Policy</span>
        </Label>
      </div>

      <Button
        type="submit"
        variant="gold"
        size="lg"
        fullWidth
        loading={loading}
        loadingText="Creating account…"
        disabled={!terms}
      >
        Create account
      </Button>
    </form>
  )
}

/* ----------------------------- Forgot password ---------------------------- */

export interface ForgotPasswordFormProps extends Omit<React.ComponentProps<"form">, "onSubmit"> {
  /** Called after the simulated send completes */
  onSubmit?: (email: string) => void | Promise<void>
}

export function ForgotPasswordForm({ className, onSubmit, ...props }: ForgotPasswordFormProps) {
  const [email, setEmail] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [sent, setSent] = React.useState(false)
  const timeoutRef = React.useRef<number | null>(null)

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current)
    }
  }, [])

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (loading) return
    setLoading(true)
    timeoutRef.current = window.setTimeout(() => {
      setLoading(false)
      setSent(true)
      void onSubmit?.(email)
    }, 1100)
  }

  if (sent) {
    return (
      <div
        data-slot="forgot-password-success"
        className={cn("flex flex-col items-center gap-4 py-6 text-center", className)}
      >
        <span className="flex size-14 items-center justify-center rounded-full bg-success/15 text-success">
          <MailCheck className="size-7" />
        </span>
        <div className="space-y-1.5">
          <h3 className="font-serif text-xl font-semibold">Check your inbox</h3>
          <p className="text-sm text-muted-foreground">
            We sent a password reset link to{" "}
            <span className="font-medium text-foreground">{email}</span>.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setSent(false)} className="cursor-pointer">
          Use a different email
        </Button>
      </div>
    )
  }

  return (
    <form
      data-slot="forgot-password-form"
      className={cn("space-y-5", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <div className="space-y-2">
        <Label htmlFor="forgot-email">Email</Label>
        <Input
          id="forgot-email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          leadingIcon={<Mail />}
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={loading}
        />
        <p className="text-xs text-muted-foreground">
          Enter the email linked to your account and we will send a reset link.
        </p>
      </div>
      <Button
        type="submit"
        variant="gold"
        size="lg"
        fullWidth
        loading={loading}
        loadingText="Sending…"
      >
        Send reset link
      </Button>
    </form>
  )
}

/* ------------------------------ Reset password ---------------------------- */

export interface ResetPasswordFormProps extends Omit<React.ComponentProps<"form">, "onSubmit"> {
  /** Called after the simulated reset completes */
  onSubmit?: (password: string) => void | Promise<void>
}

export function ResetPasswordForm({ className, onSubmit, ...props }: ResetPasswordFormProps) {
  const [password, setPassword] = React.useState("")
  const [confirm, setConfirm] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [done, setDone] = React.useState(false)
  const timeoutRef = React.useRef<number | null>(null)

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current)
    }
  }, [])

  const mismatch = confirm.length > 0 && confirm !== password
  const valid = password.length >= 8 && password === confirm

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (loading || !valid) return
    setLoading(true)
    timeoutRef.current = window.setTimeout(() => {
      setLoading(false)
      setDone(true)
      void onSubmit?.(password)
    }, 1200)
  }

  if (done) {
    return (
      <div
        data-slot="reset-password-success"
        className={cn("flex flex-col items-center gap-4 py-6 text-center", className)}
      >
        <span className="flex size-14 items-center justify-center rounded-full bg-success/15 text-success">
          <CircleCheck className="size-7" />
        </span>
        <div className="space-y-1.5">
          <h3 className="font-serif text-xl font-semibold">Password updated</h3>
          <p className="text-sm text-muted-foreground">
            Your password has been changed. You can now sign in with the new one.
          </p>
        </div>
      </div>
    )
  }

  return (
    <form
      data-slot="reset-password-form"
      className={cn("space-y-5", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <div className="space-y-2">
        <Label htmlFor="reset-password">New password</Label>
        <Input
          id="reset-password"
          type={showPassword ? "text" : "password"}
          placeholder="At least 8 characters"
          autoComplete="new-password"
          leadingIcon={<Lock />}
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={loading}
          trailingIcon={
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="reset-confirm">Confirm password</Label>
        <Input
          id="reset-confirm"
          type={showPassword ? "text" : "password"}
          placeholder="Re-enter your password"
          autoComplete="new-password"
          leadingIcon={<Lock />}
          required
          error={mismatch}
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
          disabled={loading}
        />
        {mismatch ? (
          <p className="text-xs font-medium text-destructive">Passwords do not match.</p>
        ) : (
          <p className="text-xs text-muted-foreground">Both fields must match exactly.</p>
        )}
      </div>

      <Button
        type="submit"
        variant="gold"
        size="lg"
        fullWidth
        loading={loading}
        loadingText="Updating…"
        disabled={!valid}
      >
        Update password
      </Button>
    </form>
  )
}
