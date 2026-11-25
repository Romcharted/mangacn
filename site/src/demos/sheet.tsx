import { Button } from "@registry/manga/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@registry/manga/ui/sheet"

function Sample({ side, label }: { side: "right" | "left" | "top" | "bottom"; label: string }) {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" />}>{label}</SheetTrigger>
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
          <Button>Read on</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export function Preview() {
  return (
    <div className="flex flex-wrap gap-3">
      <Sample side="right" label="From the right" />
      <Sample side="left" label="From the left" />
      <Sample side="bottom" label="From the bottom" />
    </div>
  )
}

export function Thumb() {
  return <Sample side="right" label="Chapters" />
}
