"use client"

/*
 * Author site: the site of one manga series, end to end — its volumes (two out, the next one coming), the
 * series page, then the chapter read page by page (PageReader) or panel by panel (GuidedView). Made only with
 * mangacn. Chapters are pages of the page model (PageData): panels, pictures and real lettering, so the reader and
 * the guided view work from the same data. The block ships no image: pass the covers and the panel pictures in
 * `art` (without them, covers are screentone and panels stay empty). Replace SERIES with your own series.
 * The demo never navigates: the three screens are one component's state.
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
import { ReadingProgress, useReadingPage } from "@/components/manga/reading-progress"
import { RankingList } from "@/components/manga/ranking-list"
import { ReaderSettings, defaultReaderSettings, type ReaderSettingsValue } from "@/components/manga/reader-settings"
import { ReleaseCalendar } from "@/components/manga/release-calendar"
import { SeriesHeader } from "@/components/manga/series-header"
import { Shelf, type ShelfVolume } from "@/components/manga/shelf"
import { Spoiler } from "@/components/manga/spoiler"
import { VolumeCard } from "@/components/manga/volume-card"

/* ---------- Pictures: passed in `art`, none ships with the block ---------- */

/** The panels of a chapter page, by what they show. */
export type AuthorSiteScene = "opening" | "rival" | "hero" | "detail" | "clash" | "pet" | "night" | "ending"

export type AuthorSiteArt = {
  /** Volume covers by volume number (1, 2, …), image URLs or any node; the volume after the last one out may have a teaser. */
  covers?: Record<number, React.ReactNode>
  /** One picture per kind of panel; the chapters reuse them. */
  scenes?: Partial<Record<AuthorSiteScene, string>>
}

const ArtContext = React.createContext<AuthorSiteArt>({})

/* ---------- The series ---------- */

type Chapter = { n: number; title: string; date: string; lines: [string, string, string] }
type Volume = { n: number; date: string; chapters: number[] }
type Series = {
  id: string
  title: string
  altTitle: string
  status: "ongoing" | "completed" | "hiatus" | "new"
  genres: string[]
  summary: string
  readers: string
  volumes: Volume[]
  chapters: Chapter[]
  /** The next chapter when it is not out yet. */
  upcoming?: { n: number; title: string; date: string; day: 0 | 1 | 2 | 3 | 4 | 5 | 6 }
  /** The next volume when it is not out yet. */
  nextVolume?: { n: number; date: string }
}

const AUTHOR = "Studio Mapless"

// One invented series. Replace it with your own.
const SERIES: Series = {
  id: "mapless",
  title: "Mapless",
  altTitle: "The cartographer of the drifting sky",
  status: "ongoing",
  genres: ["Adventure", "Fantasy"],
  summary:
    "Above the clouds the islands drift, and no map stays true for long. Suzu, an apprentice cartographer, draws the way as she walks: what her brush inks becomes real, bridges included. Kuro, a small dragon made of her ink, keeps watch while she sleeps. But every new road brings the Eraser, a white knight whose spear undoes whatever Suzu makes.",
  readers: "12.4k",
  volumes: [
    { n: 1, date: "Spring", chapters: [1, 2, 3] },
    { n: 2, date: "Autumn", chapters: [4, 5, 6] },
  ],
  chapters: [
    { n: 1, title: "The ink bridge", date: "Mar 1", lines: ["Day 41. No map shows this bridge.", "Nothing new gets drawn here.", "Then I'll draw it anyway!"] },
    { n: 2, title: "The white knight", date: "Mar 15", lines: ["He waits on every far cliff.", "Turn back, cartographer.", "Kuro, stay close."] },
    { n: 3, title: "The lighthouse", date: "Apr 1", lines: ["An old lighthouse, still lit.", "Who keeps it?", "Nobody. Not anymore."] },
    { n: 4, title: "A map that moves", date: "Sep 1", lines: ["The islands drifted in the night.", "My map is wrong again.", "Then we draw a new one."] },
    { n: 5, title: "Kuro sleeps", date: "Sep 15", lines: ["Even ink gets tired.", "Five more minutes…", "Fine. Four."] },
    { n: 6, title: "The spear falls", date: "Oct 1", lines: ["The bridge held. For a moment.", "What is drawn can be undone.", "Not this time!"] },
  ],
  upcoming: { n: 7, title: "Past the edge of the map", date: "Dec 3", day: 2 },
  nextVolume: { n: 3, date: "March" },
}

/** Three pages of page data for a chapter; the pictures come from `art.scenes`. */
function chapterPages(series: Series, chapter: Chapter, scenes: AuthorSiteArt["scenes"] = {}): PageData[] {
  const art = (kind: AuthorSiteScene, alt: string, extra: Partial<NonNullable<PanelData["art"]>> = {}) =>
    scenes[kind] ? { src: scenes[kind], alt, ...extra } : undefined
  const even = chapter.n % 2 === 0
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
              art: art(even ? "night" : "opening", `${series.title}: the opening view`),
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
            { width: 1.2, label: "A closer look", art: art(even ? "pet" : "detail", "A closer look at the thing that matters") },
            {
              label: "The knight speaks",
              art: art("rival", "The Eraser, spear in hand", { y: 30 }),
              items: [{ type: "bubble", x: 50, y: 12, text: chapter.lines[1], pointAt: { x: 50, y: 40 }, maxWidth: 85 }],
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
              label: "Suzu answers",
              art: art("hero", "Suzu, startled, Kuro rearing behind her"),
              items: [{ type: "bubble", x: 30, y: 14, text: chapter.lines[2], pointAt: { x: 62, y: 46 }, maxWidth: 50 }],
            },
            { label: "Kuro", shape: "tilted", art: art("pet", "Kuro, the ink dragon", { y: 45 }) },
          ],
        },
        {
          height: 1.5,
          panels: [
            {
              shape: "jagged",
              label: "The moment it happens",
              art: art("clash", "The spear meets the ink", { y: 60 }),
              items: [{ type: "sfx", x: 78, y: 20, text: even ? "KRAK" : "SPLASH", size: "lg", rotate: -10 }],
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
              art: art("ending", "Suzu looks into the night", { y: 30 }),
              items: [{ type: "caption", x: 50, y: 8, anchor: "top", text: "And the sky kept drifting." }],
            },
          ],
        },
        { panels: [{ label: "The view again", art: art(even ? "opening" : "night", "The view, later") }] },
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

function Catalog({ open, read, readUpTo }: { open: (id: string) => void; read: (id: string, chapter: number) => void; readUpTo: number }) {
  const { covers = {} } = React.useContext(ArtContext)
  const s = SERIES
  const shelf: ShelfVolume[] = s.volumes.map((v, i) => ({
    id: `${s.id}-${v.n}`,
    title: s.title,
    volume: v.n,
    author: AUTHOR,
    cover: covers[v.n],
    status: "completed" as const,
    read: v.chapters.filter((c) => c <= readUpTo).length,
    total: v.chapters.length,
    thickness: (i % 2 ? 3 : 2) as 1 | 2 | 3,
    spine: (i % 2 ? "tone" : "band") as ShelfVolume["spine"],
  }))
  const latest = s.chapters.slice(-3).reverse()
  return (
    <div className="grid gap-10">
      <section aria-labelledby="as-works" className="grid gap-4">
        <SectionTitle id="as-works">Volumes</SectionTitle>
        <ul className="m-0 grid list-none grid-cols-[repeat(2,minmax(0,16rem))] gap-x-4 gap-y-6 p-0 @2xl/site:grid-cols-[repeat(3,minmax(0,16rem))]">
          {s.volumes.map((v) => (
            <li key={v.n} className="min-w-0">
              <VolumeCard
                title={s.title}
                volume={v.n}
                author={`Out in ${v.date}`}
                cover={covers[v.n]}
                status={v.n === s.volumes.length ? s.status : "completed"}
                read={v.chapters.filter((c) => c <= readUpTo).length}
                total={v.chapters.length}
                onSelect={() => open(s.id)}
              />
            </li>
          ))}
          {s.nextVolume && (
            <li className="min-w-0">
              <ObiBand
                cover={covers[s.nextVolume.n]}
                headline="Coming soon"
                caption={`Vol. ${s.nextVolume.n} · ${s.nextVolume.date}`}
                size="sm"
                className="w-full"
              />
            </li>
          )}
        </ul>
      </section>

      <div className="grid gap-10 @3xl/site:grid-cols-2">
        <section aria-labelledby="as-week" className="grid content-start gap-4">
          <SectionTitle id="as-week">This week</SectionTitle>
          <ReleaseCalendar
            today={2}
            layout="strip"
            releases={[
              ...(s.upcoming ? [{ id: "up", day: s.upcoming.day, title: s.title, chapter: `Ch. ${s.upcoming.n} · ${s.upcoming.title}`, time: "18:00", status: "new" as const }] : []),
              { id: "break", day: 4, title: `${s.title}: extras`, chapter: "Sketchbook pages", time: "12:00", status: "break" as const },
            ]}
            onSelect={() => open(s.id)}
          />
        </section>
        <section aria-labelledby="as-latest" className="grid content-start gap-4">
          <SectionTitle id="as-latest">Most read this month</SectionTitle>
          <RankingList
            entries={[6, 1, 3].map((n, i) => {
              const c = s.chapters[n - 1]
              return { id: String(n), title: c.title, subtitle: `Chapter ${n}`, score: `${[9.8, 7.1, 5.4][i]}k readers`, change: i === 0 ? ("new" as const) : 0 }
            })}
            onSelect={(e) => read(s.id, Number(e.id))}
          />
          <p className="text-sm">
            Latest chapters:{" "}
            {latest.map((c, i) => (
              <React.Fragment key={c.n}>
                {i > 0 && " · "}
                <button type="button" onClick={() => read(s.id, c.n)} className="cursor-pointer font-letter uppercase underline decoration-2 underline-offset-4 hover:decoration-4 focus-ink">
                  Ch. {c.n}
                </button>
              </React.Fragment>
            ))}
          </p>
        </section>
      </div>

      <section aria-labelledby="as-shelf" className="grid gap-4">
        <SectionTitle id="as-shelf">The shelf</SectionTitle>
        <Shelf volumes={shelf} openLabel="Series page" onOpen={() => open(s.id)} />
      </section>
    </div>
  )
}

function SeriesPage({ series, readUpTo, read, back }: { series: Series; readUpTo: number; read: (chapter: number) => void; back: () => void }) {
  const { covers = {}, scenes = {} } = React.useContext(ArtContext)
  const last = series.chapters[series.chapters.length - 1]
  const resume = Math.min(readUpTo + 1, last.n)
  return (
    <div className="grid gap-8">
      <SeriesHeader
        as="h2"
        title={series.title}
        altTitle={series.altTitle}
        author={`Story and art: ${AUTHOR}`}
        cover={covers[series.volumes.length]}
        status={series.status}
        genres={series.genres}
        stats={[
          { label: "Chapters", value: series.chapters.length },
          { label: "Volumes", value: series.volumes.length },
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

      {series.upcoming && scenes.clash && (
        <section aria-labelledby="as-preview" className="grid gap-3">
          <SectionTitle id="as-preview">Next chapter preview</SectionTitle>
          <Spoiler label={`Chapter ${series.upcoming.n} preview`} className="block max-w-md">
            <img src={scenes.clash} alt={`A preview panel of chapter ${series.upcoming.n}`} className="block w-full border-ink" />
          </Spoiler>
        </section>
      )}

      <div>
        <Button variant="outline" onClick={back}>
          <Arrow to="left" />
          Home
        </Button>
      </div>
    </div>
  )
}

function Reader({ series, chapter, go, toSeries }: { series: Series; chapter: Chapter; go: (n: number) => void; toSeries: () => void }) {
  const { scenes } = React.useContext(ArtContext)
  const pages = React.useMemo(() => chapterPages(series, chapter, scenes), [series, chapter, scenes])
  const [settings, setSettings] = React.useState<ReaderSettingsValue>(defaultReaderSettings)
  const [mode, setMode] = React.useState<"pages" | "panels">("pages")
  const [page, setPage] = React.useState(0)
  const [sheet, setSheet] = React.useState<"pages" | "settings" | null>(null)
  React.useEffect(() => setPage(0), [chapter.n])
  // strip mode: the counter follows the reading line, and the page mode opens where the reader stopped
  const strip = mode === "pages" && settings.mode === "strip"
  const [reading, stripRef] = useReadingPage<HTMLDivElement>(pages.length)
  React.useEffect(() => {
    if (strip) setPage(reading)
  }, [strip, reading])
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
            <div ref={stripRef} key={chapter.n} className="mx-auto grid w-full max-w-xl gap-3" data-reading={settings.direction}>
              {pages.map((p, i) => (
                <div key={i} className="border-ink">
                  <Page page={p} reading={settings.direction} label={`Page ${i + 1}`} />
                </div>
              ))}
              {end}
            </div>
            <div className="sticky bottom-0 z-10 mx-auto w-full max-w-xl border-t-[length:var(--mg-bw)] border-border bg-background px-3 py-2">
              <ReadingProgress
                value={pages.length > 1 ? (reading / (pages.length - 1)) * 100 : 100}
                label={`Chapter ${chapter.n} progress`}
                showValue
                valueText={`Page ${reading + 1} / ${pages.length}`}
              />
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

export function AuthorSite({
  className,
  art = {},
}: {
  className?: string
  /** Covers and panel pictures (image URLs). The block ships none. */
  art?: AuthorSiteArt
}) {
  const [screen, setScreen] = React.useState<Screen>({ name: "catalog" })
  const [progress, setProgress] = React.useState<Record<string, number>>({ [SERIES.id]: 2 })
  const rootRef = React.useRef<HTMLDivElement>(null)
  const show = (next: Screen) => {
    setScreen(next)
    if (next.name === "reader") setProgress((p) => ({ ...p, [next.id]: Math.max(p[next.id] ?? 0, next.chapter) }))
    // a new screen starts at its top
    const el = rootRef.current
    if (el && el.getBoundingClientRect().top < 0) el.scrollIntoView({ block: "start" })
  }
  const series = screen.name === "catalog" ? null : SERIES
  const chapter = screen.name === "reader" && series ? series.chapters.find((c) => c.n === screen.chapter) ?? series.chapters[0] : null

  return (
    <ArtContext.Provider value={art}>
    <div ref={rootRef} data-manga="author-site" className={cn("@container/site w-full scroll-mt-16 bg-background text-foreground", className)}>
      <header className="flex flex-wrap items-center justify-between gap-3 border-b-[length:var(--mg-bw-panel)] border-border px-3 py-3 @2xl/site:px-6">
        <button type="button" onClick={() => show({ name: "catalog" })} className="cursor-pointer text-start focus-ink">
          <span className="block font-letter text-3xl leading-none tracking-wide uppercase">{SERIES.title}</span>
          <span className="block font-mono text-xs">By {AUTHOR}, one chapter at a time</span>
        </button>
        <nav aria-label="Site" className="flex flex-wrap gap-1">
          <Button variant={screen.name === "catalog" ? "default" : "ghost"} aria-current={screen.name === "catalog" ? "page" : undefined} onClick={() => show({ name: "catalog" })} className="max-sm:min-h-11">
            Home
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
              Home
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
        {screen.name === "catalog" && <Catalog open={(id) => show({ name: "series", id })} read={(id, n) => show({ name: "reader", id, chapter: n })} readUpTo={progress[SERIES.id] ?? 0} />}
        {screen.name === "series" && series && (
          <SeriesPage series={series} readUpTo={progress[series.id] ?? 0} read={(n) => show({ name: "reader", id: series.id, chapter: n })} back={() => show({ name: "catalog" })} />
        )}
        {screen.name === "reader" && series && chapter && (
          <Reader series={series} chapter={chapter} go={(n) => show({ name: "reader", id: series.id, chapter: n })} toSeries={() => show({ name: "series", id: series.id })} />
        )}
      </main>
    </div>
    </ArtContext.Provider>
  )
}
