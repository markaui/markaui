"use client"

import * as React from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Sankey as RechartsSankey,
  Scatter,
  ScatterChart as RechartsScatterChart,
  Tooltip,
  Treemap as RechartsTreemap,
  XAxis,
  YAxis,
} from "recharts"
import { cn } from "../../../lib/utils"
import { CHART_TOOLTIP_PROPS, chartColor, withAlpha } from "./circular"

const AXIS_TICK = { fill: "var(--muted-foreground)", fontSize: 11 } as const
const AXIS_TICK_SMALL = { fill: "var(--muted-foreground)", fontSize: 10 } as const

function formatChartNumber(value: number): string {
  return String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

function ChartEmpty({ height, className }: { height: number; className?: string }) {
  return (
    <div
      data-slot="chart-empty"
      className={cn(
        "flex w-full items-center justify-center rounded-lg border border-dashed border-border text-xs text-muted-foreground",
        className
      )}
      style={{ height }}
    >
      No data to display
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* ScatterChart                                                        */
/* ------------------------------------------------------------------ */

export interface ScatterDatum {
  x: number
  y: number
  name?: string
}

export interface ScatterChartProps extends React.ComponentProps<"div"> {
  data: ScatterDatum[]
  xLabel?: string
  yLabel?: string
  height?: number
  color?: string
  showTooltip?: boolean
}

export function ScatterChart({
  data,
  xLabel,
  yLabel,
  height = 280,
  color = "var(--chart-1)",
  showTooltip = true,
  className,
  style,
  ...rest
}: ScatterChartProps) {
  return (
    <div
      data-slot="scatter-chart"
      className={cn("w-full", className)}
      style={{ height, ...style }}
      {...rest}
    >
      <ResponsiveContainer width="100%" height="100%">
        <RechartsScatterChart margin={{ top: 12, right: 18, bottom: xLabel ? 22 : 8, left: 12 }}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey="x"
            tick={AXIS_TICK}
            tickLine={false}
            axisLine={{ stroke: "var(--border)" }}
            label={
              xLabel
                ? {
                    value: xLabel,
                    position: "insideBottom",
                    offset: -4,
                    fill: "var(--muted-foreground)",
                    fontSize: 11,
                  }
                : undefined
            }
          />
          <YAxis
            type="number"
            dataKey="y"
            width={44}
            tick={AXIS_TICK}
            tickLine={false}
            axisLine={{ stroke: "var(--border)" }}
            label={
              yLabel
                ? {
                    value: yLabel,
                    angle: -90,
                    position: "insideLeft",
                    fill: "var(--muted-foreground)",
                    fontSize: 11,
                  }
                : undefined
            }
          />
          {showTooltip && (
            <Tooltip
              {...CHART_TOOLTIP_PROPS}
              cursor={{ strokeDasharray: "3 3", stroke: "var(--border)" }}
            />
          )}
          <Scatter data={data} fill={color} fillOpacity={0.85} />
        </RechartsScatterChart>
      </ResponsiveContainer>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* BubbleChart                                                         */
/* ------------------------------------------------------------------ */

export interface BubbleDatum {
  x: number
  y: number
  z: number
  name?: string
}

export interface BubbleChartProps extends React.ComponentProps<"div"> {
  data: BubbleDatum[]
  xLabel?: string
  yLabel?: string
  height?: number
  color?: string
  showTooltip?: boolean
}

export function BubbleChart({
  data,
  xLabel,
  yLabel,
  height = 280,
  color = "var(--chart-2)",
  showTooltip = true,
  className,
  style,
  ...rest
}: BubbleChartProps) {
  const maxZ = Math.max(1, ...data.map((d) => d.z))
  const rows = data.map((d) => ({ ...d, r: 4 + (Math.max(0, d.z) / maxZ) * 14 }))

  const renderBubble = (props: unknown): React.ReactElement => {
    const point = props as {
      cx?: number
      cy?: number
      payload?: BubbleDatum & { r?: number }
    }
    if (point.cx == null || point.cy == null) return <g />
    return (
      <circle
        cx={point.cx}
        cy={point.cy}
        r={point.payload?.r ?? 6}
        fill={color}
        fillOpacity={0.35}
        stroke={color}
        strokeWidth={1.5}
        className="transition-all duration-200"
      />
    )
  }

  return (
    <div
      data-slot="bubble-chart"
      className={cn("w-full", className)}
      style={{ height, ...style }}
      {...rest}
    >
      <ResponsiveContainer width="100%" height="100%">
        <RechartsScatterChart margin={{ top: 12, right: 18, bottom: xLabel ? 22 : 8, left: 12 }}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey="x"
            tick={AXIS_TICK}
            tickLine={false}
            axisLine={{ stroke: "var(--border)" }}
            label={
              xLabel
                ? {
                    value: xLabel,
                    position: "insideBottom",
                    offset: -4,
                    fill: "var(--muted-foreground)",
                    fontSize: 11,
                  }
                : undefined
            }
          />
          <YAxis
            type="number"
            dataKey="y"
            width={44}
            tick={AXIS_TICK}
            tickLine={false}
            axisLine={{ stroke: "var(--border)" }}
            label={
              yLabel
                ? {
                    value: yLabel,
                    angle: -90,
                    position: "insideLeft",
                    fill: "var(--muted-foreground)",
                    fontSize: 11,
                  }
                : undefined
            }
          />
          {showTooltip && (
            <Tooltip
              {...CHART_TOOLTIP_PROPS}
              cursor={{ strokeDasharray: "3 3", stroke: "var(--border)" }}
            />
          )}
          <Scatter data={rows} shape={renderBubble} />
        </RechartsScatterChart>
      </ResponsiveContainer>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Heatmap                                                             */
/* ------------------------------------------------------------------ */

export interface HeatmapProps {
  rows: string[]
  cols: string[]
  /** values[rowIndex][colIndex] */
  values: number[][]
  color?: string
  /** Shared maximum used for intensity scaling; auto-computed when omitted. */
  max?: number
  cellSize?: number
  className?: string
}

export function Heatmap({
  rows,
  cols,
  values,
  color = "var(--chart-1)",
  max,
  cellSize = 38,
  className,
}: HeatmapProps) {
  const resolvedMax = React.useMemo(() => {
    if (typeof max === "number" && max > 0) return max
    let m = 1
    for (const row of values) {
      for (const v of row) m = Math.max(m, v)
    }
    return m
  }, [max, values])

  const intensity = (v: number) => Math.max(6, Math.round((v / resolvedMax) * 100))

  return (
    <div data-slot="heatmap" className={cn("w-full", className)}>
      <div
        className="grid w-fit gap-1"
        style={{ gridTemplateColumns: "auto repeat(" + cols.length + ", " + cellSize + "px)" }}
      >
        <div aria-hidden="true" />
        {cols.map((col) => (
          <div
            key={col}
            className="truncate pb-1 text-center text-[10px] font-medium text-muted-foreground"
            style={{ width: cellSize }}
          >
            {col}
          </div>
        ))}
        {rows.map((rowLabel, ri) => (
          <React.Fragment key={rowLabel}>
            <div className="flex items-center justify-end truncate pr-2 text-[10px] font-medium text-muted-foreground">
              {rowLabel}
            </div>
            {cols.map((colLabel, ci) => {
              const v = values[ri]?.[ci] ?? 0
              return (
                <div
                  key={rowLabel + "-" + colLabel}
                  title={rowLabel + " " + colLabel + ": " + v}
                  className="aspect-square cursor-default rounded-sm transition-all duration-200 hover:scale-110 hover:shadow-sm"
                  style={{ backgroundColor: withAlpha(color, intensity(v)) }}
                />
              )
            })}
          </React.Fragment>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <span className="text-[10px] text-muted-foreground">Low</span>
        <div
          className="h-1.5 flex-1 rounded-full"
          style={{
            backgroundImage:
              "linear-gradient(to right, " + withAlpha(color, 6) + ", " + withAlpha(color, 100) + ")",
          }}
        />
        <span className="text-[10px] text-muted-foreground">High</span>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Treemap                                                             */
/* ------------------------------------------------------------------ */

export interface TreemapDatum {
  name: string
  value: number
}

export interface TreemapProps extends React.ComponentProps<"div"> {
  data: TreemapDatum[]
  height?: number
  showTooltip?: boolean
}

function TreemapCell(props: {
  x?: number
  y?: number
  width?: number
  height?: number
  index?: number
  depth?: number
  name?: string
  value?: number | string
}): React.ReactElement {
  const { x = 0, y = 0, width = 0, height = 0, index = 0, depth = 1, name, value } = props
  if (depth < 1 || width <= 0 || height <= 0) return <g />
  const fill = "color-mix(in srgb, " + chartColor(index) + " 45%, var(--card))"
  const showText = width > 64 && height > 40
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={8}
        ry={8}
        fill={fill}
        stroke="var(--card)"
        strokeWidth={2}
      />
      {showText && (
        <>
          <text x={x + 10} y={y + height / 2 - 2} fontSize={12} fontWeight={600} fill="var(--foreground)">
            {name}
          </text>
          <text x={x + 10} y={y + height / 2 + 14} fontSize={11} fill="var(--muted-foreground)">
            {value}
          </text>
        </>
      )}
    </g>
  )
}

export function Treemap({
  data,
  height = 280,
  showTooltip = true,
  className,
  style,
  ...rest
}: TreemapProps) {
  return (
    <div
      data-slot="treemap"
      className={cn("w-full", className)}
      style={{ height, ...style }}
      {...rest}
    >
      <ResponsiveContainer width="100%" height="100%">
        <RechartsTreemap data={data} dataKey="value" nameKey="name" content={<TreemapCell />}>
          {showTooltip && <Tooltip {...CHART_TOOLTIP_PROPS} cursor={false} />}
        </RechartsTreemap>
      </ResponsiveContainer>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* SankeyChart                                                         */
/* ------------------------------------------------------------------ */

export interface SankeyNodeDatum {
  name: string
}

export interface SankeyLinkDatum {
  /** Index into the nodes array. */
  source: number
  /** Index into the nodes array. */
  target: number
  value: number
}

export interface SankeyChartProps extends React.ComponentProps<"div"> {
  nodes: SankeyNodeDatum[]
  links: SankeyLinkDatum[]
  height?: number
  showTooltip?: boolean
}

function SankeyNode({
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  payload,
}: {
  x?: number
  y?: number
  width?: number
  height?: number
  payload?: SankeyNodeDatum
}): React.ReactElement {
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} rx={3} fill="var(--chart-1)" />
      {payload?.name && (
        <text
          x={x + width + 6}
          y={y + height / 2 + 3.5}
          fontSize={10}
          fill="var(--muted-foreground)"
        >
          {payload.name}
        </text>
      )}
    </g>
  )
}

export function SankeyChart({
  nodes,
  links,
  height = 280,
  showTooltip = true,
  className,
  style,
  ...rest
}: SankeyChartProps) {
  return (
    <div
      data-slot="sankey-chart"
      className={cn("w-full", className)}
      style={{ height, ...style }}
      {...rest}
    >
      <ResponsiveContainer width="100%" height="100%">
        <RechartsSankey
          data={{ nodes, links }}
          nodeWidth={12}
          nodePadding={18}
          margin={{ top: 8, right: 96, bottom: 8, left: 12 }}
          node={((props: unknown): React.ReactElement<SVGElement> => {
            const p = props as {
              x?: number
              y?: number
              width?: number
              height?: number
              payload?: SankeyNodeDatum
            }
            return <SankeyNode x={p.x} y={p.y} width={p.width} height={p.height} payload={p.payload} /> as React.ReactElement<SVGElement>
          })}
          link={{
            stroke: "var(--chart-2)",
            strokeOpacity: 0.3,
            fill: "var(--chart-2)",
            fillOpacity: 0.3,
          }}
        >
          {showTooltip && <Tooltip {...CHART_TOOLTIP_PROPS} cursor={false} />}
        </RechartsSankey>
      </ResponsiveContainer>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* WaterfallChart                                                      */
/* ------------------------------------------------------------------ */

export interface WaterfallDatum {
  name: string
  value: number
  /** Render as a running-total bar (from zero) in var(--chart-1). */
  total?: boolean
}

export interface WaterfallChartProps extends React.ComponentProps<"div"> {
  data: WaterfallDatum[]
  height?: number
  showValues?: boolean
}

function waterfallNiceStep(raw: number): number {
  if (!(raw > 0)) return 1
  const magnitude = Math.pow(10, Math.floor(Math.log10(raw)))
  const normalized = raw / magnitude
  const factor = normalized >= 5 ? 10 : normalized >= 2 ? 5 : normalized >= 1 ? 2 : 1
  return factor * magnitude
}

export function WaterfallChart({
  data,
  height = 280,
  showValues = true,
  className,
  style,
  ...rest
}: WaterfallChartProps) {
  if (!data.length) {
    return <ChartEmpty height={height} className={className} />
  }

  const W = 640
  const padL = 54
  const padR = 16
  const padT = 18
  const padB = 30
  const plotW = W - padL - padR
  const plotH = height - padT - padB

  const steps = data
    .reduce<{ acc: number; rows: Array<WaterfallDatum & { start: number; end: number }> }>(
      (state, d) => {
        if (d.total) {
          return { acc: d.value, rows: [...state.rows, { ...d, start: 0, end: d.value }] }
        }
        const start = state.acc
        const end = state.acc + d.value
        return { acc: end, rows: [...state.rows, { ...d, start, end }] }
      },
      { acc: 0, rows: [] }
    )
    .rows.map((r) => r)

  const allValues = steps.flatMap((s) => [s.start, s.end])
  const vMax = Math.max(0, ...allValues)
  const vMin = Math.min(0, ...allValues)
  const rawRange = vMax - vMin || 1
  const yMax = vMax + rawRange * 0.14
  const yMin = vMin - rawRange * 0.05
  const scaleY = (v: number) => padT + ((yMax - v) / (yMax - yMin)) * plotH

  const gridStep = waterfallNiceStep((yMax - yMin) / 4)
  const firstTick = Math.ceil(yMin / gridStep)
  const lastTick = Math.floor(yMax / gridStep)
  const gridTicks: number[] = []
  for (let k = firstTick; k <= lastTick; k++) gridTicks.push(k * gridStep)

  const band = plotW / steps.length
  const barW = Math.min(56, band * 0.55)

  return (
    <div
      data-slot="waterfall-chart"
      className={cn("w-full", className)}
      style={style}
      {...rest}
    >
      <svg
        viewBox={"0 0 " + W + " " + height}
        width="100%"
        height={height}
        role="img"
        aria-label="Waterfall chart"
      >
        {gridTicks.map((t) => (
          <g key={"grid-" + t}>
            <line x1={padL} x2={W - padR} y1={scaleY(t)} y2={scaleY(t)} stroke="var(--border)" strokeWidth={1} />
            <text x={padL - 8} y={scaleY(t) + 3.5} textAnchor="end" fontSize={10} fill="var(--muted-foreground)">
              {formatChartNumber(t)}
            </text>
          </g>
        ))}
        {vMin < 0 && (
          <line
            x1={padL}
            x2={W - padR}
            y1={scaleY(0)}
            y2={scaleY(0)}
            stroke="var(--muted-foreground)"
            strokeOpacity={0.4}
            strokeWidth={1}
          />
        )}
        {steps.map((s, i) => {
          const x = padL + i * band + (band - barW) / 2
          const top = scaleY(Math.max(s.start, s.end))
          const bottom = scaleY(Math.min(s.start, s.end))
          const barHeight = Math.max(1, bottom - top)
          const fill = s.total ? "var(--chart-1)" : s.value >= 0 ? "var(--success)" : "var(--destructive)"
          const isNegative = !s.total && s.value < 0
          const valueLabel = (s.value > 0 && !s.total ? "+" : "") + formatChartNumber(s.value)
          return (
            <g key={s.name + "-" + i}>
              <rect x={x} y={top} width={barW} height={barHeight} rx={3} fill={fill} fillOpacity={0.9} />
              {showValues && (
                <text
                  x={x + barW / 2}
                  y={isNegative ? bottom + 14 : top - 6}
                  textAnchor="middle"
                  fontSize={10}
                  fontWeight={500}
                  fill={fill}
                >
                  {valueLabel}
                </text>
              )}
              {i < steps.length - 1 && (
                <line
                  x1={x + barW}
                  x2={padL + (i + 1) * band}
                  y1={scaleY(s.end)}
                  y2={scaleY(s.end)}
                  stroke="var(--muted-foreground)"
                  strokeOpacity={0.45}
                  strokeWidth={1}
                  strokeDasharray="3 3"
                />
              )}
              <text
                x={padL + i * band + band / 2}
                y={height - 8}
                textAnchor="middle"
                fontSize={10}
                fill="var(--muted-foreground)"
              >
                {s.name}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* CandlestickChart                                                    */
/* ------------------------------------------------------------------ */

export interface CandlestickDatum {
  label: string
  open: number
  high: number
  low: number
  close: number
}

export interface CandlestickChartProps extends React.ComponentProps<"div"> {
  data: CandlestickDatum[]
  height?: number
}

export function CandlestickChart({
  data,
  height = 280,
  className,
  style,
  ...rest
}: CandlestickChartProps) {
  if (!data.length) {
    return <ChartEmpty height={height} className={className} />
  }

  const W = 640
  const padL = 54
  const padR = 14
  const padT = 14
  const padB = 28
  const plotW = W - padL - padR
  const plotH = height - padT - padB

  const vMin = Math.min(...data.map((d) => d.low))
  const vMax = Math.max(...data.map((d) => d.high))
  const rawRange = vMax - vMin || 1
  const yMin = vMin - rawRange * 0.07
  const yMax = vMax + rawRange * 0.07
  const scaleY = (v: number) => padT + ((yMax - v) / (yMax - yMin)) * plotH

  const band = plotW / data.length
  const bodyW = Math.min(16, band * 0.55)
  const labelEvery = Math.max(1, Math.ceil(data.length / 8))
  const gridValues = Array.from({ length: 5 }, (_, k) => yMin + ((yMax - yMin) * k) / 4)

  return (
    <div
      data-slot="candlestick-chart"
      className={cn("w-full", className)}
      style={style}
      {...rest}
    >
      <svg
        viewBox={"0 0 " + W + " " + height}
        width="100%"
        height={height}
        role="img"
        aria-label="Candlestick chart"
      >
        {gridValues.map((v, k) => (
          <g key={"grid-" + k}>
            <line x1={padL} x2={W - padR} y1={scaleY(v)} y2={scaleY(v)} stroke="var(--border)" strokeWidth={1} />
            <text x={padL - 8} y={scaleY(v) + 3.5} textAnchor="end" fontSize={10} fill="var(--muted-foreground)">
              {formatChartNumber(v)}
            </text>
          </g>
        ))}
        {data.map((d, i) => {
          const up = d.close >= d.open
          const strokeColor = up ? "var(--success)" : "var(--destructive)"
          const cx = padL + i * band + band / 2
          const bodyTop = scaleY(Math.max(d.open, d.close))
          const bodyBottom = scaleY(Math.min(d.open, d.close))
          const bodyH = Math.max(1.5, bodyBottom - bodyTop)
          return (
            <g key={d.label + "-" + i}>
              <line
                x1={cx}
                x2={cx}
                y1={scaleY(d.high)}
                y2={scaleY(d.low)}
                stroke={strokeColor}
                strokeWidth={1.5}
                strokeLinecap="round"
              />
              <rect
                x={cx - bodyW / 2}
                y={bodyTop}
                width={bodyW}
                height={bodyH}
                rx={2}
                fill={strokeColor}
                stroke={strokeColor}
                strokeWidth={1}
              />
              {i % labelEvery === 0 && (
                <text x={cx} y={height - 8} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
                  {d.label}
                </text>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Histogram                                                           */
/* ------------------------------------------------------------------ */

export interface HistogramProps extends React.ComponentProps<"div"> {
  /** Raw values that get binned into `bins` buckets. */
  values: number[]
  bins?: number
  xLabel?: string
  height?: number
  showTooltip?: boolean
}

export function Histogram({
  values,
  bins = 8,
  xLabel,
  height = 280,
  showTooltip = true,
  className,
  style,
  ...rest
}: HistogramProps) {
  if (!values.length) {
    return <ChartEmpty height={height} className={className} />
  }

  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || 1
  const binWidth = span / bins || 1
  const counts = Array.from({ length: bins }, () => 0)
  for (const v of values) {
    const idx = Math.min(bins - 1, Math.max(0, Math.floor((v - min) / binWidth)))
    counts[idx] += 1
  }
  const fmt = (n: number) => (Number.isInteger(n) ? String(n) : String(Math.round(n * 10) / 10))
  const binsData = counts.map((count, i) => ({
    name: "[" + fmt(min + i * binWidth) + "–" + fmt(min + (i + 1) * binWidth) + ")",
    count,
  }))

  return (
    <div data-slot="histogram" className={cn("w-full", className)} style={style} {...rest}>
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={binsData} margin={{ top: 8, right: 8, bottom: 4, left: 0 }} barCategoryGap={0}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="name"
              interval={0}
              angle={-32}
              textAnchor="end"
              height={48}
              tick={AXIS_TICK_SMALL}
              tickLine={false}
              axisLine={{ stroke: "var(--border)" }}
            />
            <YAxis
              allowDecimals={false}
              width={32}
              tick={AXIS_TICK_SMALL}
              tickLine={false}
              axisLine={false}
            />
            {showTooltip && (
              <Tooltip {...CHART_TOOLTIP_PROPS} cursor={{ fill: "var(--muted)", fillOpacity: 0.4 }} />
            )}
            <Bar dataKey="count" fill="var(--chart-1)" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {xLabel && <p className="mt-1 text-center text-[10px] text-muted-foreground">{xLabel}</p>}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* BoxPlot                                                             */
/* ------------------------------------------------------------------ */

export interface BoxPlotDatum {
  label: string
  min: number
  q1: number
  median: number
  q3: number
  max: number
}

export interface BoxPlotProps extends React.ComponentProps<"div"> {
  data: BoxPlotDatum[]
}

export function BoxPlot({ data, className, style, ...rest }: BoxPlotProps) {
  if (!data.length) {
    return <ChartEmpty height={140} className={className} />
  }

  const W = 640
  const rowH = 38
  const padL = 104
  const padR = 18
  const padT = 14
  const padB = 30
  const height = padT + padB + data.length * rowH
  const plotW = W - padL - padR

  const vMin = Math.min(...data.map((d) => d.min))
  const vMax = Math.max(...data.map((d) => d.max))
  const rawRange = vMax - vMin || 1
  const lo = vMin - rawRange * 0.05
  const hi = vMax + rawRange * 0.05
  const scaleX = (v: number) => padL + ((v - lo) / (hi - lo)) * plotW

  const tickCount = 4
  const ticks = Array.from({ length: tickCount + 1 }, (_, k) => lo + ((hi - lo) * k) / tickCount)

  return (
    <div data-slot="box-plot" className={cn("w-full", className)} style={style} {...rest}>
      <svg
        viewBox={"0 0 " + W + " " + height}
        width="100%"
        height={height}
        role="img"
        aria-label="Box plot"
      >
        {ticks.map((t, k) => (
          <g key={"tick-" + k}>
            <line
              x1={scaleX(t)}
              x2={scaleX(t)}
              y1={padT}
              y2={height - padB + 6}
              stroke="var(--border)"
              strokeWidth={1}
            />
            <text x={scaleX(t)} y={height - 8} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
              {formatChartNumber(t)}
            </text>
          </g>
        ))}
        {data.map((d, i) => {
          const cy = padT + i * rowH + rowH / 2
          return (
            <g key={d.label + "-" + i}>
              <text x={padL - 10} y={cy + 4} textAnchor="end" fontSize={11} fill="var(--muted-foreground)">
                {d.label}
              </text>
              <line
                x1={scaleX(d.min)}
                x2={scaleX(d.max)}
                y1={cy}
                y2={cy}
                stroke="var(--chart-1)"
                strokeWidth={1.5}
                strokeOpacity={0.7}
              />
              <line
                x1={scaleX(d.min)}
                x2={scaleX(d.min)}
                y1={cy - 5}
                y2={cy + 5}
                stroke="var(--chart-1)"
                strokeWidth={1.5}
                strokeOpacity={0.7}
              />
              <line
                x1={scaleX(d.max)}
                x2={scaleX(d.max)}
                y1={cy - 5}
                y2={cy + 5}
                stroke="var(--chart-1)"
                strokeWidth={1.5}
                strokeOpacity={0.7}
              />
              <rect
                x={scaleX(d.q1)}
                y={cy - 10}
                width={Math.max(2, scaleX(d.q3) - scaleX(d.q1))}
                height={20}
                rx={4}
                fill="var(--chart-1)"
                fillOpacity={0.25}
                stroke="var(--chart-1)"
                strokeWidth={1.5}
              />
              <line
                x1={scaleX(d.median)}
                x2={scaleX(d.median)}
                y1={cy - 10}
                y2={cy + 10}
                stroke="var(--gold)"
                strokeWidth={2.5}
                strokeLinecap="round"
              />
            </g>
          )
        })}
      </svg>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* GanttChart                                                          */
/* ------------------------------------------------------------------ */

export interface GanttTask {
  name: string
  start: number
  end: number
  /** 0-100 percentage overlay in var(--gold). */
  progress?: number
  color?: string
}

export interface GanttChartProps extends React.ComponentProps<"div"> {
  tasks: GanttTask[]
  /** Upper bound of the timeline; auto-computed from tasks when omitted. */
  maxEnd?: number
  /** Day number for the dashed "today" marker; drawn only when inside the range. */
  today?: number
}

export function GanttChart({
  tasks,
  maxEnd,
  today,
  className,
  style,
  ...rest
}: GanttChartProps) {
  if (!tasks.length) {
    return <ChartEmpty height={160} className={className} />
  }

  const W = 640
  const rowH = 34
  const padL = 118
  const padR = 16
  const padT = 14
  const padB = 28
  const height = padT + padB + tasks.length * rowH
  const plotW = W - padL - padR
  const tMax = Math.max(maxEnd ?? 0, ...tasks.map((t) => t.end), 1)
  const scaleX = (t: number) => padL + (t / tMax) * plotW

  const tickCount = 4
  const ticks = Array.from({ length: tickCount + 1 }, (_, k) => (tMax * k) / tickCount)
  const barH = 16

  return (
    <div data-slot="gantt-chart" className={cn("w-full", className)} style={style} {...rest}>
      <svg
        viewBox={"0 0 " + W + " " + height}
        width="100%"
        height={height}
        role="img"
        aria-label="Gantt chart"
      >
        {ticks.map((t, k) => (
          <g key={"tick-" + k}>
            <line
              x1={scaleX(t)}
              x2={scaleX(t)}
              y1={padT - 4}
              y2={height - padB + 4}
              stroke="var(--border)"
              strokeWidth={1}
            />
            <text x={scaleX(t)} y={height - 8} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
              {"Day " + Math.round(t)}
            </text>
          </g>
        ))}
        {tasks.map((task, i) => {
          const cy = padT + i * rowH + rowH / 2
          const barY = cy - barH / 2
          const x1 = scaleX(Math.max(0, task.start))
          const x2 = scaleX(task.end)
          const barWidth = Math.max(4, x2 - x1)
          const color = task.color ?? "var(--chart-1)"
          const progress =
            task.progress == null ? null : Math.min(100, Math.max(0, task.progress))
          return (
            <g key={task.name + "-" + i}>
              <text x={padL - 10} y={cy + 4} textAnchor="end" fontSize={11} fill="var(--muted-foreground)">
                {task.name}
              </text>
              <rect
                x={x1}
                y={barY}
                width={barWidth}
                height={barH}
                rx={barH / 2}
                fill={color}
                fillOpacity={0.25}
                stroke={color}
                strokeOpacity={0.55}
                strokeWidth={1}
              />
              {progress != null && progress > 0 && (
                <rect
                  x={x1}
                  y={barY}
                  width={(barWidth * progress) / 100}
                  height={barH}
                  rx={barH / 2}
                  fill="var(--gold)"
                />
              )}
            </g>
          )
        })}
        {typeof today === "number" && today >= 0 && today <= tMax && (
          <g>
            <line
              x1={scaleX(today)}
              x2={scaleX(today)}
              y1={padT - 4}
              y2={height - padB + 4}
              stroke="var(--destructive)"
              strokeWidth={1.5}
              strokeDasharray="4 3"
            />
            <text x={scaleX(today) + 5} y={padT + 4} fontSize={9} fill="var(--destructive)">
              Today
            </text>
          </g>
        )}
      </svg>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* NetworkChart                                                        */
/* ------------------------------------------------------------------ */

export interface NetworkNode {
  id: number | string
  label?: string
  /** Node radius in px, 4-30. */
  size?: number
}

export interface NetworkChartProps extends React.ComponentProps<"div"> {
  nodes: NetworkNode[]
  /** Edges as node index pairs. */
  edges: Array<[number, number]>
  height?: number
}

export function NetworkChart({
  nodes,
  edges,
  height = 320,
  className,
  style,
  ...rest
}: NetworkChartProps) {
  if (!nodes.length) {
    return <ChartEmpty height={160} className={className} />
  }

  const W = 640
  const maxSize = Math.max(10, ...nodes.map((n) => n.size ?? 10))
  const radius = Math.max(40, Math.min(W, height) / 2 - (maxSize + 26))
  const centerX = W / 2
  const centerY = height / 2
  const positions = nodes.map((_, i) => {
    const angle = -Math.PI / 2 + (2 * Math.PI * i) / nodes.length
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    }
  })
  const nodeRadius = (n: NetworkNode) => Math.min(30, Math.max(4, n.size ?? 10))

  return (
    <div data-slot="network-chart" className={cn("w-full", className)} style={style} {...rest}>
      <svg
        viewBox={"0 0 " + W + " " + height}
        width="100%"
        height={height}
        role="img"
        aria-label="Network graph"
      >
        {edges.map((edge, i) => {
          const a = positions[edge[0]]
          const b = positions[edge[1]]
          if (!a || !b) return null
          return (
            <line
              key={"edge-" + i}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="var(--border)"
              strokeWidth={1.5}
            />
          )
        })}
        {nodes.map((n, i) => {
          const p = positions[i]
          const r = nodeRadius(n)
          return (
            <g key={String(n.id)}>
              <circle
                cx={p.x}
                cy={p.y}
                r={r}
                fill="var(--chart-1)"
                fillOpacity={0.9}
                stroke="var(--card)"
                strokeWidth={2}
              />
              {n.label && (
                <text
                  x={p.x}
                  y={p.y + r + 13}
                  textAnchor="middle"
                  fontSize={10}
                  fill="var(--muted-foreground)"
                >
                  {n.label}
                </text>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}
