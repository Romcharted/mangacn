import { Separator } from "@registry/manga/ui/separator"

export function Preview() {
  return (
    <div className="grid max-w-md gap-4 text-base">
      <p>Chapter 11 ends here.</p>
      <Separator variant="double" />
      <p>Chapter 12 begins.</p>
      <Separator />
      <div className="flex h-6 items-center gap-3 font-letter uppercase">
        Read
        <Separator orientation="vertical" />
        Share
        <Separator orientation="vertical" variant="fine" />
        Save
      </div>
    </div>
  )
}

export function Thumb() {
  return (
    <div className="grid w-48 gap-3">
      <Separator />
      <Separator variant="fine" />
      <Separator variant="double" />
    </div>
  )
}
