import { useState } from "react"
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
  ContextMenuTwin,
  ContextMenuTwinRow,
} from "@registry/manga/ui/context-menu"
import type { Example } from "../registry"
import { Tile, Tiles } from "../state-grid"

/* The trigger area: a 2px panel (solid line: dashes would mean disabled). */
const area =
  "grid min-h-44 w-72 max-w-full place-items-center border-ink bg-background p-6 text-center text-sm select-none"

export function Preview() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className={area}>Right-click or long-press this page</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuGroup>
          <ContextMenuLabel>Page</ContextMenuLabel>
          <ContextMenuItem>
            Bookmark <ContextMenuShortcut>B</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            Share <ContextMenuShortcut>S</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

function Submenu() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className={area}>Right-click this page to save it</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuGroup>
          <ContextMenuLabel>Page</ContextMenuLabel>
          <ContextMenuSub>
            <ContextMenuSubTrigger>Download</ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem>As PDF</ContextMenuItem>
              <ContextMenuItem>As images</ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  )
}

function ViewOptions() {
  const [furigana, setFurigana] = useState(true)
  const [order, setOrder] = useState("rtl")
  return (
    <ContextMenu>
      <ContextMenuTrigger className={area}>Right-click to change the view</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuGroup>
          <ContextMenuLabel>View</ContextMenuLabel>
          <ContextMenuCheckboxItem checked={furigana} onCheckedChange={setFurigana}>
            Furigana
          </ContextMenuCheckboxItem>
          <ContextMenuRadioGroup value={order} onValueChange={setOrder}>
            <ContextMenuRadioItem value="rtl">Right to left</ContextMenuRadioItem>
            <ContextMenuRadioItem value="ltr">Left to right</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  )
}

function Disabled() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className={area}>Right-click a page</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Bookmark</ContextMenuItem>
        <ContextMenuItem disabled>Print (soon)</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive">Delete page</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

export const examples: Example[] = [
  { fn: "Submenu", title: "With a sub-menu", description: "ContextMenuSubTrigger opens a second list with a brush chevron; here the download formats.", Component: Submenu },
  { fn: "ViewOptions", title: "Checkboxes and radios", description: "A checkbox row gets a brush check and a radio group an ink diamond; the state is kept in the page.", Component: ViewOptions },
  { fn: "Disabled", title: "Disabled and destructive", description: "disabled keeps a row in the list but blocks it; variant=\"destructive\" marks the risky row in accent.", Component: Disabled },
]

export function States() {
  return (
    <div className="space-y-6">
      <p className="text-sm">
        Frozen rows of the open menu: rest · highlighted · checked · radio · disabled · destructive · sub-menu.
      </p>
      <Tiles>
        <Tile label="rest" size="lg">
          <ContextMenuTwin className="w-full max-w-56">
            <ContextMenuTwinRow>Bookmark</ContextMenuTwinRow>
          </ContextMenuTwin>
        </Tile>
        <Tile label="highlighted" size="lg">
          <ContextMenuTwin className="w-full max-w-56">
            <ContextMenuTwinRow highlighted>Share</ContextMenuTwinRow>
          </ContextMenuTwin>
        </Tile>
        <Tile label="checked" size="lg">
          <ContextMenuTwin className="w-full max-w-56">
            <ContextMenuTwinRow checked>Furigana</ContextMenuTwinRow>
          </ContextMenuTwin>
        </Tile>
        <Tile label="radio" size="lg">
          <ContextMenuTwin className="w-full max-w-56">
            <ContextMenuTwinRow radio>Right to left</ContextMenuTwinRow>
          </ContextMenuTwin>
        </Tile>
        <Tile label="disabled" size="lg">
          <ContextMenuTwin className="w-full max-w-56">
            <ContextMenuTwinRow disabled>Print (soon)</ContextMenuTwinRow>
          </ContextMenuTwin>
        </Tile>
        <Tile label="destructive" size="lg">
          <ContextMenuTwin className="w-full max-w-56">
            <ContextMenuTwinRow destructive highlighted>
              Delete
            </ContextMenuTwinRow>
          </ContextMenuTwin>
        </Tile>
        <Tile label="sub-menu" size="lg">
          <ContextMenuTwin className="w-full max-w-56">
            <ContextMenuTwinRow sub>Download</ContextMenuTwinRow>
          </ContextMenuTwin>
        </Tile>
      </Tiles>
    </div>
  )
}

/** Live: right-click (or long-press) the box for the real menu. */
export function Thumb() {
  const [picked, setPicked] = useState("Right-click me")
  return (
    <ContextMenu>
      <ContextMenuTrigger className="grid h-24 w-44 place-items-center border-ink bg-background p-2 text-center font-letter text-sm uppercase hover-invert">
        {picked}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-40">
        <ContextMenuItem onSelect={() => setPicked("Bookmarked")}>Bookmark</ContextMenuItem>
        <ContextMenuItem onSelect={() => setPicked("Shared")}>Share</ContextMenuItem>
        <ContextMenuItem variant="destructive" onSelect={() => setPicked("Deleted")}>
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
