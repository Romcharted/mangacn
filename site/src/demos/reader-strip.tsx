import { useState } from "react"
import { Tile, Tiles } from "../state-grid"
import { ReaderEnd, ReaderPage, ReaderStrip, type ReaderStripPage } from "@registry/manga/signature/reader-strip"
import { ReadingProgress } from "@registry/manga/signature/reading-progress"
import { artPage } from "../mapless"

/* Whole pages of "Mapless", the showcase's series (AI-generated pictures, see public/art/CREDITS.md): the cover of
   volume 1, the bridge page and the lighthouse page, all shown at the same width. The chapter is read twice to
   make six pages; page 5 fails on purpose and keeps the size of a normal page. */
const COVER: ReaderStripPage = artPage("cover-1")
const BRIDGE: ReaderStripPage = artPage("page-1-bridge")
const LIGHTHOUSE: ReaderStripPage = artPage("page-2-lighthouse")
const BROKEN: ReaderStripPage = { ...BRIDGE, src: "data:image/png;base64,broken", srcSet: undefined }
const BROKEN_AT = 4

const CHAPTER = [COVER, BRIDGE, LIGHTHOUSE, COVER, BROKEN, LIGHTHOUSE]

export function Preview() {
  const [pages, setPages] = useState(CHAPTER)
  const [at, setAt] = useState({ ratio: 0, index: 0 })
  const [ended, setEnded] = useState(false)
  return (
    <div className="grid gap-4">
      <p className="max-w-prose text-sm">
        Scroll the page: the strip follows it. Page 5 fails on purpose; Retry loads it.
      </p>
      <ReaderStrip
        aria-label="Mapless, chapter 1"
        pages={pages}
        gap="md"
        onProgress={(ratio, index) => setAt({ ratio, index })}
        onEnd={() => setEnded(true)}
        onRetry={(i) => setPages((list) => list.map((p, j) => (j === i && i === BROKEN_AT ? BRIDGE : p)))}
      />
      <div className="sticky bottom-3 z-10 max-md:bottom-[4.25rem] mx-auto grid w-full max-w-[30rem] gap-1 border-ink bg-background px-3 py-2">
        <span className="font-letter text-sm tracking-wide uppercase">{ended ? "Chapter read" : "Mapless · ch. 1"}</span>
        <ReadingProgress
          value={Math.round(at.ratio * 100)}
          label="Chapter progress"
          showValue
          valueText={`Page ${at.index + 1} / ${pages.length}`}
        />
      </div>
    </div>
  )
}

const small = (p: ReaderStripPage): ReaderStripPage => ({ ...p, width: 180, height: Math.round((180 * p.height) / p.width) })

export function States() {
  return (
    <Tiles>
      <Tile label="page · loading" size="lg">
        <ReaderPage page={small(BRIDGE)} index={1} count={6} status="loading" className="w-full max-w-44" />
      </Tile>
      <Tile label="page · error" size="lg">
        <ReaderPage page={small(BROKEN)} index={4} count={6} status="error" className="w-full max-w-44" />
      </Tile>
      <Tile label="page · loaded" size="lg">
        <ReaderPage page={small(BRIDGE)} index={1} count={6} status="loaded" className="w-full max-w-44" />
      </Tile>
      <Tile label="end" size="lg">
        <ReaderEnd className="w-full max-w-56 py-6" />
      </Tile>
      <Tile label="gap · none (no frame)" size="lg">
        <div className="grid w-full max-w-44">
          <ReaderPage page={small(BRIDGE)} index={1} count={6} framed={false} status="loaded" />
          <ReaderPage page={small(BRIDGE)} index={2} count={6} framed={false} status="loaded" />
        </div>
      </Tile>
    </Tiles>
  )
}

/** Live: scroll the strip inside its frame. */
export function Thumb() {
  return (
    <div className="h-32 w-40 overflow-y-auto overscroll-contain">
      <ReaderStrip aria-label="Mapless, chapter 1" pages={[COVER, BRIDGE, LIGHTHOUSE]} gap="sm" />
    </div>
  )
}
