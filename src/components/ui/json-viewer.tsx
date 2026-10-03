"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { IconButton } from "@/components/ui/icon-button"
import { Braces, Check, ChevronRight, Copy } from "lucide-react"

/* ------------------------------------------------------------------ types */

export interface JsonViewerProps extends React.ComponentProps<"div"> {
  data: unknown
  /** Header label, e.g. "profile.json" */
  label?: string
  /** Scrollable viewport height in px */
  maxHeight?: number
  /** Collapse branches at this depth or deeper on first render. 0 keeps everything expanded */
  defaultCollapsedDepth?: number
}

/* --------------------------------------------------------------- helpers */

function isBranch(value: unknown): value is Record<string, unknown> | unknown[] {
  return typeof value === "object" && value !== null
}

function collectInitialCollapsed(
  value: unknown,
  path: string,
  depth: number,
  maxDepth: number,
  acc: string[]
): void {
  if (depth > 12) return // safety valve against pathological input
  if (isBranch(value)) {
    if (depth >= maxDepth) acc.push(path)
    const entries = Array.isArray(value)
      ? value.map((entry, index) => [String(index), entry] as const)
      : Object.entries(value)
    for (const [key, child] of entries) {
      collectInitialCollapsed(child, path + "." + key, depth + 1, maxDepth, acc)
    }
  }
}

function PrimitiveValue({ value }: { value: unknown }) {
  if (value === null) {
    return <span className="text-muted-foreground italic">null</span>
  }
  switch (typeof value) {
    case "string":
      return (
        <span className="break-all text-success">
          &quot;{value}&quot;
        </span>
      )
    case "number":
      return <span className="text-gold">{String(value)}</span>
    case "boolean":
      return <span className="text-info">{String(value)}</span>
    default:
      return <span className="text-muted-foreground">{String(value)}</span>
  }
}

interface JsonNodeProps {
  name?: string
  value: unknown
  path: string
  depth: number
  isLast: boolean
  collapsed: Set<string>
  onToggle: (path: string) => void
}

function JsonNode({
  name,
  value,
  path,
  depth,
  isLast,
  collapsed,
  onToggle,
}: JsonNodeProps) {
  const branch = isBranch(value) && depth <= 16 // depth cap guards against cyclic data
  const isCollapsed = branch && collapsed.has(path)
  const entries = branch
    ? Array.isArray(value)
      ? value.map((entry, index) => [String(index), entry] as const)
      : Object.entries(value)
    : []

  const keyEl =
    name !== undefined ? (
      <>
        <span className="text-primary">{name}</span>
        <span className="text-muted-foreground">:&nbsp;</span>
      </>
    ) : null

  // Primitive (or collapsed-branch) leaf row
  if (!branch || isCollapsed) {
    return (
      <div className="flex items-start gap-1 py-0.5">
        <span aria-hidden="true" className="size-4 shrink-0" />
        {keyEl}
        {branch ? (
          <>
            <button
              type="button"
              onClick={() => onToggle(path)}
              aria-expanded={false}
              aria-label={"Expand " + (name ?? path)}
              className="flex cursor-pointer items-center gap-1.5 rounded text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <ChevronRight className="size-3.5" />
              <span className="font-mono text-xs">
                {Array.isArray(value) ? "[ … ]" : "{ … }"}
              </span>
            </button>
            <span className="text-[10px] text-muted-foreground/70">
              {entries.length + (Array.isArray(value) ? " items" : " keys")}
            </span>
          </>
        ) : (
          <span className="font-mono text-xs">
            <PrimitiveValue value={value} />
            {isLast ? "" : ","}
          </span>
        )}
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-start gap-1 py-0.5">
        <button
          type="button"
          onClick={() => onToggle(path)}
          aria-expanded={true}
          aria-label={"Collapse " + (name ?? path)}
          className="flex size-4 shrink-0 cursor-pointer items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <ChevronRight className="size-3.5 rotate-90 transition-transform duration-200" />
        </button>
        {keyEl}
        <span className="font-mono text-xs text-muted-foreground">
          {Array.isArray(value) ? "[" : "{"}
        </span>
        <span className="text-[10px] text-muted-foreground/70">
          {entries.length + (Array.isArray(value) ? " items" : " keys")}
        </span>
      </div>
      {/* indent guide */}
      <div className="ml-2 border-l border-border/60 pl-4">
        {entries.map(([key, child], index) => (
          <JsonNode
            key={key}
            name={key}
            value={child}
            path={path + "." + key}
            depth={depth + 1}
            isLast={index === entries.length - 1}
            collapsed={collapsed}
            onToggle={onToggle}
          />
        ))}
        <div className="py-0.5 font-mono text-xs text-muted-foreground">
          {Array.isArray(value) ? "]" : "}"}
          {isLast ? "" : ","}
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------- component */

function JsonViewer({
  data,
  label = "data.json",
  maxHeight,
  defaultCollapsedDepth = 0,
  className,
  ...props
}: JsonViewerProps) {
  const [collapsed, setCollapsed] = React.useState<Set<string>>(() => {
    const acc: string[] = []
    collectInitialCollapsed(data, "root", 0, defaultCollapsedDepth, acc)
    return new Set(acc)
  })

  const toggle = React.useCallback((path: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev)
      if (next.has(path)) {
        next.delete(path)
      } else {
        next.add(path)
      }
      return next
    })
  }, [])

  const [copied, setCopied] = React.useState(false)
  const copy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2))
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard unavailable — no-op
    }
  }, [data])

  return (
    <div
      data-slot="json-viewer"
      className={cn(
        "overflow-hidden rounded-xl border bg-card shadow-sm",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between gap-2 border-b bg-muted/40 px-3 py-2">
        <span className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground">
          <Braces className="size-3.5 text-gold" aria-hidden="true" />
          {label}
        </span>
        <IconButton
          variant="ghost"
          size="xs"
          aria-label={copied ? "Copied" : "Copy JSON"}
          onClick={copy}
        >
          {copied ? (
            <Check className="text-success" />
          ) : (
            <Copy />
          )}
        </IconButton>
      </div>
      <div
        className="scrollbar-thin overflow-auto p-3 font-mono text-xs leading-5"
        style={maxHeight !== undefined ? { maxHeight } : undefined}
      >
        <JsonNode
          value={data}
          path="root"
          depth={0}
          isLast
          collapsed={collapsed}
          onToggle={toggle}
        />
      </div>
    </div>
  )
}

export { JsonViewer }
