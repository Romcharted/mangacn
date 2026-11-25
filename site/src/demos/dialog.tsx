import { Button } from "@registry/manga/ui/button"
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

function Sample({ size = "default", long = false, label }: { size?: DialogSize; long?: boolean; label: string }) {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" />}>{label}</DialogTrigger>
      <DialogContent size={size}>
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
  return <Sample label="Open dialog" />
}

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
  return (
    <div className="relative w-48 border-ink-panel bg-background tone-shadow">
      <p className="p-3 font-letter text-lg leading-none uppercase">Leave?</p>
      <div className="flex justify-end gap-2 border-t-[length:var(--mg-bw)] border-border p-2">
        <span className="border-ink px-2 font-letter text-sm uppercase">Stay</span>
        <span className="ink-fill border-ink px-2 font-letter text-sm uppercase">Leave</span>
      </div>
    </div>
  )
}
