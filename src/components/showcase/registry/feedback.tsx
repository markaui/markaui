"use client"

import * as React from "react"
import { AlertCircle, Terminal } from "lucide-react"

import type { ComponentDoc } from "./types"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  ErrorMessage,
  InfoMessage,
  SuccessMessage,
  WarningMessage,
} from "@/components/ui/messages"
import {
  ErrorState,
  LoadingState,
  OfflineState,
} from "@/components/ui/state-views"

function DismissibleSuccessDemo() {
  const [visible, setVisible] = React.useState(true)
  if (!visible) {
    return (
      <div className="flex w-full max-w-lg items-center gap-3">
        <p className="text-sm text-muted-foreground">Message dismissed.</p>
        <Button variant="outline" size="sm" onClick={() => setVisible(true)}>
          Show again
        </Button>
      </div>
    )
  }
  return (
    <div className="w-full max-w-lg">
      <SuccessMessage title="RSVP confirmed" onDismiss={() => setVisible(false)}>
        Your seat for the sangeet night has been reserved. We look forward to
        celebrating with you!
      </SuccessMessage>
    </div>
  )
}

function DismissibleErrorDemo() {
  const [visible, setVisible] = React.useState(true)
  if (!visible) {
    return (
      <div className="flex w-full max-w-lg items-center gap-3">
        <p className="text-sm text-muted-foreground">Message dismissed.</p>
        <Button variant="outline" size="sm" onClick={() => setVisible(true)}>
          Show again
        </Button>
      </div>
    )
  }
  return (
    <div className="w-full max-w-lg">
      <ErrorMessage title="Payment failed" onDismiss={() => setVisible(false)}>
        We couldn't process your UPI payment. You have not been charged — please
        try again or use a different method.
      </ErrorMessage>
    </div>
  )
}

function ErrorStateDemo() {
  const [status, setStatus] = React.useState<"error" | "retrying">("error")
  const handleRetry = () => {
    setStatus("retrying")
    window.setTimeout(() => setStatus("error"), 1500)
  }
  if (status === "retrying") {
    return (
      <div className="w-full">
        <LoadingState label="Retrying…" />
      </div>
    )
  }
  return (
    <ErrorState
      className="w-full"
      title="Could not load your registry"
      description="We couldn't reach the gift registry service. Check your connection and try again."
      onRetry={handleRetry}
    />
  )
}

function OfflineStateDemo() {
  const [state, setState] = React.useState<"offline" | "connecting" | "online">(
    "offline"
  )
  const handleRetry = () => {
    setState("connecting")
    window.setTimeout(() => setState("online"), 1400)
  }
  if (state === "online") {
    return (
      <div className="flex w-full max-w-lg flex-col items-center gap-4">
        <SuccessMessage title="Back online" className="w-full">
          Your connection is restored. Happy shopping!
        </SuccessMessage>
        <Button variant="outline" size="sm" onClick={() => setState("offline")}>
          Simulate offline again
        </Button>
      </div>
    )
  }
  if (state === "connecting") {
    return (
      <div className="w-full">
        <LoadingState label="Reconnecting…" />
      </div>
    )
  }
  return (
    <div className="w-full">
      <OfflineState onRetry={handleRetry} />
    </div>
  )
}

export const feedbackDocs: ComponentDoc[] = [
  {
    id: "alert",
    name: "Alert",
    category: "feedback",
    description:
      "Classic alert block with an icon, title and description. Use variant destructive for errors.",
    aliases: [],
    demos: [
      {
        id: "variants",
        title: "Variants",
        description: "Default and destructive alerts, composed with title and description.",
        code: `import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal, AlertCircle } from "lucide-react"

<Alert>
  <Terminal />
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>
    Your mehendi ceremony RSVP is confirmed for Saturday at 6 PM.
  </AlertDescription>
</Alert>

<Alert variant="destructive">
  <AlertCircle />
  <AlertTitle>Payment failed</AlertTitle>
  <AlertDescription>
    Your card was declined. Please try another payment method.
  </AlertDescription>
</Alert>`,
        render: () => (
          <div className="grid w-full max-w-xl gap-3">
            <Alert>
              <Terminal />
              <AlertTitle>Heads up!</AlertTitle>
              <AlertDescription>
                Your mehendi ceremony RSVP is confirmed for Saturday at 6 PM.
              </AlertDescription>
            </Alert>
            <Alert variant="destructive">
              <AlertCircle />
              <AlertTitle>Payment failed</AlertTitle>
              <AlertDescription>
                Your card was declined. Please try another payment method.
              </AlertDescription>
            </Alert>
          </div>
        ),
        wide: true,
      },
    ],
    props: [
      {
        name: "variant",
        type: '"default" | "destructive"',
        default: '"default"',
        description: "Visual style of the alert.",
      },
      {
        name: "role",
        type: '"alert" | "status" | …',
        default: '"alert"',
        description: "Set automatically; override for polite live regions.",
      },
      {
        name: "className",
        type: "string",
        description: "Extra classes merged onto the root.",
      },
    ],
  },
  {
    id: "success-message",
    name: "SuccessMessage",
    category: "feedback",
    description:
      "Soft green confirmation banner with a CheckCircle2 icon and optional dismiss button, built on Alert.",
    aliases: [],
    demos: [
      {
        id: "dismissible",
        title: "Dismissible confirmation",
        description: "Pass onDismiss to render a close button.",
        code: `import { SuccessMessage } from "@/components/ui/messages"

<SuccessMessage
  title="RSVP confirmed"
  onDismiss={() => setVisible(false)}
>
  Your seat for the sangeet night has been reserved.
  We look forward to celebrating with you!
</SuccessMessage>`,
        render: () => <DismissibleSuccessDemo />,
      },
    ],
    props: [
      { name: "title", type: "string", description: "Serif heading above the body." },
      { name: "children", type: "ReactNode", description: "Message body text or nodes." },
      {
        name: "onDismiss",
        type: "() => void",
        description: "Renders a close button wired to this callback.",
      },
      { name: "className", type: "string", description: "Merged onto the alert root." },
    ],
  },
  {
    id: "error-message",
    name: "ErrorMessage",
    category: "feedback",
    description:
      "Destructive banner with an XCircle icon for failures, declines and validation summaries.",
    demos: [
      {
        id: "dismissible",
        title: "Dismissible error",
        description: "Soft destructive tone keeps forms calm while staying visible.",
        code: `import { ErrorMessage } from "@/components/ui/messages"

<ErrorMessage
  title="Payment failed"
  onDismiss={() => setVisible(false)}
>
  We couldn't process your UPI payment. You have not been
  charged — please try again or use a different method.
</ErrorMessage>`,
        render: () => <DismissibleErrorDemo />,
      },
    ],
    props: [
      { name: "title", type: "string", description: "Serif heading above the body." },
      { name: "children", type: "ReactNode", description: "Message body text or nodes." },
      { name: "onDismiss", type: "() => void", description: "Adds a close button." },
      { name: "className", type: "string", description: "Merged onto the alert root." },
    ],
  },
  {
    id: "warning-message",
    name: "WarningMessage",
    category: "feedback",
    description:
      "Amber caution banner with a TriangleAlert icon — stock limits, deadlines and soft blockers.",
    demos: [
      {
        id: "stock",
        title: "Low stock notice",
        code: `import { WarningMessage } from "@/components/ui/messages"

<WarningMessage title="Limited stock">
  Only 2 pieces of this Kanchipuram saree remain in the
  Crimson shade.
</WarningMessage>`,
        render: () => (
          <div className="w-full max-w-lg">
            <WarningMessage title="Limited stock">
              Only 2 pieces of this Kanchipuram saree remain in the Crimson shade.
            </WarningMessage>
          </div>
        ),
      },
    ],
    props: [
      { name: "title", type: "string", description: "Serif heading above the body." },
      { name: "children", type: "ReactNode", description: "Message body text or nodes." },
      { name: "onDismiss", type: "() => void", description: "Adds a close button." },
      { name: "className", type: "string", description: "Merged onto the alert root." },
    ],
  },
  {
    id: "info-message",
    name: "InfoMessage",
    category: "feedback",
    description:
      "Blue informational banner with an Info icon for shipping thresholds, hours and tips.",
    demos: [
      {
        id: "shipping",
        title: "Shipping info",
        code: `import { InfoMessage } from "@/components/ui/messages"

<InfoMessage title="Free shipping">
  Orders above ₹15,000 ship free across India with insured,
  trackable delivery.
</InfoMessage>`,
        render: () => (
          <div className="w-full max-w-lg">
            <InfoMessage title="Free shipping">
              Orders above ₹15,000 ship free across India with insured, trackable
              delivery.
            </InfoMessage>
          </div>
        ),
      },
    ],
    props: [
      { name: "title", type: "string", description: "Serif heading above the body." },
      { name: "children", type: "ReactNode", description: "Message body text or nodes." },
      { name: "onDismiss", type: "() => void", description: "Adds a close button." },
      { name: "className", type: "string", description: "Merged onto the alert root." },
    ],
  },
  {
    id: "loading-state",
    name: "LoadingState",
    category: "feedback",
    description:
      "Centered loading section — a large gold Spinner with a label, or an elegant skeleton when lines is set.",
    aliases: ["Loader"],
    demos: [
      {
        id: "spinner",
        title: "Spinner",
        code: `import { LoadingState } from "@/components/ui/state-views"

<LoadingState label="Curating your matches…" />`,
        render: () => (
          <div className="w-full">
            <LoadingState label="Curating your matches…" />
          </div>
        ),
      },
      {
        id: "skeleton",
        title: "Skeleton lines",
        description: "Pass lines to render a text-shaped placeholder instead.",
        code: `import { LoadingState } from "@/components/ui/state-views"

<LoadingState lines={4} />`,
        render: () => (
          <div className="w-full">
            <LoadingState lines={4} />
          </div>
        ),
      },
    ],
    props: [
      {
        name: "label",
        type: "string",
        default: '"Loading…"',
        description: "Accessible label and caption under the spinner.",
      },
      {
        name: "lines",
        type: "number",
        description: "Renders a skeleton with this many lines instead of the spinner.",
      },
      { name: "className", type: "string", description: "Merged onto the section." },
    ],
  },
  {
    id: "error-state",
    name: "ErrorState",
    category: "feedback",
    description:
      "Full-state error section with a destructive icon circle, serif title, description and a Retry button.",
    demos: [
      {
        id: "retry",
        title: "With retry",
        description: "Press Try again to see the retrying state loop back.",
        code: `import { ErrorState } from "@/components/ui/state-views"

<ErrorState
  title="Could not load your registry"
  description="We couldn't reach the gift registry service.
    Check your connection and try again."
  onRetry={handleRetry}
/>`,
        render: () => <ErrorStateDemo />,
        wide: true,
      },
    ],
    props: [
      { name: "title", type: "string", default: '"Something went wrong"', description: "Serif heading." },
      { name: "description", type: "string", description: "Secondary explanation text." },
      { name: "retryLabel", type: "string", default: '"Try again"', description: "Label for the retry button." },
      { name: "onRetry", type: "() => void", description: "Hides the button when omitted." },
      { name: "className", type: "string", description: "Merged onto the section." },
    ],
  },
  {
    id: "offline-state",
    name: "OfflineState",
    category: "feedback",
    description:
      "Dashed-border offline section with a WifiOff icon and a gold Try again action.",
    demos: [
      {
        id: "reconnect",
        title: "Reconnect simulation",
        description: "Press Try again to simulate coming back online.",
        code: `import { OfflineState } from "@/components/ui/state-views"

<OfflineState onRetry={handleRetry} />`,
        render: () => <OfflineStateDemo />,
        wide: true,
      },
    ],
    props: [
      { name: "title", type: "string", default: '"You\'re offline"', description: "Serif heading." },
      { name: "description", type: "string", description: "Secondary explanation text." },
      { name: "retryLabel", type: "string", default: '"Try again"', description: "Label for the retry button." },
      { name: "onRetry", type: "() => void", description: "Hides the button when omitted." },
      { name: "className", type: "string", description: "Merged onto the section." },
    ],
  },
]
