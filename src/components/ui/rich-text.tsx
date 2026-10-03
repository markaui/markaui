"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

const richTextStyles = cn(
  "text-sm leading-relaxed text-foreground",
  "[&_h1]:mb-3 [&_h1]:mt-6 [&_h1]:font-serif [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:tracking-tight",
  "[&_h2]:mb-2 [&_h2]:mt-6 [&_h2]:font-serif [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight",
  "[&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:font-serif [&_h3]:text-base [&_h3]:font-semibold",
  "[&_p]:my-3 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0",
  "[&_a]:font-medium [&_a]:text-gold [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-gold/80",
  "[&_ul]:my-3 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6",
  "[&_ol]:my-3 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-6",
  "[&_blockquote]:my-4 [&_blockquote]:border-l-2 [&_blockquote]:border-l-gold [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground",
  "[&_code]:rounded-md [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-xs",
  "[&_pre]:scrollbar-thin [&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:bg-muted/50 [&_pre]:p-4 [&_pre>code]:bg-transparent [&_pre>code]:p-0",
  "[&_hr]:my-6 [&_hr]:border-border",
  "[&_strong]:font-semibold [&_em]:italic"
)

export interface RichTextProps extends React.ComponentProps<"div"> {
  /** Trusted HTML string (sanitize upstream if it comes from users) */
  html: string
}

function RichText({ html, className, ...props }: RichTextProps) {
  return (
    <div
      data-slot="rich-text"
      className={cn(richTextStyles, className)}
      dangerouslySetInnerHTML={{ __html: html }}
      {...props}
    />
  )
}

export interface RichTextClampedProps extends React.ComponentProps<"div"> {
  html: string
  /** Number of visible lines while collapsed (default 4) */
  lines?: number
}

function RichTextClamped({
  html,
  lines = 4,
  className,
  ...props
}: RichTextClampedProps) {
  const [expanded, setExpanded] = React.useState(false)

  return (
    <div data-slot="rich-text-clamped" className={className} {...props}>
      <div
        style={
          expanded
            ? undefined
            : {
                display: "-webkit-box",
                WebkitLineClamp: lines,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }
        }
      >
        <RichText html={html} />
      </div>
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        aria-expanded={expanded}
        className="text-gold hover:text-gold/80 mt-2 inline-flex cursor-pointer items-center gap-1 text-sm font-medium transition-colors"
      >
        {expanded ? "Show less" : "Read more"}
        <ChevronDown
          aria-hidden="true"
          className={cn("size-3.5 transition-transform duration-200", expanded && "rotate-180")}
        />
      </button>
    </div>
  )
}

export { RichText, RichTextClamped }
