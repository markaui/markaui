"use client"

import * as React from "react"
import ReactMarkdown, { type Components } from "react-markdown"

import { cn } from "../../lib/utils"

const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="mb-3 mt-6 font-serif text-2xl font-semibold tracking-tight text-foreground">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mb-2 mt-6 font-serif text-xl font-semibold tracking-tight text-foreground">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-2 mt-4 font-serif text-base font-semibold tracking-tight text-foreground">
      {children}
    </h3>
  ),
  p: ({ children }) => <p className="leading-relaxed">{children}</p>,
  a: ({ children, href }) => (
    <a
      href={href}
      className="font-medium text-gold underline underline-offset-4 hover:text-gold/80"
    >
      {children}
    </a>
  ),
  ul: ({ children }) => <ul className="my-3 list-disc space-y-1 pl-6">{children}</ul>,
  ol: ({ children }) => <ol className="my-3 list-decimal space-y-1 pl-6">{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
  blockquote: ({ children }) => (
    <blockquote className="my-4 border-l-2 border-l-gold pl-4 italic text-muted-foreground">
      {children}
    </blockquote>
  ),
  pre: ({ children }) => (
    <pre className="scrollbar-thin my-4 overflow-x-auto rounded-lg border bg-muted/50 p-4 text-xs [&>code]:rounded-none [&>code]:bg-transparent [&>code]:px-0 [&>code]:py-0">
      {children}
    </pre>
  ),
  code: ({ children, className }) => (
    <code className={cn("rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs", className)}>
      {children}
    </code>
  ),
  hr: () => <hr className="my-6 border-border" />,
}

export interface MarkdownProps {
  /** Markdown source string */
  children: string
  className?: string
}

function Markdown({ children, className }: MarkdownProps) {
  return (
    <div
      data-slot="markdown"
      className={cn("text-sm leading-relaxed [&>*:first-child]:mt-0", className)}
    >
      <ReactMarkdown components={markdownComponents}>{children}</ReactMarkdown>
    </div>
  )
}

export { Markdown }
