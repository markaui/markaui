import type { ComponentDoc } from "./types"

import {
  ActivityCard,
  ChartCard,
  DashboardGrid,
  DashboardPanel,
  KPIGrid,
  MetricCard,
  NotificationCenter,
  QuickActions,
  RecentItems,
  StatsCard,
} from "@/components/ui/dashboard"
import { Button } from "@/components/ui/button"
import {
  BadgeCheck,
  CalendarHeart,
  Camera,
  Download,
  Heart,
  MessageCircle,
  Search,
  Sparkles,
  Users,
  Wallet,
} from "lucide-react"

const ACTIVITY_ITEMS = [
  { id: "a1", name: "Sophia S.", action: "verified her profile", time: "2m ago" },
  { id: "a2", name: "Liam R.", action: "sent 3 new interests", time: "18m ago" },
  { id: "a3", name: "Nina K.", action: "updated her partner preferences", time: "1h ago" },
  { id: "a4", name: "David M.", action: "subscribed to the Gold plan", time: "3h ago" },
  { id: "a5", name: "Emma D.", action: "completed horoscope matching", time: "5h ago" },
  { id: "a6", name: "Mark V.", action: "joined via family invite", time: "8h ago" },
]

const RECENT_ITEMS = [
  {
    id: "r1",
    name: "Wedding storyline — Jane & John",
    meta: "Edited 12 minutes ago by Sana",
    time: "12m",
  },
  {
    id: "r2",
    name: "Match report — February",
    meta: "Exported by admin",
    time: "3h",
  },
  {
    id: "r3",
    name: "Engagement shoot — Sophia & Liam",
    meta: "18 photos awaiting review",
    time: "1d",
  },
  {
    id: "r4",
    name: "Gold plan invoice #2291",
    meta: "Paid via UPI",
    time: "2d",
  },
]

const SIGNUP_BARS = [
  { day: "M", value: 42 },
  { day: "T", value: 58 },
  { day: "W", value: 36 },
  { day: "T", value: 72 },
  { day: "F", value: 64 },
  { day: "S", value: 88 },
  { day: "S", value: 76 },
] as const

const KPIS = [
  { id: "k1", label: "Active profiles", value: "18,204", delta: "+12.4%", trend: "up" as const },
  { id: "k2", label: "Matches today", value: "3,481", delta: "+8.1%", trend: "up" as const },
  { id: "k3", label: "Avg. response", value: "4.2h", delta: "-0.6h", trend: "down" as const },
  { id: "k4", label: "Success rate", value: "94.2%", delta: "+0.3%", trend: "up" as const },
]

const QUICK_ACTION_ITEMS = [
  { id: "q1", label: "Send interest", icon: <Heart />, onClick: () => console.log("Send interest") },
  { id: "q2", label: "Browse profiles", icon: <Search />, onClick: () => console.log("Browse") },
  { id: "q3", label: "Book a pandit", icon: <CalendarHeart />, onClick: () => console.log("Pandit") },
  { id: "q4", label: "Export report", icon: <Download />, onClick: () => console.log("Export") },
]

export const dashboardDocs: ComponentDoc[] = [
  {
    id: "dashboard",
    name: "Dashboard",
    category: "dashboard",
    description:
      "A composed overview: metric row, chart card with an activity feed. Swap the decorative bars for a real chart by dropping a chart component into ChartCard.",
    aliases: ["DashboardOverview"],
    demos: [
      {
        id: "overview",
        title: "Overview",
        description: "MetricCard row, a ChartCard with a simple bar slot and an ActivityCard.",
        wide: true,
        code: `import { ActivityCard, ChartCard, MetricCard } from "@/components/ui/dashboard"
import { BarChart } from "@/components/ui/charts/basic"

<div className="@container grid gap-4 @5xl:grid-cols-5">
  <div className="@5xl:col-span-3">
    <ChartCard title="Weekly sign-ups" description="New members per day">
      <BarChart data={signups} />
    </ChartCard>
  </div>
  <div className="lg:col-span-2">
    <ActivityCard items={activity} />
  </div>
</div>`,
        render: () => (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 @2xl:grid-cols-2 @5xl:grid-cols-4">
              <MetricCard label="Active profiles" value="18,204" delta="+12.4%" trend="up" icon={<Users />} />
              <MetricCard label="New matches" value="3,481" delta="+8.1%" trend="up" icon={<Heart />} />
              <MetricCard label="Conversations" value="9,032" delta="-2.3%" trend="down" icon={<MessageCircle />} />
              <MetricCard label="Success rate" value="94.2%" delta="+0.3%" trend="up" icon={<BadgeCheck />} />
            </div>
            <div className="grid grid-cols-1 gap-4 @5xl:grid-cols-5">
              <div className="@5xl:col-span-3">
                <ChartCard title="Weekly sign-ups" description="New member registrations per day">
                  <div className="flex h-44 items-end gap-3">
                    {SIGNUP_BARS.map((bar, index) => (
                      <div key={index} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                        <div
                          className="w-full rounded-t-md bg-primary/80 transition-all duration-200 hover:bg-gold"
                          style={{ height: bar.value + "%" }}
                        />
                        <span className="text-xs text-muted-foreground">{bar.day}</span>
                      </div>
                    ))}
                  </div>
                </ChartCard>
              </div>
              <div className="lg:col-span-2">
                <ActivityCard items={ACTIVITY_ITEMS.slice(0, 5)} />
              </div>
            </div>
          </div>
        ),
      },
    ],
    props: [
      {
        name: "composition",
        type: "MetricCard[] + ChartCard + ActivityCard",
        description: "The overview is composed from the primitives documented below.",
      },
    ],
  },
  {
    id: "dashboard-grid",
    name: "DashboardGrid",
    category: "dashboard",
    description:
      "12-column responsive grid wrapper with a DashboardPanel helper for col-span control across breakpoints.",
    demos: [
      {
        id: "grid-spans",
        title: "Panel spans",
        description: "Panels accept span 1–12 on md+ screens and stack on mobile.",
        wide: true,
        code: `import { DashboardGrid, DashboardPanel, MetricCard, ActivityCard } from "@/components/ui/dashboard"

<DashboardGrid>
  <DashboardPanel span={8}>
    <MetricCard label="Revenue" value="42.8L" icon={<Wallet />} />
  </DashboardPanel>
  <DashboardPanel span={4}>
    <MetricCard label="Churn" value="1.8%" />
  </DashboardPanel>
  <DashboardPanel span={12}>
    <ActivityCard items={activity} />
  </DashboardPanel>
</DashboardGrid>`,
        render: () => (
          <DashboardGrid>
            <DashboardPanel span={8}>
              <MetricCard label="Revenue" value="₹42.8L" delta="+9.6%" trend="up" icon={<Wallet />} />
            </DashboardPanel>
            <DashboardPanel span={4}>
              <MetricCard label="Churn" value="1.8%" delta="-0.4%" trend="down" icon={<Users />} />
            </DashboardPanel>
            <DashboardPanel span={12}>
              <ActivityCard title="Today" items={ACTIVITY_ITEMS.slice(0, 3)} />
            </DashboardPanel>
          </DashboardGrid>
        ),
      },
    ],
    props: [
      {
        name: "span (DashboardPanel)",
        type: "number",
        default: "12",
        description: "Columns spanned on md+ screens (1–12).",
      },
      {
        name: "className",
        type: "string",
        description: "Extra classes for the grid or panel.",
      },
    ],
  },
  {
    id: "metric-card",
    name: "MetricCard",
    category: "dashboard",
    description:
      "Compact metric tile with an icon in a tinted square, a delta chip and a subtle hover lift.",
    demos: [
      {
        id: "metric-trends",
        title: "Trends",
        description: "Delta chips pick their color from the trend direction.",
        code: `import { MetricCard } from "@/components/ui/dashboard"
import { Users } from "lucide-react"

<MetricCard label="Active profiles" value="18,204" delta="+12.4%" trend="up" icon={<Users />} />`,
        render: () => (
          <div className="grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
            <MetricCard label="Active profiles" value="18,204" delta="+12.4%" trend="up" icon={<Users />} />
            <MetricCard label="Conversations" value="9,032" delta="-2.3%" trend="down" icon={<MessageCircle />} />
            <MetricCard label="Verified today" value="212" delta="+18" trend="up" icon={<BadgeCheck />} />
            <MetricCard label="Pending reviews" value="64" icon={<Sparkles />} />
          </div>
        ),
      },
    ],
    props: [
      {
        name: "label",
        type: "string",
        description: "Metric name above the value.",
      },
      {
        name: "value",
        type: "string",
        description: "Big serif value.",
      },
      {
        name: "delta",
        type: "string",
        description: "Change indicator, e.g. +12.4%.",
      },
      {
        name: "trend",
        type: '"up" | "down" | "flat"',
        default: '"flat"',
        description: "Delta direction — drives arrow and color.",
      },
      {
        name: "icon",
        type: "React.ReactNode",
        description: "Leading icon in a tinted square.",
      },
    ],
  },
  {
    id: "kpi-grid",
    name: "KPIGrid",
    category: "dashboard",
    description:
      "Responsive grid of compact KPI tiles generated from a metrics array — handy for header strips.",
    demos: [
      {
        id: "kpi-strip",
        title: "KPI strip",
        description: "Four tiles on large screens, two on small.",
        code: `import { KPIGrid } from "@/components/ui/dashboard"

const kpis = [
  { id: "k1", label: "Active profiles", value: "18,204", delta: "+12.4%", trend: "up" },
  { id: "k2", label: "Matches today", value: "3,481", delta: "+8.1%", trend: "up" },
]

<KPIGrid metrics={kpis} />`,
        render: () => <KPIGrid metrics={KPIS} className="max-w-3xl" />,
      },
    ],
    props: [
      {
        name: "metrics",
        type: "{ id, label, value, delta?, trend? }[]",
        description: "KPI data — one tile per entry.",
      },
      {
        name: "columns",
        type: "2 | 3 | 4",
        default: "4",
        description: "Tile columns on large screens.",
      },
    ],
  },
  {
    id: "stats-card",
    name: "StatsCard",
    category: "dashboard",
    description:
      "Richer stat tile: serif value, delta inline and either a mini progress bar or a sub metric line.",
    demos: [
      {
        id: "stats-variants",
        title: "Progress & delta",
        description: "Pass progress for a mini bar, or sub for plain secondary text.",
        code: `import { StatsCard } from "@/components/ui/dashboard"
import { Wallet } from "lucide-react"

<StatsCard
  label="Monthly revenue"
  value="₹42.8L"
  delta="+9.6%"
  trend="up"
  progress={72}
  icon={<Wallet />}
/>`,
        render: () => (
          <div className="grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
            <StatsCard
              label="Monthly revenue"
              value="₹42.8L"
              delta="+9.6%"
              trend="up"
              progress={72}
              sub="72% of target"
              icon={<Wallet />}
            />
            <StatsCard
              label="Verified members"
              value="1.2M"
              delta="+4.1%"
              trend="up"
              progress={86}
              sub="86% of goal"
              icon={<BadgeCheck />}
            />
            <StatsCard
              label="Avg. match time"
              value="6.4 days"
              delta="-1.2 days"
              trend="down"
              sub="Faster than 81% of platforms"
              icon={<Heart />}
            />
            <StatsCard label="Live ceremonies" value="38" sub="Across 12 cities" icon={<CalendarHeart />} />
          </div>
        ),
      },
    ],
    props: [
      {
        name: "value",
        type: "string",
        description: "Big serif headline number.",
      },
      {
        name: "progress",
        type: "number",
        description: "0–100 — renders a mini progress bar.",
      },
      {
        name: "delta",
        type: "string",
        description: "Inline change indicator.",
      },
      {
        name: "trend",
        type: '"up" | "down" | "flat"',
        default: '"flat"',
        description: "Delta direction.",
      },
      {
        name: "sub",
        type: "string",
        description: "Secondary line under the value or progress bar.",
      },
    ],
  },
  {
    id: "chart-card",
    name: "ChartCard",
    category: "dashboard",
    description:
      "Card with a serif title, description and an actions slot — drop any chart (or placeholder bars) into the content slot.",
    demos: [
      {
        id: "chart-actions",
        title: "Header actions",
        description: "Actions render on the right of the header; content is your chart slot.",
        code: `import { ChartCard } from "@/components/ui/dashboard"
import { Button } from "@/components/ui/button"
import { LineChart } from "@/components/ui/charts/basic"

<ChartCard
  title="Match velocity"
  description="Interests accepted per day"
  actions={<Button variant="outline" size="sm">30 days</Button>}
>
  <LineChart data={series} />
</ChartCard>`,
        render: () => (
          <div className="w-full max-w-xl">
            <ChartCard
              title="Match velocity"
              description="Interests accepted per day"
              actions={
                <Button variant="outline" size="sm">
                  30 days
                </Button>
              }
            >
              <div className="flex h-40 items-end gap-2.5">
                {[38, 55, 47, 70, 62, 85, 74, 58, 66, 92, 80, 69].map((value, index) => (
                  <div
                    key={index}
                    className="flex-1 rounded-t-md bg-chart-2 transition-all duration-200 hover:bg-gold"
                    style={{ height: value + "%" }}
                  />
                ))}
              </div>
            </ChartCard>
          </div>
        ),
      },
    ],
    props: [
      {
        name: "title",
        type: "string",
        description: "Serif card title.",
      },
      {
        name: "description",
        type: "string",
        description: "Muted description line.",
      },
      {
        name: "actions",
        type: "React.ReactNode",
        description: "Right side of the header — filters, range pickers.",
      },
      {
        name: "children",
        type: "React.ReactNode",
        description: "Chart slot.",
      },
    ],
  },
  {
    id: "activity-card",
    name: "ActivityCard",
    category: "dashboard",
    description:
      "Header plus a max-h-64 scrollable feed of avatar rows with name, action and relative time.",
    demos: [
      {
        id: "activity-feed",
        title: "Feed",
        description: "Scrolls after five rows; pass avatar to replace the initial circle.",
        code: `import { ActivityCard } from "@/components/ui/dashboard"

const items = [
  { id: "a1", name: "Sophia S.", action: "verified her profile", time: "2m ago" },
  { id: "a2", name: "Liam R.", action: "sent 3 new interests", time: "18m ago" },
]

<ActivityCard title="Today" items={items} />`,
        render: () => (
          <div className="w-full max-w-md">
            <ActivityCard
              title="Today"
              items={ACTIVITY_ITEMS}
              action={
                <button
                  type="button"
                  className="cursor-pointer text-xs font-medium text-primary underline-offset-4 hover:underline"
                >
                  View all
                </button>
              }
            />
          </div>
        ),
      },
    ],
    props: [
      {
        name: "items",
        type: "{ id, name, action, time, avatar? }[]",
        description: "Feed rows.",
      },
      {
        name: "title",
        type: "string",
        default: '"Recent activity"',
        description: "Header text.",
      },
      {
        name: "action",
        type: "React.ReactNode",
        description: "Header action node.",
      },
    ],
  },
  {
    id: "recent-items",
    name: "RecentItems",
    category: "dashboard",
    description:
      "List of recent records with thumbnails, name, meta line, time and a chevron — rows act as buttons.",
    demos: [
      {
        id: "recent-list",
        title: "Recent records",
        description: "Pass thumb to swap the initial tile for an icon or image.",
        code: `import { RecentItems } from "@/components/ui/dashboard"

<RecentItems
  title="Recent items"
  items={[
    { id: "r1", name: "Match report — February", meta: "Exported by admin", time: "3h" },
  ]}
/>`,
        render: () => (
          <div className="w-full max-w-md">
            <RecentItems
              title="Recent items"
              items={[
                {
                  id: "r1",
                  name: "Wedding storyline — Jane & John",
                  meta: "Edited 12 minutes ago by Sana",
                  time: "12m",
                  thumb: (
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary [&_svg]:size-5">
                      <Sparkles />
                    </span>
                  ),
                },
                {
                  id: "r2",
                  name: "Engagement shoot — Sophia & Liam",
                  meta: "18 photos awaiting review",
                  time: "1d",
                  thumb: (
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gold/15 text-gold-foreground dark:text-gold [&_svg]:size-5">
                      <Camera />
                    </span>
                  ),
                },
                ...RECENT_ITEMS.slice(2),
              ]}
            />
          </div>
        ),
      },
    ],
    props: [
      {
        name: "items",
        type: "{ id, name, meta?, time?, thumb? }[]",
        description: "Rows with optional thumbnail node.",
      },
      {
        name: "title",
        type: "string",
        default: '"Recent items"',
        description: "Header text.",
      },
    ],
  },
  {
    id: "quick-actions",
    name: "QuickActions",
    category: "dashboard",
    description:
      "Grid of icon buttons with labels — icons tint on hover with a gold ring border for a premium lift.",
    demos: [
      {
        id: "quick-actions-grid",
        title: "Action grid",
        description: "Buttons call their own onClick handlers.",
        code: `import { QuickActions } from "@/components/ui/dashboard"
import { Heart, Search } from "lucide-react"

const actions = [
  { id: "q1", label: "Send interest", icon: <Heart />, onClick: () => {} },
  { id: "q2", label: "Browse profiles", icon: <Search />, onClick: () => {} },
]

<QuickActions title="Shortcuts" actions={actions} />`,
        render: () => <QuickActions title="Shortcuts" actions={QUICK_ACTION_ITEMS} className="max-w-xl" />,
      },
    ],
    props: [
      {
        name: "actions",
        type: "{ id, label, icon, onClick?, disabled? }[]",
        description: "One tile per action.",
      },
      {
        name: "title",
        type: "string",
        description: "Optional heading above the grid.",
      },
    ],
  },
  {
    id: "notification-center",
    name: "NotificationCenter",
    category: "dashboard",
    description:
      "Bell IconButton with an unread count badge opening a Popover panel — click a row to mark it read, or clear everything at once.",
    aliases: ["Notifications"],
    demos: [
      {
        id: "notification-bell",
        title: "Bell + popover",
        description: "Click the bell, then mark rows or all as read — the badge updates live.",
        code: `import { NotificationCenter } from "@/components/ui/dashboard"

const notifications = [
  { id: "n1", title: "New match found", description: "9 of 10 preferences.", time: "2m" },
  { id: "n2", title: "Profile verified", time: "1h", read: true },
]

<NotificationCenter notifications={notifications} />`,
        render: () => (
          <div className="flex justify-center py-2">
            <NotificationCenter />
          </div>
        ),
      },
    ],
    props: [
      {
        name: "notifications",
        type: "{ id, title, description?, time, read? }[]",
        description: "Seed data; defaults to a built-in sample set.",
      },
      {
        name: "className",
        type: "string",
        description: "Extra classes for the wrapper.",
      },
    ],
  },
]
