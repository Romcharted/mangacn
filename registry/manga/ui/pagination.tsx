import * as React from "react"
import { cn } from "cn"

import {
  Pagination as ShadcnPagination,
  PaginationContent as ShadcnPaginationContent,
  PaginationEllipsis as ShadcnPaginationEllipsis,
  PaginationItem,
  PaginationLink as ShadcnPaginationLink,
  PaginationNext as ShadcnPaginationNext,
  PaginationPrevious as ShadcnPaginationPrevious,
} from "@/components/ui/pagination"

/*
 * Page numbers are cells of one group: 2px frames, the line thickens on hover (G3) and the current page
 * is an ink flat that sweeps in (G2). Previous / next carry brush arrows. In manga reading order
 * (data-reading="rtl") the pages run right to left and the arrows turn with them.
 */
function Pagination({ className, ...props }: React.ComponentProps<typeof ShadcnPagination>) {
  return <ShadcnPagination data-manga="pagination" className={cn(className)} {...props} />
}

function PaginationContent({ className, ...props }: React.ComponentProps<typeof ShadcnPaginationContent>) {
  return <ShadcnPaginationContent className={cn("gap-1.5 reading-rtl:[direction:rtl] *:[direction:ltr]", className)} {...props} />
}

const cell =
  "h-10 min-w-10 rounded-none border-[length:var(--mg-bw)] border-border bg-background px-2 font-letter text-base text-foreground uppercase shadow-none transition-none hover:bg-background hover:text-foreground hover-thicken focus-visible:ring-0 focus-ink active:translate-y-px dark:bg-background dark:hover:bg-background"

function PaginationLink({ className, ...props }: React.ComponentProps<typeof ShadcnPaginationLink>) {
  return (
    <ShadcnPaginationLink
      className={cn(cell, "aria-[current=page]:ink-fill aria-[current=page]:fill-in aria-[current=page]:bg-primary! aria-[current=page]:text-primary-foreground!", className)}
      {...props}
    />
  )
}

const arrow = "[&>svg]:hidden before:mark-arrow before:text-sm"

function PaginationPrevious({ className, ...props }: React.ComponentProps<typeof ShadcnPaginationPrevious>) {
  return (
    <ShadcnPaginationPrevious
      className={cn(cell, arrow, "gap-2 px-3! before:-rotate-90 rtl:before:rotate-90 reading-rtl:before:rotate-90", className)}
      {...props}
    />
  )
}

function PaginationNext({ className, ...props }: React.ComponentProps<typeof ShadcnPaginationNext>) {
  return (
    <ShadcnPaginationNext
      className={cn(cell, arrow, "flex-row-reverse gap-2 px-3! before:rotate-90 rtl:before:-rotate-90 reading-rtl:before:-rotate-90", className)}
      {...props}
    />
  )
}

function PaginationEllipsis({ className, ...props }: React.ComponentProps<typeof ShadcnPaginationEllipsis>) {
  return (
    <ShadcnPaginationEllipsis
      className={cn("size-10 [&>svg]:hidden after:font-sfx after:text-lg after:content-['…']", className)}
      {...props}
    />
  )
}

export { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious }
