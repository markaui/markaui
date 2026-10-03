"use client";

import * as React from "react";
import { Camera, Loader2, Trash2, Upload } from "lucide-react";

import { cn } from "../../lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { IconButton } from "./icon-button";
import { Spinner } from "./spinner";

export interface AvatarPickerProps {
  /** Current avatar — an image URL or data URL, or null for none. */
  value: string | null;
  /** Called with the new data URL, or null when the avatar is removed. */
  onValueChange: (value: string | null) => void;
  /** Name used for the fallback initials and alt text. */
  name: string;
  /** Rendered side length in px (the image is square). */
  size?: number;
  /** Disable the picker while the surrounding form is busy. */
  disabled?: boolean;
  className?: string;
}

const OUTPUT_SIZE = 256;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

/** Draw the source image cropped to a centred square, scaled down to OUTPUT_SIZE. */
function fileToSquareDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read the file."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("That file is not a readable image."));
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = OUTPUT_SIZE;
        canvas.height = OUTPUT_SIZE;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Your browser does not support image processing."));
          return;
        }
        const side = Math.min(img.width, img.height);
        const sx = (img.width - side) / 2;
        const sy = (img.height - side) / 2;
        ctx.drawImage(img, sx, sy, side, side, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Controlled avatar picker — preview, upload (auto-resized to a 256px square
 * JPEG data URL) and remove. Fully props-driven: no internal "committed"
 * state, the parent owns the value.
 */
export function AvatarPicker({
  value,
  onValueChange,
  name,
  size = 80,
  disabled = false,
  className,
}: AvatarPickerProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [processing, setProcessing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const initials =
    name
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?";

  async function handleFile(file: File | undefined) {
    if (!file || disabled) return;
    setError(null);

    if (!ACCEPTED.includes(file.type)) {
      setError("Please choose a JPEG, PNG or WebP image.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("That image is too large (over 8 MB).");
      return;
    }

    setProcessing(true);
    try {
      const dataUrl = await fileToSquareDataUrl(file);
      onValueChange(dataUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not process that image.");
    } finally {
      setProcessing(false);
    }
  }

  const busy = processing || disabled;

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <div
        className="relative shrink-0"
        style={{ width: size, height: size }}
        data-slot="avatar-picker"
      >
        <Avatar
          className="size-full ring-2 ring-border transition-shadow duration-300 hover:ring-gold/60"
          style={{ width: size, height: size }}
        >
          {value ? <AvatarImage src={value} alt={name} /> : null}
          <AvatarFallback className="bg-[linear-gradient(135deg,var(--primary),var(--gold))] text-sm font-semibold text-primary-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>

        <IconButton
          type="button"
          size="xs"
          aria-label={value ? "Change photo" : "Upload photo"}
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="absolute -right-1.5 -bottom-1.5 size-7 rounded-full bg-primary text-primary-foreground shadow-md transition-transform duration-200 hover:scale-110"
        >
          {processing ? <Loader2 className="size-3.5 animate-spin" /> : <Camera className="size-3.5" />}
        </IconButton>

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED.join(",")}
          className="sr-only"
          aria-label="Upload a profile photo"
          onChange={(event) => {
            void handleFile(event.target.files?.[0]);
            event.target.value = ""; // allow re-picking the same file
          }}
        />
      </div>

      <div className="min-w-0 space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-sm transition-all duration-200 hover:border-gold/50 hover:text-gold disabled:cursor-not-allowed disabled:opacity-60"
          >
            {processing ? (
              <Spinner className="size-3.5" />
            ) : (
              <Upload className="size-3.5" aria-hidden="true" />
            )}
            {value ? "Change photo" : "Upload photo"}
          </button>
          {value && (
            <button
              type="button"
              disabled={busy}
              onClick={() => onValueChange(null)}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm transition-colors duration-200 hover:border-destructive/40 hover:text-destructive disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Trash2 className="size-3.5" aria-hidden="true" />
              Remove
            </button>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {error ? (
            <span role="alert" className="text-destructive">
              {error}
            </span>
          ) : (
            <>JPG, PNG or WebP — auto-cropped to a neat square.</>
          )}
        </p>
      </div>
    </div>
  );
}
