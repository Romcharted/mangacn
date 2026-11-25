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

export function Preview() {
  const [furigana, setFurigana] = useState(true)
  const [order, setOrder] = useState("rtl")
  return (
    <div className="pb-96">
      <DropdownMenu>
        <DropdownMenuTrigger className={buttonClassName({ variant: "outline" })}>Chapter 12</DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Chapter</DropdownMenuLabel>
            <DropdownMenuItem>
              Bookmark <DropdownMenuShortcut>B</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              Share <DropdownMenuShortcut>S</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Download</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>As PDF</DropdownMenuItem>
                <DropdownMenuItem>As images</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
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
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled>Print (soon)</DropdownMenuItem>
          <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
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
