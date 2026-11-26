"use client"

/*
 * Author site: the site of a manga author, end to end — the catalog of their series, a series page, then
 * the chapter read page by page (PageReader) or panel by panel (GuidedView). Made only with mangacn.
 * Chapters are pages of the page model (PageData): panels, drawn art and real lettering, so the reader and
 * the guided view work from the same data. The art is drawn in SVG for this repo: replace SERIES and
 * chapterPages() with your own works. The demo never navigates: the three screens are one component's state.
 */

import * as React from "react"
import { cn } from "cn"
import { LayoutGrid, Settings2 } from "lucide-react"

import { Button } from "@/components/ui/manga/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/manga/sheet"
import { ChapterEnd } from "@/components/manga/chapter-end"
import { GuidedView } from "@/components/manga/guided-view"
import { ObiBand } from "@/components/manga/obi-band"
import type { PageData, PanelData } from "@/components/manga/page-geometry"
import { Page } from "@/components/manga/panel"
import { PageReader } from "@/components/manga/page-reader"
import { PageThumbnails } from "@/components/manga/page-thumbnails"
import { RankingList } from "@/components/manga/ranking-list"
import { ReaderSettings, defaultReaderSettings, type ReaderSettingsValue } from "@/components/manga/reader-settings"
import { ReleaseCalendar } from "@/components/manga/release-calendar"
import { SeriesHeader } from "@/components/manga/series-header"
import { Shelf, type ShelfVolume } from "@/components/manga/shelf"
import { Spoiler } from "@/components/manga/spoiler"
import { VolumeCard } from "@/components/manga/volume-card"

/* ---------- Drawings (made for this repo): ink on paper, as SVG URLs ---------- */

const INK = "#1f1b17"
const PAPER = "#f8f5ee"
const DEFS = `<defs><pattern id="t" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><circle cx="2" cy="2" r="1.3" fill="${INK}"/><circle cx="6" cy="6" r="1.3" fill="${INK}"/></pattern><pattern id="l" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(-30)"><rect width="6" height="1.6" fill="${INK}"/></pattern></defs>`
const url = (w: number, h: number, body: string) =>
  `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${DEFS}<rect width="${w}" height="${h}" fill="${PAPER}"/>${body}</svg>`)}`
const r1 = (n: number) => Math.round(n * 10) / 10
function rng(seed: number) {
  let s = seed >>> 0 || 1
  return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296
}
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
function strokes(x: number, y: number, w: number, h: number, count: number, seed: number, slant = 0.35) {
  const rand = rng(seed)
  let d = ""
  for (let i = 0; i < count; i++) {
    const len = 14 + rand() * 26
    d += `M${r1(x + rand() * w)} ${r1(y + rand() * h)}l${r1(-len * slant)} ${r1(len)}`
  }
  return `<path d="${d}" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"/>`
}
const bust = (x: number, y: number, s: number, fill = PAPER) =>
  `<g transform="translate(${x} ${y}) scale(${s})"><path d="M6 124c4-40 22-58 44-58s40 18 44 58z" fill="${fill}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><circle cx="50" cy="36" r="26" fill="${fill}" stroke="${INK}" stroke-width="4"/><path d="M22 30c2-20 20-30 36-26 14 4 22 16 20 30-8-8-20-10-30-6-10 3-18 4-26 2z" fill="${INK}"/></g>`
const back = (x: number, y: number, s: number) =>
  `<g transform="translate(${x} ${y}) scale(${s})"><path d="M6 124c4-40 22-58 44-58s40 18 44 58z" fill="${INK}" stroke="${PAPER}" stroke-width="4"/><circle cx="50" cy="36" r="26" fill="${INK}" stroke="${PAPER}" stroke-width="4"/></g>`
const lantern = (x: number, y: number, s: number) =>
  `<g transform="translate(${x} ${y}) scale(${s})"><path d="M30 0v14M30 96v14" stroke="${INK}" stroke-width="3"/><rect x="14" y="14" width="32" height="8" fill="${INK}"/><ellipse cx="30" cy="56" rx="28" ry="34" fill="${PAPER}" stroke="${INK}" stroke-width="4"/><path d="M6 44h48M4 58h52M7 72h46" stroke="${INK}" stroke-width="2"/><rect x="14" y="88" width="32" height="8" fill="${INK}"/></g>`
const boat = (x: number, y: number, s: number) =>
  `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 40h120l-20 24H20z" fill="${PAPER}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><path d="M60 40V0l34 40z" fill="${PAPER}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/></g>`
const roofs = (x: number, y: number, s: number) =>
  `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 100V58l20-16 20 16v-8l24-20 24 20v10h10V44l18-14 18 14v18h14V50l16-12 16 12v50z" fill="${INK}"/></g>`
const waves = (y: number, w: number, n: number) =>
  Array.from({ length: n }, (_, i) => `<path d="M-10 ${y + i * 26}q25 -14 50 0t50 0 50 0 50 0 50 0 50 0 50 0 50 0 50 0 50 0" fill="none" stroke="${INK}" stroke-width="4"/>`).join("") +
  `<rect y="${y + n * 26}" width="${w}" height="400" fill="url(#t)"/>`
const anvil = (x: number, y: number, s: number) =>
  `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0h110c-4 14-20 20-40 22v18h20v14H20V40h20V22C18 20 4 14 0 0z" fill="${INK}"/></g>`

type Theme = "lantern" | "boat" | "forge"
type Scene = "wide" | "face" | "pair" | "detail" | "burst" | "crowd" | "night"

/** One panel's art, 480 × 360, from the series' theme. */
function scene(theme: Theme, kind: Scene, seed: number) {
  const prop = theme === "lantern" ? lantern(190, 90, 1.4) : theme === "boat" ? boat(180, 150, 1.1) : anvil(185, 170, 1)
  const far =
    theme === "lantern" ? `<rect width="480" height="200" fill="url(#t)"/><circle cx="380" cy="80" r="40" fill="${PAPER}" stroke="${INK}" stroke-width="5"/>${roofs(0, 180, 2.4)}` : theme === "boat" ? `<circle cx="380" cy="80" r="40" fill="none" stroke="${INK}" stroke-width="5"/>${waves(210, 480, 3)}${boat(60, 150, 0.9)}` : `<rect width="480" height="360" fill="url(#l)"/>${focusLines(240, 300, 60, 60, seed)}${anvil(150, 220, 1.6)}`
  const art: Record<Scene, string> = {
    wide: far,
    face: `${focusLines(240, 190, 120, 110, seed)}<circle cx="240" cy="190" r="120" fill="${PAPER}"/>${bust(170, 110, 1.4)}`,
    pair: `<rect y="270" width="480" height="90" fill="url(#t)"/>${bust(40, 150, 1.5)}${bust(300, 150, 1.5, INK)}`,
    detail: `${strokes(0, 0, 480, 360, 40, seed, -0.2)}${prop}`,
    burst: `${focusLines(240, 180, 100, 130, seed)}<circle cx="240" cy="180" r="100" fill="${PAPER}"/>${theme === "forge" ? anvil(185, 150, 1.1) : theme === "boat" ? boat(180, 150, 1.1) : lantern(206, 100, 1.2)}`,
    crowd: `${strokes(0, 0, 480, 360, 130, seed)}${back(60, 200, 1.1)}${back(200, 220, 1)}${back(330, 205, 1.1)}`,
    night: `<rect width="480" height="360" fill="${INK}"/>${theme === "lantern" ? lantern(200, 90, 1.4) : `<circle cx="360" cy="90" r="40" fill="${PAPER}"/>`}${back(120, 230, 1)}`,
  }
  return url(480, 360, art[kind])
}

/** A 2:3 cover for a volume. */
function cover(theme: Theme, volume: number, title: string) {
  const art =
    theme === "lantern"
      ? `${focusLines(200, 330, 90, 90, volume)}<circle cx="200" cy="330" r="90" fill="${PAPER}"/>${lantern(150, 240, 1.6)}`
      : theme === "boat"
        ? `<circle cx="300" cy="200" r="50" fill="none" stroke="${INK}" stroke-width="6"/>${waves(380, 400, 3)}${boat(110, 300, 1.5)}`
        : `<rect width="400" height="600" fill="url(#l)"/>${focusLines(200, 420, 70, 80, volume)}${anvil(110, 360, 1.6)}`
  return url(
    400,
    600,
    `${art}<rect x="24" y="500" width="352" height="76" fill="${PAPER}" stroke="${INK}" stroke-width="4"/><text x="200" y="552" text-anchor="middle" font-family="Impact, 'Arial Black', sans-serif" font-size="36" textLength="300" lengthAdjust="spacingAndGlyphs" fill="${INK}">${title.toUpperCase()}</text><rect x="3" y="3" width="394" height="594" fill="none" stroke="${INK}" stroke-width="6"/>`,
  )
}

/* ---------- The author's works ---------- */

type Chapter = { n: number; title: string; date: string; lines: [string, string, string] }
type Series = {
  id: string
  theme: Theme
  title: string
  altTitle: string
  status: "ongoing" | "completed" | "hiatus" | "new"
  genres: string[]
  summary: string
  volumes: number
  readers: string
  chapters: Chapter[]
  /** The next chapter when it is not out yet. */
  upcoming?: { n: number; title: string; date: string; day: 0 | 1 | 2 | 3 | 4 | 5 | 6 }
  obi?: string
}

const AUTHOR = "Nao Arai"

const SERIES: Series[] = [
  {
    id: "lantern-street",
    theme: "lantern",
    title: "Lantern Street",
    altTitle: "The night market stories",
    status: "ongoing",
    genres: ["Slice of life", "Mystery"],
    summary:
      "Every autumn the night market on Lantern Street sells lanterns that hold one wish each. Mio mends the broken ones in her grandmother's stall, until a lantern comes back with a wish that is not hers, written in a hand she has never seen. To find its owner she follows the lanterns past the river, where the market stays open long after the street goes dark.",
    volumes: 2,
    readers: "12.4k",
    chapters: [
      { n: 1, title: "The night market", date: "Oct 1", lines: ["The night market opens at dusk.", "This one is cracked.", "Then I'll mend it."] },
      { n: 2, title: "A wish that is not mine", date: "Oct 15", lines: ["A second evening.", "Who wrote this?", "Not me."] },
      { n: 3, title: "Past the river", date: "Nov 1", lines: ["The bridge is longer at night.", "Are you lost?", "No. Following."] },
    ],
    upcoming: { n: 4, title: "The keeper's debt", date: "Dec 3", day: 2 },
  },
  {
    id: "paper-boats",
    theme: "boat",
    title: "Paper Boats",
    altTitle: "A fleet of two",
    status: "new",
    genres: ["Adventure", "Comedy"],
    summary: "Two kids fold a fleet of paper boats to cross a flooded town, one street at a time. Every boat carries a message; not all of them sink.",
    volumes: 1,
    readers: "3.1k",
    chapters: [
      { n: 1, title: "High water", date: "Nov 12", lines: ["The water came up in one night.", "Fold faster!", "It floats!"] },
      { n: 2, title: "The second boat", date: "Nov 19", lines: ["Down Canal Street.", "Is that a letter?", "Read it!"] },
    ],
    upcoming: { n: 3, title: "Harbour lights", date: "Nov 26", day: 2 },
    obi: "New series",
  },
  {
    id: "tidal-forge",
    theme: "forge",
    title: "Tidal Forge",
    altTitle: "The smith who hammers the sea",
    status: "completed",
    genres: ["Fantasy", "Drama"],
    summary: "A smith forges tools out of tides for a village that lives off the sea, until the sea asks for one tool back. Complete in two volumes.",
    volumes: 2,
    readers: "21.8k",
    chapters: [
      { n: 1, title: "Cold iron", date: "Mar 2", lines: ["The tide was early.", "Hammer it again.", "It sings."] },
      { n: 2, title: "What the sea wants", date: "Apr 6", lines: ["Low tide, no wind.", "Give it back.", "Never."] },
    ],
  },
]

/** Three pages of page data for a chapter, from the series' theme; the chapter number moves the lines. */
function chapterPages(series: Series, chapter: Chapter): PageData[] {
  const k = chapter.n * 17 + series.title.length
  const t = series.theme
  const art = (kind: Scene, alt: string, extra: Partial<PanelData["art"]> = {}) => ({ src: scene(t, kind, k + alt.length), alt, ...extra })
  return [
    {
      version: 1,
      format: "pocket",
      tiers: [
        {
          height: 1.3,
          panels: [
            {
              bleed: true,
              label: `Title: chapter ${chapter.n}, ${chapter.title}`,
              art: art("wide", `${series.title}: the opening view`),
              items: [
                { type: "caption", x: 4, y: 6, anchor: "top-left", text: `${series.title} · Chapter ${chapter.n}` },
                { type: "caption", x: 96, y: 92, anchor: "bottom-right", text: chapter.lines[0] },
              ],
            },
          ],
        },
        {
          slant: -4,
          panels: [
            { width: 1.2, label: "A closer look", art: art("detail", "A closer look at the thing that matters") },
            {
              label: "Someone speaks",
              art: art("face", "A face in focus lines", { zoom: 1.2 }),
              items: [{ type: "bubble", x: 50, y: 14, text: chapter.lines[1], pointAt: { x: 50, y: 62 }, maxWidth: 85 }],
            },
          ],
        },
      ],
    },
    {
      version: 1,
      format: "pocket",
      tiers: [
        {
          panels: [
            {
              width: 1.3,
              label: "Two people face each other",
              art: art("pair", "Two people face each other"),
              items: [{ type: "bubble", x: 74, y: 18, text: chapter.lines[2], pointAt: { x: 78, y: 60 }, maxWidth: 45 }],
            },
            { label: "A crowd passes", shape: "tilted", art: art("crowd", "A crowd seen from behind") },
          ],
        },
        {
          height: 1.5,
          panels: [
            {
              shape: "jagged",
              label: "The moment it happens",
              art: art("burst", "The moment it happens, in concentration lines"),
              items: [{ type: "sfx", x: 18, y: 20, text: chapter.n % 2 ? "FWOOM" : "KRAK", size: "lg", rotate: -10 }],
            },
          ],
        },
      ],
    },
    {
      version: 1,
      format: "pocket",
      tiers: [
        {
          height: 2,
          panels: [
            {
              ink: true,
              label: "Night falls",
              art: art("night", "Night falls on a figure walking away"),
              items: [{ type: "caption", x: 50, y: 8, anchor: "top", text: "And the night went on." }],
            },
          ],
        },
        { panels: [{ label: "The view again", art: art("wide", "The opening view, later") }] },
      ],
    },
  ]
}

/* ---------- Screens ---------- */

type Screen = { name: "catalog" } | { name: "series"; id: string } | { name: "reader"; id: string; chapter: number }

/** A brush arrow (the base `mark-arrow` points up). */
function Arrow({ to }: { to: "left" | "right" }) {
  return <span aria-hidden className={cn("mark-arrow shrink-0 text-lg", to === "left" ? "-rotate-90" : "rotate-90")} />
}

function SectionTitle({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="font-letter text-2xl leading-none tracking-wide uppercase @2xl/site:text-3xl">
      {children}
    </h2>
  )
}

function seriesCover(s: Series, volume = s.volumes) {
  const img = cover(s.theme, volume, s.title)
  return s.obi ? <ObiBand cover={img} headline={s.obi} caption={`by ${AUTHOR}`} size="sm" className="size-full" /> : img
}

function Catalog({ open, read }: { open: (id: string) => void; read: (id: string, chapter: number) => void }) {
  const volumes: ShelfVolume[] = SERIES.flatMap((s) =>
    Array.from({ length: s.volumes }, (_, v) => ({
      id: `${s.id}-${v + 1}`,
      title: s.title,
      volume: v + 1,
      author: AUTHOR,
      cover: cover(s.theme, v + 1, s.title),
      status: s.status === "new" ? ("new" as const) : v + 1 < s.volumes || s.status === "completed" ? ("completed" as const) : s.status,
      thickness: (s.theme === "forge" ? 3 : s.theme === "boat" ? 1 : 2) as 1 | 2 | 3,
      spine: (s.theme === "lantern" ? "band" : s.theme === "forge" ? "tone" : "plain") as ShelfVolume["spine"],
    })),
  )
  const latest = SERIES.map((s) => ({ s, c: s.chapters[s.chapters.length - 1] }))
  return (
    <div className="grid gap-10">
      <section aria-labelledby="as-works" className="grid gap-4">
        <SectionTitle id="as-works">Works</SectionTitle>
        <ul className="m-0 grid list-none grid-cols-2 gap-x-4 gap-y-6 p-0 @2xl/site:grid-cols-3">
          {SERIES.map((s) => (
            <li key={s.id} className="min-w-0">
              <VolumeCard
                title={s.title}
                volume={s.volumes}
                author={s.altTitle}
                cover={seriesCover(s)}
                status={s.status}
                read={s.id === "lantern-street" ? 2 : 0}
                total={s.chapters.length}
                onSelect={() => open(s.id)}
              />
            </li>
          ))}
        </ul>
      </section>

      <div className="grid gap-10 @3xl/site:grid-cols-2">
        <section aria-labelledby="as-week" className="grid content-start gap-4">
          <SectionTitle id="as-week">This week</SectionTitle>
          <ReleaseCalendar
            today={2}
            layout="strip"
            releases={SERIES.flatMap((s) =>
              s.upcoming ? [{ id: `${s.id}-up`, day: s.upcoming.day, title: s.title, chapter: `Ch. ${s.upcoming.n} · ${s.upcoming.title}`, time: "18:00", status: "new" as "new" | "break" }] : [],
            ).concat([{ id: "tidal-forge-break", day: 4, title: "Tidal Forge", chapter: "Extra chapter", time: "12:00", status: "break" as const }])}
            onSelect={(r) => open(String(r.id).replace(/-(up|break)$/, ""))}
          />
        </section>
        <section aria-labelledby="as-latest" className="grid content-start gap-4">
          <SectionTitle id="as-latest">Most read this month</SectionTitle>
          <RankingList
            entries={[...SERIES]
              .sort((a, b) => parseFloat(b.readers) - parseFloat(a.readers))
              .map((s, i) => ({ id: s.id, title: s.title, subtitle: `${s.chapters.length} chapters`, score: `${s.readers} readers`, change: i === 2 ? ("new" as const) : i === 0 ? 0 : 1, cover: cover(s.theme, 1, s.title) }))}
            onSelect={(e) => open(e.id)}
          />
          <p className="text-sm">
            Latest chapters:{" "}
            {latest.map(({ s, c }, i) => (
              <React.Fragment key={`${s.id}-${c.n}`}>
                {i > 0 && " · "}
                <button type="button" onClick={() => read(s.id, c.n)} className="cursor-pointer font-letter uppercase underline decoration-2 underline-offset-4 hover:decoration-4 focus-ink">
                  {s.title} {c.n}
                </button>
              </React.Fragment>
            ))}
          </p>
        </section>
      </div>

      <section aria-labelledby="as-shelf" className="grid gap-4">
        <SectionTitle id="as-shelf">The shelf</SectionTitle>
        <Shelf volumes={volumes} openLabel="Series page" onOpen={(v) => open(String(v.id).replace(/-\d+$/, ""))} />
      </section>
    </div>
  )
}

function SeriesPage({ series, readUpTo, read, back }: { series: Series; readUpTo: number; read: (chapter: number) => void; back: () => void }) {
  const last = series.chapters[series.chapters.length - 1]
  const resume = Math.min(readUpTo + 1, last.n)
  return (
    <div className="grid gap-8">
      <SeriesHeader
        as="h2"
        title={series.title}
        altTitle={series.altTitle}
        author={`Story and art: ${AUTHOR}`}
        cover={seriesCover(series)}
        status={series.status}
        genres={series.genres}
        stats={[
          { label: "Chapters", value: series.chapters.length },
          { label: "Volumes", value: series.volumes },
          { label: "Readers", value: series.readers },
        ]}
        summary={series.summary}
        actions={
          <>
            <Button onClick={() => read(1)}>Start reading</Button>
            {readUpTo > 0 && (
              <Button variant="outline" onClick={() => read(resume)}>
                Continue · ch. {resume}
              </Button>
            )}
          </>
        }
      />

      <section aria-labelledby="as-chapters" className="grid gap-3">
        <SectionTitle id="as-chapters">Chapters</SectionTitle>
        <ol className="m-0 grid list-none ink-case p-0">
          {series.upcoming && (
            <li className="flex min-h-14 items-center gap-3 border-b-2 border-border px-3 py-2">
              <span className="w-10 shrink-0 font-sfx text-2xl leading-none tabular-nums">{series.upcoming.n}</span>
              <span className="grid min-w-0 flex-1">
                <span className="font-letter text-lg leading-tight break-words uppercase">{series.upcoming.title}</span>
                <span className="font-mono text-xs">Out on {series.upcoming.date}</span>
              </span>
            </li>
          )}
          {[...series.chapters].reverse().map((c) => {
            const done = c.n <= readUpTo
            return (
              <li key={c.n} className="border-b-2 border-border last:border-b-0">
                <button
                  type="button"
                  onClick={() => read(c.n)}
                  className="flex min-h-14 w-full cursor-pointer items-center gap-3 px-3 py-2 text-start hover-invert focus-ink press focus-visible:outline-offset-[-6px]! focus-visible:shadow-none!"
                >
                  <span className="w-10 shrink-0 font-sfx text-2xl leading-none tabular-nums">{c.n}</span>
                  <span className="grid min-w-0 flex-1">
                    <span className="font-letter text-lg leading-tight break-words uppercase">{c.title}</span>
                    <span className="font-mono text-xs">{c.date}</span>
                  </span>
                  {done ? (
                    <span className="flex shrink-0 items-center gap-1 font-mono text-xs">
                      <span aria-hidden className="mark-check text-lg" />
                      Read
                    </span>
                  ) : (
                    <Arrow to="right" />
                  )}
                </button>
              </li>
            )
          })}
        </ol>
      </section>

      {series.upcoming && (
        <section aria-labelledby="as-preview" className="grid gap-3">
          <SectionTitle id="as-preview">Next chapter preview</SectionTitle>
          <Spoiler label={`Chapter ${series.upcoming.n} preview`} className="block max-w-md">
            <img src={scene(series.theme, "burst", 99)} alt={`A preview panel of chapter ${series.upcoming.n}`} className="block w-full border-ink" />
          </Spoiler>
        </section>
      )}

      <div>
        <Button variant="outline" onClick={back}>
          <Arrow to="left" />
          All works
        </Button>
      </div>
    </div>
  )
}

function Reader({ series, chapter, go, toSeries }: { series: Series; chapter: Chapter; go: (n: number) => void; toSeries: () => void }) {
  const pages = React.useMemo(() => chapterPages(series, chapter), [series, chapter])
  const [settings, setSettings] = React.useState<ReaderSettingsValue>(defaultReaderSettings)
  const [mode, setMode] = React.useState<"pages" | "panels">("pages")
  const [page, setPage] = React.useState(0)
  const [sheet, setSheet] = React.useState<"pages" | "settings" | null>(null)
  React.useEffect(() => setPage(0), [chapter.n])
  const next = series.chapters.find((c) => c.n === chapter.n + 1)
  const end = (
    <ChapterEnd
      chapter={`Chapter ${chapter.n} · ${chapter.title}`}
      variant={!next && !series.upcoming ? "end" : "continued"}
      next={
        next
          ? { number: next.n, title: next.title, onSelect: () => go(next.n) }
          : series.upcoming
            ? { number: series.upcoming.n, title: series.upcoming.title, date: series.upcoming.date }
            : undefined
      }
    >
      <Button variant="outline" onClick={toSeries}>
        Back to the series
      </Button>
    </ChapterEnd>
  )
  const data = pages.map((p, i) => ({ page: p, alt: `Page ${i + 1}` }))
  const settingsButton = (
    <Button variant="outline" size="icon" aria-label="Reader settings" onClick={() => setSheet("settings")} className="max-sm:size-11">
      <Settings2 />
    </Button>
  )
  const tools = (
    <>
      <Button variant="outline" size="icon" aria-label="All pages" onClick={() => setSheet("pages")} className="max-sm:size-11">
        <LayoutGrid />
      </Button>
      {settingsButton}
    </>
  )
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="grid min-w-0 gap-1">
          <p className="font-mono text-xs">{series.title}</p>
          <h2 className="font-letter text-2xl leading-none break-words uppercase">
            Ch. {chapter.n} · {chapter.title}
          </h2>
        </div>
        <div role="group" aria-label="Reading mode" className="flex border-[length:var(--mg-bw)] border-border">
          {(["pages", "panels"] as const).map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={mode === m}
              onClick={() => setMode(m)}
              className="relative min-h-11 cursor-pointer border-s-[length:var(--mg-bw)] border-border px-3 font-letter text-sm uppercase first:border-s-0 aria-pressed:ink-fill aria-pressed:fill-in [&:hover:not([aria-pressed=true])]:hover-thicken focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-[-5px] focus-visible:outline-ring aria-pressed:focus-visible:outline-primary-foreground sm:min-h-9"
            >
              {m === "pages" ? "Page by page" : "Panel by panel"}
            </button>
          ))}
        </div>
      </div>

      {mode === "pages" ? (
        settings.mode === "strip" ? (
          <div className="grid gap-2">
            <div className="flex justify-end gap-1">{tools}</div>
            <div className="mx-auto grid w-full max-w-xl gap-3" data-reading={settings.direction}>
              {pages.map((p, i) => (
                <div key={i} className="border-ink">
                  <Page page={p} reading={settings.direction} label={`Page ${i + 1}`} />
                </div>
              ))}
              {end}
            </div>
          </div>
        ) : (
          <PageReader
            key={chapter.n}
            pages={data}
            page={page}
            onPageChange={setPage}
            direction={settings.direction}
            spread={settings.mode === "double" ? "double" : "auto"}
            fit={settings.fit}
            background={settings.background}
            toolbar={tools}
            end={end}
          />
        )
      ) : (
        <GuidedView key={chapter.n} pages={data} direction={settings.direction} end={end} toolbar={settingsButton} />
      )}

      <Sheet open={sheet !== null} onOpenChange={(o) => !o && setSheet(null)}>
        <SheetContent side="right" className="w-[min(24rem,100vw)] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{sheet === "pages" ? "All pages" : "Reader settings"}</SheetTitle>
            <SheetDescription>{sheet === "pages" ? `Chapter ${chapter.n}: jump to any page.` : "Order, mode, fit and background."}</SheetDescription>
          </SheetHeader>
          <div className="px-4 pb-6">
            {sheet === "pages" ? (
              <PageThumbnails
                pages={data}
                current={page}
                readUntil={page}
                direction={settings.direction}
                onSelect={(i) => {
                  setMode("pages")
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

/* ---------- The site ---------- */

export function AuthorSite({ className }: { className?: string }) {
  const [screen, setScreen] = React.useState<Screen>({ name: "catalog" })
  const [progress, setProgress] = React.useState<Record<string, number>>({ "lantern-street": 2 })
  const rootRef = React.useRef<HTMLDivElement>(null)
  const show = (next: Screen) => {
    setScreen(next)
    if (next.name === "reader") setProgress((p) => ({ ...p, [next.id]: Math.max(p[next.id] ?? 0, next.chapter) }))
    // a new screen starts at its top
    const el = rootRef.current
    if (el && el.getBoundingClientRect().top < 0) el.scrollIntoView({ block: "start" })
  }
  const series = screen.name === "catalog" ? null : SERIES.find((s) => s.id === screen.id) ?? null
  const chapter = screen.name === "reader" && series ? series.chapters.find((c) => c.n === screen.chapter) ?? series.chapters[0] : null

  return (
    <div ref={rootRef} data-manga="author-site" className={cn("@container/site w-full scroll-mt-16 bg-background text-foreground", className)}>
      <header className="flex flex-wrap items-center justify-between gap-3 border-b-[length:var(--mg-bw-panel)] border-border px-3 py-3 @2xl/site:px-6">
        <button type="button" onClick={() => show({ name: "catalog" })} className="cursor-pointer text-start focus-ink">
          <span className="block font-letter text-3xl leading-none tracking-wide uppercase">{AUTHOR}</span>
          <span className="block font-mono text-xs">Manga, one chapter at a time</span>
        </button>
        <nav aria-label="Site" className="flex flex-wrap gap-1">
          <Button variant={screen.name === "catalog" ? "default" : "ghost"} aria-current={screen.name === "catalog" ? "page" : undefined} onClick={() => show({ name: "catalog" })} className="max-sm:min-h-11">
            Works
          </Button>
          {series && (
            <Button variant={screen.name === "series" ? "default" : "ghost"} aria-current={screen.name === "series" ? "page" : undefined} onClick={() => show({ name: "series", id: series.id })} className="max-sm:min-h-11">
              {series.title}
            </Button>
          )}
        </nav>
      </header>

      <nav aria-label="Breadcrumb" className="px-3 pt-3 font-mono text-xs @2xl/site:px-6">
        <ol className="m-0 flex list-none flex-wrap gap-1 p-0">
          <li>
            <button type="button" onClick={() => show({ name: "catalog" })} className="cursor-pointer underline underline-offset-2 focus-ink">
              Works
            </button>
          </li>
          {series && (
            <li>
              /{" "}
              <button type="button" onClick={() => show({ name: "series", id: series.id })} className="cursor-pointer underline underline-offset-2 focus-ink" aria-current={screen.name === "series" ? "page" : undefined}>
                {series.title}
              </button>
            </li>
          )}
          {chapter && <li aria-current="page">/ Chapter {chapter.n}</li>}
        </ol>
      </nav>

      <main key={JSON.stringify(screen)} className="animate-slide-in px-3 pt-4 pb-10 @2xl/site:px-6">
        {screen.name === "catalog" && <Catalog open={(id) => show({ name: "series", id })} read={(id, n) => show({ name: "reader", id, chapter: n })} />}
        {screen.name === "series" && series && (
          <SeriesPage series={series} readUpTo={progress[series.id] ?? 0} read={(n) => show({ name: "reader", id: series.id, chapter: n })} back={() => show({ name: "catalog" })} />
        )}
        {screen.name === "reader" && series && chapter && (
          <Reader series={series} chapter={chapter} go={(n) => show({ name: "reader", id: series.id, chapter: n })} toSeries={() => show({ name: "series", id: series.id })} />
        )}
      </main>
    </div>
  )
}
