"use client"

import * as React from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import {
  BadgeCheck,
  Bookmark,
  Eye,
  Gem,
  Heart,
  HeartHandshake,
  Image as ImageIcon,
  Send,
  ShieldCheck,
  Sparkles,
  UserPlus,
  UserRound,
} from "lucide-react"

import type { ComponentDoc } from "./types"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DataTable } from "@/components/ui/data-table"
import { DataGrid } from "@/components/ui/data-grid"
import { Tree } from "@/components/ui/tree-view"
import { Timeline } from "@/components/ui/timeline"
import { ActivityFeed } from "@/components/ui/activity-feed"
import { KPI, Stat, StatGroup } from "@/components/ui/stat"
import { DescriptionList } from "@/components/ui/description-list"
import { Chip, Tag } from "@/components/ui/tag"
import { Rating } from "@/components/ui/rating"
import { CalendarView } from "@/components/ui/calendar-view"

/* ------------------------------------------------------------------ */
/* Seed data (fixed — no randomness, hydration safe)                  */
/* ------------------------------------------------------------------ */

const members = [
  {
    name: "Emily Watson",
    initials: "EW",
    avatar: "https://picsum.photos/seed/markaui-face-1/400/400",
    city: "Chennai",
    membership: "Gold",
    completion: 92,
  },
  {
    name: "John Doe",
    initials: "JD",
    avatar: "https://picsum.photos/seed/markaui-face-2/400/400",
    city: "Mumbai",
    membership: "Platinum",
    completion: 97,
  },
  {
    name: "Olivia Davis",
    initials: "OD",
    avatar: "https://picsum.photos/seed/markaui-face-3/400/400",
    city: "Kochi",
    membership: "Gold",
    completion: 88,
  },
  {
    name: "Ryan Cooper",
    initials: "RC",
    avatar: "https://picsum.photos/seed/markaui-face-4/400/400",
    city: "Hyderabad",
    membership: "Silver",
    completion: 74,
  },
]

type Profile = {
  id: string
  name: string
  age: number
  city: string
  profession: string
  match: number
  verified: boolean
  avatar: string
}

const profiles: Profile[] = [
  { id: "p1", name: "Emily Watson", age: 26, city: "Chennai", profession: "Bharatanatyam artist", match: 92, verified: true, avatar: "https://picsum.photos/seed/markaui-face-1/400/400" },
  { id: "p2", name: "John Doe", age: 29, city: "Mumbai", profession: "Investment banker", match: 87, verified: true, avatar: "https://picsum.photos/seed/markaui-face-2/400/400" },
  { id: "p3", name: "Olivia Davis", age: 25, city: "Kochi", profession: "UX designer", match: 84, verified: false, avatar: "https://picsum.photos/seed/markaui-face-3/400/400" },
  { id: "p4", name: "Ryan Cooper", age: 31, city: "Hyderabad", profession: "Chartered accountant", match: 78, verified: true, avatar: "https://picsum.photos/seed/markaui-face-4/400/400" },
  { id: "p5", name: "Hannah Foster", age: 27, city: "Kolkata", profession: "Classical vocalist", match: 81, verified: false, avatar: "https://picsum.photos/seed/markaui-face-5/400/400" },
  { id: "p6", name: "Richard Hayes", age: 30, city: "Jaipur", profession: "Hotelier", match: 76, verified: true, avatar: "https://picsum.photos/seed/markaui-face-6/400/400" },
]

const profileColumns: ColumnDef<Profile>[] = [
  {
    accessorKey: "name",
    header: "Profile",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar className="size-9">
          <AvatarImage src={row.original.avatar} alt={row.original.name} />
          <AvatarFallback className="bg-primary/10 text-xs text-primary">
            {row.original.name.split(" ").map((part) => part[0]).join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-foreground">{row.original.name}</p>
          <p className="text-xs text-muted-foreground">{row.original.profession}</p>
        </div>
      </div>
    ),
  },
  { accessorKey: "age", header: "Age" },
  { accessorKey: "city", header: "City" },
  {
    accessorKey: "match",
    header: "Match",
    cell: ({ row }) => (
      <Badge variant="gold" dot>{row.original.match}% match</Badge>
    ),
  },
  {
    id: "verified",
    header: "Verified",
    cell: ({ row }) =>
      row.original.verified ? (
        <Badge variant="success">
          <BadgeCheck className="size-3" />
          Verified
        </Badge>
      ) : (
        <Badge variant="outline" className="text-muted-foreground">Pending</Badge>
      ),
  },
]

type Shortlist = {
  id: string
  name: string
  age: number
  city: string
  status: string
}

const shortlists: Shortlist[] = [
  { id: "s1", name: "Mia Sanders", age: 26, city: "Delhi", status: "Contacted" },
  { id: "s2", name: "Daniel Reed", age: 28, city: "Bengaluru", status: "Interest sent" },
  { id: "s3", name: "Nora Reed", age: 25, city: "Pune", status: "Shortlisted" },
  { id: "s4", name: "Karan Blake", age: 30, city: "Gurugram", status: "Viewed" },
  { id: "s5", name: "Riley Chatterjee", age: 27, city: "Kolkata", status: "Shortlisted" },
  { id: "s6", name: "Nick Pillai", age: 29, city: "Chennai", status: "Contacted" },
]

const shortlistColumns: ColumnDef<Shortlist>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  { accessorKey: "age", header: "Age" },
  { accessorKey: "city", header: "City" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.original.status === "Shortlisted" ? "gold" : "soft"}>
        {row.original.status}
      </Badge>
    ),
  },
]

const journeyItems = [
  {
    id: "j1",
    title: "Profile created",
    description: "You joined Saptapadi and completed your basic details.",
    time: "12 Jan 2025",
    icon: <UserPlus className="size-4" />,
  },
  {
    id: "j2",
    title: "Profile verified",
    description: "Phone, email and government ID verified.",
    time: "14 Jan 2025",
    icon: <ShieldCheck className="size-4" />,
    tone: "success" as const,
  },
  {
    id: "j3",
    title: "First match received",
    description: "Emily Watson sent you an interest — 92% compatibility.",
    time: "2 Feb 2025",
    icon: <HeartHandshake className="size-4" />,
    tone: "gold" as const,
  },
  {
    id: "j4",
    title: "Engaged!",
    description: "Roka ceremony fixed for 14 Dec in Udaipur.",
    time: "9 Nov 2025",
    icon: <Gem className="size-4" />,
    tone: "gold" as const,
  },
]

const feedItems = [
  {
    id: "a1",
    avatarSrc: "https://picsum.photos/seed/markaui-face-1/400/400",
    avatarFallback: "AI",
    name: "Emily Watson",
    action: "sent you an interest",
    target: "92% match",
    time: "2 min ago",
    unread: true,
    actions: (
      <>
        <Button size="sm">Accept</Button>
        <Button size="sm" variant="outline">View profile</Button>
      </>
    ),
  },
  {
    id: "a2",
    avatarSrc: "https://picsum.photos/seed/markaui-face-2/400/400",
    avatarFallback: "RM",
    name: "John Doe",
    action: "viewed your full profile",
    time: "1 hr ago",
    unread: true,
    image: "https://picsum.photos/seed/markaui-face-2/400/400",
  },
  {
    id: "a3",
    avatarSrc: "https://picsum.photos/seed/markaui-face-3/400/400",
    avatarFallback: "KN",
    name: "Olivia Davis",
    action: "shortlisted your profile",
    time: "Yesterday",
  },
  {
    id: "a4",
    avatarSrc: "https://picsum.photos/seed/markaui-face-4/400/400",
    avatarFallback: "AR",
    name: "Ryan Cooper",
    action: "responded to your message —",
    target: "Namaste!",
    time: "2 days ago",
    image: "https://picsum.photos/seed/markaui-face-4/400/400",
  },
]

const INTERESTS = [
  "Carnatic music",
  "Trekking",
  "Bharatanatyam",
  "Street food",
  "Cricket",
  "Temple visits",
  "Photography",
]

/* ------------------------------------------------------------------ */
/* Interactive demo components                                        */
/* ------------------------------------------------------------------ */

function DataTableDemo() {
  const [selectedName, setSelectedName] = React.useState<string | null>(null)
  return (
    <DataTable
      columns={profileColumns}
      data={profiles}
      pageSize={4}
      striped
      onRowClick={(profile) => setSelectedName(profile.name)}
      toolbar={
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {selectedName ? (
              <>
                Viewing{" "}
                <span className="font-medium text-foreground">{selectedName}</span>
                {" "}— sort any column or paginate below.
              </>
            ) : (
              "6 matrimony profiles — click a row, sort a column, or paginate."
            )}
          </p>
          <Button variant="outline" size="sm">Export list</Button>
        </div>
      }
    />
  )
}

function DataGridDemo() {
  const [selected, setSelected] = React.useState<string[]>(["s3"])
  return (
    <DataGrid
      columns={shortlistColumns}
      data={shortlists}
      density="compact"
      zebra
      bordered
      selection
      selectedIds={selected}
      onSelectionChange={setSelected}
      pageSize={6}
    />
  )
}

function TreeDemo() {
  const [selected, setSelected] = React.useState("basics")
  return (
    <div className="max-w-sm rounded-xl border bg-card p-3">
      <Tree
        nodes={[
          {
            id: "about",
            label: "About Emma",
            icon: <UserRound className="size-4" />,
            children: [
              { id: "basics", label: "Basic details", badge: "Complete" },
              { id: "education", label: "Education & career" },
              { id: "family", label: "Family", badge: "3" },
            ],
          },
          {
            id: "preferences",
            label: "Partner preferences",
            icon: <Heart className="size-4" />,
            children: [
              { id: "partner-basic", label: "Age & height" },
              { id: "lifestyle", label: "Lifestyle & values" },
            ],
          },
          {
            id: "horoscope",
            label: "Horoscope",
            icon: <Sparkles className="size-4" />,
            badge: "New",
          },
          {
            id: "photos",
            label: "Photos",
            icon: <ImageIcon className="size-4" />,
          },
        ]}
        defaultExpanded={["about"]}
        selectedId={selected}
        onSelect={setSelected}
        showLines
      />
    </div>
  )
}

function TagDemo() {
  const [selectedTags, setSelectedTags] = React.useState<string[]>([
    "Carnatic music",
    "Trekking",
  ])
  const [filters, setFilters] = React.useState<string[]>([
    "Rohini Nakshatra",
    "Never married",
    "Veg only",
  ])

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]
    )
  }

  return (
    <div className="max-w-md space-y-5">
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Interests — click to select
        </p>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map((tag) => (
            <Tag
              key={tag}
              selected={selectedTags.includes(tag)}
              onSelect={() => toggleTag(tag)}
            >
              {tag}
            </Tag>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Filters — click the X to remove
        </p>
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <Chip
              key={filter}
              onRemove={() =>
                setFilters((prev) => prev.filter((item) => item !== filter))
              }
            >
              {filter}
            </Chip>
          ))}
          {filters.length === 0 ? (
            <span className="text-xs text-muted-foreground">
              All filters removed.
            </span>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function RatingDemo() {
  const [value, setValue] = React.useState(4)
  return (
    <div className="max-w-sm space-y-6">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          How was your Saptapadi experience?
        </p>
        <Rating value={value} onChange={setValue} showValue />
      </div>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Umaid Bhawan palace tour</p>
        <Rating value={4.5} readonly size="sm" showValue count={128} />
      </div>
    </div>
  )
}

function CalendarDemo() {
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null)
  return (
    <div className="space-y-3">
      <CalendarView
        defaultMonth={new Date(2025, 5, 1)}
        onDateClick={(date) => setSelectedDate(format(date, "d MMM yyyy"))}
        events={[
          { date: "2025-06-05", title: "Match meet — Emma", tone: "gold" },
          { date: "2025-06-12", title: "Family call", tone: "info" },
          { date: "2025-06-12", title: "Horoscope review", tone: "default" },
          { date: "2025-06-21", title: "Temple visit", tone: "success" },
          { date: "2025-06-28", title: "Roka planning", tone: "destructive" },
        ]}
      />
      {selectedDate ? (
        <p className="text-sm text-muted-foreground">
          Selected:{" "}
          <span className="font-medium text-foreground">{selectedDate}</span>
        </p>
      ) : null}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Registry slice                                                     */
/* ------------------------------------------------------------------ */

export const dataDocs: ComponentDoc[] = [
  {
    id: "table",
    name: "Table",
    category: "data",
    description:
      "Elegant table primitives (shadcn API) for composing members lists, directories and comparison views.",
    demos: [
      {
        id: "members",
        title: "Members directory",
        description:
          "Table primitives composed with Avatar and Badge for a premium members list.",
        wide: true,
        code: `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Member</TableHead>
      <TableHead>Membership</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="https://picsum.photos/seed/markaui-face-1/400/400" />
            <AvatarFallback>EW</AvatarFallback>
          </Avatar>
          <span className="font-medium">Emily Watson</span>
        </div>
      </TableCell>
      <TableCell><Badge variant="gold">Gold</Badge></TableCell>
    </TableRow>
  </TableBody>
</Table>`,
        render: () => (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="px-4">Member</TableHead>
                <TableHead className="px-4">Location</TableHead>
                <TableHead className="px-4">Membership</TableHead>
                <TableHead className="px-4 text-right">Completeness</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.name}>
                  <TableCell className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-9">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback className="bg-primary/10 text-xs text-primary">
                          {member.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-foreground">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.membership} member</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-muted-foreground">{member.city}</TableCell>
                  <TableCell className="px-4 py-3">
                    <Badge
                      variant={
                        member.membership === "Platinum"
                          ? "default"
                          : member.membership === "Gold"
                            ? "gold"
                            : "secondary"
                      }
                    >
                      {member.membership}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-right tabular-nums">
                    {member.completion}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ),
      },
    ],
    props: [
      { name: "Table", type: "React.ComponentProps<\"table\">", description: "Root table inside a horizontal-scroll container." },
      { name: "TableHeader / TableBody / TableFooter", type: "React.ComponentProps<\"thead\" | \"tbody\" | \"tfoot\">", description: "Section wrappers with border logic." },
      { name: "TableRow", type: "React.ComponentProps<\"tr\">", description: "Row with built-in hover and data-state=selected styles." },
      { name: "TableHead / TableCell", type: "React.ComponentProps<\"th\" | \"td\">", description: "Cells — override padding with px-4 / py-3 as needed." },
      { name: "TableCaption", type: "React.ComponentProps<\"caption\">", description: "Muted caption below the table." },
    ],
  },
  {
    id: "data-table",
    name: "DataTable",
    category: "data",
    description:
      "Full-featured data table on TanStack Table — sortable headers with arrows, pagination footer, toolbar slot and an elegant empty state.",
    demos: [
      {
        id: "profiles",
        title: "Matrimony profiles",
        description:
          "Six profiles with sortable Age and Match columns, click-to-select rows and pagination.",
        wide: true,
        code: `import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"
import { Badge } from "@/components/ui/badge"

type Profile = { id: string; name: string; age: number; city: string; match: number }

const columns: ColumnDef<Profile>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "age", header: "Age" },
  { accessorKey: "city", header: "City" },
  {
    accessorKey: "match",
    header: "Match",
    cell: (info) => <Badge variant="gold">{info.getValue()}% match</Badge>,
  },
]

<DataTable
  columns={columns}
  data={profiles}
  pageSize={4}
  striped
  onRowClick={(profile) => openProfile(profile.id)}
/>`,
        render: () => <DataTableDemo />,
      },
    ],
    props: [
      { name: "columns", type: "ColumnDef<T>[]", description: "TanStack column definitions; sortable headers get arrows automatically." },
      { name: "data", type: "T[]", description: "Row data array." },
      { name: "pageSize", type: "number", default: "5", description: "Rows per page." },
      { name: "toolbar", type: "React.ReactNode", description: "Slot rendered above the table (search, actions)." },
      { name: "onRowClick", type: "(row: T) => void", description: "Called with the original row on body-row click." },
      { name: "striped", type: "boolean", default: "false", description: "Tint alternating rows." },
      { name: "hoverable", type: "boolean", default: "true", description: "Hover highlight on body rows." },
      { name: "stickyHeader", type: "boolean", default: "false", description: "Pin the header to the top of the scroll container." },
      { name: "density", type: '"comfortable" | "compact"', default: '"comfortable"', description: "Cell padding scale." },
      { name: "bordered", type: "boolean", default: "false", description: "Draw a bordered card around the table." },
    ],
  },
  {
    id: "data-grid",
    name: "DataGrid",
    category: "data",
    description:
      "DataTable with grid chrome — density, zebra striping, borders, a loading skeleton overlay and row-selection checkboxes.",
    demos: [
      {
        id: "shortlist-grid",
        title: "Shortlist grid",
        description:
          "Compact, zebra, bordered grid with select-all and per-row checkboxes.",
        wide: true,
        code: `import { DataGrid } from "@/components/ui/data-grid"

<DataGrid
  columns={columns}
  data={shortlists}
  density="compact"
  zebra
  bordered
  selection
  selectedIds={selected}
  onSelectionChange={setSelected}
  pageSize={6}
/>`,
        render: () => <DataGridDemo />,
      },
    ],
    props: [
      { name: "density", type: '"comfortable" | "compact"', default: '"comfortable"', description: "Row padding scale." },
      { name: "bordered", type: "boolean", default: "true", description: "Outer bordered card around the grid." },
      { name: "zebra", type: "boolean", default: "false", description: "Striped alternating rows." },
      { name: "loading", type: "boolean", default: "false", description: "Skeleton rows overlay; table is dimmed and inert." },
      { name: "selection", type: "boolean", default: "false", description: "Adds a select-all / per-row checkbox column." },
      { name: "selectedIds", type: "string[]", description: "Controlled selected row ids (rows are identified by their id field or getRowId)." },
      { name: "defaultSelectedIds", type: "string[]", description: "Uncontrolled initial selection." },
      { name: "onSelectionChange", type: "(selectedIds: string[]) => void", description: "Fired whenever the selection changes." },
    ],
  },
  {
    id: "tree",
    name: "Tree",
    category: "data",
    aliases: ["TreeView"],
    description:
      "Recursive hierarchical tree with expand/collapse chevrons, indent guide lines, icons, badges and a selected state. TreeView is the same component under another name.",
    demos: [
      {
        id: "profile-sections",
        title: "Profile sections",
        description: "A profile editor outline — click a row to select, chevrons expand.",
        code: `import { Tree } from "@/components/ui/tree-view"

const nodes = [
  {
    id: "personal",
    label: "Personal",
    children: [
      { id: "basics", label: "Basic details" },
      { id: "education", label: "Education & career" },
    ],
  },
  { id: "preferences", label: "Partner preferences" },
]

<Tree
  nodes={nodes}
  defaultExpanded={["personal"]}
  selectedId={selected}
  onSelect={setSelected}
  showLines
/>`,
        render: () => <TreeDemo />,
      },
    ],
    props: [
      { name: "nodes", type: "TreeNodeData[]", description: "Tree data — { id, label, icon?, badge?, children? }." },
      { name: "defaultExpanded", type: "string[]", default: "[]", description: "Ids expanded on first render." },
      { name: "expanded", type: "string[]", description: "Controlled expanded ids." },
      { name: "onExpandedChange", type: "(expanded: string[]) => void", description: "Fired when expansion changes." },
      { name: "selectedId", type: "string", description: "Currently selected node id." },
      { name: "onSelect", type: "(id: string) => void", description: "Fired when a row is clicked." },
      { name: "showLines", type: "boolean", default: "true", description: "Vertical indent guide lines." },
    ],
  },
  {
    id: "timeline",
    name: "Timeline",
    category: "data",
    description:
      "Vertical timeline with tinted connector dots, icons, times, descriptions and images. The final connector fades out for an elegant finish.",
    demos: [
      {
        id: "journey",
        title: "Your journey",
        description: "Milestone timeline with success and gold tones.",
        wide: true,
        code: `import { Timeline } from "@/components/ui/timeline"
import { ShieldCheck } from "lucide-react"

<Timeline
  items={[
    {
      id: "created",
      title: "Profile created",
      description: "You joined Saptapadi.",
      time: "12 Jan 2025",
    },
    {
      id: "verified",
      title: "Profile verified",
      time: "14 Jan 2025",
      icon: <ShieldCheck className="size-4" />,
      tone: "success",
    },
  ]}
/>`,
        render: () => (
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-lg">Your journey</CardTitle>
              <CardDescription>Milestones on your Saptapadi path.</CardDescription>
            </CardHeader>
            <CardContent>
              <Timeline items={journeyItems} />
            </CardContent>
          </Card>
        ),
      },
    ],
    props: [
      { name: "items", type: "TimelineItemData[]", description: "Entries — { title, description?, time?, icon?, tone?, image? }." },
      { name: "tone", type: '"default" | "gold" | "success" | "destructive"', default: '"default"', description: "Per-item dot tone." },
      { name: "image", type: "string", description: "Optional image under an item description." },
      { name: "orientation", type: '"vertical"', default: '"vertical"', description: "Only vertical is supported today." },
    ],
  },
  {
    id: "activity-feed",
    name: "ActivityFeed",
    category: "data",
    description:
      "Notification feed rows with avatar, rich action text, unread dot and badge, optional thumbnail and inline action buttons.",
    demos: [
      {
        id: "notifications",
        title: "Match notifications",
        description: "Four feed items — two unread, with a thumbnail and quick actions.",
        wide: true,
        code: `import { ActivityFeed } from "@/components/ui/activity-feed"

<ActivityFeed
  items={[
    {
      id: "1",
      avatarFallback: "AI",
      name: "Emily Watson",
      action: "sent you an interest",
      target: "92% match",
      time: "2 min ago",
      unread: true,
    },
  ]}
/>`,
        render: () => (
          <Card className="p-2">
            <ActivityFeed items={feedItems} />
          </Card>
        ),
      },
    ],
    props: [
      { name: "items", type: "ActivityFeedItem[]", description: "Entries — { id, avatarSrc?, avatarFallback, name, action, target?, time, unread?, image?, actions? }." },
      { name: "unread", type: "boolean", description: "Per item — bold row, dot on avatar and a gold New badge." },
      { name: "image", type: "string", description: "Per item — square thumbnail on the right." },
      { name: "actions", type: "React.ReactNode", description: "Per item — action buttons under the text." },
    ],
  },
  {
    id: "stat",
    name: "Stat",
    category: "data",
    description:
      "Single metric with a big serif value, trend delta and optional prefix, suffix and icon.",
    demos: [
      {
        id: "stats-row",
        title: "Stats row",
        description: "Bare Stat items composed inline with icons, deltas and units.",
        code: `import { Stat } from "@/components/ui/stat"
import { Heart } from "lucide-react"

<Stat
  label="Total matches"
  value="128"
  delta={{ value: "+12%", trend: "up" }}
  icon={<Heart className="size-4" />}
/>

<Stat label="Avg. response" value="6" suffix="hrs" />`,
        render: () => (
          <div className="flex flex-wrap gap-x-12 gap-y-6">
            <Stat
              label="Total matches"
              value="128"
              delta={{ value: "+12%", trend: "up" }}
              icon={<Heart className="size-4" />}
            />
            <Stat
              label="Profile views"
              value="1,204"
              delta={{ value: "+8%", trend: "up" }}
              icon={<Eye className="size-4" />}
            />
            <Stat
              label="Avg. response"
              value="6"
              suffix="hrs"
              delta={{ value: "-1 hr", trend: "up" }}
              icon={<Send className="size-4" />}
            />
          </div>
        ),
      },
    ],
    props: [
      { name: "label", type: "string", description: "Small uppercase caption above the value." },
      { name: "value", type: "React.ReactNode", description: "Main figure, rendered in serif." },
      { name: "delta", type: "{ value: string; trend: \"up\" | \"down\" }", description: "Trend badge — up is success, down is destructive." },
      { name: "icon", type: "React.ReactNode", description: "Small icon right of the label." },
      { name: "prefix / suffix", type: "React.ReactNode", description: "Content around the value, e.g. currency or unit." },
    ],
  },
  {
    id: "stat-group",
    name: "StatGroup",
    category: "data",
    description:
      "Responsive 1/2/4-column grid of Stat items, optionally rendered as a hairline-divided panel.",
    demos: [
      {
        id: "stats-grid",
        title: "Dashboard stats",
        description: "Four bordered stats with icons and deltas.",
        wide: true,
        code: `import { Stat, StatGroup } from "@/components/ui/stat"

<StatGroup bordered>
  <Stat label="Total matches" value="128" delta={{ value: "+12%", trend: "up" }} />
  <Stat label="Profile views" value="1,204" delta={{ value: "+8%", trend: "up" }} />
  <Stat label="Interests" value="36" delta={{ value: "-4%", trend: "down" }} />
  <Stat label="Shortlists" value="54" delta={{ value: "+2%", trend: "up" }} />
</StatGroup>`,
        render: () => (
          <StatGroup bordered>
            <Stat
              label="Total matches"
              value="128"
              delta={{ value: "+12%", trend: "up" }}
              icon={<Heart className="size-4" />}
            />
            <Stat
              label="Profile views"
              value="1,204"
              delta={{ value: "+8%", trend: "up" }}
              icon={<Eye className="size-4" />}
            />
            <Stat
              label="Interests"
              value="36"
              delta={{ value: "-4%", trend: "down" }}
              icon={<Send className="size-4" />}
            />
            <Stat
              label="Shortlists"
              value="54"
              delta={{ value: "+2%", trend: "up" }}
              icon={<Bookmark className="size-4" />}
            />
          </StatGroup>
        ),
      },
    ],
    props: [
      { name: "bordered", type: "boolean", default: "false", description: "Wrap children in a rounded, hairline-divided card." },
      { name: "children", type: "React.ReactNode", description: "Stat items — the grid is 1 / 2 / 4 columns at base / sm / lg." },
    ],
  },
  {
    id: "kpi",
    name: "KPI",
    category: "data",
    description:
      "Premium metric card — serif value, delta, and a gold-gradient progress bar with an optional target marker.",
    demos: [
      {
        id: "kpi-cards",
        title: "Profile KPIs",
        description: "Two KPI cards with progress toward targets.",
        wide: true,
        code: `import { KPI } from "@/components/ui/stat"

<KPI
  label="Profile completeness"
  value="82%"
  progress={82}
  target={90}
  hint="Add family details to reach 90%"
  delta={{ value: "+6%", trend: "up" }}
/>

<KPI label="Response rate" value="94%" progress={94} target={80} />`,
        render: () => (
          <div className="grid gap-4 sm:grid-cols-2">
            <KPI
              label="Profile completeness"
              value="82%"
              progress={82}
              target={90}
              hint="Add family details to reach 90%"
              delta={{ value: "+6%", trend: "up" }}
              icon={<UserRound className="size-4" />}
            />
            <KPI
              label="Response rate"
              value="94%"
              progress={94}
              target={80}
              hint="94 of 100 interests answered"
              delta={{ value: "+3%", trend: "up" }}
              icon={<BadgeCheck className="size-4" />}
            />
          </div>
        ),
      },
    ],
    props: [
      { name: "label", type: "string", description: "Uppercase card caption." },
      { name: "value", type: "React.ReactNode", description: "Big serif figure." },
      { name: "progress", type: "number", description: "0–100; renders the gold gradient bar." },
      { name: "target", type: "number", description: "0–100 position of the vertical target marker." },
      { name: "hint", type: "React.ReactNode", description: "Caption under the bar; the percentage is shown on the right." },
      { name: "delta", type: "{ value: string; trend: \"up\" | \"down\" }", description: "Trend badge next to the value." },
      { name: "icon", type: "React.ReactNode", description: "Icon in a soft tile, top-right." },
    ],
  },
  {
    id: "description-list",
    name: "DescriptionList",
    category: "data",
    aliases: ["KeyValue"],
    description:
      "Term/description rows built on dl/dt/dd with dividers and an optional boxed card variant. KeyValue is the same component under another name.",
    demos: [
      {
        id: "profile-details",
        title: "Profile details",
        description: "Boxed variant showing Emma's profile facts.",
        code: `import { DescriptionList } from "@/components/ui/description-list"

<DescriptionList
  variant="boxed"
  items={[
    { term: "Name", description: "Emily Watson" },
    { term: "Birth star", description: "Rohini" },
    { term: "Height", description: "5 ft 4 in" },
    { term: "Profession", description: "Bharatanatyam artist" },
  ]}
/>`,
        render: () => (
          <DescriptionList
            variant="boxed"
            className="max-w-md"
            items={[
              { term: "Name", description: "Emily Watson" },
              { term: "Birth star", description: "Rohini" },
              { term: "Height", description: "5 ft 4 in" },
              { term: "Education", description: "M.A. Carnatic Music" },
              { term: "Profession", description: "Bharatanatyam artist" },
              { term: "City", description: "Chennai, Tamil Nadu" },
            ]}
          />
        ),
      },
    ],
    props: [
      { name: "items", type: "{ term: ReactNode; description: ReactNode }[]", description: "Rows to render." },
      { name: "variant", type: '"plain" | "boxed"', default: '"plain"', description: "Plain dividers or a bordered card wrapper." },
    ],
  },
  {
    id: "tag",
    name: "Tag",
    category: "data",
    aliases: ["Chip"],
    description:
      "Selectable, removable pill built on Badge. Chip is the same API with a slightly rounder style.",
    demos: [
      {
        id: "interest-tags",
        title: "Interest tags & filters",
        description: "Click tags to select them; chips show the removable X.",
        code: `import { Tag } from "@/components/ui/tag"

<Tag selected onSelect={setSelected}>Carnatic music</Tag>
<Tag onRemove={() => remove("Cricket")}>Cricket</Tag>
<Tag size="sm">Temple visits</Tag>`,
        render: () => <TagDemo />,
      },
    ],
    props: [
      { name: "selected", type: "boolean", description: "Controlled selected state (solid primary when true)." },
      { name: "defaultSelected", type: "boolean", default: "false", description: "Uncontrolled initial state." },
      { name: "onSelect", type: "(selected: boolean) => void", description: "Fired with the next state on toggle." },
      { name: "onRemove", type: "() => void", description: "When provided, renders an X inside the pill." },
      { name: "size", type: '"sm" | "default"', default: '"default"', description: "Pill size." },
    ],
  },
  {
    id: "rating",
    name: "Rating",
    category: "data",
    description:
      "Gold star rating with hover preview, keyboard arrows, half-star display, readonly mode and optional value/count captions.",
    demos: [
      {
        id: "star-rating",
        title: "Interactive & readonly",
        description: "Click or use arrow keys on the first; the second displays 4.5 (128 reviews).",
        code: `import { Rating } from "@/components/ui/rating"

<Rating value={value} onChange={setValue} showValue />
<Rating value={4.5} readonly size="sm" count={128} />`,
        render: () => <RatingDemo />,
      },
    ],
    props: [
      { name: "value", type: "number", description: "Controlled rating; halves render half-filled stars." },
      { name: "defaultValue", type: "number", default: "0", description: "Uncontrolled initial value." },
      { name: "onChange", type: "(value: number) => void", description: "Fired on click and arrow keys." },
      { name: "max", type: "number", default: "5", description: "Number of stars." },
      { name: "readonly", type: "boolean", default: "false", description: "Display-only, no interactions." },
      { name: "size", type: '"sm" | "default" | "lg"', default: '"default"', description: "Star size." },
      { name: "showValue", type: "boolean", default: "false", description: "Show the numeric value." },
      { name: "count", type: "number", description: "Review count, rendered as (128)." },
    ],
  },
  {
    id: "calendar-view",
    name: "CalendarView",
    category: "data",
    description:
      "Self-contained month grid (date-fns powered) with serif month header, event pills, a gold today ring and date clicks — no react-day-picker needed.",
    demos: [
      {
        id: "june-2025",
        title: "June 2025",
        description: "Fixed month with five events across different tones; click a day to select it.",
        wide: true,
        code: `import { CalendarView } from "@/components/ui/calendar-view"

<CalendarView
  defaultMonth={new Date(2025, 5, 1)}
  events={[
    { date: "2025-06-05", title: "Match meet", tone: "gold" },
    { date: "2025-06-12", title: "Family call", tone: "info" },
  ]}
  onDateClick={(date) => setSelected(date)}
/>`,
        render: () => <CalendarDemo />,
      },
    ],
    props: [
      { name: "month", type: "Date", description: "Controlled displayed month." },
      { name: "defaultMonth", type: "Date", description: "Uncontrolled initial month (defaults to today)." },
      { name: "onMonthChange", type: "(month: Date) => void", description: "Fired by the prev/next arrows." },
      { name: "events", type: "CalendarEvent[]", description: "{ date: \"yyyy-MM-dd\", title, tone? } — up to 2 pills per day plus +n." },
      { name: "onDateClick", type: "(date: Date) => void", description: "Fired when a day cell is clicked." },
      { name: "weekStartsOn", type: "0 | 1", default: "0", description: "Sunday or Monday first." },
    ],
  },
]
