import * as React from "react"
import NextLink from "next/link"
import { cva, type VariantProps } from "class-variance-authority"
import { ArrowUpRight } from "lucide-react"

import { cn } from "@/lib/utils"

export const linkVariants = cva(
  "inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-sm underline-offset-4 outline-none transition-colors duration-200 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "text-foreground hover:text-primary",
        muted: "text-muted-foreground hover:text-foreground",
        primary: "text-primary hover:text-primary/80 hover:underline",
        gold: "text-gold hover:text-gold/80 hover:underline decoration-gold/50",
        underline:
          "text-foreground underline decoration-border hover:text-primary hover:decoration-primary",
        nav: "rounded-lg px-2 py-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        sm: "text-xs",
        default: "text-sm",
        lg: "text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface LinkProps
  extends Omit<React.ComponentProps<"a">, "href">,
    VariantProps<typeof linkVariants> {
  /**
   * Destination URL. Internal paths (starting with "/") render a Next.js Link
   * for client-side navigation; every other value renders a plain anchor.
   */
  href?: string
  /** Element rendered before the label */
  iconLeft?: React.ReactNode
  /** Element rendered after the label — ignored when `external` is set */
  iconRight?: React.ReactNode
  /** Opens the link in a new tab, adds rel="noopener noreferrer" and an external-link icon */
  external?: boolean
}

function Link({
  className,
  variant,
  size,
  href,
  iconLeft,
  iconRight,
  external = false,
  children,
  ...props
}: LinkProps) {
  const classes = cn(linkVariants({ variant, size }), className)

  const externalProps = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {}

  const content = (
    <>
      {iconLeft}
      {children}
      {external ? (
        <ArrowUpRight
          className="size-3.5 opacity-70 transition-transform duration-200"
          aria-hidden="true"
        />
      ) : (
        iconRight
      )}
    </>
  )

  if (typeof href === "string" && href.startsWith("/")) {
    return (
      <NextLink
        data-slot="link"
        href={href}
        className={classes}
        {...props}
        {...externalProps}
      >
        {content}
      </NextLink>
    )
  }

  return (
    <a
      data-slot="link"
      className={classes}
      {...props}
      href={href}
      {...externalProps}
    >
      {content}
    </a>
  )
}

export { Link }
