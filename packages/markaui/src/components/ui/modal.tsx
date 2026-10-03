"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"

import { cn } from "../../lib/utils"
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "./dialog"

const modalSizeClasses = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-lg",
  xl: "sm:max-w-4xl",
} as const

export type ModalSize = keyof typeof modalSizeClasses

export interface ModalProps
  extends Omit<React.ComponentProps<typeof Dialog>, "children"> {
  /** Heading rendered in a serif face at the top of the modal */
  title?: React.ReactNode
  /** Muted supporting line under the title */
  description?: React.ReactNode
  /** Body content between the header and footer */
  children?: React.ReactNode
  /** Sticky footer area, typically action buttons */
  footer?: React.ReactNode
  /** Max width preset of the panel */
  size?: ModalSize
  /** Hide the top-right close button */
  hideClose?: boolean
  /** Extra classes for the panel surface */
  className?: string
}

function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = "md",
  hideClose = false,
  className,
  ...props
}: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} {...props}>
      <DialogPortal>
        <DialogOverlay className="bg-black/60 backdrop-blur-sm" />
        <DialogPrimitive.Content
          data-slot="modal-content"
          className={cn(
            "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 flex w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] flex-col gap-4 overflow-hidden rounded-2xl border border-gold/40 p-6 shadow-xl duration-200",
            modalSizeClasses[size],
            className
          )}
        >
          {(title || description) && (
            <div
              data-slot="modal-header"
              className="flex flex-col gap-1.5 pr-8 text-left"
            >
              {title ? (
                <DialogTitle className="font-serif text-xl font-semibold tracking-tight text-foreground">
                  {title}
                </DialogTitle>
              ) : null}
              {description ? (
                <DialogDescription className="text-sm text-muted-foreground">
                  {description}
                </DialogDescription>
              ) : (
                // Keep the aria-describedby wiring valid when no description
                // is provided (also silences the Radix dev warning).
                <DialogDescription className="sr-only">{title}</DialogDescription>
              )}
            </div>
          )}
          {!title && (
            <>
              <DialogTitle className="sr-only">Dialog</DialogTitle>
              <DialogDescription className="sr-only">Dialog</DialogDescription>
            </>
          )}
          <div
            aria-hidden="true"
            data-slot="modal-divider"
            className="h-px w-full bg-gradient-to-r from-transparent via-gold/50 to-transparent"
          />
          {children}
          {footer ? (
            <div
              data-slot="modal-footer"
              className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end"
            >
              {footer}
            </div>
          ) : null}
          {!hideClose && (
            <DialogClose
              data-slot="modal-close"
              className="text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute top-4 right-4 rounded-full p-1.5 opacity-80 transition-all duration-200 hover:opacity-100 focus-visible:ring-[3px] focus-visible:outline-none disabled:pointer-events-none cursor-pointer [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
            >
              <XIcon aria-hidden="true" />
              <span className="sr-only">Close</span>
            </DialogClose>
          )}
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  )
}

/** Scrollable body region for long modal content */
function ModalBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="modal-body"
      className={cn(
        "min-h-0 flex-1 overflow-y-auto text-sm scrollbar-thin",
        className
      )}
      {...props}
    />
  )
}

/** Right-aligned action row for the modal footer */
function ModalFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="modal-footer"
      className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  )
}

export { Modal, ModalBody, ModalFooter }
