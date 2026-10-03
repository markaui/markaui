"use client"

import * as React from "react"

import {
  Area as RArea,
  AreaChart as RAreaChart,
  Bar as RBar,
  BarChart as RBarChart,
  CartesianGrid as RCartesianGrid,
  ComposedChart as RComposedChart,
  Legend as RLegend,
  Line as RLine,
  LineChart as RLineChart,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis as RXAxis,
  YAxis as RYAxis,
} from "recharts"

import { cn } from "../../../lib/utils"

/**
 * Saptapadi basic chart family (recharts-based).
 *
 * Every chart shares one theme-aware contract: pass `data`, `xKey` and a
 * `series` descriptor list; colors default to the `--chart-1..5` tokens so all
 * 12 themes + dark mode adapt automatically. Spread the exported style config
 * objects (`ChartAxes`, `ChartGridStyle`, `ChartTooltipStyle`, `ChartLegendStyle`)
 * onto raw recharts components when composing fully custom charts.
 */

/* -------------------------------------------------------------------------- */
/*  Shared style config                                                        */
/* -------------------------------------------------------------------------- */

/** Theme-aware default series palette (chart tokens 1–5). */
export const PALETTE: string[] = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]

/** Spread onto recharts `<Tooltip>` for popover-styled tooltips. */
export const ChartTooltipStyle = {
  contentStyle: {
    backgroundColor: "var(--popover)",
    border: "1px solid var(--border)",
    borderRadius: 12,
    fontSize: 12,
    color: "var(--popover-foreground)",
  },
  labelStyle: { color: "var(--muted-foreground)", fontWeight: 600 },
  itemStyle: { color: "var(--foreground)" },
  cursor: { stroke: "var(--border)" },
} satisfies Partial<React.ComponentProps<typeof RTooltip>>

/** Spread onto recharts `<XAxis>` / `<YAxis>` for quiet, theme-aware axes. */
export const ChartAxes = {
  tick: { fill: "var(--muted-foreground)", fontSize: 11 },
  axisLine: false,
  tickLine: false,
} satisfies Partial<React.ComponentProps<typeof RXAxis>>

/** Spread onto recharts `<CartesianGrid>` for a soft dashed horizontal grid. */
export const ChartGridStyle = {
  stroke: "var(--border)",
  strokeDasharray: "3 3",
  vertical: false,
} satisfies Partial<React.ComponentProps<typeof RCartesianGrid>>

/** Spread onto recharts `<Legend>` for muted, compact legend text. */
export const ChartLegendStyle = {
  wrapperStyle: { color: "var(--muted-foreground)", fontSize: 12 },
} satisfies Partial<React.ComponentProps<typeof RLegend>>

const CHART_MARGIN = { top: 8, right: 16, bottom: 0, left: 0 }

/* -------------------------------------------------------------------------- */
/*  Shared types                                                               */
/* -------------------------------------------------------------------------- */

export interface ChartSeries {
  /** Data field to plot, e.g. "matches". */
  key: string
  /** Human label used in tooltips/legend. Falls back to `key`. */
  label?: string
  /** Any CSS color; defaults to the palette (`--chart-1..5`). */
  color?: string
}

export interface BaseChartProps {
  data: Record<string, any>[]
  xKey: string
  series: ChartSeries[]
  height?: number
  className?: string
  showGrid?: boolean
  showLegend?: boolean
  showTooltip?: boolean
}

export interface BarChartProps extends BaseChartProps {
  /** Fixed bar thickness in px. */
  barSize?: number
}

/** Series with a per-series geometry for ComboChart. */
export interface ComboChartSeries extends ChartSeries {
  type?: "line" | "bar"
}

export interface ComboChartProps extends BaseChartProps {
  series: ComboChartSeries[]
  barSize?: number
}

function seriesColor(series: ChartSeries, index: number): string {
  return series.color ?? PALETTE[index % PALETTE.length]
}

/* -------------------------------------------------------------------------- */
/*  Line                                                                       */
/* -------------------------------------------------------------------------- */

export function LineChart({
  data,
  xKey,
  series,
  height = 280,
  className,
  showGrid = true,
  showLegend = false,
  showTooltip = true,
}: BaseChartProps) {
  return (
    <div data-slot="line-chart" className={cn("w-full", className)} style={{ width: "100%" }}>
      <ResponsiveContainer width="100%" height={height}>
        <RLineChart data={data} margin={CHART_MARGIN}>
          {showGrid && <RCartesianGrid {...ChartGridStyle} />}
          <RXAxis dataKey={xKey} {...ChartAxes} />
          <RYAxis {...ChartAxes} />
          {showTooltip && <RTooltip {...ChartTooltipStyle} />}
          {showLegend && <RLegend {...ChartLegendStyle} />}
          {series.map((s, i) => (
            <RLine
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label ?? s.key}
              stroke={seriesColor(s, i)}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5 }}
            />
          ))}
        </RLineChart>
      </ResponsiveContainer>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Area                                                                       */
/* -------------------------------------------------------------------------- */

export function AreaChart({
  data,
  xKey,
  series,
  height = 280,
  className,
  showGrid = true,
  showLegend = false,
  showTooltip = true,
}: BaseChartProps) {
  return (
    <div data-slot="area-chart" className={cn("w-full", className)} style={{ width: "100%" }}>
      <ResponsiveContainer width="100%" height={height}>
        <RAreaChart data={data} margin={CHART_MARGIN}>
          {showGrid && <RCartesianGrid {...ChartGridStyle} />}
          <RXAxis dataKey={xKey} {...ChartAxes} />
          <RYAxis {...ChartAxes} />
          {showTooltip && <RTooltip {...ChartTooltipStyle} />}
          {showLegend && <RLegend {...ChartLegendStyle} />}
          {series.map((s, i) => (
            <RArea
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label ?? s.key}
              stroke={seriesColor(s, i)}
              fill={seriesColor(s, i)}
              fillOpacity={0.18}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5 }}
            />
          ))}
        </RAreaChart>
      </ResponsiveContainer>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Bar (vertical)                                                             */
/* -------------------------------------------------------------------------- */

export function BarChart({
  data,
  xKey,
  series,
  height = 280,
  className,
  showGrid = true,
  showLegend = false,
  showTooltip = true,
  barSize,
}: BarChartProps) {
  return (
    <div data-slot="bar-chart" className={cn("w-full", className)} style={{ width: "100%" }}>
      <ResponsiveContainer width="100%" height={height}>
        <RBarChart data={data} margin={CHART_MARGIN}>
          {showGrid && <RCartesianGrid {...ChartGridStyle} />}
          <RXAxis dataKey={xKey} {...ChartAxes} />
          <RYAxis {...ChartAxes} />
          {showTooltip && <RTooltip {...ChartTooltipStyle} />}
          {showLegend && <RLegend {...ChartLegendStyle} />}
          {series.map((s, i) => (
            <RBar
              key={s.key}
              dataKey={s.key}
              name={s.label ?? s.key}
              fill={seriesColor(s, i)}
              radius={[6, 6, 0, 0]}
              barSize={barSize}
            />
          ))}
        </RBarChart>
      </ResponsiveContainer>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Horizontal bar                                                             */
/* -------------------------------------------------------------------------- */

export function HorizontalBarChart({
  data,
  xKey,
  series,
  height = 280,
  className,
  showGrid = true,
  showLegend = false,
  showTooltip = true,
  barSize,
}: BarChartProps) {
  return (
    <div data-slot="horizontal-bar-chart" className={cn("w-full", className)} style={{ width: "100%" }}>
      <ResponsiveContainer width="100%" height={height}>
        <RBarChart data={data} layout="vertical" margin={{ top: 8, right: 24, bottom: 0, left: 0 }}>
          {showGrid && <RCartesianGrid {...ChartGridStyle} horizontal={false} vertical />}
          <RXAxis type="number" {...ChartAxes} />
          <RYAxis type="category" dataKey={xKey} width={80} {...ChartAxes} />
          {showTooltip && <RTooltip {...ChartTooltipStyle} />}
          {showLegend && <RLegend {...ChartLegendStyle} />}
          {series.map((s, i) => (
            <RBar
              key={s.key}
              dataKey={s.key}
              name={s.label ?? s.key}
              fill={seriesColor(s, i)}
              radius={[0, 6, 6, 0]}
              barSize={barSize}
            />
          ))}
        </RBarChart>
      </ResponsiveContainer>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Stacked bar                                                                */
/* -------------------------------------------------------------------------- */

export function StackedBarChart({
  data,
  xKey,
  series,
  height = 280,
  className,
  showGrid = true,
  showLegend = false,
  showTooltip = true,
  barSize,
}: BarChartProps) {
  return (
    <div data-slot="stacked-bar-chart" className={cn("w-full", className)} style={{ width: "100%" }}>
      <ResponsiveContainer width="100%" height={height}>
        <RBarChart data={data} margin={CHART_MARGIN}>
          {showGrid && <RCartesianGrid {...ChartGridStyle} />}
          <RXAxis dataKey={xKey} {...ChartAxes} />
          <RYAxis {...ChartAxes} />
          {showTooltip && <RTooltip {...ChartTooltipStyle} />}
          {showLegend && <RLegend {...ChartLegendStyle} />}
          {series.map((s, i) => (
            <RBar
              key={s.key}
              dataKey={s.key}
              name={s.label ?? s.key}
              stackId="a"
              fill={seriesColor(s, i)}
              barSize={barSize}
            />
          ))}
        </RBarChart>
      </ResponsiveContainer>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Grouped bar                                                                */
/* -------------------------------------------------------------------------- */

export function GroupedBarChart({
  data,
  xKey,
  series,
  height = 280,
  className,
  showGrid = true,
  showLegend = false,
  showTooltip = true,
  barSize,
}: BarChartProps) {
  return (
    <div data-slot="grouped-bar-chart" className={cn("w-full", className)} style={{ width: "100%" }}>
      <ResponsiveContainer width="100%" height={height}>
        <RBarChart data={data} margin={CHART_MARGIN}>
          {showGrid && <RCartesianGrid {...ChartGridStyle} />}
          <RXAxis dataKey={xKey} {...ChartAxes} />
          <RYAxis {...ChartAxes} />
          {showTooltip && <RTooltip {...ChartTooltipStyle} />}
          {showLegend && <RLegend {...ChartLegendStyle} />}
          {series.map((s, i) => (
            <RBar
              key={s.key}
              dataKey={s.key}
              name={s.label ?? s.key}
              fill={seriesColor(s, i)}
              radius={[6, 6, 0, 0]}
              barSize={barSize}
            />
          ))}
        </RBarChart>
      </ResponsiveContainer>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Column (chunky vertical bars)                                              */
/* -------------------------------------------------------------------------- */

export function ColumnChart({
  data,
  xKey,
  series,
  height = 280,
  className,
  showGrid = true,
  showLegend = false,
  showTooltip = true,
  barSize = 36,
}: BarChartProps) {
  return (
    <div data-slot="column-chart" className={cn("w-full", className)} style={{ width: "100%" }}>
      <ResponsiveContainer width="100%" height={height}>
        <RBarChart data={data} margin={CHART_MARGIN}>
          {showGrid && <RCartesianGrid {...ChartGridStyle} />}
          <RXAxis dataKey={xKey} {...ChartAxes} />
          <RYAxis {...ChartAxes} />
          {showTooltip && <RTooltip {...ChartTooltipStyle} />}
          {showLegend && <RLegend {...ChartLegendStyle} />}
          {series.map((s, i) => (
            <RBar
              key={s.key}
              dataKey={s.key}
              name={s.label ?? s.key}
              fill={seriesColor(s, i)}
              radius={[8, 8, 0, 0]}
              barSize={barSize}
            />
          ))}
        </RBarChart>
      </ResponsiveContainer>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Combo (line + bar)                                                         */
/* -------------------------------------------------------------------------- */

export function ComboChart({
  data,
  xKey,
  series,
  height = 280,
  className,
  showGrid = true,
  showLegend = false,
  showTooltip = true,
  barSize,
}: ComboChartProps) {
  return (
    <div data-slot="combo-chart" className={cn("w-full", className)} style={{ width: "100%" }}>
      <ResponsiveContainer width="100%" height={height}>
        <RComposedChart data={data} margin={CHART_MARGIN}>
          {showGrid && <RCartesianGrid {...ChartGridStyle} />}
          <RXAxis dataKey={xKey} {...ChartAxes} />
          <RYAxis {...ChartAxes} />
          {showTooltip && <RTooltip {...ChartTooltipStyle} />}
          {showLegend && <RLegend {...ChartLegendStyle} />}
          {series.map((s, i) =>
            s.type === "line" ? (
              <RLine
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.label ?? s.key}
                stroke={seriesColor(s, i)}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5 }}
              />
            ) : (
              <RBar
                key={s.key}
                dataKey={s.key}
                name={s.label ?? s.key}
                fill={seriesColor(s, i)}
                radius={[6, 6, 0, 0]}
                barSize={barSize}
              />
            )
          )}
        </RComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Step                                                                       */
/* -------------------------------------------------------------------------- */

export function StepChart({
  data,
  xKey,
  series,
  height = 280,
  className,
  showGrid = true,
  showLegend = false,
  showTooltip = true,
}: BaseChartProps) {
  return (
    <div data-slot="step-chart" className={cn("w-full", className)} style={{ width: "100%" }}>
      <ResponsiveContainer width="100%" height={height}>
        <RLineChart data={data} margin={CHART_MARGIN}>
          {showGrid && <RCartesianGrid {...ChartGridStyle} />}
          <RXAxis dataKey={xKey} {...ChartAxes} />
          <RYAxis {...ChartAxes} />
          {showTooltip && <RTooltip {...ChartTooltipStyle} />}
          {showLegend && <RLegend {...ChartLegendStyle} />}
          {series.map((s, i) => (
            <RLine
              key={s.key}
              type="stepAfter"
              dataKey={s.key}
              name={s.label ?? s.key}
              stroke={seriesColor(s, i)}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5 }}
            />
          ))}
        </RLineChart>
      </ResponsiveContainer>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Sparkline                                                                  */
/* -------------------------------------------------------------------------- */

interface SparkDotProps {
  cx?: number
  cy?: number
  index?: number
}

export interface SparklineProps {
  data: Record<string, any>[]
  dataKey: string
  height?: number
  /** Line + last-dot color; defaults to `--chart-1`. */
  color?: string
  className?: string
  /** Render a highlighted dot on the last data point. */
  showLastDot?: boolean
}

export function Sparkline({
  data,
  dataKey,
  height = 40,
  color = PALETTE[0],
  className,
  showLastDot = false,
}: SparklineProps) {
  const lastIndex = data.length - 1
  const renderDot = (dotProps: SparkDotProps) => {
    if (!showLastDot || dotProps.index !== lastIndex || dotProps.cx == null || dotProps.cy == null) {
      return <g />
    }
    return (
      <circle
        cx={dotProps.cx}
        cy={dotProps.cy}
        r={3}
        fill={color}
        stroke="var(--background)"
        strokeWidth={2}
      />
    )
  }
  return (
    <div data-slot="sparkline" className={cn("w-full", className)} style={{ width: "100%" }}>
      <ResponsiveContainer width="100%" height={height}>
        <RLineChart data={data} margin={{ top: 6, right: 8, bottom: 6, left: 8 }}>
          <RLine
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            dot={showLastDot ? renderDot : false}
            isAnimationActive={false}
          />
        </RLineChart>
      </ResponsiveContainer>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Range (band between a low and high value)                                  */
/* -------------------------------------------------------------------------- */

export interface RangeChartProps {
  /** Each datum must carry an array under `rangeKey`, e.g. { age: "18-25", range: [58, 82] }. */
  data: Record<string, any>[]
  xKey: string
  /** Data field holding [low, high] tuples. */
  rangeKey: string
  /** Band + stroke color; defaults to `--chart-1`. */
  color?: string
  height?: number
  className?: string
  showGrid?: boolean
  showTooltip?: boolean
}

export function RangeChart({
  data,
  xKey,
  rangeKey,
  color = PALETTE[0],
  height = 280,
  className,
  showGrid = true,
  showTooltip = true,
}: RangeChartProps) {
  return (
    <div data-slot="range-chart" className={cn("w-full", className)} style={{ width: "100%" }}>
      <ResponsiveContainer width="100%" height={height}>
        <RAreaChart data={data} margin={CHART_MARGIN}>
          {showGrid && <RCartesianGrid {...ChartGridStyle} />}
          <RXAxis dataKey={xKey} {...ChartAxes} />
          <RYAxis {...ChartAxes} />
          {showTooltip && <RTooltip {...ChartTooltipStyle} />}
          <RArea
            dataKey={rangeKey}
            stroke={color}
            fill={color}
            fillOpacity={0.18}
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5 }}
          />
        </RAreaChart>
      </ResponsiveContainer>
    </div>
  )
}
