import { Button } from "@registry/manga/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@registry/manga/ui/sheet"
import type { Example } from "../registry"

function Sample({ side, label }: { side: "right" | "left" | "top" | "bottom"; label: string }) {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" className="min-h-11 sm:min-h-8" />}>{label}</SheetTrigger>
      <SheetContent side={side}>
        <SheetHeader>
          <SheetTitle>Chapters</SheetTitle>
          <SheetDescription>The long night, Vol. 3.</SheetDescription>
        </SheetHeader>
        <ol className="grid gap-2 px-4 text-base">
          {["The long night", "After the rain", "Harbour", "Paper lanterns"].map((c, i) => (
            <li key={c} className="flex gap-3">
              <span className="font-mono text-sm">{String(i + 1).padStart(2, "0")}</span>
              {c}
            </li>
          ))}
        </ol>
        <SheetFooter>
          <Button className="min-h-11 sm:min-h-8">Read on</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export function Preview() {
  return <Sample side="right" label="Contents" />
}

function FromLeft() {
  return <Sample side="left" label="From the left" />
}

function FromBottom() {
  return <Sample side="bottom" label="From the bottom" />
}

function FromTop() {
  return <Sample side="top" label="From the top" />
}

export const examples: Example[] = [
  { fn: "FromLeft", title: "From the left", description: "side=\"left\" docks the case to the left edge, with the 3px line on its open side.", Component: FromLeft },
  { fn: "FromBottom", title: "From the bottom", description: "side=\"bottom\" slides the case up from the foot of the screen, for a short list or a set of choices.", Component: FromBottom },
  { fn: "FromTop", title: "From the top", description: "side=\"top\" drops the case from the upper edge; the offset frame falls below it.", Component: FromTop },
]

export function States() {
  return (
    <div className="space-y-3">
      <p className="text-sm">Overlays render in a portal: each one opens live, from its edge.</p>
      <div className="flex flex-wrap justify-center gap-4">
        <Sample side="right" label="Right" />
        <Sample side="left" label="Left" />
        <Sample side="bottom" label="Bottom" />
        <Sample side="top" label="Top" />
      </div>
    </div>
  )
}

export function Thumb() {
  return <Sample side="right" label="Chapters" />
}
