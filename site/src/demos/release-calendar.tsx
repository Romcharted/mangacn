import { ReleaseCalendar, ReleaseRow, type Release } from "@registry/manga/signature/release-calendar"
import { Tile, force } from "../state-grid"

// Covers drawn for this showcase: abstract shapes, no existing work. Ink = currentColor, paper = the background.

function Sun() {
  return (
    <svg viewBox="0 0 200 300" className="size-full" aria-hidden>
      <rect width="200" height="300" fill="var(--background)" />
      <circle cx="100" cy="120" r="60" fill="currentColor" />
      <path d="M0 220h200v80H0z" fill="currentColor" />
    </svg>
  )
}

function Bars() {
  return (
    <svg viewBox="0 0 200 300" className="size-full" aria-hidden>
      <rect width="200" height="300" fill="var(--background)" />
      {[40, 90, 140, 190].map((x, i) => (
        <rect key={x} x={x} y={60 + i * 30} width="50" height="180" fill="currentColor" />
      ))}
    </svg>
  )
}

// A fixed week, today = Wednesday (2). Invented series only.
const TODAY = 2 as const

const RELEASES: Release[] = [
  { id: "a1", day: 0, title: "Glass Harbor", chapter: "Ch. 1 · Low Tide", time: "06:00", status: "new", href: "#", cover: <Sun /> },
  { id: "a2", day: 0, title: "Salt Choir", chapter: "Ch. 31 · The Hymn", time: "12:00", href: "#" },
  { id: "b1", day: 1, title: "Paper Comet", chapter: "Ch. 18 · Hiatus Notes", time: "18:00", status: "break", href: "#" },
  { id: "b2", day: 1, title: "Quiet Engine", chapter: "Ch. 14 · Cold Start", time: "07:00", href: "#", cover: <Bars /> },
  { id: "c1", day: 2, title: "Lantern Row", chapter: "Ch. 12 · Echo", time: "06:00", href: "#", cover: <Bars /> },
  { id: "c2", day: 2, title: "Red Relay", chapter: "Ch. 3 · Handoff", time: "19:00", status: "new", href: "#", cover: <Sun /> },
  // Thursday: no release (the empty day).
  { id: "e1", day: 4, title: "Ninth Gate", chapter: "Ch. 5 · Stairs", time: "06:00", href: "#" },
  { id: "e2", day: 4, title: "Dust Orchard", chapter: "Ch. 9 · Seed", time: "09:00", href: "#", cover: <Sun /> },
  { id: "e3", day: 4, title: "Salt Choir", chapter: "Ch. 32 · Refrain", time: "12:00", href: "#" },
  { id: "e4", day: 4, title: "Hollow Key", chapter: "Ch. 2 · Lock", time: "21:00", href: "#", cover: <Bars /> },
  { id: "f1", day: 5, title: "Lantern Row", chapter: "Ch. 13 · Ember", time: "08:00", href: "#" },
  { id: "g1", day: 6, title: "Quiet Engine", chapter: "Ch. 15 · Warm", time: "07:00", href: "#", cover: <Sun /> },
]

// Interactive rows (href) show the hover lift, the ink focus ring and the pressed offset.
const LINK: Release = { id: "l1", day: 1, title: "Tidewall", chapter: "Ch. 7 · Slack", time: "15:00", href: "#", cover: <Bars /> }
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

export function Thumb() {
  return (
    <div className="grid w-44 gap-2 pointer-events-none">
      <ReleaseRow release={RELEASES[4]} />
      <ReleaseRow release={RELEASES[5]} />
    </div>
  )
}
