"use client"

/*
 * Manga Reader — a webtoon-style reader made only with mangacn: a top bar (series, chapter, a Full screen
 * toggle), the chapter list in a Sheet headed by a VolumeCard of the current volume (cover, status, chapters
 * read / out) — current chapter an ink flat, read ones with a brush check — a reading-order
 * switch (pressed buttons: Manga RTL / Western LTR, it sets data-reading on the root and flips the chapter
 * buttons), a ReadingProgress bar with the page counter, a ReaderStrip of nine drawn pages with its end
 * panel, previous / next chapter, and a comments strip (Message, Bubble, ReactionPicker, Input).
 * From @md/main up (on screens at least 36rem tall) the reader fills a 46rem frame and scrolls inside it,
 * the progress bar sticks to the top of the frame and measures it (`target`). On phones it follows the page
 * and the progress bar sticks to the bottom edge, within thumb reach.
 * Full screen: the reader becomes `fixed inset-0` with its own scroll (the "immersive" mode, also the fallback
 * when the Fullscreen API is missing or refused, as on iOS Safari) and asks the browser for full screen on the
 * document element — not on the reader root, so the Sheet (portalled into body) still shows above it.
 * Escape or the button leaves it; the progress bar and the strip then measure the reader root.
 * The pages are SVG scans drawn for this repo: replace `chapterPages()` with your own { src, alt, width, height }.
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

/* ---------- Drawings (made for this repo). A page is a scan: ink on paper in both themes. ---------- */

const INK = "#1f1b17"
const PAPER = "#f8f5ee"
const W = 480

const TONE = `<defs><pattern id="t" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><circle cx="2" cy="2" r="1.3" fill="${INK}"/><circle cx="6" cy="6" r="1.3" fill="${INK}"/></pattern></defs>`

const svg = (h: number, body: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${h}" viewBox="0 0 ${W} ${h}">${TONE}<rect width="${W}" height="${h}" fill="${PAPER}"/>${body}</svg>`,
  )}`

function rng(seed: number) {
  let s = seed >>> 0 || 1
  return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296
}
const r1 = (n: number) => Math.round(n * 10) / 10

const frame = (x: number, y: number, w: number, h: number) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${INK}" stroke-width="5"/>`

/** Clips what is drawn in `body` to a panel, then inks its frame. */
const panel = (id: string, x: number, y: number, w: number, h: number, body: string) =>
  `<clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath><g clip-path="url(#${id})">${body}</g>${frame(x, y, w, h)}`

/** Concentration lines: thin wedges from far away toward a clear circle. */
function focusLines(cx: number, cy: number, hole: number, count: number, seed: number) {
  const rand = rng(seed)
  let d = ""
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2 + rand() * 0.05
    const w = 0.004 + rand() * 0.012
    const inner = hole * (1 + rand() * 0.45)
    d += `M${r1(cx + Math.cos(a - w) * 900)} ${r1(cy + Math.sin(a - w) * 900)}L${r1(cx + Math.cos(a) * inner)} ${r1(cy + Math.sin(a) * inner)}L${r1(cx + Math.cos(a + w) * 900)} ${r1(cy + Math.sin(a + w) * 900)}Z`
  }
  return `<path d="${d}" fill="${INK}"/>`
}

/** Speed lines: strokes of random length and weight, level or at an angle. */
function speedLines(x: number, y: number, w: number, h: number, count: number, seed: number, angle = 0) {
  const rand = rng(seed)
  let out = ""
  for (let i = 0; i < count; i++) {
    const len = w * (0.25 + rand() * 0.6)
    out += `<rect x="${r1(x + rand() * (w - len))}" y="${r1(y + rand() * h)}" width="${r1(len)}" height="${r1(1 + rand() * 3)}" fill="${INK}"/>`
  }
  return angle ? `<g transform="rotate(${angle} ${x + w / 2} ${y + h / 2})">${out}</g>` : out
}

/** Rain: short slanted strokes. */
function rain(x: number, y: number, w: number, h: number, count: number, seed: number) {
  const rand = rng(seed)
  let d = ""
  for (let i = 0; i < count; i++) {
    const len = 14 + rand() * 26
    d += `M${r1(x + rand() * w)} ${r1(y + rand() * h)}l${r1(-len * 0.35)} ${r1(len)}`
  }
  return `<path d="${d}" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"/>`
}

/** Head and shoulders, 100 × 124 at scale 1. */
const bust = (x: number, y: number, s: number, fill = PAPER) =>
  `<g transform="translate(${x} ${y}) scale(${s})"><path d="M6 124c4-40 22-58 44-58s40 18 44 58z" fill="${fill}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><circle cx="50" cy="36" r="26" fill="${fill}" stroke="${INK}" stroke-width="4"/><path d="M24 34c0-22 16-32 30-30 16 2 26 14 22 32-6-10-18-14-30-10-8 3-14 6-22 8z" fill="${INK}"/></g>`

/** A figure seen from behind, 100 × 124 at scale 1, with a paper rim so it reads over ink. */
const back = (x: number, y: number, s: number) =>
  `<g transform="translate(${x} ${y}) scale(${s})"><path d="M6 124c4-40 22-58 44-58s40 18 44 58z" fill="${INK}" stroke="${PAPER}" stroke-width="4" stroke-linejoin="round"/><circle cx="50" cy="36" r="26" fill="${INK}" stroke="${PAPER}" stroke-width="4"/><path d="M28 18c8-8 26-10 38 0" fill="none" stroke="${PAPER}" stroke-width="3" stroke-linecap="round"/></g>`

/** A runner in thick strokes, about 110 × 120 at scale 1. */
const runner = (x: number, y: number, s: number, flip = false) =>
  `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})${flip ? " translate(-110 0)" : ""}"><circle cx="76" cy="20" r="12" fill="${INK}"/><path d="M72 36 54 64l-24 4M64 50l22 10 14-8M54 64l18 18-6 28M54 64l-16 22-22 6" fill="none" stroke="${INK}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/></g>`

/** Two wide eyes, 200 × 90 at scale 1. */
const eyes = (x: number, y: number, s: number) => {
  const eye = (cx: number) =>
    `<path d="M${cx - 36} 52c16-22 56-22 72 0-16 22-56 22-72 0z" fill="${PAPER}" stroke="${INK}" stroke-width="4"/><circle cx="${cx}" cy="52" r="14" fill="${INK}"/><circle cx="${cx + 5}" cy="46" r="4.5" fill="${PAPER}"/><path d="M${cx - 38} 26c18-12 54-12 74 0" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>`
  return `<g transform="translate(${x} ${y}) scale(${s})">${eye(52)}${eye(148)}</g>`
}

const burst = (cx: number, cy: number, r: number, seed: number, fill = INK) => {
  const rand = rng(seed)
  const pts: string[] = []
  for (let i = 0; i < 26; i++) {
    const a = (i / 26) * Math.PI * 2
    const rr = i % 2 ? r * (0.55 + rand() * 0.1) : r * (0.88 + rand() * 0.22)
    pts.push(`${r1(cx + Math.cos(a) * rr)},${r1(cy + Math.sin(a) * rr)}`)
  }
  return `<polygon points="${pts.join(" ")}" fill="${fill}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>`
}

/** Rooftops and windows along a baseline, 200 × 100 at scale 1. */
const skyline = (x: number, y: number, s: number) =>
  `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 100V60h16V46h14v14h12V34h22v26h8V50h18v-8h6v8h12V38l12-8 12 8v22h10V48h18v-6h12v20h10v-8h18v46z" fill="${INK}"/><path d="M22 66h4v4h-4zM48 42h4v4h-4zM48 54h4v4h-4zM110 44h4v4h-4zM124 52h4v4h-4zM168 60h4v4h-4zM90 58h4v4h-4z" fill="${PAPER}"/></g>`

/** An empty balloon with strokes for words (the scan carries no lettering). */
const balloon = (cx: number, cy: number, rx: number, ry: number, tx: number, ty: number) =>
  `<path d="M${cx - 14} ${cy + ry - 6}L${tx} ${ty}L${cx + 10} ${cy + ry - 4}z" fill="${PAPER}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${PAPER}" stroke="${INK}" stroke-width="3"/><path d="M${cx - 14} ${cy + ry - 9}h24" stroke="${PAPER}" stroke-width="5"/><path d="M${r1(cx - rx * 0.55)} ${cy - 8}h${r1(rx * 1.1)}M${r1(cx - rx * 0.4)} ${cy + 8}h${r1(rx * 0.8)}" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`

const moon = (cx: number, cy: number, r: number) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${PAPER}" stroke="${INK}" stroke-width="5"/><circle cx="${r1(cx - r * 0.3)}" cy="${r1(cy - r * 0.2)}" r="${r1(r * 0.14)}" fill="url(#t)"/><circle cx="${r1(cx + r * 0.25)}" cy="${r1(cy + r * 0.3)}" r="${r1(r * 0.1)}" fill="url(#t)"/>`

/* ---------- Series data ---------- */

type Chapter = { n: number; title: string; date: string }

const SERIES = { title: "Night Run", author: "Aki Mori", volume: 2 }
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const CHAPTERS: Chapter[] = [
  "The last train",
  "Rooftops",
  "A borrowed coat",
  "Lanterns",
  "The courier",
  "Rain check",
  "Low tide",
  "Signal fire",
  "The bridge at two",
  "Paper moon",
  "Echo",
  "Run, again",
].map((title, i) => ({ n: i + 1, title, date: `${MONTHS[i]} 2026` }))

/** The nine pages of a chapter; the seed moves the lines, so each chapter looks a little different. */
function chapterPages(chapter: Chapter): ReaderStripPage[] {
  const k = chapter.n * 13
  const pages = [
    {
      height: 680,
      alt: `Title page: chapter ${chapter.n}, “${chapter.title}”, a runner at the centre of concentration lines.`,
      body:
        focusLines(240, 420, 150, 150, k + 1) +
        `<circle cx="240" cy="420" r="150" fill="${PAPER}"/>` +
        runner(170, 350, 1.3) +
        `<rect x="40" y="40" width="400" height="118" fill="${PAPER}" stroke="${INK}" stroke-width="5"/>` +
        `<text x="240" y="98" text-anchor="middle" font-family="Impact, 'Arial Black', sans-serif" font-size="52" letter-spacing="4" fill="${INK}">NIGHT RUN</text>` +
        `<text x="240" y="140" text-anchor="middle" font-family="'Arial Narrow', Arial, sans-serif" font-size="22" letter-spacing="2" fill="${INK}">Chapter ${chapter.n} · ${chapter.title}</text>` +
        frame(12, 12, 456, 656),
    },
    {
      height: 420,
      alt: "A city skyline at night under a round moon.",
      body: panel("a", 12, 12, 456, 396, `<rect x="12" y="12" width="456" height="200" fill="url(#t)"/>${moon(350, 110, 46)}${speedLines(30, 40, 240, 110, 9, k + 2)}${skyline(0, 190, 2.4)}`),
    },
    {
      height: 720,
      alt: "Two panels: a figure runs through speed lines, then a burst of impact.",
      body:
        panel("a", 12, 12, 456, 316, `${speedLines(12, 30, 456, 280, 46, k + 3)}${runner(150, 70, 2)}`) +
        panel("b", 12, 344, 456, 364, `${focusLines(240, 526, 70, 110, k + 4)}${burst(240, 526, 66, k + 5)}`),
    },
    {
      height: 520,
      alt: "A close-up of two wide-open eyes.",
      body: panel("a", 12, 12, 456, 496, `${focusLines(240, 260, 180, 120, k + 6)}<rect x="12" y="180" width="456" height="150" fill="${PAPER}"/>${eyes(40, 166, 2)}`),
    },
    {
      height: 760,
      alt: "Three panels: rooftops from above, a question in a balloon, then a long jump between two roofs.",
      body:
        panel("a", 12, 12, 456, 250, `<rect x="12" y="12" width="456" height="250" fill="url(#t)"/>${skyline(-20, 120, 2.6)}`) +
        panel("b", 12, 278, 176, 220, `${bust(42, 360, 1.15)}${balloon(100, 326, 66, 34, 86, 368)}`) +
        panel("c", 204, 278, 264, 220, `${speedLines(204, 300, 264, 180, 18, k + 7, -18)}${runner(270, 330, 1.2)}`) +
        panel("d", 12, 514, 456, 234, `<path d="M12 690h150v58H12zM330 660h138v88H330z" fill="${INK}"/>${speedLines(150, 540, 200, 140, 16, k + 8, -24)}${runner(186, 560, 1.15, true)}`),
    },
    {
      height: 600,
      alt: "A small figure inside a huge burst.",
      body: panel("a", 12, 12, 456, 576, `${focusLines(240, 300, 220, 90, k + 9)}${burst(240, 300, 220, k + 10, PAPER)}${burst(240, 300, 150, k + 11)}${bust(190, 236, 1)}`),
    },
    {
      height: 640,
      alt: "Rain falls on a figure standing alone in the street.",
      body: panel(
        "a",
        12,
        12,
        456,
        616,
        `${rain(12, 12, 480, 520, 180, k + 12)}<rect x="12" y="520" width="456" height="108" fill="url(#t)"/><path d="M60 560h120M260 584h150M120 606h90" stroke="${PAPER}" stroke-width="4" stroke-linecap="round"/>${back(180, 360, 1.3)}`,
      ),
    },
    {
      height: 560,
      alt: "Two figures face each other; each says something in a balloon.",
      body: panel(
        "a",
        12,
        12,
        456,
        536,
        `<rect x="12" y="430" width="456" height="118" fill="url(#t)"/>${bust(40, 300, 1.3)}${bust(310, 300, 1.3, INK)}${balloon(150, 120, 110, 52, 120, 260)}${balloon(330, 220, 96, 46, 370, 300)}`,
      ),
    },
    {
      height: 700,
      alt: "Seen from behind, the runner looks at the moon over the city.",
      body: panel(
        "a",
        12,
        12,
        456,
        676,
        `<rect x="12" y="12" width="456" height="300" fill="url(#t)"/>${moon(320, 150, 70)}${skyline(0, 300, 2.4)}<rect x="12" y="540" width="456" height="148" fill="${INK}"/>${back(170, 420, 1.2)}`,
      ),
    },
  ]
  return pages.map(({ height, alt, body }) => ({ src: svg(height, body), alt, width: W, height }))
}

/** The volume cover, drawn with the theme tokens: paper, a tone band, ink. The VolumeCard draws its case. */
function Cover() {
  const id = React.useId()
  return (
    <svg viewBox="0 0 60 84" preserveAspectRatio="xMidYMid slice" aria-hidden className="block size-full">
      <defs>
        <pattern id={id} width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <circle cx="1.25" cy="1.25" r="0.8" fill="var(--foreground)" />
          <circle cx="3.75" cy="3.75" r="0.8" fill="var(--foreground)" />
        </pattern>
      </defs>
      <rect width="60" height="84" fill="var(--background)" />
      <rect x="2" y="2" width="56" height="34" fill={`url(#${id})`} />
      <circle cx="42" cy="17" r="9" fill="var(--background)" stroke="var(--foreground)" strokeWidth="1.5" />
      <path d="M2 40V30h6v-6h6v6h4V20h8v10h4v-4h8v6h6v-8h6v6h8v10z" fill="var(--foreground)" />
      <circle cx="40" cy="47" r="4" fill="var(--foreground)" />
      <path
        d="M38 52 30 62l-8 1M34 57l8 4 5-3M30 62l6 7-2 9M30 62l-6 8-7 2"
        fill="none"
        stroke="var(--foreground)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M5 50h12M3 56h10M7 62h9" stroke="var(--foreground)" strokeWidth="1.5" />
    </svg>
  )
}

/* ---------- Comments ---------- */

type Line = { id: number; who: string; initials: string; when: string; text: string; mine?: boolean }

const TALK: Line[] = [
  { id: 1, who: "Mika", initials: "MK", when: "2 h", text: "That jump between the roofs. I scrolled back up twice." },
  { id: 2, who: "Theo", initials: "TH", when: "1 h", text: "The rain page is so quiet after all that noise." },
  { id: 3, who: "Rin", initials: "RN", when: "40 min", text: "Who is the one in the dark coat? Theories, anyone?" },
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

export function MangaReader({ className, titleAs: TitleTag = "h1" }: { className?: string; /** The title's heading level: "h1" when the block is the page, "h2" inside a page that already has its h1. */ titleAs?: "h1" | "h2" }) {
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
  const pages = React.useMemo(() => chapterPages(chapter), [chapter])
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
                  cover={<Cover />}
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
