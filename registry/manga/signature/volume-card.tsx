"use client"

import * as React from "react"
import { cn } from "cn"

/*
 * Volume card. Gestures: G1 case (the card, a 2px case on the cover), G3 hover (hover-lift when interactive),
 * focus ring (focus-ink), pressed offset (press), G2 flat (the volume tag and the ink status), G7 running
 * line (reading progress: fill-lines), G8 mark (the NEW burst, the completed check). Cover art is any node, or
 * an image URL. The card is a link (href), a button (onSelect) or static.
 */

export type VolumeStatus = "new" | "ongoing" | "completed" | "hiatus"

export type VolumeCardProps = Omit<React.HTMLAttributes<HTMLElement>, "title"> & {
  title: React.ReactNode
  /** Shown as "Vol. 12" on the cover corner. */
  volume: number | string
  /** An image URL, or any node drawn as the cover (a 2:3 box). Without it, a screentone cover. */
  cover?: React.ReactNode
  author?: React.ReactNode
  status?: VolumeStatus
  /** Chapters read. Needs `total` to show the bar. */
  read?: number
  /** Chapters in the volume. */
  total?: number
  /** Makes the card a link. */
  href?: string
  /** Makes the card a button. */
  onSelect?: () => void
  className?: string
}

const STATUS_LABEL: Record<VolumeStatus, string> = {
  new: "New",
  ongoing: "Ongoing",
  completed: "Completed",
  hiatus: "Hiatus",
}

function StatusMark({ status }: { status: VolumeStatus }) {
  if (status === "new")
    return (
      <span className="relative isolate inline-grid h-6 place-items-center px-3 font-sfx text-xs leading-none text-primary-foreground before:absolute before:-inset-x-2 before:-inset-y-2 before:-z-10 before:bg-destructive before:content-[''] before:shape-burst">
        {STATUS_LABEL.new}
      </span>
    )
  if (status === "ongoing")
    return <span className="inline-flex h-6 items-center ink-fill px-2 font-letter text-xs uppercase">{STATUS_LABEL.ongoing}</span>
  if (status === "completed")
    return (
      <span className="inline-flex h-6 items-center gap-1.5 border-ink bg-background px-2 font-letter text-xs uppercase">
        <span aria-hidden className="mark-check size-3" />
        {STATUS_LABEL.completed}
      </span>
    )
  return <span className="inline-flex h-6 items-center border-ink bg-background px-2 font-letter text-xs uppercase">{STATUS_LABEL.hiatus}</span>
}

function VolumeCard({ title, volume, cover, author, status, read, total, href, onSelect, className, ...props }: VolumeCardProps) {
  const interactive = Boolean(href || onSelect)
  const pct = total ? Math.min(100, Math.round(((read ?? 0) / total) * 100)) : 0

  const art =
    typeof cover === "string" ? (
      <img src={cover} alt="" className="absolute inset-0 size-full object-cover" />
    ) : cover ? (
      <span className="absolute inset-0 block">{cover}</span>
    ) : (
      <span aria-hidden className="absolute inset-0 block tone-lines" />
    )

  const body = (
    <>
      <span className="relative block aspect-[2/3] w-full overflow-hidden bg-background ink-case-inner">
        {art}
        <span className="absolute start-0 top-0 z-10 ink-fill px-2 py-1 font-letter text-lg leading-none uppercase">Vol. {volume}</span>
      </span>
      <span className="mt-2 grid min-w-0 gap-1.5">
        {status && (
          <span className="flex flex-wrap items-center gap-1.5">
            <StatusMark status={status} />
          </span>
        )}
        <span className="block font-letter text-lg leading-tight uppercase break-words">{title}</span>
        {author && <span className="block text-sm break-words">{author}</span>}
        {total !== undefined && (
          <span className="grid gap-1">
            <span className="relative block h-8 border-ink bg-background p-0.5">
              <span
                className="block h-full fill-lines origin-left transition-[width] duration-[333ms] ease-[steps(4)]"
                style={{ width: `${pct}%` }}
              />
            </span>
            <span className="flex justify-between font-mono text-xs">
              <span>
                {read ?? 0} / {total}
              </span>
              <span>{pct}%</span>
            </span>
          </span>
        )}
      </span>
    </>
  )

  const shell = cn(
    "relative isolate block w-full min-w-0 ink-case p-2 text-start text-foreground",
    interactive && "cursor-pointer hover-lift focus-ink press",
    className,
  )
  const attrs = { "data-manga": "volume-card", "data-status": status, "data-interactive": interactive || undefined, ...props }

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
    <span {...attrs} className={shell}>
      {body}
    </span>
  )
}

export { VolumeCard }
