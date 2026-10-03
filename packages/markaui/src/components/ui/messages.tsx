"use client"

import * as React from "react"
import { CheckCircle2, Info, TriangleAlert, X, XCircle } from "lucide-react"

import { cn } from "../../lib/utils"
import { Alert, AlertDescription, AlertTitle } from "./alert"
import { IconButton } from "./icon-button"

export interface MessageProps extends React.ComponentProps<"div"> {
  /** Bold serif heading rendered above the message body */
  title?: string
  /** Dismissible messages render a close button wired to this callback */
  onDismiss?: () => void
}

const toneStyles = {
  success: {
    alert: "border-success/30 bg-success/10 text-success",
    description: "text-success/80 dark:text-success/85",
    dismiss: "text-success hover:bg-success/15 hover:text-success",
  },
  destructive: {
    alert: "border-destructive/30 bg-destructive/10 text-destructive",
    description: "text-destructive/80 dark:text-destructive/85",
    dismiss: "text-destructive hover:bg-destructive/15 hover:text-destructive",
  },
  warning: {
    alert: "border-warning/30 bg-warning/10 text-warning",
    description: "text-warning/80 dark:text-warning/85",
    dismiss: "text-warning hover:bg-warning/15 hover:text-warning",
  },
  info: {
    alert: "border-info/30 bg-info/10 text-info",
    description: "text-info/80 dark:text-info/85",
    dismiss: "text-info hover:bg-info/15 hover:text-info",
  },
} as const

function SuccessMessage({ title, children, onDismiss, className, ...props }: MessageProps) {
  const tone = toneStyles.success
  return (
    <Alert
      data-slot="success-message"
      className={cn(tone.alert, onDismiss && "pr-11", className)}
      {...props}
    >
      <CheckCircle2 />
      {title ? <AlertTitle className="font-serif">{title}</AlertTitle> : null}
      <AlertDescription className={tone.description}>{children}</AlertDescription>
      {onDismiss ? (
        <IconButton
          type="button"
          aria-label="Dismiss message"
          variant="ghost"
          size="xs"
          onClick={onDismiss}
          className={cn("absolute top-2 right-2", tone.dismiss)}
        >
          <X />
        </IconButton>
      ) : null}
    </Alert>
  )
}

function ErrorMessage({ title, children, onDismiss, className, ...props }: MessageProps) {
  const tone = toneStyles.destructive
  return (
    <Alert
      data-slot="error-message"
      className={cn(tone.alert, onDismiss && "pr-11", className)}
      {...props}
    >
      <XCircle />
      {title ? <AlertTitle className="font-serif">{title}</AlertTitle> : null}
      <AlertDescription className={tone.description}>{children}</AlertDescription>
      {onDismiss ? (
        <IconButton
          type="button"
          aria-label="Dismiss message"
          variant="ghost"
          size="xs"
          onClick={onDismiss}
          className={cn("absolute top-2 right-2", tone.dismiss)}
        >
          <X />
        </IconButton>
      ) : null}
    </Alert>
  )
}

function WarningMessage({ title, children, onDismiss, className, ...props }: MessageProps) {
  const tone = toneStyles.warning
  return (
    <Alert
      data-slot="warning-message"
      className={cn(tone.alert, onDismiss && "pr-11", className)}
      {...props}
    >
      <TriangleAlert />
      {title ? <AlertTitle className="font-serif">{title}</AlertTitle> : null}
      <AlertDescription className={tone.description}>{children}</AlertDescription>
      {onDismiss ? (
        <IconButton
          type="button"
          aria-label="Dismiss message"
          variant="ghost"
          size="xs"
          onClick={onDismiss}
          className={cn("absolute top-2 right-2", tone.dismiss)}
        >
          <X />
        </IconButton>
      ) : null}
    </Alert>
  )
}

function InfoMessage({ title, children, onDismiss, className, ...props }: MessageProps) {
  const tone = toneStyles.info
  return (
    <Alert
      data-slot="info-message"
      className={cn(tone.alert, onDismiss && "pr-11", className)}
      {...props}
    >
      <Info />
      {title ? <AlertTitle className="font-serif">{title}</AlertTitle> : null}
      <AlertDescription className={tone.description}>{children}</AlertDescription>
      {onDismiss ? (
        <IconButton
          type="button"
          aria-label="Dismiss message"
          variant="ghost"
          size="xs"
          onClick={onDismiss}
          className={cn("absolute top-2 right-2", tone.dismiss)}
        >
          <X />
        </IconButton>
      ) : null}
    </Alert>
  )
}

export { SuccessMessage, ErrorMessage, WarningMessage, InfoMessage }
