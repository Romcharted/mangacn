import { useState } from "react"
import { Bookmark } from "lucide-react"
import { Button } from "@registry/manga/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMark, EmptyMedia, EmptyTitle } from "@registry/manga/ui/empty"
import type { Example } from "../registry"
import { Tile, Tiles } from "../state-grid"

export function Preview() {
  return (
    <Empty className="w-80">
      <EmptyHeader>
        <EmptyMark />
        <EmptyTitle>No bookmarks</EmptyTitle>
        <EmptyDescription>Tap the corner of a page to keep your place.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" className="min-h-11 sm:min-h-8">
          Open the library
        </Button>
      </EmptyContent>
    </Empty>
  )
}

function WithIcon() {
  return (
    <Empty className="w-80">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Bookmark />
        </EmptyMedia>
        <EmptyTitle>Nothing saved yet</EmptyTitle>
        <EmptyDescription>Pages you bookmark will be listed here.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}

function Compact() {
  return (
    <Empty className="w-64 gap-1 p-3">
      <EmptyHeader>
        <EmptyMark className="text-3xl" />
        <EmptyTitle className="text-base">No results</EmptyTitle>
      </EmptyHeader>
    </Empty>
  )
}

function NoMatch() {
  const [query, setQuery] = useState("krak")
  return query ? (
    <Empty className="w-80">
      <EmptyHeader>
        <EmptyMark />
        <EmptyTitle>No chapter matches “{query}”</EmptyTitle>
        <EmptyDescription>Check the spelling, or clear the search to see every chapter.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" className="min-h-11 sm:min-h-8" onClick={() => setQuery("")}>
          Clear the search
        </Button>
      </EmptyContent>
    </Empty>
  ) : (
    <div className="grid w-80 justify-items-center gap-3">
      <ul className="grid w-full list-none gap-1 p-0">
        {["Ch. 9 — The lighthouse", "Ch. 10 — Ink rain", "Ch. 11 — The bridge"].map((c) => (
          <li key={c} className="border-ink-fine px-3 py-2">
            {c}
          </li>
        ))}
      </ul>
      <Button variant="ghost" className="min-h-11 sm:min-h-8" onClick={() => setQuery("krak")}>
        Search “krak” again
      </Button>
    </div>
  )
}

export const examples: Example[] = [
  { fn: "NoMatch", title: "No search result", description: "An empty search says what was searched and offers the way back: clear it to see the list.", Component: NoMatch },
  { fn: "WithIcon", title: "With an icon", description: "EmptyMedia variant=\"icon\" puts a small icon in an ink frame above the title, in place of the mark.", Component: WithIcon },
  { fn: "Compact", title: "Compact", description: "Less padding and a smaller mark and title, for an empty list inside a panel.", Component: Compact },
]

export function States() {
  return (
    <Tiles>
      <Tile label="mark + title" size="lg">
        <Empty className="w-full max-w-xs">
          <EmptyHeader>
            <EmptyMark />
            <EmptyTitle>No bookmarks</EmptyTitle>
          </EmptyHeader>
        </Empty>
      </Tile>
      <Tile label="with description" size="lg">
        <Empty className="w-full max-w-xs">
          <EmptyHeader>
            <EmptyMark />
            <EmptyTitle>No bookmarks</EmptyTitle>
            <EmptyDescription>Tap the corner of a page to keep your place.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </Tile>
      <Tile label="with action" size="lg">
        <Empty className="w-full max-w-xs">
          <EmptyHeader>
            <EmptyMark />
            <EmptyTitle>No bookmarks</EmptyTitle>
          </EmptyHeader>
          <EmptyContent>
            <Button variant="outline" size="sm" className="min-h-11 sm:min-h-8">
              Open the library
            </Button>
          </EmptyContent>
        </Empty>
      </Tile>
    </Tiles>
  )
}

export function Thumb() {
  return (
    <Empty className="w-48 gap-1 p-3">
      <EmptyHeader>
        <EmptyMark className="text-3xl" />
        <EmptyTitle className="text-base">No bookmarks</EmptyTitle>
      </EmptyHeader>
    </Empty>
  )
}
