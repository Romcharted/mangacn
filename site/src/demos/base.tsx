import { useState, type ReactNode } from "react"
import { Tile, Tiles, force } from "../state-grid"
import type { Example } from "../registry"

function Swatch({ cls, label, children }: { cls: string; label?: string; children?: ReactNode }) {
  return (
    <Tile label={label ?? cls}>
      <div className={`relative grid h-16 w-full place-items-center border-ink ${cls}`}>{children}</div>
    </Tile>
  )
}

const motions = [
  ["animate-impact", "Impact"],
  ["animate-shake", "Shake"],
  ["animate-pop", "Pop"],
  ["animate-sfx", "SFX in"],
  ["animate-enter", "Enter"],
] as const

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-2">
      <h3 className="font-letter text-lg uppercase">{title}</h3>
      <Tiles>{children}</Tiles>
    </section>
  )
}

/** The base look at a glance: paper and ink, the accent, and the energy lines. */
export const previewWide = true

export function Preview() {
  return (
    <div className="space-y-8">
      <Group title="Values">
        <Swatch cls="bg-background" label="paper" />
        <Swatch cls="ink-fill" label="ink" />
        <Swatch cls="bg-[var(--mg-accent)]" label="--mg-accent" />
      </Group>
      <Group title="Ink & shadow">
        <Swatch cls="border-ink-fine" label="border-ink-fine (1px)" />
        <Swatch cls="" label="border-ink (2px)" />
        <Swatch cls="border-ink-panel" label="border-ink-panel (3px)" />
        <Swatch cls="tone-shadow" label="tone-shadow" />
      </Group>
      <Group title="Energy">
        <Swatch cls="speed-lines" />
        <Swatch cls="speed-lines [--speed-angle:90deg]" label="speed-lines (90°)" />
        <Swatch cls="focus-lines" />
        <Swatch cls="focus-lines [--focus-x:20%] [--focus-y:70%]" label="focus-lines (origin)" />
      </Group>
    </div>
  )
}

/** Screentone: the tones, the fades and the tone band, all in one ink. */
function Screentone() {
  return (
    <div className="space-y-6">
      <Group title="Screentone">
        {["tone-10", "tone-20", "tone-35", "tone-50", "tone-lines", "tone-cross"].map((c) => (
          <Swatch key={c} cls={c} />
        ))}
      </Group>
      <Group title="Fading tone">
        {["tone-fade-r", "tone-fade-l", "tone-fade-t", "tone-fade-b"].map((c) => (
          <Swatch key={c} cls={c} />
        ))}
      </Group>
    </div>
  )
}

/** Labels over tones go on an on-tone plate; a disabled look is a tone frame. */
function Labels() {
  return (
    <Group title="Labels and tones">
      <Swatch cls="tone-50" label="on-tone (a paper plate)">
        <span className="on-tone font-letter uppercase">Label</span>
      </Swatch>
      <Swatch cls="tone-frame" label="tone-frame (disabled)">
        <span className="font-letter uppercase">Label</span>
      </Swatch>
      <Swatch cls="bg-background" label="tone band (button tone)">
        <span className="absolute inset-x-0 bottom-0 h-[30%] border-t-[length:var(--mg-bw-fine)] border-border tone-35" />
        <span className="relative font-letter uppercase">Label</span>
      </Swatch>
    </Group>
  )
}

/** Motion: click a tile to play its stepped animation. */
function Motion() {
  const [run, setRun] = useState<Record<string, number>>({})
  return (
    <Group title="Shapes & motion">
      <Tile label="shape-burst">
        <div className="grid h-16 w-full place-items-center shape-burst ink-fill font-letter uppercase">New!</div>
      </Tile>
      <Tile label="edge-jagged (32px+)">
        <div className="grid h-16 w-full place-items-center edge-jagged bg-destructive font-letter text-primary-foreground uppercase">
          ! Error
        </div>
      </Tile>
      {motions.map(([cls, label]) => (
        <Tile key={cls} label={`${cls} (click)`}>
          <button
            type="button"
            key={run[cls] ?? 0}
            onClick={() => setRun((r) => ({ ...r, [cls]: (r[cls] ?? 0) + 1 }))}
            className={`grid h-16 w-full place-items-center border-ink bg-background font-letter uppercase hover:border-[3px] focus-ink ${run[cls] ? cls : ""}`}
          >
            {label}
          </button>
        </Tile>
      ))}
    </Group>
  )
}

export const examples: Example[] = [
  { fn: "Screentone", title: "Screentone", description: "The tone-10 to tone-cross steps and the fading tones, all printed in the same ink.", Component: Screentone, wide: true },
  { fn: "Labels", title: "Labels over tones", description: "Text on a tone sits on an on-tone plate; tone-frame marks a disabled look.", Component: Labels, wide: true },
  { fn: "Motion", title: "Motion", description: "The stepped animations: impact, shake, pop, sfx and enter. Click a tile to play it.", Component: Motion, wide: true },
]

export function States() {
  return (
    <Tiles>
      <Tile label="focus-ink · rest">
        <span className="grid h-16 w-full place-items-center border-ink bg-background font-letter uppercase">Ink</span>
      </Tile>
      <Tile label="focus-ink · focus">
        <span {...force("focus")} className="grid h-16 w-full place-items-center border-ink bg-background font-letter uppercase focus-ink">
          Ink
        </span>
      </Tile>
      <Tile label="ink-fill · current">
        <span className="grid h-16 w-full place-items-center ink-fill font-letter uppercase">Ink</span>
      </Tile>
      <Tile label="tone-shadow · card">
        <span className="relative tone-shadow grid h-16 w-full place-items-center border-ink bg-background font-letter uppercase">Card</span>
      </Tile>
    </Tiles>
  )
}

export function Thumb() {
  return (
    <div className="grid w-48 grid-cols-4 gap-1.5">
      {["tone-20", "tone-50", "tone-fade-b", "focus-lines", "speed-lines", "tone-cross", "ink-fill", "bg-[var(--mg-accent)]"].map((c) => (
        <span key={c} className={`block h-10 border-ink-fine ${c}`} />
      ))}
    </div>
  )
}
