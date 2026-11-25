import { ArrowRight, Plus } from "lucide-react"
import { Button, type ButtonVariant } from "@registry/manga/ui/button"
import { StateGrid, force } from "../state-grid"

const VARIANTS: ButtonVariant[] = ["default", "outline", "tone", "ghost", "link", "destructive", "shout"]
const STATES = ["default", "hover", "focus", "active", "disabled", "loading"] as const

export function Preview() {
  return (
    <div className="flex flex-wrap items-center gap-5">
      <Button>Read now</Button>
      <Button variant="outline">
        <Plus data-icon="inline-start" /> Add to list
      </Button>
      <Button variant="tone">Bookmark</Button>
      <Button variant="ghost">Skip</Button>
      <Button variant="link">See all chapters</Button>
      <Button variant="destructive">Delete</Button>
      <Button variant="shout" size="lg">
        Start!
      </Button>
      <Button size="icon" variant="outline" aria-label="Next">
        <ArrowRight />
      </Button>
      <Button size="sm" loading>
        Saving
      </Button>
      <div className="w-full max-w-xs">
        <Button fullWidth>
          Continue <ArrowRight data-icon="inline-end" />
        </Button>
      </div>
    </div>
  )
}

export function States() {
  return (
    <div className="space-y-6">
      <StateGrid
        rows={VARIANTS}
        cols={STATES}
        cell={(v, s) => (
          <Button
            variant={v}
            {...force(s)}
            disabled={s === "disabled"}
            loading={s === "loading"}
            tabIndex={-1}
          >
            {v === "shout" ? "Go!" : "Button"}
          </Button>
        )}
      />
      <StateGrid
        rows={["sm", "default", "lg", "icon"] as const}
        cols={["default", "outline", "shout"] as const}
        cell={(size, v) =>
          size === "icon" ? (
            <Button size="icon" variant={v} aria-label="Add" tabIndex={-1}>
              <Plus />
            </Button>
          ) : (
            <Button size={size} variant={v} tabIndex={-1}>
              {v === "shout" ? "Go!" : "Button"}
            </Button>
          )
        }
      />
    </div>
  )
}

export function Thumb() {
  return (
    <div className="flex items-center gap-6">
      <Button size="sm">Read</Button>
      <Button size="sm" variant="shout">Go!</Button>
    </div>
  )
}
