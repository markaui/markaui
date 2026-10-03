"use client";

import * as React from "react";
import { BellOff, BellRing, Bookmark, Check, Pencil, Play, Trash2, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import type { SearchQuery } from "@/lib/matrimony-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useSavedSearches } from "./saved-searches-provider";
import { describeQuery } from "./save-search-dialog";

export interface SavedSearchesPanelProps {
  /** Apply a saved search — navigates to the results view. */
  onApply: (query: SearchQuery) => void;
  /** Open the discovery flow when the list is empty. */
  onDiscover?: () => void;
}

/** One saved-search card — apply, rename inline, notify toggle, delete. */
function SavedSearchCard({
  id,
  onApply,
}: {
  id: string;
  onApply: (query: SearchQuery) => void;
}) {
  const { records, toggleNotify, renameSearch, removeSearch } = useSavedSearches();
  const { toast } = useToast();
  const record = records.find((r) => r.id === id);
  const [editing, setEditing] = React.useState(false);
  const [draftName, setDraftName] = React.useState("");

  if (!record) return null;

  const startRename = () => {
    setDraftName(record.name);
    setEditing(true);
  };

  const commitRename = async () => {
    const trimmed = draftName.trim();
    if (!trimmed || trimmed === record.name) {
      setEditing(false);
      return;
    }
    const result = await renameSearch(id, trimmed);
    if (!result.ok) {
      toast({ title: "Rename failed", description: result.error, variant: "destructive" });
      return;
    }
    setEditing(false);
    toast({ title: "Search renamed", description: `Now called “${trimmed}”.` });
  };

  const handleDelete = async () => {
    const name = record.name;
    await removeSearch(id);
    toast({ title: "Saved search removed", description: `“${name}” is gone from your list.` });
  };

  return (
    <li
      className={cn(
        "group relative rounded-2xl border bg-card p-4 shadow-sm transition-all",
        "hover:border-gold/40 hover:shadow-md focus-within:border-gold/50"
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {editing ? (
            <div className="flex items-center gap-2">
              <Input
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") void commitRename();
                  if (e.key === "Escape") setEditing(false);
                }}
                maxLength={60}
                autoFocus
                aria-label="Rename saved search"
                className="h-8 max-w-xs"
              />
              <IconButton
                variant="ghost"
                size="sm"
                onClick={() => void commitRename()}
                aria-label="Save name"
              >
                <Check className="size-4 text-success" />
              </IconButton>
              <IconButton
                variant="ghost"
                size="sm"
                onClick={() => setEditing(false)}
                aria-label="Cancel rename"
              >
                <X className="size-4" />
              </IconButton>
            </div>
          ) : (
            <p className="flex items-center gap-2 font-serif text-base font-semibold text-foreground">
              <span className="truncate">{record.name}</span>
              {record.newSinceSaved > 0 && (
                <Badge variant="success" className="shrink-0 gap-1 text-[10px]">
                  <span className="size-1.5 rounded-full bg-success" aria-hidden="true" />+{record.newSinceSaved} new
                </Badge>
              )}
            </p>
          )}
          <p className="mt-1 truncate text-xs text-muted-foreground">{describeQuery(record.query)}</p>
          <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
            <span className="font-medium text-foreground">
              {record.matches} {record.matches === 1 ? "match" : "matches"} now
            </span>
            <span aria-hidden="true">·</span>
            <span>Saved {formatDistanceToNow(new Date(record.createdAt), { addSuffix: true })}</span>
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1.5">
                {record.notify ? (
                  <BellRing className="size-3.5 text-gold" aria-hidden="true" />
                ) : (
                  <BellOff className="size-3.5 text-muted-foreground" aria-hidden="true" />
                )}
                <Switch
                  checked={record.notify}
                  onCheckedChange={() => void toggleNotify(id)}
                  aria-label={`Toggle match alerts for ${record.name}`}
                  className="scale-90"
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>{record.notify ? "Alerts on" : "Alerts off"}</TooltipContent>
          </Tooltip>
          <IconButton variant="ghost" size="sm" onClick={startRename} aria-label={`Rename ${record.name}`}>
            <Pencil className="size-4" />
          </IconButton>
          <IconButton
            variant="ghost"
            size="sm"
            onClick={() => void handleDelete()}
            aria-label={`Delete ${record.name}`}
            className="hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="size-4" />
          </IconButton>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-end gap-2 border-t border-border/60 pt-3">
        <Button
          size="sm"
          variant="gold"
          className="gap-1.5 rounded-full"
          onClick={() => onApply(record.query)}
        >
          <Play className="size-3.5" />
          Apply search
        </Button>
      </div>
    </li>
  );
}

export function SavedSearchesPanel({ onApply, onDiscover }: SavedSearchesPanelProps) {
  const { records, count, ready, synced } = useSavedSearches();

  if (!ready) {
    return (
      <div className="space-y-3" aria-busy="true" aria-label="Loading saved searches">
        {[0, 1].map((i) => (
          <Skeleton key={i} className="h-36 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-4">
        <EmptyState
          icon={<Bookmark className="size-5" aria-hidden="true" />}
          title="No saved searches yet"
          description="Tune the filters on your next search and tap “Save search” — we'll remember it here and can alert you when new profiles match."
          action={
            onDiscover ? (
              <Button variant="gold" onClick={onDiscover}>
                Discover profiles
              </Button>
            ) : undefined
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        {count} saved {count === 1 ? "search" : "searches"} ·{" "}
        {synced ? "synced to your account" : "kept on this device — sign in to sync"}
      </p>
      <ul className="stagger-rows space-y-3">
        {records.map((r) => (
          <SavedSearchCard key={r.id} id={r.id} onApply={onApply} />
        ))}
      </ul>
    </div>
  );
}
