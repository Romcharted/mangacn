import { useState } from "react"
import { ArrowRight, BookOpen, Plus, Trash2 } from "lucide-react"
import { Button, type ButtonVariant } from "@registry/manga/ui/button"
import type { Example } from "../registry"
import { StateGrid, force } from "../state-grid"

const VARIANTS: ButtonVariant[] = ["default", "outline", "tone", "ghost", "link", "destructive", "shout"]
const STATES = ["default", "hover", "focus", "active", "disabled", "loading"] as const

export function Preview() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <Button>Read now</Button>
      <Button variant="outline">
        <Plus data-icon="inline-start" /> Add to list
      </Button>
      <Button variant="shout">Start!</Button>
    </div>
  )
}

function Variants() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <Button>Default</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="tone">Tone</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="shout">Shout!</Button>
    </div>
  )
}

function Sizes() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <Button size="sm">Small</Button>
      <Button>Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon" variant="outline" aria-label="Next page">
        <ArrowRight />
      </Button>
    </div>
  )
}

function WithIcons() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <Button>
        <BookOpen data-icon="inline-start" /> Read chapter 12
      </Button>
      <Button variant="outline">
        Next <ArrowRight data-icon="inline-end" />
      </Button>
      <Button variant="destructive">
        <Trash2 data-icon="inline-start" /> Delete
      </Button>
    </div>
  )
}

function Loading() {
  const [saving, setSaving] = useState(false)
  return (
    <Button
      loading={saving}
      onClick={() => {
        setSaving(true)
        setTimeout(() => setSaving(false), 1500)
      }}
    >
      {saving ? "Saving" : "Save the page"}
    </Button>
  )
}

function FullWidth() {
  return (
    <div className="w-72">
      <Button fullWidth>
        Continue <ArrowRight data-icon="inline-end" />
      </Button>
    </div>
  )
}

export const examples: Example[] = [
  { fn: "Variants", title: "Variants", description: "Seven looks, from the plain ink button to the shout for the one action that matters.", Component: Variants },
  { fn: "Sizes", title: "Sizes", description: "Small, default and large, plus a square icon button that needs an aria-label.", Component: Sizes },
  { fn: "WithIcons", title: "With an icon", description: "Mark the icon with data-icon so the spacing stays even on either side.", Component: WithIcons },
  { fn: "Loading", title: "Loading", description: "loading turns the label into concentration lines and blocks a second click. Click to try.", Component: Loading },
  { fn: "FullWidth", title: "Full width", description: "fullWidth fills its container, for forms and narrow cards.", Component: FullWidth },
]

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
