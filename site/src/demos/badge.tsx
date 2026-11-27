import { Star } from "lucide-react"
import { Badge, type BadgeVariant } from "@registry/manga/ui/badge"
import type { Example } from "../registry"
import { StateGrid } from "../state-grid"

const VARIANTS: BadgeVariant[] = ["default", "outline", "tone", "destructive", "burst", "stamp"]

export function Preview() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <Badge>Ongoing</Badge>
      <Badge variant="outline" dot>
        Live
      </Badge>
    </div>
  )
}

function Variants() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <Badge>Ongoing</Badge>
      <Badge variant="outline">Paused</Badge>
      <Badge variant="tone">Vol. 3</Badge>
      <Badge variant="destructive">Dropped</Badge>
      <Badge variant="burst">New!</Badge>
      <Badge variant="stamp">Approved</Badge>
    </div>
  )
}

function StatusDot() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <Badge variant="outline" dot>
        Live
      </Badge>
      <Badge dot>Scheduled</Badge>
    </div>
  )
}

function WithIcon() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <Badge variant="outline">
        <Star data-icon="inline-start" /> 4.8
      </Badge>
    </div>
  )
}

function AsLink() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <Badge variant="tone" render={<a href="#" className="min-h-11 sm:min-h-8" />}>
        Vol. 3
      </Badge>
    </div>
  )
}

export const examples: Example[] = [
  { fn: "Variants", title: "Variants", description: "default, outline, tone, destructive, burst and stamp: six looks for one kind of label.", Component: Variants },
  { fn: "StatusDot", title: "With a status dot", description: "dot=\"true\" puts a square mark before the label to show a live or scheduled state.", Component: StatusDot },
  { fn: "WithIcon", title: "With an icon", description: "An icon inside the badge, marked with data-icon=\"inline-start\", sits before the text.", Component: WithIcon },
  { fn: "AsLink", title: "As a link", description: "render swaps the element for a link; the badge keeps its look and a 44px tap height on phones.", Component: AsLink },
]

export function States() {
  return (
    <StateGrid
      rows={VARIANTS}
      cols={["label", "with dot", "with icon", "link"] as const}
      cell={(v, c) =>
        c === "label" ? (
          <Badge variant={v}>Badge</Badge>
        ) : c === "with dot" ? (
          <Badge variant={v} dot>
            Badge
          </Badge>
        ) : c === "with icon" ? (
          <Badge variant={v}>
            <Star data-icon="inline-start" /> Badge
          </Badge>
        ) : (
          <Badge variant={v} render={<a href="#" tabIndex={-1} />}>
            Link
          </Badge>
        )
      }
    />
  )
}

export function Thumb() {
  return (
    <div className="flex items-center gap-4">
      <Badge variant="burst">New!</Badge>
      <Badge variant="stamp">Approved</Badge>
    </div>
  )
}
