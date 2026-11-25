"use client"

import * as React from "react"
import {
  type Column,
  type ColumnDef,
  type ColumnFiltersState,
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
 */

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
}: DataTableProps<TData, TValue>) {
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
    <div data-manga="data-table" className="grid min-w-0 gap-3">
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

      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm">
          {selectedCount} selected of {table.getFilteredRowModel().rows.length}
        </span>
        <div className="flex items-center gap-2">
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

export { DataTable, selectColumn }
