import { MagazineCover, type CoverLine } from "@registry/manga/signature/magazine-cover"
import { useState } from "react"
import { artSrc } from "../mapless"
import { Tile, force } from "../state-grid"
import type { Example } from "../registry"

// On these covers the character stands in the middle and to the right: the lines go down the calm left side
// (sky, bridge, rocks), never over a face or a body.
const LINES: CoverLine[] = [
  { text: "New series: Mapless", highlight: true },
  { text: "48 pages in colour" },
  { text: "Interview: inking the sky" },
]

export function Preview() {
  return (
    <div className="mx-auto grid w-full max-w-2xl grid-cols-1 justify-items-center gap-8 sm:grid-cols-2">
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
          { text: "Free map inside" },
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

function Plain() {
  return <MagazineCover title="Mapless" issue="No. 3" date="Vol. 2" image={artSrc("cover-2", 200)} lines={[]} className="w-52" />
}

function Link() {
  return (
    <MagazineCover
      href="#"
      title="Weekly Ink"
      issue="No. 12"
      date="Spring"
      image={artSrc("cover-1", 200)}
      lines={LINES.slice(0, 2)}
      headline="Suzu draws a bridge"
      className="w-52"
    />
  )
}

function Turn() {
  const [issue, setIssue] = useState(12)
  return (
    <div className="grid justify-items-center gap-3">
      <MagazineCover
        title="Weekly Ink"
        issue={String(issue)}
        image={artSrc(issue % 2 ? "cover-2" : "cover-1", 200)}
        lines={[{ text: "New!", highlight: true }]}
        onSelect={() => setIssue((i) => i + 1)}
        className="w-52"
      />
      <p aria-live="polite" className="font-mono text-sm">
        Issue {issue} on the stand.
      </p>
    </div>
  )
}

export const examples: Example[] = [
  { fn: "Plain", title: "Art and title only", description: "Without lines or a headline, the cover is its picture and its title.", Component: Plain },
  { fn: "Link", title: "A link", description: "href makes the whole cover a link: it lifts on hover and takes the ink focus ring.", Component: Link },
  { fn: "Turn", title: "Turning the issues", description: "onSelect makes the cover a button; each click turns to the next issue.", Component: Turn },
]

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
