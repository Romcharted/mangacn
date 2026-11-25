import { useState, type ReactNode } from "react"
import { FocusFlash, ImpactLines, withImpact } from "@/lib/manga/gestures"
import { Badge } from "@registry/manga/ui/badge"
import { Button, Spinner } from "@registry/manga/ui/button"
import { TooltipBubble } from "@registry/manga/ui/tooltip"
import { force } from "./state-grid"

type Gesture = {
  id: string
  name: string
  when: string
  utilities: string[]
  demo: (replay: number) => ReactNode
}

const GESTURES: Gesture[] = [
  {
    id: "G1",
    name: "Case",
    when: "Every container: card, panel, window, list, field. A case inside a case: 2px, no shadow.",
    utilities: ["ink-case", "ink-case-inner"],
    demo: () => (
      <div className="relative w-56 ink-case p-3">
        <p className="font-letter uppercase">A case</p>
        <div className="mt-2 ink-case-inner p-2 text-sm">A case inside: 2px, no shadow.</div>
      </div>
    ),
  },
  {
    id: "G2",
    name: "Flat",
    when: "Whatever is selected, checked, active or current. It sweeps in over three frames, in the reading direction.",
    utilities: ["ink-fill", "fill-in", "animate-bar-in"],
    demo: (r) => (
      <div className="flex gap-2">
        <span key={r} className="border-ink px-3 py-1.5 font-letter uppercase ink-fill fill-in">
          Selected
        </span>
        <span className="border-ink px-3 py-1.5 font-letter uppercase">Not</span>
      </div>
    ),
  },
  {
    id: "G3",
    name: "Hover",
    when: "Every interactive element. Framed: the tone shadow appears and moves by 2px in two frames. Frameless: ink / paper inversion or a thicker underline. Never a tone behind text.",
    utilities: ["hover-lift", "hover-invert", "hover-underline"],
    demo: () => (
      <div className="flex flex-wrap items-center gap-4">
        <span {...force("hover")} className="relative hover-lift border-ink px-3 py-1.5 font-letter uppercase">
          Framed
        </span>
        <span {...force("hover")} className="hover-invert px-3 py-1.5 font-letter uppercase">
          Frameless
        </span>
        <span {...force("hover")} className="hover-underline font-letter uppercase">
          Link
        </span>
      </div>
    ),
  },
  {
    id: "G4",
    name: "Impact",
    when: "Every click or validation. Three frames: negative, 2px recoil, short speed lines on both sides, outside the element.",
    utilities: ["data-[impact]:animate-hit", "<ImpactLines />", "withImpact()"],
    demo: () => (
      <div className="flex items-center gap-10 px-8">
        <button
          type="button"
          onClick={withImpact()}
          className="relative border-ink bg-primary px-4 py-2 font-letter text-primary-foreground uppercase data-[impact]:animate-hit"
        >
          Press me
          <ImpactLines />
        </button>
        <Button variant="shout">Or me</Button>
      </div>
    ),
  },
  {
    id: "G5",
    name: "Pop",
    when: "Whatever appears: three steps of scale (0.9 → 1.05 → 1). A window may add a halo of concentration lines around it (FocusFlash, off by default).",
    utilities: ["animate-pop", "<FocusFlash />", "animate-slide-in", "animate-drop-in"],
    demo: (r) => (
      <div className="relative isolate grid h-40 w-full place-items-center overflow-hidden">
        <div key={r} className="relative w-48 ink-case animate-pop p-3 text-center font-letter uppercase">
          <FocusFlash />
          New window
        </div>
      </div>
    ),
  },
  {
    id: "G6",
    name: "Bubble",
    when: "Whatever floats and points at something. Tooltip, popover, hover card: a bubble with a tail. Lists and menus: a case with a small notch toward the trigger.",
    utilities: ["TooltipBubble", "case-notch"],
    demo: (r) => (
      <div key={r} className="flex flex-wrap items-start gap-6">
        <TooltipBubble className="animate-pop">Psst.</TooltipBubble>
        <div data-side="bottom" className="relative mt-2 w-36 ink-case case-notch animate-pop p-1 text-sm">
          <div className="px-2 py-1">Vol. 1</div>
          <div className="bg-foreground px-2 py-1 text-background">Vol. 2</div>
        </div>
      </div>
    ),
  },
  {
    id: "G7",
    name: "Running line",
    when: "Progress, waiting, value. Filled with speed lines; waiting is concentration lines turning in steps, or a caret blinking in two hard steps.",
    utilities: ["fill-lines", "Spinner", "animate-spin-steps", "animate-blink"],
    demo: (r) => (
      <div className="grid w-full max-w-xs gap-4">
        <div className="h-5 border-ink bg-background p-0.5">
          <div key={r} className="h-full w-2/3 fill-lines origin-left animate-bar-in" />
        </div>
        <span className="inline-flex items-center gap-2 text-sm">
          <Spinner className="size-6" /> Loading the next chapter…
        </span>
        <span className="inline-flex items-center gap-1 text-sm">
          Type your code
          <span aria-hidden className="inline-block h-5 w-[length:var(--mg-bw)] animate-blink bg-foreground" />
        </span>
      </div>
    ),
  },
  {
    id: "G8",
    name: "Mark",
    when: "Status and emotion. Error: “!”, serrated edge (32px and up), shake. New: a burst. Done: a brush check. Others: manpu marks.",
    utilities: ["mark-error", "animate-shake", "shape-burst", "mark-check", "mark-calendar", "edge-jagged"],
    demo: (r) => (
      <div key={r} className="flex flex-wrap items-center gap-5">
        <span className="grid size-9 animate-shake place-items-center bg-destructive font-sfx text-lg text-primary-foreground edge-jagged">!</span>
        <Badge variant="burst">New!</Badge>
        <span className="mark-check text-3xl" aria-label="Done" role="img" />
        <span className="mark-calendar text-3xl" aria-label="Date" role="img" />
        <Manpu />
      </div>
    ),
  },
]

/** Two manpu marks drawn for the kit: an anger vein and a sweat drop. */
function Manpu() {
  return (
    <span className="inline-flex items-center gap-3" aria-hidden>
      <svg viewBox="0 0 32 32" className="size-8 animate-pop">
        <path d="M13 3c0 6-3 9-9 9M19 3c0 6 3 9 9 9M13 29c0-6-3-9-9-9M19 29c0-6 3-9 9-9" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
      </svg>
      <svg viewBox="0 0 24 32" className="h-8 animate-pop">
        <path d="M12 2c4 8 9 13 9 19a9 9 0 0 1-18 0c0-6 5-11 9-19z" fill="var(--background)" stroke="currentColor" strokeWidth="2.5" />
        <path d="M8 21c0 2 1.5 4 4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </span>
  )
}

function GestureCard({ g }: { g: Gesture }) {
  const [replay, setReplay] = useState(0)
  return (
    <article className="flex flex-col border-ink bg-background" aria-labelledby={`g-${g.id}`}>
      <header className="flex items-baseline gap-3 border-b-[length:var(--mg-bw)] border-border p-3">
        <span className="ink-fill px-1.5 font-mono text-sm">{g.id}</span>
        <h2 id={`g-${g.id}`} className="font-letter text-2xl leading-none uppercase">
          {g.name}
        </h2>
        <button
          type="button"
          onClick={() => setReplay((x) => x + 1)}
          className="ms-auto h-8 border-ink px-2.5 font-letter text-sm uppercase hover-invert focus-ink"
        >
          Replay
        </button>
      </header>
      <div className="grid min-h-44 place-items-center p-5">{g.demo(replay)}</div>
      <div className="mt-auto space-y-2 border-t-[length:var(--mg-bw-fine)] border-border p-3 text-sm">
        <p>{g.when}</p>
        <p className="flex flex-wrap gap-1.5">
          {g.utilities.map((u) => (
            <code key={u} className="border-ink-fine px-1.5 font-mono text-xs">
              {u}
            </code>
          ))}
        </p>
      </div>
    </article>
  )
}

export function Grammar() {
  return (
    <article className="pt-6" aria-labelledby="grammar-title">
      <a href="#/" className="inline-flex h-9 items-center border-ink px-3 font-letter text-sm uppercase hover:ink-fill focus-ink">
        ← All components
      </a>
      <header className="mt-6 max-w-prose space-y-2">
        <h1 id="grammar-title" className="font-letter text-5xl leading-none uppercase">
          Grammar
        </h1>
        <p className="text-lg">
          Eight gestures, written once in <code className="font-mono text-base">base</code>, applied by every component. Cadence: 12
          frames per second; a gesture lasts 2 to 4 frames, always in steps. With reduced motion nothing moves, and every state stays
          distinct. Disabled stays as it is: dashed line, tone frame, label on paper.
        </p>
        <p className="border-s-[6px] border-border ps-3">
          <strong className="font-letter font-normal uppercase">One exception:</strong> what a finger drags follows the finger, without
          steps. A drawer, a resizable handle, a slider thumb or a carousel strip moves with the pointer while it is dragged; the steps
          come back for what the component does on its own (opening, closing, snapping).
        </p>
      </header>
      <div className="mt-8 grid grid-cols-[repeat(auto-fill,minmax(min(100%,22rem),1fr))] gap-5">
        {GESTURES.map((g) => (
          <GestureCard key={g.id} g={g} />
        ))}
      </div>
    </article>
  )
}
