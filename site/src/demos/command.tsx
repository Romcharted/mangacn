import { useState } from "react"
import { Search } from "lucide-react"
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
  const [open, setOpen] = useState(false)
  return (
    <div className="flex w-full max-w-md flex-col items-start gap-6 pb-48">
      <Button onClick={() => setOpen(true)}>Open palette</Button>
      <CommandDialog open={open} onOpenChange={setOpen} title="Command palette">
        <Palette onPick={() => setOpen(false)} />
      </CommandDialog>
      <div className="w-full">
        <Palette />
      </div>
    </div>
  )
}

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
export function Thumb() {
  return (
    <div aria-hidden className="ink-case w-60 bg-background p-1 text-base">
      <div className="flex items-center gap-2 border-b-2 border-border px-2 py-2 italic">
        <Search aria-hidden className="size-4" /> Search…
      </div>
      <div className="grid gap-0.5 p-1 pt-1.5">
        <span className="ink-fill px-2 py-1.5">Chapter 12 — The rooftop</span>
        <span className="px-2 py-1.5">Bookmark this page</span>
      </div>
    </div>
  )
}
