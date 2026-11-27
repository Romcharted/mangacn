import { useState } from "react"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@registry/manga/ui/pagination"
import type { Example } from "../registry"
import { force, Tile, Tiles } from "../state-grid"

const TOUCH = "min-h-11 sm:min-h-10"

export function Preview() {
  const [page, setPage] = useState(2)
  const go = (p: number) => (e: React.MouseEvent) => {
    e.preventDefault()
    setPage(Math.min(5, Math.max(1, p)))
  }
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" onClick={go(page - 1)} className={TOUCH} />
        </PaginationItem>
        {[1, 2, 3, 4, 5].map((p) => (
          <PaginationItem key={p}>
            <PaginationLink href="#" isActive={p === page} onClick={go(p)} className={TOUCH}>
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" onClick={go(page + 1)} className={TOUCH} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

/** Previous and next around the page you are on. */
function PrevNext() {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" className={TOUCH} />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive className={TOUCH}>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" className={TOUCH} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

/** A long book: PaginationEllipsis stands in for the pages you skip. */
function WithEllipsis() {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationLink href="#" className={TOUCH}>
            1
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        {[7, 8, 9].map((p) => (
          <PaginationItem key={p}>
            <PaginationLink href="#" isActive={p === 8} className={TOUCH}>
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" className={TOUCH}>
            24
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

/** data-reading="rtl" on an ancestor: the pages run right to left and the arrows turn with them. */
function ReadingOrder() {
  return (
    <div data-reading="rtl" className="flex justify-center">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" className={TOUCH} />
          </PaginationItem>
          {[1, 2, 3].map((p) => (
            <PaginationItem key={p}>
              <PaginationLink href="#" isActive={p === 2} className={TOUCH}>
                {p}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext href="#" className={TOUCH} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

export const examples: Example[] = [
  { fn: "PrevNext", title: "Previous and next", description: "Only the two arrows around the current page, for a short list.", Component: PrevNext },
  { fn: "WithEllipsis", title: "With ellipsis", description: "PaginationEllipsis marks the pages in between, so a long book stays short.", Component: WithEllipsis },
  { fn: "ReadingOrder", title: "Reading order", description: "data-reading=\"rtl\" on a parent runs the pages from right to left, as in manga.", Component: ReadingOrder },
]

export function States() {
  return (
    <Tiles>
      <Tile label="page · rest, hover, focus, current" size="full">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink href="#" className={TOUCH}>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" className={TOUCH} {...force("hover")}>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" className={TOUCH} {...force("focus")}>
                3
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive className={TOUCH}>
                4
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </Tile>
    </Tiles>
  )
}

export function Thumb() {
  return (
    <Pagination>
      <PaginationContent>
        {[1, 2, 3].map((p) => (
          <PaginationItem key={p}>
            <PaginationLink href="#" isActive={p === 2}>
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}
      </PaginationContent>
    </Pagination>
  )
}
