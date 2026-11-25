"use client"

import * as React from "react"
import {
  type Cell,
  type Column,
  type ColumnDef,
  type ColumnFiltersState,
  type Row,
  type RowData,
  type RowSelectionState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Button, buttonClassName } from "@/components/ui/manga/button"
import { Checkbox } from "@/components/ui/manga/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/manga/dropdown-menu"
import { Input } from "@/components/ui/manga/input"
import { Table, TableBody, TableCell, TableEmpty, TableHead, TableHeader, TableRow } from "@/components/ui/manga/table"

/*
 * Grammar: the table is a case (G1) with an ink header (G2) and 1px rules; sorting shows the brush arrow in the
 * header (G8); the hovered row gets its bar and the selected row its 6px bar (kit Table). The toolbar and the
 * footer are plain: a filter field (G1 line), a column menu (G6 case with a notch), pages as kit buttons (G3, G4).
 * Built on @tanstack/react-table v8 (useReactTable and the standard row models).
 *
 * Phones: when the table itself is narrower than `cardsBelow` (640px), each row becomes a card: a 44px
 * checkbox, the title column, a badge column on the end side, the other columns as labelled lines. Columns
 * choose their place with `meta: { card: "title" | "badge" | "line" | false }` (false: hidden in cards).
 */

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    /** Place in the card layout. Default: the first column is the title, the others are labelled lines. */
    card?: "title" | "badge" | "line" | false
  }
}

const useIsoLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect

export type DataTableProps<TData extends RowData, TValue = unknown> = {
  /** Column definitions. A selection column is added first, by the table itself. */
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  /** Id of the column the toolbar filter searches (e.g. "title"). */
  filterColumn?: string
  /** Rows per page (default 10). */
  pageSize?: number
  /** Called with the selected rows, in data order, whenever the selection changes. */
  onSelectionChange?: (rows: TData[]) => void
  /** Width in px under which rows are shown as cards (default 640; 0 keeps the table). */
  cardsBelow?: number
}

/** The leading checkbox column: select all on the page, or one row. Not sortable, not hidable. */
function selectColumn<TData extends RowData>(): ColumnDef<TData, unknown> {
  return {
    id: "select",
    enableSorting: false,
    enableHiding: false,
    header: ({ table }) => (
      <Checkbox
        className="border-primary-foreground bg-primary"
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(checked: boolean) => table.toggleAllPageRowsSelected(!!checked)}
        aria-label="Select all rows on this page"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(checked: boolean) => row.toggleSelected(!!checked)}
        aria-label="Select row"
      />
    ),
  }
}

const columnLabel = <TData extends RowData>(column: Column<TData, unknown>) =>
  typeof column.columnDef.header === "string" ? column.columnDef.header : column.id

function DataTable<TData extends RowData, TValue = unknown>({
  columns,
  data,
  filterColumn,
  pageSize = 10,
  onSelectionChange,
  cardsBelow = 640,
}: DataTableProps<TData, TValue>) {
  const rootRef = React.useRef<HTMLDivElement>(null)
  const [cards, setCards] = React.useState(false)
  useIsoLayoutEffect(() => {
    const el = rootRef.current
    if (!el || !cardsBelow) return setCards(false)
    const measure = () => setCards(el.getBoundingClientRect().width < cardsBelow)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [cardsBelow])

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})

  const allColumns = React.useMemo(
    () => [selectColumn<TData>(), ...columns] as ColumnDef<TData, unknown>[],
    [columns],
  )

  const table = useReactTable<TData>({
    data,
    columns: allColumns,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    initialState: { pagination: { pageIndex: 0, pageSize } },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  // Row ids are the index in `data`, so the selection maps back to the caller's rows.
  const onSelectionRef = React.useRef(onSelectionChange)
  React.useEffect(() => {
    onSelectionRef.current = onSelectionChange
  })
  // Reports only when the selection changes: depending on `data` too would loop when the caller
  // passes a new array on every render and stores the selection in its own state.
  const dataRef = React.useRef(data)
  dataRef.current = data
  React.useEffect(() => {
    onSelectionRef.current?.(dataRef.current.filter((_, i) => rowSelection[String(i)]))
  }, [rowSelection])

  const rows = table.getRowModel().rows
  const filter = filterColumn ? table.getColumn(filterColumn) : undefined
  const hidable = table.getAllLeafColumns().filter((c) => c.getCanHide() && c.id !== "select")
  const pageCount = table.getPageCount()
  const pageIndex = table.getState().pagination.pageIndex
  const selectedCount = table.getSelectedRowModel().rows.length

  return (
    <div ref={rootRef} data-manga="data-table" data-layout={cards ? "cards" : "table"} className="grid min-w-0 gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {filter ? (
          <Input
            inputSize="sm"
            aria-label="Filter rows"
            placeholder="Filter…"
            value={(filter.getFilterValue() as string) ?? ""}
            onChange={(e) => filter.setFilterValue(e.target.value)}
            className="max-w-xs"
          />
        ) : (
          <span />
        )}
        {cards && rows.length > 0 && (
          <span className="me-auto flex items-center">
            <span className="grid size-11 place-items-center">
              <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(checked: boolean) => table.toggleAllPageRowsSelected(!!checked)}
                aria-label="Select all rows on this page"
              />
            </span>
            <span aria-hidden className="font-letter text-sm uppercase">
              All
            </span>
          </span>
        )}
        <DropdownMenu>
          {/* Styled by class, not render / asChild: those props exist in only one library. */}
          <DropdownMenuTrigger className={buttonClassName({ variant: "outline", size: "sm" })}>Columns</DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Show columns</DropdownMenuLabel>
              {hidable.map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={(checked: boolean) => column.toggleVisibility(!!checked)}
                >
                  {columnLabel(column)}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {cards ? (
        <DataCards rows={rows} />
      ) : (
      <div className="min-w-0 overflow-x-auto px-2 pt-1 pb-2">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((group) => (
            <TableRow key={group.id}>
              {group.headers.map((header) => {
                const sortable = header.column.getCanSort()
                const direction = header.column.getIsSorted()
                return (
                  <TableHead
                    key={header.id}
                    className={header.column.id === "select" ? "w-10" : undefined}
                    sort={sortable ? (direction === "asc" ? "ascending" : direction === "desc" ? "descending" : "none") : undefined}
                    onSort={sortable ? () => header.column.toggleSorting(direction === "asc") : undefined}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {rows.length ? (
            rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() ? "selected" : undefined}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableEmpty colSpan={table.getVisibleLeafColumns().length}>Nothing matches.</TableEmpty>
          )}
        </TableBody>
      </Table>
      </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm">
          {selectedCount} selected of {table.getFilteredRowModel().rows.length}
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-letter text-sm uppercase">
            Page {pageIndex + 1} / {Math.max(1, pageCount)}
          </span>
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Prev
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

type CardRole = "title" | "badge" | "line" | false

/** Phone layout: one card per row. The selection column becomes a 44px checkbox at the start. */
function DataCards<TData extends RowData>({ rows }: { rows: Row<TData>[] }) {
  if (!rows.length) return <p className="border-ink-fine p-4 text-center font-letter text-base uppercase">Nothing matches.</p>
  return (
    <ul aria-label="Rows" className="grid gap-2">
      {rows.map((row) => {
        const cells = row.getVisibleCells().filter((cell) => cell.column.id !== "select")
        const role = (cell: Cell<TData, unknown>, i: number): CardRole => cell.column.columnDef.meta?.card ?? (i === 0 ? "title" : "line")
        const pick = (r: CardRole) => cells.filter((cell, i) => role(cell, i) === r)
        const show = (cell: Cell<TData, unknown>) => flexRender(cell.column.columnDef.cell, cell.getContext())
        const selected = row.getIsSelected()
        const lines = pick("line")
        return (
          <li
            key={row.id}
            data-state={selected ? "selected" : undefined}
            className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-2 border-ink-fine bg-background py-1 ps-0.5 pe-3 data-[state=selected]:border-s-[6px]"
          >
            {/* The whole 44px square toggles the row, not only the box inside it. */}
            <span className="grid size-11 place-items-center" onClick={(e) => e.target === e.currentTarget && row.toggleSelected()}>
              <Checkbox checked={selected} onCheckedChange={(checked: boolean) => row.toggleSelected(!!checked)} aria-label="Select row" />
            </span>
            <span className="min-w-0 py-1 font-letter text-lg leading-tight uppercase break-words">
              {pick("title").map((cell) => (
                <React.Fragment key={cell.id}>{show(cell)}</React.Fragment>
              ))}
            </span>
            <span className="flex flex-col items-end gap-1">
              {pick("badge").map((cell) => (
                <React.Fragment key={cell.id}>{show(cell)}</React.Fragment>
              ))}
            </span>
            {lines.length > 0 && (
              <dl className="col-span-2 col-start-2 grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-0.5 pb-2 text-sm">
                {lines.map((cell) => (
                  <React.Fragment key={cell.id}>
                    <dt className="font-letter uppercase">{columnLabel(cell.column)}</dt>
                    <dd className="min-w-0 break-words">{show(cell)}</dd>
                  </React.Fragment>
                ))}
              </dl>
            )}
          </li>
        )
      })}
    </ul>
  )
}

export { DataTable, selectColumn }
