import { useMemo, useState } from "react"
import { PageThumbnails } from "@registry/manga/signature/page-thumbnails"
import { Tile } from "../state-grid"
import { ForceInside } from "../force-inside"
import { chapterPages } from "./reader-art"
import type { Example } from "../registry"

export const previewWide = true

export function Preview() {
  const pages = useMemo(() => chapterPages(), [])
  const [page, setPage] = useState(1)
  const [order, setOrder] = useState<"rtl" | "ltr">("rtl")
  return (
    <div className="mx-auto grid w-full max-w-2xl gap-3">
      <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-sm">
        <span>Order:</span>
        {(["rtl", "ltr"] as const).map((o) => (
          <button
            key={o}
            type="button"
            aria-pressed={order === o}
            onClick={() => setOrder(o)}
            className="min-h-11 border-ink px-3 font-letter uppercase aria-pressed:ink-fill focus-ink sm:min-h-9"
          >
            {o === "rtl" ? "Manga RTL" : "Western LTR"}
          </button>
        ))}
        <span aria-live="polite">Reading page {page + 1}</span>
      </div>
      <PageThumbnails pages={pages} current={page} readUntil={page} direction={order} onSelect={setPage} />
    </div>
  )
}

function PickAPage() {
  const pages = useMemo(() => chapterPages().slice(0, 4), [])
  const [page, setPage] = useState(0)
  return (
    <div className="mx-auto grid w-full max-w-xl gap-3">
      <PageThumbnails pages={pages} current={page} readUntil={page} onSelect={setPage} direction="ltr" />
      <p aria-live="polite" className="text-center font-mono text-sm">
        Page {page + 1} of {pages.length}
      </p>
    </div>
  )
}

function Spread() {
  const pages = useMemo(() => chapterPages().slice(0, 4), [])
  return (
    <div className="mx-auto w-full max-w-xl">
      <PageThumbnails pages={pages} current={[1, 2]} readUntil={2} direction="ltr" />
    </div>
  )
}

function MangaOrder() {
  const pages = useMemo(() => chapterPages().slice(0, 4), [])
  return (
    <div className="mx-auto w-full max-w-xl">
      <PageThumbnails pages={pages} current={0} direction="rtl" />
    </div>
  )
}

export const examples: Example[] = [
  { fn: "PickAPage", title: "Pick a page", description: "A click on a thumbnail goes to that page; the reading mark follows.", Component: PickAPage },
  { fn: "Spread", title: "A spread on screen", description: "current can be a list: a spread shows two pages on screen at once.", Component: Spread },
  { fn: "MangaOrder", title: "Manga order", description: "direction=\"rtl\" lays the strip out right to left, as manga is read.", Component: MangaOrder },
]

export function States() {
  const pages = useMemo(() => chapterPages().slice(0, 3), [])
  const one = (extra: object, current?: number | number[], readUntil = 0) => (
    <div className="w-full max-w-xs">
      <PageThumbnails pages={pages} current={current} readUntil={readUntil} direction="ltr" {...extra} />
    </div>
  )
  return (
    <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
      <Tile label="rest · page 2 on screen · page 1 read" size="lg">{one({}, 1, 1)}</Tile>
      <Tile label="spread on screen (2 pages)" size="lg">{one({}, [1, 2], 1)}</Tile>
      <Tile label="manga order (right to left)" size="lg">
        <div className="w-full max-w-xs">
          <PageThumbnails pages={pages} current={0} direction="rtl" />
        </div>
      </Tile>
      {(["hover", "focus", "active"] as const).map((s) => (
        <Tile key={s} label={`thumbnail · ${s === "active" ? "pressed" : s}`}>
          <div className="w-24">
            <ForceInside state={s}>
              <PageThumbnails pages={pages.slice(0, 1)} minWidth="4rem" direction="ltr" />
            </ForceInside>
          </div>
        </Tile>
      ))}
    </div>
  )
}

/** Live: pick a page, the reading mark follows. */
export function Thumb() {
  const pages = useMemo(() => chapterPages(), [])
  const [page, setPage] = useState(1)
  return (
    <div className="w-32">
      <PageThumbnails pages={pages} current={page} readUntil={page} onSelect={setPage} minWidth="2rem" direction="ltr" className="[&_ol]:gap-1 [&_span.mt-1]:hidden" />
    </div>
  )
}
