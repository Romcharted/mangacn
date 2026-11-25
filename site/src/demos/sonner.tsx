import { Button } from "@registry/manga/ui/button"
import { ToastCard, ToastSfx, toast, type ToastType } from "@registry/manga/ui/sonner"
import { Tile, Tiles } from "../state-grid"

const wait = () => new Promise((r) => setTimeout(r, 1500))

export function Preview() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="outline" onClick={() => toast("Chapter saved", { description: "Page 14 bookmarked." })}>
        Default
      </Button>
      <Button variant="outline" onClick={() => toast.success("Subscribed!")}>
        Success
      </Button>
      <Button variant="outline" onClick={() => toast.error("Could not load page 15")}>
        Error
      </Button>
      <Button variant="outline" onClick={() => toast.warning("Spoilers ahead")}>
        Warning
      </Button>
      <Button variant="outline" onClick={() => toast.promise(wait, { loading: "Loading chapter…", success: "Ready!", error: "Failed" })}>
        Loading
      </Button>
      <Button variant="outline" onClick={() => toast("Volume 3 is out", { action: { label: "Read", onClick: () => {} } })}>
        With action
      </Button>
      <Button variant="shout" onClick={() => toast("Level up!", { icon: <ToastSfx>DON!</ToastSfx> })}>
        SFX
      </Button>
    </div>
  )
}

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
  return <ToastCard className="w-52 p-3" type="success" title="Subscribed!" />
}
