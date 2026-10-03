"use client"

import * as React from "react"
import { cva } from "class-variance-authority"
import { HelpCircle, Loader2, TriangleAlert } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export type ConfirmDialogTone = "default" | "destructive" | "gold"

const confirmDialogToneIconVariants = cva(
  "mt-0.5 flex size-11 shrink-0 items-center justify-center rounded-full [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      tone: {
        default: "bg-primary/10 text-primary",
        destructive: "bg-destructive/10 text-destructive",
        gold: "bg-gold/15 text-gold-foreground dark:bg-gold/20 dark:text-gold",
      },
    },
    defaultVariants: {
      tone: "default",
    },
  }
)

const toneActionVariants = cva("", {
  variants: {
    tone: {
      default: "",
      destructive:
        "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60",
      gold: "bg-gold-strong text-gold-ink hover:brightness-95",
    },
  },
  defaultVariants: {
    tone: "default",
  },
})

export interface ConfirmDialogProps {
  /** Element that opens the dialog when clicked */
  trigger: React.ReactNode
  /** Heading of the confirmation */
  title: React.ReactNode
  /** Supporting copy explaining the consequence */
  description?: React.ReactNode
  /** Label of the confirming action */
  confirmText?: string
  /** Label of the dismissing action */
  cancelText?: string
  /** Visual tone — selects icon and confirm button styling */
  tone?: ConfirmDialogTone
  /** Controlled pending state; the dialog also tracks a promise-based onConfirm internally */
  loading?: boolean
  /** May be async — the dialog stays open with a spinner until it resolves, then closes */
  onConfirm?: () => void | Promise<void>
  /** Controlled open state */
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** Extra classes for the dialog panel */
  className?: string
}

function ConfirmDialog({
  trigger,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  tone = "default",
  loading,
  onConfirm,
  open: controlledOpen,
  onOpenChange,
  className,
}: ConfirmDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)
  const [internalPending, setInternalPending] = React.useState(false)

  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : uncontrolledOpen
  const pending = loading ?? internalPending

  const ToneIcon = tone === "default" ? HelpCircle : TriangleAlert

  const handleOpenChange = (next: boolean) => {
    if (!isControlled) setUncontrolledOpen(next)
    onOpenChange?.(next)
  }

  const handleConfirm = async (event: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent Radix from closing immediately so the promise can resolve while open
    event.preventDefault()
    try {
      setInternalPending(true)
      await onConfirm?.()
    } finally {
      setInternalPending(false)
      handleOpenChange(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent
        className={cn("max-w-md gap-5 rounded-2xl", className)}
      >
        <div className="flex items-start gap-4">
          <span
            data-slot="confirm-dialog-icon"
            className={confirmDialogToneIconVariants({ tone })}
          >
            <ToneIcon aria-hidden="true" />
          </span>
          <AlertDialogHeader className="gap-1.5 text-left">
            <AlertDialogTitle className="font-serif text-lg font-semibold tracking-tight">
              {title}
            </AlertDialogTitle>
            {description ? (
              <AlertDialogDescription>{description}</AlertDialogDescription>
            ) : null}
          </AlertDialogHeader>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending} className="cursor-pointer">
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={pending}
            aria-busy={pending || undefined}
            className={cn(toneActionVariants({ tone }), "cursor-pointer")}
          >
            {pending && (
              <Loader2
                className="size-4 animate-spin"
                aria-hidden="true"
              />
            )}
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export { ConfirmDialog, confirmDialogToneIconVariants }
