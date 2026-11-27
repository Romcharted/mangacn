import { useState } from "react"
import { Button } from "@registry/manga/ui/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@registry/manga/ui/command"
import type { Example } from "../registry"
import { force, Tile, Tiles } from "../state-grid"

function Palette({ onPick }: { onPick?: () => void }) {
  return (
    <Command>
      <CommandInput placeholder="Search chapters and actions…" />
      <CommandList>
        <CommandEmpty>No page matches.</CommandEmpty>
        <CommandGroup heading="Read">
          <CommandItem value="chapter-12" onSelect={onPick}>
            Chapter 12 — The rooftop
            <CommandShortcut>1</CommandShortcut>
          </CommandItem>
          <CommandItem value="chapter-13" onSelect={onPick}>
            Chapter 13 — Rain
            <CommandShortcut>2</CommandShortcut>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem value="bookmark" onSelect={onPick}>
            Bookmark this page
            <CommandShortcut>B</CommandShortcut>
          </CommandItem>
          <CommandItem value="reading-order" onSelect={onPick}>
            Switch reading order
            <CommandShortcut>R</CommandShortcut>
          </CommandItem>
          <CommandItem value="vol-4" disabled>
            Vol. 4 — Coming soon
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}

export function Preview() {
  return (
    <div className="w-80">
      <Palette />
    </div>
  )
}

function InDialog() {
  const [open, setOpen] = useState(false)
  return (
    <div className="flex justify-center">
      <Button onClick={() => setOpen(true)}>Open palette</Button>
      <CommandDialog open={open} onOpenChange={setOpen} title="Command palette">
        <Palette onPick={() => setOpen(false)} />
      </CommandDialog>
    </div>
  )
}

function LiveSearch() {
  const [query, setQuery] = useState("")
  return (
    <div className="w-80">
      <Command>
        <CommandInput placeholder="Type “rain” or “bridge”…" value={query} onValueChange={setQuery} />
        <CommandList>
          <CommandEmpty>No page matches.</CommandEmpty>
          <CommandGroup heading="Chapters">
            <CommandItem value="chapter-12 the rooftop">Chapter 12 — The rooftop</CommandItem>
            <CommandItem value="chapter-13 rain">Chapter 13 — Rain</CommandItem>
            <CommandItem value="chapter-14 the bridge">Chapter 14 — The bridge</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  )
}

function Shortcuts() {
  return (
    <div className="w-80">
      <Command>
        <CommandList>
          <CommandGroup heading="Keys">
            <CommandItem value="next-page">
              Next page
              <CommandShortcut>→</CommandShortcut>
            </CommandItem>
            <CommandItem value="previous-page">
              Previous page
              <CommandShortcut>←</CommandShortcut>
            </CommandItem>
            <CommandItem value="bookmark">
              Bookmark this page
              <CommandShortcut>B</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  )
}

export const examples: Example[] = [
  { fn: "InDialog", title: "In a dialog", description: "CommandDialog opens the same palette over the page; picking an item closes it.", Component: InDialog },
  { fn: "LiveSearch", title: "Live search", description: "Type to filter the list; the empty state appears when nothing matches.", Component: LiveSearch },
  { fn: "Shortcuts", title: "With shortcuts", description: "CommandShortcut sets a key hint at the end of an item, in mono lettering.", Component: Shortcuts },
]

/** A row that looks like the list item in a given state, for frozen tiles. */
function Row({ children, state }: { children: React.ReactNode; state?: "highlighted" | "checked" | "disabled" }) {
  return (
    <div
      data-selected={state === "highlighted" ? "true" : undefined}
      className={
        "relative flex items-center gap-3 py-1.5 ps-2 pe-9 text-base " +
        (state === "highlighted" ? "bg-foreground text-background " : "") +
        (state === "disabled" ? "cursor-not-allowed underline decoration-dashed decoration-2 underline-offset-4 " : "")
      }
    >
      {children}
      {state === "checked" && <span aria-hidden className="absolute end-2 top-1/2 -translate-y-1/2 mark-check text-lg" />}
    </div>
  )
}

export function States() {
  return (
    <Tiles>
      <Tile label="input · rest" size="lg">
        <div className="w-full">
          <Command>
            <CommandInput placeholder="Search…" />
          </Command>
        </div>
      </Tile>
      <Tile label="input · typed" size="lg">
        <div className="w-full">
          <Command>
            <CommandInput value="rain" onValueChange={() => {}} />
          </Command>
        </div>
      </Tile>
      <Tile label="list · highlighted, checked, disabled, shortcut" size="lg">
        <div className="relative w-full p-1 ink-case case-notch" data-side="bottom">
          <div className="px-2 pt-1.5 pb-1 font-letter text-sm tracking-wide uppercase underline decoration-2 underline-offset-4">Read</div>
          <Row>
            Chapter 12 — The rooftop
            <span className="ms-auto border-[length:var(--mg-bw-fine)] border-current px-1.5 py-px font-mono text-xs tracking-widest">1</span>
          </Row>
          <Row state="highlighted">
            Chapter 13 — Rain
            <span className="ms-auto border-[length:var(--mg-bw-fine)] border-current px-1.5 py-px font-mono text-xs tracking-widest">2</span>
          </Row>
          <Row state="checked">Chapter 14 — Harbour</Row>
          <div className="-mx-1 my-1 h-px bg-border" />
          <Row state="disabled">Vol. 4 — Coming soon</Row>
        </div>
      </Tile>
      <Tile label="empty" size="lg">
        <div className="relative w-full ink-case p-1">
          <Command>
            <CommandList>
              <CommandEmpty>No page matches.</CommandEmpty>
            </CommandList>
          </Command>
        </div>
      </Tile>
      <Tile label="dialog trigger · hover">
        <Button {...force("hover")}>Open palette</Button>
      </Tile>
      <Tile label="dialog trigger · focus">
        <Button {...force("focus")}>Open palette</Button>
      </Tile>
    </Tiles>
  )
}

// A still drawing of the palette, not a live <Command>: cmdk scrolls its selected item into view when it
// mounts, which drags the whole gallery page down to this card.
/** Live: type to filter, hover or arrow keys to pick. */
/** Thumbnail: a readable detail at real size, cropped. */
export function Thumb() {
  return (
    <Command className="ink-case w-60 text-base">
      <CommandInput placeholder="Search…" />
      <CommandList className="max-h-14">
        <CommandEmpty>No result.</CommandEmpty>
        <CommandItem>Chapter 1 — The ink bridge</CommandItem>
        <CommandItem>Open the map</CommandItem>
      </CommandList>
    </Command>
  )
}
