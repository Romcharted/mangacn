import { useMemo, useState } from "react"
import { GuidedView, type GuidedImagePage } from "@registry/manga/signature/guided-view"
import { ChapterEnd } from "@registry/manga/signature/chapter-end"
import { Button } from "@registry/manga/ui/button"
import { Tile } from "../state-grid"
import { ForceInside } from "../force-inside"
import { chapterPages } from "./reader-art"
import { JSON_CHAPTER } from "./reader-json"
import type { Example } from "../registry"

export const previewWide = true

/** Scans with their panel boxes, measured by hand in percent of the page. */
function scans(): GuidedImagePage[] {
  return chapterPages().map((p) => ({ ...p, panels: p.panels.map(({ alt, ...box }) => ({ ...box, label: alt })) }))
}

export function Preview() {
  const [source, setSource] = useState<"data" | "scans">("scans")
  const [order, setOrder] = useState<"rtl" | "ltr">("ltr")
  const scanPages = useMemo(() => scans(), [])
  const pages = source === "data" ? JSON_CHAPTER.map((page, i) => ({ page, alt: `Page ${i + 1}` })) : scanPages
  const choice = <V extends string>(value: V, current: V, set: (v: V) => void, text: string) => (
    <button
      type="button"
      aria-pressed={value === current}
      onClick={() => set(value)}
      className="min-h-11 border-ink px-3 font-letter text-sm uppercase aria-pressed:ink-fill focus-ink sm:min-h-9"
    >
      {text}
    </button>
  )
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {choice("data", source, setSource, "Page data")}
        {choice("scans", source, setSource, "Scans + boxes")}
        <span className="w-2" />
        {choice("ltr", order, setOrder, "Western LTR")}
        {choice("rtl", order, setOrder, "Manga RTL")}
      </div>
      {/* made for phones: the demo keeps a phone's width */}
      <div className="mx-auto w-full max-w-sm">
        <GuidedView
          key={`${source}-${order}`}
          pages={pages}
          direction={order}
          className="h-[38rem]!"
          end={
            <ChapterEnd chapter="Chapter 1" next={{ number: 2, title: "The lighthouse keeper", date: "Dec 10" }}>
              <Button variant="outline">Back to the series</Button>
            </ChapterEnd>
          }
        />
      </div>
    </div>
  )
}

function Frozen(props: Partial<React.ComponentProps<typeof GuidedView>>) {
  const pages = JSON_CHAPTER.map((page) => ({ page }))
  return <GuidedView pages={pages} direction="ltr" className="h-[30rem]! min-h-0!" {...props} />
}

export function States() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <Tile label="first panel · the rest under the veil" size="full">
        <div className="w-full max-w-xs">
          <Frozen />
        </div>
      </Tile>
      <Tile label="a speech panel (page 2, panel 1)" size="full">
        <div className="w-full max-w-xs">
          <Frozen defaultPosition={{ page: 1, panel: 0 }} />
        </div>
      </Tile>
      <Tile label="a jagged panel, manga order" size="full">
        <div className="w-full max-w-xs">
          <Frozen direction="rtl" defaultPosition={{ page: 1, panel: 2 }} />
        </div>
      </Tile>
      <Tile label="whole page · current panel framed" size="full">
        <div className="w-full max-w-xs">
          <OverviewOn />
        </div>
      </Tile>
      <Tile label="page edge · hover" size="full">
        <div className="w-full max-w-xs">
          <ForceInside state="hover" selector="[data-slot=guided-view-edge]">
            <Frozen defaultPosition={{ page: 0, panel: 1 }} />
          </ForceInside>
        </div>
      </Tile>
      <Tile label="scans with panel boxes" size="full">
        <div className="w-full max-w-xs">
          <GuidedView pages={scans()} direction="ltr" defaultPosition={{ page: 1, panel: 2 }} className="h-[30rem]! min-h-0!" />
        </div>
      </Tile>
    </div>
  )
}

/** The whole-page view, opened once on mount. */
function OverviewOn() {
  return (
    <div
      ref={(el) => {
        const b = el?.querySelector<HTMLButtonElement>("[data-slot=guided-view-toolbar] [aria-pressed=false]")
        if (b && !el?.dataset.opened) {
          el!.dataset.opened = "1"
          requestAnimationFrame(() => b.click())
        }
      }}
    >
      <Frozen defaultPosition={{ page: 0, panel: 1 }} />
    </div>
  )
}

function MangaOrder() {
  const pages = useMemo(() => scans(), [])
  return (
    <div className="mx-auto w-full max-w-sm">
      <GuidedView pages={pages} direction="rtl" className="h-[30rem]!" />
    </div>
  )
}

function StartOnPanel() {
  const pages = useMemo(() => scans(), [])
  return (
    <div className="mx-auto w-full max-w-sm">
      <GuidedView pages={pages} direction="ltr" defaultPosition={{ page: 1, panel: 2 }} className="h-[30rem]!" />
    </div>
  )
}

function PageData() {
  const pages = useMemo(() => JSON_CHAPTER.map((page) => ({ page })), [])
  return (
    <div className="mx-auto w-full max-w-sm">
      <GuidedView pages={pages} direction="ltr" className="h-[30rem]!" />
    </div>
  )
}

export const examples: Example[] = [
  { fn: "MangaOrder", title: "Manga order", description: "direction=\"rtl\" moves from panel to panel right to left, as manga is read.", Component: MangaOrder, wide: true },
  { fn: "StartOnPanel", title: "Starting on a panel", description: "defaultPosition opens the chapter on a given page and panel: here the third panel of page 2.", Component: StartOnPanel, wide: true },
  { fn: "PageData", title: "Pages from data", description: "The pages come from data, not scans: each one is drawn from its JSON.", Component: PageData, wide: true },
]

/** Live: the scans, panel by panel; tap the page edges or use the arrow keys. */
export function Thumb() {
  const pages = useMemo(() => scans().slice(1), [])
  return (
    <div className="w-64 [zoom:0.5]">
      <GuidedView pages={pages} direction="ltr" className="h-[16.5rem]! min-h-0!" />
    </div>
  )
}
