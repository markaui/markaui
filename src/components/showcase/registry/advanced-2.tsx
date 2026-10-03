"use client"

import * as React from "react"

import type { ComponentDoc } from "./types"

import { ActivityLog } from "@/components/ui/activity-log"
import type { ActivityEntry } from "@/components/ui/activity-log"
import { CalendarScheduler } from "@/components/ui/calendar-scheduler"
import type { SchedulerEvent } from "@/components/ui/calendar-scheduler"
import { CodeEditor } from "@/components/ui/code-editor"
import { DiffViewer } from "@/components/ui/diff-viewer"
import { FileManager } from "@/components/ui/file-manager"
import type { FileManagerItem } from "@/components/ui/file-manager"
import { JsonViewer } from "@/components/ui/json-viewer"
import { KanbanBoard } from "@/components/ui/kanban"
import type { KanbanColumnData } from "@/components/ui/kanban"
import { LogViewer } from "@/components/ui/log-viewer"
import type { LogEntry } from "@/components/ui/log-viewer"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { Terminal } from "@/components/ui/terminal"

/* ====================================================================== */
/* Seed data (fixed — no randomness, hydration safe)                      */
/* ====================================================================== */

const initialKanbanColumns: KanbanColumnData[] = [
  {
    id: "new",
    title: "New Matches",
    tone: "gold",
    cards: [
      {
        id: "m1",
        title: "Leo Parker",
        description: "32 · Mumbai · Product Designer",
        tag: "94% match",
        priority: "high",
        dueDate: "Today",
      },
      {
        id: "m2",
        title: "Hannah Reed",
        description: "29 · Bengaluru · Kathak dancer",
        tag: "Verified",
        priority: "medium",
      },
      {
        id: "m3",
        title: "David Sterling",
        description: "34 · Jaipur · Family business",
        priority: "low",
      },
    ],
  },
  {
    id: "chat",
    title: "Conversations",
    tone: "primary",
    cards: [
      {
        id: "c1",
        title: "Chat with Sophia Moore",
        description: "Horoscopes matched — schedule the first call.",
        priority: "medium",
        dueDate: "Tomorrow",
      },
      {
        id: "c2",
        title: "Intro call · Jane & John",
        description: "Families introduced by Pandit Ramakant-ji.",
        tag: "Family approved",
        priority: "high",
      },
    ],
  },
  {
    id: "meet",
    title: "Planned Meetups",
    tone: "success",
    cards: [
      {
        id: "p1",
        title: "Sunday brunch, Bandra",
        description: "Both families meet over chai at 11 AM.",
        priority: "high",
        dueDate: "Sun, 11:00 AM",
      },
      {
        id: "p2",
        title: "Temple visit with Wilsons",
        description: "Siddhivinayak darshan followed by lunch.",
        tag: "Confirmed",
        priority: "medium",
        dueDate: "Next Sat",
      },
    ],
  },
]

const schedulerEvents: SchedulerEvent[] = [
  { id: "e1", title: "Kundli call with Pandit-ji", day: 0, start: 10, duration: 1, color: "gold" },
  { id: "e2", title: "Family intro — Wilson-ji", day: 0, start: 17, duration: 2, color: "primary" },
  { id: "e3", title: "Pre-wedding photoshoot", day: 1, start: 9, duration: 3, color: "info" },
  { id: "e4", title: "Mehendi artist trial", day: 2, start: 12, duration: 2, color: "success" },
  { id: "e5", title: "Venue visit · Udaipur palace", day: 3, start: 11, duration: 2, color: "primary" },
  { id: "e6", title: "Catering tasting", day: 4, start: 13, duration: 1, color: "destructive" },
  { id: "e7", title: "Sangeet choreography", day: 5, start: 16, duration: 2, color: "gold" },
  { id: "e8", title: "Saptapadi rehearsal", day: 6, start: 18, duration: 2, color: "success" },
]

const fileItems: FileManagerItem[] = [
  { id: "f1", name: "Wedding Photos", type: "folder" },
  { id: "f2", name: "Vendor Contracts", type: "folder" },
  { id: "f3", name: "guest-list-final.xlsx", type: "sheet", size: "48 KB", modified: "Feb 12, 2025" },
  { id: "f4", name: "engagement-ceremony.jpg", type: "image", size: "2.4 MB", modified: "Feb 10, 2025" },
  { id: "f5", name: "horoscope-report.pdf", type: "pdf", size: "1.1 MB", modified: "Feb 9, 2025" },
  { id: "f6", name: "venue-shortlist.docx", type: "doc", size: "320 KB", modified: "Feb 8, 2025" },
  { id: "f7", name: "sangeet-playlist.xlsx", type: "sheet", size: "96 KB", modified: "Feb 7, 2025" },
  { id: "f8", name: "Mehendi Designs", type: "folder" },
  { id: "f9", name: "banquet-menu-tasting.pdf", type: "pdf", size: "640 KB", modified: "Feb 5, 2025" },
  { id: "f10", name: "haldi-ceremony.jpg", type: "image", folder: "Wedding Photos", size: "3.1 MB", modified: "Feb 2, 2025" },
  { id: "f11", name: "sangeet-night.jpg", type: "image", folder: "Wedding Photos", size: "2.8 MB", modified: "Feb 2, 2025" },
  { id: "f12", name: "decorator-agreement.pdf", type: "pdf", folder: "Vendor Contracts", size: "412 KB", modified: "Jan 28, 2025" },
]

const bioHtml =
  "<p>Namaste! I am <strong>Aditi Perry</strong>, 27, a Kathak dancer from Lucknow.</p>" +
  "<p>My family values <em>simplicity</em>, laughter and good food.</p>" +
  "<ul><li>Vegetarian household</li><li>Sunday satsang together</li></ul>"

const editorSnippet = [
  "type Profile = {",
  "  id: string",
  "  name: string",
  "  matchScore: number",
  "}",
  "",
  "export function MatchCard({ profile }: { profile: Profile }) {",
  "  return (",
  '    <div className="rounded-lg border p-4">',
  '      <h3 className="font-serif">{profile.name}</h3>',
  "      <span>{profile.matchScore}% match</span>",
  "    </div>",
  "  )",
  "}",
].join("\n")

const profileData = {
  id: "SAP-2025-0847",
  name: "Ella Hayes",
  age: 28,
  city: "Pune",
  verified: true,
  gotra: null,
  horoscope: {
    nakshatra: "Rohini",
    rashi: "Vririsbha",
    manglik: false,
    matchScore: 92,
  },
  preferences: {
    ageRange: [26, 32],
    cities: ["Pune", "Mumbai", "Nashik"],
    openToRemarriage: false,
  },
  family: {
    father: "Prof. S. Hayes",
    mother: "Dr. K. Hayes",
    siblings: 1,
    contact: "+91 98••• •••••",
  },
  subscription: {
    plan: "Gold Annual",
    renewsOn: "2025-11-30",
    price: 4999,
  },
}

const oldBio =
  "Namaste! I am a software engineer based in Pune.\n" +
  "I enjoy quiet weekends, filter coffee and long drives.\n" +
  "Looking for a partner who values family and laughter.\n" +
  "Caste: No bar. Gotra: Kashyap."

const newBio =
  "Namaste! I am a senior software engineer based in Pune.\n" +
  "I enjoy quiet weekends, filter coffee, road trips and Hindustani music.\n" +
  "Looking for a partner who values family, laughter and new adventures.\n" +
  "Caste: No bar. Gotra: Kashyap.\n" +
  "Horoscope available on request."

const logEntries: LogEntry[] = [
  { id: "l1", time: "09:41:22", level: "info", message: "Match engine synced 1,248 new profiles" },
  { id: "l2", time: "09:41:35", level: "debug", message: "Redis cache warm-up completed in 412ms" },
  { id: "l3", time: "09:42:03", level: "info", message: "Sophia & Noah started a conversation" },
  { id: "l4", time: "09:44:19", level: "warn", message: "Photo moderation queue backlog: 32 items" },
  { id: "l5", time: "09:47:56", level: "error", message: "Payment gateway timeout on order SAP-8842" },
  { id: "l6", time: "09:48:10", level: "info", message: "Retry succeeded for order SAP-8842" },
  { id: "l7", time: "09:51:44", level: "debug", message: "Horoscope model batch inference: p95 = 0.9s" },
  { id: "l8", time: "09:53:27", level: "warn", message: "David Sterling profile flagged for review" },
  { id: "l9", time: "09:58:02", level: "error", message: "SMS OTP provider unreachable — failing over" },
  { id: "l10", time: "10:00:00", level: "info", message: "Daily kundli reports dispatched (1,930)" },
]

const terminalLines = [
  "Saptapadi Matchmaker CLI v2.4 — shubh labh!",
  'Type "help" to list the available commands.',
]

const activityEntries: ActivityEntry[] = [
  {
    id: "a1",
    type: "match",
    actor: { name: "Shreya Sanders" },
    action: "shortlisted",
    target: "Liam Carter",
    time: "8:24 PM",
    day: "Today",
    ip: "103.21.58.14",
    device: "iPhone 15 · Mumbai",
  },
  {
    id: "a2",
    type: "message",
    actor: { name: "Liam Carter" },
    action: "replied to",
    target: "Shreya Sanders",
    time: "6:02 PM",
    day: "Today",
    ip: "49.36.180.22",
    device: "Chrome · Bengaluru",
  },
  {
    id: "a3",
    type: "verification",
    actor: { name: "Jane Smith" },
    action: "completed verification for",
    target: "Aadhaar + phone",
    time: "2:47 PM",
    day: "Today",
    ip: "117.99.44.8",
    device: "Android · Chennai",
  },
  {
    id: "a4",
    type: "payment",
    actor: { name: "Jack Miller" },
    action: "upgraded to",
    target: "Gold Annual plan",
    time: "11:15 PM",
    day: "Yesterday",
    ip: "182.70.9.101",
    device: "MacBook · Delhi",
  },
  {
    id: "a5",
    type: "profile",
    actor: { name: "Hannah Reed" },
    action: "updated",
    target: "partner preferences",
    time: "9:38 AM",
    day: "Yesterday",
    ip: "157.32.12.77",
    device: "Safari · Hyderabad",
  },
  {
    id: "a6",
    type: "event",
    actor: { name: "Pandit Ramakant" },
    action: "scheduled",
    target: "Saptapadi muhurat · Mar 2",
    time: "8:50 AM",
    day: "Yesterday",
    ip: "10.0.4.21",
    device: "Studio desk · Varanasi",
  },
]

/* ====================================================================== */
/* Interactive demo wrappers                                              */
/* ====================================================================== */

function KanbanDemo() {
  const [columns, setColumns] = React.useState(initialKanbanColumns)
  return (
    <div className="space-y-3">
      <KanbanBoard columns={columns} onCardsChange={setColumns} />
      <p className="text-xs text-muted-foreground">
        Drag cards between columns — drop targets highlight and the count badges update live.
      </p>
    </div>
  )
}

function CalendarDemo() {
  const [selected, setSelected] = React.useState<string | null>(null)
  return (
    <div className="space-y-3">
      <CalendarScheduler
        events={schedulerEvents}
        weekLabel="16 – 22 February 2025"
        onEventClick={(event) => setSelected(event.title)}
      />
      <p className="text-xs text-muted-foreground">
        {selected ? "Selected: " + selected : "Click any event to inspect it."}
      </p>
    </div>
  )
}

function RichTextDemo() {
  const [chars, setChars] = React.useState(0)
  return (
    <div className="space-y-3">
      <RichTextEditor
        defaultValue={bioHtml}
        placeholder="Write your matrimonial bio…"
        onChange={(html) => setChars(html.replace(/<[^>]*>/g, "").trim().length)}
      />
      <p className="text-xs text-muted-foreground">
        {chars === 0
          ? "Start typing — the counter updates as you write."
          : chars + " characters of your bio written."}
      </p>
    </div>
  )
}

function CodeEditorDemo() {
  const [lineCount, setLineCount] = React.useState(editorSnippet.split("\n").length)
  return (
    <div className="space-y-3">
      <CodeEditor
        defaultValue={editorSnippet}
        language="TypeScript"
        minLines={14}
        maxLines={14}
        onChange={(value) => setLineCount(value.split("\n").length)}
      />
      <p className="text-xs text-muted-foreground">{lineCount} lines — Tab inserts two spaces.</p>
    </div>
  )
}

/* ====================================================================== */
/* Registry docs                                                          */
/* ====================================================================== */

export const advanced_2Docs: ComponentDoc[] = [
  {
    id: "kanban",
    name: "Kanban",
    category: "advanced",
    description:
      "Match-pipeline kanban board with native HTML5 drag & drop — column tone dots, count badges, priority chips and grab/grabbing cursors. Controlled via onCardsChange, or fully self-contained without it.",
    aliases: ["KanbanBoard"],
    demos: [
      {
        id: "match-pipeline",
        title: "Match pipeline",
        description: "Drag cards across New Matches, Conversations and Planned Meetups.",
        code: `import { useState } from "react"
import { KanbanBoard } from "@/components/ui/kanban"

const initialColumns = [
  {
    id: "new",
    title: "New Matches",
    tone: "gold",
    cards: [
      { id: "m1", title: "Leo Parker", description: "32 · Mumbai", tag: "94% match", priority: "high", dueDate: "Today" },
      { id: "m2", title: "Hannah Reed", description: "29 · Bengaluru", priority: "medium" },
    ],
  },
  { id: "chat", title: "Conversations", tone: "primary", cards: [] },
  { id: "meet", title: "Planned Meetups", tone: "success", cards: [] },
]

export function MatchPipeline() {
  const [columns, setColumns] = useState(initialColumns)
  return <KanbanBoard columns={columns} onCardsChange={setColumns} />
}`,
        render: () => <KanbanDemo />,
        wide: true,
      },
    ],
    props: [
      { name: "columns", type: "KanbanColumnData[]", default: "—", description: "Column set with id, title, tone and cards." },
      { name: "onCardsChange", type: "(columns: KanbanColumnData[]) => void", default: "—", description: "Fires after each drag-move. When omitted the board keeps internal state." },
      { name: "column.tone", type: '"primary" | "gold" | "success" | "info" | "warning" | "destructive"', default: '"primary"', description: "Header dot + drag-over accent tone." },
      { name: "card.priority", type: '"low" | "medium" | "high"', default: "—", description: "Renders a priority badge on the card." },
      { name: "card.tag", type: "string", default: "—", description: "Small gold badge, e.g. “Verified”." },
      { name: "card.dueDate", type: "string", default: "—", description: "Due label rendered with a clock icon." },
      { name: "card.avatar", type: "string", default: "—", description: "Avatar image URL; falls back to the title initial." },
    ],
  },
  {
    id: "calendar-scheduler",
    name: "CalendarScheduler",
    category: "advanced",
    description:
      "Static week-view scheduler: 7 serif day columns × time rows (8:00–20:00) with absolutely positioned tinted events, an optional live now-indicator and prev/next chrome for a fixed weekLabel.",
    demos: [
      {
        id: "wedding-week",
        title: "Wedding week",
        description: "Eight muhurat-to-tasting events across the week.",
        code: `import { CalendarScheduler } from "@/components/ui/calendar-scheduler"

const events = [
  { id: "e1", title: "Kundli call with Pandit-ji", day: 0, start: 10, duration: 1, color: "gold" },
  { id: "e2", title: "Family intro — Wilson-ji", day: 0, start: 17, duration: 2, color: "primary" },
  { id: "e3", title: "Mehendi artist trial", day: 2, start: 12, duration: 2, color: "success" },
  { id: "e4", title: "Sangeet choreography", day: 5, start: 16, duration: 2, color: "gold" },
]

export function WeddingWeek() {
  return (
    <CalendarScheduler
      events={events}
      weekLabel="16 – 22 February 2025"
      onEventClick={(event) => console.log(event.title)}
    />
  )
}`,
        render: () => <CalendarDemo />,
        wide: true,
      },
    ],
    props: [
      { name: "events", type: "SchedulerEvent[]", default: "—", description: "Events with id, title, day (0–6), start hour and duration." },
      { name: "weekLabel", type: "string", default: "—", description: "Static serif label shown in the header, e.g. “16 – 22 February”." },
      { name: "onEventClick", type: "(event: SchedulerEvent) => void", default: "—", description: "Fired when an event block is clicked." },
      { name: "color", type: '"primary" | "gold" | "success" | "info" | "destructive"', default: '"primary"', description: "Event tint + left border tone." },
      { name: "hourHeight", type: "number", default: "56", description: "Pixel height of one hour row." },
      { name: "startHour / endHour", type: "number", default: "8 / 20", description: "Visible time window." },
      { name: "showNowIndicator", type: "boolean", default: "true", description: "Live red current-time line (client-measured)." },
      { name: "onPrevWeek / onNextWeek", type: "() => void", default: "—", description: "Optional navigation; buttons render disabled when absent." },
    ],
  },
  {
    id: "file-manager",
    name: "FileManager",
    category: "advanced",
    description:
      "Documents & photos manager with breadcrumb navigation, live search filter, grid/list view toggle, tone-colored type icons and selection highlight — self-contained folder state.",
    demos: [
      {
        id: "wedding-drive",
        title: "Wedding drive",
        description: "Nine root items — double-click a folder to step inside, use breadcrumbs to go back.",
        code: `import { FileManager } from "@/components/ui/file-manager"

const items = [
  { id: "f1", name: "Wedding Photos", type: "folder" },
  { id: "f2", name: "Vendor Contracts", type: "folder" },
  { id: "f3", name: "guest-list-final.xlsx", type: "sheet", size: "48 KB", modified: "Feb 12, 2025" },
  { id: "f4", name: "horoscope-report.pdf", type: "pdf", size: "1.1 MB", modified: "Feb 9, 2025" },
  { id: "f5", name: "haldi-ceremony.jpg", type: "image", folder: "Wedding Photos", size: "3.1 MB" },
]

export function WeddingDrive() {
  return (
    <FileManager
      items={items}
      onOpen={(item) => console.log("opened", item.name)}
    />
  )
}`,
        render: () => <FileManager items={fileItems} />,
        wide: true,
      },
    ],
    props: [
      { name: "items", type: "FileManagerItem[]", default: "—", description: "Files & folders with type, size and modified metadata." },
      { name: "item.type", type: '"folder" | "image" | "pdf" | "doc" | "sheet"', default: "—", description: "Drives the tone-colored lucide icon." },
      { name: "item.folder", type: "string", default: '"" (root)', description: "Joined parent path, e.g. “Wedding Photos” — scopes the item to that breadcrumb." },
      { name: "path / defaultPath", type: "string[]", default: "[]", description: "Controlled or initial breadcrumb path of folder names." },
      { name: "onPathChange", type: "(path: string[]) => void", default: "—", description: "Fires when breadcrumbs or folders change the path." },
      { name: "onSelect", type: "(item: FileManagerItem) => void", default: "—", description: "Single-click selection." },
      { name: "onOpen", type: "(item: FileManagerItem) => void", default: "—", description: "Double-click; folders navigate first." },
    ],
  },
  {
    id: "rich-text-editor",
    name: "RichTextEditor",
    category: "advanced",
    description:
      "Beta contentEditable editor for bios and notes — execCommand toolbar (bold, italic, underline, strike, lists, quote, link, undo), sticky-look border-b toolbar, gold blockquotes and a data-placeholder empty state.",
    demos: [
      {
        id: "bio-editor",
        title: "Matrimonial bio editor",
        description: "Prefilled bio with a live character counter.",
        code: `import { useState } from "react"
import { RichTextEditor } from "@/components/ui/rich-text-editor"

export function BioEditor() {
  const [html, setHtml] = useState(
    "<p>Namaste! I am <strong>Aditi Perry</strong>, 27, from Lucknow.</p>"
  )
  return (
    <RichTextEditor
      value={html}
      onChange={setHtml}
      placeholder="Write your matrimonial bio…"
    />
  )
}`,
        render: () => <RichTextDemo />,
        wide: true,
      },
    ],
    props: [
      { name: "value", type: "string", default: "—", description: "Controlled HTML string." },
      { name: "defaultValue", type: "string", default: '""', description: "Initial HTML for uncontrolled usage." },
      { name: "onChange", type: "(html: string) => void", default: "—", description: "Emitted on input and blur." },
      { name: "placeholder", type: "string", default: "—", description: "Shown via data-placeholder while the editor is empty." },
      { name: "toolbar", type: "—", default: "9 tools", description: "Bold, italic, underline, strikethrough, bullet/numbered list, blockquote, link and undo." },
      { name: "—", type: "beta", default: "—", description: "Built on document.execCommand — fine for short rich text, not a ProseMirror replacement." },
    ],
  },
  {
    id: "code-editor",
    name: "CodeEditor",
    category: "advanced",
    description:
      "Minimal mono code surface: scroll-synced line-number gutter, Tab-to-two-spaces, language chip header, min/max line clamps and a focus-ring wrapper. No syntax highlighting by design.",
    demos: [
      {
        id: "profile-snippet",
        title: "Profile snippet",
        description: "A tiny TSX match-card component, editable with Tab support.",
        code: `import { useState } from "react"
import { CodeEditor } from "@/components/ui/code-editor"

const snippet = "type Profile = {\\n  id: string\\n  name: string\\n}"

export function SnippetEditor() {
  const [code, setCode] = useState(snippet)
  return (
    <CodeEditor
      value={code}
      onChange={setCode}
      language="TypeScript"
      minLines={12}
      maxLines={18}
    />
  )
}`,
        render: () => <CodeEditorDemo />,
        wide: true,
      },
    ],
    props: [
      { name: "value", type: "string", default: "—", description: "Controlled code string." },
      { name: "defaultValue", type: "string", default: '""', description: "Initial code for uncontrolled usage." },
      { name: "onChange", type: "(value: string) => void", default: "—", description: "Emitted on every edit." },
      { name: "language", type: "string", default: "—", description: "Gold chip label in the header, e.g. “TypeScript”." },
      { name: "minLines", type: "number", default: "10", description: "Minimum viewport height in lines." },
      { name: "maxLines", type: "number", default: "—", description: "Clamps the viewport; the gutter syncs with internal scrolling." },
    ],
  },
  {
    id: "json-viewer",
    name: "JsonViewer",
    category: "advanced",
    description:
      "Recursive collapsible JSON tree with type-colored values (primary keys, gold numbers, success strings, info booleans, muted null), indent guides, chevron collapse state and a one-click copy button.",
    demos: [
      {
        id: "profile-json",
        title: "Profile payload",
        description: "Nested matrimonial profile object — collapse any branch.",
        code: `import { JsonViewer } from "@/components/ui/json-viewer"

const profile = {
  name: "Ella Hayes",
  verified: true,
  horoscope: { nakshatra: "Rohini", matchScore: 92 },
  cities: ["Pune", "Mumbai"],
}

export function ProfilePayload() {
  return (
    <JsonViewer
      data={profile}
      label="profile.json"
      maxHeight={360}
      defaultCollapsedDepth={1}
    />
  )
}`,
        render: () => (
          <JsonViewer
            data={profileData}
            label="emma-hayes.json"
            maxHeight={380}
          />
        ),
        wide: true,
      },
    ],
    props: [
      { name: "data", type: "unknown", default: "—", description: "Any JSON-serializable value — objects, arrays and primitives." },
      { name: "label", type: "string", default: '"data.json"', description: "Header filename chip." },
      { name: "maxHeight", type: "number", default: "—", description: "Scrollable viewport height (scrollbar-thin)." },
      { name: "defaultCollapsedDepth", type: "number", default: "0", description: "Collapse branches at this depth or deeper on first render." },
      { name: "copy", type: "—", default: "built-in", description: "Top-right button copies pretty-printed JSON and flashes a check." },
    ],
  },
  {
    id: "diff-viewer",
    name: "DiffViewer",
    category: "advanced",
    description:
      "Line diff with a real LCS dynamic-programming core — unified view by default, optional two-column split, destructive-green/red line tints with −/+ prefixes and a +n −m count header.",
    demos: [
      {
        id: "bio-revision",
        title: "Bio revision",
        description: "Before/after of a member's matrimonial bio.",
        code: `import { DiffViewer } from "@/components/ui/diff-viewer"

const oldBio = "I enjoy quiet weekends, filter coffee and long drives."
const newBio = "I enjoy quiet weekends, filter coffee, road trips and music."

export function BioRevision() {
  return (
    <DiffViewer
      oldText={oldBio}
      newText={newBio}
      filename="bio.txt"
    />
  )
}`,
        render: () => <DiffViewer oldText={oldBio} newText={newBio} filename="bio.txt" />,
        wide: true,
      },
      {
        id: "bio-split",
        title: "Split view",
        description: "The same diff rendered side-by-side.",
        code: `import { DiffViewer } from "@/components/ui/diff-viewer"

export function BioSplit() {
  return <DiffViewer oldText={oldBio} newText={newBio} split filename="bio.txt" />
}`,
        render: () => <DiffViewer oldText={oldBio} newText={newBio} split filename="bio.txt" />,
        wide: true,
      },
    ],
    props: [
      { name: "oldText", type: "string", default: "—", description: "Original multi-line text." },
      { name: "newText", type: "string", default: "—", description: "Revised multi-line text." },
      { name: "split", type: "boolean", default: "false", description: "Two-column old/new view instead of unified." },
      { name: "filename", type: "string", default: "—", description: "Mono filename shown in the header." },
      { name: "engine", type: "—", default: "LCS DP", description: "O(n·m) dynamic programming; falls back to per-index compare past ~1000 lines." },
    ],
  },
  {
    id: "log-viewer",
    name: "LogViewer",
    category: "advanced",
    description:
      "Mono log stream with level filter chips (All/Info/Warn/Error/Debug with counts), colored level badges, muted timestamps, an autoscroll toggle and a scrollbar-thin capped viewport.",
    demos: [
      {
        id: "matchmaker-logs",
        title: "Matchmaker logs",
        description: "Ten entries of mixed severity from the match engine.",
        code: `import { LogViewer } from "@/components/ui/log-viewer"

const entries = [
  { id: "l1", time: "09:41:22", level: "info", message: "Match engine synced 1,248 new profiles" },
  { id: "l2", time: "09:47:56", level: "error", message: "Payment gateway timeout on order SAP-8842" },
  { id: "l3", time: "09:51:44", level: "debug", message: "Horoscope model batch inference: p95 = 0.9s" },
]

export function MatchmakerLogs() {
  return <LogViewer entries={entries} maxHeight={320} />
}`,
        render: () => <LogViewer entries={logEntries} maxHeight={320} />,
        wide: true,
      },
    ],
    props: [
      { name: "entries", type: "LogEntry[]", default: "—", description: "Log rows with id, time, level and message." },
      { name: "entry.level", type: '"info" | "warn" | "error" | "debug"', default: "—", description: "Drives the badge variant and filter counts." },
      { name: "maxHeight", type: "number", default: "—", description: "Scrollable viewport height (scrollbar-thin)." },
      { name: "defaultFilter", type: '"all" | LogLevel', default: '"all"', description: "Initially active level chip." },
      { name: "autoscroll", type: "boolean (internal)", default: "true", description: "Sticks to the bottom as new entries arrive; toggle in the header." },
    ],
  },
  {
    id: "terminal",
    name: "Terminal",
    category: "advanced",
    description:
      "Fake shell with macOS traffic-light chrome, gold ❯ prompt, history via arrow keys and built-in help / clear / echo / date commands. Wrapped in a .dark token scope so it always renders dark.",
    demos: [
      {
        id: "matchmaker-cli",
        title: "Matchmaker CLI",
        description: "Type help, echo Shubh Vivah or date — clear empties the buffer.",
        code: `import { Terminal } from "@/components/ui/terminal"

export function MatchmakerCli() {
  return (
    <Terminal
      lines={[
        "Saptapadi Matchmaker CLI v2.4 — shubh labh!",
        'Type "help" to list the available commands.',
      ]}
      maxHeight={300}
      onCommand={(command) => console.log(command)}
    />
  )
}`,
        render: () => <Terminal lines={terminalLines} maxHeight={300} />,
        wide: true,
      },
    ],
    props: [
      { name: "lines", type: "string[]", default: "[]", description: "Initial output lines." },
      { name: "onCommand", type: "(command: string) => void", default: "—", description: "Hook fired with every submitted command string." },
      { name: "title", type: "string", default: '"saptapadi — matchmaker@studio"', description: "Chrome title next to the traffic lights." },
      { name: "maxHeight", type: "number", default: "—", description: "Scrollable output viewport height." },
      { name: "commands", type: "built-in", default: "—", description: "help, clear, echo <text>, date — anything else answers “command not found”." },
    ],
  },
  {
    id: "activity-log",
    name: "ActivityLog",
    category: "advanced",
    description:
      "Audit-style activity feed grouped under sticky serif day headers — avatar + icon-tile rows, rich actor/action/target sentences, muted mono IP & device metadata and soft count badges.",
    demos: [
      {
        id: "studio-audit",
        title: "Studio audit trail",
        description: "Six actions across today and yesterday.",
        code: `import { ActivityLog } from "@/components/ui/activity-log"

const entries = [
  {
    id: "a1",
    type: "match",
    actor: { name: "Shreya Sanders" },
    action: "shortlisted",
    target: "Liam Carter",
    time: "8:24 PM",
    day: "Today",
    ip: "103.21.58.14",
    device: "iPhone 15 · Mumbai",
  },
]

export function StudioAudit() {
  return <ActivityLog entries={entries} maxHeight={400} />
}`,
        render: () => <ActivityLog entries={activityEntries} maxHeight={420} />,
        wide: true,
      },
    ],
    props: [
      { name: "entries", type: "ActivityEntry[]", default: "—", description: "Audit rows with actor, action, target, time and day." },
      { name: "entry.type", type: '"match" | "message" | "profile" | "verification" | "payment" | "event"', default: "—", description: "Picks the tone-colored lucide icon tile." },
      { name: "entry.day", type: "string", default: "—", description: "Grouping key rendered as a sticky serif header, e.g. “Today”." },
      { name: "entry.actor", type: "{ name: string; avatar?: string }", default: "—", description: "Avatar with initials fallback." },
      { name: "entry.ip / entry.device", type: "string", default: "—", description: "Muted mono metadata under the sentence." },
      { name: "maxHeight", type: "number", default: "—", description: "Scrollable viewport height (scrollbar-thin)." },
    ],
  },
]
