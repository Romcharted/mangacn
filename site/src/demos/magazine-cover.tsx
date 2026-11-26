import { MagazineCover, type CoverLine } from "@registry/manga/signature/magazine-cover"
import { CoverNight, CoverSun } from "../story-art"
import { Tile, force } from "../state-grid"

const LINES: CoverLine[] = [
  { text: "New series: Paper Lanterns", highlight: true },
  { text: "48 pages in colour" },
  { text: "Interview: drawing at night", side: "end" },
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
        image={<CoverSun className="size-full" />}
        lines={LINES}
        headline="The rookie's first page"
        className="max-w-sm"
      />
      <MagazineCover
        title="Night Rail"
        issue="No. 3"
        date="Vol. 2"
        image={<CoverNight className="size-full" />}
        lines={[
          { text: "Last train, first clue" },
          { text: "Special: the city map", side: "end" },
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
    image={<CoverSun className="size-full" />}
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
        {cover({ image: <CoverNight className="size-full" />, title: "Night Rail" })}
      </Tile>
      <Tile label="thumbnail" size="full">
        {cover({ className: "w-24" })}
      </Tile>
    </div>
  )
}

export function Thumb() {
  return (
    <MagazineCover title="Ink" issue="12" image={<CoverSun className="size-full" />} lines={[{ text: "New!", highlight: true }]} className="w-24" />
  )
}
