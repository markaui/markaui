import * as React from "react"
import { Heart, Quote } from "lucide-react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export interface AuthLayoutProps extends React.ComponentProps<"div"> {
  /** Headline shown above the form panel */
  title: string
  /** Supporting line under the title */
  subtitle?: string
  /** Form content (LoginForm, SignupForm, …) */
  children: React.ReactNode
  /** Optional footer below the form (e.g. "New here? Create an account") */
  footer?: React.ReactNode
}

const TESTIMONIAL_AVATARS = ["AR", "PS", "NK"] as const

const TRUST_STATS = [
  { value: "2M+", label: "Verified members" },
  { value: "50K+", label: "Weddings celebrated" },
  { value: "4.9★", label: "Average rating" },
] as const

/**
 * Split-screen authentication shell: a dark maroon brand panel with a radial
 * gold glow (hidden below `md`) beside a centered form panel.
 */
export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
  className,
  ...props
}: AuthLayoutProps) {
  return (
    <div
      data-slot="auth-layout"
      className={cn("flex min-h-svh w-full bg-background", className)}
      {...props}
    >
      {/* Brand panel */}
      <aside className="relative hidden w-[46%] max-w-xl flex-col justify-between overflow-hidden bg-gradient-to-b from-primary to-primary/80 p-10 text-primary-foreground md:flex">
        <div className="bg-radial-fade pointer-events-none absolute inset-0" aria-hidden="true" />
        <div
          className="bg-radial-fade pointer-events-none absolute inset-0 rotate-180 opacity-70"
          aria-hidden="true"
        />

        <div className="relative flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-full bg-gold text-gold-foreground shadow-md">
            <Heart className="size-4.5" />
          </span>
          <span className="font-serif text-xl font-semibold tracking-tight">Saptapadi</span>
        </div>

        <div className="relative space-y-8 py-12">
          <h2 className="font-serif text-4xl leading-tight font-medium text-balance">
            Where two souls begin{" "}
            <span className="text-gradient-gold">one sacred journey</span>.
          </h2>

          <figure className="space-y-4">
            <Quote className="size-6 text-gold" aria-hidden="true" />
            <blockquote className="font-serif text-lg leading-relaxed text-primary-foreground/90 italic">
              “Saptapadi understood what we were looking for. Six months after
              our first chat, we were planning the sangeet together.”
            </blockquote>
            <figcaption className="flex items-center gap-3 text-sm text-primary-foreground/80">
              <span className="flex -space-x-2.5">
                {TESTIMONIAL_AVATARS.map((initials) => (
                  <Avatar key={initials} className="size-8 border-2 border-primary/60">
                    <AvatarFallback className="bg-primary/40 text-[10px] font-semibold text-primary-foreground">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </span>
              <span>
                Jane &amp; John —
                <span className="text-primary-foreground/60"> married December 2024</span>
              </span>
            </figcaption>
          </figure>
        </div>

        <div className="relative grid grid-cols-3 gap-6 border-t border-primary-foreground/15 pt-6">
          {TRUST_STATS.map((stat) => (
            <div key={stat.label} className="space-y-1">
              <p className="font-serif text-2xl font-semibold">{stat.value}</p>
              <p className="text-xs text-primary-foreground/70">{stat.label}</p>
            </div>
          ))}
        </div>
      </aside>

      {/* Form panel */}
      <main className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-2 p-6 md:hidden">
          <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Heart className="size-4" />
          </span>
          <span className="font-serif text-lg font-semibold">Saptapadi</span>
        </div>

        <div className="flex flex-1 items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md space-y-8">
            <div className="space-y-2">
              <h1 className="font-serif text-3xl font-semibold tracking-tight">{title}</h1>
              {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
            </div>

            {children}

            {footer && <div className="text-sm text-muted-foreground">{footer}</div>}
          </div>
        </div>
      </main>
    </div>
  )
}
