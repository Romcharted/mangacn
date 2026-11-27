import { useState, type ReactNode } from "react"
import { FocusFlash, ImpactLines, withImpact } from "@/lib/manga/gestures"
import type { Example } from "../registry"
import { force, Tile, Tiles } from "../state-grid"
import { to } from "../router"

/** A plain element made to hit: data-[impact]:animate-hit + <ImpactLines /> + withImpact(). */
function Hit({ children, onHit, far = false }: { children: ReactNode; onHit?: () => void; far?: boolean }) {
  return (
    <button
      type="button"
      onClick={withImpact(onHit)}
      className="relative min-h-11 border-ink bg-primary px-4 py-2 font-letter text-primary-foreground uppercase focus-ink press active:bg-background active:text-foreground data-[impact]:animate-hit sm:min-h-8"
    >
      {children}
      <ImpactLines offset={far ? "far" : "normal"} />
    </button>
  )
}

export function Preview() {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="flex flex-wrap items-center justify-center gap-12 px-8 py-4">
        <Hit>Hit me</Hit>
        <Hit>Again</Hit>
      </div>
      <p className="text-sm">
        Without JavaScript the press still shows a 2px offset, the negative and the lines. Every gesture is on the{" "}
        <a href={to("docs/grammar")} className="inline-flex min-h-11 items-center hover-underline sm:min-h-0">
          Grammar page
        </a>
        .
      </p>
    </div>
  )
}

/** Each hit lands and is counted: the impact plays on every click. */
function Counter() {
  const [hits, setHits] = useState(0)
  return (
    <div className="flex justify-center">
      <Hit onHit={() => setHits((n) => n + 1)}>{hits ? `Hit ×${hits}` : "Hit me"}</Hit>
    </div>
  )
}

/** offset="far" pushes the speed lines further out, for a bigger hit. */
function FarLines() {
  return (
    <div className="flex justify-center">
      <Hit far>Smash</Hit>
    </div>
  )
}

/** FocusFlash: a halo of concentration lines around a window as it opens. Optional, never full screen. */
function Flash() {
  const [open, setOpen] = useState(false)
  return (
    <div className="grid justify-items-center gap-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="min-h-11 border-ink bg-background px-4 py-2 font-letter uppercase focus-ink sm:min-h-8"
      >
        {open ? "Close the window" : "Open the window"}
      </button>
      {open && (
        <div className="relative w-56 border-ink-panel bg-background p-4">
          <FocusFlash />
          <p className="relative text-sm">The lamp is lit. The window opens with its halo.</p>
        </div>
      )}
    </div>
  )
}

export const examples: Example[] = [
  { fn: "Counter", title: "Counting hits", description: "withImpact() wraps the click handler, so the impact plays and the count goes up together.", Component: Counter },
  { fn: "FarLines", title: "Far speed lines", description: "ImpactLines offset=\"far\" moves the lines further out, for a heavier hit.", Component: FarLines },
  { fn: "Flash", title: "Window flash", description: "FocusFlash draws a halo around a window as it opens. Open it to see the flash.", Component: Flash },
]

export function States() {
  return (
    <Tiles>
      <Tile label="impact · rest">
        <Hit>Hit</Hit>
      </Tile>
      <Tile label="impact · lines">
        <span data-impact="" className="relative border-ink bg-primary px-4 py-2 font-letter text-primary-foreground uppercase data-[impact]:animate-hit">
          Hit
          <ImpactLines />
        </span>
      </Tile>
      <Tile label="press · pressed">
        <button type="button" {...force("active")} className="relative press border-ink bg-background px-4 py-2 font-letter uppercase">
          Press
          <ImpactLines />
        </button>
      </Tile>
      <Tile label="flash · halo">
        <div className="relative grid h-20 w-full place-items-center border-ink-panel bg-background">
          <FocusFlash className="visible" />
          <span className="relative font-letter uppercase">Window</span>
        </div>
      </Tile>
    </Tiles>
  )
}

/** Live: each hit lands, and is counted. */
export function Thumb() {
  const [hits, setHits] = useState(0)
  return (
    <div className="px-6">
      <Hit onHit={() => setHits((n) => n + 1)}>{hits ? `Hit ×${hits}` : "Hit me"}</Hit>
    </div>
  )
}
