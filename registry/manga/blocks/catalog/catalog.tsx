"use client"

/*
 * Catalog — a library shelf made only with mangacn: a search field (Input Group with an icon), shelf Tabs
 * (All / Reading / Completed / Wishlist), filters (genre Native Select, status Toggles, sort Native Select),
 * a grid of Volume Cards (pass the cover images in `covers`; none ships with the block), a result count and an Empty state when nothing matches.
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
type Genre = "Adventure" | "Fantasy" | "Comedy" | "Art book"

/** The books of the catalog, one key per cover: pass their image URLs in `covers`. */
export type CatalogCover = "mapless-1" | "mapless-2" | "mapless-3" | "side-stories-1" | "kuro-notebook-1" | "sketchbook-1"

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
  cover: CatalogCover
}

const SHELVES: { value: Shelf; label: string }[] = [
  { value: "all", label: "All" },
  { value: "reading", label: "Reading" },
  { value: "completed", label: "Completed" },
  { value: "wishlist", label: "Wishlist" },
]
const GENRES: Genre[] = ["Adventure", "Fantasy", "Comedy", "Art book"]
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

// One invented series, "Mapless": volumes 1 and 2 are out, volume 3 is coming; then its side books.
// The list order is the order they were added (newest first).
const VOLUMES: Volume[] = (
  [
    ["Mapless", 3, "Coming in March", "Adventure", "new", "wishlist", 0, 8, "mapless-3"],
    ["Mapless Sketchbook", 1, "Studio Mapless", "Art book", "new", "wishlist", 0, 1, "sketchbook-1"],
    ["Mapless", 2, "Studio Mapless", "Adventure", "ongoing", "reading", 3, 8, "mapless-2"],
    ["Kuro's notebook", 1, "Studio Mapless", "Comedy", "ongoing", "reading", 5, 12, "kuro-notebook-1"],
    ["Mapless: Side stories", 1, "Studio Mapless", "Fantasy", "hiatus", "reading", 2, 6, "side-stories-1"],
    ["Mapless", 1, "Studio Mapless", "Adventure", "completed", "completed", 8, 8, "mapless-1"],
  ] as const
).map(([title, volume, author, genre, status, shelf, read, total, cover], i) => ({
  id: i + 1,
  title,
  volume,
  author,
  genre,
  status,
  shelf,
  read,
  total,
  cover,
}))

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

export function Catalog({
  className,
  titleAs: TitleTag = "h1",
  covers,
}: {
  className?: string
  /** Covers by book: an image URL or any node. Without one, a card shows a screentone cover. */
  covers?: Partial<Record<CatalogCover, React.ReactNode>>
  /** The title's heading level: "h1" when the block is the page, "h2" inside a page that already has its h1. */
  titleAs?: "h1" | "h2"
}) {
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
            <p className="font-mono text-xs">Mapless · {VOLUMES.length} books on your shelves</p>
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
                          cover={covers?.[v.cover]}
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
