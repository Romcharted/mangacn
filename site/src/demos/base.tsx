import { useState, type ReactNode } from "react"
import { Tile, Tiles } from "../state-grid"

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

export function Preview() {
  const [run, setRun] = useState<Record<string, number>>({})
  return (
    <div className="space-y-8">
      <Group title="Values">
        <Swatch cls="bg-background" label="paper" />
        <Swatch cls="ink-fill" label="ink" />
        <Swatch cls="bg-[var(--mg-accent)]" label="--mg-accent" />
      </Group>
      <Group title="Screentone">
        {["tone-10", "tone-20", "tone-35", "tone-50", "tone-lines", "tone-cross"].map((c) => (
          <Swatch key={c} cls={c} />
        ))}
      </Group>
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
      <Group title="Fading tone">
        {["tone-fade-r", "tone-fade-l", "tone-fade-t", "tone-fade-b"].map((c) => (
          <Swatch key={c} cls={c} />
        ))}
      </Group>
      <Group title="Energy">
        <Swatch cls="speed-lines" />
        <Swatch cls="speed-lines [--speed-angle:90deg]" label="speed-lines (90°)" />
        <Swatch cls="focus-lines" />
        <Swatch cls="focus-lines [--focus-x:20%] [--focus-y:70%]" label="focus-lines (origin)" />
      </Group>
      <Group title="Ink & shadow">
        <Swatch cls="border-ink-fine" label="border-ink-fine (1px)" />
        <Swatch cls="" label="border-ink (2px)" />
        <Swatch cls="border-ink-panel" label="border-ink-panel (3px)" />
        <Swatch cls="tone-shadow" label="tone-shadow" />
      </Group>
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
    </div>
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
