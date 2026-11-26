import { useState } from "react"
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
  MenubarTwin,
  MenubarTwinRow,
  MenubarTriggerTwin,
} from "@registry/manga/ui/menubar"
import { Tile, Tiles, force } from "../state-grid"

export function Preview() {
  const [furigana, setFurigana] = useState(true)
  const [order, setOrder] = useState("rtl")
  const [pages, setPages] = useState(true)
  return (
    <div className="pb-72">
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              New volume <MenubarShortcut>N</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Open… <MenubarShortcut>O</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarSub>
              <MenubarSubTrigger>Export</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem>As PDF</MenubarItem>
                <MenubarItem>As images</MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
            <MenubarSeparator />
            <MenubarItem variant="destructive">Close volume</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <MenubarCheckboxItem checked={furigana} onCheckedChange={setFurigana}>
              Furigana
            </MenubarCheckboxItem>
            <MenubarCheckboxItem checked={pages} onCheckedChange={setPages}>
              Page numbers
            </MenubarCheckboxItem>
            <MenubarSeparator />
            <MenubarRadioGroup value={order} onValueChange={setOrder}>
              <MenubarRadioItem value="rtl">Right to left</MenubarRadioItem>
              <MenubarRadioItem value="ltr">Left to right</MenubarRadioItem>
            </MenubarRadioGroup>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Bookmarks</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              Add this page <MenubarShortcut>B</MenubarShortcut>
            </MenubarItem>
            <MenubarItem disabled>Clear all (soon)</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Help</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Reading keys</MenubarItem>
            <MenubarItem>About</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  )
}

export function States() {
  return (
    <div className="space-y-6">
      <p className="text-sm">Triggers: rest · hover · focus · open. Menu rows: the same recipe as the dropdown.</p>
      <Tiles>
        <Tile label="trigger · rest" size="lg">
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger>View</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>Spread</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </Tile>
        <Tile label="trigger · hover" size="lg">
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger {...force("hover")}>View</MenubarTrigger>
            </MenubarMenu>
          </Menubar>
        </Tile>
        <Tile label="trigger · focus" size="lg">
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger {...force("focus")}>View</MenubarTrigger>
            </MenubarMenu>
          </Menubar>
        </Tile>
        <Tile label="trigger · open" size="lg">
          <Menubar>
            <MenubarTriggerTwin>View</MenubarTriggerTwin>
          </Menubar>
        </Tile>
      </Tiles>
      <Tiles>
        <Tile label="row · rest" size="lg">
          <MenubarTwin className="w-full max-w-56">
            <MenubarTwinRow>Furigana</MenubarTwinRow>
          </MenubarTwin>
        </Tile>
        <Tile label="row · highlighted" size="lg">
          <MenubarTwin className="w-full max-w-56">
            <MenubarTwinRow highlighted>Share</MenubarTwinRow>
          </MenubarTwin>
        </Tile>
        <Tile label="row · checked" size="lg">
          <MenubarTwin className="w-full max-w-56">
            <MenubarTwinRow checked>Page numbers</MenubarTwinRow>
          </MenubarTwin>
        </Tile>
        <Tile label="row · radio" size="lg">
          <MenubarTwin className="w-full max-w-56">
            <MenubarTwinRow radio>Right to left</MenubarTwinRow>
          </MenubarTwin>
        </Tile>
        <Tile label="row · disabled" size="lg">
          <MenubarTwin className="w-full max-w-56">
            <MenubarTwinRow disabled>Clear all (soon)</MenubarTwinRow>
          </MenubarTwin>
        </Tile>
        <Tile label="row · destructive" size="lg">
          <MenubarTwin className="w-full max-w-56">
            <MenubarTwinRow destructive highlighted>
              Close volume
            </MenubarTwinRow>
          </MenubarTwin>
        </Tile>
        <Tile label="row · sub-menu" size="lg">
          <MenubarTwin className="w-full max-w-56">
            <MenubarTwinRow sub>Export</MenubarTwinRow>
          </MenubarTwin>
        </Tile>
      </Tiles>
    </div>
  )
}

export function Thumb() {
  return (
    <div className="w-full">
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>New page</MenubarItem>
            <MenubarItem>Export</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Help</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Shortcuts</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  )
}
