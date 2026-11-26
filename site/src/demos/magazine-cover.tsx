import { MagazineCover, type CoverLine } from "@registry/manga/signature/magazine-cover"
import { useState } from "react"
import { artSrc } from "../mapless"
import { Tile, force } from "../state-grid"

const LINES: CoverLine[] = [
  { text: "New series: Mapless", highlight: true },
  { text: "48 pages in colour" },
  { text: "Interview: inking the sky", side: "end" },
  { text: "Bonus poster inside", side: "end" },
]

export function Preview() {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
      <MagazineCover
        href="#"
        title="Weekly Ink"
        tagline="Stories that hit the page"
        issue="No. 12"
        date="Spring"
        image={artSrc("cover-1", 200)}
        lines={LINES}
        headline="Suzu draws a bridge"
        className="max-w-sm"
      />
      <MagazineCover
        title="Mapless"
        issue="No. 3"
        date="Vol. 2"
        image={artSrc("cover-2", 200)}
        lines={[
          { text: "The Eraser strikes" },
          { text: "Special: the sky map", side: "end" },
        ]}
        className="max-w-sm"
      />
    </div>
  )
}

const cover = (extra: Partial<React.ComponentProps<typeof MagazineCover>> = {}) => (
  <MagazineCover
    title="Weekly Ink"
    issue="No. 12"
    date="Spring"
    image={artSrc("cover-1", 200)}
    lines={LINES.slice(0, 3)}
    headline="First page"
    className="w-44"
    {...extra}
  />
)

export function States() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <Tile label="static" size="full">
        {cover()}
      </Tile>
      <Tile label="link · hover" size="full">
        {cover({ href: "#", ...force("hover") })}
      </Tile>
      <Tile label="link · focus" size="full">
        {cover({ href: "#", ...force("focus") })}
      </Tile>
      <Tile label="link · pressed" size="full">
        {cover({ href: "#", ...force("active") })}
      </Tile>
      <Tile label="no art" size="full">
        {cover({ image: undefined })}
      </Tile>
      <Tile label="no lines, no headline" size="full">
        {cover({ lines: [], headline: undefined })}
      </Tile>
      <Tile label="ink art" size="full">
        {cover({ image: artSrc("cover-2", 200), title: "Mapless" })}
      </Tile>
      <Tile label="thumbnail" size="full">
        {cover({ className: "w-24" })}
      </Tile>
    </div>
  )
}

/** Live: the cover lifts on hover; a click turns to the next issue. */
export function Thumb() {
  const [issue, setIssue] = useState(0)
  const art = (["cover-1", "cover-2"] as const)[issue % 2]
  return (
    <MagazineCover
      title="Ink"
      issue={String(12 + issue)}
      image={artSrc(art, 100)}
      lines={[{ text: issue % 2 ? "Vol. 2!" : "New!", highlight: true }]}
      onSelect={() => setIssue((i) => i + 1)}
      className="w-24"
    />
  )
}
