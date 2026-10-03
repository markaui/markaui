"use client"

import * as React from "react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command"

import { cn } from "@/lib/utils"

export interface CommandPaletteItem {
  id: string
  label: string
  icon?: React.ReactNode
  shortcut?: string
  onSelect?: () => void
}

export interface CommandPaletteGroup {
  heading: string
  items: CommandPaletteItem[]
}

export interface CommandPaletteProps {
  /** Controlled open state */
  open: boolean
  /** Called when the palette opens or closes (selecting an item closes it) */
  onOpenChange: (open: boolean) => void
  /** Grouped commands, rendered in order */
  groups: CommandPaletteGroup[]
  /** Search input placeholder */
  placeholder?: string
  /** Dialog width override (defaults to sm:max-w-xl) */
  className?: string
}

function CommandPalette({
  open,
  onOpenChange,
  groups,
  placeholder = "Type a command or search...",
  className,
}: CommandPaletteProps) {
  const runItem = React.useCallback(
    (item: CommandPaletteItem) => {
      item.onSelect?.()
      onOpenChange(false)
    },
    [onOpenChange]
  )

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      className={cn("sm:max-w-xl", className)}
    >
      <CommandInput placeholder={placeholder} />
      <CommandList>
        <CommandEmpty>No matching commands.</CommandEmpty>
        {groups.map((group, groupIndex) => (
          <CommandGroup
            key={group.heading + "-" + groupIndex}
            heading={group.heading}
          >
            {group.items.map((item) => (
              <CommandItem
                key={item.id}
                value={item.label}
                onSelect={() => runItem(item)}
                className="gap-2.5 rounded-md data-[selected=true]:bg-gold/20 data-[selected=true]:text-gold-foreground data-[selected=true]:dark:text-gold data-[selected=true]:[&_svg:not([class*='text-'])]:text-gold-foreground data-[selected=true]:dark:[&_svg:not([class*='text-'])]:text-gold"
              >
                {item.icon}
                <span className="truncate">{item.label}</span>
                {item.shortcut ? (
                  <CommandShortcut>{item.shortcut}</CommandShortcut>
                ) : null}
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
      <div
        data-slot="command-palette-footer"
        className="text-muted-foreground flex items-center gap-4 border-t bg-muted/40 px-4 py-2 text-xs"
      >
        <Hint keys={["↑", "↓"]} label="navigate" />
        <Hint keys={["↵"]} label="select" />
        <Hint keys={["esc"]} label="close" />
        <span className="text-gradient-gold ml-auto hidden font-serif text-[11px] font-semibold sm:inline">
          Saptapadi
        </span>
      </div>
    </CommandDialog>
  )
}

function Hint({ keys, label }: { keys: string[]; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      {keys.map((key) => (
        <kbd
          key={key}
          className="bg-background text-muted-foreground inline-flex h-5 min-w-5 items-center justify-center rounded-[4px] border border-border px-1 font-sans text-[10px] font-medium"
        >
          {key}
        </kbd>
      ))}
      <span>{label}</span>
    </span>
  )
}

export { CommandPalette }
