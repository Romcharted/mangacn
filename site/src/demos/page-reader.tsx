import { useMemo, useState } from "react"
import { LayoutGrid, Settings2 } from "lucide-react"
import { PageReader } from "@registry/manga/signature/page-reader"
import { PageThumbnails } from "@registry/manga/signature/page-thumbnails"
import { ReaderSettings, defaultReaderSettings, type ReaderSettingsValue } from "@registry/manga/signature/reader-settings"
import { ChapterEnd } from "@registry/manga/signature/chapter-end"
import { ReaderStrip } from "@registry/manga/signature/reader-strip"
import { Button } from "@registry/manga/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@registry/manga/ui/sheet"
import { Tile } from "../state-grid"
import { ForceInside } from "../force-inside"
import { chapterPages } from "./reader-art"

/** The live reader: settings and all pages in sheets, a chapter end card after the last page. */
export function Preview() {
  const pages = useMemo(() => chapterPages(4), [])
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
      {settings.mode === "strip" ? (
        <div className="grid gap-3">
          <div className="flex justify-end gap-1">{tools}</div>
          <div className="h-[36rem] overflow-y-auto border-ink-panel p-3">
            <ReaderStrip pages={pages} gap="sm" />
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
            <ChapterEnd chapter="Chapter 4 · The night market" next={{ number: 5, title: "Paper boats", onSelect: () => setPage(0) }}>
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
  const pages = useMemo(() => chapterPages(2), [])
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
            <Frozen spread="single" background="tone" defaultPage={7} />
          </div>
        </Tile>
        <Tile label="end view · chapter end card" size="full">
          <div className="w-full max-w-md">
            <Frozen
              spread="single"
              defaultPage={8}
              end={<ChapterEnd chapter="Chapter 2" next={{ number: 3, title: "Paper boats", date: "Dec 3" }} />}
            />
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

export function Thumb() {
  const pages = chapterPages(1)
  return (
    <div className="flex w-28 justify-center border-ink-panel bg-background p-1.5">
      <img src={pages[1].src} alt="" className="block w-12 border-ink" />
      <img src={pages[2].src} alt="" className="block w-12 border-ink" />
    </div>
  )
}
