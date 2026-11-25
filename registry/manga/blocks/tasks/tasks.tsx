"use client"

/*
 * Tasks — a production board made only with mangacn: a Data Table whose statuses are stamps, a search
 * field, status filters as pressed buttons, and actions on the selected rows (Button Group). Only the
 * blocked status uses the accent colour; the other stamps are ink.
 */
import * as React from "react"
import type { ColumnDef } from "@tanstack/react-table"

import { Button } from "@/components/ui/manga/button"
import { ButtonGroup } from "@/components/ui/manga/button-group"
import { DataTable } from "@/components/ui/manga/data-table"
import { Input } from "@/components/ui/manga/input"
import { HitCounter } from "@/components/manga/hit-counter"
import { Stamp } from "@/components/manga/stamp"
import { cn } from "cn"

type Status = "To do" | "Inking" | "Review" | "Done" | "Blocked"
type Task = { id: number; title: string; chapter: string; artist: string; due: string; status: Status }

const STATUSES: Status[] = ["To do", "Inking", "Review", "Done", "Blocked"]

const START: Task[] = [
  ["Thumbnails, pages 1–8", "Ch. 13", "Mei", "Mon 2", "Done"],
  ["Pencils, pages 1–8", "Ch. 13", "Ren", "Wed 4", "Review"],
  ["Inks, rooftop chase", "Ch. 13", "Ren", "Fri 6", "Inking"],
  ["Screentone, night market", "Ch. 13", "Sora", "Fri 6", "To do"],
  ["Lettering and SFX", "Ch. 13", "Hana", "Mon 9", "To do"],
  ["Cover sketch, Vol. 3", "Vol. 3", "Mei", "Tue 10", "Blocked"],
  ["Colour page", "Vol. 3", "Sora", "Thu 12", "To do"],
  ["Translator notes", "Ch. 12", "Hana", "Mon 2", "Done"],
  ["Print proofs", "Ch. 12", "Mei", "Wed 4", "Review"],
  ["Back matter", "Vol. 3", "Ren", "Fri 13", "To do"],
].map(([title, chapter, artist, due, status], i) => ({ id: i + 1, title, chapter, artist, due, status }) as Task)

function StatusStamp({ status }: { status: Status }) {
  return (
    <Stamp
      rotate={status === "Blocked" ? -6 : -3}
      animated={false}
      tone={status === "Blocked" ? "accent" : "ink"}
      className="px-2 py-1 text-xs"
    >
      {status}
    </Stamp>
  )
}

const columns: ColumnDef<Task>[] = [
  { accessorKey: "title", header: "Task" },
  { accessorKey: "chapter", header: "Chapter" },
  { accessorKey: "artist", header: "Artist" },
  { accessorKey: "due", header: "Due" },
  { accessorKey: "status", header: "Status", cell: ({ getValue }) => <StatusStamp status={getValue<Status>()} /> },
]

export function Tasks({ className }: { className?: string }) {
  const [tasks, setTasks] = React.useState(START)
  const [query, setQuery] = React.useState("")
  const [filter, setFilter] = React.useState<Status | "All">("All")
  const [picked, setPicked] = React.useState<Task[]>([])
  const [round, setRound] = React.useState(0) // remounts the table, which clears its selection

  const shown = React.useMemo(
    () =>
      tasks.filter(
        (t) => (filter === "All" || t.status === filter) && (!query || `${t.title} ${t.chapter} ${t.artist}`.toLowerCase().includes(query.toLowerCase())),
      ),
    [tasks, filter, query],
  )
  const done = tasks.filter((t) => t.status === "Done").length

  const apply = (change: (t: Task) => Task | null) => {
    const ids = new Set(picked.map((t) => t.id))
    setTasks((all) => all.flatMap((t) => (ids.has(t.id) ? (change(t) ?? []) : [t])))
    setPicked([])
    setRound((r) => r + 1)
  }

  return (
    <div data-manga="tasks" className={cn("grid gap-5 bg-background p-4 sm:p-6", className)}>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs">Studio Inkwell · Chapter 13</p>
          <h1 className="font-letter text-4xl leading-none tracking-wide uppercase">Tasks</h1>
        </div>
        <HitCounter value={done} label={`of ${tasks.length} done`} />
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tasks…"
          aria-label="Search tasks"
          className="w-full sm:w-64"
        />
        <ButtonGroup aria-label="Status" className="flex-wrap">
          {(["All", ...STATUSES] as const).map((s) => (
            <Button key={s} size="sm" variant={filter === s ? "default" : "outline"} aria-pressed={filter === s} onClick={() => setFilter(s)}>
              {s}
            </Button>
          ))}
        </ButtonGroup>
      </div>

      <div aria-live="polite" className="flex min-h-10 flex-wrap items-center gap-3 border-ink px-3 py-2">
        {picked.length ? (
          <>
            <span className="font-letter text-base uppercase">{picked.length} selected</span>
            <ButtonGroup aria-label="Actions on the selection" className="ms-auto">
              <Button size="sm" variant="outline" onClick={() => apply((t) => ({ ...t, status: "Done" }))}>
                Mark done
              </Button>
              <Button size="sm" variant="outline" onClick={() => apply((t) => ({ ...t, status: "To do" }))}>
                Reopen
              </Button>
              <Button size="sm" variant="destructive" onClick={() => apply(() => null)}>
                Delete
              </Button>
            </ButtonGroup>
          </>
        ) : (
          <span className="text-sm">Tick tasks to act on several at once.</span>
        )}
      </div>

      <DataTable key={`${round}-${filter}-${query}`} columns={columns} data={shown} pageSize={8} onSelectionChange={setPicked} />
    </div>
  )
}
