"use client"

import * as React from "react"
import { GripVertical } from "lucide-react"

import { cn } from "@/lib/utils"

export interface SplitPaneProps extends React.ComponentProps<"div"> {
  /** Content of the left panel */
  left: React.ReactNode
  /** Content of the right panel */
  right: React.ReactNode
  /** Controlled split percentage (width of the left panel, 0-100) */
  percent?: number
  /** Uncontrolled initial percentage (default 50) */
  defaultPercent?: number
  /** Minimum percentage for the left panel (default 20) */
  minPercent?: number
  /** Maximum percentage for the left panel (default 80) */
  maxPercent?: number
  /** Called while dragging / arrow-keying the divider */
  onPercentChange?: (percent: number) => void
}

function SplitPane({
  left,
  right,
  percent: controlledPercent,
  defaultPercent = 50,
  minPercent = 20,
  maxPercent = 80,
  onPercentChange,
  className,
  ...props
}: SplitPaneProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const [internalPercent, setInternalPercent] = React.useState(defaultPercent)
  const [dragging, setDragging] = React.useState(false)

  const clamp = React.useCallback(
    (value: number) => Math.min(maxPercent, Math.max(minPercent, value)),
    [minPercent, maxPercent]
  )

  const currentPercent = clamp(controlledPercent ?? internalPercent)

  const applyPercent = React.useCallback(
    (value: number) => {
      const next = clamp(value)
      if (controlledPercent === undefined) setInternalPercent(next)
      onPercentChange?.(next)
    },
    [clamp, controlledPercent, onPercentChange]
  )

  const updateFromPointer = React.useCallback(
    (clientX: number) => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect || rect.width === 0) return
      applyPercent(((clientX - rect.left) / rect.width) * 100)
    },
    [applyPercent]
  )

  React.useEffect(() => {
    if (!dragging) return
    const onPointerMove = (event: PointerEvent) => updateFromPointer(event.clientX)
    const onPointerUp = () => setDragging(false)
    window.addEventListener("pointermove", onPointerMove)
    window.addEventListener("pointerup", onPointerUp)
    return () => {
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("pointerup", onPointerUp)
    }
  }, [dragging, updateFromPointer])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? 10 : 2
    if (event.key === "ArrowLeft") {
      event.preventDefault()
      applyPercent(currentPercent - step)
    } else if (event.key === "ArrowRight") {
      event.preventDefault()
      applyPercent(currentPercent + step)
    }
  }

  return (
    <div
      ref={containerRef}
      data-slot="split-pane"
      className={cn("flex w-full overflow-hidden", className)}
      {...props}
    >
      <div
        data-slot="split-pane-left"
        style={{ width: currentPercent + "%" }}
        className="min-w-0 overflow-hidden"
      >
        {left}
      </div>
      <div
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize panes"
        aria-valuenow={Math.round(currentPercent)}
        aria-valuemin={minPercent}
        aria-valuemax={maxPercent}
        tabIndex={0}
        data-dragging={dragging || undefined}
        onPointerDown={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onKeyDown={handleKeyDown}
        className={cn(
          "group relative w-px shrink-0 cursor-col-resize touch-none bg-border transition-colors outline-none",
          "after:absolute after:inset-y-0 after:-left-1.5 after:-right-1.5 after:content-['']",
          "focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:ring-inset",
          dragging ? "bg-gold" : "hover:bg-gold/60"
        )}
      >
        <span className="bg-background text-muted-foreground border-border pointer-events-none absolute top-1/2 left-1/2 flex h-7 w-3.5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-md border shadow-xs opacity-0 transition-opacity duration-200 group-focus-visible:opacity-100 group-hover:opacity-100">
          <GripVertical aria-hidden="true" className="size-3" />
        </span>
      </div>
      <div data-slot="split-pane-right" className="min-w-0 flex-1 overflow-hidden">
        {right}
      </div>
    </div>
  )
}

export { SplitPane }
