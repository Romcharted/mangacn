import { Button } from "@registry/manga/ui/button"
import { ToastSfx, toast } from "@registry/manga/ui/sonner"

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
      <Button
        variant="outline"
        onClick={() => toast("Volume 3 is out", { action: { label: "Read", onClick: () => {} } })}
      >
        With action
      </Button>
      <Button variant="shout" onClick={() => toast("Level up!", { icon: <ToastSfx>DON!</ToastSfx> })}>
        SFX
      </Button>
    </div>
  )
}
