import { Button } from "@registry/manga/ui/button"
import { Input } from "@registry/manga/ui/input"
import { Label } from "@registry/manga/ui/label"
import type { Example } from "../registry"
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  type DialogSize,
} from "@registry/manga/ui/dialog"

function Sample({ size = "default", long = false, flash = false, label }: { size?: DialogSize; long?: boolean; flash?: boolean; label: string }) {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" />}>{label}</DialogTrigger>
      <DialogContent size={size} flash={flash}>
        <DialogHeader>
          <DialogTitle>Leave the chapter?</DialogTitle>
          <DialogDescription>Your place is saved. You can come back to page 14 at any time.</DialogDescription>
        </DialogHeader>
        {long && (
          <DialogBody className="max-h-60 space-y-3">
            {Array.from({ length: 10 }, (_, i) => (
              <p key={i}>Page {i + 1}. The rain kept falling on the harbour roofs while the lamps went out one by one.</p>
            ))}
          </DialogBody>
        )}
        <DialogFooter>
          <DialogClose render={<Button variant="ghost" />}>Stay</DialogClose>
          <DialogClose render={<Button />}>Leave</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function Preview() {
  return <Sample label="Leave the chapter" />
}

function WithFlash() {
  return <Sample label="Open with a flash" flash />
}

function Sizes() {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {(["sm", "default", "lg", "full"] as const).map((s) => (
        <Sample key={s} size={s} label={s} />
      ))}
    </div>
  )
}

function ScrollingBody() {
  return <Sample long label="Read the summary" />
}

function EditProfile() {
  return (
    <Dialog>
      <DialogTrigger render={<Button />}>Edit profile</DialogTrigger>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle>Your pen name</DialogTitle>
          <DialogDescription>Readers see it under every chapter you post.</DialogDescription>
        </DialogHeader>
        <form id="pen-name" className="grid gap-2" onSubmit={(e) => e.preventDefault()}>
          <Label htmlFor="pen">Pen name</Label>
          <Input id="pen" defaultValue="Suzu" />
        </form>
        <DialogFooter>
          <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
          <DialogClose render={<Button type="submit" form="pen-name" />}>Save</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export const examples: Example[] = [
  { fn: "WithFlash", title: "With a flash", description: "flash draws concentration lines around the window as it opens, for the moments that deserve it.", Component: WithFlash },
  { fn: "Sizes", title: "Sizes", description: "sm, default, lg and full set the width; the height follows the content.", Component: Sizes },
  { fn: "ScrollingBody", title: "Scrolling body", description: "DialogBody scrolls on its own while the title and the buttons stay in place.", Component: ScrollingBody },
  { fn: "EditProfile", title: "A form", description: "A short form in a small dialog; the Save button submits it and closes the window.", Component: EditProfile },
]

export function States() {
  return (
    <div className="space-y-3">
      <p className="text-sm">
        Overlays render in a portal: each one opens live. Open: 3px panel, tone shadow, a light screentone veil fixed
        to the screen, an impact frame on open.
      </p>
      <div className="flex flex-wrap gap-4">
        {(["sm", "default", "lg", "full"] as const).map((s) => (
          <Sample key={s} size={s} label={`size="${s}"`} />
        ))}
        <Sample long label="Scrolling body" />
      </div>
    </div>
  )
}

/** Thumbnail only: the panel look, without a portal. */
export function Thumb() {
  return <Sample label="Open" size="sm" />
}
