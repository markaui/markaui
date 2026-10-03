"use client"

import * as React from "react"
import { cva } from "class-variance-authority"
import { Menu as MenuIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { IconButton } from "@/components/ui/icon-button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export interface NavbarLinkDef {
  label: string
  href: string
  active?: boolean
}

/**
 * Responsive via CSS container queries: the header is a `@container`, so the
 * desktop links / mobile Sheet switch at a container width of 48rem (`@3xl`),
 * not the viewport. Drop it into a narrow stage or column and it collapses
 * exactly like it would on a phone.
 */
const navbarVariants = cva("@container sticky top-0 z-40 w-full", {
  variants: {
    transparent: {
      true: "bg-transparent",
      false: "glass border-b border-border shadow-sm",
    },
  },
  defaultVariants: {
    transparent: false,
  },
})

export interface NavbarLinkProps extends React.ComponentProps<"a"> {
  active?: boolean
}

function NavbarLink({ className, active = false, ...props }: NavbarLinkProps) {
  return (
    <a
      data-slot="navbar-link"
      data-active={active}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative inline-flex h-9 cursor-pointer items-center rounded-md px-3 text-sm font-medium outline-none transition-all duration-200 hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50",
        active
          ? "text-foreground after:absolute after:inset-x-3 after:-bottom-1 after:h-0.5 after:rounded-full after:bg-primary"
          : "text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

export interface NavbarProps extends React.ComponentProps<"header"> {
  /** Brand slot — typically a gradient logo mark plus a serif wordmark */
  brand?: React.ReactNode
  /** Desktop link list, hidden behind the mobile Sheet on small screens */
  links?: NavbarLinkDef[]
  /** Right-aligned actions — buttons, icon buttons, avatars */
  actions?: React.ReactNode
  /** Remove the glass background and border */
  transparent?: boolean
}

function Navbar({
  brand,
  links = [],
  actions,
  children,
  transparent = false,
  className,
  ...props
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false)

  return (
    <header
      data-slot="navbar"
      className={cn(navbarVariants({ transparent }), className)}
      {...props}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-3 px-4 sm:px-6">
        {brand ? (
          <div data-slot="navbar-brand" className="flex shrink-0 items-center">
            {brand}
          </div>
        ) : null}

        {links.length > 0 ? (
          <nav
            data-slot="navbar-links"
            aria-label="Primary"
            className="hidden items-center gap-1 @3xl:flex"
          >
            {links.map((link) => (
              <NavbarLink key={link.href} href={link.href} active={link.active}>
                {link.label}
              </NavbarLink>
            ))}
          </nav>
        ) : null}

        <div
          data-slot="navbar-children"
          className="flex min-w-0 flex-1 items-center justify-end gap-2"
        >
          {children}
        </div>

        {actions ? (
          <div
            data-slot="navbar-actions"
            className="flex shrink-0 items-center gap-2"
          >
            {actions}
          </div>
        ) : null}

        {links.length > 0 ? (
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <IconButton
                variant="ghost"
                aria-label="Open navigation menu"
                className="@3xl:hidden"
              >
                <MenuIcon />
              </IconButton>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 gap-0">
              <SheetHeader className="border-b">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <SheetDescription className="sr-only">
                  Browse the main sections of the site.
                </SheetDescription>
                {brand ? <div className="flex items-center py-1">{brand}</div> : null}
              </SheetHeader>
              <nav
                data-slot="navbar-mobile-links"
                aria-label="Mobile"
                className="flex flex-col gap-1 p-4"
              >
                {links.map((link) => (
                  <SheetClose key={link.href} asChild>
                    <NavbarLink
                      href={link.href}
                      active={link.active}
                      className="w-full rounded-md px-3 data-[active=true]:bg-accent"
                    >
                      {link.label}
                    </NavbarLink>
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        ) : null}
      </div>
    </header>
  )
}

export { Navbar, NavbarLink, navbarVariants }
