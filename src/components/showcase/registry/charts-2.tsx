import type { ComponentDoc } from "./types"
import {
  DonutChart,
  FunnelChart,
  GaugeChart,
  PieChart,
  RadarChart,
  RadialChart,
} from "@/components/ui/charts/circular"
import {
  BoxPlot,
  BubbleChart,
  CandlestickChart,
  GanttChart,
  Heatmap,
  Histogram,
  NetworkChart,
  SankeyChart,
  ScatterChart,
  Treemap,
  WaterfallChart,
} from "@/components/ui/charts/special"

/* Fixed demo data (deterministic — no randomness) */

const membershipMix = [
  { name: "Premium", value: 540 },
  { name: "Elite Verified", value: 320 },
  { name: "Classic", value: 880 },
  { name: "New Joiners", value: 410 },
  { name: "Basic", value: 260 },
]

const completenessData = [
  { name: "Fully Verified", value: 412 },
  { name: "Horoscope Added", value: 308 },
  { name: "Photos Added", value: 260 },
  { name: "Bio Written", value: 190 },
  { name: "Incomplete", value: 96 },
]

const engagementData = [
  { dimension: "Profile Views", value: 85 },
  { dimension: "Chats", value: 70 },
  { dimension: "Matches", value: 92 },
  { dimension: "Shortlists", value: 64 },
  { dimension: "Horoscope", value: 78 },
  { dimension: "Events", value: 52 },
]

const communityGoals = [
  { name: "Verified Profiles", value: 82 },
  { name: "Premium Upgrades", value: 64 },
  { name: "Match Rate", value: 71 },
  { name: "Event Signups", value: 45 },
]

const interestsFunnel = [
  { name: "Viewed", value: 12400 },
  { name: "Interested", value: 5200 },
  { name: "Contacted", value: 2100 },
  { name: "Married", value: 640 },
]

const ageResponseData = [
  { x: 23, y: 41 },
  { x: 25, y: 55 },
  { x: 26, y: 48 },
  { x: 28, y: 62 },
  { x: 29, y: 58 },
  { x: 31, y: 70 },
  { x: 32, y: 64 },
  { x: 34, y: 76 },
  { x: 35, y: 71 },
  { x: 37, y: 82 },
  { x: 39, y: 74 },
  { x: 41, y: 80 },
  { x: 43, y: 68 },
  { x: 45, y: 59 },
]

const cityEngagement = [
  { x: 34, y: 62, z: 820, name: "Mumbai" },
  { x: 30, y: 71, z: 640, name: "Delhi" },
  { x: 31, y: 66, z: 510, name: "Bengaluru" },
  { x: 29, y: 58, z: 380, name: "Pune" },
  { x: 32, y: 54, z: 300, name: "Hyderabad" },
  { x: 28, y: 47, z: 210, name: "Jaipur" },
]

const heatDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const heatHours = ["6 AM", "9 AM", "12 PM", "3 PM", "6 PM", "9 PM", "12 AM"]
const heatValues = [
  [12, 34, 28, 22, 40, 62, 18],
  [14, 36, 30, 24, 42, 58, 16],
  [13, 38, 32, 26, 44, 66, 20],
  [16, 40, 30, 28, 46, 70, 22],
  [18, 42, 34, 30, 52, 78, 30],
  [26, 58, 72, 64, 70, 84, 42],
  [22, 52, 80, 76, 68, 74, 36],
]

const revenueByCategory = [
  { name: "Premium Plans", value: 480 },
  { name: "Verification", value: 220 },
  { name: "Horoscope Reports", value: 160 },
  { name: "Elite Events", value: 130 },
  { name: "Gifts & Sweets", value: 90 },
  { name: "Advertising", value: 70 },
]

const journeyNodes = [
  { name: "Signup" },
  { name: "Free Profile" },
  { name: "Premium" },
  { name: "Matched" },
  { name: "Engaged" },
  { name: "Married" },
]

const journeyLinks = [
  { source: 0, target: 1, value: 900 },
  { source: 0, target: 2, value: 350 },
  { source: 1, target: 3, value: 420 },
  { source: 2, target: 3, value: 300 },
  { source: 3, target: 4, value: 380 },
  { source: 4, target: 5, value: 240 },
]

const membershipChanges = [
  { name: "Opening", value: 2400, total: true },
  { name: "New Joins", value: 460 },
  { name: "Upgrades", value: 210 },
  { name: "Pauses", value: -120 },
  { name: "Cancellations", value: -180 },
  { name: "Closing", value: 2770, total: true },
]

const goldRates = [
  { label: "W1", open: 6200, high: 6340, low: 6150, close: 6280 },
  { label: "W2", open: 6280, high: 6510, low: 6260, close: 6460 },
  { label: "W3", open: 6460, high: 6520, low: 6180, close: 6240 },
  { label: "W4", open: 6240, high: 6410, low: 6200, close: 6380 },
  { label: "W5", open: 6380, high: 6390, low: 6120, close: 6160 },
  { label: "W6", open: 6160, high: 6320, low: 6140, close: 6290 },
  { label: "W7", open: 6290, high: 6620, low: 6280, close: 6580 },
  { label: "W8", open: 6580, high: 6640, low: 6430, close: 6490 },
]

const memberAges = [
  24, 25, 25, 26, 26, 26, 27, 27, 28, 28, 28, 29, 29, 30, 30, 31, 31, 32,
  32, 33, 33, 34, 34, 35, 35, 36, 36, 37, 38, 38, 39, 40, 41, 42, 44, 46, 48,
]

const responseTimes = [
  { label: "Elite", min: 0.5, q1: 2, median: 4, q3: 9, max: 24 },
  { label: "Premium", min: 1, q1: 4, median: 8, q3: 14, max: 36 },
  { label: "Classic", min: 2, q1: 8, median: 16, q3: 28, max: 72 },
  { label: "New", min: 4, q1: 12, median: 24, q3: 48, max: 120 },
]

const seasonTasks = [
  { name: "Venue booking", start: 0, end: 6, progress: 100 },
  { name: "Guest list", start: 2, end: 8, progress: 70 },
  { name: "Catering tastings", start: 5, end: 12, progress: 45, color: "var(--chart-2)" },
  { name: "Card printing", start: 10, end: 16, progress: 20, color: "var(--chart-3)" },
  { name: "Sangeet practice", start: 12, end: 20, progress: 10 },
  { name: "Honeymoon plans", start: 15, end: 24, progress: 0, color: "var(--chart-4)" },
]

const familyNodes = [
  { id: 0, label: "Aarav", size: 20 },
  { id: 1, label: "Diya", size: 16 },
  { id: 2, label: "Kabir", size: 14 },
  { id: 3, label: "Meera", size: 16 },
  { id: 4, label: "Rohan", size: 12 },
  { id: 5, label: "Anaya", size: 14 },
  { id: 6, label: "Vikram", size: 12 },
  { id: 7, label: "Ishita", size: 10 },
]

const familyEdges: Array<[number, number]> = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 3],
  [2, 4],
  [3, 5],
  [4, 5],
  [5, 6],
  [6, 7],
  [0, 7],
]

export const charts_2Docs: ComponentDoc[] = [
  {
    id: "piechart",
    name: "PieChart",
    category: "charts",
    description:
      "Theme-aware pie chart built on recharts with token-driven palette, popover-styled tooltip and optional legend.",
    aliases: ["Pie"],
    demos: [
      {
        id: "membership-mix",
        title: "Membership mix",
        description: "Share of members across subscription tiers.",
        code: `import { PieChart } from "@/components/ui/charts/circular"

const data = [
  { name: "Premium", value: 540 },
  { name: "Elite Verified", value: 320 },
  { name: "Classic", value: 880 },
  { name: "New Joiners", value: 410 },
  { name: "Basic", value: 260 },
]

<PieChart data={data} showLegend />`,
        render: () => <PieChart data={membershipMix} showLegend />,
      },
    ],
    props: [
      { name: "data", type: "{ name: string; value: number; color?: string }[]", description: "Slices; optional per-slice color override." },
      { name: "height", type: "number", default: "280", description: "Chart container height in px." },
      { name: "showLegend", type: "boolean", default: "false", description: "Show the bottom legend." },
      { name: "showTooltip", type: "boolean", default: "true", description: "Show tooltip on slice hover." },
      { name: "innerRadius", type: "number | string", default: "0", description: "Inner radius to create a donut cut-out." },
    ],
  },
  {
    id: "donutchart",
    name: "DonutChart",
    category: "charts",
    description:
      "Rounded donut chart with a center label slot for headline metrics — perfect for completion or match-rate summaries.",
    aliases: ["Donut", "DoughnutChart"],
    demos: [
      {
        id: "profile-completeness",
        title: "Profile completeness by member type",
        description: "Donut with center KPI for average completeness.",
        code: `import { DonutChart } from "@/components/ui/charts/circular"

const data = [
  { name: "Fully Verified", value: 412 },
  { name: "Horoscope Added", value: 308 },
  { name: "Photos Added", value: 260 },
  { name: "Bio Written", value: 190 },
  { name: "Incomplete", value: 96 },
]

<DonutChart
  data={data}
  centerValue="82%"
  centerLabel="Avg. completeness"
  showLegend
/>`,
        render: () => (
          <DonutChart
            data={completenessData}
            centerValue="82%"
            centerLabel="Avg. completeness"
            showLegend
          />
        ),
      },
    ],
    props: [
      { name: "data", type: "{ name: string; value: number; color?: string }[]", description: "Slices; palette is applied automatically." },
      { name: "centerValue", type: "React.ReactNode", description: "Serif headline rendered in the donut hole." },
      { name: "centerLabel", type: "React.ReactNode", description: "Muted caption below the center value." },
      { name: "innerRadius", type: "number | string", default: '"60%"', description: "Hole size of the donut." },
      { name: "showLegend", type: "boolean", default: "false", description: "Show the bottom legend." },
      { name: "height", type: "number", default: "280", description: "Chart container height in px." },
    ],
  },
  {
    id: "radarchart",
    name: "RadarChart",
    category: "charts",
    description:
      "Polar radar chart for multi-dimension comparison with muted grid lines and a soft 25% fill.",
    aliases: ["Radar", "SpiderChart"],
    demos: [
      {
        id: "engagement",
        title: "Member engagement dimensions",
        description: "Radar of engagement signals for the average profile.",
        code: `import { RadarChart } from "@/components/ui/charts/circular"

const data = [
  { dimension: "Profile Views", value: 85 },
  { dimension: "Chats", value: 70 },
  { dimension: "Matches", value: 92 },
  { dimension: "Shortlists", value: 64 },
  { dimension: "Horoscope", value: 78 },
  { dimension: "Events", value: 52 },
]

<RadarChart data={data} height={320} />`,
        render: () => <RadarChart data={engagementData} height={320} />,
        wide: true,
      },
    ],
    props: [
      { name: "data", type: "{ dimension: string; value: number }[]", description: "One point per spoke of the radar." },
      { name: "dataKey", type: "string", default: '"value"', description: "Key holding the numeric value." },
      { name: "nameKey", type: "string", default: '"dimension"', description: "Key holding the spoke label." },
      { name: "color", type: "string", default: '"var(--chart-1)"', description: "Stroke and fill color token." },
      { name: "height", type: "number", default: "300", description: "Chart container height in px." },
      { name: "showTooltip", type: "boolean", default: "true", description: "Show tooltip on vertex hover." },
    ],
  },
  {
    id: "radialchart",
    name: "RadialChart",
    category: "charts",
    description:
      "Concentric radial progress bars — each entry renders as its own ring with a muted background track.",
    aliases: ["RadialBarChart", "ProgressRing"],
    demos: [
      {
        id: "community-goals",
        title: "Community goals",
        description: "Quarterly progress toward community targets.",
        code: `import { RadialChart } from "@/components/ui/charts/circular"

const data = [
  { name: "Verified Profiles", value: 82 },
  { name: "Premium Upgrades", value: 64 },
  { name: "Match Rate", value: 71 },
  { name: "Event Signups", value: 45 },
]

<RadialChart data={data} showLegend height={300} />`,
        render: () => <RadialChart data={communityGoals} showLegend height={300} />,
        wide: true,
      },
    ],
    props: [
      { name: "data", type: "{ name: string; value: number; fill?: string }[]", description: "One ring per entry; palette fallback applied." },
      { name: "innerRadius", type: "number | string", default: '"30%"', description: "Inner radius of the ring stack." },
      { name: "outerRadius", type: "number | string", default: '"100%"', description: "Outer radius of the ring stack." },
      { name: "startAngle", type: "number", default: "90", description: "Sweep start angle in degrees." },
      { name: "endAngle", type: "number", default: "-270", description: "Sweep end angle in degrees." },
      { name: "showLegend", type: "boolean", default: "false", description: "Legend with one swatch per ring." },
    ],
  },
  {
    id: "gaugechart",
    name: "GaugeChart",
    category: "charts",
    description:
      "Custom SVG semicircle gauge with rounded track, animated needle and a serif value readout — ideal for Kundli match scores.",
    aliases: ["Gauge", "Speedometer"],
    demos: [
      {
        id: "kundli-score",
        title: "Kundli match score",
        description: "Two gauges comparing match and trust scores.",
        code: `import { GaugeChart } from "@/components/ui/charts/circular"

<GaugeChart value={86} label="Kundli match score" />
<GaugeChart value={64} label="Profile trust" color="var(--chart-1)" />`,
        render: () => (
          <div className="flex flex-wrap items-center justify-center gap-8">
            <GaugeChart value={86} label="Kundli match score" />
            <GaugeChart value={64} label="Profile trust" color="var(--chart-1)" />
          </div>
        ),
      },
    ],
    props: [
      { name: "value", type: "number", description: "Fill percentage, clamped to 0-100." },
      { name: "size", type: "number", default: "180", description: "Width of the gauge in px." },
      { name: "label", type: "React.ReactNode", description: "Muted caption below the value." },
      { name: "color", type: "string", default: '"var(--gold)"', description: "Arc and highlight color token." },
    ],
  },
  {
    id: "funnelchart",
    name: "FunnelChart",
    category: "charts",
    description:
      "recharts funnel with stage labels and descending opacity of chart-1 — great for interest-to-marriage pipelines.",
    aliases: ["Funnel"],
    demos: [
      {
        id: "interests-funnel",
        title: "Interests funnel",
        description: "Viewed → Interested → Contacted → Married.",
        code: `import { FunnelChart } from "@/components/ui/charts/circular"

const data = [
  { name: "Viewed", value: 12400 },
  { name: "Interested", value: 5200 },
  { name: "Contacted", value: 2100 },
  { name: "Married", value: 640 },
]

<FunnelChart data={data} height={260} />`,
        render: () => <FunnelChart data={interestsFunnel} height={260} />,
      },
    ],
    props: [
      { name: "data", type: "{ name: string; value: number }[]", description: "Stages from widest to narrowest." },
      { name: "height", type: "number", default: "280", description: "Chart container height in px." },
      { name: "showTooltip", type: "boolean", default: "true", description: "Show tooltip with stage values." },
      { name: "className", type: "string", description: "Wrapper className." },
    ],
  },
  {
    id: "scatterchart",
    name: "ScatterChart",
    category: "charts",
    description:
      "Numeric XY scatter plot with bordered grid, muted ticks and optional axis labels.",
    aliases: ["Scatter"],
    demos: [
      {
        id: "age-vs-response",
        title: "Age vs response rate",
        description: "How response rate trends with member age.",
        code: `import { ScatterChart } from "@/components/ui/charts/special"

const data = [
  { x: 23, y: 41 },
  { x: 25, y: 55 },
  { x: 28, y: 62 },
  { x: 31, y: 70 },
  { x: 34, y: 76 },
  { x: 37, y: 82 },
  { x: 41, y: 80 },
  { x: 45, y: 59 },
]

<ScatterChart data={data} xLabel="Age (years)" yLabel="Response rate (%)" />`,
        render: () => (
          <ScatterChart
            data={ageResponseData}
            xLabel="Age (years)"
            yLabel="Response rate (%)"
          />
        ),
      },
    ],
    props: [
      { name: "data", type: "{ x: number; y: number; name?: string }[]", description: "Numeric points to plot." },
      { name: "xLabel", type: "string", description: "Caption rendered under the X axis." },
      { name: "yLabel", type: "string", description: "Caption rendered along the Y axis." },
      { name: "height", type: "number", default: "280", description: "Chart container height in px." },
      { name: "color", type: "string", default: '"var(--chart-1)"', description: "Dot fill color token." },
      { name: "showTooltip", type: "boolean", default: "true", description: "Show tooltip on point hover." },
    ],
  },
  {
    id: "bubblechart",
    name: "BubbleChart",
    category: "charts",
    description:
      "Scatter chart where a third z dimension drives circle size via a custom shape — compare volume across cities or cohorts.",
    aliases: ["Bubble"],
    demos: [
      {
        id: "city-engagement",
        title: "Engagement by city",
        description: "Response rate vs average age, bubble size = active members.",
        code: `import { BubbleChart } from "@/components/ui/charts/special"

const data = [
  { x: 34, y: 62, z: 820, name: "Mumbai" },
  { x: 30, y: 71, z: 640, name: "Delhi" },
  { x: 31, y: 66, z: 510, name: "Bengaluru" },
  { x: 29, y: 58, z: 380, name: "Pune" },
  { x: 32, y: 54, z: 300, name: "Hyderabad" },
  { x: 28, y: 47, z: 210, name: "Jaipur" },
]

<BubbleChart data={data} xLabel="Avg. age" yLabel="Response rate (%)" />`,
        render: () => (
          <BubbleChart data={cityEngagement} xLabel="Avg. age" yLabel="Response rate (%)" />
        ),
      },
    ],
    props: [
      { name: "data", type: "{ x: number; y: number; z: number; name?: string }[]", description: "Points; z drives the bubble radius." },
      { name: "xLabel", type: "string", description: "Caption rendered under the X axis." },
      { name: "yLabel", type: "string", description: "Caption rendered along the Y axis." },
      { name: "color", type: "string", default: '"var(--chart-2)"', description: "Bubble fill and stroke token." },
      { name: "height", type: "number", default: "280", description: "Chart container height in px." },
      { name: "showTooltip", type: "boolean", default: "true", description: "Show tooltip on bubble hover." },
    ],
  },
  {
    id: "heatmap",
    name: "Heatmap",
    category: "charts",
    description:
      "CSS-grid heatmap with auto-scaled color-mix intensities, native title tooltips, hover scaling and a gradient legend bar.",
    aliases: ["Heat Map", "Matrix"],
    demos: [
      {
        id: "activity-grid",
        title: "Activity by day × hour",
        description: "Profile activity intensity across the week.",
        code: `import { Heatmap } from "@/components/ui/charts/special"

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const hours = ["6 AM", "9 AM", "12 PM", "3 PM", "6 PM", "9 PM", "12 AM"]
const values = [
  [12, 34, 28, 22, 40, 62, 18],
  [14, 36, 30, 24, 42, 58, 16],
  [13, 38, 32, 26, 44, 66, 20],
  [16, 40, 30, 28, 46, 70, 22],
  [18, 42, 34, 30, 52, 78, 30],
  [26, 58, 72, 64, 70, 84, 42],
  [22, 52, 80, 76, 68, 74, 36],
]

<Heatmap rows={days} cols={hours} values={values} />`,
        render: () => <Heatmap rows={heatDays} cols={heatHours} values={heatValues} />,
        wide: true,
      },
    ],
    props: [
      { name: "rows", type: "string[]", description: "Row labels (rendered on the left)." },
      { name: "cols", type: "string[]", description: "Column labels (rendered on top)." },
      { name: "values", type: "number[][]", description: "values[row][col]; missing entries fall back to 0." },
      { name: "color", type: "string", default: '"var(--chart-1)"', description: "Base token mixed per-cell via color-mix." },
      { name: "max", type: "number", description: "Intensity ceiling; auto-computed from data when omitted." },
      { name: "cellSize", type: "number", default: "38", description: "Cell square size in px." },
    ],
  },
  {
    id: "treemap",
    name: "Treemap",
    category: "charts",
    description:
      "recharts treemap with rounded custom cells, card-toned gaps and in-cell name/value labels.",
    aliases: ["Tree Map"],
    demos: [
      {
        id: "revenue-categories",
        title: "Revenue by category",
        description: "Area encodes revenue contribution per category.",
        code: `import { Treemap } from "@/components/ui/charts/special"

const data = [
  { name: "Premium Plans", value: 480 },
  { name: "Verification", value: 220 },
  { name: "Horoscope Reports", value: 160 },
  { name: "Elite Events", value: 130 },
  { name: "Gifts & Sweets", value: 90 },
  { name: "Advertising", value: 70 },
]

<Treemap data={data} height={300} />`,
        render: () => <Treemap data={revenueByCategory} height={300} />,
        wide: true,
      },
    ],
    props: [
      { name: "data", type: "{ name: string; value: number }[]", description: "Leaf nodes; area is proportional to value." },
      { name: "height", type: "number", default: "280", description: "Chart container height in px." },
      { name: "showTooltip", type: "boolean", default: "true", description: "Show tooltip on cell hover." },
      { name: "className", type: "string", description: "Wrapper className." },
    ],
  },
  {
    id: "sankeychart",
    name: "SankeyChart",
    category: "charts",
    description:
      "Flow diagram with chart-1 nodes and translucent chart-2 ribbons, labeled via a custom node renderer.",
    aliases: ["Sankey", "Flow"],
    demos: [
      {
        id: "member-journey",
        title: "Member journey",
        description: "Signup → Profile → Match → Wedding flow volumes.",
        code: `import { SankeyChart } from "@/components/ui/charts/special"

const nodes = [
  { name: "Signup" },
  { name: "Free Profile" },
  { name: "Premium" },
  { name: "Matched" },
  { name: "Engaged" },
  { name: "Married" },
]
const links = [
  { source: 0, target: 1, value: 900 },
  { source: 0, target: 2, value: 350 },
  { source: 1, target: 3, value: 420 },
  { source: 2, target: 3, value: 300 },
  { source: 3, target: 4, value: 380 },
  { source: 4, target: 5, value: 240 },
]

<SankeyChart nodes={nodes} links={links} height={300} />`,
        render: () => <SankeyChart nodes={journeyNodes} links={journeyLinks} height={300} />,
        wide: true,
      },
    ],
    props: [
      { name: "nodes", type: "{ name: string }[]", description: "Stages of the flow, referenced by index." },
      { name: "links", type: "{ source: number; target: number; value: number }[]", description: "Edges; source/target are node indices." },
      { name: "height", type: "number", default: "280", description: "Chart container height in px." },
      { name: "showTooltip", type: "boolean", default: "true", description: "Show tooltip on node/link hover." },
    ],
  },
  {
    id: "waterfallchart",
    name: "WaterfallChart",
    category: "charts",
    description:
      "Custom SVG waterfall of floating bars with dashed connectors, positive/negative/total coloring and auto-scaled Y axis.",
    aliases: ["Waterfall", "Bridge"],
    demos: [
      {
        id: "membership-changes",
        title: "Membership changes, Q4",
        description: "How the paid member base moved through the quarter.",
        code: `import { WaterfallChart } from "@/components/ui/charts/special"

const data = [
  { name: "Opening", value: 2400, total: true },
  { name: "New Joins", value: 460 },
  { name: "Upgrades", value: 210 },
  { name: "Pauses", value: -120 },
  { name: "Cancellations", value: -180 },
  { name: "Closing", value: 2770, total: true },
]

<WaterfallChart data={data} height={300} />`,
        render: () => <WaterfallChart data={membershipChanges} height={300} />,
        wide: true,
      },
    ],
    props: [
      { name: "data", type: "{ name: string; value: number; total?: boolean }[]", description: "Steps; totals render from zero in chart-1." },
      { name: "height", type: "number", default: "280", description: "Chart height in px." },
      { name: "showValues", type: "boolean", default: "true", description: "Value labels above/below each bar." },
      { name: "className", type: "string", description: "Wrapper className." },
    ],
  },
  {
    id: "candlestickchart",
    name: "CandlestickChart",
    category: "charts",
    description:
      "Custom SVG OHLC candles — green when close ≥ open, red otherwise — with wicks, 4 gridlines and sparse x labels.",
    aliases: ["Candlestick", "OHLC"],
    demos: [
      {
        id: "gold-rate",
        title: "Gold rate trend",
        description: "Weekly gold rate candles in rupees per 10 grams.",
        code: `import { CandlestickChart } from "@/components/ui/charts/special"

const data = [
  { label: "W1", open: 6200, high: 6340, low: 6150, close: 6280 },
  { label: "W2", open: 6280, high: 6510, low: 6260, close: 6460 },
  { label: "W3", open: 6460, high: 6520, low: 6180, close: 6240 },
  { label: "W4", open: 6240, high: 6410, low: 6200, close: 6380 },
  { label: "W5", open: 6380, high: 6390, low: 6120, close: 6160 },
  { label: "W6", open: 6160, high: 6320, low: 6140, close: 6290 },
  { label: "W7", open: 6290, high: 6620, low: 6280, close: 6580 },
  { label: "W8", open: 6580, high: 6640, low: 6430, close: 6490 },
]

<CandlestickChart data={data} height={300} />`,
        render: () => <CandlestickChart data={goldRates} height={300} />,
        wide: true,
      },
    ],
    props: [
      { name: "data", type: "{ label: string; open: number; high: number; low: number; close: number }[]", description: "OHLC rows; color derives from close vs open." },
      { name: "height", type: "number", default: "280", description: "Chart height in px." },
      { name: "className", type: "string", description: "Wrapper className." },
    ],
  },
  {
    id: "histogram",
    name: "Histogram",
    category: "charts",
    description:
      "Bins raw values into labeled [a–b) buckets and renders a full-width single-series bar chart with angled tick labels.",
    aliases: ["Distribution", "Bins"],
    demos: [
      {
        id: "member-ages",
        title: "Ages of active members",
        description: "Eight age buckets across the active member base.",
        code: `import { Histogram } from "@/components/ui/charts/special"

const values = [
  24, 25, 25, 26, 26, 26, 27, 27, 28, 28, 28, 29, 29, 30, 30, 31,
  31, 32, 32, 33, 33, 34, 34, 35, 35, 36, 36, 37, 38, 38, 39, 40,
  41, 42, 44, 46, 48,
]

<Histogram values={values} bins={8} xLabel="Age (years)" />`,
        render: () => <Histogram values={memberAges} bins={8} xLabel="Age (years)" />,
      },
    ],
    props: [
      { name: "values", type: "number[]", description: "Raw values to bin." },
      { name: "bins", type: "number", default: "8", description: "Number of equal-width buckets." },
      { name: "xLabel", type: "string", description: "Caption rendered below the chart." },
      { name: "height", type: "number", default: "280", description: "Chart height in px." },
      { name: "showTooltip", type: "boolean", default: "true", description: "Show tooltip with bucket counts." },
    ],
  },
  {
    id: "boxplot",
    name: "BoxPlot",
    category: "charts",
    description:
      "Custom SVG horizontal box plots with whiskers, chart-1 translucent boxes and a gold median line; height adapts to rows.",
    aliases: ["Box Plot", "Quartiles"],
    demos: [
      {
        id: "response-times",
        title: "Response time by member type",
        description: "Distribution of first-response times in hours.",
        code: `import { BoxPlot } from "@/components/ui/charts/special"

const data = [
  { label: "Elite", min: 0.5, q1: 2, median: 4, q3: 9, max: 24 },
  { label: "Premium", min: 1, q1: 4, median: 8, q3: 14, max: 36 },
  { label: "Classic", min: 2, q1: 8, median: 16, q3: 28, max: 72 },
  { label: "New", min: 4, q1: 12, median: 24, q3: 48, max: 120 },
]

<BoxPlot data={data} />`,
        render: () => <BoxPlot data={responseTimes} />,
        wide: true,
      },
    ],
    props: [
      { name: "data", type: "{ label: string; min: number; q1: number; median: number; q3: number; max: number }[]", description: "One five-number summary per row." },
      { name: "className", type: "string", description: "Wrapper className." },
    ],
  },
  {
    id: "ganttchart",
    name: "GanttChart",
    category: "charts",
    description:
      "Timeline of rounded task bars with gold progress overlays, five date ticks and an optional dashed today marker.",
    aliases: ["Gantt"],
    demos: [
      {
        id: "wedding-planning",
        title: "Wedding season planning",
        description: "Preparation tracks with progress and a today marker.",
        code: `import { GanttChart } from "@/components/ui/charts/special"

const tasks = [
  { name: "Venue booking", start: 0, end: 6, progress: 100 },
  { name: "Guest list", start: 2, end: 8, progress: 70 },
  { name: "Catering tastings", start: 5, end: 12, progress: 45, color: "var(--chart-2)" },
  { name: "Card printing", start: 10, end: 16, progress: 20, color: "var(--chart-3)" },
  { name: "Sangeet practice", start: 12, end: 20, progress: 10 },
  { name: "Honeymoon plans", start: 15, end: 24, progress: 0, color: "var(--chart-4)" },
]

<GanttChart tasks={tasks} today={11} />`,
        render: () => <GanttChart tasks={seasonTasks} today={11} />,
        wide: true,
      },
    ],
    props: [
      { name: "tasks", type: "{ name: string; start: number; end: number; progress?: number; color?: string }[]", description: "One bar per task; day-number units." },
      { name: "maxEnd", type: "number", description: "Timeline upper bound; max task end when omitted." },
      { name: "today", type: "number", description: "Day for the dashed destructive marker; hidden if out of range." },
      { name: "className", type: "string", description: "Wrapper className." },
    ],
  },
  {
    id: "networkchart",
    name: "NetworkChart",
    category: "charts",
    description:
      "Deterministic circular network graph — sized circles on a ring, border-toned edges and small muted labels.",
    aliases: ["Network", "Graph"],
    demos: [
      {
        id: "family-connections",
        title: "Family connection graph",
        description: "How eight members of an extended family connect.",
        code: `import { NetworkChart } from "@/components/ui/charts/special"

const nodes = [
  { id: 0, label: "Aarav", size: 20 },
  { id: 1, label: "Diya", size: 16 },
  { id: 2, label: "Kabir", size: 14 },
  { id: 3, label: "Meera", size: 16 },
  { id: 4, label: "Rohan", size: 12 },
  { id: 5, label: "Anaya", size: 14 },
  { id: 6, label: "Vikram", size: 12 },
  { id: 7, label: "Ishita", size: 10 },
]
const edges: Array<[number, number]> = [
  [0, 1], [0, 2], [1, 3], [2, 3], [2, 4],
  [3, 5], [4, 5], [5, 6], [6, 7], [0, 7],
]

<NetworkChart nodes={nodes} edges={edges} height={320} />`,
        render: () => <NetworkChart nodes={familyNodes} edges={familyEdges} height={320} />,
        wide: true,
      },
    ],
    props: [
      { name: "nodes", type: "{ id: number | string; label?: string; size?: number }[]", description: "Vertices laid out clockwise from the top." },
      { name: "edges", type: "[number, number][]", description: "Edges as index pairs into nodes." },
      { name: "height", type: "number", default: "320", description: "Chart height in px." },
      { name: "className", type: "string", description: "Wrapper className." },
    ],
  },
]
