import type { ComponentDoc } from "./types"

import {
  AreaChart,
  BarChart,
  ColumnChart,
  ComboChart,
  GroupedBarChart,
  HorizontalBarChart,
  LineChart,
  RangeChart,
  Sparkline,
  StackedBarChart,
  StepChart,
} from "@/components/ui/charts/basic"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

/* -------------------------------------------------------------------------- */
/*  Demo data (fixed, hydration-safe)                                          */
/* -------------------------------------------------------------------------- */

const monthlyMatches = [
  { month: "Jan", matches: 420, conversations: 310 },
  { month: "Feb", matches: 510, conversations: 380 },
  { month: "Mar", matches: 480, conversations: 360 },
  { month: "Apr", matches: 610, conversations: 470 },
  { month: "May", matches: 590, conversations: 450 },
  { month: "Jun", matches: 720, conversations: 560 },
]

const profileViewTrend = [
  { month: "Jan", views: 1840, shortlisted: 210 },
  { month: "Feb", views: 2210, shortlisted: 260 },
  { month: "Mar", views: 2050, shortlisted: 248 },
  { month: "Apr", views: 2620, shortlisted: 330 },
  { month: "May", views: 2910, shortlisted: 378 },
  { month: "Jun", views: 3380, shortlisted: 455 },
]

const successRateTrend = [
  { month: "Jan", rate: 62 },
  { month: "Feb", rate: 65 },
  { month: "Mar", rate: 61 },
  { month: "Apr", rate: 68 },
  { month: "May", rate: 71 },
  { month: "Jun", rate: 74 },
]

const signupTrend = [
  { month: "Jan", signups: 320 },
  { month: "Feb", signups: 410 },
  { month: "Mar", signups: 380 },
  { month: "Apr", signups: 460 },
  { month: "May", signups: 520 },
  { month: "Jun", signups: 610 },
]

const membersByCity = [
  { city: "Mumbai", members: 1240 },
  { city: "Delhi", members: 980 },
  { city: "Bengaluru", members: 860 },
  { city: "Pune", members: 620 },
  { city: "Jaipur", members: 410 },
]

const membershipSplit = [
  { month: "Jan", free: 210, premium: 110 },
  { month: "Feb", free: 260, premium: 150 },
  { month: "Mar", free: 240, premium: 140 },
  { month: "Apr", free: 300, premium: 160 },
  { month: "May", free: 330, premium: 190 },
  { month: "Jun", free: 380, premium: 240 },
]

const interestsFlow = [
  { month: "Jan", sent: 540, accepted: 210 },
  { month: "Feb", sent: 610, accepted: 260 },
  { month: "Mar", sent: 580, accepted: 240 },
  { month: "Apr", sent: 690, accepted: 310 },
  { month: "May", sent: 760, accepted: 350 },
  { month: "Jun", sent: 880, accepted: 430 },
]

const weddingsByQuarter = [
  { quarter: "Q1", weddings: 420 },
  { quarter: "Q2", weddings: 160 },
  { quarter: "Q3", weddings: 210 },
  { quarter: "Q4", weddings: 480 },
]

const revenueMembers = [
  { month: "Jan", revenue: 42, members: 12 },
  { month: "Feb", revenue: 55, members: 14 },
  { month: "Mar", revenue: 51, members: 14 },
  { month: "Apr", revenue: 68, members: 16 },
  { month: "May", revenue: 74, members: 18 },
  { month: "Jun", revenue: 92, members: 21 },
]

const verifiedCumulative = [
  { month: "Jan", verified: 800 },
  { month: "Feb", verified: 1350 },
  { month: "Mar", verified: 1750 },
  { month: "Apr", verified: 2400 },
  { month: "May", verified: 2900 },
  { month: "Jun", verified: 3600 },
]

const matchSpark = [
  { day: "Mon", value: 46 },
  { day: "Tue", value: 52 },
  { day: "Wed", value: 49 },
  { day: "Thu", value: 58 },
  { day: "Fri", value: 55 },
  { day: "Sat", value: 61 },
  { day: "Sun", value: 64 },
]

const conversationSpark = [
  { day: "Mon", value: 22 },
  { day: "Tue", value: 26 },
  { day: "Wed", value: 24 },
  { day: "Thu", value: 30 },
  { day: "Fri", value: 33 },
  { day: "Sat", value: 35 },
  { day: "Sun", value: 38 },
]

const weddingSpark = [
  { day: "Mon", value: 6 },
  { day: "Tue", value: 8 },
  { day: "Wed", value: 7 },
  { day: "Thu", value: 9 },
  { day: "Fri", value: 11 },
  { day: "Sat", value: 10 },
  { day: "Sun", value: 12 },
]

const matchScoreRanges = [
  { age: "18–25", range: [58, 82] },
  { age: "26–32", range: [64, 91] },
  { age: "33–40", range: [60, 88] },
  { age: "41–50", range: [55, 84] },
  { age: "51+", range: [50, 78] },
]

const sparkCards = [
  {
    label: "Matches this week",
    value: "64",
    delta: "+12%",
    color: "var(--gold)",
    data: matchSpark,
  },
  {
    label: "New conversations",
    value: "38",
    delta: "+8%",
    color: "var(--primary)",
    data: conversationSpark,
  },
  {
    label: "Weddings booked",
    value: "12",
    delta: "+3%",
    color: "var(--success)",
    data: weddingSpark,
  },
]

/* -------------------------------------------------------------------------- */
/*  Registry slice                                                             */
/* -------------------------------------------------------------------------- */

export const charts_1Docs: ComponentDoc[] = [
  {
    id: "chart",
    name: "Chart",
    category: "charts",
    aliases: ["recharts", "graphs", "visualization"],
    description:
      "Recharts-powered, theme-aware chart family for Saptapadi dashboards — line, area, bar, stacked/grouped/column, combo, step, sparkline and range charts. Every chart shares one contract: data rows, an xKey, and series descriptors whose colors fall back to the --chart-1..5 tokens so all themes and dark mode adapt automatically.",
    demos: [
      {
        id: "overview",
        title: "Monthly matches",
        description:
          "Shared building blocks: soft dashed grid, popover-styled tooltip, quiet axes and a muted legend. Compose custom charts by spreading the exported ChartAxes / ChartGridStyle / ChartTooltipStyle / ChartLegendStyle configs onto raw recharts parts.",
        code: `import { LineChart } from "@/components/ui/charts/basic"

// Shared contract: data rows + xKey + series descriptors.
const monthlyMatches = [
  { month: "Jan", matches: 420, conversations: 310 },
  { month: "Feb", matches: 510, conversations: 380 },
  { month: "Mar", matches: 480, conversations: 360 },
  { month: "Apr", matches: 610, conversations: 470 },
  { month: "May", matches: 590, conversations: 450 },
  { month: "Jun", matches: 720, conversations: 560 },
]

<LineChart
  data={monthlyMatches}
  xKey="month"
  height={300}
  showLegend
  series={[
    { key: "matches", label: "Matches", color: "var(--gold)" },
    { key: "conversations", label: "Conversations", color: "var(--primary)" },
  ]}
/>`,
        render: () => (
          <LineChart
            data={monthlyMatches}
            xKey="month"
            height={300}
            showLegend
            series={[
              { key: "matches", label: "Matches", color: "var(--gold)" },
              { key: "conversations", label: "Conversations", color: "var(--primary)" },
            ]}
          />
        ),
        wide: true,
      },
    ],
    props: [
      { name: "data", type: "Record<string, any>[]", description: "Row objects; fields are referenced by xKey and each series key." },
      { name: "xKey", type: "string", description: "Data field used for the category axis." },
      { name: "series", type: "{ key: string; label?: string; color?: string }[]", description: "Series descriptors. Omitting color falls back to --chart-1..5 in order." },
      { name: "height", type: "number", default: "280", description: "Chart height in px; width always fills the container." },
      { name: "className", type: "string", description: "Class for the outer wrapper div." },
      { name: "showGrid", type: "boolean", default: "true", description: "Soft dashed horizontal grid (var(--border))." },
      { name: "showLegend", type: "boolean", default: "false", description: "Muted 12px legend under the plot." },
      { name: "showTooltip", type: "boolean", default: "true", description: "Popover-styled tooltip with a var(--border) cursor line." },
    ],
  },
  {
    id: "line-chart",
    name: "LineChart",
    category: "charts",
    description:
      "Smooth monotone lines (2.5px stroke, hover dots) for trends over a shared axis — profile views, engagement, revenue curves.",
    demos: [
      {
        id: "profile-views",
        title: "Profile views trend",
        description: "Two series on the default --chart-1/--chart-2 palette; legend enabled.",
        code: `import { LineChart } from "@/components/ui/charts/basic"

const profileViewTrend = [
  { month: "Jan", views: 1840, shortlisted: 210 },
  { month: "Feb", views: 2210, shortlisted: 260 },
  { month: "Mar", views: 2050, shortlisted: 248 },
  { month: "Apr", views: 2620, shortlisted: 330 },
  { month: "May", views: 2910, shortlisted: 378 },
  { month: "Jun", views: 3380, shortlisted: 455 },
]

<LineChart
  data={profileViewTrend}
  xKey="month"
  showLegend
  series={[
    { key: "views", label: "Profile views" },
    { key: "shortlisted", label: "Shortlisted" },
  ]}
/>`,
        render: () => (
          <LineChart
            data={profileViewTrend}
            xKey="month"
            showLegend
            series={[
              { key: "views", label: "Profile views" },
              { key: "shortlisted", label: "Shortlisted" },
            ]}
          />
        ),
      },
    ],
    props: [
      { name: "data", type: "Record<string, any>[]", description: "Row objects keyed by xKey and series keys." },
      { name: "xKey", type: "string", description: "Category axis field." },
      { name: "series", type: "{ key: string; label?: string; color?: string }[]", description: "One entry per line." },
      { name: "height", type: "number", default: "280", description: "Chart height in px." },
      { name: "showGrid", type: "boolean", default: "true", description: "Show the dashed background grid." },
      { name: "showLegend", type: "boolean", default: "false", description: "Show the muted legend." },
      { name: "showTooltip", type: "boolean", default: "true", description: "Show the hover tooltip." },
      { name: "className", type: "string", description: "Wrapper class." },
    ],
  },
  {
    id: "area-chart",
    name: "AreaChart",
    category: "charts",
    description:
      "Curved monotone areas with a soft 0.18 fill opacity — ideal for single-series rates and shares like match success rate.",
    demos: [
      {
        id: "success-rate",
        title: "Success rate",
        description: "Single gold series; the area reads as a gentle band under the curve.",
        code: `import { AreaChart } from "@/components/ui/charts/basic"

const successRateTrend = [
  { month: "Jan", rate: 62 },
  { month: "Feb", rate: 65 },
  { month: "Mar", rate: 61 },
  { month: "Apr", rate: 68 },
  { month: "May", rate: 71 },
  { month: "Jun", rate: 74 },
]

<AreaChart
  data={successRateTrend}
  xKey="month"
  series={[{ key: "rate", label: "Success rate (%)", color: "var(--gold)" }]}
/>`,
        render: () => (
          <AreaChart
            data={successRateTrend}
            xKey="month"
            series={[{ key: "rate", label: "Success rate (%)", color: "var(--gold)" }]}
          />
        ),
      },
    ],
    props: [
      { name: "data", type: "Record<string, any>[]", description: "Row objects keyed by xKey and series keys." },
      { name: "xKey", type: "string", description: "Category axis field." },
      { name: "series", type: "{ key: string; label?: string; color?: string }[]", description: "One entry per area." },
      { name: "height", type: "number", default: "280", description: "Chart height in px." },
      { name: "showGrid", type: "boolean", default: "true", description: "Show the dashed background grid." },
      { name: "showLegend", type: "boolean", default: "false", description: "Show the muted legend." },
      { name: "className", type: "string", description: "Wrapper class." },
    ],
  },
  {
    id: "bar-chart",
    name: "BarChart",
    category: "charts",
    description:
      "Vertical bars with rounded tops ([6,6,0,0]) and an optional fixed barSize — monthly signups, counts, volumes.",
    demos: [
      {
        id: "signups",
        title: "Signups by month",
        description: "Single maroon series at a fixed 32px bar thickness.",
        code: `import { BarChart } from "@/components/ui/charts/basic"

const signupTrend = [
  { month: "Jan", signups: 320 },
  { month: "Feb", signups: 410 },
  { month: "Mar", signups: 380 },
  { month: "Apr", signups: 460 },
  { month: "May", signups: 520 },
  { month: "Jun", signups: 610 },
]

<BarChart
  data={signupTrend}
  xKey="month"
  barSize={32}
  series={[{ key: "signups", label: "Signups", color: "var(--primary)" }]}
/>`,
        render: () => (
          <BarChart
            data={signupTrend}
            xKey="month"
            barSize={32}
            series={[{ key: "signups", label: "Signups", color: "var(--primary)" }]}
          />
        ),
      },
    ],
    props: [
      { name: "data", type: "Record<string, any>[]", description: "Row objects keyed by xKey and series keys." },
      { name: "xKey", type: "string", description: "Category axis field." },
      { name: "series", type: "{ key: string; label?: string; color?: string }[]", description: "One entry per bar color group." },
      { name: "barSize", type: "number", description: "Fixed bar thickness in px; omit to auto-size." },
      { name: "height", type: "number", default: "280", description: "Chart height in px." },
      { name: "showGrid", type: "boolean", default: "true", description: "Show the dashed background grid." },
      { name: "showLegend", type: "boolean", default: "false", description: "Show the muted legend." },
      { name: "className", type: "string", description: "Wrapper class." },
    ],
  },
  {
    id: "horizontal-bar-chart",
    name: "HorizontalBarChart",
    category: "charts",
    description:
      "Vertical-layout bars (layout=\"vertical\") for ranked categories — city leaderboards, top profiles. Category axis is 80px wide on the left.",
    demos: [
      {
        id: "members-by-city",
        title: "Members by city",
        description: "Single ranked series with bars rounded on the right edge.",
        code: `import { HorizontalBarChart } from "@/components/ui/charts/basic"

const membersByCity = [
  { city: "Mumbai", members: 1240 },
  { city: "Delhi", members: 980 },
  { city: "Bengaluru", members: 860 },
  { city: "Pune", members: 620 },
  { city: "Jaipur", members: 410 },
]

<HorizontalBarChart
  data={membersByCity}
  xKey="city"
  series={[{ key: "members", label: "Members" }]}
/>`,
        render: () => (
          <HorizontalBarChart
            data={membersByCity}
            xKey="city"
            series={[{ key: "members", label: "Members" }]}
          />
        ),
      },
    ],
    props: [
      { name: "data", type: "Record<string, any>[]", description: "Row objects keyed by xKey and series keys." },
      { name: "xKey", type: "string", description: "Category field rendered on the Y axis (width 80)." },
      { name: "series", type: "{ key: string; label?: string; color?: string }[]", description: "One entry per bar color group." },
      { name: "barSize", type: "number", description: "Fixed bar thickness in px." },
      { name: "height", type: "number", default: "280", description: "Chart height in px." },
      { name: "showGrid", type: "boolean", default: "true", description: "Vertical grid lines for value scanning." },
      { name: "showLegend", type: "boolean", default: "false", description: "Show the muted legend." },
      { name: "className", type: "string", description: "Wrapper class." },
    ],
  },
  {
    id: "stacked-bar-chart",
    name: "StackedBarChart",
    category: "charts",
    description:
      "Bars stacked on a shared stackId to show composition — free vs premium members, plan mix over time.",
    demos: [
      {
        id: "free-vs-premium",
        title: "Free vs Premium members",
        description: "Two stacked series with the legend enabled for composition scanning.",
        code: `import { StackedBarChart } from "@/components/ui/charts/basic"

const membershipSplit = [
  { month: "Jan", free: 210, premium: 110 },
  { month: "Feb", free: 260, premium: 150 },
  { month: "Mar", free: 240, premium: 140 },
  { month: "Apr", free: 300, premium: 160 },
  { month: "May", free: 330, premium: 190 },
  { month: "Jun", free: 380, premium: 240 },
]

<StackedBarChart
  data={membershipSplit}
  xKey="month"
  showLegend
  series={[
    { key: "free", label: "Free" },
    { key: "premium", label: "Premium", color: "var(--gold)" },
  ]}
/>`,
        render: () => (
          <StackedBarChart
            data={membershipSplit}
            xKey="month"
            showLegend
            series={[
              { key: "free", label: "Free" },
              { key: "premium", label: "Premium", color: "var(--gold)" },
            ]}
          />
        ),
      },
    ],
    props: [
      { name: "data", type: "Record<string, any>[]", description: "Row objects keyed by xKey and series keys." },
      { name: "xKey", type: "string", description: "Category axis field." },
      { name: "series", type: "{ key: string; label?: string; color?: string }[]", description: "Stack order follows array order." },
      { name: "barSize", type: "number", description: "Fixed stack thickness in px." },
      { name: "height", type: "number", default: "280", description: "Chart height in px." },
      { name: "showLegend", type: "boolean", default: "false", description: "Show the muted legend." },
      { name: "className", type: "string", description: "Wrapper class." },
    ],
  },
  {
    id: "grouped-bar-chart",
    name: "GroupedBarChart",
    category: "charts",
    description:
      "Plain multi-series bars placed side by side — compare two related counts like interests sent vs accepted.",
    demos: [
      {
        id: "interests-sent-vs-accepted",
        title: "Interests sent vs accepted",
        description: "Two side-by-side series with rounded tops and a legend.",
        code: `import { GroupedBarChart } from "@/components/ui/charts/basic"

const interestsFlow = [
  { month: "Jan", sent: 540, accepted: 210 },
  { month: "Feb", sent: 610, accepted: 260 },
  { month: "Mar", sent: 580, accepted: 240 },
  { month: "Apr", sent: 690, accepted: 310 },
  { month: "May", sent: 760, accepted: 350 },
  { month: "Jun", sent: 880, accepted: 430 },
]

<GroupedBarChart
  data={interestsFlow}
  xKey="month"
  showLegend
  series={[
    { key: "sent", label: "Sent" },
    { key: "accepted", label: "Accepted", color: "var(--gold)" },
  ]}
/>`,
        render: () => (
          <GroupedBarChart
            data={interestsFlow}
            xKey="month"
            showLegend
            series={[
              { key: "sent", label: "Sent" },
              { key: "accepted", label: "Accepted", color: "var(--gold)" },
            ]}
          />
        ),
      },
    ],
    props: [
      { name: "data", type: "Record<string, any>[]", description: "Row objects keyed by xKey and series keys." },
      { name: "xKey", type: "string", description: "Category axis field." },
      { name: "series", type: "{ key: string; label?: string; color?: string }[]", description: "One entry per bar group." },
      { name: "barSize", type: "number", description: "Fixed bar thickness in px." },
      { name: "height", type: "number", default: "280", description: "Chart height in px." },
      { name: "showLegend", type: "boolean", default: "false", description: "Show the muted legend." },
      { name: "className", type: "string", description: "Wrapper class." },
    ],
  },
  {
    id: "column-chart",
    name: "ColumnChart",
    category: "charts",
    description:
      "BarChart tuned for a chunky column feel — 36px default thickness with an 8px rounded cap. Great for quarterly totals.",
    demos: [
      {
        id: "weddings-per-quarter",
        title: "Weddings per quarter",
        description: "Seasonal peak visible in Q1 and Q4 (Indian wedding season).",
        code: `import { ColumnChart } from "@/components/ui/charts/basic"

const weddingsByQuarter = [
  { quarter: "Q1", weddings: 420 },
  { quarter: "Q2", weddings: 160 },
  { quarter: "Q3", weddings: 210 },
  { quarter: "Q4", weddings: 480 },
]

<ColumnChart
  data={weddingsByQuarter}
  xKey="quarter"
  series={[{ key: "weddings", label: "Weddings", color: "var(--gold)" }]}
/>`,
        render: () => (
          <ColumnChart
            data={weddingsByQuarter}
            xKey="quarter"
            series={[{ key: "weddings", label: "Weddings", color: "var(--gold)" }]}
          />
        ),
      },
    ],
    props: [
      { name: "data", type: "Record<string, any>[]", description: "Row objects keyed by xKey and series keys." },
      { name: "xKey", type: "string", description: "Category axis field." },
      { name: "series", type: "{ key: string; label?: string; color?: string }[]", description: "One entry per column group." },
      { name: "barSize", type: "number", default: "36", description: "Column thickness in px." },
      { name: "height", type: "number", default: "280", description: "Chart height in px." },
      { name: "showGrid", type: "boolean", default: "true", description: "Show the dashed background grid." },
      { name: "showLegend", type: "boolean", default: "false", description: "Show the muted legend." },
      { name: "className", type: "string", description: "Wrapper class." },
    ],
  },
  {
    id: "combo-chart",
    name: "ComboChart",
    category: "charts",
    description:
      "Composed chart mixing bars and lines: give each series a type of \"bar\" or \"line\" — revenue bars with a members line, conversion mix, etc.",
    demos: [
      {
        id: "revenue-and-members",
        title: "Revenue bar + members line",
        description: "Gold revenue bars with a maroon members line sharing one axis.",
        code: `import { ComboChart } from "@/components/ui/charts/basic"

const revenueMembers = [
  { month: "Jan", revenue: 42, members: 12 },
  { month: "Feb", revenue: 55, members: 14 },
  { month: "Mar", revenue: 51, members: 14 },
  { month: "Apr", revenue: 68, members: 16 },
  { month: "May", revenue: 74, members: 18 },
  { month: "Jun", revenue: 92, members: 21 },
]

<ComboChart
  data={revenueMembers}
  xKey="month"
  height={320}
  showLegend
  series={[
    { key: "revenue", label: "Revenue (lakh)", type: "bar", color: "var(--gold)" },
    { key: "members", label: "Members (k)", type: "line", color: "var(--primary)" },
  ]}
/>`,
        render: () => (
          <ComboChart
            data={revenueMembers}
            xKey="month"
            height={320}
            showLegend
            series={[
              { key: "revenue", label: "Revenue (lakh)", type: "bar", color: "var(--gold)" },
              { key: "members", label: "Members (k)", type: "line", color: "var(--primary)" },
            ]}
          />
        ),
        wide: true,
      },
    ],
    props: [
      { name: "data", type: "Record<string, any>[]", description: "Row objects keyed by xKey and series keys." },
      { name: "xKey", type: "string", description: "Category axis field." },
      { name: "series", type: "{ key: string; label?: string; color?: string; type?: \"line\" | \"bar\" }[]", description: "Per-series geometry; defaults to bar." },
      { name: "barSize", type: "number", description: "Fixed thickness for bar-type series." },
      { name: "height", type: "number", default: "280", description: "Chart height in px." },
      { name: "showLegend", type: "boolean", default: "false", description: "Show the muted legend." },
      { name: "showTooltip", type: "boolean", default: "true", description: "Show the hover tooltip." },
      { name: "className", type: "string", description: "Wrapper class." },
    ],
  },
  {
    id: "step-chart",
    name: "StepChart",
    category: "charts",
    description:
      "LineChart rendered with a stepAfter curve — values that hold between checkpoints, like cumulative verified profiles.",
    demos: [
      {
        id: "cumulative-verified",
        title: "Cumulative verified profiles",
        description: "Each verification batch lands as a flat step between months.",
        code: `import { StepChart } from "@/components/ui/charts/basic"

const verifiedCumulative = [
  { month: "Jan", verified: 800 },
  { month: "Feb", verified: 1350 },
  { month: "Mar", verified: 1750 },
  { month: "Apr", verified: 2400 },
  { month: "May", verified: 2900 },
  { month: "Jun", verified: 3600 },
]

<StepChart
  data={verifiedCumulative}
  xKey="month"
  series={[{ key: "verified", label: "Verified profiles" }]}
/>`,
        render: () => (
          <StepChart
            data={verifiedCumulative}
            xKey="month"
            series={[{ key: "verified", label: "Verified profiles" }]}
          />
        ),
      },
    ],
    props: [
      { name: "data", type: "Record<string, any>[]", description: "Row objects keyed by xKey and series keys." },
      { name: "xKey", type: "string", description: "Category axis field." },
      { name: "series", type: "{ key: string; label?: string; color?: string }[]", description: "One entry per step line." },
      { name: "height", type: "number", default: "280", description: "Chart height in px." },
      { name: "showGrid", type: "boolean", default: "true", description: "Show the dashed background grid." },
      { name: "showLegend", type: "boolean", default: "false", description: "Show the muted legend." },
      { name: "className", type: "string", description: "Wrapper class." },
    ],
  },
  {
    id: "sparkline",
    name: "Sparkline",
    category: "charts",
    aliases: ["spark", "mini chart"],
    description:
      "Tiny inline line chart (40px default) with no axes, grid or tooltip — drop into stat cards. Optionally highlights the last data point with showLastDot.",
    demos: [
      {
        id: "stat-cards",
        title: "Stat cards",
        description: "A row of three cards pairing serif KPIs with colored sparklines.",
        code: `import { Sparkline } from "@/components/ui/charts/basic"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

const matchSpark = [
  { day: "Mon", value: 46 },
  { day: "Tue", value: 52 },
  { day: "Wed", value: 49 },
  { day: "Thu", value: 58 },
  { day: "Fri", value: 55 },
  { day: "Sat", value: 61 },
  { day: "Sun", value: 64 },
]

<Card>
  <CardContent className="space-y-3">
    <div className="flex items-center justify-between">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Matches this week
      </p>
      <Badge variant="success">+12%</Badge>
    </div>
    <p className="font-serif text-3xl tracking-tight">64</p>
    <Sparkline data={matchSpark} dataKey="value" color="var(--gold)" showLastDot height={44} />
  </CardContent>
</Card>`,
        render: () => (
          <div className="grid gap-4 sm:grid-cols-3">
            {sparkCards.map((card) => (
              <Card key={card.label}>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {card.label}
                    </p>
                    <Badge variant="success">{card.delta}</Badge>
                  </div>
                  <p className="font-serif text-3xl tracking-tight">{card.value}</p>
                  <Sparkline
                    data={card.data}
                    dataKey="value"
                    color={card.color}
                    showLastDot
                    height={44}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        ),
        wide: true,
      },
    ],
    props: [
      { name: "data", type: "Record<string, any>[]", description: "Row objects containing dataKey values." },
      { name: "dataKey", type: "string", description: "Field to plot." },
      { name: "color", type: "string", default: "var(--chart-1)", description: "Line and last-dot color." },
      { name: "height", type: "number", default: "40", description: "Sparkline height in px." },
      { name: "showLastDot", type: "boolean", default: "false", description: "Highlight the final point with a ring." },
      { name: "className", type: "string", description: "Wrapper class." },
    ],
  },
  {
    id: "range-chart",
    name: "RangeChart",
    category: "charts",
    description:
      "Area rendered as a floating band between a low and high value. Data must carry [low, high] tuples under rangeKey — e.g. match score ranges by age group.",
    demos: [
      {
        id: "match-score-ranges",
        title: "Match score range by age group",
        description: "Five age bands showing the typical low-to-high match score corridor.",
        code: `import { RangeChart } from "@/components/ui/charts/basic"

// Each datum carries a [low, high] tuple under rangeKey.
const matchScoreRanges = [
  { age: "18–25", range: [58, 82] },
  { age: "26–32", range: [64, 91] },
  { age: "33–40", range: [60, 88] },
  { age: "41–50", range: [55, 84] },
  { age: "51+", range: [50, 78] },
]

<RangeChart
  data={matchScoreRanges}
  xKey="age"
  rangeKey="range"
  color="var(--gold)"
/>`,
        render: () => (
          <RangeChart
            data={matchScoreRanges}
            xKey="age"
            rangeKey="range"
            color="var(--gold)"
          />
        ),
      },
    ],
    props: [
      { name: "data", type: "Record<string, any>[]", description: "Row objects with a [low, high] array under rangeKey." },
      { name: "xKey", type: "string", description: "Category axis field (e.g. age group)." },
      { name: "rangeKey", type: "string", description: "Field holding the [low, high] tuple." },
      { name: "color", type: "string", default: "var(--chart-1)", description: "Band fill and stroke color." },
      { name: "height", type: "number", default: "280", description: "Chart height in px." },
      { name: "showGrid", type: "boolean", default: "true", description: "Show the dashed background grid." },
      { name: "showTooltip", type: "boolean", default: "true", description: "Show the hover tooltip." },
      { name: "className", type: "string", description: "Wrapper class." },
    ],
  },
]
