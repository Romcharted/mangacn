import { useMemo, useState } from "react"
import { PageThumbnails } from "@registry/manga/signature/page-thumbnails"
import { Tile } from "../state-grid"
import { ForceInside } from "../force-inside"
import { chapterPages } from "./reader-art"

export function Preview() {
  const pages = useMemo(() => chapterPages(3), [])
  const [page, setPage] = useState(3)
  const [order, setOrder] = useState<"rtl" | "ltr">("rtl")
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center gap-2 font-mono text-sm">
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
        <span className="ms-auto" aria-live="polite">
          Reading page {page + 1}
        </span>
      </div>
      <div className="max-w-2xl">
        <PageThumbnails pages={pages} current={page} readUntil={page} direction={order} onSelect={setPage} />
      </div>
    </div>
  )
}

export function States() {
  const pages = useMemo(() => chapterPages(3).slice(0, 3), [])
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

export function Thumb() {
  const pages = chapterPages(3).slice(0, 6)
  return (
    <div className="w-28">
      <PageThumbnails pages={pages} current={2} readUntil={2} minWidth="1.5rem" className="pointer-events-none [&_ol]:gap-1 [&_span.mt-1]:hidden" tabIndex={-1} />
    </div>
  )
}
