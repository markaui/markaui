"use client";

import * as React from "react";
import Image from "next/image";
import { BadgeCheck, Eye, Gem, Heart, MapPin, Star } from "lucide-react";

import { cn } from "@/lib/utils";
import type { MatrimonyProfile } from "@/lib/matrimony-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { IconButton } from "@/components/ui/icon-button";
import { Rating } from "@/components/ui/rating";
import { useShortlist } from "./shortlist-provider";

export interface ProfileCardProps {
  profile: MatrimonyProfile;
  onView?: (profile: MatrimonyProfile) => void;
  className?: string;
  /** Matchmaker-desk curation — pins a gold “Matchmaker’s pick” badge under the photo. */
  featured?: boolean;
  /** Curation override for the verified chip (desk can verify/unverify). */
  verifiedOverride?: boolean;
  /** Above-the-fold images: set on the first visible cards to fix the LCP warning. */
  priority?: boolean;
}

export function ProfileCard({ profile, onView, className, featured = false, verifiedOverride, priority = false }: ProfileCardProps) {
  const shortlist = useShortlist();
  const saved = shortlist.has(profile.id);
  const verified = verifiedOverride ?? profile.verified;
  const [burst, setBurst] = React.useState(false);

  const toggleSaved = (e: React.MouseEvent) => {
    e.stopPropagation();
    shortlist.toggle(profile.id);
    if (!saved) {
      setBurst(true);
      window.setTimeout(() => setBurst(false), 500);
    }
  };

  return (
    <Card
      className={cn(
        "group overflow-hidden rounded-2xl border-border pt-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
        className
      )}
    >
      <button
        type="button"
        onClick={() => onView?.(profile)}
        aria-label={`View profile of ${profile.name}`}
        className="relative block aspect-[4/5] w-full cursor-pointer overflow-hidden text-left"
      >
        <Image
          src={profile.image}
          alt={`Profile of ${profile.name}, ${profile.profession} from ${profile.city}`}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          priority={priority}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {verified && (
          <span className="absolute top-3 right-3 flex size-7 shrink-0 items-center justify-center rounded-full bg-card/90 text-success shadow-sm">
            <BadgeCheck className="size-4" />
          </span>
        )}
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <Badge className="gap-1 bg-background/85 text-foreground shadow-sm backdrop-blur">
            <Heart className="size-3 text-gold" />
            {profile.matchScore}% match
          </Badge>
        </div>
        <span className="absolute inset-0 flex items-center justify-center bg-primary/0 opacity-0 transition-all duration-300 group-hover:bg-primary/25 group-hover:opacity-100">
          <span className="flex items-center gap-2 rounded-full bg-card px-4 py-2 text-sm font-medium text-foreground shadow-lg">
            <Eye className="size-4" />
            View profile
          </span>
        </span>
      </button>

      <CardContent className="space-y-2 p-4">
        {(featured || profile.premium) && (
          <div className="flex flex-wrap items-center gap-1.5">
            {featured && (
              <Badge variant="gold" className="gap-1">
                <Star className="size-3 fill-current" />
                Matchmaker’s pick
              </Badge>
            )}
            {profile.premium && (
              <Badge variant="gold" className="gap-1">
                <Gem className="size-3" />
                Premium
              </Badge>
            )}
          </div>
        )}
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="truncate font-serif text-lg font-semibold text-foreground">
            {profile.name.split(" ")[0]} {profile.name.split(" ")[1]?.[0]}.
          </h3>
          <span className="shrink-0 text-sm font-medium text-muted-foreground">
            {profile.age} yrs
          </span>
        </div>
        <p className="flex items-center gap-1.5 truncate text-sm text-muted-foreground">
          <MapPin className="size-3.5 shrink-0 text-gold" />
          {profile.city} · {profile.profession}
        </p>
        <Rating value={5} readonly size="sm" showValue count={64 + profile.matchScore} />
        <div className="flex gap-2 pt-2">
          <IconButton
            variant="outline"
            aria-label={saved ? `Remove ${profile.name} from shortlist` : `Shortlist ${profile.name}`}
            aria-pressed={saved}
            onClick={toggleSaved}
            className={cn(
              "transition-colors",
              saved
                ? "border-destructive/40 bg-destructive/10 text-destructive hover:text-destructive"
                : "text-muted-foreground hover:text-destructive"
            )}
          >
            <Heart
              className={cn("size-4 transition-transform", saved && "fill-destructive scale-110", burst && "animate-ping")}
              aria-hidden="true"
            />
          </IconButton>
          <Button variant="default" className="flex-1" onClick={() => onView?.(profile)}>
            View profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
