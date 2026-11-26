"use client"

/*
 * Catalog — a library shelf made only with mangacn: a search field (Input Group with an icon), shelf Tabs
 * (All / Reading / Completed / Wishlist), filters (genre Native Select, status Toggles, sort Native Select),
 * a grid of Volume Cards with covers drawn in SVG, a result count and an Empty state when nothing matches.
 * Phones: one column, the filters open in a bottom Drawer from a "Filters" button, two cards per row.
 * From 48rem of its own width (container query) the filters sit in a case beside the grid.
 */
import * as React from "react"
import { Search, SlidersHorizontal, X } from "lucide-react"

import { Badge } from "@/components/ui/manga/badge"
import { Button } from "@/components/ui/manga/button"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/manga/drawer"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMark, EmptyTitle } from "@/components/ui/manga/empty"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/manga/input-group"
import { Label } from "@/components/ui/manga/label"
import { NativeSelect, NativeSelectOption } from "@/components/ui/manga/native-select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/manga/tabs"
import { Toggle } from "@/components/ui/manga/toggle"
import { VolumeCard, type VolumeStatus } from "@/components/manga/volume-card"
import { cn } from "cn"

type Shelf = "all" | "reading" | "completed" | "wishlist"
type Sort = "added" | "title" | "progress" | "volume"
type Genre = "Action" | "Fantasy" | "Mystery" | "Romance" | "Sci-fi" | "Slice of life"
type Motif =
  | "moon"
  | "waves"
  | "blade"
  | "rays"
  | "rain"
  | "mountain"
  | "gear"
  | "lantern"
  | "stars"
  | "grid"
  | "horizon"
  | "road"
  | "orbit"
  | "spiral"

type Volume = {
  id: number
  title: string
  volume: number
  author: string
  genre: Genre
  status: VolumeStatus
  shelf: Exclude<Shelf, "all">
  read: number
  total: number
  motif: Motif
}

const SHELVES: { value: Shelf; label: string }[] = [
  { value: "all", label: "All" },
  { value: "reading", label: "Reading" },
  { value: "completed", label: "Completed" },
  { value: "wishlist", label: "Wishlist" },
]
const GENRES: Genre[] = ["Action", "Fantasy", "Mystery", "Romance", "Sci-fi", "Slice of life"]
const STATUSES: { value: VolumeStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "ongoing", label: "Ongoing" },
  { value: "completed", label: "Completed" },
  { value: "hiatus", label: "Hiatus" },
]
const SORTS: { value: Sort; label: string }[] = [
  { value: "added", label: "Newest" },
  { value: "title", label: "Title A–Z" },
  { value: "progress", label: "Most read" },
  { value: "volume", label: "Vol. number" },
]

// Invented series. The list order is the order they were added (newest first).
const VOLUMES: Volume[] = (
  [
    ["Starfall Dormitory", 2, "Rina Okada", "Romance", "new", "wishlist", 0, 6, "stars"],
    ["Ninth Blade", 2, "Ren Tsukada", "Action", "new", "wishlist", 0, 10, "blade"],
    ["Tide Archive", 3, "Sora Imai", "Fantasy", "ongoing", "reading", 7, 9, "waves"],
    ["Midnight Bakery Club", 1, "Yuki Arai", "Romance", "ongoing", "reading", 6, 7, "moon"],
    ["Static Garden", 1, "Kai Nomura", "Mystery", "new", "wishlist", 0, 8, "rain"],
    ["Paper Lantern Road", 2, "Hana Kuroe", "Slice of life", "ongoing", "reading", 5, 8, "road"],
    ["Ninth Blade", 1, "Ren Tsukada", "Action", "ongoing", "reading", 3, 10, "rays"],
    ["Signal Lost", 5, "Emi Kawase", "Sci-fi", "completed", "completed", 11, 11, "grid"],
    ["The Last Ferry", 1, "Nao Fujimura", "Mystery", "ongoing", "reading", 1, 9, "horizon"],
    ["Clockwork Heron", 2, "Mio Hasegawa", "Sci-fi", "hiatus", "reading", 2, 12, "orbit"],
    ["Hollow Mountain", 1, "Jun Sakai", "Fantasy", "hiatus", "wishlist", 0, 9, "mountain"],
    ["Ash and Ember", 4, "Toru Ishida", "Action", "completed", "completed", 10, 10, "spiral"],
    ["Clockwork Heron", 1, "Mio Hasegawa", "Sci-fi", "completed", "completed", 12, 12, "gear"],
    ["Paper Lantern Road", 1, "Hana Kuroe", "Slice of life", "completed", "completed", 8, 8, "lantern"],
  ] as const
).map(([title, volume, author, genre, status, shelf, read, total, motif], i) => ({
  id: i + 1,
  title,
  volume,
  author,
  genre,
  status,
  shelf,
  read,
  total,
  motif,
}))

/* ---------- Covers: abstract drawings in ink and paper (viewBox 120 × 180, a 2:3 cover) ---------- */

const ART: Record<Motif, (tone: string) => React.ReactNode> = {
  moon: (tone) => (
    <>
      <rect width="120" height="130" fill={tone} stroke="none" />
      <circle cx="72" cy="62" r="28" className="fill-background" strokeWidth="3" />
      <circle cx="62" cy="56" r="24" fill="currentColor" stroke="none" />
      <rect y="128" width="120" height="52" fill="currentColor" stroke="none" />
      {[140, 152, 164].map((y) => (
        <line key={y} x1={y / 6} y1={y} x2={120 - y / 6} y2={y} className="stroke-background" strokeWidth="2" />
      ))}
    </>
  ),
  waves: (tone) => (
    <>
      <circle cx="88" cy="40" r="22" fill={tone} strokeWidth="3" />
      {[78, 94, 110, 126, 142, 158, 174].map((y) => (
        <path key={y} d={`M-10 ${y} q15 -12 30 0 t30 0 t30 0 t30 0 t30 0`} strokeWidth="3" />
      ))}
    </>
  ),
  blade: (tone) => (
    <>
      <rect width="120" height="180" fill={tone} stroke="none" />
      <path d="M-10 150 L130 18 L130 46 L-10 178 Z" fill="currentColor" stroke="none" />
      <line x1="-10" y1="164" x2="130" y2="32" className="stroke-background" strokeWidth="2" />
      {[128, 144, 160].map((y) => (
        <line key={y} x1={y - 50} y1={y} x2="120" y2={y} className="stroke-background" strokeWidth="5" />
      ))}
    </>
  ),
  rays: () => (
    <>
      {Array.from({ length: 24 }, (_, i) => {
        const a = (i * Math.PI) / 12
        return (
          <line
            key={i}
            x1={60 + Math.cos(a) * 22}
            y1={100 + Math.sin(a) * 22}
            x2={60 + Math.cos(a) * 150}
            y2={100 + Math.sin(a) * 150}
            strokeWidth={i % 2 ? 2 : 5}
          />
        )
      })}
      <circle cx="60" cy="100" r="15" fill="currentColor" stroke="none" />
    </>
  ),
  rain: () => (
    <>
      <rect width="120" height="180" fill="currentColor" stroke="none" />
      {Array.from({ length: 48 }, (_, i) => {
        const x = 6 + (i % 8) * 15 + (Math.floor(i / 8) % 2) * 7
        const y = 8 + Math.floor(i / 8) * 22
        return <line key={i} x1={x} y1={y} x2={x - 3} y2={y + 12} className="stroke-background" strokeWidth="2" />
      })}
      <ellipse cx="60" cy="162" rx="40" ry="7" className="stroke-background" strokeWidth="2" />
    </>
  ),
  mountain: (tone) => (
    <>
      <rect width="120" height="120" fill={tone} stroke="none" />
      <path d="M0 150 L38 66 L62 112 L88 74 L120 132 L120 180 L0 180 Z" fill="currentColor" stroke="none" />
      <path d="M38 66 L48 88 L42 84 L34 92 L29 86 Z" className="fill-background" stroke="none" />
      <path d="M88 74 L97 90 L91 88 L85 95 L81 85 Z" className="fill-background" stroke="none" />
    </>
  ),
  gear: (tone) => (
    <>
      <rect y="120" width="120" height="60" fill={tone} stroke="none" />
      <circle cx="60" cy="92" r="40" strokeWidth="12" strokeDasharray="9 7" />
      <circle cx="60" cy="92" r="30" className="fill-background" strokeWidth="3" />
      <circle cx="60" cy="92" r="9" fill="currentColor" stroke="none" />
      {[0, 60, 120].map((r) => (
        <line key={r} x1="60" y1="66" x2="60" y2="118" strokeWidth="3" transform={`rotate(${r} 60 92)`} />
      ))}
    </>
  ),
  lantern: () => (
    <>
      <rect width="120" height="180" fill="currentColor" stroke="none" />
      <line x1="60" y1="0" x2="60" y2="48" className="stroke-background" strokeWidth="2" />
      <rect x="46" y="46" width="28" height="8" className="fill-background" stroke="none" />
      <rect x="46" y="134" width="28" height="8" className="fill-background" stroke="none" />
      <ellipse cx="60" cy="94" rx="32" ry="42" className="fill-background" stroke="none" />
      {[10, 20].map((rx) => (
        <ellipse key={rx} cx="60" cy="94" rx={rx} ry="42" strokeWidth="2" />
      ))}
      <line x1="60" y1="52" x2="60" y2="136" strokeWidth="2" />
      <line x1="60" y1="142" x2="60" y2="170" className="stroke-background" strokeWidth="3" />
    </>
  ),
  stars: () => (
    <>
      <rect width="120" height="180" fill="currentColor" stroke="none" />
      {(
        [
          [30, 40, 14],
          [86, 62, 22],
          [52, 112, 10],
          [96, 140, 12],
          [22, 150, 8],
          [70, 24, 6],
        ] as const
      ).map(([x, y, s]) => (
        <path
          key={`${x}-${y}`}
          d={`M${x} ${y - s} L${x + s / 4} ${y - s / 4} L${x + s} ${y} L${x + s / 4} ${y + s / 4} L${x} ${y + s} L${x - s / 4} ${y + s / 4} L${x - s} ${y} L${x - s / 4} ${y - s / 4} Z`}
          className="fill-background"
          stroke="none"
        />
      ))}
    </>
  ),
  grid: (tone) => (
    <>
      <rect width="120" height="84" fill={tone} stroke="none" />
      <circle cx="60" cy="84" r="24" className="fill-background" strokeWidth="3" />
      <line x1="0" y1="84" x2="120" y2="84" strokeWidth="3" />
      {[-140, -80, -40, -12, 12, 40, 80, 140].map((dx) => (
        <line key={dx} x1="60" y1="84" x2={60 + dx * 1.4} y2="180" strokeWidth="2" />
      ))}
      {[92, 104, 122, 150].map((y) => (
        <line key={y} x1="0" y1={y} x2="120" y2={y} strokeWidth="2" />
      ))}
    </>
  ),
  horizon: () => (
    <>
      <circle cx="60" cy="96" r="34" fill="currentColor" stroke="none" />
      <rect y="96" width="120" height="84" className="fill-background" stroke="none" />
      {[96, 106, 118, 132, 148, 166].map((y, i) => (
        <line key={y} x1="0" y1={y} x2="120" y2={y} strokeWidth={i === 0 ? 3 : 2} strokeDasharray={i ? `${24 - i * 3} ${6 + i}` : undefined} />
      ))}
      <path d="M30 128 L64 128 L58 136 L36 136 Z" fill="currentColor" stroke="none" />
      <line x1="46" y1="128" x2="46" y2="108" strokeWidth="2" />
    </>
  ),
  road: (tone) => (
    <>
      <rect width="120" height="80" fill={tone} stroke="none" />
      <line x1="0" y1="80" x2="120" y2="80" strokeWidth="3" />
      <path d="M54 80 L66 80 L118 180 L2 180 Z" fill="currentColor" stroke="none" />
      <line x1="60" y1="84" x2="60" y2="180" className="stroke-background" strokeWidth="3" strokeDasharray="10 8" />
      {[24, 44, 92, 100].map((x) => (
        <g key={x}>
          <line x1={x} y1={x < 60 ? 42 : 46} x2={x} y2="80" strokeWidth="2" />
          <rect x={x - 5} y={x < 60 ? 34 : 38} width="10" height="12" className="fill-background" strokeWidth="2" />
        </g>
      ))}
    </>
  ),
  orbit: () => (
    <>
      <rect width="120" height="180" fill="currentColor" stroke="none" />
      {[24, 38, 52].map((rx, i) => (
        <ellipse
          key={rx}
          cx="60"
          cy="92"
          rx={rx}
          ry={rx * 1.5}
          className="stroke-background"
          strokeWidth="2"
          strokeDasharray={i === 1 ? "6 5" : undefined}
          transform="rotate(-24 60 92)"
        />
      ))}
      <circle cx="60" cy="92" r="12" className="fill-background" stroke="none" />
      <circle cx="94" cy="44" r="5" className="fill-background" stroke="none" />
    </>
  ),
  spiral: (tone) => (
    <>
      <rect width="120" height="180" fill={tone} stroke="none" />
      <rect x="14" y="34" width="92" height="112" className="fill-background" strokeWidth="3" />
      <path
        d="M60 90 m0 -4 a4 4 0 1 1 -4 4 a8 8 0 0 1 8 -8 a12 12 0 0 1 12 12 a16 16 0 0 1 -16 16 a20 20 0 0 1 -20 -20 a24 24 0 0 1 24 -24 a28 28 0 0 1 28 28 a32 32 0 0 1 -32 32"
        strokeWidth="4"
      />
    </>
  ),
}

function Cover({ motif }: { motif: Motif }) {
  const id = `tone-${React.useId().replace(/[^a-zA-Z0-9]/g, "")}`
  return (
    <svg
      viewBox="0 0 120 180"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      className="block size-full text-foreground"
      fill="none"
      stroke="currentColor"
    >
      <defs>
        {/* Screentone: dots at 45°, as on a printed page. */}
        <pattern id={id} width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <circle cx="2.5" cy="2.5" r="1.1" fill="currentColor" stroke="none" />
        </pattern>
      </defs>
      <rect width="120" height="180" className="fill-background" stroke="none" />
      {ART[motif](`url(#${id})`)}
    </svg>
  )
}

/* ---------- Filters (the same fields inline from 48rem, in a drawer below) ---------- */

type FilterProps = {
  idBase: string
  genre: string
  setGenre: (genre: string) => void
  statuses: VolumeStatus[]
  toggleStatus: (status: VolumeStatus, on: boolean) => void
}

function FilterFields({ idBase, genre, setGenre, statuses, toggleStatus }: FilterProps) {
  return (
    <div className="grid gap-5">
      <div className="grid gap-2">
        <Label htmlFor={`${idBase}-genre`}>Genre</Label>
        <NativeSelect id={`${idBase}-genre`} value={genre} onChange={(e) => setGenre(e.target.value)} className="w-full!">
          <NativeSelectOption value="">All genres</NativeSelectOption>
          {GENRES.map((g) => (
            <NativeSelectOption key={g} value={g}>
              {g}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </div>
      <fieldset className="grid gap-2">
        <legend className="mb-2 font-letter text-base leading-none tracking-wide uppercase">Status</legend>
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <Toggle
              key={s.value}
              variant="outline"
              size="sm"
              pressed={statuses.includes(s.value)}
              onPressedChange={(on: boolean) => toggleStatus(s.value, on)}
              className="max-sm:h-11 max-sm:px-3"
            >
              {s.label}
            </Toggle>
          ))}
        </div>
      </fieldset>
    </div>
  )
}

const plural = (n: number) => (n === 1 ? "1 volume" : `${n} volumes`)
const noNav = (e: React.MouseEvent) => e.preventDefault()

export function Catalog({ className, titleAs: TitleTag = "h1" }: { className?: string; /** The title's heading level: "h1" when the block is the page, "h2" inside a page that already has its h1. */ titleAs?: "h1" | "h2" }) {
  const id = React.useId()
  const [query, setQuery] = React.useState("")
  const [shelf, setShelf] = React.useState<Shelf>("all")
  const [genre, setGenre] = React.useState("")
  const [statuses, setStatuses] = React.useState<VolumeStatus[]>([])
  const [sort, setSort] = React.useState<Sort>("added")
  const [drawer, setDrawer] = React.useState(false)

  const toggleStatus = (status: VolumeStatus, on: boolean) =>
    setStatuses((all) => (on ? [...all.filter((s) => s !== status), status] : all.filter((s) => s !== status)))
  const resetFilters = () => {
    setGenre("")
    setStatuses([])
  }
  const resetAll = () => {
    resetFilters()
    setQuery("")
  }

  const active = (genre ? 1 : 0) + statuses.length

  const shown = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = VOLUMES.filter(
      (v) =>
        (shelf === "all" || v.shelf === shelf) &&
        (!genre || v.genre === genre) &&
        (!statuses.length || statuses.includes(v.status)) &&
        (!q || `${v.title} ${v.author} ${v.genre}`.toLowerCase().includes(q)),
    )
    const byTitle = (a: Volume, b: Volume) => a.title.localeCompare(b.title) || a.volume - b.volume
    if (sort === "title") return [...list].sort(byTitle)
    if (sort === "volume") return [...list].sort((a, b) => a.volume - b.volume || byTitle(a, b))
    if (sort === "progress") return [...list].sort((a, b) => b.read / b.total - a.read / a.total || byTitle(a, b))
    return list
  }, [query, shelf, genre, statuses, sort])

  const filters = { genre, setGenre, statuses, toggleStatus }
  const summary = [genre, ...STATUSES.filter((s) => statuses.includes(s.value)).map((s) => s.label)].filter(Boolean)

  return (
    <div data-manga="catalog" className={cn("@container/main w-full bg-background text-foreground", className)}>
      <div className="grid gap-5 p-4 @3xl/main:p-6">
        <header className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
          <div className="grid gap-1">
            <p className="font-mono text-xs">Inkwell Library · {VOLUMES.length} volumes on your shelves</p>
            <TitleTag className="font-letter text-4xl leading-none tracking-wide uppercase @3xl/main:text-5xl">Catalog</TitleTag>
          </div>
          <p className="text-sm">
            {VOLUMES.filter((v) => v.shelf === "reading").length} in progress ·{" "}
            {VOLUMES.filter((v) => v.shelf === "wishlist").length} wished for
          </p>
        </header>

        <InputGroup className="@3xl/main:max-w-xl">
          <InputGroupAddon>
            <Search aria-hidden />
          </InputGroupAddon>
          <InputGroupInput
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a title, an author, a genre…"
            aria-label="Search the catalog"
          />
          {query && (
            <InputGroupAddon align="inline-end">
              <InputGroupButton size="icon-xs" aria-label="Clear the search" onClick={() => setQuery("")}>
                <X aria-hidden />
              </InputGroupButton>
            </InputGroupAddon>
          )}
        </InputGroup>

        <div className="grid gap-6 @3xl/main:grid-cols-[14rem_minmax(0,1fr)] @3xl/main:items-start">
          {/* Wide: the filters sit in a case beside the grid. Phones: the same fields open in the drawer. */}
          <aside aria-labelledby={`${id}-filters`} className="relative hidden ink-case p-4 @3xl/main:grid @3xl/main:gap-4">
            <h2 id={`${id}-filters`} className="font-letter text-xl leading-none tracking-wide uppercase">
              Filters
            </h2>
            <FilterFields idBase={`${id}-inline`} {...filters} />
            {active > 0 && (
              <Button variant="link" size="sm" onClick={resetFilters} className="justify-self-start">
                Reset filters
              </Button>
            )}
          </aside>

          <Tabs variant="underline" value={shelf} onValueChange={(value) => setShelf(value as Shelf)} className="min-w-0 gap-0">
            <TabsList aria-label="Shelves" className="max-sm:gap-1">
              {SHELVES.map((s) => (
                <TabsTrigger key={s.value} value={s.value} className="max-sm:min-h-11 max-sm:px-1.5">
                  {s.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
              <Button variant="outline" onClick={() => setDrawer(true)} className="max-sm:h-11 @3xl/main:hidden">
                <SlidersHorizontal aria-hidden />
                Filters
                {active > 0 && (
                  <Badge>
                    {active}
                    <span className="sr-only"> active</span>
                  </Badge>
                )}
              </Button>
              <p aria-live="polite" className="order-last basis-full text-sm @3xl/main:order-none @3xl/main:basis-auto">
                <span className="font-letter text-base tracking-wide uppercase">{shown.length ? plural(shown.length) : "No volumes"}</span>
                {summary.length > 0 && <span> · {summary.join(", ")}</span>}
              </p>
              <div className="ms-auto flex min-w-0 flex-1 items-center justify-end gap-2 @3xl/main:flex-none">
                <Label htmlFor={`${id}-sort`} className="@max-md/main:sr-only">
                  Sort
                </Label>
                <NativeSelect
                  id={`${id}-sort`}
                  value={sort}
                  onChange={(e) => setSort(e.target.value as Sort)}
                  className="min-w-0 flex-1 @3xl/main:flex-none"
                >
                  {SORTS.map((s) => (
                    <NativeSelectOption key={s.value} value={s.value}>
                      {s.label}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </div>
            </div>

            {SHELVES.map((s) => (
              <TabsContent key={s.value} value={s.value} className="@container/results">
                {shown.length ? (
                  <ul className="grid grid-cols-2 gap-x-3 gap-y-4 pe-1.5 pb-1.5 @md/results:grid-cols-3 @2xl/results:grid-cols-4 @4xl/results:grid-cols-5">
                    {shown.map((v) => (
                      <li key={v.id} className="min-w-0">
                        <VolumeCard
                          title={v.title}
                          volume={v.volume}
                          author={v.author}
                          status={v.status}
                          cover={<Cover motif={v.motif} />}
                          read={v.read}
                          total={v.shelf === "wishlist" ? undefined : v.total}
                          href="#"
                          onClick={noNav}
                          className="h-full"
                        />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Empty className="max-sm:p-5">
                    <EmptyHeader>
                      <EmptyMark />
                      <EmptyTitle>Nothing on this shelf</EmptyTitle>
                      <EmptyDescription>
                        No volume matches {query ? `“${query.trim()}”` : "these filters"}
                        {shelf === "all" ? "" : ` in ${SHELVES.find((x) => x.value === shelf)?.label}`}.
                      </EmptyDescription>
                    </EmptyHeader>
                    {(query || active > 0) && (
                      <EmptyContent>
                        <Button variant="outline" onClick={resetAll} className="max-sm:h-11">
                          Clear search and filters
                        </Button>
                      </EmptyContent>
                    )}
                  </Empty>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>

      <Drawer open={drawer} onOpenChange={(open: boolean) => setDrawer(open)}>
        <DrawerContent>
          <div className="mx-auto flex w-full max-w-md flex-col">
            <DrawerHeader>
              <DrawerTitle>Filters</DrawerTitle>
              <DrawerDescription>{shown.length ? `${plural(shown.length)} match.` : "No volume matches yet."}</DrawerDescription>
            </DrawerHeader>
            <div className="px-4 pb-4">
              <FilterFields idBase={`${id}-drawer`} {...filters} />
            </div>
            <DrawerFooter>
              <Button fullWidth onClick={() => setDrawer(false)} className="max-sm:h-11">
                Show {plural(shown.length)}
              </Button>
              <Button variant="outline" fullWidth onClick={resetFilters} disabled={!active} className="max-sm:h-11">
                Reset filters
              </Button>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
