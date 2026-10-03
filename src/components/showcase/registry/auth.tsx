import type { ComponentDoc } from "./types"

import {
  ForgotPasswordForm,
  LoginForm,
  ResetPasswordForm,
  SignupForm,
} from "@/components/ui/auth-forms"
import { AuthLayout } from "@/components/ui/auth-layout"
import { OTPVerification, TwoFactorAuth } from "@/components/ui/otp-verification"
import { PasskeyButton, SocialLogin } from "@/components/ui/social-login"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const authDocs: ComponentDoc[] = [
  {
    id: "login-form",
    name: "LoginForm",
    category: "auth",
    description:
      "Email + password sign-in with show/hide toggle, remember me, forgot link and a social provider row. Submit simulates loading then calls onSubmit.",
    aliases: ["SignInForm"],
    demos: [
      {
        id: "sign-in",
        title: "Sign in",
        description: "Controlled internally — submit simulates a round-trip and fires onSubmit.",
        wide: true,
        code: `import { LoginForm } from "@/components/ui/auth-forms"

export function Page() {
  return (
    <LoginForm
      onSubmit={(data) => {
        console.log("login", data.email, data.remember)
      }}
    />
  )
}`,
        render: () => (
          <div className="flex justify-center py-2">
            <div className="w-full max-w-sm">
              <LoginForm
                onSubmit={(data) => {
                  console.log("Signed in as", data.email, "remember:", data.remember)
                }}
              />
            </div>
          </div>
        ),
      },
      {
        id: "sign-in-card",
        title: "Inside a card",
        description: "Wrap the form in a Card with showSocial={false} for a compact surface.",
        code: `import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoginForm } from "@/components/ui/auth-forms"

<Card className="max-w-sm">
  <CardHeader>
    <CardTitle>Welcome back</CardTitle>
    <CardDescription>Sign in to continue.</CardDescription>
  </CardHeader>
  <CardContent>
    <LoginForm showSocial={false} />
  </CardContent>
</Card>`,
        render: () => (
          <div className="flex justify-center py-2">
            <Card className="w-full max-w-sm gap-5">
              <CardHeader>
                <CardTitle className="font-serif text-xl">Welcome back</CardTitle>
                <CardDescription>Sign in to continue your journey.</CardDescription>
              </CardHeader>
              <CardContent>
                <LoginForm showSocial={false} />
              </CardContent>
            </Card>
          </div>
        ),
      },
    ],
    props: [
      {
        name: "onSubmit",
        type: "(data: { email, password, remember }) => void | Promise<void>",
        description: "Fires after the simulated loading round-trip completes.",
      },
      {
        name: "showSocial",
        type: "boolean",
        default: "true",
        description: "Shows the divider plus Google / Apple / Facebook buttons.",
      },
      {
        name: "onForgotPassword",
        type: "() => void",
        description: "Handler for the forgot-password link.",
      },
      {
        name: "className",
        type: "string",
        description: "Extra classes for the form element.",
      },
    ],
  },
  {
    id: "signup-form",
    name: "SignupForm",
    category: "auth",
    description:
      "Registration form with +91 phone prefix, live password strength meter, gender radio group and a required terms checkbox that gates the submit button.",
    aliases: ["RegisterForm", "SignUpForm"],
    demos: [
      {
        id: "register",
        title: "Create account",
        description: "Type a password to see the strength hint; submit stays disabled until terms are accepted.",
        wide: true,
        code: `import { SignupForm } from "@/components/ui/auth-forms"

export function Page() {
  return (
    <SignupForm
      onSubmit={(data) => {
        console.log("signup", data.fullName, data.gender)
      }}
    />
  )
}`,
        render: () => (
          <div className="flex justify-center py-2">
            <div className="w-full max-w-md">
              <SignupForm
                onSubmit={(data) => {
                  console.log("Signed up", data.fullName, data.email, data.phone, data.gender)
                }}
              />
            </div>
          </div>
        ),
      },
    ],
    props: [
      {
        name: "onSubmit",
        type: "(data: { fullName, email, phone, password, gender }) => void | Promise<void>",
        description: "Fires after the simulated submit completes.",
      },
      {
        name: "className",
        type: "string",
        description: "Extra classes for the form element.",
      },
      {
        name: "…form props",
        type: "React.ComponentProps<\"form\">",
        description: "All native form attributes are forwarded (id, autoComplete parent, etc.).",
      },
    ],
  },
  {
    id: "forgot-password-form",
    name: "ForgotPasswordForm",
    category: "auth",
    description:
      "Single-email reset request that swaps to a success state with a MailCheck icon once the send simulation finishes.",
    demos: [
      {
        id: "forgot",
        title: "Request reset",
        description: "Submit the form to see the sent state; go back with the outline button.",
        code: `import { ForgotPasswordForm } from "@/components/ui/auth-forms"

export function Page() {
  return <ForgotPasswordForm onSubmit={(email) => console.log("sent to", email)} />
}`,
        render: () => (
          <div className="flex justify-center py-2">
            <div className="w-full max-w-sm">
              <ForgotPasswordForm onSubmit={(email) => console.log("Reset link sent to", email)} />
            </div>
          </div>
        ),
      },
    ],
    props: [
      {
        name: "onSubmit",
        type: "(email: string) => void | Promise<void>",
        description: "Fires when the reset link has been “sent”.",
      },
      {
        name: "className",
        type: "string",
        description: "Extra classes for the form / success wrapper.",
      },
    ],
  },
  {
    id: "reset-password-form",
    name: "ResetPasswordForm",
    category: "auth",
    description:
      "New password + confirmation with live match validation; the confirm field turns invalid and submit stays disabled until both values agree.",
    demos: [
      {
        id: "reset",
        title: "Set a new password",
        description: "Enter mismatching values to see the validation, then match them and submit.",
        code: `import { ResetPasswordForm } from "@/components/ui/auth-forms"

export function Page() {
  return (
    <ResetPasswordForm
      onSubmit={(password) => console.log("new password length", password.length)}
    />
  )
}`,
        render: () => (
          <div className="flex justify-center py-2">
            <div className="w-full max-w-sm">
              <ResetPasswordForm
                onSubmit={(password) => console.log("Password updated, length", password.length)}
              />
            </div>
          </div>
        ),
      },
    ],
    props: [
      {
        name: "onSubmit",
        type: "(password: string) => void | Promise<void>",
        description: "Fires after the simulated reset succeeds.",
      },
      {
        name: "className",
        type: "string",
        description: "Extra classes for the form / success wrapper.",
      },
    ],
  },
  {
    id: "otp-verification",
    name: "OTPVerification",
    category: "auth",
    description:
      "Five-digit code entry built on input-otp with a 30-second resend countdown, verifying state and a success swap.",
    demos: [
      {
        id: "otp",
        title: "Verify a code",
        description: "Fill all five digits to enable verify; the resend link appears when the countdown ends.",
        code: `import { OTPVerification } from "@/components/ui/otp-verification"

export function Page() {
  return (
    <OTPVerification
      destination="+91 98•••• ••210"
      onVerify={(code) => console.log("verified", code)}
    />
  )
}`,
        render: () => (
          <div className="flex justify-center py-2">
            <OTPVerification
              className="w-full max-w-sm"
              onVerify={(code) => console.log("Verified with code", code)}
            />
          </div>
        ),
      },
    ],
    props: [
      {
        name: "onVerify",
        type: "(code: string) => void | Promise<void>",
        description: "Fires after the verifying simulation succeeds.",
      },
      {
        name: "length",
        type: "number",
        default: "5",
        description: "Number of OTP digits.",
      },
      {
        name: "resendSeconds",
        type: "number",
        default: "30",
        description: "Resend countdown duration.",
      },
      {
        name: "destination",
        type: "string",
        default: '"+91 98•••• ••210"',
        description: "Masked destination shown above the input.",
      },
    ],
  },
  {
    id: "two-factor-auth",
    name: "TwoFactorAuth",
    category: "auth",
    description:
      "Two-factor step with a six-digit OTP mode, a backup-code textarea mode, and a trust-device switch that persists for 30 days.",
    aliases: ["TwoFactor", "2FA"],
    demos: [
      {
        id: "two-factor",
        title: "Two-factor step",
        description: "Switch between authenticator and backup-code modes with the link below.",
        wide: true,
        code: `import { TwoFactorAuth } from "@/components/ui/otp-verification"

export function Page() {
  return (
    <TwoFactorAuth
      onVerify={(code) => console.log("totp", code)}
      onBackupCode={(code) => console.log("backup", code)}
    />
  )
}`,
        render: () => (
          <div className="flex justify-center py-2">
            <div className="w-full max-w-md">
              <TwoFactorAuth
                onVerify={(code) => console.log("2FA code", code)}
                onBackupCode={(code) => console.log("Backup code", code)}
              />
            </div>
          </div>
        ),
      },
    ],
    props: [
      {
        name: "onVerify",
        type: "(code: string) => void | Promise<void>",
        description: "Fires when the authenticator code is verified.",
      },
      {
        name: "onBackupCode",
        type: "(code: string) => void | Promise<void>",
        description: "Fires when a backup code is submitted.",
      },
      {
        name: "className",
        type: "string",
        description: "Extra classes for the wrapper.",
      },
    ],
  },
  {
    id: "auth-layout",
    name: "AuthLayout",
    category: "auth",
    description:
      "Premium split-screen shell: dark maroon brand panel with a radial gold glow, testimonial and trust stats on the left; centered serif-titled form panel on the right.",
    demos: [
      {
        id: "auth-layout-demo",
        title: "Split screen",
        description: "The brand panel hides below the md breakpoint, collapsing to a mobile logo bar.",
        wide: true,
        code: `import { AuthLayout } from "@/components/ui/auth-layout"
import { LoginForm } from "@/components/ui/auth-forms"

export function Page() {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue planning your big day."
      footer={<>New to Saptapadi? Create an account</>}
    >
      <LoginForm showSocial={false} />
    </AuthLayout>
  )
}`,
        render: () => (
          <div className="h-[560px] overflow-hidden rounded-xl border shadow-sm">
            <AuthLayout
              title="Welcome back"
              subtitle="Sign in to continue planning your big day."
              className="h-full min-h-0"
              footer={
                <>
                  New to Saptapadi?{" "}
                  <span className="cursor-pointer font-medium text-primary underline-offset-4 hover:underline">
                    Create an account
                  </span>
                </>
              }
            >
              <LoginForm showSocial={false} />
            </AuthLayout>
          </div>
        ),
      },
    ],
    props: [
      {
        name: "title",
        type: "string",
        description: "Serif headline above the form.",
      },
      {
        name: "subtitle",
        type: "string",
        description: "Supporting line under the title.",
      },
      {
        name: "children",
        type: "React.ReactNode",
        description: "Form content rendered in the centered panel.",
      },
      {
        name: "footer",
        type: "React.ReactNode",
        description: "Optional footer below the form.",
      },
      {
        name: "className",
        type: "string",
        description: "Classes for the root — pass min-h-0 h-full to embed in a fixed-height box.",
      },
    ],
  },
  {
    id: "social-login",
    name: "SocialLogin",
    category: "auth",
    description:
      "Row of outline provider buttons with per-button loading simulation and a provider callback. Google, Apple, Facebook and Email are built in.",
    demos: [
      {
        id: "social-providers",
        title: "Providers",
        description: "Only one button spins at a time; the callback fires when loading finishes.",
        code: `import { SocialLogin } from "@/components/ui/social-login"

export function Page() {
  return (
    <SocialLogin
      providers={["google", "apple", "facebook", "email"]}
      onProviderClick={(provider) => console.log(provider)}
    />
  )
}`,
        render: () => (
          <div className="w-full max-w-sm space-y-4">
            <SocialLogin
              providers={["google", "apple", "facebook"]}
              onProviderClick={(provider) => console.log("Provider ready:", provider)}
            />
            <SocialLogin providers={["google", "apple", "facebook", "email"]} />
          </div>
        ),
      },
    ],
    props: [
      {
        name: "providers",
        type: '"google" | "apple" | "facebook" | "email"[]',
        default: '["google", "apple", "facebook"]',
        description: "Providers and their order.",
      },
      {
        name: "onProviderClick",
        type: "(provider: SocialProvider) => void | Promise<void>",
        description: "Fires after the per-provider loading simulation.",
      },
      {
        name: "showLabels",
        type: "boolean",
        default: "true",
        description: "Show text labels next to the icons.",
      },
    ],
  },
  {
    id: "passkey-button",
    name: "PasskeyButton",
    category: "auth",
    description:
      "Fingerprint button with a gold outline, a simulated WebAuthn ceremony (loading → success) and a configurable label.",
    aliases: ["Passkey", "WebAuthnButton"],
    demos: [
      {
        id: "passkey",
        title: "Passkey sign-in",
        description: "Click to run the simulated ceremony — the button flips to a success state for two seconds.",
        code: `import { PasskeyButton } from "@/components/ui/social-login"

export function Page() {
  return <PasskeyButton onPasskey={() => console.log("passkey ready")} />
}`,
        render: () => (
          <div className="flex w-full max-w-sm flex-col gap-3">
            <PasskeyButton onPasskey={() => console.log("Passkey ceremony complete")} />
            <PasskeyButton fullWidth>Use your passkey instead</PasskeyButton>
          </div>
        ),
      },
    ],
    props: [
      {
        name: "onPasskey",
        type: "() => void | Promise<void>",
        description: "Fires when the simulated ceremony succeeds.",
      },
      {
        name: "fullWidth",
        type: "boolean",
        description: "Stretch to the container width.",
      },
      {
        name: "children",
        type: "React.ReactNode",
        default: '"Sign in with passkey"',
        description: "Button label.",
      },
    ],
  },
]
