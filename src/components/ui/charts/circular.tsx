"use client"

import * as React from "react"
import {
  Cell,
  Funnel,
  FunnelChart as RechartsFunnelChart,
  LabelList,
  Legend,
  Pie,
  PieChart as RechartsPieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart as RechartsRadarChart,
  RadialBar,
  RadialBarChart as RechartsRadialBarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import { cn } from "@/lib/utils"

/* ------------------------------------------------------------------ */
/* Shared style constants                                              */
/* ------------------------------------------------------------------ */

/** Theme token palette cycled through by categorical charts. */
export const CHART_PALETTE = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
] as const

/** Deterministic palette lookup that cycles for indices beyond the palette. */
export function chartColor(index: number): string {
  return CHART_PALETTE[((index % CHART_PALETTE.length) + CHART_PALETTE.length) % CHART_PALETTE.length]
}

/** Mix a token color down to a percentage of its opacity (browser color-mix). */
export function withAlpha(color: string, opacityPercent: number): string {
  const pct = Math.round(Math.min(100, Math.max(0, opacityPercent)))
  return "color-mix(in srgb, " + color + " " + pct + "%, transparent)"
}

export const CHART_TOOLTIP_STYLE: React.CSSProperties = {
  backgroundColor: "var(--popover)",
  color: "var(--popover-foreground)",
  border: "1px solid var(--border)",
  borderRadius: "10px",
  boxShadow: "0 10px 30px color-mix(in srgb, var(--foreground) 10%, transparent)",
  padding: "10px 12px",
  fontSize: "12px",
}

export const CHART_TOOLTIP_ITEM_STYLE: React.CSSProperties = {
  color: "var(--popover-foreground)",
}

export const CHART_TOOLTIP_LABEL_STYLE: React.CSSProperties = {
  color: "var(--muted-foreground)",
  fontWeight: 600,
  marginBottom: 4,
}

export const CHART_TOOLTIP_PROPS = {
  contentStyle: CHART_TOOLTIP_STYLE,
  itemStyle: CHART_TOOLTIP_ITEM_STYLE,
  labelStyle: CHART_TOOLTIP_LABEL_STYLE,
}

export const CHART_LEGEND_STYLE: React.CSSProperties = {
  fontSize: 12,
  paddingTop: 8,
}

export function chartLegendFormatter(value: unknown): React.ReactNode {
  return <span className="text-xs text-muted-foreground">{String(value)}</span>
}

export const CHART_LEGEND_PROPS = {
  iconType: "circle" as const,
  iconSize: 8,
  wrapperStyle: CHART_LEGEND_STYLE,
  formatter: chartLegendFormatter,
}

/* ------------------------------------------------------------------ */
/* PieChart                                                            */
/* ------------------------------------------------------------------ */

export interface PieDatum {
  name: string
  value: number
  color?: string
}

export interface PieChartProps extends React.ComponentProps<"div"> {
  data: PieDatum[]
  height?: number
  showLegend?: boolean
  showTooltip?: boolean
  innerRadius?: number | string
}

export function PieChart({
  data,
  height = 280,
  showLegend = false,
  showTooltip = true,
  innerRadius = 0,
  className,
  style,
  ...rest
}: PieChartProps) {
  return (
    <div
      data-slot="pie-chart"
      className={cn("w-full", className)}
      style={{ height, ...style }}
      {...rest}
    >
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius="80%"
            stroke="var(--card)"
            strokeWidth={2}
          >
            {data.map((entry, i) => (
              <Cell key={entry.name ?? i} fill={entry.color ?? chartColor(i)} />
            ))}
          </Pie>
          {showTooltip && <Tooltip {...CHART_TOOLTIP_PROPS} cursor={false} />}
          {showLegend && <Legend {...CHART_LEGEND_PROPS} />}
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* DonutChart                                                          */
/* ------------------------------------------------------------------ */

export interface DonutChartProps extends Omit<PieChartProps, "innerRadius"> {
  innerRadius?: number | string
  centerValue?: React.ReactNode
  centerLabel?: React.ReactNode
}

export function DonutChart({
  data,
  height = 280,
  showLegend = false,
  showTooltip = true,
  innerRadius = "60%",
  centerValue,
  centerLabel,
  className,
  style,
  ...rest
}: DonutChartProps) {
  return (
    <div
      data-slot="donut-chart"
      className={cn("relative w-full", className)}
      style={{ height, ...style }}
      {...rest}
    >
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius="85%"
            paddingAngle={3}
            cornerRadius={6}
            stroke="var(--card)"
            strokeWidth={2}
          >
            {data.map((entry, i) => (
              <Cell key={entry.name ?? i} fill={entry.color ?? chartColor(i)} />
            ))}
          </Pie>
          {showTooltip && <Tooltip {...CHART_TOOLTIP_PROPS} cursor={false} />}
          {showLegend && <Legend {...CHART_LEGEND_PROPS} />}
        </RechartsPieChart>
      </ResponsiveContainer>
      {(centerValue || centerLabel) && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          {centerValue && (
            <span className="font-serif text-2xl font-semibold text-foreground">{centerValue}</span>
          )}
          {centerLabel && (
            <span className="mt-0.5 text-xs text-muted-foreground">{centerLabel}</span>
          )}
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* RadarChart                                                          */
/* ------------------------------------------------------------------ */

export interface RadarDatum {
  dimension: string
  value: number
}

export interface RadarChartProps extends React.ComponentProps<"div"> {
  data: RadarDatum[]
  dataKey?: string
  nameKey?: string
  color?: string
  height?: number
  showTooltip?: boolean
}

export function RadarChart({
  data,
  dataKey = "value",
  nameKey = "dimension",
  color = "var(--chart-1)",
  height = 300,
  showTooltip = true,
  className,
  style,
  ...rest
}: RadarChartProps) {
  return (
    <div
      data-slot="radar-chart"
      className={cn("w-full", className)}
      style={{ height, ...style }}
      {...rest}
    >
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart data={data} cx="50%" cy="50%" outerRadius="72%">
          <PolarGrid stroke="var(--border)" />
          <PolarAngleAxis
            dataKey={nameKey}
            tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
          />
          <Radar dataKey={dataKey} stroke={color} fill={color} fillOpacity={0.25} strokeWidth={2} />
          {showTooltip && <Tooltip {...CHART_TOOLTIP_PROPS} cursor={false} />}
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* RadialChart                                                         */
/* ------------------------------------------------------------------ */

export interface RadialDatum {
  name: string
  value: number
  fill?: string
}

export interface RadialChartProps extends React.ComponentProps<"div"> {
  data: RadialDatum[]
  innerRadius?: number | string
  outerRadius?: number | string
  startAngle?: number
  endAngle?: number
  showLegend?: boolean
  showTooltip?: boolean
  height?: number
}

export function RadialChart({
  data,
  innerRadius = "30%",
  outerRadius = "100%",
  startAngle = 90,
  endAngle = -270,
  showLegend = false,
  showTooltip = true,
  height = 280,
  className,
  style,
  ...rest
}: RadialChartProps) {
  const rows = React.useMemo(
    () => data.map((d, i) => ({ ...d, fill: d.fill ?? chartColor(i) })),
    [data]
  )
  return (
    <div
      data-slot="radial-chart"
      className={cn("w-full", className)}
      style={{ height, ...style }}
      {...rest}
    >
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadialBarChart
          data={rows}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
        >
          <RadialBar
            dataKey="value"
            background={{ fill: "var(--muted)" }}
            cornerRadius={4}
            legendType="circle"
          />
          {showTooltip && <Tooltip {...CHART_TOOLTIP_PROPS} cursor={false} />}
          {showLegend && <Legend {...CHART_LEGEND_PROPS} />}
        </RechartsRadialBarChart>
      </ResponsiveContainer>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* GaugeChart                                                          */
/* ------------------------------------------------------------------ */

export interface GaugeChartProps extends React.ComponentProps<"div"> {
  /** Gauge fill percentage, clamped to 0-100. */
  value: number
  size?: number
  label?: React.ReactNode
  color?: string
}

export function GaugeChart({
  value,
  size = 180,
  label,
  color = "var(--gold)",
  className,
  style,
  ...rest
}: GaugeChartProps) {
  const clamped = Math.min(100, Math.max(0, value))
  const strokeWidth = Math.max(10, Math.round(size * 0.1))
  const cx = size / 2
  const cy = size / 2
  const r = size / 2 - strokeWidth / 2 - 2
  const arcLength = Math.PI * r
  const viewBoxHeight = cy + strokeWidth / 2 + 2
  const arcPath = "M " + (cx - r) + " " + cy + " A " + r + " " + r + " 0 0 1 " + (cx + r) + " " + cy
  const needleLength = r - strokeWidth - 2

  return (
    <div
      data-slot="gauge-chart"
      className={cn("flex w-fit flex-col items-center", className)}
      style={style}
      {...rest}
    >
      <svg
        width={size}
        height={viewBoxHeight}
        viewBox={"0 0 " + size + " " + viewBoxHeight}
        role="img"
        aria-label={"Gauge showing " + Math.round(clamped) + " of 100"}
      >
        <path d={arcPath} fill="none" stroke="var(--muted)" strokeWidth={strokeWidth} strokeLinecap="round" />
        <path
          d={arcPath}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={arcLength + " " + arcLength}
          strokeDashoffset={arcLength * (1 - clamped / 100)}
          style={{ transition: "stroke-dashoffset 0.6s cubic-bezier(0.22, 1, 0.36, 1)" }}
        />
        <g
          style={{
            transform: "rotate(" + clamped * 1.8 + "deg)",
            transformOrigin: cx + "px " + cy + "px",
            transition: "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <line
            x1={cx}
            y1={cy}
            x2={cx - needleLength}
            y2={cy}
            stroke="var(--foreground)"
            strokeWidth={2.5}
            strokeLinecap="round"
          />
        </g>
        <circle cx={cx} cy={cy} r={5} fill="var(--foreground)" />
      </svg>
      <div className="font-serif text-2xl font-semibold text-foreground">
        {Math.round(clamped)}
        <span className="text-sm font-normal text-muted-foreground"> / 100</span>
      </div>
      {label && <div className="text-xs text-muted-foreground">{label}</div>}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* FunnelChart                                                         */
/* ------------------------------------------------------------------ */

export interface FunnelDatum {
  name: string
  value: number
}

export interface FunnelChartProps extends React.ComponentProps<"div"> {
  data: FunnelDatum[]
  height?: number
  showTooltip?: boolean
}

function funnelFill(index: number, total: number): string {
  if (total <= 1) return withAlpha("var(--chart-1)", 100)
  const pct = Math.max(30, 100 - Math.round((index * 70) / (total - 1)))
  return withAlpha("var(--chart-1)", pct)
}

export function FunnelChart({
  data,
  height = 280,
  showTooltip = true,
  className,
  style,
  ...rest
}: FunnelChartProps) {
  return (
    <div
      data-slot="funnel-chart"
      className={cn("w-full", className)}
      style={{ height, ...style }}
      {...rest}
    >
      <ResponsiveContainer width="100%" height="100%">
        <RechartsFunnelChart margin={{ top: 8, right: 88, bottom: 4, left: 12 }}>
          <Funnel dataKey="value" nameKey="name" data={data}>
            <LabelList
              position="right"
              dataKey="name"
              fill="var(--popover-foreground)"
              stroke="none"
              fontSize={11}
            />
            {data.map((entry, i) => (
              <Cell key={entry.name ?? i} fill={funnelFill(i, data.length)} />
            ))}
          </Funnel>
          {showTooltip && <Tooltip {...CHART_TOOLTIP_PROPS} cursor={false} />}
        </RechartsFunnelChart>
      </ResponsiveContainer>
    </div>
  )
}
