import { useState } from "react"

import { NativeSelect, NativeSelectOptGroup, NativeSelectOption } from "@registry/manga/ui/native-select"
import type { Example } from "../registry"
import { force, Tile, Tiles } from "../state-grid"

function Chapters({ size, ...props }: React.ComponentProps<typeof NativeSelect>) {
  return (
    <NativeSelect size={size} defaultValue="" {...props}>
      <NativeSelectOption value="" disabled>
        Pick a chapter
      </NativeSelectOption>
      <NativeSelectOption value="1">Ch. 1 — First ink</NativeSelectOption>
      <NativeSelectOption value="2">Ch. 2 — The rooftop</NativeSelectOption>
      <NativeSelectOption value="3">Ch. 3 — Deadline</NativeSelectOption>
    </NativeSelect>
  )
}

export function Preview() {
  return (
    <label className="grid w-72 gap-1.5">
      <span className="font-letter text-sm tracking-wide uppercase">Reading order</span>
      <NativeSelect className="w-full" defaultValue="rtl">
        <NativeSelectOption value="rtl">Right to left (manga)</NativeSelectOption>
        <NativeSelectOption value="ltr">Left to right (comics)</NativeSelectOption>
        <NativeSelectOption value="strip">Vertical strip (webtoon)</NativeSelectOption>
      </NativeSelect>
    </label>
  )
}

function Groups() {
  return (
    <label className="grid w-72 gap-1.5">
      <span className="font-letter text-sm tracking-wide uppercase">Jump to</span>
      <NativeSelect className="w-full" defaultValue="v2-8">
        <NativeSelectOptGroup label="Volume 1">
          <NativeSelectOption value="v1-1">Ch. 1 — First ink</NativeSelectOption>
          <NativeSelectOption value="v1-2">Ch. 2 — The rooftop</NativeSelectOption>
        </NativeSelectOptGroup>
        <NativeSelectOptGroup label="Volume 2">
          <NativeSelectOption value="v2-8">Ch. 8 — Night shift</NativeSelectOption>
          <NativeSelectOption value="v2-9" disabled>
            Ch. 9 — Coming soon
          </NativeSelectOption>
        </NativeSelectOptGroup>
      </NativeSelect>
    </label>
  )
}

function Sizes() {
  return (
    <div className="grid w-72 gap-4">
      <NativeSelect size="sm" defaultValue="2" aria-label="Small">
        <NativeSelectOption value="1">One page</NativeSelectOption>
        <NativeSelectOption value="2">Spread</NativeSelectOption>
      </NativeSelect>
      <NativeSelect defaultValue="2" aria-label="Default">
        <NativeSelectOption value="1">One page</NativeSelectOption>
        <NativeSelectOption value="2">Spread</NativeSelectOption>
      </NativeSelect>
    </div>
  )
}

function Controlled() {
  const [order, setOrder] = useState("rtl")
  return (
    <div className="grid w-72 gap-3">
      <NativeSelect className="w-full" value={order} onChange={(e) => setOrder(e.target.value)} aria-label="Reading order">
        <NativeSelectOption value="rtl">Right to left (manga)</NativeSelectOption>
        <NativeSelectOption value="ltr">Left to right (comics)</NativeSelectOption>
        <NativeSelectOption value="strip">Vertical strip (webtoon)</NativeSelectOption>
      </NativeSelect>
      <p aria-live="polite" className="font-mono text-sm">
        Reading: {order}
      </p>
    </div>
  )
}

function Invalid() {
  return (
    <div className="w-72">
      <NativeSelect className="w-full" defaultValue="" aria-invalid aria-label="Chapter">
        <NativeSelectOption value="" disabled>
          Pick a chapter
        </NativeSelectOption>
        <NativeSelectOption value="1">Ch. 1 — First ink</NativeSelectOption>
      </NativeSelect>
    </div>
  )
}

export const examples: Example[] = [
  { fn: "Groups", title: "Groups and disabled options", description: "NativeSelectOptGroup labels a set of options; a disabled option stays visible but cannot be picked.", Component: Groups },
  { fn: "Sizes", title: "Sizes", description: "size sm gives the short field, the default one is taller; both keep the browser's own popup.", Component: Sizes },
  { fn: "Controlled", title: "Controlled value", description: "value and onChange keep the choice in React state, and the line below follows it.", Component: Controlled },
  { fn: "Invalid", title: "Invalid", description: "aria-invalid gives the error look: an accent line, a mark and a serrated edge.", Component: Invalid },
]

export function States() {
  return (
    <Tiles>
      <Tile label="default · rest">
        <Chapters aria-label="Rest" />
      </Tile>
      <Tile label="default · hover">
        <Chapters aria-label="Hover" {...force("hover")} />
      </Tile>
      <Tile label="default · focus">
        <Chapters aria-label="Focus" {...force("focus")} />
      </Tile>
      <Tile label="default · error">
        <Chapters aria-label="Error" aria-invalid />
      </Tile>
      <Tile label="default · disabled">
        <Chapters aria-label="Disabled" disabled />
      </Tile>
      <Tile label="sm · rest">
        <Chapters aria-label="Small" size="sm" />
      </Tile>
      <Tile label="sm · hover">
        <Chapters aria-label="Small hover" size="sm" {...force("hover")} />
      </Tile>
      <Tile label="sm · focus">
        <Chapters aria-label="Small focus" size="sm" {...force("focus")} />
      </Tile>
      <Tile label="sm · error">
        <Chapters aria-label="Small error" size="sm" aria-invalid />
      </Tile>
      <Tile label="sm · disabled">
        <Chapters aria-label="Small disabled" size="sm" disabled />
      </Tile>
    </Tiles>
  )
}

export function Thumb() {
  return (
    <div>
      <NativeSelect defaultValue="rtl" className="w-52">
        <NativeSelectOption value="rtl">Right to left</NativeSelectOption>
        <NativeSelectOption value="ltr">Left to right</NativeSelectOption>
        <NativeSelectOption value="ttb">Top to bottom</NativeSelectOption>
      </NativeSelect>
    </div>
  )
}
