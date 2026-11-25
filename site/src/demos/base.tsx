import { useState, type ReactNode } from "react"

function Swatch({ cls, label, children }: { cls: string; label?: string; children?: ReactNode }) {
  return (
    <figure className="space-y-1">
      <div className={`relative grid h-20 place-items-center border-ink ${cls}`}>{children}</div>
      <figcaption className="font-mono text-xs">{label ?? cls}</figcaption>
    </figure>
  )
}

function Row({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h4 className="mb-2 font-letter text-sm uppercase">{title}</h4>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">{children}</div>
    </div>
  )
}

const motions = [
  ["animate-impact", "Impact"],
  ["animate-shake", "Shake"],
  ["animate-pop", "Pop"],
  ["animate-sfx", "SFX in"],
  ["animate-enter", "Enter"],
] as const

export function Preview() {
  const [run, setRun] = useState<Record<string, number>>({})
  return (
    <div className="space-y-8">
      <Row title="Values">
        <Swatch cls="bg-background" label="paper" />
        <Swatch cls="ink-fill" label="ink" />
        <Swatch cls="bg-destructive" label="stamp" />
      </Row>
      <Row title="Screentone">
        {["tone-10", "tone-20", "tone-35", "tone-50", "tone-lines", "tone-cross"].map((c) => (
          <Swatch key={c} cls={c}>
            <span className="font-letter text-sm uppercase">Text on tone</span>
          </Swatch>
        ))}
      </Row>
      <Row title="Fading tone">
        {["tone-fade-r", "tone-fade-l", "tone-fade-t", "tone-fade-b"].map((c) => (
          <Swatch key={c} cls={c} />
        ))}
      </Row>
      <Row title="Energy">
        <Swatch cls="speed-lines" />
        <Swatch cls="speed-lines [--speed-angle:90deg]" label="speed-lines (90°)" />
        <Swatch cls="focus-lines" />
        <Swatch cls="focus-lines [--focus-x:20%] [--focus-y:70%]" label="focus-lines (origin)" />
      </Row>
      <Row title="Ink & shadow">
        <Swatch cls="border-ink-fine" label="border-ink-fine (1px)" />
        <Swatch cls="" label="border-ink (2px)" />
        <Swatch cls="border-ink-panel" label="border-ink-panel (3px)" />
        <Swatch cls="tone-shadow" label="tone-shadow" />
      </Row>
      <Row title="Shapes">
        <figure className="space-y-1">
          <div className="grid h-20 place-items-center shape-burst ink-fill font-letter uppercase">New!</div>
          <figcaption className="font-mono text-xs">shape-burst</figcaption>
        </figure>
        <figure className="space-y-1">
          <div className="grid h-20 place-items-center edge-jagged bg-destructive font-letter text-background uppercase">
            ! Error
          </div>
          <figcaption className="font-mono text-xs">edge-jagged</figcaption>
        </figure>
        <figure className="space-y-1">
          <div className="grid h-20 place-items-center">
            <span className="block size-14 animate-spin-steps rounded-full focus-lines [--focus-hole:30%_30%]" />
          </div>
          <figcaption className="font-mono text-xs">animate-spin-steps</figcaption>
        </figure>
        <figure className="space-y-1">
          <div className="h-20 animate-tone-flicker border-ink tone-20" />
          <figcaption className="font-mono text-xs">animate-tone-flicker</figcaption>
        </figure>
      </Row>
      <Row title="Motion (click to replay)">
        {motions.map(([cls, label]) => (
          <figure key={cls} className="space-y-1">
            <button
              type="button"
              key={run[cls] ?? 0}
              onClick={() => setRun((r) => ({ ...r, [cls]: (r[cls] ?? 0) + 1 }))}
              className={`grid h-20 w-full place-items-center border-ink font-letter uppercase hover:tone-10 focus-ink ${run[cls] ? cls : ""}`}
            >
              {label}
            </button>
            <figcaption className="font-mono text-xs">{cls}</figcaption>
          </figure>
        ))}
      </Row>
    </div>
  )
}
