import { useMemo, useState } from "react"
import { LayoutGrid, Settings2 } from "lucide-react"
import { PageReader, type PageReaderPage } from "@registry/manga/signature/page-reader"
import { Page } from "@registry/manga/signature/panel"
import { PageThumbnails } from "@registry/manga/signature/page-thumbnails"
import { ReaderSettings, defaultReaderSettings, type ReaderSettingsValue } from "@registry/manga/signature/reader-settings"
import { ChapterEnd } from "@registry/manga/signature/chapter-end"
import { ReaderStrip } from "@registry/manga/signature/reader-strip"
import { Button } from "@registry/manga/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@registry/manga/ui/sheet"
import { Tile } from "../state-grid"
import { ForceInside } from "../force-inside"
import { chapterPages } from "./reader-art"
import { JSON_CHAPTER } from "./reader-json"

/** The live reader: settings and all pages in sheets, a chapter end card after the last page. */
export function Preview() {
  const scans = useMemo(() => chapterPages(), [])
  const [source, setSource] = useState<"scans" | "data">("scans")
  const pages: PageReaderPage[] = source === "scans" ? scans : JSON_CHAPTER.map((page, i) => ({ page, alt: `Page ${i + 1}` }))
  const [page, setPage] = useState(0)
  const [settings, setSettings] = useState<ReaderSettingsValue>(defaultReaderSettings)
  const [sheet, setSheet] = useState<"pages" | "settings" | null>(null)
  const tools = (
    <>
      <Button variant="outline" size="icon" aria-label="All pages" onClick={() => setSheet("pages")} className="max-sm:size-11">
        <LayoutGrid />
      </Button>
      <Button variant="outline" size="icon" aria-label="Reader settings" onClick={() => setSheet("settings")} className="max-sm:size-11">
        <Settings2 />
      </Button>
    </>
  )
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap gap-2">
        {(["scans", "data"] as const).map((s) => (
          <button
            key={s}
            type="button"
            aria-pressed={source === s}
            onClick={() => {
              setSource(s)
              setPage(0)
            }}
            className="min-h-11 border-ink px-3 font-letter text-sm uppercase aria-pressed:ink-fill focus-ink sm:min-h-9"
          >
            {s === "scans" ? "Scans (images)" : "Page data (JSON)"}
          </button>
        ))}
      </div>
      {settings.mode === "strip" ? (
        <div className="grid gap-3">
          <div className="flex justify-end gap-1">{tools}</div>
          <div className="h-[36rem] overflow-y-auto border-ink-panel p-3">
            {source === "scans" ? (
              <ReaderStrip pages={scans} gap="sm" />
            ) : (
              <div className="mx-auto grid max-w-xl gap-3">
                {JSON_CHAPTER.map((p, i) => (
                  <Page key={i} page={p} reading={settings.direction} label={`Page ${i + 1}`} />
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <PageReader
          pages={pages}
          page={page}
          onPageChange={setPage}
          spread={settings.mode === "double" ? "double" : "single"}
          direction={settings.direction}
          fit={settings.fit}
          background={settings.background}
          toolbar={tools}
          end={
            <ChapterEnd chapter="Chapter 1 · The ink bridge" next={{ number: 2, title: "The lighthouse keeper", onSelect: () => setPage(0) }}>
              <Button variant="outline" onClick={() => setPage(0)}>
                Read again
              </Button>
            </ChapterEnd>
          }
        />
      )}
      <Sheet open={sheet !== null} onOpenChange={(o) => !o && setSheet(null)}>
        <SheetContent side="right" className="w-[min(24rem,100vw)] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{sheet === "pages" ? "All pages" : "Reader settings"}</SheetTitle>
            <SheetDescription>{sheet === "pages" ? "Jump to any page." : "Saved for this demo only."}</SheetDescription>
          </SheetHeader>
          <div className="px-4 pb-6">
            {sheet === "pages" ? (
              <PageThumbnails
                pages={pages}
                current={page}
                readUntil={page}
                direction={settings.direction}
                onSelect={(i) => {
                  setPage(i)
                  setSheet(null)
                }}
              />
            ) : (
              <ReaderSettings value={settings} onValueChange={setSettings} />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

/** Frozen readers: a fixed page, spread and background in a short stage. */
function Frozen(props: Partial<React.ComponentProps<typeof PageReader>>) {
  const pages = useMemo(() => chapterPages(), [])
  return <PageReader pages={pages} className="h-[26rem]! min-h-0!" {...props} />
}

export function States() {
  return (
    <div className="grid gap-3">
      <div className="grid gap-3 lg:grid-cols-2">
        <Tile label="single · manga order · first page" size="full">
          <div className="w-full max-w-md">
            <Frozen spread="single" />
          </div>
        </Tile>
        <Tile label="double · manga order · cover alone then a spread (page 2 on the right)" size="full">
          <div className="w-full">
            <Frozen spread="double" defaultPage={1} />
          </div>
        </Tile>
        <Tile label="double · western order (page 2 on the left)" size="full">
          <div className="w-full">
            <Frozen spread="double" direction="ltr" defaultPage={1} />
          </div>
        </Tile>
        <Tile label="background ink · fit width (scrolls down)" size="full">
          <div className="w-full max-w-md">
            <Frozen spread="single" background="ink" fit="width" defaultPage={2} />
          </div>
        </Tile>
        <Tile label="background tone · last page" size="full">
          <div className="w-full max-w-md">
            <Frozen spread="single" background="tone" defaultPage={2} />
          </div>
        </Tile>
        <Tile label="end view · chapter end card" size="full">
          <div className="w-full max-w-md">
            <Frozen
              spread="single"
              defaultPage={3}
              end={<ChapterEnd chapter="Chapter 1" next={{ number: 2, title: "The lighthouse keeper", date: "Dec 3" }} />}
            />
          </div>
        </Tile>
        <Tile label="page data (JSON) · a spread drawn by Page" size="full">
          <div className="w-full">
            <PageReader pages={JSON_CHAPTER.map((page) => ({ page }))} spread="double" coverAlone={false} direction="ltr" className="h-[26rem]! min-h-0!" />
          </div>
        </Tile>
        <Tile label="page edge · hover (paper plate, brush arrow)" size="full">
          <div className="w-full max-w-md">
            <ForceInside state="hover" selector="[data-slot=page-reader-edge]">
              <Frozen spread="single" defaultPage={1} />
            </ForceInside>
          </div>
        </Tile>
        <Tile label="page edge · pressed" size="full">
          <div className="w-full max-w-md">
            {/* a mouse press also hovers: both states at once (data-force takes a list) */}
            <ForceInside state={"hover active" as "active"} selector="[data-slot=page-reader-edge]">
              <Frozen spread="single" defaultPage={1} />
            </ForceInside>
          </div>
        </Tile>
      </div>
    </div>
  )
}

/** Live: a small reader; the page edges turn the pages. */
export function Thumb() {
  const pages = useMemo(() => chapterPages(), [])
  return (
    <div className="w-40">
      <PageReader pages={pages} spread="single" direction="ltr" className="h-32! min-h-0!" />
    </div>
  )
}
