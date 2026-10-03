"use client";

import * as React from "react";
import { Check, PencilLine, Ruler } from "lucide-react";

import { CITY_OPTIONS } from "@/lib/matrimony-data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AvatarPicker } from "@/components/ui/avatar-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "./auth-provider";

export interface ProfileEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ABOUT_LIMIT = 500;

/**
 * Edit the signed-in member's display details (name, city, profession,
 * height, about and avatar). Composed from the shared Dialog, Input, Select,
 * Textarea, AvatarPicker and Spinner primitives; saves through
 * PATCH /api/auth/profile and updates the AuthProvider context so the
 * navbar, dashboard and checkout prefill refresh instantly.
 */
export function ProfileEditDialog({ open, onOpenChange }: ProfileEditDialogProps) {
  const { member, updateProfile } = useAuth();
  const { toast } = useToast();
  const [name, setName] = React.useState("");
  const [city, setCity] = React.useState("Any");
  const [profession, setProfession] = React.useState("");
  const [height, setHeight] = React.useState("");
  const [about, setAbout] = React.useState("");
  const [avatar, setAvatar] = React.useState<string | null>(null);
  const avatarDirty = React.useRef(false);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Hydrate the fields from the member each time the dialog opens.
  React.useEffect(() => {
    if (open && member) {
      setName(member.name);
      setCity(member.city ?? "Any");
      setProfession(member.profession ?? "");
      setHeight(member.height ?? "");
      setAbout(member.about ?? "");
      setAvatar(member.avatarUrl);
      avatarDirty.current = false;
      setError(null);
    }
  }, [open, member]);

  const cityIsCustom = city !== "Any" && !CITY_OPTIONS.includes(city as (typeof CITY_OPTIONS)[number]);
  const aboutDirty = about !== (member?.about ?? "");
  const completionDelta =
    (!member?.profession && profession.trim() ? 15 : 0) +
    (!member?.about && about.trim() ? 20 : 0) +
    (!member?.height && height.trim() ? 5 : 0);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      setError("Please use your full name (at least 2 characters).");
      return;
    }
    setSaving(true);
    setError(null);
    const result = await updateProfile({
      name: trimmed,
      city: city === "Any" ? "" : city,
      profession: profession.trim(),
      height: height.trim(),
      about: about.trim(),
      ...(avatarDirty.current ? { avatarUrl: avatar } : {}),
    });
    setSaving(false);
    if (!result.ok) {
      setError(result.error ?? "Could not save your details.");
      return;
    }
    onOpenChange(false);
    toast({
      title: "Profile updated ✨",
      description: completionDelta > 0
        ? `Your profile completion rose by ${completionDelta}% — looking great.`
        : "Your details are synced across your account.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-serif">
            <span className="flex size-8 items-center justify-center rounded-lg bg-gold/15 text-gold">
              <PencilLine className="size-4" />
            </span>
            Edit your details
          </DialogTitle>
          <DialogDescription>
            Everything here personalises your matches — the richer your profile, the closer
            the suggestions.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={save}>
          {!member ? (
            <div
              role="status"
              className="rounded-xl border border-gold/30 bg-gold/10 p-4 text-sm text-foreground/90"
            >
              Sign in to edit your profile details — your details sync across your account
              once you do.
            </div>
          ) : (
            <div className="max-h-[60vh] space-y-4 overflow-y-auto pr-1 scrollbar-thin">
              <AvatarPicker
                value={avatar}
                onValueChange={(next) => {
                  avatarDirty.current = true;
                  setAvatar(next);
                }}
                name={name || member.name}
                disabled={saving}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="profile-edit-name">Full name</Label>
                  <Input
                    id="profile-edit-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Nadia Brooks"
                    autoComplete="name"
                    maxLength={60}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profile-edit-city">City</Label>
                  <Select value={city} onValueChange={setCity}>
                    <SelectTrigger id="profile-edit-city" className="w-full">
                      <SelectValue placeholder="Choose your city" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Any">Not specified</SelectItem>
                      {CITY_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                      {cityIsCustom && <SelectItem value={city}>{city}</SelectItem>}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profile-edit-profession">Profession</Label>
                  <Input
                    id="profile-edit-profession"
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    placeholder="e.g. Interior Designer"
                    maxLength={80}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profile-edit-height" className="gap-1.5">
                    <Ruler className="size-3.5 text-muted-foreground" />
                    Height
                  </Label>
                  <Input
                    id="profile-edit-height"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder={`5'6" or 168 cm`}
                    maxLength={20}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="profile-edit-about">About you</Label>
                  <span
                    className={cn(
                      "text-[11px] tabular-nums",
                      about.length > ABOUT_LIMIT - 60
                        ? "text-warning"
                        : "text-muted-foreground"
                    )}
                  >
                    {about.length}/{ABOUT_LIMIT}
                  </span>
                </div>
                <Textarea
                  id="profile-edit-about"
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  placeholder="Share what makes you, you — your work, your family, the little things that light you up…"
                  maxLength={ABOUT_LIMIT}
                  rows={4}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Members with a warm, honest bio receive noticeably more interests.
                </p>
              </div>

              {completionDelta > 0 && (
                <p className="rounded-lg border border-success/30 bg-success/10 px-3 py-2 text-xs text-success">
                  Saving these details adds up to{" "}
                  <span className="font-semibold">+{completionDelta}%</span> profile
                  completion.
                </p>
              )}

              {error && (
                <p
                  role="alert"
                  className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive"
                >
                  {error}
                </p>
              )}
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="gold"
              disabled={saving || !member || name.trim().length < 2}
            >
              {saving ? (
                <>
                  <Spinner className="size-4" />
                  Saving…
                </>
              ) : (
                <>
                  <Check className="size-4" />
                  Save changes
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
