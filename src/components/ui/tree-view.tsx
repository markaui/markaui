"use client"

import * as React from "react"
import { ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export interface TreeNodeData {
  /** Unique node id */
  id: string
  /** Row content (usually text) */
  label: React.ReactNode
  /** Optional leading icon */
  icon?: React.ReactNode
  /** Optional trailing badge (text or node) */
  badge?: React.ReactNode
  disabled?: boolean
  children?: TreeNodeData[]
}

export interface TreeViewProps extends Omit<React.ComponentProps<"ul">, "onSelect"> {
  nodes: TreeNodeData[]
  /** Ids expanded on first render (uncontrolled) */
  defaultExpanded?: string[]
  /** Controlled expanded ids */
  expanded?: string[]
  onExpandedChange?: (expanded: string[]) => void
  /** Currently selected node id */
  selectedId?: string
  onSelect?: (id: string) => void
  /** Draw vertical indent guide lines (default true) */
  showLines?: boolean
}

interface TreeItemProps {
  node: TreeNodeData
  level: number
  selectedId?: string
  onSelect?: (id: string) => void
  expandedSet: Set<string>
  onToggle: (id: string) => void
  showLines: boolean
}

function TreeItem({
  node,
  level,
  selectedId,
  onSelect,
  expandedSet,
  onToggle,
  showLines,
}: TreeItemProps) {
  const hasChildren = !!node.children && node.children.length > 0
  const isExpanded = expandedSet.has(node.id)
  const isSelected = selectedId === node.id

  return (
    <li
      role="treeitem"
      aria-selected={isSelected}
      aria-expanded={hasChildren ? isExpanded : undefined}
      data-slot="tree-item"
    >
      <button
        type="button"
        disabled={node.disabled}
        onClick={() => {
          onSelect?.(node.id)
          if (hasChildren) onToggle(node.id)
        }}
        data-selected={isSelected || undefined}
        className={cn(
          "group flex w-full cursor-pointer items-center gap-1.5 rounded-lg py-1.5 pr-2 text-left text-sm outline-none transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "disabled:pointer-events-none disabled:opacity-50",
          isSelected
            ? "bg-primary/10 font-medium text-primary hover:bg-primary/15"
            : "text-foreground"
        )}
        style={{ paddingLeft: level * 16 + 8 }}
      >
        <span className="flex size-4 shrink-0 items-center justify-center">
          {hasChildren ? (
            <ChevronRight
              className={cn(
                "size-3.5 text-muted-foreground transition-transform duration-200",
                isExpanded && "rotate-90"
              )}
            />
          ) : null}
        </span>
        {node.icon ? (
          <span className="shrink-0 [&_svg]:size-4">{node.icon}</span>
        ) : null}
        <span className="min-w-0 flex-1 truncate">{node.label}</span>
        {node.badge !== undefined && node.badge !== null ? (
          <Badge variant="soft" className="ml-1">
            {node.badge}
          </Badge>
        ) : null}
      </button>
      {hasChildren && isExpanded && node.children ? (
        <ul
          role="group"
          data-slot="tree-group"
          className={cn(
            "mt-0.5 space-y-0.5",
            showLines && "ml-[15px] border-l border-border pl-2"
          )}
        >
          {node.children.map((child) => (
            <TreeItem
              key={child.id}
              node={child}
              level={level + 1}
              selectedId={selectedId}
              onSelect={onSelect}
              expandedSet={expandedSet}
              onToggle={onToggle}
              showLines={showLines}
            />
          ))}
        </ul>
      ) : null}
    </li>
  )
}

export function TreeView({
  nodes,
  defaultExpanded = [],
  expanded: expandedProp,
  onExpandedChange,
  selectedId,
  onSelect,
  showLines = true,
  className,
  ...props
}: TreeViewProps) {
  const [internalExpanded, setInternalExpanded] =
    React.useState<string[]>(defaultExpanded)
  const expanded = expandedProp ?? internalExpanded
  const expandedSet = React.useMemo(() => new Set(expanded), [expanded])

  const toggle = React.useCallback(
    (id: string) => {
      const next = expandedSet.has(id)
        ? expanded.filter((item) => item !== id)
        : [...expanded, id]
      if (expandedProp === undefined) setInternalExpanded(next)
      onExpandedChange?.(next)
    },
    [expanded, expandedProp, expandedSet, onExpandedChange]
  )

  return (
    <ul
      role="tree"
      data-slot="tree-view"
      className={cn("w-full space-y-0.5", className)}
      {...props}
    >
      {nodes.map((node) => (
        <TreeItem
          key={node.id}
          node={node}
          level={0}
          selectedId={selectedId}
          onSelect={onSelect}
          expandedSet={expandedSet}
          onToggle={toggle}
          showLines={showLines}
        />
      ))}
    </ul>
  )
}

/** Alias of TreeView */
export const Tree = TreeView
