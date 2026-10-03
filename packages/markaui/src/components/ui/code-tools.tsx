"use client"

import * as React from "react"

import { cn } from "../../lib/utils"
import { Badge } from "./badge"
import { CopyButton } from "./copy"

/* ---------------------------- SyntaxHighlighter ---------------------------- */

export type CodeTokenKind = "plain" | "keyword" | "string" | "comment" | "number"

export interface CodeToken {
  text: string
  kind: CodeTokenKind
}

const KEYWORDS = new Set([
  "const",
  "let",
  "var",
  "function",
  "return",
  "import",
  "from",
  "export",
  "default",
  "if",
  "else",
  "for",
  "of",
  "in",
  "await",
  "async",
  "new",
  "type",
  "interface",
  "extends",
  "class",
  "try",
  "catch",
])

const TOKEN_CLASS: Record<CodeTokenKind, string> = {
  plain: "",
  keyword: "text-primary font-medium",
  string: "text-success",
  comment: "text-muted-foreground italic",
  number: "text-gold",
}

function tokenizeLine(line: string): CodeToken[] {
  const tokens: CodeToken[] = []
  let buffer = ""
  let i = 0

  const flush = () => {
    if (buffer) {
      tokens.push({ text: buffer, kind: "plain" })
      buffer = ""
    }
  }

  while (i < line.length) {
    const char = line[i]

    // Line comment — rest of the line
    if (char === "/" && line[i + 1] === "/") {
      flush()
      tokens.push({ text: line.slice(i), kind: "comment" })
      return tokens
    }

    // Quoted strings (single, double, template)
    if (char === '"' || char === "'" || char === "`") {
      flush()
      let end = i + 1
      while (end < line.length && line[end] !== char) {
        if (line[end] === "\\") end++
        end++
      }
      tokens.push({ text: line.slice(i, Math.min(end + 1, line.length)), kind: "string" })
      i = end + 1
      continue
    }

    // Words (identifiers and keywords)
    const wordMatch = /^[A-Za-z_$][\w$]*/.exec(line.slice(i))
    if (wordMatch) {
      flush()
      tokens.push({ text: wordMatch[0], kind: KEYWORDS.has(wordMatch[0]) ? "keyword" : "plain" })
      i += wordMatch[0].length
      continue
    }

    // Numbers — only when not part of an identifier
    const numberMatch = /^\d+(?:\.\d+)?/.exec(line.slice(i))
    if (numberMatch && (i === 0 || !/[\w$]/.test(line[i - 1]))) {
      flush()
      tokens.push({ text: numberMatch[0], kind: "number" })
      i += numberMatch[0].length
      continue
    }

    buffer += char
    i++
  }

  flush()
  return tokens
}

export interface SyntaxHighlighterProps extends React.ComponentProps<"code"> {
  code: string
  /** Language label — informational only, drives data-language */
  language?: string
}

export function SyntaxHighlighter({
  code,
  language,
  className,
  ...props
}: SyntaxHighlighterProps) {
  const lines = code.replace(/\t/g, "  ").split("\n")
  return (
    <code
      data-slot="syntax-highlighter"
      data-language={language}
      className={cn("block font-mono text-xs leading-relaxed", className)}
      {...props}
    >
      {lines.map((line, lineIndex) => {
        const tokens = tokenizeLine(line)
        return (
          <span key={lineIndex} className="block whitespace-pre">
            {tokens.length === 0
              ? "\u00A0"
              : tokens.map((token, tokenIndex) => (
                  <span key={tokenIndex} className={TOKEN_CLASS[token.kind]}>
                    {token.text}
                  </span>
                ))}
          </span>
        )
      })}
    </code>
  )
}

/* -------------------------------- CodeSnippet ------------------------------ */

export interface CodeSnippetProps extends React.ComponentProps<"figure"> {
  code: string
  /** Language tag shown in the header (default "tsx") */
  language?: string
  /** Optional filename shown in the header */
  filename?: string
  /** Max height of the scrollable code area, any CSS value */
  maxHeight?: number | string
  /** Highlight the code with SyntaxHighlighter (default true) */
  highlight?: boolean
}

export function CodeSnippet({
  code,
  language = "tsx",
  filename,
  maxHeight,
  highlight = true,
  className,
  ...props
}: CodeSnippetProps) {
  return (
    <figure
      data-slot="code-snippet"
      className={cn("overflow-hidden rounded-xl border bg-card shadow-sm", className)}
      {...props}
    >
      <figcaption className="flex items-center gap-2 border-b bg-muted/40 px-3 py-2">
        {language && (
          <Badge variant="gold" className="uppercase">
            {language}
          </Badge>
        )}
        {filename && (
          <span className="min-w-0 flex-1 truncate font-mono text-xs text-muted-foreground">
            {filename}
          </span>
        )}
        {!filename && <span className="flex-1" />}
        <CopyButton value={code} tooltip="Copy code" size="sm" />
      </figcaption>
      <pre
        className="scrollbar-thin overflow-auto bg-muted/50 p-4"
        style={maxHeight !== undefined ? { maxHeight } : undefined}
      >
        {highlight ? (
          <SyntaxHighlighter code={code} language={language} />
        ) : (
          <code className="font-mono text-xs">{code}</code>
        )}
      </pre>
    </figure>
  )
}
