"use client"

import * as React from "react"

import { cn } from "../../lib/utils"
import { Input } from "./input"

/* ------------------------------------------------------------------ types */

export interface TerminalProps extends React.ComponentProps<"div"> {
  /** Initial output lines (rendered as plain output) */
  lines?: string[]
  /** Hook fired with every submitted command (before the built-ins run) */
  onCommand?: (command: string) => void
  /** Title shown in the window chrome */
  title?: string
  /** Scrollable viewport height in px */
  maxHeight?: number
}

interface TermLine {
  id: number
  kind: "input" | "output" | "error"
  text: string
}

const HELP_LINES = [
  "Available commands:",
  "  help     Show this help",
  "  clear    Clear the terminal",
  "  echo     Print text — try: echo Shubh Vivah",
  "  date     Print the current date and time",
]

/* ------------------------------------------------------------- component */

function Terminal({
  lines = [],
  onCommand,
  title = "saptapadi — matchmaker@studio",
  maxHeight,
  className,
  ...props
}: TerminalProps) {
  const [output, setOutput] = React.useState<TermLine[]>(() =>
    lines.map((text, index) => ({ id: index, kind: "output" as const, text }))
  )
  const [draft, setDraft] = React.useState("")
  const idRef = React.useRef(output.length)
  const historyRef = React.useRef<string[]>([])
  const [historyIndex, setHistoryIndex] = React.useState<number | null>(null)
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [output])

  const pushLines = React.useCallback((added: TermLine[]) => {
    setOutput((prev) => [...prev, ...added])
  }, [])

  const runCommand = React.useCallback(
    (raw: string) => {
      const command = raw.trim()
      const added: TermLine[] = []
      const push = (kind: TermLine["kind"], text: string) => {
        added.push({ id: idRef.current++, kind, text })
      }
      push("input", command)

      if (command !== "") {
        if (onCommand) onCommand(command)
        const parts = command.split(/\s+/)
        const name = parts[0].toLowerCase()
        const args = parts.slice(1)
        switch (name) {
          case "help":
            for (const line of HELP_LINES) push("output", line)
            break
          case "clear":
            setOutput([])
            return
          case "echo":
            push("output", args.join(" "))
            break
          case "date":
            push("output", new Date().toString())
            break
          default:
            push("error", "command not found: " + name + " — try help")
        }
      }
      pushLines(added)
    },
    [onCommand, pushLines]
  )

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (draft.trim() !== "") {
      historyRef.current.push(draft)
    }
    setHistoryIndex(null)
    runCommand(draft)
    setDraft("")
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const history = historyRef.current
    if (event.key === "ArrowUp") {
      if (history.length === 0) return
      event.preventDefault()
      const next =
        historyIndex === null
          ? history.length - 1
          : Math.max(0, historyIndex - 1)
      setDraft(history[next])
      setHistoryIndex(next)
    } else if (event.key === "ArrowDown") {
      if (historyIndex === null) return
      event.preventDefault()
      const next = historyIndex + 1
      if (next >= history.length) {
        setDraft("")
        setHistoryIndex(null)
      } else {
        setDraft(history[next])
        setHistoryIndex(next)
      }
    }
  }

  return (
    // The .dark wrapper re-scopes design tokens so the surface always renders dark
    <div
      data-slot="terminal"
      className={cn(
        "dark overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm",
        className
      )}
      onClick={() => inputRef.current?.focus()}
      {...props}
    >
      {/* window chrome */}
      <div className="flex items-center gap-2 border-b bg-muted/40 px-4 py-2.5">
        <span className="size-3 rounded-full bg-destructive" aria-hidden="true" />
        <span className="size-3 rounded-full bg-warning" aria-hidden="true" />
        <span className="size-3 rounded-full bg-success" aria-hidden="true" />
        <span className="ml-2 truncate font-mono text-xs text-muted-foreground">
          {title}
        </span>
      </div>

      {/* output */}
      <div
        ref={scrollRef}
        className="scrollbar-thin overflow-auto px-4 pt-2 pb-1 font-mono text-xs leading-5"
        style={maxHeight !== undefined ? { maxHeight } : undefined}
      >
        {output.map((line) => (
          <div
            key={line.id}
            className={cn(
              "flex gap-2 whitespace-pre-wrap break-words",
              line.kind === "error" && "text-destructive",
              line.kind === "output" && "text-foreground/85"
            )}
          >
            {line.kind === "input" ? (
              <span className="shrink-0 font-semibold text-gold" aria-hidden="true">
                ❯
              </span>
            ) : (
              <span className="w-3 shrink-0" aria-hidden="true" />
            )}
            <span className={cn("min-w-0", line.kind === "input" && "font-medium text-foreground")}>
              {line.text === "" ? " " : line.text}
            </span>
          </div>
        ))}
      </div>

      {/* input row */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 px-4 py-2.5">
        <span
          className="shrink-0 font-mono text-sm font-semibold text-gold"
          aria-hidden="true"
        >
          ❯
        </span>
        <Input
          ref={inputRef}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a command — try help"
          aria-label="Terminal input"
          className="h-auto border-0 bg-transparent p-0 font-mono text-sm shadow-none focus-visible:ring-0 dark:bg-transparent"
          autoComplete="off"
          spellCheck={false}
        />
      </form>
    </div>
  )
}

export { Terminal }
