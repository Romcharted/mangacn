import { ScrollArea, ScrollBar } from "@registry/manga/ui/scroll-area"
import type { Example } from "../registry"
import { Tile, Tiles } from "../state-grid"

const chapters = Array.from({ length: 14 }, (_, i) => `Chapter ${i + 1} · ${["The long night", "After the rain", "Ink on the bridge", "Paper tide"][i % 4]}`)

export function Preview() {
  return (
    <div className="ink-case relative w-80 max-w-full p-3">
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

function Strip() {
  return (
    <div className="w-80 max-w-full">
      <ScrollArea className="w-full max-w-full">
        <div className="flex min-w-max gap-3 pb-3 font-letter text-sm uppercase">
          {chapters.slice(0, 8).map((c) => (
            <span key={c} className="ink-case-inner shrink-0 p-2">
              {c.split(" · ")[1]}
            </span>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}

function Contents() {
  return (
    <div className="ink-case relative w-64 max-w-full p-3">
      <ScrollArea className="h-40">
        <ol className="space-y-2 pe-4 font-letter text-sm uppercase">
          {chapters.map((c) => (
            <li key={c} className="border-b-[length:var(--mg-bw-fine)] border-border pb-1">
              {c.split(" · ")[0]}
            </li>
          ))}
        </ol>
      </ScrollArea>
    </div>
  )
}

function InsideAPanel() {
  return (
    <div className="ink-case w-80 max-w-full">
      <p className="border-b-2 border-border p-3 font-letter uppercase">Notes for the printer</p>
      <div className="p-3">
        <ScrollArea className="h-32 text-sm">
          <p className="space-y-2 pe-4">
            The first ten pages use the matte paper. Page 14 needs a bleed on the right edge, check the proof before the
            run. Lettering for chapter 13 is in the shared folder, and the sound effects are still rough on pages 2 and 9.
          </p>
        </ScrollArea>
      </div>
    </div>
  )
}

export const examples: Example[] = [
  { fn: "Strip", title: "Horizontal strip", description: "ScrollBar orientation=\"horizontal\" adds the bar underneath; the content keeps its natural width (min-w-max).", Component: Strip, wide: true },
  { fn: "Contents", title: "Table of contents", description: "A fixed height in the frame: the list scrolls inside it, the frame stays put.", Component: Contents },
  { fn: "InsideAPanel", title: "Inside a panel", description: "The area sits in a panel under a title; the text scrolls, the title stays.", Component: InsideAPanel },
]

export function States() {
  return (
    <Tiles>
      <Tile label="vertical · overflow" size="lg">
        <ScrollArea className="h-32 w-56 max-w-full text-sm">
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
        <div className="w-56 max-w-full">
          <ScrollArea className="w-full max-w-full">
            <div className="flex min-w-max gap-3 pb-3 font-letter text-sm uppercase">
              {chapters.slice(0, 6).map((c) => (
                <span key={c} className="ink-case-inner shrink-0 p-2">
                  {c.split(" · ")[1]}
                </span>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </Tile>
      <Tile label="no overflow" size="lg">
        <ScrollArea className="h-20 w-56 max-w-full text-sm">
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
