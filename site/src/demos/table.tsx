import { useState } from "react"
import { Checkbox } from "@registry/manga/ui/checkbox"
import { Table, TableBody, TableCell, TableEmpty, TableHead, TableHeader, TableLoading, TableRow } from "@registry/manga/ui/table"
import { force, Tile, Tiles } from "../state-grid"

const chapters = [
  { id: 1, title: "The long night", pages: 24, status: "Out" },
  { id: 2, title: "After the rain", pages: 31, status: "Out" },
  { id: 3, title: "Harbour", pages: 18, status: "Draft" },
  { id: 4, title: "Paper lanterns", pages: 27, status: "Out" },
  { id: 5, title: "The quiet road", pages: 22, status: "Draft" },
  { id: 6, title: "Return", pages: 35, status: "Planned" },
]

type Sort = "ascending" | "descending"

export function Preview() {
  const [sort, setSort] = useState<Sort>("ascending")
  const [selected, setSelected] = useState<number[]>([2])
  const rows = [...chapters].sort((a, b) => (sort === "ascending" ? a.pages - b.pages : b.pages - a.pages))
  const toggle = (id: number) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10">
            <span className="sr-only">Select</span>
          </TableHead>
          <TableHead>Chapter</TableHead>
          <TableHead sort={sort} onSort={() => setSort((s) => (s === "ascending" ? "descending" : "ascending"))}>
            Pages
          </TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((c) => (
          <TableRow key={c.id} data-state={selected.includes(c.id) ? "selected" : undefined}>
            <TableCell>
              <Checkbox checked={selected.includes(c.id)} onCheckedChange={() => toggle(c.id)} aria-label={`Select ${c.title}`} />
            </TableCell>
            <TableCell>{c.title}</TableCell>
            <TableCell>{c.pages}</TableCell>
            <TableCell>{c.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function Mini({ children }: { children: React.ReactNode }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Chapter</TableHead>
          <TableHead sort="none">Pages</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>{children}</TableBody>
    </Table>
  )
}

export function States() {
  return (
    <Tiles>
      <Tile label="row · rest, hover, selected" size="lg">
        <Mini>
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
        </Mini>
      </Tile>
      <Tile label="sticky header (maxHeight)" size="lg">
        <Table maxHeight="9.5rem">
          <TableHeader>
            <TableRow>
              <TableHead>Chapter</TableHead>
              <TableHead>Pages</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {chapters.map((c) => (
              <TableRow key={c.id}>
                <TableCell>{c.title}</TableCell>
                <TableCell>{c.pages}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Tile>
      <Tile label="empty" size="lg">
        <Mini>
          <TableEmpty colSpan={2}>No chapters yet.</TableEmpty>
        </Mini>
      </Tile>
      <Tile label="loading" size="lg">
        <Mini>
          <TableLoading colSpan={2} rows={3} />
        </Mini>
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
