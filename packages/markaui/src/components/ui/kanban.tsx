"use client"

import * as React from "react"

import { cn } from "../../lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import { Badge } from "./badge"
import { CalendarClock, GripVertical } from "lucide-react"

/* ------------------------------------------------------------------ types */

export type KanbanPriority = "low" | "medium" | "high"

export type KanbanTone =
  | "primary"
  | "gold"
  | "success"
  | "info"
  | "warning"
  | "destructive"

export interface KanbanCardData {
  id: string
  title: string
  description?: string
  tag?: string
  avatar?: string
  priority?: KanbanPriority
  dueDate?: string
}

export interface KanbanColumnData {
  id: string
  title: string
  tone?: KanbanTone
  cards: KanbanCardData[]
}

/* --------------------------------------------------------------- mappings */

const toneDotClasses: Record<KanbanTone, string> = {
  primary: "bg-primary",
  gold: "bg-gold",
  success: "bg-success",
  info: "bg-info",
  warning: "bg-warning",
  destructive: "bg-destructive",
}

const priorityStyles: Record<
  KanbanPriority,
  { label: string; variant: "secondary" | "warning" | "destructive" }
> = {
  low: { label: "Low", variant: "secondary" },
  medium: { label: "Medium", variant: "warning" },
  high: { label: "High", variant: "destructive" },
}

const DRAG_MIME_CARD = "text/plain"
const DRAG_MIME_FROM = "application/x-saptapadi-kanban-from"

/* ------------------------------------------------------------------- card */

export interface KanbanCardProps extends React.ComponentProps<"div"> {
  card: KanbanCardData
  /** Owning column id — written into the drag payload so boards can route drops */
  columnId?: string
  /** Dims the card while it is being dragged */
  dragging?: boolean
}

function KanbanCard({
  card,
  columnId = "",
  dragging = false,
  onDragStart,
  onDragEnd,
  className,
  ...props
}: KanbanCardProps) {
  const priority = card.priority ? priorityStyles[card.priority] : undefined

  return (
    <div
      data-slot="kanban-card"
      draggable
      onDragStart={(event) => {
        event.dataTransfer.effectAllowed = "move"
        event.dataTransfer.setData(DRAG_MIME_CARD, card.id)
        event.dataTransfer.setData(DRAG_MIME_FROM, columnId)
        onDragStart?.(event)
      }}
      onDragEnd={onDragEnd}
      className={cn(
        "group relative cursor-grab rounded-lg border bg-card p-3 shadow-sm transition-all duration-200 hover:shadow-md active:cursor-grabbing",
        dragging && "opacity-40 ring-2 ring-primary/30",
        className
      )}
      {...props}
    >
      <GripVertical
        aria-hidden="true"
        className="absolute top-2 right-2 size-3.5 text-muted-foreground/0 transition-colors duration-200 group-hover:text-muted-foreground/60"
      />
      <p className="pr-5 text-sm leading-5 font-medium">{card.title}</p>
      {card.description ? (
        <p className="mt-1 line-clamp-2 text-xs leading-4 text-muted-foreground">
          {card.description}
        </p>
      ) : null}
      {(card.tag || priority || card.dueDate || card.avatar) && (
        <div className="mt-3 flex items-center gap-1.5">
          {priority ? (
            <Badge variant={priority.variant} className="px-2 py-0">
              {priority.label}
            </Badge>
          ) : null}
          {card.tag ? (
            <Badge variant="gold" className="px-2 py-0">
              {card.tag}
            </Badge>
          ) : null}
          {card.dueDate ? (
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <CalendarClock className="size-3" aria-hidden="true" />
              {card.dueDate}
            </span>
          ) : null}
          <span className="ml-auto">
            <Avatar className="size-6 border">
              {card.avatar ? (
                <AvatarImage src={card.avatar} alt={card.title} />
              ) : null}
              <AvatarFallback className="text-[10px] font-semibold">
                {card.title.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </span>
        </div>
      )}
    </div>
  )
}

/* ----------------------------------------------------------------- column */

export interface KanbanColumnProps extends React.ComponentProps<"div"> {
  column: KanbanColumnData
  /** Called after a drop with the card id, its source column id and the drop target column id */
  onDropCard?: (cardId: string, fromColumnId: string, toColumnId: string) => void
  /** id of the card currently being dragged (used to dim it) */
  draggingCardId?: string | null
  onCardDragStart?: (cardId: string) => void
  onCardDragEnd?: () => void
}

function KanbanColumn({
  column,
  onDropCard,
  draggingCardId,
  onCardDragStart,
  onCardDragEnd,
  className,
  ...props
}: KanbanColumnProps) {
  const [isOver, setIsOver] = React.useState(false)

  return (
    <div
      data-slot="kanban-column"
      data-drag-over={isOver || undefined}
      onDragOver={(event) => {
        event.preventDefault()
        event.dataTransfer.dropEffect = "move"
        if (!isOver) setIsOver(true)
      }}
      onDragLeave={(event) => {
        if (event.currentTarget.contains(event.relatedTarget as Node)) return
        setIsOver(false)
      }}
      onDrop={(event) => {
        event.preventDefault()
        setIsOver(false)
        const cardId = event.dataTransfer.getData(DRAG_MIME_CARD)
        const fromColumnId = event.dataTransfer.getData(DRAG_MIME_FROM)
        if (cardId) onDropCard?.(cardId, fromColumnId, column.id)
      }}
      className={cn(
        "flex w-72 shrink-0 flex-col rounded-xl border bg-muted/40 transition-all duration-200",
        isOver && "border-primary/50 bg-primary/5 ring-2 ring-primary/20",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2 px-3 pt-3 pb-2">
        <span
          aria-hidden="true"
          className={cn(
            "size-2 rounded-full",
            toneDotClasses[column.tone ?? "primary"]
          )}
        />
        <h4 className="text-sm font-semibold">{column.title}</h4>
        <Badge variant="secondary" className="ml-auto px-2 py-0">
          {column.cards.length}
        </Badge>
      </div>
      <div className="flex min-h-24 flex-col gap-2 px-2 pb-2">
        {column.cards.map((card) => (
          <KanbanCard
            key={card.id}
            card={card}
            columnId={column.id}
            dragging={card.id === draggingCardId}
            onDragStart={() => onCardDragStart?.(card.id)}
            onDragEnd={() => onCardDragEnd?.()}
          />
        ))}
        {column.cards.length === 0 ? (
          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed py-6 text-xs text-muted-foreground">
            Drop cards here
          </div>
        ) : null}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ board */

export interface KanbanBoardProps extends React.ComponentProps<"div"> {
  columns: KanbanColumnData[]
  /** Controlled mode: fires with the new column set after every move. When
   * omitted the board keeps its own internal state. */
  onCardsChange?: (columns: KanbanColumnData[]) => void
}

function KanbanBoard({
  columns: columnsProp,
  onCardsChange,
  className,
  ...props
}: KanbanBoardProps) {
  const [internalColumns, setInternalColumns] = React.useState<KanbanColumnData[]>(
    columnsProp
  )
  const columns = onCardsChange ? columnsProp : internalColumns

  const [draggingCardId, setDraggingCardId] = React.useState<string | null>(null)

  const handleDropCard = React.useCallback(
    (cardId: string, fromColumnId: string, toColumnId: string) => {
      setDraggingCardId(null)
      if (!cardId || fromColumnId === toColumnId) return
      const source = columns.find((column) => column.id === fromColumnId)
      const card = source?.cards.find((entry) => entry.id === cardId)
      if (!card) return

      const next = columns.map((column) => {
        if (column.id === fromColumnId) {
          return {
            ...column,
            cards: column.cards.filter((entry) => entry.id !== cardId),
          }
        }
        if (column.id === toColumnId) {
          return { ...column, cards: [...column.cards, card] }
        }
        return column
      })
      if (onCardsChange) onCardsChange(next)
      else setInternalColumns(next)
    },
    [columns, onCardsChange]
  )

  return (
    <div
      data-slot="kanban-board"
      className={cn("flex items-start gap-4 overflow-x-auto pb-2", className)}
      {...props}
    >
      {columns.map((column) => (
        <KanbanColumn
          key={column.id}
          column={column}
          draggingCardId={draggingCardId}
          onCardDragStart={setDraggingCardId}
          onCardDragEnd={() => setDraggingCardId(null)}
          onDropCard={handleDropCard}
        />
      ))}
    </div>
  )
}

const Kanban = KanbanBoard

export { KanbanBoard, Kanban, KanbanColumn, KanbanCard }
