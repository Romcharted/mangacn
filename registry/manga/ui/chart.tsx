"use client"

import * as React from "react"
import { cn } from "cn"

import {
  ChartContainer as ShadcnChartContainer,
  ChartLegend,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent as ShadcnChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

/*
 * Grammar: the chart sits in a case (G1). Series are told apart by screentone and hatching, never by colour:
 * every series gets a pattern (chartFill), bars and areas are outlined in 2px ink, lines differ by dash and by
 * marker (ChartMarker, G8 shapes). The tooltip is a speech bubble (G6) with a small tail; the legend shows the
 * patterns as swatches. Everything is ink on paper, and dark mode is the negative (patterns use the theme vars).
 */

const SERIES = ["solid", "hatch", "dots", "lines", "cross", "dots-fine"] as const

export type ChartPattern = (typeof SERIES)[number] | "paper"

const patternId = (p: ChartPattern) => `mg-chart-${p}`

/**
 * The pattern a series gets: by index, or by its key in `keys` (pass Object.keys(config) so the same key always
 * gets the same pattern). The first series is solid ink, then hatching, dots, lines, cross hatching, fine dots.
 */
export function chartPattern(series: number | string, keys: readonly string[] = []): ChartPattern {
  const i = typeof series === "number" ? series : keys.indexOf(series)
  return SERIES[Math.max(0, i) % SERIES.length]
}

/** The `url(#…)` paint of a pattern, for an SVG fill (bars, areas, pie slices, swatches). */
export function chartPatternFill(pattern: ChartPattern): string {
  return `url(#${patternId(pattern)})`
}

/** The `url(#…)` fill of a series: `fill={chartFill("reads", keys)}`. */
export function chartFill(series: number | string, keys?: readonly string[]): string {
  return chartPatternFill(chartPattern(series, keys))
}

/**
 * The shared <pattern> set: solid ink, paper, 45° hatching, cross hatching, dots at two densities and horizontal
 * lines. Painted with the theme variables, so dark mode is the negative. Rendered once by ChartContainer.
 */
function ChartPatterns() {
  const ink = { fill: "var(--foreground)" }
  const paper = { fill: "var(--background)" }
  const inkLine = { fill: "none", stroke: "var(--foreground)" }
  return (
    <svg aria-hidden focusable="false" className="pointer-events-none absolute size-0 overflow-hidden">
      <defs>
        <pattern id={patternId("solid")} width="8" height="8" patternUnits="userSpaceOnUse">
          <rect width="8" height="8" style={ink} />
        </pattern>
        <pattern id={patternId("paper")} width="8" height="8" patternUnits="userSpaceOnUse">
          <rect width="8" height="8" style={paper} />
        </pattern>
        <pattern id={patternId("hatch")} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="6" height="6" style={paper} />
          <rect width="2.2" height="6" style={ink} />
        </pattern>
        <pattern id={patternId("cross")} width="6" height="6" patternUnits="userSpaceOnUse">
          <rect width="6" height="6" style={paper} />
          <path d="M0 0L6 6M6 0L0 6" style={inkLine} strokeWidth="1.5" />
        </pattern>
        <pattern id={patternId("dots")} width="8" height="8" patternUnits="userSpaceOnUse">
          <rect width="8" height="8" style={paper} />
          <circle cx="4" cy="4" r="2.2" style={ink} />
        </pattern>
        <pattern id={patternId("dots-fine")} width="4" height="4" patternUnits="userSpaceOnUse">
          <rect width="4" height="4" style={paper} />
          <circle cx="2" cy="2" r="1" style={ink} />
        </pattern>
        <pattern id={patternId("lines")} width="6" height="6" patternUnits="userSpaceOnUse">
          <rect width="6" height="6" style={paper} />
          <rect width="6" height="3" style={ink} />
        </pattern>
      </defs>
    </svg>
  )
}

export type ChartMarkerProps = {
  cx?: number
  cy?: number
  kind?: "square" | "diamond" | "dot"
  size?: number
}

/** A line's point marker: a paper shape with an ink outline. Pass it to a line's `dot` prop. */
function ChartMarker({ cx = 0, cy = 0, kind = "square", size = 5 }: ChartMarkerProps) {
  const paint = { fill: "var(--background)", stroke: "currentColor", strokeWidth: 2 }
  if (kind === "dot") return <circle cx={cx} cy={cy} r={size} style={paint} />
  if (kind === "diamond") {
    return <path d={`M${cx} ${cy - size}L${cx + size} ${cy}L${cx} ${cy + size}L${cx - size} ${cy}Z`} style={paint} />
  }
  return <rect x={cx - size} y={cy - size} width={size * 2} height={size * 2} style={paint} />
}

/** Recharts container in a case. Renders the pattern set itself, so every chart can use chartFill(). */
function ChartContainer({ className, config, id, children, ...props }: React.ComponentProps<typeof ShadcnChartContainer>) {
  return (
    <div data-manga="chart" className={cn("relative ink-case p-4", className)}>
      <ChartPatterns />
      <ShadcnChartContainer
        id={id}
        config={config}
        className={cn(
          "aspect-auto h-[var(--chart-h,16rem)] w-full",
          // lettering ticks; no grey
          "[&_.recharts-cartesian-axis-tick_text]:font-letter [&_.recharts-cartesian-axis-tick_text]:text-sm",
          // the hover cursor is a frame, never a tone over the bars
          "[&_.recharts-rectangle.recharts-tooltip-cursor]:fill-transparent! [&_.recharts-rectangle.recharts-tooltip-cursor]:stroke-foreground!",
          // a solid fine line: dashes mean disabled in the kit
          "[&_.recharts-tooltip-cursor]:[stroke-dasharray:none]! [&_.recharts-tooltip-cursor]:[stroke-width:1px]!",
          // areas are patterns at full strength: a translucent fill would read as grey
          "[&_.recharts-area-area]:[fill-opacity:1]!",
        )}
        {...props}
      >
        {children}
      </ShadcnChartContainer>
    </div>
  )
}

/** Speech bubble for the chart tooltip (G6): a rounded 2px bubble with a small tail toward the point. */
function ChartTooltipContent(props: React.ComponentProps<typeof ShadcnChartTooltipContent>) {
  if (!props.active || !props.payload?.length) return null
  return (
    <div data-manga="chart-tooltip" className="relative inline-block">
      <ShadcnChartTooltipContent
        {...props}
        hideIndicator={props.hideIndicator ?? true}
        className={cn(
          "rounded-[1.1rem] border-[length:var(--mg-bw)]! border-border! px-3 py-1.5 font-letter text-base shadow-none!",
          props.className,
        )}
      />
      <svg
        aria-hidden
        width="16"
        height="12"
        viewBox="0 0 16 12"
        className="pointer-events-none absolute top-full start-1/2 -ms-2 -mt-[3px] overflow-visible"
      >
        <path d="M1 0 Q4 6 3 11 Q9 7 13 0" style={{ fill: "var(--background)", stroke: "var(--foreground)", strokeWidth: 2, strokeLinejoin: "round" }} />
      </svg>
    </div>
  )
}

type LegendItem = { value?: React.ReactNode; dataKey?: unknown; type?: string }

/** Legend with pattern swatches: a small ink-outlined square filled with the series pattern. */
function ChartLegendContent({
  className,
  payload,
  config,
  verticalAlign = "bottom",
}: {
  className?: string
  payload?: readonly LegendItem[]
  config?: ChartConfig
  verticalAlign?: "top" | "bottom"
}) {
  if (!payload?.length) return null
  const keys = Object.keys(config ?? {})
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-letter text-sm uppercase",
        verticalAlign === "top" ? "pb-3" : "pt-3",
        className,
      )}
    >
      {payload
        .filter((item) => item.type !== "none")
        .map((item, index) => {
          const key = String(item.dataKey ?? item.value)
          return (
            <span key={`${key}-${index}`} className="inline-flex items-center gap-2">
              <svg aria-hidden width="12" height="12" viewBox="0 0 12 12" className="shrink-0 overflow-visible">
                <rect x="0.5" y="0.5" width="11" height="11" style={{ fill: chartFill(key, keys), stroke: "currentColor", strokeWidth: 1.5 }} />
              </svg>
              {config?.[key]?.label ?? item.value}
            </span>
          )
        })}
    </div>
  )
}

export { ChartContainer, ChartLegend, ChartLegendContent, ChartMarker, ChartPatterns, ChartStyle, ChartTooltip, ChartTooltipContent }
export type { ChartConfig }
