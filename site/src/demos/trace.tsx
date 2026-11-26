import { useState } from "react"
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceDescription,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@registry/manga/ui/trace"
import { force, Tile, Tiles } from "../state-grid"

export function Preview() {
  const [open, setOpen] = useState(true)
  const [opened, setOpened] = useState<string | null>(null)
  return (
    <div className="grid max-w-xl gap-4">
      <p className="font-letter text-xl tracking-wide uppercase">Agent run · Inking chapter 12</p>
      <Trace>
        <TraceLine>
          <TraceIcon />
          <TraceTitle>Read chapter-12.md</TraceTitle>
          <TraceDescription>0.4s</TraceDescription>
        </TraceLine>
        <button type="button" onClick={() => setOpened("style-guide.md")}>
          <TraceLine>
            <TraceIcon />
            <TraceTitle>Opened style-guide.md</TraceTitle>
            <TraceDescription>0.2s</TraceDescription>
          </TraceLine>
        </button>
        <TraceCollapsible open={open} onOpenChange={setOpen}>
          <TraceCollapsibleTrigger>
            <TraceLine>
              <TraceIcon />
              <TraceTitle>Searched references · 3 results</TraceTitle>
              <TraceDescription>1.8s</TraceDescription>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <span>“rain on a harbour at night”: panel-07.png, panel-12.png</span>
            <span>“speed lines, low angle”: cover-draft.png</span>
          </TraceCollapsibleContent>
        </TraceCollapsible>
        <TraceLine status="error">
          <TraceIcon />
          <TraceTitle>Fetch font “Brush Bold”: not found</TraceTitle>
          <TraceDescription>0.9s</TraceDescription>
        </TraceLine>
        <TraceLine>
          <TraceIcon />
          <TraceTitle>Inked pages 1–8</TraceTitle>
          <TraceDescription>42s</TraceDescription>
        </TraceLine>
        <TraceLine status="running">
          <TraceIcon />
          <TraceTitle>Inking pages 9–16…</TraceTitle>
        </TraceLine>
        <TraceLine status="pending">
          <TraceIcon />
          <TraceTitle>Lay screentones</TraceTitle>
        </TraceLine>
        <TraceLine status="pending">
          <TraceIcon />
          <TraceTitle>Letter the speech bubbles</TraceTitle>
        </TraceLine>
      </Trace>
      <p className="min-h-6 text-sm" aria-live="polite">
        {opened ? `Showing ${opened}.` : "Click a line to open its file."}
      </p>
    </div>
  )
}

export function States() {
  return (
    <Tiles>
      <Tile label="line · done" size="lg">
        <Trace>
          <TraceLine>
            <TraceIcon />
            <TraceTitle>Read chapter-12.md</TraceTitle>
            <TraceDescription>0.4s</TraceDescription>
          </TraceLine>
        </Trace>
      </Tile>
      <Tile label="line · running" size="lg">
        <Trace>
          <TraceLine status="running">
            <TraceIcon />
            <TraceTitle>Inking page 9…</TraceTitle>
          </TraceLine>
        </Trace>
      </Tile>
      <Tile label="line · pending" size="lg">
        <Trace>
          <TraceLine status="pending">
            <TraceIcon />
            <TraceTitle>Lay screentones</TraceTitle>
          </TraceLine>
        </Trace>
      </Tile>
      <Tile label="line · error" size="lg">
        <Trace>
          <TraceLine status="error">
            <TraceIcon />
            <TraceTitle>Font not found</TraceTitle>
            <TraceDescription>0.9s</TraceDescription>
          </TraceLine>
        </Trace>
      </Tile>
      <Tile label="clickable · rest" size="lg">
        <Trace>
          <button type="button">
            <TraceLine>
              <TraceIcon />
              <TraceTitle>Opened style-guide.md</TraceTitle>
            </TraceLine>
          </button>
        </Trace>
      </Tile>
      <Tile label="clickable · hover" size="lg">
        <Trace>
          <button type="button" {...force("hover")}>
            <TraceLine>
              <TraceIcon />
              <TraceTitle>Opened style-guide.md</TraceTitle>
            </TraceLine>
          </button>
        </Trace>
      </Tile>
      <Tile label="clickable · focus" size="lg">
        <Trace>
          <button type="button" {...force("focus")}>
            <TraceLine>
              <TraceIcon />
              <TraceTitle>Opened style-guide.md</TraceTitle>
            </TraceLine>
          </button>
        </Trace>
      </Tile>
      <Tile label="clickable · error, hover" size="lg">
        <Trace>
          <a href="#" onClick={(e) => e.preventDefault()} {...force("hover")}>
            <TraceLine status="error">
              <TraceIcon />
              <TraceTitle>Fetch failed: retry</TraceTitle>
            </TraceLine>
          </a>
        </Trace>
      </Tile>
      <Tile label="group · closed" size="lg">
        <Trace>
          <TraceCollapsible>
            <TraceCollapsibleTrigger>
              <TraceLine>
                <TraceIcon />
                <TraceTitle>Searched references</TraceTitle>
                <TraceDescription>1.8s</TraceDescription>
              </TraceLine>
            </TraceCollapsibleTrigger>
            <TraceCollapsibleContent>panel-07.png, panel-12.png</TraceCollapsibleContent>
          </TraceCollapsible>
        </Trace>
      </Tile>
      <Tile label="group · open" size="lg">
        <Trace>
          <TraceCollapsible defaultOpen>
            <TraceCollapsibleTrigger>
              <TraceLine>
                <TraceIcon />
                <TraceTitle>Searched references</TraceTitle>
                <TraceDescription>1.8s</TraceDescription>
              </TraceLine>
            </TraceCollapsibleTrigger>
            <TraceCollapsibleContent>
              <span>panel-07.png</span>
              <span>panel-12.png</span>
            </TraceCollapsibleContent>
          </TraceCollapsible>
        </Trace>
      </Tile>
      <Tile label="group · hover, focus" size="lg">
        <Trace>
          <TraceCollapsible>
            <TraceCollapsibleTrigger data-force="hover focus">
              <TraceLine>
                <TraceIcon />
                <TraceTitle>Searched references</TraceTitle>
              </TraceLine>
            </TraceCollapsibleTrigger>
            <TraceCollapsibleContent>panel-07.png</TraceCollapsibleContent>
          </TraceCollapsible>
        </Trace>
      </Tile>
      <Tile label="group · error inside" size="lg">
        <Trace>
          <TraceCollapsible defaultOpen>
            <TraceCollapsibleTrigger>
              <TraceLine status="error">
                <TraceIcon />
                <TraceTitle>Exported pages: 1 failed</TraceTitle>
              </TraceLine>
            </TraceCollapsibleTrigger>
            <TraceCollapsibleContent>
              <span>page-14.png: file is locked</span>
            </TraceCollapsibleContent>
          </TraceCollapsible>
        </Trace>
      </Tile>
    </Tiles>
  )
}

/** Live: the first step folds open. */
export function Thumb() {
  return (
    <div className="w-56">
      <Trace>
        <TraceCollapsible>
          <TraceCollapsibleTrigger>
            <TraceLine>
              <TraceIcon />
              <TraceTitle>Read chapter-12.md</TraceTitle>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>18 panels, 3 pages</TraceCollapsibleContent>
        </TraceCollapsible>
        <TraceLine status="error">
          <TraceIcon />
          <TraceTitle>Font not found</TraceTitle>
        </TraceLine>
        <TraceLine status="running">
          <TraceIcon />
          <TraceTitle>Inking page 9…</TraceTitle>
        </TraceLine>
        <TraceLine status="pending">
          <TraceIcon />
          <TraceTitle>Lay screentones</TraceTitle>
        </TraceLine>
      </Trace>
    </div>
  )
}
