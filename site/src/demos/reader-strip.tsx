import { useState } from "react"
import { Tile, Tiles } from "../state-grid"
import { ReaderEnd, ReaderPage, ReaderStrip, type ReaderStripPage } from "@registry/manga/signature/reader-strip"
import { ReadingProgress } from "@registry/manga/signature/reading-progress"
import { artPage } from "../mapless"

/* A vertical strip cut from "Mapless", the showcase's series (AI-generated pictures, see public/art/CREDITS.md). */
const P1: ReaderStripPage = artPage("bridge-far")
const P2: ReaderStripPage = artPage("eraser-panel")
const P3: ReaderStripPage = artPage("suzu-shock")
const P4_FIXED: ReaderStripPage = artPage("spear-clash")
const P4_BROKEN: ReaderStripPage = { ...P4_FIXED, src: "data:image/png;base64,broken" }
const P5: ReaderStripPage = artPage("ink-drop")
const P6: ReaderStripPage = artPage("lighthouse-night")

const CHAPTER = [P1, P2, P3, P4_BROKEN, P5, P6]

export function Preview() {
  const [pages, setPages] = useState(CHAPTER)
  const [at, setAt] = useState({ ratio: 0, index: 0 })
  const [ended, setEnded] = useState(false)
  return (
    <div className="grid gap-4">
      <p className="max-w-prose text-sm">
        Scroll the page: the strip follows it. Page 4 fails on purpose; Retry loads it.
      </p>
      <ReaderStrip
        aria-label="Mapless, chapter 1"
        pages={pages}
        gap="md"
        onProgress={(ratio, index) => setAt({ ratio, index })}
        onEnd={() => setEnded(true)}
        onRetry={(i) => setPages((list) => list.map((p, j) => (j === i ? P4_FIXED : p)))}
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
        <ReaderPage page={small(P2)} index={1} count={6} status="loading" className="w-full max-w-44" />
      </Tile>
      <Tile label="page · error" size="lg">
        <ReaderPage page={small(P4_BROKEN)} index={3} count={6} status="error" className="w-full max-w-44" />
      </Tile>
      <Tile label="page · loaded" size="lg">
        <ReaderPage page={small(P2)} index={1} count={6} status="loaded" className="w-full max-w-44" />
      </Tile>
      <Tile label="end" size="lg">
        <ReaderEnd className="w-full max-w-56 py-6" />
      </Tile>
      <Tile label="gap · none (no frame)" size="lg">
        <div className="grid w-full max-w-44">
          <ReaderPage page={small(P2)} index={1} count={6} framed={false} status="loaded" />
          <ReaderPage page={small(P2)} index={2} count={6} framed={false} status="loaded" />
        </div>
      </Tile>
    </Tiles>
  )
}

export function Thumb() {
  const wide = (p: ReaderStripPage): ReaderStripPage => ({ ...p, width: 480, height: 200 })
  return (
    <div aria-hidden className="grid w-36 gap-1.5">
      <ReaderPage page={wide(P2)} index={0} count={2} status="loaded" />
      <ReaderPage page={wide(P3)} index={1} count={2} status="loaded" />
    </div>
  )
}
