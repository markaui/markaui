import * as React from "react"
import { Quote as QuoteIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export interface QuoteProps extends React.ComponentProps<"figure"> {
  /** Person being quoted */
  author?: string
  /** Their role / city line */
  role?: string
  /** Optional avatar image source; falls back to initials */
  avatar?: string
  /** Show the decorative gold left border (default true) */
  leftBorder?: boolean
}

function initialsOf(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
}

function Quote({
  author,
  role,
  avatar,
  leftBorder = true,
  className,
  children,
  ...props
}: QuoteProps) {
  return (
    <figure
      data-slot="quote"
      className={cn("relative", leftBorder && "border-l-2 border-l-gold pl-6", className)}
      {...props}
    >
      <QuoteIcon
        aria-hidden="true"
        className="pointer-events-none absolute -top-3 right-0 size-16 text-gold/10"
      />
      <blockquote className="relative font-serif text-xl italic leading-relaxed text-foreground sm:text-2xl">
        “{children}”
      </blockquote>
      {(author || role) && (
        <figcaption className="relative mt-4 flex items-center gap-3">
          {avatar && (
            <Avatar>
              <AvatarImage src={avatar} alt={author ?? ""} />
              <AvatarFallback>{author ? initialsOf(author) : "S"}</AvatarFallback>
            </Avatar>
          )}
          <div>
            {author && <p className="text-sm font-medium text-foreground">{author}</p>}
            {role && <p className="text-xs text-muted-foreground">{role}</p>}
          </div>
        </figcaption>
      )}
    </figure>
  )
}

export { Quote }
