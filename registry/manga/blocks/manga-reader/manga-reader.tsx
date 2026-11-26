"use client"

/*
 * Manga Reader — a webtoon-style reader made only with mangacn: a top bar (series, chapter, a Full screen
 * toggle), the chapter list in a Sheet headed by a VolumeCard of the current volume (cover, status, chapters
 * read / out) — current chapter an ink flat, read ones with a brush check — a reading-order
 * switch (pressed buttons: Manga RTL / Western LTR, it sets data-reading on the root and flips the chapter
 * buttons), a ReadingProgress bar with the page counter, a ReaderStrip of the chapter's pages with its end
 * panel, previous / next chapter, and a comments strip (Message, Bubble, ReactionPicker, Input).
 * From @md/main up (on screens at least 36rem tall) the reader fills a 46rem frame and scrolls inside it,
 * the progress bar sticks to the top of the frame and measures it (`target`). On phones it follows the page
 * and the progress bar sticks to the bottom edge, within thumb reach.
 * Full screen: the reader becomes `fixed inset-0` with its own scroll (the "immersive" mode, also the fallback
 * when the Fullscreen API is missing or refused, as on iOS Safari) and asks the browser for full screen on the
 * document element — not on the reader root, so the Sheet (portalled into body) still shows above it.
 * Escape or the button leaves it; the progress bar and the strip then measure the reader root.
 * The block ships no image: pass the volume cover and the pages ({ src, alt, width, height }) in `art`; without
 * them the strip shows blank pages with their panel frames.
 */
import * as React from "react"
import { ListOrdered, Maximize, Minimize } from "lucide-react"

import { Bubble, BubbleContent } from "@/components/ui/manga/bubble"
import { Button } from "@/components/ui/manga/button"
import { ButtonGroup } from "@/components/ui/manga/button-group"
import { Input } from "@/components/ui/manga/input"
import { Message, MessageAvatar, MessageContent, MessageGroup, MessageHeader } from "@/components/ui/manga/message"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/manga/sheet"
import type { ManpuKind } from "@/components/manga/manpu"
import { ReactionPicker, type Reaction } from "@/components/manga/reaction-picker"
import { ReaderStrip, type ReaderStripPage } from "@/components/manga/reader-strip"
import { ReadingProgress } from "@/components/manga/reading-progress"
import { VolumeCard } from "@/components/manga/volume-card"
import { cn } from "cn"

/* ---------- Pictures: passed in `art`, none ships with the block ---------- */

export type MangaReaderArt = {
  /** The cover of the current volume: an image URL or any node. Without it, a screentone cover. */
  cover?: React.ReactNode
  /** The pages of a chapter, top to bottom (the demo shows the same pages for every chapter). */
  pages?: ReaderStripPage[]
}

const INK = "#1f1b17"
const PAPER = "#f8f5ee"

/** Without pictures: blank pages with their panel frames only, so the strip keeps its shape. */
function blankPages(chapter: Chapter): ReaderStripPage[] {
  const frame = (x: number, y: number, w: number, h: number) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${INK}" stroke-width="5"/>`
  const layouts: [number, [number, number, number, number][]][] = [
    [680, [[12, 12, 456, 656]]],
    [420, [[12, 12, 456, 396]]],
    [720, [[12, 12, 456, 316], [12, 344, 456, 364]]],
    [760, [[12, 12, 456, 250], [12, 278, 176, 220], [204, 278, 264, 220], [12, 514, 456, 234]]],
  ]
  return layouts.map(([height, boxes], i) => ({
    src: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="480" height="${height}" viewBox="0 0 480 ${height}"><rect width="480" height="${height}" fill="${PAPER}"/>${boxes.map((b) => frame(...b)).join("")}</svg>`)}`,
    alt: `Chapter ${chapter.n}, page ${i + 1} (no picture yet)`,
    width: 480,
    height,
  }))
}

/* ---------- Series data ---------- */

type Chapter = { n: number; title: string; date: string }

// One invented series. Replace it with your own.
const SERIES = { title: "Mapless", author: "Studio Mapless", volume: 2 }
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const CHAPTERS: Chapter[] = [
  "The ink bridge",
  "The white knight",
  "The lighthouse",
  "A map that moves",
  "Kuro sleeps",
  "The spear falls",
  "Low clouds",
  "Signal fire",
  "The bridge at two",
  "Paper islands",
  "Echo",
  "Draw, again",
].map((title, i) => ({ n: i + 1, title, date: `${MONTHS[i]} 2026` }))

/* ---------- Comments ---------- */

type Line = { id: number; who: string; initials: string; when: string; text: string; mine?: boolean }

const TALK: Line[] = [
  { id: 1, who: "Mika", initials: "MK", when: "2 h", text: "That bridge drawn in one stroke. I scrolled back up twice." },
  { id: 2, who: "Theo", initials: "TH", when: "1 h", text: "The lighthouse page is so quiet after all that noise." },
  { id: 3, who: "Rin", initials: "RN", when: "40 min", text: "Why does the Eraser never take off his helmet? Theories?" },
]

const START_REACTIONS: Reaction[] = [
  { kind: "surprise", count: 214 },
  { kind: "sparkle", count: 96, active: true },
  { kind: "sweat", count: 31 },
]

/** Toggles a reaction: on adds one, off takes it back; a reaction at zero leaves the row. */
function toggle(list: Reaction[], kind: ManpuKind): Reaction[] {
  const found = list.find((r) => r.kind === kind)
  if (!found) return [...list, { kind, count: 1, active: true }]
  const active = !found.active
  const count = found.count + (active ? 1 : -1)
  if (count <= 0) return list.filter((r) => r.kind !== kind)
  return list.map((r) => (r.kind === kind ? { ...r, active, count } : r))
}

/** Reactions and comments of one chapter (keyed by chapter, so each chapter starts fresh). */
function ChapterTalk({ chapter }: { chapter: Chapter }) {
  const id = React.useId()
  const [reactions, setReactions] = React.useState(START_REACTIONS)
  const [lines, setLines] = React.useState(TALK)
  const [draft, setDraft] = React.useState("")
  const post = (e: React.FormEvent) => {
    e.preventDefault()
    const text = draft.trim()
    if (!text) return
    setLines((l) => [...l, { id: Date.now(), who: "You", initials: "You", when: "now", text, mine: true }])
    setDraft("")
  }
  return (
    <section aria-labelledby={`${id}-title`} className="mx-auto grid w-full max-w-[30rem] gap-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h2 id={`${id}-title`} className="font-letter text-2xl leading-none tracking-wide uppercase">
          Comments
        </h2>
        <span className="font-mono text-xs">
          {lines.length} on chapter {chapter.n}
        </span>
      </div>
      <ReactionPicker reactions={reactions} onReact={(kind) => setReactions((l) => toggle(l, kind))} max={5} />
      <MessageGroup className="gap-4">
        {lines.map((line) => (
          <Message key={line.id} align={line.mine ? "end" : "start"}>
            <MessageAvatar aria-hidden className={cn(line.mine && "text-xs")}>
              {line.initials}
            </MessageAvatar>
            <MessageContent>
              <MessageHeader>
                {line.who}
                <span className="ms-2 font-mono text-xs normal-case">{line.when}</span>
              </MessageHeader>
              <Bubble variant={line.mine ? "default" : "secondary"} align={line.mine ? "end" : "start"}>
                <BubbleContent>{line.text}</BubbleContent>
              </Bubble>
            </MessageContent>
          </Message>
        ))}
      </MessageGroup>
      <form onSubmit={post} className="flex items-stretch gap-2 pt-1">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Say something (no spoilers)…"
          aria-label={`Comment on chapter ${chapter.n}`}
          className="min-w-0 flex-1 max-sm:h-11"
        />
        <Button type="submit" variant="outline" disabled={!draft.trim()} className="max-sm:min-h-11">
          Post
        </Button>
      </form>
    </section>
  )
}

/* ---------- The reader ---------- */

type Order = "rtl" | "ltr"
/** off · immersive: fixed over the page with its own scroll (also the fallback) · native: plus the Fullscreen API */
type Screen = "off" | "immersive" | "native"

/** A brush arrow (the base `mark-arrow` points up). */
function Arrow({ to }: { to: "left" | "right" }) {
  return <span aria-hidden className={cn("mark-arrow shrink-0 text-lg", to === "left" ? "-rotate-90" : "rotate-90")} />
}

export function MangaReader({
  className,
  titleAs: TitleTag = "h1",
  art = {},
}: {
  className?: string
  /** The title's heading level: "h1" when the block is the page, "h2" inside a page that already has its h1. */
  titleAs?: "h1" | "h2"
  /** The volume cover and the chapter pages (image URLs). The block ships none. */
  art?: MangaReaderArt
}) {
  const [order, setOrder] = React.useState<Order>("rtl")
  const [current, setCurrent] = React.useState(11)
  const [read, setRead] = React.useState(() => new Set(CHAPTERS.filter((c) => c.n < 11).map((c) => c.n)))
  const [page, setPage] = React.useState(0)
  const [open, setOpen] = React.useState(false)
  const [screen, setScreen] = React.useState<Screen>("off")
  const rootRef = React.useRef<HTMLDivElement>(null)
  const frameRef = React.useRef<HTMLDivElement>(null)
  const full = screen !== "off"
  // mirrors for async callbacks and layout effects
  const wantFull = React.useRef(false)
  const pageRef = React.useRef(0)
  pageRef.current = page

  const chapter = CHAPTERS[current - 1]
  const pages = React.useMemo(() => (art.pages?.length ? art.pages : blankPages(chapter)), [art.pages, chapter])
  const prev = CHAPTERS[current - 2]
  const next = CHAPTERS[current]
  const rtl = order === "rtl"

  /* Full screen: immersive layout at once (the fallback), then the browser's full screen if it agrees. */
  const enterFull = () => {
    wantFull.current = true
    setScreen("immersive")
    const doc = document.documentElement
    if (!document.fullscreenEnabled || typeof doc.requestFullscreen !== "function") return
    doc.requestFullscreen().then(
      () => {
        if (wantFull.current) setScreen("native")
        else void document.exitFullscreen().catch(() => {})
      },
      () => {}, // refused: stay immersive
    )
  }
  const exitFull = () => {
    wantFull.current = false
    setScreen("off")
    if (document.fullscreenElement === document.documentElement) void document.exitFullscreen().catch(() => {})
  }

  // the browser left full screen (Escape, F11, gesture): leave with it
  React.useEffect(() => {
    if (screen !== "native") return
    const onChange = () => {
      if (!document.fullscreenElement) {
        wantFull.current = false
        setScreen("off")
      }
    }
    document.addEventListener("fullscreenchange", onChange)
    return () => document.removeEventListener("fullscreenchange", onChange)
  }, [screen])

  // immersive fallback: Escape leaves (unless it is closing the Sheet)
  React.useEffect(() => {
    if (screen !== "immersive" || open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || e.defaultPrevented) return
      wantFull.current = false
      setScreen("off")
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [screen, open])

  // leaving the page while in full screen gives the screen back
  React.useEffect(
    () => () => {
      if (wantFull.current && document.fullscreenElement === document.documentElement) void document.exitFullscreen().catch(() => {})
    },
    [],
  )

  // entering or leaving changes the scroll container: keep the page being read in view
  const firstLayout = React.useRef(true)
  React.useLayoutEffect(() => {
    if (firstLayout.current) {
      firstLayout.current = false
      return
    }
    const root = rootRef.current
    if (!root) return
    const figure = root.querySelectorAll<HTMLElement>("[data-slot=reader-page]")[pageRef.current]
    if (full && pageRef.current === 0) root.scrollTo({ top: 0 })
    else if (pageRef.current > 0) figure?.scrollIntoView({ block: "start" })
  }, [full])

  const go = (n: number) => {
    setCurrent(n)
    setPage(0)
    setOpen(false)
    // back to the first page: the root scrolls in full screen, the frame from @md up, the page on phones
    const el = full ? rootRef.current : frameRef.current
    if (!el) return
    if (el.scrollHeight - el.clientHeight > 1 && getComputedStyle(el).overflowY !== "visible") el.scrollTo({ top: 0 })
    else if (el.getBoundingClientRect().top < 0) el.scrollIntoView({ block: "start" })
  }

  const prevButton = (
    <Button
      key="prev"
      variant="outline"
      disabled={!prev}
      onClick={() => prev && go(prev.n)}
      aria-label={prev ? `Previous chapter: ${prev.n}, ${prev.title}` : "No previous chapter"}
      className="h-auto min-h-12 min-w-0 flex-1 justify-start py-2 text-start"
    >
      <Arrow to={rtl ? "right" : "left"} />
      <span className="grid min-w-0">
        <span className="font-mono text-xs whitespace-normal normal-case">Previous{prev && ` · ch. ${prev.n}`}</span>
        <span className="whitespace-normal">{prev ? prev.title : "None"}</span>
      </span>
    </Button>
  )
  const nextButton = (
    <Button
      key="next"
      variant={next ? "default" : "outline"}
      disabled={!next}
      onClick={() => next && go(next.n)}
      aria-label={next ? `Next chapter: ${next.n}, ${next.title}` : "No next chapter yet"}
      className="h-auto min-h-12 min-w-0 flex-1 justify-start py-2 text-start"
    >
      <Arrow to={rtl ? "left" : "right"} />
      <span className="grid min-w-0">
        <span className="font-mono text-xs whitespace-normal normal-case">Next{next && ` · ch. ${next.n}`}</span>
        <span className="whitespace-normal">{next ? next.title : "Not out yet"}</span>
      </span>
    </Button>
  )

  return (
    <div
      ref={rootRef}
      data-manga="manga-reader"
      data-reading={order}
      data-fullscreen={full ? screen : undefined}
      className={cn(
        "@container/main w-full bg-background text-foreground",
        full && "fixed inset-0 z-50 overflow-x-hidden overflow-y-auto overscroll-contain",
        className,
      )}
    >
      {/* In full screen the top bar scrolls away with the pages: a way out stays in the corner (iOS has no Escape). */}
      {full && (
        <Button
          size="icon"
          aria-label="Exit full screen"
          onClick={exitFull}
          className="fixed end-3 top-3 z-20 size-11"
        >
          <Minimize />
        </Button>
      )}
      <div
        ref={frameRef}
        className={
          full
            ? "relative flex min-h-full flex-col"
            : "relative flex flex-col @md/main:[@media(min-height:36rem)]:h-[46rem] @md/main:[@media(min-height:36rem)]:overflow-x-hidden @md/main:[@media(min-height:36rem)]:overflow-y-auto"
        }
      >
        <header className="grid gap-3 border-b-[length:var(--mg-bw-panel)] border-border p-3 sm:p-4">
          <div className="flex items-start gap-3">
            <div className="grid min-w-0 flex-1 gap-1">
              <p className="font-mono text-xs">
                Vol. {SERIES.volume} · {SERIES.author}
              </p>
              <TitleTag className="font-letter text-3xl leading-none tracking-wide uppercase">{SERIES.title}</TitleTag>
              <p className="truncate font-letter text-lg leading-tight uppercase">
                Ch. {chapter.n} · {chapter.title}
              </p>
            </div>
            {/* One name, a pressed state: the icon says which way it goes. */}
            <Button
              variant={full ? "default" : "outline"}
              size="icon"
              aria-label="Full screen"
              aria-pressed={full}
              onClick={full ? exitFull : enterFull}
              className="shrink-0 max-sm:size-11"
            >
              {full ? <Minimize /> : <Maximize />}
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-expanded={open} className="max-sm:min-h-11">
              <ListOrdered />
              Chapters
            </Button>
            {/* Pressed buttons rather than a Toggle Group: its value API differs between Radix and Base UI. */}
            <ButtonGroup aria-label="Reading order" className="@md/main:ms-auto">
              {(
                [
                  ["rtl", "Manga · RTL"],
                  ["ltr", "Western · LTR"],
                ] as const
              ).map(([value, label]) => (
                <Button
                  key={value}
                  size="sm"
                  variant={order === value ? "default" : "outline"}
                  aria-pressed={order === value}
                  onClick={() => setOrder(value)}
                  className="max-sm:min-h-11"
                >
                  {label}
                </Button>
              ))}
            </ButtonGroup>
          </div>
        </header>

        {/* Phones: the last thing in the reader, stuck to the bottom edge. From @md up: stuck to the top of the frame. */}
        <div className="sticky bottom-0 z-20 order-last border-t-[length:var(--mg-bw)] border-border bg-background px-3 py-3 sm:px-4 @md/main:[@media(min-height:36rem)]:top-0 @md/main:[@media(min-height:36rem)]:bottom-auto @md/main:[@media(min-height:36rem)]:order-none @md/main:[@media(min-height:36rem)]:border-t-0 @md/main:[@media(min-height:36rem)]:border-b-[length:var(--mg-bw)]">
          <ReadingProgress
            target={full ? rootRef : frameRef}
            label={`Chapter ${chapter.n} progress`}
            showValue
            valueText={`Page ${Math.min(page + 1, pages.length)} / ${pages.length}`}
          />
        </div>

        <div className="grid gap-6 px-3 pt-4 pb-8 sm:px-4">
          <ReaderStrip
            // the strip finds its scroll parent when it mounts: a new one in and out of full screen
            key={`strip-${chapter.n}-${full ? "full" : "page"}`}
            aria-label={`Chapter ${chapter.n}, ${chapter.title}`}
            pages={pages}
            gap="sm"
            onProgress={(_, index) => setPage(index)}
            onEnd={() => setRead((s) => (s.has(chapter.n) ? s : new Set(s).add(chapter.n)))}
          />

          {/* Manga order puts the next chapter on the left, like turning a page to the left. */}
          <nav aria-label="Chapters" className="mx-auto flex w-full max-w-[30rem] flex-wrap gap-3 pe-1 pb-1">
            {rtl ? [nextButton, prevButton] : [prevButton, nextButton]}
          </nav>

          <ChapterTalk key={`talk-${chapter.n}`} chapter={chapter} />
        </div>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Chapters</SheetTitle>
            <SheetDescription>
              {SERIES.title} · {CHAPTERS.length} chapters out · {read.size} read
            </SheetDescription>
          </SheetHeader>
          {/* The volume and the list scroll together: on a short phone the list stays in reach. */}
          <div className="grid min-h-0 flex-1 content-start gap-4 overflow-y-auto px-4 pt-1 pe-5 pb-5">
            <div className="flex items-start gap-3">
              <div className="w-32 shrink-0">
                <VolumeCard
                  volume={SERIES.volume}
                  title={SERIES.title}
                  author={SERIES.author}
                  status="ongoing"
                  read={read.size}
                  total={CHAPTERS.length}
                  cover={art.cover}
                />
              </div>
              <div className="grid min-w-0 gap-1 pt-1">
                <p className="font-mono text-xs">Reading now</p>
                <p className="font-letter text-lg leading-tight tracking-wide uppercase break-words">
                  Ch. {chapter.n} · {chapter.title}
                </p>
                <p className="font-mono text-xs">
                  Page {Math.min(page + 1, pages.length)} / {pages.length}
                </p>
              </div>
            </div>
            <ol aria-label="Chapter list" className="grid content-start gap-2">
              {CHAPTERS.map((c) => {
                const isCurrent = c.n === current
                return (
                  <li key={c.n}>
                    <button
                      type="button"
                      aria-current={isCurrent ? "true" : undefined}
                      onClick={() => go(c.n)}
                      className={cn(
                        "relative flex min-h-11 w-full items-center gap-3 border-ink bg-background px-3 py-2 text-start text-foreground hover-lift focus-ink press",
                        "active:bg-foreground active:text-background",
                        "aria-[current=true]:ink-fill aria-[current=true]:fill-in aria-[current=true]:active:bg-background aria-[current=true]:active:text-foreground",
                      )}
                    >
                      <span className="w-6 shrink-0 font-mono text-sm tabular-nums">{String(c.n).padStart(2, "0")}</span>
                      <span className="grid min-w-0 flex-1">
                        <span className="truncate font-letter text-base leading-tight tracking-wide uppercase">{c.title}</span>
                        <span className="font-mono text-xs">{isCurrent ? "Reading now" : c.date}</span>
                      </span>
                      {read.has(c.n) && <span role="img" aria-label="Read" className="mark-check shrink-0 text-xl" />}
                    </button>
                  </li>
                )
              })}
            </ol>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
