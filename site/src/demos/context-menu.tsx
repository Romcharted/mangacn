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
import { Tile, Tiles } from "../state-grid"

/* The trigger area: a 2px panel (solid line: dashes would mean disabled). */
const area =
  "grid min-h-44 w-full place-items-center border-ink bg-background p-6 text-center text-sm select-none"

export function Preview() {
  const [furigana, setFurigana] = useState(true)
  const [order, setOrder] = useState("rtl")
  return (
    <div className="pb-72">
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
            <ContextMenuSub>
              <ContextMenuSubTrigger>Download</ContextMenuSubTrigger>
              <ContextMenuSubContent>
                <ContextMenuItem>As PDF</ContextMenuItem>
                <ContextMenuItem>As images</ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuSub>
          </ContextMenuGroup>
          <ContextMenuSeparator />
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
          <ContextMenuSeparator />
          <ContextMenuItem disabled>Print (soon)</ContextMenuItem>
          <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  )
}

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

export function Thumb() {
  return (
    <div className="pointer-events-none w-full">
      <ContextMenuTwin className="w-40">
        <ContextMenuTwinRow>Bookmark</ContextMenuTwinRow>
        <ContextMenuTwinRow highlighted>Share</ContextMenuTwinRow>
        <ContextMenuTwinRow destructive>Delete</ContextMenuTwinRow>
      </ContextMenuTwin>
    </div>
  )
}
