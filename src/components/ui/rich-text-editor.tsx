"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { IconButton } from "@/components/ui/icon-button"
import {
  Bold,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  Strikethrough,
  Underline,
  Undo2,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

/* ------------------------------------------------------------------ types */

/**
 * RichTextEditor (Beta) — a lightweight contentEditable editor driven by
 * document.execCommand. Good enough for bios and short notes, not a full
 * replacement for ProseMirror-based editors.
 */
export interface RichTextEditorProps
  extends Omit<React.ComponentProps<"div">, "value" | "defaultValue" | "onChange"> {
  /** Controlled HTML string */
  value?: string
  /** Initial HTML string for uncontrolled usage */
  defaultValue?: string
  onChange?: (html: string) => void
  placeholder?: string
}

interface ToolDef {
  icon: LucideIcon
  label: string
  command: string
  arg?: string
}

const TOOLS: ToolDef[] = [
  { icon: Bold, label: "Bold", command: "bold" },
  { icon: Italic, label: "Italic", command: "italic" },
  { icon: Underline, label: "Underline", command: "underline" },
  { icon: Strikethrough, label: "Strikethrough", command: "strikeThrough" },
  { icon: List, label: "Bullet list", command: "insertUnorderedList" },
  { icon: ListOrdered, label: "Numbered list", command: "insertOrderedList" },
  { icon: Quote, label: "Blockquote", command: "formatBlock", arg: "blockquote" },
  { icon: Link2, label: "Insert link", command: "createLink" },
  { icon: Undo2, label: "Undo", command: "undo" },
]

/* ------------------------------------------------------------- component */

function RichTextEditor({
  value,
  defaultValue = "",
  onChange,
  placeholder,
  className,
  ...props
}: RichTextEditorProps) {
  const editorRef = React.useRef<HTMLDivElement>(null)
  // Last HTML this component emitted or applied — used to detect external updates
  const lastHtmlRef = React.useRef(defaultValue)

  // Sync external value changes into the editable div without stomping the caret
  React.useEffect(() => {
    const el = editorRef.current
    if (!el) return
    const next = value ?? defaultValue
    if (next !== undefined && next !== el.innerHTML && next !== lastHtmlRef.current) {
      el.innerHTML = next
      lastHtmlRef.current = next
    }
  }, [value, defaultValue])

  const emit = React.useCallback(() => {
    const el = editorRef.current
    if (!el) return
    lastHtmlRef.current = el.innerHTML
    onChange?.(el.innerHTML)
  }, [onChange])

  const exec = React.useCallback(
    (command: string, arg?: string) => {
      if (command === "createLink") {
        const url = window.prompt("Link URL", "https://")
        if (!url) return
        document.execCommand(command, false, url)
        emit()
        return
      }
      document.execCommand(command, false, arg)
      emit()
    },
    [emit]
  )

  // Track active formats so toolbar buttons can show state
  const [active, setActive] = React.useState<Record<string, boolean>>({})
  React.useEffect(() => {
    const update = () => {
      try {
        setActive({
          bold: document.queryCommandState("bold"),
          italic: document.queryCommandState("italic"),
          underline: document.queryCommandState("underline"),
          strikeThrough: document.queryCommandState("strikeThrough"),
          insertUnorderedList: document.queryCommandState("insertUnorderedList"),
          insertOrderedList: document.queryCommandState("insertOrderedList"),
          formatBlock:
            document.queryCommandValue("formatBlock") === "blockquote",
        })
      } catch {
        // queryCommandState can throw in odd selection states — ignore
      }
    }
    document.addEventListener("selectionchange", update)
    return () => document.removeEventListener("selectionchange", update)
  }, [])

  return (
    <div
      data-slot="rich-text-editor"
      className={cn(
        "overflow-hidden rounded-xl border bg-card shadow-sm transition-[color,box-shadow] focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
        className
      )}
      {...props}
    >
      {/* toolbar — mousedown is prevented so the text selection survives clicks */}
      <div
        role="toolbar"
        aria-label="Formatting"
        onMouseDown={(event) => event.preventDefault()}
        className="flex flex-wrap items-center gap-0.5 border-b bg-muted/40 px-2 py-1.5"
      >
        {TOOLS.map((tool) => {
          const Icon = tool.icon
          return (
            <IconButton
              key={tool.label}
              variant={active[tool.command] ? "secondary" : "ghost"}
              size="sm"
              aria-label={tool.label}
              title={tool.label}
              onClick={() => exec(tool.command, tool.arg)}
            >
              <Icon />
            </IconButton>
          )
        })}
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        aria-label="Rich text editor"
        data-placeholder={placeholder}
        onInput={emit}
        onBlur={emit}
        className={cn(
          "scrollbar-thin max-h-96 min-h-32 overflow-y-auto px-4 py-3 text-sm leading-6 outline-none",
          "empty:before:pointer-events-none empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground",
          "[&_a]:font-medium [&_a]:text-primary [&_a]:underline",
          "[&_blockquote]:border-gold/60 [&_blockquote]:border-l-2 [&_blockquote]:pl-3 [&_blockquote]:text-muted-foreground [&_blockquote]:italic",
          "[&_h2]:font-serif [&_h3]:font-serif",
          "[&_li]:marker:text-muted-foreground",
          "[&_ol]:list-decimal [&_ol]:pl-5",
          "[&_strong]:font-semibold",
          "[&_ul]:list-disc [&_ul]:pl-5"
        )}
      />
    </div>
  )
}

export { RichTextEditor }
