"use client"

import * as React from "react"
import { Check, Copy } from "lucide-react"

import { cn } from "@/lib/utils"
import { IconButton } from "@/components/ui/icon-button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

async function copyToClipboard(value: string): Promise<boolean> {
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(value)
      return true
    }
  } catch {
    return false
  }
  return false
}

/* -------------------------------- CopyButton ------------------------------- */

export interface CopyButtonProps
  extends Omit<React.ComponentProps<typeof IconButton>, "aria-label" | "value"> {
  /** Text to place on the clipboard */
  value: string
  /** Optional tooltip text (defaults to "Copy") */
  tooltip?: string
  /** Called after a successful copy */
  onCopied?: (value: string) => void
}

export function CopyButton({
  value,
  tooltip,
  onCopied,
  className,
  onClick,
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false)
  const timeoutRef = React.useRef<number | null>(null)

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current)
    }
  }, [])

  async function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    onClick?.(event)
    const ok = await copyToClipboard(value)
    if (!ok) return
    setCopied(true)
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current)
    timeoutRef.current = window.setTimeout(() => setCopied(false), 2000)
    onCopied?.(value)
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <IconButton
          variant="ghost"
          size="sm"
          aria-label={copied ? "Copied" : (tooltip ?? "Copy to clipboard")}
          className={cn("cursor-pointer", className)}
          onClick={handleClick}
          {...props}
        >
          {copied ? <Check className="text-success" /> : <Copy />}
        </IconButton>
      </TooltipTrigger>
      <TooltipContent>{copied ? "Copied!" : (tooltip ?? "Copy")}</TooltipContent>
    </Tooltip>
  )
}

/* ------------------------------ CopyableText ------------------------------- */

export interface CopyableTextProps extends React.ComponentProps<"span"> {
  /** Text shown (and copied when the icon is clicked) */
  value: string
  /** Truncate long values with an ellipsis (default false) */
  truncate?: boolean
  /** Max width applied to the text when truncating, any CSS width */
  maxWidth?: string
}

export function CopyableText({
  value,
  truncate = false,
  maxWidth,
  className,
  children,
  ...props
}: CopyableTextProps) {
  const [copied, setCopied] = React.useState(false)
  const timeoutRef = React.useRef<number | null>(null)

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current)
    }
  }, [])

  async function handleCopy() {
    const ok = await copyToClipboard(value)
    if (!ok) return
    setCopied(true)
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current)
    timeoutRef.current = window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <span
      data-slot="copyable-text"
      className={cn("inline-flex max-w-full min-w-0 items-center gap-1", className)}
      {...props}
    >
      <span
        className={cn(
          "min-w-0 rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground",
          truncate && "truncate"
        )}
        style={maxWidth ? { maxWidth } : undefined}
      >
        {children ?? value}
      </span>
      <IconButton
        variant="ghost"
        size="xs"
        shape="square"
        aria-label={copied ? "Copied" : "Copy to clipboard"}
        onClick={handleCopy}
        className="cursor-pointer"
      >
        {copied ? <Check className="size-3.5 text-success" /> : <Copy className="size-3.5" />}
      </IconButton>
    </span>
  )
}
