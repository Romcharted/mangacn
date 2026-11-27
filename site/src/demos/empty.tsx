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

export const examples: Example[] = [
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
