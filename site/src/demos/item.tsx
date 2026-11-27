import { useState, type ReactNode } from "react"
import { BookOpen, ChevronRight, Lock } from "lucide-react"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@registry/manga/ui/item"
import type { Example } from "../registry"
import { force, Tile } from "../state-grid"

/** A row that is a link in the demo: it never navigates. 44px tall on phones. */
function Row({ children }: { children: ReactNode }) {
  return (
    <a href="#" className="block min-h-11 focus-ink sm:min-h-8">
      {children}
    </a>
  )
}

export function Preview() {
  return (
    <div className="w-80">
      <ItemGroup>
        <Row>
          <Item interactive>
            <ItemMedia>
              <BookOpen />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Vol. 1 · The long night</ItemTitle>
              <ItemDescription>Twelve chapters, two unread.</ItemDescription>
            </ItemContent>
            <ItemActions>
              <ChevronRight aria-hidden />
            </ItemActions>
          </Item>
        </Row>
        <ItemSeparator />
        <Row>
          <Item variant="outline" interactive>
            <ItemMedia>
              <BookOpen />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Vol. 2 · After the rain</ItemTitle>
              <ItemDescription>Read to chapter 4.</ItemDescription>
            </ItemContent>
            <ItemActions>
              <ChevronRight aria-hidden />
            </ItemActions>
          </Item>
        </Row>
        <ItemSeparator />
        <Item variant="muted">
          <ItemMedia>
            <Lock />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Vol. 3 · Harbour</ItemTitle>
            <ItemDescription>Unlocks on Friday.</ItemDescription>
          </ItemContent>
        </Item>
      </ItemGroup>
    </div>
  )
}

const variants = ["default", "outline", "muted"] as const
type Variant = (typeof variants)[number]

function Variants() {
  return (
    <div className="grid w-80 gap-2">
      {variants.map((v) => (
        <Item key={v} variant={v}>
          <ItemMedia>
            <BookOpen />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Vol. 1 · The long night</ItemTitle>
            <ItemDescription>{v === "default" ? "Frameless row." : v === "outline" ? "A 2px ink case." : "A fine line with a tone band."}</ItemDescription>
          </ItemContent>
        </Item>
      ))}
    </div>
  )
}

function Sizes() {
  return (
    <div className="grid w-80 gap-2">
      {(["default", "sm", "xs"] as const).map((size) => (
        <Item key={size} variant="outline" size={size}>
          <ItemMedia>
            <BookOpen />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Vol. 2 · After the rain</ItemTitle>
            <ItemDescription>size {size}: the padding and gap of the row.</ItemDescription>
          </ItemContent>
        </Item>
      ))}
    </div>
  )
}

function MarkRead() {
  const [read, setRead] = useState(false)
  const toggle = () => setRead((r) => !r)
  return (
    <div className="grid w-80 gap-2">
      <Item
        variant="outline"
        interactive
        role="button"
        tabIndex={0}
        aria-pressed={read}
        className="min-h-11 focus-ink sm:min-h-8"
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            toggle()
          }
        }}
      >
        <ItemMedia>
          <BookOpen />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{read ? "Vol. 2 · read" : "Vol. 2 · After the rain"}</ItemTitle>
          <ItemDescription>{read ? "Marked as read. Click to undo." : "Click the row to mark it read."}</ItemDescription>
        </ItemContent>
      </Item>
    </div>
  )
}

export const examples: Example[] = [
  { fn: "Variants", title: "Variants", description: "default is frameless, outline a 2px ink case, muted a fine line with a tone band for locked volumes.", Component: Variants },
  { fn: "Sizes", title: "Sizes", description: "size sets the padding of the row: default, sm or xs, for dense lists.", Component: Sizes },
  { fn: "MarkRead", title: "Marked as read", description: "interactive makes the row answer to hover and click; aria-pressed keeps the read state. Click or press Enter.", Component: MarkRead },
]

function Sample({ variant, state }: { variant: Variant; state: "rest" | "hover" | "focus" | "disabled" }) {
  const disabled = state === "disabled"
  return (
    <Item
      variant={variant}
      interactive={!disabled}
      className={[
        state === "focus" ? "focus-ink" : "",
        disabled ? "border-dashed! tone-frame [--frame-w:4px]" : "",
      ].join(" ")}
      {...(state === "hover" ? force("hover") : {})}
      {...(state === "focus" ? force("focus") : {})}
    >
      <ItemMedia>
        <BookOpen />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Vol. 1</ItemTitle>
        <ItemDescription>Twelve chapters.</ItemDescription>
      </ItemContent>
    </Item>
  )
}

export function States() {
  const states = ["rest", "hover", "focus", "disabled"] as const
  return (
    <div className="space-y-4">
      {variants.map((v) => (
        <div key={v} className="flex flex-wrap gap-2" role="group" aria-label={`variant ${v}`}>
          {states.map((s) => (
            <Tile key={s} label={`${v} · ${s}`} size="lg">
              <Sample variant={v} state={s} />
            </Tile>
          ))}
        </div>
      ))}
    </div>
  )
}

/** Live: the row lifts on hover; a click marks the volume read. */
export function Thumb() {
  const [read, setRead] = useState(false)
  return (
    <div className="w-56">
      <Item variant="outline" size="xs" interactive role="button" tabIndex={0} onClick={() => setRead((r) => !r)} aria-pressed={read}>
        <ItemMedia>
          <BookOpen />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{read ? "Vol. 2 · read" : "Vol. 2"}</ItemTitle>
        </ItemContent>
      </Item>
    </div>
  )
}
