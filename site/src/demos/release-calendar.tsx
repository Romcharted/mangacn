import { useState } from "react"
import { ReleaseCalendar, ReleaseRow, type Release } from "@registry/manga/signature/release-calendar"
import { Tile, force } from "../state-grid"

import { Art, type ArtName } from "../mapless"

// Covers: crops of "Mapless", the showcase's series (AI-generated pictures, see public/art/CREDITS.md).
const pic = (name: ArtName) => <Art name={name} alt="" shown="(min-width: 40rem) 24rem, 100vw" className="size-full object-cover" />
const Sun = () => pic("lighthouse-night")
const Bars = () => pic("bridge-far")

// A fixed week, today = Wednesday (2). Invented series only.
const TODAY = 2 as const

const RELEASES: Release[] = [
  { id: "a1", day: 0, title: "Mapless", chapter: "Ch. 18 · Low Clouds", time: "06:00", status: "new", href: "#", cover: <Sun /> },
  { id: "a2", day: 0, title: "Salt Choir", chapter: "Ch. 31 · The Hymn", time: "12:00", href: "#" },
  { id: "b1", day: 1, title: "Paper Comet", chapter: "Ch. 18 · Hiatus Notes", time: "18:00", status: "break", href: "#" },
  { id: "b2", day: 1, title: "Kuro's notebook", chapter: "Ch. 14 · Cold Ink", time: "07:00", href: "#", cover: <Bars /> },
  { id: "c1", day: 2, title: "Mapless: Side stories", chapter: "Ch. 12 · Echo", time: "06:00", href: "#", cover: <Bars /> },
  { id: "c2", day: 2, title: "Mapless", chapter: "Ch. 19 · Handoff", time: "19:00", status: "new", href: "#", cover: <Sun /> },
  // Thursday: no release (the empty day).
  { id: "e1", day: 4, title: "Ninth Gate", chapter: "Ch. 5 · Stairs", time: "06:00", href: "#" },
  { id: "e2", day: 4, title: "Mapless Sketchbook", chapter: "Part 9 · Seed", time: "09:00", href: "#", cover: <Sun /> },
  { id: "e3", day: 4, title: "Salt Choir", chapter: "Ch. 32 · Refrain", time: "12:00", href: "#" },
  { id: "e4", day: 4, title: "Mapless", chapter: "Ch. 20 · Lock", time: "21:00", href: "#", cover: <Bars /> },
  { id: "f1", day: 5, title: "Lantern Row", chapter: "Ch. 13 · Ember", time: "08:00", href: "#" },
  { id: "g1", day: 6, title: "Kuro's notebook", chapter: "Ch. 15 · Warm", time: "07:00", href: "#", cover: <Sun /> },
]

// Interactive rows (href) show the hover lift, the ink focus ring and the pressed offset.
const LINK: Release = { id: "l1", day: 1, title: "Mapless", chapter: "Ch. 17 · Slack", time: "15:00", href: "#", cover: <Bars /> }
const NEW = RELEASES[5]
const BREAK = RELEASES[2]
const PLAIN: Release = { id: "p1", day: 1, title: "Ninth Gate", chapter: "Ch. 6 · Hinge", time: "09:00" }

export function Preview() {
  return <ReleaseCalendar releases={RELEASES} today={TODAY} />
}

export function States() {
  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
        <Tile label="strip · day selected (Fri)" size="full">
          <div className="w-full">
            <ReleaseCalendar layout="strip" releases={RELEASES} today={TODAY} defaultDay={4} />
          </div>
        </Tile>
        <Tile label="strip · today mark (Wed, Mon shown)" size="full">
          <div className="w-full">
            <ReleaseCalendar layout="strip" releases={RELEASES} today={TODAY} defaultDay={0} />
          </div>
        </Tile>
        <Tile label="strip · empty day (Thu)" size="full">
          <div className="w-full">
            <ReleaseCalendar layout="strip" releases={RELEASES} today={TODAY} defaultDay={3} />
          </div>
        </Tile>
        <Tile label="wide · columns (every day)" size="full">
          <div className="w-full overflow-x-auto">
            <ReleaseCalendar layout="columns" releases={RELEASES} today={TODAY} />
          </div>
        </Tile>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
        <Tile label="row · rest">
          <div className="w-full">
            <ReleaseRow release={LINK} />
          </div>
        </Tile>
        <Tile label="row · hover">
          <div className="w-full">
            <ReleaseRow release={LINK} {...force("hover")} />
          </div>
        </Tile>
        <Tile label="row · focus">
          <div className="w-full">
            <ReleaseRow release={LINK} {...force("focus")} />
          </div>
        </Tile>
        <Tile label="row · pressed">
          <div className="w-full">
            <ReleaseRow release={LINK} {...force("active")} />
          </div>
        </Tile>
        <Tile label="status · new">
          <div className="w-full">
            <ReleaseRow release={NEW} />
          </div>
        </Tile>
        <Tile label="status · break">
          <div className="w-full">
            <ReleaseRow release={BREAK} />
          </div>
        </Tile>
        <Tile label="row · with cover">
          <div className="w-full">
            <ReleaseRow release={RELEASES[4]} />
          </div>
        </Tile>
        <Tile label="row · no cover, no status">
          <div className="w-full">
            <ReleaseRow release={PLAIN} />
          </div>
        </Tile>
      </div>
    </div>
  )
}

/** Live: press a release; it is marked as opened. */
export function Thumb() {
  const [opened, setOpened] = useState<string | null>(null)
  const row = (r: Release) => <ReleaseRow release={{ ...r, href: undefined, chapter: opened === r.id ? "Opening…" : r.chapter }} onSelect={() => setOpened(r.id)} />
  return (
    <div className="grid w-64 gap-2 [zoom:0.55]">
      {row(RELEASES[4])}
      {row(RELEASES[5])}
    </div>
  )
}
