"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import {
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  RotateCcw,
  XIcon,
} from "lucide-react"

import { cn } from "../../lib/utils"
import {
  Dialog,
  DialogClose,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "./dialog"
import { IconButton } from "./icon-button"

export interface LightboxImage {
  src: string
  alt?: string
}

export interface LightboxProps {
  /** One or more images to browse; prev/next appear when there are 2+ */
  images: LightboxImage[]
  /** Thumbnail element rendered as the open trigger */
  children: React.ReactNode
  /** Caption displayed under the active image */
  caption?: React.ReactNode
  /** Accessible label announced by the viewer (visually hidden title) */
  label?: string
  /** Controlled open state */
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** Extra classes for the thumbnail trigger wrapper */
  className?: string
}

const MIN_SCALE = 1
const MAX_SCALE = 4
const ZOOM_STEP = 0.5

function clampScale(next: number) {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, next))
}

function Lightbox({
  images,
  children,
  caption,
  label = "Image viewer",
  open: controlledOpen,
  onOpenChange,
  className,
}: LightboxProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)
  const [index, setIndex] = React.useState(0)
  const [scale, setScale] = React.useState(MIN_SCALE)

  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : uncontrolledOpen
  const count = images.length
  const hasMultiple = count > 1
  const current = images[index] ?? images[0]

  const handleOpenChange = (next: boolean) => {
    if (!isControlled) setUncontrolledOpen(next)
    onOpenChange?.(next)
  }

  const goTo = (next: number) => {
    setIndex(next)
    setScale(MIN_SCALE)
  }

  // Reset zoom whenever the viewer is (re)opened
  React.useEffect(() => {
    if (open) setScale(MIN_SCALE)
  }, [open])

  // Keep index in range if the image list shrinks
  React.useEffect(() => {
    setIndex((i) => (i >= count ? 0 : i))
  }, [count])

  // Arrow-key navigation while open (Escape is handled by the underlying Dialog)
  React.useEffect(() => {
    if (!open || !hasMultiple) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        setIndex((i) => (i - 1 + count) % count)
        setScale(MIN_SCALE)
      }
      if (event.key === "ArrowRight") {
        setIndex((i) => (i + 1) % count)
        setScale(MIN_SCALE)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open, hasMultiple, count])

  if (count === 0) {
    return <span className={cn("inline-block", className)}>{children}</span>
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <span
          data-slot="lightbox-trigger"
          className={cn("inline-block cursor-zoom-in", className)}
        >
          {children}
        </span>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay className="bg-black/90 backdrop-blur-sm" />
        <DialogPrimitive.Content
          data-slot="lightbox-content"
          className="bg-black/95 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 flex flex-col duration-200"
        >
          <DialogTitle className="sr-only">{label}</DialogTitle>

          <div
            data-slot="lightbox-topbar"
            className="flex items-center justify-between gap-3 p-4 text-white"
          >
            <span className="text-xs font-medium tracking-wide text-white/70">
              {hasMultiple ? `${index + 1} / ${count}` : ""}
            </span>
            <DialogClose className="rounded-full p-2 text-white/80 transition-all duration-200 hover:bg-white/10 hover:text-white focus-visible:ring-white/40 focus-visible:ring-[3px] focus-visible:outline-none cursor-pointer [&_svg]:size-5">
              <XIcon aria-hidden="true" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </div>

          <div
            data-slot="lightbox-stage"
            className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-16"
          >
            {hasMultiple && (
              <IconButton
                variant="secondary"
                shape="circle"
                size="lg"
                aria-label="Previous image"
                onClick={() => goTo((index - 1 + count) % count)}
                className="absolute left-4 z-10 border-0 bg-white/10 text-white hover:bg-white/20"
              >
                <ChevronLeft className="size-5" aria-hidden="true" />
              </IconButton>
            )}
            {current ? (
               
              <img
                key={current.src}
                src={current.src}
                alt={current.alt ?? ""}
                draggable={false}
                onClick={() => setScale((s) => (s === MIN_SCALE ? 2 : MIN_SCALE))}
                style={{ transform: `scale(${scale})` }}
                className={cn(
                  "max-h-full max-w-full select-none object-contain transition-transform duration-300 ease-out",
                  scale === MIN_SCALE ? "cursor-zoom-in" : "cursor-zoom-out"
                )}
              />
            ) : null}
            {hasMultiple && (
              <IconButton
                variant="secondary"
                shape="circle"
                size="lg"
                aria-label="Next image"
                onClick={() => goTo((index + 1) % count)}
                className="absolute right-4 z-10 border-0 bg-white/10 text-white hover:bg-white/20"
              >
                <ChevronRight className="size-5" aria-hidden="true" />
              </IconButton>
            )}
          </div>

          {caption ? (
            <p
              data-slot="lightbox-caption"
              className="px-6 pb-1 text-center text-sm text-white/80"
            >
              {caption}
            </p>
          ) : null}

          <div
            data-slot="lightbox-controls"
            className="flex items-center justify-center gap-2 p-4"
          >
            <IconButton
              variant="secondary"
              size="sm"
              shape="circle"
              aria-label="Zoom out"
              disabled={scale <= MIN_SCALE}
              onClick={() => setScale((s) => clampScale(s - ZOOM_STEP))}
              className="border-0 bg-white/10 text-white hover:bg-white/20"
            >
              <Minus aria-hidden="true" />
            </IconButton>
            <span className="w-12 text-center text-xs text-white/70">
              {Math.round(scale * 100)}%
            </span>
            <IconButton
              variant="secondary"
              size="sm"
              shape="circle"
              aria-label="Zoom in"
              disabled={scale >= MAX_SCALE}
              onClick={() => setScale((s) => clampScale(s + ZOOM_STEP))}
              className="border-0 bg-white/10 text-white hover:bg-white/20"
            >
              <Plus aria-hidden="true" />
            </IconButton>
            <IconButton
              variant="secondary"
              size="sm"
              shape="circle"
              aria-label="Reset zoom"
              disabled={scale === MIN_SCALE}
              onClick={() => setScale(MIN_SCALE)}
              className="border-0 bg-white/10 text-white hover:bg-white/20"
            >
              <RotateCcw aria-hidden="true" />
            </IconButton>
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  )
}

export { Lightbox }
