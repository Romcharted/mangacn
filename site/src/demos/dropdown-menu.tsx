import { useState } from "react"
import { buttonClassName } from "@registry/manga/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@registry/manga/ui/dropdown-menu"
import type { Example } from "../registry"
import { force, Tile, Tiles } from "../state-grid"

const trigger = `${buttonClassName({ variant: "outline" })} min-h-11 sm:min-h-8`

export function Preview() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={trigger}>Chapter 12</DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Chapter</DropdownMenuLabel>
          <DropdownMenuItem>
            Bookmark <DropdownMenuShortcut>B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Share <DropdownMenuShortcut>S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function Submenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={trigger}>Save</DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Chapter</DropdownMenuLabel>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Download</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>As PDF</DropdownMenuItem>
              <DropdownMenuItem>As images</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function ViewOptions() {
  const [furigana, setFurigana] = useState(true)
  const [order, setOrder] = useState("rtl")
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={trigger}>View</DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuGroup>
          <DropdownMenuLabel>View</DropdownMenuLabel>
          <DropdownMenuCheckboxItem checked={furigana} onCheckedChange={setFurigana}>
            Furigana
          </DropdownMenuCheckboxItem>
          <DropdownMenuRadioGroup value={order} onValueChange={setOrder}>
            <DropdownMenuRadioItem value="rtl">Right to left</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="ltr">Left to right</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function Disabled() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={trigger}>Page 14</DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem>Bookmark</DropdownMenuItem>
        <DropdownMenuItem disabled>Print (soon)</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">Delete page</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const examples: Example[] = [
  { fn: "Submenu", title: "With a sub-menu", description: "DropdownMenuSubTrigger opens a second list with a brush chevron; here the download formats.", Component: Submenu },
  { fn: "ViewOptions", title: "Checkboxes and radios", description: "A checkbox row gets a brush check and a radio group an ink diamond; the state is kept in the page.", Component: ViewOptions },
  { fn: "Disabled", title: "Disabled and destructive", description: "disabled keeps a row in the list but blocks it; variant=\"destructive\" marks the risky row in accent.", Component: Disabled },
]

function Trigger({ state }: { state?: "hover" | "focus" }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={trigger} {...force(state ?? "")}>
        Chapter 12
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem>Bookmark</DropdownMenuItem>
        <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function States() {
  return (
    <Tiles>
      <Tile label="trigger · rest" size="lg">
        <Trigger />
      </Tile>
      <Tile label="trigger · hover" size="lg">
        <Trigger state="hover" />
      </Tile>
      <Tile label="trigger · focus" size="lg">
        <Trigger state="focus" />
      </Tile>
    </Tiles>
  )
}

export function Thumb() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={buttonClassName({ size: "sm", variant: "outline" })}>Menu</DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem>Bookmark</DropdownMenuItem>
        <DropdownMenuItem>Share</DropdownMenuItem>
        <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
