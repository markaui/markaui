"use client";

import * as React from "react";
import Image from "next/image";
import {
  BadgeCheck,
  Bell,
  BookHeart,
  CalendarHeart,
  Gem,
  Heart,
  Home,
  MapPin,
  MessageCircleHeart,
  MessageSquareText,
  PenLine,
  Ruler,
  Sparkles,
  Star,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { MatrimonyProfile } from "@/lib/matrimony-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Modal, ModalBody, ModalFooter } from "@/components/ui/modal";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Tag } from "@/components/ui/tag";
import { Textarea } from "@/components/ui/textarea";
import { useShortlist } from "./shortlist-provider";
import { useInterests } from "./interests-provider";
import { useToast } from "@/hooks/use-toast";

export interface ProfileDetailModalProps {
  profile: MatrimonyProfile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type DetailTab = "overview" | "horoscope" | "family" | "preferences";

const NOTE_LIMIT = 240;

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border/60 py-2.5 last:border-0">
      <span className="shrink-0 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className="text-right text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

export function ProfileDetailModal({ profile, open, onOpenChange }: ProfileDetailModalProps) {
  const shortlist = useShortlist();
  const interests = useInterests();
  const { toast } = useToast();
  const [tab, setTab] = React.useState<DetailTab>("overview");
  const [activeImage, setActiveImage] = React.useState(0);
  const [sent, setSent] = React.useState(false);
  const [sending, setSending] = React.useState(false);
  const [note, setNote] = React.useState("");
  const [noteOpen, setNoteOpen] = React.useState(false);

  React.useEffect(() => {
    if (profile) {
      setTab("overview");
      setActiveImage(0);
      setSent(false);
      setSending(false);
      setNote("");
      setNoteOpen(false);
    }
  }, [profile]);

  if (!profile) return null;

  const saved = shortlist.has(profile.id);
  const alreadySent = sent || interests.has(profile.id);
  const p = profile;
  const firstName = p.name.split(" ")[0];

  const sendInterest = async () => {
    setSending(true);
    const ok = await interests.send(p.id, p.name, note);
    setSending(false);
    if (ok) {
      setSent(true);
      toast({
        title: `Interest sent to ${firstName} 💛`,
        description: note.trim()
          ? "Your personal note travels with it — a thoughtful touch."
          : "Saved securely — you'll be notified the moment she views your profile.",
      });
    } else {
      toast({
        title: "Couldn't send right now",
        description: "Our matchmaking desk is momentarily busy — please try again.",
        variant: "destructive",
      });
    }
  };

  const startChat = () => {
    toast({
      title: "Chat request sent",
      description: `${firstName} will be able to reply once she accepts your interest.`,
    });
  };

  const toggleSaved = () => {
    shortlist.toggle(p.id);
    toast({
      title: saved ? `${firstName} removed from shortlist` : `${firstName} added to shortlist`,
      description: saved
        ? "You can always add her back from search."
        : "Find her anytime under the heart icon in the navbar.",
    });
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      size="xl"
      title={`${p.name} — Profile`}
      description={`${p.age} yrs · ${p.city}`}
    >
      <ModalBody>
        <div className="grid gap-6 md:grid-cols-[240px_1fr]">
          {/* Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border">
              <Image
                src={p.gallery[activeImage] ?? p.image}
                alt={`${p.name} photo ${activeImage + 1}`}
                fill
                sizes="240px"
                className="object-cover"
              />
            </div>
            {p.premium && (
              <Badge variant="gold" className="w-fit gap-1">
                <Gem className="size-3" />
                Premium
              </Badge>
            )}
            <div className="flex gap-2">
              {p.gallery.map((src, i) => (
                <button
                  key={src + i}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  aria-label={`Photo ${i + 1}`}
                  aria-pressed={activeImage === i}
                  className={cn(
                    "relative size-16 overflow-hidden rounded-lg border-2 transition-all cursor-pointer",
                    activeImage === i
                      ? "border-gold shadow-md"
                      : "border-transparent opacity-70 hover:opacity-100"
                  )}
                >
                  <Image src={src} alt="" fill sizes="64px" className="object-cover" />
                </button>
              ))}
            </div>
            <div className="rounded-xl border border-border bg-secondary/50 p-3">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                <Sparkles className="size-3.5 text-gold" />
                {p.matchScore}% Saptapadi match
              </p>
              <Progress value={p.matchScore} className="mt-2 h-1.5" aria-label="Match score" />
            </div>
          </div>

          {/* Summary + tabs */}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-serif text-2xl font-bold text-foreground">{p.name}</h3>
              {p.verified && (
                <Badge variant="success" className="gap-1">
                  <BadgeCheck className="size-3" />
                  Verified
                </Badge>
              )}
              <Badge variant="soft">{p.community}</Badge>
            </div>
            <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="size-3.5 text-gold" />
                {p.city}, {p.state}
              </span>
              <span className="flex items-center gap-1">
                <Ruler className="size-3.5 text-gold" />
                {p.height}
              </span>
              <span className="flex items-center gap-1">
                <Star className="size-3.5 text-gold" />
                {p.motherTongue}
              </span>
            </p>

            <Tabs
              value={tab}
              onValueChange={(v) => setTab(v as DetailTab)}
              className="mt-5"
            >
              <TabsList className="w-full justify-start overflow-x-auto sm:grid sm:grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="horoscope">Horoscope</TabsTrigger>
                <TabsTrigger value="family">Family</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-4 space-y-4">
                <p className="text-sm leading-relaxed text-foreground/90">{p.about}</p>
                <div className="grid gap-x-8 sm:grid-cols-2">
                  <div>
                    <DetailRow label="Education" value={p.education} />
                    <DetailRow label="Profession" value={p.profession} />
                    <DetailRow label="Income" value={p.income} />
                  </div>
                  <div>
                    <DetailRow label="Diet" value={p.lifestyle.diet} />
                    <DetailRow label="Smoke / Drink" value={`${p.lifestyle.smoke} / ${p.lifestyle.drink}`} />
                    <DetailRow label="Marital status" value="Never married" />
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Interests
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {p.lifestyle.hobbies.map((hobby) => (
                      <Tag key={hobby} defaultSelected>
                        {hobby}
                      </Tag>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="horoscope" className="mt-4 space-y-4">
                <div className="grid gap-x-8 sm:grid-cols-2">
                  <div>
                    <DetailRow label="Birth date" value={p.horoscope.birthDate} />
                    <DetailRow label="Birth time" value={p.horoscope.birthTime} />
                    <DetailRow label="Birth place" value={p.horoscope.birthPlace} />
                  </div>
                  <div>
                    <DetailRow label="Moon sign" value={p.horoscope.moonSign} />
                    <DetailRow label="Nakshatra" value={p.horoscope.nakshatra} />
                    <DetailRow label="Manglik" value={p.horoscope.manglik} />
                  </div>
                </div>
                <div className="rounded-xl border border-gold/30 bg-gold/10 p-4">
                  <p className="flex items-center gap-2 font-serif text-sm font-semibold text-foreground">
                    <CalendarHeart className="size-4 text-gold" />
                    Kundli matching available on Gold &amp; Diamond plans
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Get a full 36-guna report with our in-house astrologer before you meet.
                  </p>
                  <Button variant="gold" size="sm" className="mt-3 gap-1.5">
                    <Gem className="size-3.5" />
                    Unlock kundli report
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="family" className="mt-4 space-y-4">
                <div className="grid gap-x-8 sm:grid-cols-2">
                  <div>
                    <DetailRow label="Family" value={p.family.type} />
                    <DetailRow label="Status" value={p.family.status} />
                    <DetailRow label="Values" value={p.family.values} />
                  </div>
                  <div>
                    <DetailRow label="Father" value={p.family.father} />
                    <DetailRow label="Mother" value={p.family.mother} />
                    <DetailRow label="Siblings" value={p.family.siblings} />
                  </div>
                </div>
                <p className="flex items-start gap-2 rounded-xl border border-border bg-secondary/50 p-3 text-xs text-muted-foreground">
                  <Home className="mt-0.5 size-3.5 shrink-0 text-gold" />
                  Family contact details are shared only after both families express interest —
                  your privacy is always protected.
                </p>
              </TabsContent>

              <TabsContent value="preferences" className="mt-4 space-y-4">
                <div className="grid gap-x-8 sm:grid-cols-2">
                  <div>
                    <DetailRow label="Age" value={p.partnerPrefs.ageRange} />
                    <DetailRow label="Height" value={p.partnerPrefs.height} />
                    <DetailRow label="Community" value={p.partnerPrefs.community} />
                  </div>
                  <div>
                    <DetailRow label="Occupation" value={p.partnerPrefs.occupation} />
                    <DetailRow label="Cities" value={p.partnerPrefs.cities} />
                  </div>
                </div>
                <p className="flex items-start gap-2 text-xs text-muted-foreground">
                  <BookHeart className="mt-0.5 size-3.5 shrink-0 text-gold" />
                  Partner preferences are set by {firstName} and updated recently.
                </p>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Personal note composer — folds open above the footer actions */}
        {noteOpen && !alreadySent && (
          <div id="interest-note" className="mt-4 rounded-xl border border-gold/30 bg-gold/5 p-3">
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                <MessageSquareText className="size-3.5 text-gold" />
                Introduce yourself in a line or two
              </p>
              <span
                className={cn(
                  "text-[11px] tabular-nums",
                  note.length > NOTE_LIMIT - 50 ? "text-warning" : "text-muted-foreground"
                )}
              >
                {note.length}/{NOTE_LIMIT}
              </span>
            </div>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={NOTE_LIMIT}
              rows={2}
              className="resize-none bg-background"
              placeholder={`e.g. Namaste ${firstName} — your design work caught my eye. I'd love to connect…`}
              aria-label="Personal note to send with your interest"
            />
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              Notes are shared only once your interest is accepted — never before.
            </p>
          </div>
        )}
      </ModalBody>

      <ModalFooter className="flex-col gap-3 border-t border-border sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Users className="size-3.5 text-gold" />
          Profile ID: SAP-{p.id.slice(0, 6).toUpperCase()} · Last active today
        </p>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          {alreadySent ? (
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MessageSquareText className="size-3.5 text-gold" />
              {interests.records.find((r) => r.profileId === p.id)?.note
                ? "Your note was delivered with the interest"
                : "Interest delivered"}
            </span>
          ) : (
            <button
              type="button"
              onClick={() => setNoteOpen((v) => !v)}
              aria-expanded={noteOpen}
              aria-controls="interest-note"
              className="flex cursor-pointer items-center gap-1.5 self-start text-xs font-medium text-muted-foreground transition-colors hover:text-foreground sm:self-auto"
            >
              <PenLine className="size-3.5 text-gold" />
              {noteOpen ? "Hide note" : note.trim() ? "Edit your note" : "Add a personal note"}
            </button>
          )}
          <IconButton
            variant="outline"
            aria-label={saved ? "Remove from shortlist" : "Add to shortlist"}
            aria-pressed={saved}
            onClick={toggleSaved}
            className={cn(saved && "border-destructive/40 bg-destructive/10 text-destructive")}
          >
            <Heart className={cn("size-4", saved && "fill-destructive")} />
          </IconButton>
          <Button variant="outline" className="flex-1 gap-2 sm:flex-none" onClick={startChat}>
            <MessageCircleHeart className="size-4" />
            Chat
          </Button>
          <Button
            variant={alreadySent ? "secondary" : "gold"}
            className="flex-1 gap-2 sm:flex-none"
            onClick={sendInterest}
            disabled={alreadySent || sending}
            loading={false}
            rightIcon={alreadySent ? <Bell className="size-4" /> : undefined}
          >
            {sending ? (
            <>
              <Spinner className="size-4" />
              Sending…
            </>
          ) : alreadySent ? (
            "Interest sent"
          ) : (
            "Send Interest"
          )}
        </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
}
