import { Button } from "@registry/manga/ui/button"
import { ToastCard, ToastSfx, toast, type ToastType } from "@registry/manga/ui/sonner"
import type { Example } from "../registry"
import { Tile, Tiles } from "../state-grid"

const wait = () => new Promise((r) => setTimeout(r, 1500))

export function Preview() {
  return (
    <Button variant="outline" className="min-h-11 sm:min-h-8" onClick={() => toast.success("Subscribed!")}>
      Subscribe
    </Button>
  )
}

function Types() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button variant="outline" className="min-h-11 sm:min-h-8" onClick={() => toast("Chapter saved", { description: "Page 14 bookmarked." })}>
        Default
      </Button>
      <Button variant="outline" className="min-h-11 sm:min-h-8" onClick={() => toast.success("Subscribed!")}>
        Success
      </Button>
      <Button variant="outline" className="min-h-11 sm:min-h-8" onClick={() => toast.warning("Spoilers ahead")}>
        Warning
      </Button>
      <Button variant="outline" className="min-h-11 sm:min-h-8" onClick={() => toast.error("Could not load page 15")}>
        Error
      </Button>
    </div>
  )
}

function Loading() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button
        variant="outline"
        className="min-h-11 sm:min-h-8"
        onClick={() => toast.promise(wait, { loading: "Loading chapter…", success: "Ready!", error: "Failed" })}
      >
        Load a chapter
      </Button>
    </div>
  )
}

function WithAction() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button variant="outline" className="min-h-11 sm:min-h-8" onClick={() => toast("Volume 3 is out", { action: { label: "Read", onClick: () => {} } })}>
        Volume out
      </Button>
    </div>
  )
}

function Sfx() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button variant="shout" className="min-h-11 sm:min-h-8" onClick={() => toast("Level up!", { icon: <ToastSfx>DON!</ToastSfx> })}>
        Level up
      </Button>
    </div>
  )
}

export const examples: Example[] = [
  { fn: "Types", title: "Types", description: "toast.success, toast.warning and toast.error set the mark; a plain toast takes a description.", Component: Types },
  { fn: "Loading", title: "While loading", description: "toast.promise shows the spinning lines, then the success or error text when the work ends.", Component: Loading },
  { fn: "WithAction", title: "With an action", description: "The action option adds a button to the toast, here a Read link to the new volume.", Component: WithAction },
  { fn: "Sfx", title: "With a sound effect", description: "ToastSfx in the icon option puts an onomatopoeia in its own column beside the text.", Component: Sfx },
]

const TYPES: { type: ToastType; title: string; description?: string }[] = [
  { type: "default", title: "Chapter saved", description: "Page 14 bookmarked." },
  { type: "success", title: "Subscribed!" },
  { type: "info", title: "New volume on Friday" },
  { type: "warning", title: "Spoilers ahead" },
  { type: "error", title: "Could not load page 15" },
  { type: "loading", title: "Loading chapter…" },
]

const action = (
  <button type="button" tabIndex={-1} className="ms-auto h-8 shrink-0 border-[length:var(--mg-bw)] border-primary bg-primary px-3 font-letter text-sm uppercase text-primary-foreground">
    Read
  </button>
)

export function States() {
  return (
    <Tiles>
      {TYPES.map((t) => (
        <Tile key={t.type} label={`type · ${t.type}`} size="lg">
          <ToastCard className="w-full max-w-xs" type={t.type} title={t.title} description={t.description} />
        </Tile>
      ))}
      <Tile label="with action" size="lg">
        <ToastCard className="w-full max-w-xs" title="Volume 3 is out" action={action} />
      </Tile>
      <Tile label="with ToastSfx" size="lg">
        <ToastCard className="w-full max-w-xs" title="Level up!" icon={<ToastSfx>DON!</ToastSfx>} />
      </Tile>
    </Tiles>
  )
}

export function Thumb() {
  return (
    <div className="grid justify-items-center gap-3">
      <ToastCard className="w-52 p-3" type="success" title="Subscribed!" />
      <Button size="sm" variant="outline" onClick={() => toast.success("Subscribed!")}>
        Send one
      </Button>
    </div>
  )
}
