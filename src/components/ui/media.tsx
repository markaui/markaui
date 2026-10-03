"use client"

import * as React from "react"
import NextImage from "next/image"
import { Pause, Play } from "lucide-react"

import { cn } from "@/lib/utils"
import { IconButton } from "@/components/ui/icon-button"

/* ------------------------------------------------------------------ */
/* Image                                                               */
/* ------------------------------------------------------------------ */

export interface MediaImageProps extends React.ComponentProps<typeof NextImage> {
  /** Optional caption rendered below the image */
  caption?: React.ReactNode
}

function Image({ caption, className, ...props }: MediaImageProps) {
  return (
    <figure
      data-slot="media-image"
      className={cn(
        "bg-muted/30 overflow-hidden rounded-xl border",
        props.fill && "relative",
        className
      )}
    >
      <NextImage
        {...props}
        className={cn(props.fill ? "object-cover" : "h-auto w-full object-cover")}
      />
      {caption && (
        <figcaption className="border-t bg-muted/50 px-4 py-2.5 text-center text-xs text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

/* ------------------------------------------------------------------ */
/* Video                                                               */
/* ------------------------------------------------------------------ */

export type MediaVideoProps = React.ComponentProps<"video">

function Video({ className, controls = true, ...props }: MediaVideoProps) {
  return (
    <div
      data-slot="media-video"
      className={cn("bg-muted/30 overflow-hidden rounded-xl border", className)}
    >
      <video
        data-slot="media-video-element"
        className="aspect-video w-full"
        controls={controls}
        {...props}
      />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Audio                                                               */
/* ------------------------------------------------------------------ */

export interface MediaAudioProps
  extends Omit<React.ComponentProps<"div">, "title"> {
  /** Audio source; omit to show a disabled preview player */
  src?: string
  /** Track title */
  title?: React.ReactNode
  /** Static duration label, e.g. "3:24" */
  duration?: string
}

function Audio({ src, title, duration, className, ...props }: MediaAudioProps) {
  const audioRef = React.useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = React.useState(false)
  const [progress, setProgress] = React.useState(0)

  const toggle = () => {
    const el = audioRef.current
    if (!el) return
    if (playing) {
      el.pause()
    } else {
      void el.play().catch(() => {
        // Autoplay blocked or no source — stay paused.
      })
    }
  }

  const handleTimeUpdate = (event: React.SyntheticEvent<HTMLAudioElement>) => {
    const el = event.currentTarget
    const total = el.duration || 0
    setProgress(total > 0 ? el.currentTime / total : 0)
  }

  return (
    <div
      data-slot="media-audio"
      className={cn(
        "bg-card flex items-center gap-4 rounded-xl border p-4 shadow-sm",
        className
      )}
      {...props}
    >
      <IconButton
        variant="gold"
        size="lg"
        shape="circle"
        aria-label={playing ? "Pause" : "Play"}
        onClick={toggle}
        disabled={!src}
      >
        {playing ? (
          <Pause className="size-5" />
        ) : (
          <Play className="size-5 translate-x-px fill-current" />
        )}
      </IconButton>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <p className="truncate text-sm font-medium text-foreground">{title}</p>
          {duration && (
            <span className="shrink-0 font-mono text-xs text-muted-foreground">
              {duration}
            </span>
          )}
        </div>
        <div className="bg-muted mt-2.5 h-1.5 w-full overflow-hidden rounded-full">
          <div
            className="bg-primary h-full rounded-full transition-all duration-150"
            style={{ width: Math.round(progress * 100) + "%" }}
          />
        </div>
      </div>
      {src && (
        <audio
          ref={audioRef}
          src={src}
          hidden
          preload="metadata"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => {
            setPlaying(false)
            setProgress(0)
          }}
          onTimeUpdate={handleTimeUpdate}
        />
      )}
    </div>
  )
}

export { Audio, Image, Video }
