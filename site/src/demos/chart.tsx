import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, XAxis, YAxis } from "recharts"
import {
  type ChartConfig,
  type ChartPattern,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartMarker,
  ChartPatterns,
  ChartTooltip,
  ChartTooltipContent,
  chartFill,
  chartPatternFill,
} from "@registry/manga/ui/chart"
import type { Example } from "../registry"
import { Tile, Tiles } from "../state-grid"

const monthly = [
  { month: "Jan", reads: 186, sales: 80 },
  { month: "Feb", reads: 305, sales: 200 },
  { month: "Mar", reads: 237, sales: 120 },
  { month: "Apr", reads: 173, sales: 190 },
  { month: "May", reads: 209, sales: 130 },
  { month: "Jun", reads: 314, sales: 240 },
]

const config = {
  reads: { label: "Reads" },
  sales: { label: "Sales" },
} satisfies ChartConfig
const keys = Object.keys(config)

const genres = [
  { name: "Action", value: 40 },
  { name: "Romance", value: 25 },
  { name: "Mystery", value: 20 },
  { name: "Slice of life", value: 15 },
]
const genreConfig = {
  Action: { label: "Action" },
  Romance: { label: "Romance" },
  Mystery: { label: "Mystery" },
  "Slice of life": { label: "Slice of life" },
} satisfies ChartConfig
const genreKeys = Object.keys(genreConfig)

const axisLine = { stroke: "currentColor", strokeWidth: 2 }
const cursor = { stroke: "currentColor", strokeWidth: 1 }

function BarsChart() {
  return (
    <ChartContainer config={config} className="w-full max-w-xl">
      <BarChart data={monthly}>
        <CartesianGrid vertical={false} stroke="currentColor" />
        <XAxis dataKey="month" tickLine={false} axisLine={axisLine} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} width={36} />
        <ChartTooltip content={<ChartTooltipContent />} cursor={cursor} />
        <ChartLegend content={<ChartLegendContent config={config} />} />
        <Bar dataKey="reads" fill={chartFill("reads", keys)} stroke="currentColor" strokeWidth={2} />
        <Bar dataKey="sales" fill={chartFill("sales", keys)} stroke="currentColor" strokeWidth={2} />
      </BarChart>
    </ChartContainer>
  )
}

function LinesChart() {
  return (
    <ChartContainer config={config} className="w-full max-w-xl">
      <LineChart data={monthly}>
        <CartesianGrid vertical={false} stroke="currentColor" />
        <XAxis dataKey="month" tickLine={false} axisLine={axisLine} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} width={36} />
        <ChartTooltip content={<ChartTooltipContent />} cursor={cursor} />
        <ChartLegend content={<ChartLegendContent config={config} />} />
        <Line
          dataKey="reads"
          type="monotone"
          stroke="currentColor"
          strokeWidth={2}
          dot={(p) => <ChartMarker cx={p.cx} cy={p.cy} kind="square" />}
        />
        <Line
          dataKey="sales"
          type="monotone"
          stroke="currentColor"
          strokeWidth={2}
          strokeDasharray="8 4"
          dot={(p) => <ChartMarker cx={p.cx} cy={p.cy} kind="diamond" />}
        />
      </LineChart>
    </ChartContainer>
  )
}

function AreaChartDemo() {
  return (
    <ChartContainer config={config} className="w-full max-w-xl">
      <AreaChart data={monthly}>
        <CartesianGrid vertical={false} stroke="currentColor" />
        <XAxis dataKey="month" tickLine={false} axisLine={axisLine} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} width={36} />
        <ChartTooltip content={<ChartTooltipContent />} cursor={cursor} />
        <ChartLegend content={<ChartLegendContent config={config} />} />
        <Area dataKey="reads" type="monotone" fill={chartFill("reads", keys)} stroke="currentColor" strokeWidth={2} />
        <Area dataKey="sales" type="monotone" fill={chartFill("sales", keys)} stroke="currentColor" strokeWidth={2} />
      </AreaChart>
    </ChartContainer>
  )
}

function PieChartDemo() {
  return (
    <ChartContainer config={genreConfig} className="w-full max-w-sm">
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent />} />
        <Pie
          data={genres}
          dataKey="value"
          nameKey="name"
          outerRadius={88}
          paddingAngle={3}
          stroke="currentColor"
          strokeWidth={2}
          isAnimationActive={false}
        >
          {genres.map((g) => (
            <Cell key={g.name} fill={chartFill(g.name, genreKeys)} />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  )
}

const ALL_PATTERNS: ChartPattern[] = ["solid", "hatch", "dots", "lines", "cross", "dots-fine", "paper"]

export function Preview() {
  return <BarsChart />
}

export const examples: Example[] = [
  { fn: "LinesChart", title: "Lines", description: "Lines differ by dash and by marker, never by colour: a solid line with squares, a dashed one with diamonds.", Component: LinesChart },
  { fn: "AreaChartDemo", title: "Filled area", description: "Areas take the series pattern at full strength, so they read as ink with no grey.", Component: AreaChartDemo },
  { fn: "PieChartDemo", title: "Pie", description: "Pie slices are split by paper gaps, and each slice gets its own pattern.", Component: PieChartDemo },
]

export function States() {
  return (
    <Tiles>
      <Tile label="bars · tooltip bubble" size="lg">
        <div className="[--chart-h:9rem] w-full">
          <ChartContainer config={config}>
            <BarChart data={monthly}>
              <XAxis dataKey="month" tickLine={false} axisLine={axisLine} />
              <ChartTooltip defaultIndex={2} active content={<ChartTooltipContent />} cursor={cursor} />
              <Bar dataKey="reads" fill={chartFill("reads", keys)} stroke="currentColor" strokeWidth={2} />
              <Bar dataKey="sales" fill={chartFill("sales", keys)} stroke="currentColor" strokeWidth={2} />
            </BarChart>
          </ChartContainer>
        </div>
      </Tile>
      <Tile label="legend · swatches" size="lg">
        <ChartLegendContent
          config={config}
          payload={[
            { value: "Reads", dataKey: "reads" },
            { value: "Sales", dataKey: "sales" },
          ]}
        />
      </Tile>
      <Tile label="patterns · the seven fills" size="full">
        <ChartPatterns />
        <div className="flex flex-wrap gap-4">
          {ALL_PATTERNS.map((p) => (
            <figure key={p} className="grid justify-items-center gap-1 font-mono text-xs">
              <svg aria-hidden width="48" height="48" viewBox="0 0 48 48" className="overflow-visible">
                <rect x="1" y="1" width="46" height="46" style={{ fill: chartPatternFill(p), stroke: "currentColor", strokeWidth: 2 }} />
              </svg>
              <figcaption>{p}</figcaption>
            </figure>
          ))}
        </div>
      </Tile>
      <Tile label="pie · paper gaps" size="lg">
        <div className="[--chart-h:12rem] w-full">
          <PieChartDemo />
        </div>
      </Tile>
    </Tiles>
  )
}

/** Live: hover a bar for its values. */
export function Thumb() {
  return (
    <ChartContainer config={config} className="w-60 p-2 [--chart-h:7.5rem]">
      <BarChart data={monthly}>
        <XAxis dataKey="month" tickLine={false} axisLine={axisLine} />
        <ChartTooltip content={<ChartTooltipContent />} cursor={cursor} />
        <Bar dataKey="reads" fill={chartFill("reads", keys)} stroke="currentColor" strokeWidth={2} />
        <Bar dataKey="sales" fill={chartFill("sales", keys)} stroke="currentColor" strokeWidth={2} />
      </BarChart>
    </ChartContainer>
  )
}
