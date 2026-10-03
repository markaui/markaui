"use client"

import * as React from "react"
import { CircleAlert } from "lucide-react"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

/**
 * Small destructive validation message with an alert icon.
 * Renders nothing when children are empty.
 */
function FieldError({ className, children, ...props }: React.ComponentProps<"p">) {
  if (!children) return null
  return (
    <p
      data-slot="field-error"
      role="alert"
      className={cn("text-destructive flex items-center gap-1.5 text-xs", className)}
      {...props}
    >
      <CircleAlert className="size-3.5 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </p>
  )
}

export interface FormFieldProps extends React.ComponentProps<"div"> {
  /** Field label rendered above (vertical) or beside (horizontal) the control */
  label?: React.ReactNode
  /** Helper text shown under the control — replaced by error when present */
  hint?: React.ReactNode
  /** Validation message rendered in destructive tone instead of the hint */
  error?: React.ReactNode
  /** Shows a destructive asterisk after the label */
  required?: boolean
  /** Label placement */
  orientation?: "vertical" | "horizontal"
  /** id of the control — forwarded to the label */
  htmlFor?: string
}

/**
 * Standalone labelled field wrapper (no form library required).
 * Label on top, optional hint below, error message replaces the hint.
 */
function FormField({
  label,
  hint,
  error,
  required = false,
  orientation = "vertical",
  htmlFor,
  className,
  children,
  ...props
}: FormFieldProps) {
  const labelNode = label ? (
    <Label
      data-slot="form-field-label"
      htmlFor={htmlFor}
      className={cn("w-fit", error && "text-destructive")}
    >
      {label}
      {required ? (
        <span aria-hidden="true" className="text-destructive">
          *
        </span>
      ) : null}
    </Label>
  ) : null

  const footer = error ? (
    <FieldError>{error}</FieldError>
  ) : hint ? (
    <p data-slot="form-field-hint" className="text-muted-foreground text-xs">
      {hint}
    </p>
  ) : null

  if (orientation === "horizontal") {
    return (
      <div
        data-slot="form-field"
        data-orientation="horizontal"
        className={cn(
          "grid gap-1.5 sm:grid-cols-[10rem_1fr] sm:items-center sm:gap-x-4",
          className
        )}
        {...props}
      >
        {labelNode}
        <div className="grid gap-1.5">
          {children}
          {footer}
        </div>
      </div>
    )
  }

  return (
    <div
      data-slot="form-field"
      data-orientation="vertical"
      className={cn("grid gap-1.5", className)}
      {...props}
    >
      {labelNode}
      {children}
      {footer}
    </div>
  )
}

export interface FormSectionProps
  extends Omit<React.ComponentProps<"section">, "title"> {
  /** Section heading (rendered in the serif display face) */
  title?: React.ReactNode
  /** Secondary line under the title */
  description?: React.ReactNode
  /** Number of columns in the children grid */
  columns?: 1 | 2 | 3 | 4
}

/**
 * Titled form region: heading + description followed by a responsive grid of fields.
 */
function FormSection({
  title,
  description,
  columns = 2,
  className,
  children,
  ...props
}: FormSectionProps) {
  return (
    <section data-slot="form-section" className={cn("space-y-4", className)} {...props}>
      {title || description ? (
        <div className="space-y-1">
          {title ? (
            <h3 className="font-serif text-lg font-semibold tracking-tight text-foreground">
              {title}
            </h3>
          ) : null}
          {description ? (
            <p className="text-muted-foreground text-sm">{description}</p>
          ) : null}
        </div>
      ) : null}
      <div
        data-slot="form-section-grid"
        className={cn(
          "grid gap-4",
          columns === 1 && "grid-cols-1",
          columns === 2 && "sm:grid-cols-2",
          columns === 3 && "sm:grid-cols-3",
          columns === 4 && "sm:grid-cols-2 md:grid-cols-4"
        )}
      >
        {children}
      </div>
    </section>
  )
}

export { FormField, FormSection, FieldError }
