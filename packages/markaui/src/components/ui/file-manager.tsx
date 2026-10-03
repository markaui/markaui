"use client"

import * as React from "react"

import { cn } from "../../lib/utils"
import { Badge } from "./badge"
import { IconButton } from "./icon-button"
import { Input } from "./input"
import {
  ChevronRight,
  FileSpreadsheet,
  FileText,
  Folder,
  FolderOpen,
  Home,
  Image as ImageIcon,
  LayoutGrid,
  List,
  Search,
  SearchX,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

/* ------------------------------------------------------------------ types */

export type FileManagerItemType = "folder" | "image" | "pdf" | "doc" | "sheet"

export interface FileManagerItem {
  id: string
  name: string
  type: FileManagerItemType
  /** Folder the item lives in, as a joined path e.g. "Wedding Photos". Defaults to root */
  folder?: string
  size?: string
  modified?: string
}

export interface FileManagerProps
  extends Omit<React.ComponentProps<"div">, "onSelect"> {
  items: FileManagerItem[]
  /** Controlled breadcrumb path (folder names). Omit for internal state */
  path?: string[]
  defaultPath?: string[]
  onPathChange?: (path: string[]) => void
  onSelect?: (item: FileManagerItem) => void
  /** Fired on double-click; folders navigate before this is called */
  onOpen?: (item: FileManagerItem) => void
}

/* --------------------------------------------------------------- mappings */

const typeStyles: Record<
  FileManagerItemType,
  { icon: LucideIcon; className: string; label: string }
> = {
  folder: { icon: Folder, className: "text-gold", label: "Folder" },
  image: { icon: ImageIcon, className: "text-info", label: "Image" },
  pdf: { icon: FileText, className: "text-destructive", label: "PDF" },
  doc: { icon: FileText, className: "text-primary", label: "Document" },
  sheet: { icon: FileSpreadsheet, className: "text-success", label: "Sheet" },
}

/* ------------------------------------------------------------- component */

function FileManager({
  items,
  path,
  defaultPath,
  onPathChange,
  onSelect,
  onOpen,
  className,
  ...props
}: FileManagerProps) {
  const [internalPath, setInternalPath] = React.useState<string[]>(
    defaultPath ?? []
  )
  const currentPath = path ?? internalPath
  const [query, setQuery] = React.useState("")
  const [view, setView] = React.useState<"grid" | "list">("grid")
  const [selectedId, setSelectedId] = React.useState<string | null>(null)

  const setPath = React.useCallback(
    (next: string[]) => {
      if (onPathChange) onPathChange(next)
      else setInternalPath(next)
    },
    [onPathChange]
  )

  const currentFolder = currentPath.join("/")
  const visible = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    const inFolder = items.filter(
      (item) => (item.folder ?? "") === currentFolder
    )
    const filtered = q
      ? inFolder.filter((item) => item.name.toLowerCase().includes(q))
      : inFolder
    return [...filtered].sort((a, b) => {
      if (a.type === "folder" && b.type !== "folder") return -1
      if (b.type === "folder" && a.type !== "folder") return 1
      return a.name.localeCompare(b.name)
    })
  }, [items, currentFolder, query])

  const selectedItem =
    visible.find((item) => item.id === selectedId) ??
    items.find((item) => item.id === selectedId) ??
    null

  const childCount = (item: FileManagerItem) =>
    items.filter(
      (other) => (other.folder ?? "") === [...currentPath, item.name].join("/")
    ).length

  const handleOpen = (item: FileManagerItem) => {
    if (item.type === "folder") setPath([...currentPath, item.name])
    onOpen?.(item)
  }

  const handleSelect = (item: FileManagerItem) => {
    setSelectedId(item.id)
    onSelect?.(item)
  }

  return (
    <div
      data-slot="file-manager"
      className={cn(
        "overflow-hidden rounded-xl border bg-card shadow-sm",
        className
      )}
      {...props}
    >
      {/* toolbar */}
      <div className="flex flex-wrap items-center gap-2 border-b px-3 py-2.5">
        <nav
          aria-label="Breadcrumb"
          className="flex min-w-0 flex-1 items-center gap-0.5 text-sm"
        >
          <button
            type="button"
            onClick={() => setPath([])}
            className={cn(
              "inline-flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
              currentPath.length === 0 && "text-primary"
            )}
          >
            <Home className="size-3.5" aria-hidden="true" />
            Files
          </button>
          {currentPath.map((segment, index) => {
            const isLast = index === currentPath.length - 1
            return (
              <span key={segment + index} className="flex min-w-0 items-center">
                <ChevronRight
                  className="size-3.5 shrink-0 text-muted-foreground/60"
                  aria-hidden="true"
                />
                <button
                  type="button"
                  onClick={() => setPath(currentPath.slice(0, index + 1))}
                  className={cn(
                    "cursor-pointer truncate rounded-md px-2 py-1 text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
                    isLast
                      ? "font-medium text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  {segment}
                </button>
              </span>
            )
          })}
        </nav>

        <Input
          inputSize="sm"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search files…"
          aria-label="Search files"
          leadingIcon={<Search />}
          className="w-40 sm:w-48"
        />

        <div className="flex items-center gap-0.5 rounded-lg border p-0.5">
          <IconButton
            size="xs"
            variant={view === "grid" ? "secondary" : "ghost"}
            aria-label="Grid view"
            onClick={() => setView("grid")}
          >
            <LayoutGrid />
          </IconButton>
          <IconButton
            size="xs"
            variant={view === "list" ? "secondary" : "ghost"}
            aria-label="List view"
            onClick={() => setView("list")}
          >
            <List />
          </IconButton>
        </div>
      </div>

      {/* content */}
      {visible.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-14 text-muted-foreground">
          {query ? (
            <SearchX className="size-8" aria-hidden="true" />
          ) : (
            <FolderOpen className="size-8" aria-hidden="true" />
          )}
          <p className="text-sm">
            {query ? "No items match your search" : "This folder is empty"}
          </p>
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 md:grid-cols-4">
          {visible.map((item) => {
            const styles = typeStyles[item.type]
            const Icon = styles.icon
            const selected = item.id === selectedId
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item)}
                onDoubleClick={() => handleOpen(item)}
                className={cn(
                  "flex cursor-pointer flex-col items-center gap-2 rounded-lg border bg-card p-4 text-center shadow-sm transition-all duration-200 hover:shadow-md focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
                  selected &&
                    "border-primary/60 bg-primary/5 ring-2 ring-primary/20"
                )}
              >
                <span
                  className={cn(
                    "flex size-11 items-center justify-center rounded-lg bg-muted/60 [&_svg]:size-5",
                    styles.className
                  )}
                >
                  <Icon aria-hidden="true" />
                </span>
                <span className="line-clamp-2 text-xs font-medium">
                  {item.name}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {item.type === "folder"
                    ? childCount(item) + " items"
                    : (item.size ?? styles.label)}
                </span>
              </button>
            )
          })}
        </div>
      ) : (
        <div className="p-2">
          {visible.map((item) => {
            const styles = typeStyles[item.type]
            const Icon = styles.icon
            const selected = item.id === selectedId
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item)}
                onDoubleClick={() => handleOpen(item)}
                className={cn(
                  "flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors duration-200 hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
                  selected && "bg-primary/5 ring-1 ring-primary/30"
                )}
              >
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted/60 [&_svg]:size-4",
                    styles.className
                  )}
                >
                  <Icon aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1 truncate text-sm font-medium">
                  {item.name}
                </span>
                <Badge
                  variant={item.type === "folder" ? "gold" : "outline"}
                  className="hidden sm:inline-flex"
                >
                  {styles.label}
                </Badge>
                <span className="hidden w-32 shrink-0 text-xs text-muted-foreground md:block">
                  {item.modified ?? "—"}
                </span>
                <span className="w-16 shrink-0 text-right text-xs text-muted-foreground">
                  {item.type === "folder"
                    ? childCount(item) + " items"
                    : (item.size ?? "—")}
                </span>
              </button>
            )
          })}
        </div>
      )}

      {/* status bar */}
      <div className="flex items-center justify-between gap-3 border-t px-4 py-2 text-xs text-muted-foreground">
        <span>
          {visible.length} {visible.length === 1 ? "item" : "items"}
        </span>
        {selectedItem ? (
          <span className="truncate">
            Selected: <span className="font-medium">{selectedItem.name}</span>
          </span>
        ) : (
          <span className="hidden sm:inline">
            Double-click a folder to open it
          </span>
        )}
      </div>
    </div>
  )
}

export { FileManager }
