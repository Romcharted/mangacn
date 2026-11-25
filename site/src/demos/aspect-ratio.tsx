import { AspectRatio } from "@registry/manga/ui/aspect-ratio"

/* Abstract drawing, scaled to whatever ratio the box has: a sun, a figure, speed lines. */
function Art() {
  return (
    <svg viewBox="0 0 120 120" preserveAspectRatio="xMidYMid slice" className="size-full" aria-hidden>
      <rect x="0" y="0" width="120" height="120" className="fill-background" />
      <circle cx="84" cy="34" r="16" className="fill-foreground" />
      <path d="M40 120 C40 78 52 66 62 66 C72 66 84 78 84 120 Z" className="fill-foreground" />
      <circle cx="62" cy="48" r="11" className="fill-foreground" />
      <path d="M0 18 L34 14 M0 30 L28 28 M0 42 L22 42" className="stroke-foreground" strokeWidth="2" />
    </svg>
  )
}

const frames = [
  { ratio: 16 / 9, label: "16 / 9", width: "w-full" },
  { ratio: 2 / 3, label: "2 / 3 cover", width: "w-40" },
  { ratio: 1, label: "1 / 1 square", width: "w-56" },
] as const

export function Preview() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <figure className="ink-case-inner space-y-2 p-2">
        <AspectRatio ratio={16 / 9}>
          <Art />
        </AspectRatio>
        <figcaption className="font-mono text-xs">16 / 9</figcaption>
      </figure>
      <figure className="ink-case-inner mx-auto w-40 space-y-2 p-2">
        <AspectRatio ratio={2 / 3}>
          <Art />
        </AspectRatio>
        <figcaption className="font-mono text-xs">2 / 3 cover</figcaption>
      </figure>
      <figure className="ink-case-inner mx-auto w-56 space-y-2 p-2">
        <AspectRatio ratio={1}>
          <Art />
        </AspectRatio>
        <figcaption className="font-mono text-xs">1 / 1 square</figcaption>
      </figure>
    </div>
  )
}

export function States() {
  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {frames.map((f) => (
        <figure key={f.label} className={`ink-case-inner mx-auto space-y-2 p-2 ${f.width}`}>
          <AspectRatio ratio={f.ratio}>
            <Art />
          </AspectRatio>
          <figcaption className="font-mono text-xs">{f.label}</figcaption>
        </figure>
      ))}
    </div>
  )
}

export function Thumb() {
  return (
    <div className="mx-auto w-28">
      <AspectRatio ratio={2 / 3}>
        <Art />
      </AspectRatio>
    </div>
  )
}
