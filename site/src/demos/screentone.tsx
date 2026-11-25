import { Screentone, type ScreentonePattern } from "@registry/manga/signature/screentone"

export function Preview() {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <Screentone density={35} fade="bottom" className="grid h-48 place-items-center border-ink-panel">
        <span className="font-letter text-3xl uppercase">Night falls</span>
      </Screentone>
      <div className="relative h-48 border-ink-panel bg-background">
        <svg viewBox="0 0 200 100" className="absolute inset-0 size-full text-foreground" aria-hidden>
          <path d="M0 100V60l30-20 30 26 40-40 50 50 50-30v54z" fill="currentColor" />
        </svg>
        <Screentone as="layer" pattern="lines" density={18} angle={-20} fade="start" />
      </div>
    </div>
  )
}

export function States() {
  const patterns: ScreentonePattern[] = ["dots", "lines", "cross", "noise"]
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {patterns.flatMap((p) =>
          [10, 35].map((d) => (
            <figure key={p + d} className="space-y-1">
              <Screentone pattern={p} density={d} className="h-20 border-ink" />
              <figcaption className="font-mono text-xs">
                {p} · {d}%
              </figcaption>
            </figure>
          )),
        )}
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {(["top", "bottom", "start", "end"] as const).map((fade) => (
          <figure key={fade} className="space-y-1">
            <Screentone density={45} fade={fade} className="h-24 border-ink" />
            <figcaption className="font-mono text-xs">fade="{fade}"</figcaption>
          </figure>
        ))}
        {[0, 15, 60].map((angle) => (
          <figure key={angle} className="space-y-1">
            <Screentone density={25} angle={angle} size={9} className="h-24 border-ink" />
            <figcaption className="font-mono text-xs">angle={angle} size=9</figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}
