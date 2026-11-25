import { SpeedLines } from "@registry/manga/signature/speed-lines"

export function Preview() {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <SpeedLines animated className="grid h-56 place-items-center border-ink-panel">
        <span aria-hidden className="font-sfx text-6xl">
          ドン!
        </span>
      </SpeedLines>
      <SpeedLines variant="motion" direction={-12} className="grid h-56 place-items-center border-ink-panel">
        <span aria-hidden className="-rotate-6 font-sfx text-5xl">
          ZOOM
        </span>
      </SpeedLines>
    </div>
  )
}

export function States() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {[
        { label: "focus · hole 0.2", props: { hole: 0.2 } },
        { label: "focus · origin 20/75", props: { originX: 20, originY: 75 } },
        { label: "focus · density 0.3", props: { density: 0.3 } },
        { label: "focus · density 1", props: { density: 1 } },
        { label: "motion · 0°", props: { variant: "motion" as const } },
        { label: "motion · 90°", props: { variant: "motion" as const, direction: 90 } },
        { label: "motion · 30°", props: { variant: "motion" as const, direction: 30 } },
        { label: "motion · density 0.2", props: { variant: "motion" as const, density: 0.2 } },
      ].map(({ label, props }) => (
        <figure key={label} className="space-y-1">
          <SpeedLines {...props} className="h-28 border-ink" />
          <figcaption className="font-mono text-xs">{label}</figcaption>
        </figure>
      ))}
    </div>
  )
}
