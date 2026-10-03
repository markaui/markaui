import * as React from "react"

import { cn } from "../../lib/utils"
import { Badge } from "./badge"

/* --------------------------------- Helpers --------------------------------- */

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH"

const METHOD_VARIANT: Record<HttpMethod, React.ComponentProps<typeof Badge>["variant"]> = {
  GET: "success",
  POST: "info",
  PUT: "warning",
  DELETE: "destructive",
  PATCH: "secondary",
}

function statusTone(status: number): React.ComponentProps<typeof Badge>["variant"] {
  if (status < 300) return "success"
  if (status < 400) return "info"
  if (status < 500) return "warning"
  return "destructive"
}

function HeadersTable({ headers }: { headers: [string, string][] }) {
  if (headers.length === 0) return null
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-medium text-muted-foreground">Headers</p>
      <div className="overflow-hidden rounded-lg border">
        {headers.map(([key, value]) => (
          <div
            key={key}
            className="flex items-center gap-3 border-b px-3 py-1.5 last:border-b-0"
          >
            <span className="w-32 shrink-0 truncate font-mono text-xs font-medium text-muted-foreground">
              {key}
            </span>
            <span className="min-w-0 flex-1 break-all font-mono text-xs">{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function BodyBlock({ body, label }: { body: string; label: string }) {
  if (!body) return null
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <pre className="scrollbar-thin max-h-40 overflow-auto rounded-lg bg-muted/50 p-3 font-mono text-xs leading-relaxed">
        {body}
      </pre>
    </div>
  )
}

/* ------------------------------- RequestViewer ----------------------------- */

export interface RequestViewerProps extends React.ComponentProps<"div"> {
  method: HttpMethod
  url: string
  headers?: [string, string][]
  body?: string
}

export function RequestViewer({
  method,
  url,
  headers = [],
  body,
  className,
  ...props
}: RequestViewerProps) {
  return (
    <div data-slot="request-viewer" className={cn("space-y-3", className)} {...props}>
      <div className="flex items-center gap-2.5">
        <Badge variant={METHOD_VARIANT[method]} className="font-mono">
          {method}
        </Badge>
        <span
          className="min-w-0 flex-1 truncate rounded-md bg-muted px-2 py-1 font-mono text-xs text-muted-foreground"
          title={url}
        >
          {url}
        </span>
      </div>
      <HeadersTable headers={headers} />
      <BodyBlock body={body ?? ""} label="Request body" />
    </div>
  )
}

/* ------------------------------- ResponseViewer ---------------------------- */

export interface HttpResponse {
  status: number
  statusText: string
  timeMs: number
  headers: [string, string][]
  body: string
}

export interface ResponseViewerProps extends React.ComponentProps<"div"> {
  response: HttpResponse
}

export function ResponseViewer({ response, className, ...props }: ResponseViewerProps) {
  return (
    <div data-slot="response-viewer" className={cn("space-y-3", className)} {...props}>
      <div className="flex flex-wrap items-center gap-2.5">
        <Badge variant={statusTone(response.status)} className="font-mono">
          {response.status} {response.statusText}
        </Badge>
        <span className="font-mono text-xs text-muted-foreground">{response.timeMs} ms</span>
      </div>
      <HeadersTable headers={response.headers} />
      <BodyBlock body={response.body} label="Response body" />
    </div>
  )
}
