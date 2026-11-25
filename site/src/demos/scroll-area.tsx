import { ScrollArea, ScrollBar } from "@registry/manga/ui/scroll-area"
import { Tile, Tiles } from "../state-grid"

const chapters = Array.from({ length: 14 }, (_, i) => `Chapter ${i + 1} · ${["The long night", "After the rain", "Ink on the bridge", "Paper tide"][i % 4]}`)

export function Preview() {
  return (
    <div className="ink-case relative w-full max-w-sm p-3">
      <ScrollArea className="h-56">
        <ol className="space-y-2 pe-4 font-letter text-base uppercase">
          {chapters.map((c) => (
            <li key={c} className="border-b-[length:var(--mg-bw-fine)] border-border pb-2">
              {c}
            </li>
          ))}
        </ol>
      </ScrollArea>
    </div>
  )
}

export function States() {
  return (
    <Tiles>
      <Tile label="vertical · overflow" size="lg">
        <ScrollArea className="h-32 w-56 text-sm">
          <p className="space-y-2 pe-4">
            {chapters.slice(0, 8).map((c) => (
              <span key={c} className="block">
                {c}
              </span>
            ))}
          </p>
        </ScrollArea>
      </Tile>
      <Tile label="horizontal · overflow" size="lg">
        <ScrollArea className="w-56">
          <div className="flex w-[28rem] gap-3 pb-3 font-letter text-sm uppercase">
            {chapters.slice(0, 6).map((c) => (
              <span key={c} className="ink-case-inner shrink-0 p-2">
                {c.split(" · ")[1]}
              </span>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </Tile>
      <Tile label="no overflow" size="lg">
        <ScrollArea className="h-20 w-56 text-sm">
          <p className="pe-4">Short text, nothing to scroll.</p>
        </ScrollArea>
      </Tile>
    </Tiles>
  )
}

export function Thumb() {
  return (
    <ScrollArea className="h-24 w-44 text-xs">
      <div className="space-y-1.5 pe-3 font-letter uppercase">
        {chapters.slice(0, 8).map((c) => (
          <div key={c} className="border-b-[length:var(--mg-bw-fine)] border-border">
            {c.split(" · ")[0]}
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
