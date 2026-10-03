"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { FileCode2 } from "lucide-react"

/* ------------------------------------------------------------------ types */

export interface CodeEditorProps
  extends Omit<React.ComponentProps<"div">, "value" | "defaultValue" | "onChange"> {
  /** Controlled code string */
  value?: string
  /** Initial code string for uncontrolled usage */
  defaultValue?: string
  onChange?: (value: string) => void
  /** Language chip rendered in the header, e.g. "TypeScript" */
  language?: string
  /** Always show at least this many lines */
  minLines?: number
  /** Clamp the viewport to this many lines and scroll internally */
  maxLines?: number
}

const LINE_HEIGHT_PX = 20 // leading-5
const PAD_Y_PX = 12 // py-3

/* ------------------------------------------------------------- component */

function CodeEditor({
  value,
  defaultValue = "",
  onChange,
  language,
  minLines = 10,
  maxLines,
  className,
  ...props
}: CodeEditorProps) {
  const [inner, setInner] = React.useState(defaultValue)
  const isControlled = value !== undefined
  const current = isControlled ? value : inner
  const lines = current.split("\n")

  const [scrollTop, setScrollTop] = React.useState(0)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const pendingCaretRef = React.useRef<number | null>(null)

  const lineCount = Math.max(lines.length, minLines)
  const contentHeight = lineCount * LINE_HEIGHT_PX + PAD_Y_PX * 2
  const viewportHeight = maxLines
    ? Math.min(contentHeight, maxLines * LINE_HEIGHT_PX + PAD_Y_PX * 2)
    : contentHeight

  // Restore caret after controlled updates (e.g. Tab insertion)
  React.useEffect(() => {
    if (pendingCaretRef.current !== null && textareaRef.current) {
      textareaRef.current.selectionStart = pendingCaretRef.current
      textareaRef.current.selectionEnd = pendingCaretRef.current
      pendingCaretRef.current = null
    }
  })

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isControlled) setInner(event.target.value)
    onChange?.(event.target.value)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Tab") return
    event.preventDefault()
    const el = event.currentTarget
    const start = el.selectionStart
    const end = el.selectionEnd
    const next = current.slice(0, start) + "  " + current.slice(end)
    pendingCaretRef.current = start + 2
    if (!isControlled) setInner(next)
    onChange?.(next)
  }

  return (
    <div
      data-slot="code-editor"
      className={cn(
        "overflow-hidden rounded-xl border bg-card shadow-sm transition-[color,box-shadow] focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
        className
      )}
      {...props}
    >
      {/* header */}
      <div className="flex items-center justify-between gap-2 border-b bg-muted/40 px-3 py-2">
        <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
          <FileCode2 className="size-3.5 text-gold" aria-hidden="true" />
          <span className="font-medium">Source</span>
        </span>
        {language ? <Badge variant="gold">{language}</Badge> : null}
      </div>

      {/* editor surface */}
      <div className="flex" style={{ height: viewportHeight }}>
        <div
          aria-hidden="true"
          className="w-11 shrink-0 overflow-hidden border-r bg-muted/20 text-right font-mono text-sm leading-5 text-muted-foreground/70 select-none"
        >
          <div
            style={{
              transform: "translateY(-" + scrollTop + "px)",
              paddingTop: PAD_Y_PX,
              paddingBottom: PAD_Y_PX,
            }}
          >
            {lines.map((_, index) => (
              <div key={index} className="pr-2.5">
                {index + 1}
              </div>
            ))}
          </div>
        </div>
        <textarea
          ref={textareaRef}
          value={current}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
          spellCheck={false}
          wrap="off"
          aria-label="Code editor"
          className="scrollbar-thin min-w-0 flex-1 resize-none bg-transparent py-3 pr-4 pl-3 font-mono text-sm leading-5 text-foreground caret-primary outline-none selection:bg-primary selection:text-primary-foreground"
        />
      </div>

      {/* footer */}
      <div className="flex items-center justify-between gap-2 border-t bg-muted/30 px-3 py-1.5 font-mono text-[10px] text-muted-foreground">
        <span>{lines.length} lines</span>
        <span>Tab inserts 2 spaces</span>
      </div>
    </div>
  )
}

export { CodeEditor }
