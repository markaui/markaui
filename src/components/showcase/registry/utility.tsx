import type { ComponentDoc } from "./types"

import { CopyButton, CopyableText } from "@/components/ui/copy"
import { CodeSnippet, SyntaxHighlighter } from "@/components/ui/code-tools"
import { KeyboardShortcut } from "@/components/ui/keyboard-shortcut"
import { RequestViewer, ResponseViewer } from "@/components/ui/inspect"
import {
  APIStatus,
  EnvironmentBadge,
  StatusIndicator,
  VersionBadge,
} from "@/components/ui/status"

const SNIPPET = `import { Button } from "@/components/ui/button"

// Gold submit button used across Saptapadi forms
export function GoldSubmit() {
  const attempts = 3
  return (
    <Button variant="gold" loading={attempts > 2}>
      Continue
    </Button>
  )
}`

const HIGHLIGHT_SAMPLE = `import { LoginForm } from "@/components/ui/auth-forms"

// Renders the premium sign-in experience
export function Page() {
  const maxAttempts = 5
  const greeting = "Welcome back to Saptapadi"
  return (
    <div className="min-h-svh">
      <LoginForm onSubmit={(data) => console.log(data.email)} />
    </div>
  )
}`

const POST_BODY = JSON.stringify(
  {
    email: "aarav.sharma@example.com",
    plan: "gold",
    preferences: { ageMin: 24, ageMax: 30, city: "Mumbai" },
  },
  null,
  2
)

const RESPONSE_BODY = JSON.stringify(
  {
    id: "usr_8241",
    name: "Aarav Sharma",
    verified: true,
    plan: "gold",
    matchScore: 92,
  },
  null,
  2
)

export const utilityDocs: ComponentDoc[] = [
  {
    id: "copy-button",
    name: "CopyButton",
    category: "utility",
    description:
      "Icon button that writes a value to the clipboard and swaps to a check for two seconds, with an optional tooltip.",
    aliases: ["Copy"],
    demos: [
      {
        id: "copy-variants",
        title: "Variants",
        description: "Click to copy — the icon flips to a check and reverts automatically.",
        code: `import { CopyButton } from "@/components/ui/copy"

<CopyButton value="npx shadcn add button" tooltip="Copy install command" />
<CopyButton value="MUM-2024-0418" variant="outline" tooltip="Copy booking id" />`,
        render: () => (
          <div className="flex flex-wrap items-center gap-3">
            <CopyButton value="npx shadcn add button" tooltip="Copy install command" />
            <CopyButton value="MUM-2024-0418" variant="outline" tooltip="Copy booking id" />
            <CopyButton value="gold" variant="gold" tooltip="Copy theme name" />
            <CopyButton value="primary" variant="ghost" tooltip="Copy token" />
          </div>
        ),
      },
    ],
    props: [
      {
        name: "value",
        type: "string",
        description: "Text placed on the clipboard.",
      },
      {
        name: "tooltip",
        type: "string",
        default: '"Copy"',
        description: "Tooltip label; flips to Copied! after a successful copy.",
      },
      {
        name: "variant",
        type: '"default" | "gold" | "outline" | "ghost" | …',
        default: '"ghost"',
        description: "IconButton variant.",
      },
      {
        name: "onCopied",
        type: "(value: string) => void",
        description: "Called after a successful copy.",
      },
    ],
  },
  {
    id: "copyable-text",
    name: "CopyableText",
    category: "utility",
    description:
      "Inline mono text chip with an attached mini copy button — great for ids, tokens and reference numbers.",
    demos: [
      {
        id: "copyable-text-demo",
        title: "Inline copy",
        description: "Enable truncate for long values.",
        code: `import { CopyableText } from "@/components/ui/copy"

<CopyableText value="SPT-9F2K-2QWP" />
<CopyableText value="usr_8241a7c3e5b9d2f6a1c4" truncate maxWidth="180px" />`,
        render: () => (
          <div className="flex w-full max-w-md flex-col items-start gap-3">
            <CopyableText value="SPT-9F2K-2QWP" />
            <CopyableText value="usr_8241a7c3e5b9d2f6a1c4e8" truncate maxWidth="180px" />
            <CopyableText value="support@saptapadi.in" />
          </div>
        ),
      },
    ],
    props: [
      {
        name: "value",
        type: "string",
        description: "Text shown and copied.",
      },
      {
        name: "truncate",
        type: "boolean",
        default: "false",
        description: "Ellipsize long values.",
      },
      {
        name: "maxWidth",
        type: "string",
        description: "CSS width applied when truncating.",
      },
      {
        name: "children",
        type: "React.ReactNode",
        description: "Optional custom display node (value is still what gets copied).",
      },
    ],
  },
  {
    id: "keyboard-shortcut",
    name: "KeyboardShortcut",
    category: "utility",
    description:
      "Renders a key sequence as mono kbd chips separated by “+”, in two sizes.",
    aliases: ["Kbd", "Shortcut"],
    demos: [
      {
        id: "shortcut-combos",
        title: "Combinations",
        description: "Single keys, chords and sequences.",
        code: `import { KeyboardShortcut } from "@/components/ui/keyboard-shortcut"

<KeyboardShortcut keys={["Cmd", "K"]} />
<KeyboardShortcut keys={["Shift", "Enter"]} size="md" />`,
        render: () => (
          <div className="flex flex-wrap items-center gap-4">
            <KeyboardShortcut keys={["⌘", "K"]} />
            <KeyboardShortcut keys={["Shift", "Enter"]} size="md" />
            <KeyboardShortcut keys={["G", "D"]} />
            <KeyboardShortcut keys={["Ctrl", "Alt", "S"]} size="md" />
          </div>
        ),
      },
    ],
    props: [
      {
        name: "keys",
        type: "string[]",
        description: "Key sequence rendered left-to-right.",
      },
      {
        name: "size",
        type: '"sm" | "md"',
        default: '"sm"',
        description: "Chip size.",
      },
    ],
  },
  {
    id: "version-badge",
    name: "VersionBadge",
    category: "utility",
    description:
      "Mono version pill with a release channel tint — stable, beta or alpha.",
    aliases: ["ReleaseBadge"],
    demos: [
      {
        id: "version-channels",
        title: "Channels",
        description: "Each channel gets its own token tint.",
        code: `import { VersionBadge } from "@/components/ui/status"

<VersionBadge version="v1.2.0" channel="stable" />
<VersionBadge version="v1.3.0-rc.2" channel="beta" />
<VersionBadge version="v0.9.0" channel="alpha" />`,
        render: () => (
          <div className="flex flex-wrap items-center gap-3">
            <VersionBadge version="v1.2.0" channel="stable" />
            <VersionBadge version="v1.3.0-rc.2" channel="beta" />
            <VersionBadge version="v0.9.0" channel="alpha" />
          </div>
        ),
      },
    ],
    props: [
      {
        name: "version",
        type: "string",
        default: '"v1.2.0"',
        description: "Version string.",
      },
      {
        name: "channel",
        type: '"stable" | "beta" | "alpha"',
        default: '"stable"',
        description: "Release channel — drives the tint.",
      },
    ],
  },
  {
    id: "api-status",
    name: "APIStatus",
    category: "utility",
    description:
      "Service health list with status dots, mono latency/uptime figures and tinted status badges.",
    aliases: ["ServiceStatus", "SystemStatus"],
    demos: [
      {
        id: "api-status-board",
        title: "Status board",
        description: "Operational, degraded and down services with latency and uptime.",
        code: `import { APIStatus } from "@/components/ui/status"

const services = [
  { name: "API gateway", status: "operational", latency: 142, uptime: 99.98 },
  { name: "Match engine", status: "degraded", latency: 512, uptime: 99.1 },
  { name: "Payments", status: "down" },
]

<APIStatus services={services} />`,
        render: () => (
          <div className="w-full max-w-md">
            <APIStatus
              services={[
                { name: "API gateway", status: "operational", latency: 142, uptime: 99.98 },
                { name: "Auth service", status: "operational", latency: 87, uptime: 99.95 },
                { name: "Match engine", status: "degraded", latency: 512, uptime: 99.12 },
                { name: "Payments", status: "down", uptime: 97.4 },
              ]}
            />
          </div>
        ),
      },
    ],
    props: [
      {
        name: "services",
        type: '{ name, status: "operational" | "degraded" | "down", latency?, uptime? }[]',
        description: "One row per service.",
      },
      {
        name: "title",
        type: "string",
        default: '"Service status"',
        description: "Card heading.",
      },
    ],
  },
  {
    id: "status-indicator",
    name: "StatusIndicator",
    category: "utility",
    description:
      "Presence dot with an optional label — online pulses gently; semantic statuses map to success/warning/destructive/muted tokens.",
    aliases: ["PresenceDot", "OnlineStatus"],
    demos: [
      {
        id: "status-all",
        title: "All statuses",
        description: "Seven states covering presence and semantics.",
        code: `import { StatusIndicator } from "@/components/ui/status"

<StatusIndicator status="online" label="Online" />
<StatusIndicator status="busy" label="In a call" />`,
        render: () => (
          <div className="grid w-full max-w-md grid-cols-1 gap-3 sm:grid-cols-2">
            <StatusIndicator status="online" label="Online" />
            <StatusIndicator status="away" label="Away" />
            <StatusIndicator status="busy" label="Busy" />
            <StatusIndicator status="offline" label="Offline" />
            <StatusIndicator status="success" label="Sync complete" />
            <StatusIndicator status="warning" label="High latency" />
            <StatusIndicator status="error" label="Failed" />
          </div>
        ),
      },
    ],
    props: [
      {
        name: "status",
        type: '"online" | "away" | "busy" | "offline" | "success" | "warning" | "error"',
        description: "Dot color; online also pulses.",
      },
      {
        name: "label",
        type: "string",
        description: "Optional text after the dot.",
      },
    ],
  },
  {
    id: "environment-badge",
    name: "EnvironmentBadge",
    category: "utility",
    description: "Uppercase tinted pill naming the current environment.",
    aliases: ["EnvBadge"],
    demos: [
      {
        id: "env-badges",
        title: "Environments",
        description: "Dev, staging and production tints.",
        code: `import { EnvironmentBadge } from "@/components/ui/status"

<EnvironmentBadge environment="dev" />
<EnvironmentBadge environment="staging" />
<EnvironmentBadge environment="prod" />`,
        render: () => (
          <div className="flex flex-wrap items-center gap-3">
            <EnvironmentBadge environment="dev" />
            <EnvironmentBadge environment="staging" />
            <EnvironmentBadge environment="prod" />
          </div>
        ),
      },
    ],
    props: [
      {
        name: "environment",
        type: '"dev" | "staging" | "prod"',
        default: '"dev"',
        description: "Environment to display.",
      },
    ],
  },
  {
    id: "code-snippet",
    name: "CodeSnippet",
    category: "utility",
    description:
      "Code block with a language tag, filename, one-click copy and a scrollable highlighted body.",
    demos: [
      {
        id: "snippet-basic",
        title: "Snippet",
        description: "The copy button grabs the raw source.",
        code: `import { CodeSnippet } from "@/components/ui/code-tools"

<CodeSnippet code={source} language="tsx" filename="gold-button.tsx" maxHeight={220} />`,
        render: () => (
          <CodeSnippet
            code={SNIPPET}
            language="tsx"
            filename="gold-button.tsx"
            maxHeight={240}
            className="w-full max-w-xl"
          />
        ),
      },
    ],
    props: [
      {
        name: "code",
        type: "string",
        description: "Raw source to display and copy.",
      },
      {
        name: "language",
        type: "string",
        default: '"tsx"',
        description: "Language tag in the header.",
      },
      {
        name: "filename",
        type: "string",
        description: "Optional filename shown next to the tag.",
      },
      {
        name: "maxHeight",
        type: "number | string",
        description: "Scroll height of the code area.",
      },
      {
        name: "highlight",
        type: "boolean",
        default: "true",
        description: "Tokenize with SyntaxHighlighter.",
      },
    ],
  },
  {
    id: "syntax-highlighter",
    name: "SyntaxHighlighter",
    category: "utility",
    description:
      "Tiny regex tokenizer for keywords, strings, comments and numbers — spans only, no dangerouslySetInnerHTML.",
    aliases: ["Highlighter"],
    demos: [
      {
        id: "highlight-sample",
        title: "Tokens",
        description: "Keywords take primary, strings success, comments muted italic, numbers gold.",
        wide: true,
        code: `import { SyntaxHighlighter } from "@/components/ui/code-tools"

<SyntaxHighlighter code={source} language="tsx" />`,
        render: () => (
          <div className="w-full overflow-hidden rounded-xl border">
            <div className="border-b bg-muted/40 px-3 py-2">
              <span className="font-mono text-xs text-muted-foreground">page.tsx</span>
            </div>
            <div className="bg-muted/50 p-4">
              <SyntaxHighlighter code={HIGHLIGHT_SAMPLE} language="tsx" />
            </div>
          </div>
        ),
      },
    ],
    props: [
      {
        name: "code",
        type: "string",
        description: "Source code, tokenized line by line.",
      },
      {
        name: "language",
        type: "string",
        description: "Label only — exposed as data-language.",
      },
      {
        name: "className",
        type: "string",
        description: "Extra classes for the code element.",
      },
    ],
  },
  {
    id: "request-viewer",
    name: "RequestViewer",
    category: "utility",
    description:
      "HTTP request inspector: colored method badge, truncated mono URL, key/value headers and a body pre.",
    aliases: ["HttpRequest"],
    demos: [
      {
        id: "request-examples",
        title: "Methods",
        description: "Method colors: GET success, POST info, PUT warning, DELETE destructive.",
        wide: true,
        code: `import { RequestViewer } from "@/components/ui/inspect"

<RequestViewer
  method="POST"
  url="/api/v1/matches"
  headers={[["Authorization", "Bearer sk_live_9f2k"], ["Content-Type", "application/json"]]}
  body={JSON.stringify({ city: "Mumbai" }, null, 2)}
/>`,
        render: () => (
          <div className="w-full space-y-8">
            <RequestViewer
              method="POST"
              url="/api/v1/matches?city=mumbai&plan=gold"
              headers={[
                ["Authorization", "Bearer sk_live_9f2k2qwp7tzx"],
                ["Content-Type", "application/json"],
                ["X-Request-Id", "req_c81e728d"],
              ]}
              body={POST_BODY}
            />
            <RequestViewer
              method="GET"
              url="/api/v1/profiles/usr_8241?expand=preferences,horoscope"
              headers={[["Authorization", "Bearer sk_live_9f2k2qwp7tzx"]]}
            />
          </div>
        ),
      },
    ],
    props: [
      {
        name: "method",
        type: '"GET" | "POST" | "PUT" | "DELETE" | "PATCH"',
        description: "Colored method badge.",
      },
      {
        name: "url",
        type: "string",
        description: "Endpoint — truncated with a title tooltip.",
      },
      {
        name: "headers",
        type: "[string, string][]",
        default: "[]",
        description: "Header key/value rows.",
      },
      {
        name: "body",
        type: "string",
        description: "Raw request body (preformatted JSON works best).",
      },
    ],
  },
  {
    id: "response-viewer",
    name: "ResponseViewer",
    category: "utility",
    description:
      "HTTP response inspector: status badge toned by status class, timing, headers and a body pre.",
    aliases: ["HttpResponse"],
    demos: [
      {
        id: "response-examples",
        title: "Status tones",
        description: "2xx success, 4xx warning, 5xx destructive.",
        wide: true,
        code: `import { ResponseViewer } from "@/components/ui/inspect"

<ResponseViewer
  response={{
    status: 200,
    statusText: "OK",
    timeMs: 142,
    headers: [["Content-Type", "application/json"]],
    body: responseBody,
  }}
/>`,
        render: () => (
          <div className="w-full space-y-8">
            <ResponseViewer
              response={{
                status: 200,
                statusText: "OK",
                timeMs: 142,
                headers: [
                  ["Content-Type", "application/json"],
                  ["X-RateLimit-Remaining", "118"],
                ],
                body: RESPONSE_BODY,
              }}
            />
            <ResponseViewer
              response={{
                status: 404,
                statusText: "Not Found",
                timeMs: 38,
                headers: [["Content-Type", "application/json"]],
                body: '{\n  "error": "profile_not_found",\n  "message": "No profile with id usr_0000"\n}',
              }}
            />
          </div>
        ),
      },
    ],
    props: [
      {
        name: "response",
        type: "{ status, statusText, timeMs, headers: [string, string][], body }",
        description: "Response payload to render.",
      },
      {
        name: "className",
        type: "string",
        description: "Extra classes for the wrapper.",
      },
    ],
  },
]
