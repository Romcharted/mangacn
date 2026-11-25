import { Button } from "@registry/manga/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMark, EmptyTitle } from "@registry/manga/ui/empty"

export function Preview() {
  return (
    <Empty className="max-w-md">
      <EmptyHeader>
        <EmptyMark />
        <EmptyTitle>No bookmarks</EmptyTitle>
        <EmptyDescription>Tap the corner of a page to keep your place.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline">Open the library</Button>
      </EmptyContent>
    </Empty>
  )
}

export function Thumb() {
  return (
    <Empty className="w-48 gap-1 p-3">
      <EmptyHeader>
        <EmptyMark className="text-3xl" />
        <EmptyTitle className="text-base">No bookmarks</EmptyTitle>
      </EmptyHeader>
    </Empty>
  )
}
