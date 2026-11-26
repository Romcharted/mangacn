import * as React from "react"
import { cn } from "cn"

/*
 * Magazine cover: the masthead in a band of ink across the top, the issue and date in a box on its end,
 * cover lines on paper plates down both sides of the art, a headline plate at the foot. Every word rests
 * on a flat (rule A), never on the art. The lettering scales with the cover itself (container units), so the
 * same cover works as a thumbnail and full width on a phone.
 * Gestures: G1 (the cover is a case), G2 (the masthead band is an ink flat), G3 / G4 when it is a link or a
 * button (hover-lift, focus-ink, press), G8 (a highlighted line is an accent flat, like a "new" mark).
 */

export type CoverLine = {
  text: React.ReactNode
  /** Column the line sits in. */
  side?: "start" | "end"
  /** An accent flat instead of a paper plate: one per cover, for the big news. */
  highlight?: boolean
}

export type MagazineCoverProps = Omit<React.HTMLAttributes<HTMLElement>, "title"> & {
  /** The masthead, set across the top band. */
  title: React.ReactNode
  /** Issue number, e.g. "No. 12". */
  issue?: React.ReactNode
  /** Date or season under the issue. */
  date?: React.ReactNode
  /** A short line under the masthead. */
  tagline?: React.ReactNode
  /** An image URL, or any node drawn as the art (it fills the cover). */
  image?: React.ReactNode
  /** Alternative text when `image` is a URL. */
  imageAlt?: string
  /** Cover lines placed around the art. */
  lines?: CoverLine[]
  /** The main cover line, on a plate at the foot. */
  headline?: React.ReactNode
  /** Makes the cover a link. */
  href?: string
  /** Makes the cover a button. */
  onSelect?: () => void
}

const plate = "border-[length:var(--mg-bw)] border-border bg-background px-[2.4cqi] py-[1.2cqi] text-foreground"

function MagazineCover({
  title,
  issue,
  date,
  tagline,
  image,
  imageAlt = "",
  lines = [],
  headline,
  href,
  onSelect,
  className,
  ...props
}: MagazineCoverProps) {
  const interactive = Boolean(href || onSelect)
  const art =
    typeof image === "string" ? (
      <img src={image} alt={imageAlt} className="absolute inset-0 size-full object-cover" />
    ) : image ? (
      <span aria-hidden className="absolute inset-0 block">
        {image}
      </span>
    ) : (
      <span aria-hidden className="absolute inset-0 block tone-20" />
    )

  const column = (side: "start" | "end") => {
    const own = lines.filter((l) => (l.side ?? "start") === side)
    if (!own.length) return null
    return (
      <span className={cn("grid max-w-[46%] content-start gap-[2cqi]", side === "end" ? "justify-items-end text-end" : "justify-items-start text-start")}>
        {own.map((l, i) => (
          <span
            key={i}
            data-highlight={l.highlight || undefined}
            className={cn(
              "font-letter text-[4.6cqi] leading-[1.05] tracking-wide break-words uppercase",
              l.highlight ? "bg-destructive px-[2.4cqi] py-[1.2cqi] text-primary-foreground" : plate,
            )}
          >
            {l.text}
          </span>
        ))}
      </span>
    )
  }

  const body = (
    <span className="@container/cover relative isolate block aspect-[3/4] w-full overflow-hidden">
      {art}
      <span className="relative z-10 flex size-full flex-col">
        {/* masthead band */}
        <span className="flex items-stretch gap-[2cqi] bg-foreground p-[2.4cqi] text-background">
          <span className="min-w-0 flex-1 self-center">
            <span className="block font-sfx text-[13cqi] leading-none break-words">{title}</span>
            {tagline != null && <span className="mt-[2cqi] block font-letter text-[3.6cqi] leading-tight tracking-widest uppercase">{tagline}</span>}
          </span>
          {(issue != null || date != null) && (
            <span className="grid shrink-0 content-center justify-items-center border-[length:var(--mg-bw)] border-background @max-[10rem]/cover:hidden px-[2cqi] py-[1cqi] text-center">
              {issue != null && <span className="font-sfx text-[5.6cqi] leading-none">{issue}</span>}
              {date != null && <span className="mt-[0.8cqi] font-mono text-[2.8cqi] leading-none uppercase">{date}</span>}
            </span>
          )}
        </span>
        {/* cover lines down both sides */}
        <span className="flex flex-1 items-start justify-between gap-[3cqi] p-[3cqi]">
          {column("start") ?? <span />}
          {column("end")}
        </span>
        {headline != null && (
          <span className="p-[3cqi] pt-0">
            <span className={cn(plate, "block border-[length:var(--mg-bw-panel)] font-letter text-[7cqi] leading-[0.95] tracking-wide break-words uppercase")}>
              {headline}
            </span>
          </span>
        )}
      </span>
    </span>
  )

  const shell = cn(
    "relative isolate block w-full min-w-0 ink-case p-0 text-start text-foreground",
    interactive && "cursor-pointer hover-lift focus-ink press",
    className,
  )
  const attrs = { "data-manga": "magazine-cover", "data-interactive": interactive || undefined, ...props }

  if (href)
    return (
      <a {...attrs} href={href} className={shell}>
        {body}
      </a>
    )
  if (onSelect)
    return (
      <button {...attrs} type="button" onClick={onSelect} className={shell}>
        {body}
      </button>
    )
  return (
    <article {...attrs} className={shell}>
      {body}
    </article>
  )
}

export { MagazineCover }
