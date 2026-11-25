import * as React from "react"
import { cn } from "cn"

import {
  Table as ShadcnTable,
  TableBody as ShadcnTableBody,
  TableCaption as ShadcnTableCaption,
  TableCell as ShadcnTableCell,
  TableFooter as ShadcnTableFooter,
  TableHead as ShadcnTableHead,
  TableHeader as ShadcnTableHeader,
  TableRow as ShadcnTableRow,
} from "@/components/ui/table"

/*
 * Grammar: the table sits in a case (G1); the header is an ink flat (G2); rows are split by a 1px
 * line, never striped with a tone. Hovered row: a 3px ink bar at the row start (G3). Selected row
 * (data-state="selected" or aria-selected="true"): a 6px bar, with a checked Checkbox in the row (G2).
 */

export type TableProps = React.ComponentProps<typeof ShadcnTable> & {
  /** Max height of the scroll area; the header stays in place while the body scrolls. */
  maxHeight?: string
}

function Table({ className, maxHeight, ...props }: TableProps) {
  return (
    <div
      data-manga="table"
      style={maxHeight ? ({ "--table-max-h": maxHeight } as React.CSSProperties) : undefined}
      className={cn(
        "relative ink-case",
        "[&>[data-slot=table-container]]:max-h-(--table-max-h,none) [&>[data-slot=table-container]]:overflow-auto",
      )}
    >
      <ShadcnTable className={cn("border-collapse text-base", className)} {...props} />
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<typeof ShadcnTableHeader>) {
  return (
    <ShadcnTableHeader
      className={cn("[&_tr]:border-b-0 [&_tr]:bg-primary [&_tr]:hover:bg-primary [&_tr]:shadow-none", className)}
      {...props}
    />
  )
}

function TableHead({
  className,
  sort,
  onSort,
  children,
  ...props
}: React.ComponentProps<typeof ShadcnTableHead> & {
  /** Marks the column as sortable and shows a brush arrow (G8). */
  sort?: "ascending" | "descending" | "none"
  onSort?: () => void
}) {
  return (
    <ShadcnTableHead
      aria-sort={sort}
      className={cn(
        "sticky top-0 z-10 h-11 bg-primary px-3 font-letter text-base font-normal tracking-wide text-primary-foreground uppercase",
        className,
      )}
      {...props}
    >
      {sort ? (
        <button
          type="button"
          onClick={onSort}
          className="group/sort inline-flex items-center gap-1.5 uppercase hover:underline hover:decoration-2 hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-foreground"
        >
          {children}
          <span
            aria-hidden
            className={cn(
              "mark-arrow text-sm",
              sort === "descending" && "rotate-180",
              sort === "none" && "opacity-100 [mask-size:70%] group-hover/sort:[mask-size:contain]",
            )}
          />
        </button>
      ) : (
        children
      )}
    </ShadcnTableHead>
  )
}

function TableBody({ className, ...props }: React.ComponentProps<typeof ShadcnTableBody>) {
  return <ShadcnTableBody className={cn(className)} {...props} />
}

// The bars are inset shadows on the first cell, so they work on a <tr> in every browser.
function TableRow({ className, ...props }: React.ComponentProps<typeof ShadcnTableRow>) {
  return (
    <ShadcnTableRow
      data-manga="table-row"
      className={cn(
        "border-b-[length:var(--mg-bw-fine)] border-border transition-none hover:bg-transparent has-aria-expanded:bg-transparent data-[state=selected]:bg-transparent",
        "hover:[&>td:first-child]:shadow-[inset_3px_0_0_var(--foreground)] rtl:hover:[&>td:first-child]:shadow-[inset_-3px_0_0_var(--foreground)]",
        "data-[state=selected]:[&>td:first-child]:shadow-[inset_6px_0_0_var(--foreground)]! aria-selected:[&>td:first-child]:shadow-[inset_6px_0_0_var(--foreground)]!",
        "rtl:data-[state=selected]:[&>td:first-child]:shadow-[inset_-6px_0_0_var(--foreground)]! rtl:aria-selected:[&>td:first-child]:shadow-[inset_-6px_0_0_var(--foreground)]!",
        className,
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<typeof ShadcnTableCell>) {
  return <ShadcnTableCell className={cn("px-3 py-2.5 first:ps-4", className)} {...props} />
}

function TableFooter({ className, ...props }: React.ComponentProps<typeof ShadcnTableFooter>) {
  return (
    <ShadcnTableFooter
      className={cn("border-t-[length:var(--mg-bw)] border-border bg-background font-letter tracking-wide uppercase", className)}
      {...props}
    />
  )
}

function TableCaption({ className, ...props }: React.ComponentProps<typeof ShadcnTableCaption>) {
  return <ShadcnTableCaption className={cn("my-3 text-sm text-foreground italic", className)} {...props} />
}

/** A full-width row for an empty table: a “…” mark and a short line. */
function TableEmpty({ colSpan, children = "Nothing here yet." }: { colSpan: number; children?: React.ReactNode }) {
  return (
    <tr data-manga="table-empty">
      <td colSpan={colSpan} className="px-4 py-8 text-center">
        <span role="status" className="inline-flex items-center gap-3">
          <span aria-hidden className="font-sfx text-3xl leading-none">
            …
          </span>
          {children}
        </span>
      </td>
    </tr>
  )
}

/** Placeholder rows while data loads: a light tone that flickers, never under text. */
function TableLoading({ colSpan, rows = 3 }: { colSpan: number; rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }, (_, r) => (
        <tr key={r} aria-hidden className="border-b-[length:var(--mg-bw-fine)] border-border">
          {Array.from({ length: colSpan }, (_, c) => (
            <td key={c} className="px-3 py-3 first:ps-4">
              <span className="block h-3 w-3/4 bg-muted tone-20 animate-tone-flicker" />
            </td>
          ))}
        </tr>
      ))}
      <tr className="sr-only">
        <td role="status">Loading…</td>
      </tr>
    </>
  )
}

export { Table, TableBody, TableCaption, TableCell, TableEmpty, TableFooter, TableHead, TableHeader, TableLoading, TableRow }
