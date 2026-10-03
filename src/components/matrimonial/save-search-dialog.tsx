"use client";

import * as React from "react";
import { BellRing, BookmarkCheck, Info } from "lucide-react";

import type { SearchQuery } from "@/lib/matrimony-data";
import { AGE_OPTIONS, CITY_OPTIONS, COMMUNITY_OPTIONS } from "@/lib/matrimony-data";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useSavedSearches } from "./saved-searches-provider";

export interface SaveSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The filter set to save. */
  query: SearchQuery;
  /** Live count of catalogue matches for the query (for the summary line). */
  matches?: number;
}

/** Human-readable one-line summary of a search query. */
export function describeQuery(q: SearchQuery): string {
  const lookingFor = q.seeking === "female" ? "Brides" : "Grooms";
  const age = q.age === "Any" ? "any age" : q.age;
  const community = q.community === "Any" ? "any community" : q.community;
  const city = q.city === "Any" ? "any city" : q.city;
  const term = q.term?.trim() ? ` · “${q.term.trim()}”` : "";
  return `${lookingFor} · ${age} · ${community} · ${city}${term}`;
}

/** Auto-name a query, e.g. "Brides · 26–30 yrs · Jaipur". */
export function suggestName(q: SearchQuery): string {
  const parts = [
    q.seeking === "female" ? "Brides" : "Grooms",
    q.age !== "Any" ? q.age.replace(" yrs", "") : null,
    q.city !== "Any" ? q.city : null,
    q.community !== "Any" ? q.community : null,
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(" · ") : "All profiles";
}

/** Verify every facet of a query falls inside the catalogue vocabularies. */
export function queryIsValid(q: SearchQuery): boolean {
  return (
    (q.seeking === "male" || q.seeking === "female") &&
    (q.age === "Any" || AGE_OPTIONS.includes(q.age as (typeof AGE_OPTIONS)[number])) &&
    (q.community === "Any" || COMMUNITY_OPTIONS.includes(q.community as (typeof COMMUNITY_OPTIONS)[number])) &&
    (q.city === "Any" || CITY_OPTIONS.includes(q.city as (typeof CITY_OPTIONS)[number]))
  );
}

export function SaveSearchDialog({
  open,
  onOpenChange,
  query,
  matches = 0,
}: SaveSearchDialogProps) {
  const { saveSearch, synced } = useSavedSearches();
  const { toast } = useToast();
  const [name, setName] = React.useState("");
  const [notify, setNotify] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Fresh dialog state each time it opens, prefilled with a sensible name.
  React.useEffect(() => {
    if (open) {
      setName(suggestName(query));
      setNotify(true);
      setError(null);
    }
  }, [open, query]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    const result = await saveSearch(query, name);
    setSaving(false);
    if (!result.ok) {
      setError(result.error ?? "Something went wrong.");
      return;
    }
    onOpenChange(false);
    toast({
      title: "Search saved 🔖",
      description: synced
        ? `“${name.trim()}” was added to your dashboard — we'll keep an eye on it.`
        : `“${name.trim()}” is kept on this device. Sign in to sync it everywhere.`,
    });
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={
        <span className="flex items-center gap-2">
          <BookmarkCheck className="size-5 text-gold" aria-hidden="true" />
          Save this search
        </span>
      }
      description="Name this filter set and find it again in one tap — from your dashboard or right here."
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancel
          </Button>
          <Button variant="gold" onClick={handleSave} disabled={saving || name.trim().length === 0}>
            {saving ? (
              <>
                <Spinner className="size-4" /> Saving…
              </>
            ) : (
              "Save search"
            )}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="saved-search-name">Search name</Label>
          <Input
            id="saved-search-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Jaipur brides, 26–30"
            maxLength={60}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter" && name.trim() && !saving) void handleSave();
            }}
          />
          {error && <p className="text-xs font-medium text-destructive">{error}</p>}
        </div>

        <div className="rounded-xl border border-gold/25 bg-gold/5 px-3 py-2.5">
          <p className="text-xs font-medium text-foreground">{describeQuery(query)}</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            Currently matching{" "}
            <Badge variant="gold" className="mx-0.5 px-1.5 py-0 text-[10px]">
              {matches} {matches === 1 ? "profile" : "profiles"}
            </Badge>{" "}
            in the catalogue
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-xl border border-border px-3 py-2.5">
          <div className="flex items-start gap-2.5">
            <BellRing className="mt-0.5 size-4 text-gold" aria-hidden="true" />
            <div>
              <Label htmlFor="saved-search-notify" className="text-sm font-medium">
                Alert me about new matches
              </Label>
              <p className="text-[11px] text-muted-foreground">
                We'll notify you when more profiles fit this search.
              </p>
            </div>
          </div>
          <Switch
            id="saved-search-notify"
            checked={notify}
            onCheckedChange={setNotify}
            aria-label="Toggle new-match alerts"
          />
        </div>

        {!synced && (
          <Alert className="border-info/30 bg-info/5">
            <Info className="size-4" />
            <AlertTitle className="text-sm">Browsing as a guest</AlertTitle>
            <AlertDescription className="text-xs">
              This search is kept on this device only. Sign in and your saved
              searches will sync to your account everywhere.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </Modal>
  );
}
