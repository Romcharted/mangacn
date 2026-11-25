import { useState } from "react"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@registry/manga/ui/pagination"
import { force, Tile, Tiles } from "../state-grid"

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
          <PaginationPrevious href="#" onClick={go(page - 1)} />
        </PaginationItem>
        {[1, 2, 3, 4, 5].map((p) => (
          <PaginationItem key={p}>
            <PaginationLink href="#" isActive={p === page} onClick={go(p)}>
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" onClick={go(page + 1)} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export function States() {
  return (
    <Tiles>
      <Tile label="page · rest, hover, focus, current" size="full">
        <Pagination>
          <PaginationContent>
            <PaginationItem><PaginationLink href="#">1</PaginationLink></PaginationItem>
            <PaginationItem><PaginationLink href="#" {...force("hover")}>2</PaginationLink></PaginationItem>
            <PaginationItem><PaginationLink href="#" {...force("focus")}>3</PaginationLink></PaginationItem>
            <PaginationItem><PaginationLink href="#" isActive>4</PaginationLink></PaginationItem>
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
