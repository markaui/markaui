"use client"

import * as React from "react"
import { Check, Copy } from "lucide-react"

import { cn } from "@/lib/utils"
import { IconButton } from "@/components/ui/icon-button"

export interface CodeBlockProps extends React.ComponentProps<"div"> {
  /** Source code to display (and copy) */
  code: string
  /** File name shown in the header; falls back to `language` */
  filename?: string
  /** Language label shown in the header when no filename is given */
  language?: string
  /** Render a line-number gutter */
  lineNumbers?: boolean
  /** Fixed max height with internal scrolling, e.g. 280 or "16rem" */
  maxHeight?: number | string
}

function CodeBlock({
  code,
  filename,
  language,
  lineNumbers = false,
  maxHeight,
  className,
  ...props
}: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false)
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard unavailable — silently ignore.
    }
  }

  const lines = code.replace(/\n$/, "").split("\n")

  return (
    <div
      data-slot="code-block"
      className={cn("bg-muted/50 overflow-hidden rounded-xl border text-sm", className)}
      {...props}
    >
      <div className="flex items-center justify-between gap-2 border-b bg-muted/30 px-4 py-1.5">
        <span className="truncate font-mono text-xs text-muted-foreground">
          {filename ?? language ?? "code"}
        </span>
        <IconButton
          variant="ghost"
          size="sm"
          aria-label={copied ? "Copied" : "Copy code"}
          onClick={handleCopy}
        >
          {copied ? <Check className="size-4 text-success" /> : <Copy className="size-4" />}
        </IconButton>
      </div>
      <pre
        className="scrollbar-thin overflow-auto p-4 font-mono text-xs leading-relaxed sm:text-sm"
        style={maxHeight !== undefined ? { maxHeight } : undefined}
      >
        {lineNumbers ? (
          <code>
            {lines.map((line, index) => (
              <span key={index} className="flex">
                <span className="w-8 shrink-0 pr-4 text-right text-muted-foreground/50 select-none">
                  {index + 1}
                </span>
                <span className="whitespace-pre">{line || " "}</span>
              </span>
            ))}
          </code>
        ) : (
          <code>{code}</code>
        )}
      </pre>
    </div>
  )
}

export { CodeBlock }
