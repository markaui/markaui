"use client"

import * as React from "react"
import {
  FileTextIcon,
  UploadCloudIcon,
  UploadIcon,
  XIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { IconButton } from "@/components/ui/icon-button"

/** Human readable file size, e.g. 1.2 MB */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B"
  const kb = bytes / 1024
  if (kb < 1024) return kb.toFixed(1) + " KB"
  const mb = kb / 1024
  if (mb < 1024) return mb.toFixed(1) + " MB"
  return (mb / 1024).toFixed(1) + " GB"
}

function matchesAccept(file: File, accept?: string): boolean {
  if (!accept) return true
  const patterns = accept
    .split(",")
    .map((pattern) => pattern.trim().toLowerCase())
    .filter(Boolean)
  if (patterns.length === 0) return true
  const name = file.name.toLowerCase()
  const type = file.type.toLowerCase()
  return patterns.some((pattern) => {
    if (pattern.startsWith(".")) return name.endsWith(pattern)
    if (pattern.endsWith("/*")) return type.startsWith(pattern.slice(0, -1))
    return type === pattern
  })
}

function sameFile(a: File, b: File): boolean {
  return a.name === b.name && a.size === b.size && a.lastModified === b.lastModified
}

interface FileChipProps {
  file: File
  onRemove: () => void
  disabled?: boolean
}

function FileChip({ file, onRemove, disabled }: FileChipProps) {
  return (
    <li
      data-slot="file-chip"
      className="bg-muted/40 flex items-center gap-3 rounded-lg border px-3 py-2 transition-colors hover:bg-muted/60"
    >
      <span className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-md">
        <FileTextIcon className="size-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">{file.name}</span>
        <span className="text-muted-foreground block text-xs">
          {formatFileSize(file.size)}
        </span>
      </span>
      <IconButton
        type="button"
        variant="ghost"
        size="xs"
        aria-label={"Remove " + file.name}
        disabled={disabled}
        onClick={onRemove}
      >
        <XIcon className="size-3.5" />
      </IconButton>
    </li>
  )
}

export interface FileUploadProps {
  /** Passed to the hidden input, e.g. ".pdf,.jpg" or "image/*" */
  accept?: string
  /** Allow picking more than one file */
  multiple?: boolean
  /** Controlled file list */
  value?: File[]
  /** Initial file list when uncontrolled */
  defaultValue?: File[]
  /** Called with the full next file list */
  onChange?: (files: File[]) => void
  /** Max number of files kept in the list */
  maxFiles?: number
  disabled?: boolean
  /** Label of the chooser button */
  buttonLabel?: string
  /** Caption shown when the list is empty */
  emptyText?: string
  className?: string
}

function FileUpload({
  accept,
  multiple = false,
  value: valueProp,
  defaultValue,
  onChange,
  maxFiles,
  disabled = false,
  buttonLabel,
  emptyText = "No files selected",
  className,
}: FileUploadProps) {
  const isControlled = valueProp !== undefined
  const [internal, setInternal] = React.useState<File[]>(defaultValue ?? [])
  const files = isControlled ? valueProp : internal
  const inputRef = React.useRef<HTMLInputElement>(null)

  const commit = (next: File[]) => {
    if (!isControlled) setInternal(next)
    onChange?.(next)
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(event.target.files ?? [])
    event.target.value = ""
    const accepted = picked.filter((file) => matchesAccept(file, accept))
    if (accepted.length === 0) return
    const capacity =
      maxFiles === undefined ? Infinity : Math.max(0, maxFiles - files.length)
    const next = multiple
      ? [...files, ...accepted.slice(0, capacity)]
      : [accepted[0]]
    commit(next)
  }

  const remove = (file: File) => {
    commit(files.filter((f) => !sameFile(f, file)))
  }

  const atCapacity = maxFiles !== undefined && files.length >= maxFiles

  return (
    <div data-slot="file-upload" className={cn("w-full space-y-3", className)}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={handleInputChange}
      />
      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={disabled || atCapacity}
          onClick={() => inputRef.current?.click()}
        >
          <UploadIcon className="size-4" />
          {buttonLabel ?? (multiple ? "Choose files" : "Choose file")}
        </Button>
        <span className="text-muted-foreground text-xs">
          {files.length === 0
            ? emptyText
            : files.length +
              (files.length === 1 ? " file selected" : " files selected")}
        </span>
      </div>
      {files.length > 0 && (
        <ul data-slot="file-upload-list" className="space-y-2">
          {files.map((file, index) => (
            <FileChip
              key={file.name + "-" + file.size + "-" + index}
              file={file}
              onRemove={() => remove(file)}
              disabled={disabled}
            />
          ))}
        </ul>
      )}
    </div>
  )
}

export interface DropzoneProps {
  /** Passed to the hidden input, e.g. ".pdf,.jpg" or "image/*" */
  accept?: string
  /** Allow dropping/picking more than one file */
  multiple?: boolean
  /** Controlled file list (rendered below the drop area) */
  value?: File[]
  /** Initial file list when uncontrolled */
  defaultValue?: File[]
  /** Called with the full next file list */
  onChange?: (files: File[]) => void
  /** Called with only the newly added files */
  onFiles?: (files: File[]) => void
  /** Max number of files kept in the list */
  maxFiles?: number
  disabled?: boolean
  /** Headline inside the drop area */
  title?: string
  /** Helper text inside the drop area */
  description?: string
  className?: string
}

function Dropzone({
  accept,
  multiple = true,
  value: valueProp,
  defaultValue,
  onChange,
  onFiles,
  maxFiles,
  disabled = false,
  title = "Upload photos & documents",
  description = "Drag and drop files here, or click to browse",
  className,
}: DropzoneProps) {
  const isControlled = valueProp !== undefined
  const [internal, setInternal] = React.useState<File[]>(defaultValue ?? [])
  const files = isControlled ? valueProp : internal
  const [dragOver, setDragOver] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const commit = (next: File[]) => {
    if (!isControlled) setInternal(next)
    onChange?.(next)
  }

  const addFiles = (incoming: File[]) => {
    const accepted = incoming.filter((file) => matchesAccept(file, accept))
    if (accepted.length === 0) return
    const capacity =
      maxFiles === undefined ? Infinity : Math.max(0, maxFiles - files.length)
    const added = accepted.slice(0, capacity)
    if (added.length === 0) return
    commit([...files, ...added])
    onFiles?.(added)
  }

  const remove = (file: File) => {
    commit(files.filter((f) => !sameFile(f, file)))
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    if (disabled) return
    setDragOver(false)
    addFiles(Array.from(event.dataTransfer.files ?? []))
  }

  return (
    <div data-slot="dropzone" className={cn("w-full", className)}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(event) => {
          const picked = Array.from(event.target.files ?? [])
          event.target.value = ""
          addFiles(picked)
        }}
      />
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        aria-label={title}
        data-dragover={dragOver || undefined}
        onClick={() => {
          if (!disabled) inputRef.current?.click()
        }}
        onKeyDown={(event) => {
          if (!disabled && (event.key === "Enter" || event.key === " ")) {
            event.preventDefault()
            inputRef.current?.click()
          }
        }}
        onDragEnter={(event) => {
          event.preventDefault()
          if (!disabled) setDragOver(true)
        }}
        onDragOver={(event) => {
          event.preventDefault()
          if (!disabled) setDragOver(true)
        }}
        onDragLeave={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            setDragOver(false)
          }
        }}
        onDrop={handleDrop}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 text-center transition-all duration-200 outline-none",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          dragOver
            ? "border-gold bg-gold/10 shadow-md"
            : "border-border hover:border-gold/60 hover:bg-accent/40",
          disabled && "pointer-events-none cursor-not-allowed opacity-50"
        )}
      >
        <span
          className={cn(
            "flex size-12 items-center justify-center rounded-full transition-colors",
            dragOver
              ? "bg-gold/20 text-gold-foreground dark:text-gold"
              : "bg-primary/10 text-primary"
          )}
        >
          <UploadCloudIcon className="size-6" />
        </span>
        <span className="font-serif text-base font-medium">{title}</span>
        <span className="text-muted-foreground text-xs">{description}</span>
        {accept && (
          <span className="text-muted-foreground/70 text-[11px]">
            Accepted: {accept}
          </span>
        )}
      </div>
      {files.length > 0 && (
        <ul data-slot="dropzone-file-list" className="mt-3 space-y-2">
          {files.map((file, index) => (
            <FileChip
              key={file.name + "-" + file.size + "-" + index}
              file={file}
              onRemove={() => remove(file)}
              disabled={disabled}
            />
          ))}
        </ul>
      )}
    </div>
  )
}

export { FileUpload, Dropzone }
