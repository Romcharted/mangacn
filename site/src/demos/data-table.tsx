import { useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@registry/manga/ui/data-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@registry/manga/ui/table"
import type { Example } from "../registry"
import { force, Tile, Tiles } from "../state-grid"

type Chapter = { id: number; title: string; pages: number; status: string; editor: string }

const chapters: Chapter[] = [
  { id: 1, title: "The long night", pages: 24, status: "Out", editor: "Mei" },
  { id: 2, title: "After the rain", pages: 31, status: "Out", editor: "Hana" },
  { id: 3, title: "Harbour", pages: 18, status: "Draft", editor: "Ren" },
  { id: 4, title: "Paper lanterns", pages: 27, status: "Out", editor: "Mei" },
  { id: 5, title: "The quiet road", pages: 22, status: "Draft", editor: "Sora" },
  { id: 6, title: "Return", pages: 35, status: "Planned", editor: "Hana" },
  { id: 7, title: "Low tide", pages: 20, status: "Out", editor: "Ren" },
  { id: 8, title: "Signal fire", pages: 29, status: "Draft", editor: "Sora" },
  { id: 9, title: "The ferry", pages: 26, status: "Out", editor: "Mei" },
  { id: 10, title: "Ink and salt", pages: 33, status: "Planned", editor: "Hana" },
  { id: 11, title: "Market day", pages: 19, status: "Out", editor: "Ren" },
  { id: 12, title: "Ash weather", pages: 25, status: "Draft", editor: "Sora" },
  { id: 13, title: "Last train", pages: 30, status: "Out", editor: "Mei" },
  { id: 14, title: "Borrowed umbrella", pages: 17, status: "Planned", editor: "Hana" },
  { id: 15, title: "The bell tower", pages: 28, status: "Draft", editor: "Ren" },
  { id: 16, title: "Morning bread", pages: 21, status: "Out", editor: "Sora" },
]

const columns: ColumnDef<Chapter>[] = [
  { accessorKey: "title", header: "Chapter" },
  { accessorKey: "pages", header: "Pages" },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "editor", header: "Editor" },
]

// On phones the Prev / Next buttons and the filter field are at least 44px tall (sm: back to the kit size).
const TOUCH = "grid min-w-0 gap-4 [&_input]:min-h-11 sm:[&_input]:min-h-8 [&_button:not([role=checkbox])]:min-h-11 sm:[&_button:not([role=checkbox])]:min-h-8"

export const previewWide = true

export function Preview() {
  const [picked, setPicked] = useState<Chapter[]>([])
  return (
    <div className={TOUCH}>
      <DataTable columns={columns} data={chapters} filterColumn="title" pageSize={6} onSelectionChange={setPicked} />
      <p className="text-sm">
        {picked.length ? `${picked.length} chapter${picked.length > 1 ? "s" : ""} queued for the next print run.` : "Tick chapters to queue them for print."}
      </p>
    </div>
  )
}

function Sorting() {
  return (
    <div className={TOUCH}>
      <DataTable columns={columns} data={chapters.slice(0, 8)} pageSize={4} />
    </div>
  )
}

function Filtering() {
  return (
    <div className={TOUCH}>
      <DataTable columns={columns} data={chapters} filterColumn="editor" pageSize={5} />
    </div>
  )
}

function ColumnMenu() {
  return (
    <div className={TOUCH}>
      <DataTable columns={columns} data={chapters.slice(0, 6)} pageSize={6} />
    </div>
  )
}

// meta.card places each column on a phone: the status becomes the badge on the card's end side.
const phoneColumns: ColumnDef<Chapter>[] = [
  { accessorKey: "title", header: "Chapter" },
  { accessorKey: "pages", header: "Pages" },
  { accessorKey: "status", header: "Status", meta: { card: "badge" } },
  { accessorKey: "editor", header: "Editor" },
]

function PhoneLayout() {
  return (
    <div className={TOUCH}>
      <DataTable columns={phoneColumns} data={chapters.slice(0, 4)} pageSize={4} cardsBelow={2000} />
    </div>
  )
}

export const examples: Example[] = [
  { fn: "Sorting", title: "Sorting", description: "Click a header to sort; the brush arrow shows the direction and a second click reverses it.", Component: Sorting, wide: true },
  { fn: "Filtering", title: "Filtering", description: "filterColumn names the column the Filter field searches: here the editor, so type Mei or Sora.", Component: Filtering, wide: true },
  { fn: "ColumnMenu", title: "Column menu", description: "The Columns menu lists every column; untick one to hide it. The selection column always stays.", Component: ColumnMenu, wide: true },
  { fn: "PhoneLayout", title: "Phone layout", description: "cardsBelow sets the width under which each row becomes a card; here it is forced, and meta.card puts the status as a badge.", Component: PhoneLayout, wide: true },
]

/** Header cell with a frozen sort mark. */
function Sorted({ children, sort }: { children: string; sort: "ascending" | "descending" | "none" }) {
  return (
    <TableHead sort={sort} onSort={() => {}}>
      {children}
    </TableHead>
  )
}

export function States() {
  return (
    <Tiles>
      <Tile label="row · rest, hover, selected" size="lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Chapter</TableHead>
              <TableHead>Pages</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>The long night</TableCell>
              <TableCell>24</TableCell>
            </TableRow>
            <TableRow {...force("hover")}>
              <TableCell>After the rain</TableCell>
              <TableCell>31</TableCell>
            </TableRow>
            <TableRow data-state="selected">
              <TableCell>Harbour</TableCell>
              <TableCell>18</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Tile>
      <Tile label="header · sort none, ascending, descending" size="lg">
        <Table>
          <TableHeader>
            <TableRow>
              <Sorted sort="none">Pages</Sorted>
              <Sorted sort="ascending">Pages</Sorted>
              <Sorted sort="descending">Pages</Sorted>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>18</TableCell>
              <TableCell>18</TableCell>
              <TableCell>35</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Tile>
      <Tile label="empty · nothing matches" size="full">
        <DataTable columns={columns} data={[]} filterColumn="title" />
      </Tile>
    </Tiles>
  )
}

export function Thumb() {
  return (
    <div className="w-52 text-sm">
      <Table className="text-sm">
        <TableHeader>
          <TableRow>
            <TableHead className="h-8 text-sm">Chapter</TableHead>
            <TableHead className="h-8 text-sm">Pp.</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {chapters.slice(0, 2).map((c) => (
            <TableRow key={c.id}>
              <TableCell className="py-1">{c.title}</TableCell>
              <TableCell className="py-1">{c.pages}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
