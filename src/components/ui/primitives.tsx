import * as React from "react"

import { cn } from "@/lib/utils"

/* ------------------------------------------------------------------ */
/* Shared maps (literal class strings so Tailwind can scan them)       */
/* ------------------------------------------------------------------ */

type StackGap = "none" | "sm" | "default" | "lg" | "xl"

const stackGaps: Record<StackGap, string> = {
  none: "gap-0",
  sm: "gap-2",
  default: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
}

const aligns = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline",
} as const

const justifies = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
} as const

/* ------------------------------------------------------------------ */
/* Container                                                           */
/* ------------------------------------------------------------------ */

function Container({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="container"
      className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}
      {...props}
    />
  )
}

/* ------------------------------------------------------------------ */
/* Stack / HStack / VStack                                             */
/* ------------------------------------------------------------------ */

interface StackProps extends React.ComponentProps<"div"> {
  direction?: "row" | "col"
  gap?: StackGap
  align?: keyof typeof aligns
  justify?: keyof typeof justifies
  wrap?: boolean
}

function Stack({
  direction = "col",
  gap = "default",
  align,
  justify,
  wrap,
  className,
  ...props
}: StackProps) {
  return (
    <div
      data-slot="stack"
      className={cn(
        "flex",
        direction === "row" ? "flex-row" : "flex-col",
        stackGaps[gap],
        align && aligns[align],
        justify && justifies[justify],
        wrap && "flex-wrap",
        className
      )}
      {...props}
    />
  )
}

function HStack(props: Omit<StackProps, "direction">) {
  return <Stack direction="row" {...props} />
}

function VStack(props: Omit<StackProps, "direction">) {
  return <Stack direction="col" {...props} />
}

/* ------------------------------------------------------------------ */
/* Grid                                                                */
/* ------------------------------------------------------------------ */

const gridCols = {
  1: { base: "grid-cols-1", sm: "sm:grid-cols-1", md: "md:grid-cols-1", lg: "lg:grid-cols-1" },
  2: { base: "grid-cols-2", sm: "sm:grid-cols-2", md: "md:grid-cols-2", lg: "lg:grid-cols-2" },
  3: { base: "grid-cols-3", sm: "sm:grid-cols-3", md: "md:grid-cols-3", lg: "lg:grid-cols-3" },
  4: { base: "grid-cols-4", sm: "sm:grid-cols-4", md: "md:grid-cols-4", lg: "lg:grid-cols-4" },
  5: { base: "grid-cols-5", sm: "sm:grid-cols-5", md: "md:grid-cols-5", lg: "lg:grid-cols-5" },
  6: { base: "grid-cols-6", sm: "sm:grid-cols-6", md: "md:grid-cols-6", lg: "lg:grid-cols-6" },
} as const

type GridCols = keyof typeof gridCols

interface GridProps extends React.ComponentProps<"div"> {
  cols?: GridCols
  smCols?: GridCols
  mdCols?: GridCols
  lgCols?: GridCols
  gap?: StackGap
}

function Grid({
  cols = 1,
  smCols,
  mdCols,
  lgCols,
  gap = "default",
  className,
  ...props
}: GridProps) {
  return (
    <div
      data-slot="grid"
      className={cn(
        "grid",
        gridCols[cols].base,
        smCols && gridCols[smCols].sm,
        mdCols && gridCols[mdCols].md,
        lgCols && gridCols[lgCols].lg,
        stackGaps[gap],
        className
      )}
      {...props}
    />
  )
}

/* ------------------------------------------------------------------ */
/* Flex                                                                */
/* ------------------------------------------------------------------ */

const flexDirections = {
  row: "flex-row",
  col: "flex-col",
  "row-reverse": "flex-row-reverse",
  "col-reverse": "flex-col-reverse",
} as const

interface FlexProps extends React.ComponentProps<"div"> {
  direction?: keyof typeof flexDirections
  align?: keyof typeof aligns
  justify?: keyof typeof justifies
  wrap?: boolean
  gap?: StackGap
}

function Flex({
  direction = "row",
  align,
  justify,
  wrap,
  gap = "default",
  className,
  ...props
}: FlexProps) {
  return (
    <div
      data-slot="flex"
      className={cn(
        "flex",
        flexDirections[direction],
        stackGaps[gap],
        align && aligns[align],
        justify && justifies[justify],
        wrap && "flex-wrap",
        className
      )}
      {...props}
    />
  )
}

/* ------------------------------------------------------------------ */
/* Box                                                                 */
/* ------------------------------------------------------------------ */

function Box({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="box" className={cn(className)} {...props} />
}

/* ------------------------------------------------------------------ */
/* Spacer                                                              */
/* ------------------------------------------------------------------ */

function Spacer({
  size,
  className,
  ...props
}: React.ComponentProps<"div"> & { size?: number | string }) {
  return (
    <div
      data-slot="spacer"
      aria-hidden="true"
      className={cn("shrink-0", !size && "flex-1", className)}
      style={size !== undefined ? { flexBasis: size } : undefined}
      {...props}
    />
  )
}

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

const sectionPadding = {
  none: "py-0",
  sm: "py-8 sm:py-10",
  default: "py-12 sm:py-16",
  lg: "py-16 sm:py-24",
} as const

interface SectionProps extends Omit<React.ComponentProps<"section">, "title"> {
  title?: React.ReactNode
  subtitle?: React.ReactNode
  padding?: keyof typeof sectionPadding
}

function Section({
  title,
  subtitle,
  padding = "default",
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      data-slot="section"
      className={cn(sectionPadding[padding], className)}
      {...props}
    >
      {(title || subtitle) && (
        <div className="mx-auto mb-10 max-w-2xl text-center">
          {title && (
            <h2 className="font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

function Content({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="content"
      className={cn("mx-auto w-full max-w-3xl", className)}
      {...props}
    />
  )
}

/* ------------------------------------------------------------------ */
/* List / ListItem                                                     */
/* ------------------------------------------------------------------ */

interface ListProps extends React.ComponentProps<"ul"> {
  variant?: "divide" | "card"
  hoverable?: boolean
}

function List({ variant = "divide", hoverable, className, ...props }: ListProps) {
  return (
    <ul
      data-slot="list"
      className={cn(
        "text-sm",
        variant === "divide" && "divide-y divide-border",
        variant === "card" &&
          "space-y-2 [&_[data-slot=list-item]]:rounded-xl [&_[data-slot=list-item]]:border [&_[data-slot=list-item]]:bg-card [&_[data-slot=list-item]]:shadow-sm",
        hoverable &&
          "[&_[data-slot=list-item]]:transition-colors [&_[data-slot=list-item]]:duration-200 [&_[data-slot=list-item]:hover]:bg-accent/50",
        className
      )}
      {...props}
    />
  )
}

interface ListItemProps extends Omit<React.ComponentProps<"li">, "title"> {
  icon?: React.ReactNode
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
}

function ListItem({
  icon,
  title,
  description,
  action,
  className,
  children,
  ...props
}: ListItemProps) {
  return (
    <li
      data-slot="list-item"
      className={cn("flex items-center gap-3 px-2 py-3", className)}
      {...props}
    >
      {icon && (
        <span className="shrink-0 text-muted-foreground [&_svg]:size-5">{icon}</span>
      )}
      <div className="min-w-0 flex-1">
        {title && <p className="truncate text-sm font-medium text-foreground">{title}</p>}
        {description && (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">{description}</p>
        )}
        {children}
      </div>
      {action && <span className="shrink-0">{action}</span>}
    </li>
  )
}

export {
  Box,
  Container,
  Content,
  Flex,
  Grid,
  HStack,
  List,
  ListItem,
  Section,
  Spacer,
  Stack,
  VStack,
}
