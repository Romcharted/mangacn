import { Star } from "lucide-react"
import { Badge, type BadgeVariant } from "@registry/manga/ui/badge"
import { StateGrid } from "../state-grid"

const VARIANTS: BadgeVariant[] = ["default", "outline", "tone", "destructive", "burst", "stamp"]

export function Preview() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Badge>Ongoing</Badge>
      <Badge variant="outline" dot>
        Live
      </Badge>
      <Badge variant="tone">Vol. 3</Badge>
      <Badge variant="destructive">Dropped</Badge>
      <Badge variant="burst">New!</Badge>
      <Badge variant="stamp">Approved</Badge>
      <Badge variant="outline">
        <Star data-icon="inline-start" /> 4.8
      </Badge>
    </div>
  )
}

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
          <Badge variant={v} render={<a href="#badge" tabIndex={-1} />}>
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
