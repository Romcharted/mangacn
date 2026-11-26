"use client"

import * as React from "react"
import { cn } from "cn"

/*
 * Ranking list. Gestures: G1 case (the list), G3 hover (frameless: the whole row inverts), G4 press (a 2px offset and
 * a paper negative with an ink inner line), a focus ring kept inside the case, G8 marks (the arrow for up and down,
 * the NEW burst). The rank is set in the SFX face; the first place takes the accent.
 */

export type RankingEntry = {
  id: string
  title: React.ReactNode
  subtitle?: React.ReactNode
  /** An image URL, or any node drawn as the thumbnail (2:3). */
  cover?: string | React.ReactNode
  /** Positive: up. Negative: down. 0: no change. "new": a new entry. */
  change?: number | "new"
  score?: React.ReactNode
  /** Makes the row a link. */
  href?: string
}

type RowAttributes = React.HTMLAttributes<HTMLElement> & { [key: `data-${string}`]: string | undefined }

export type RankingRowProps = {
  entry: RankingEntry
  rank: number
  /** Biggest numbers (top ranks). */
  big?: boolean
  /** Makes the row a button (when there is no href). */
  onSelect?: () => void
  /** Extra attributes for the interactive element (showcase states, data-*). */
  rowProps?: RowAttributes
}

export type RankingListProps = Omit<React.ComponentProps<"ol">, "onSelect" | "start"> & {
  entries: RankingEntry[]
  onSelect?: (entry: RankingEntry, index: number) => void
  /** First rank shown. */
  start?: number
  /** Ranks up to this one get the biggest numbers. */
  highlightTop?: number
  className?: string
}

function ChangeMark({ change }: { change?: number | "new" }) {
  if (change === undefined) return null
  if (change === "new")
    return (
      <span className="relative isolate inline-grid h-6 shrink-0 place-items-center px-3 font-sfx text-xs leading-none text-primary-foreground before:absolute before:-inset-x-2 before:-inset-y-2 before:-z-10 before:bg-destructive before:content-[''] before:shape-burst">
        <span aria-hidden>New</span>
        <span className="sr-only">New entry</span>
      </span>
    )
  if (change === 0)
    return (
      <span className="shrink-0 font-sfx text-xl leading-none">
        <span aria-hidden>–</span>
        <span className="sr-only">No change</span>
      </span>
    )
  const up = change > 0
  return (
    <span className="inline-flex shrink-0 items-center gap-1 font-mono text-sm tabular-nums">
      <span aria-hidden className={up ? "mark-arrow text-base" : "mark-arrow rotate-180 text-base"} />
      <span aria-hidden>{Math.abs(change)}</span>
      <span className="sr-only">{up ? `Up ${change}` : `Down ${Math.abs(change)}`}</span>
    </span>
  )
}

function RankingRow({ entry, rank, big = false, onSelect, rowProps }: RankingRowProps) {
  const { title, subtitle, cover, change, score, href } = entry
  const interactive = Boolean(href || onSelect)
  const first = rank === 1

  const rowClass = cn(
    "group flex min-h-14 w-full min-w-0 items-center gap-2 px-2 py-2 text-start text-foreground @sm/rank:gap-3 @sm/rank:px-3",
    interactive && "cursor-pointer hover-invert press focus-ink active:bg-background! active:text-foreground! active:shadow-[inset_0_0_0_2px_var(--foreground)] focus-visible:shadow-none! focus-visible:outline-2! focus-visible:outline-solid! focus-visible:outline-offset-[-4px]! focus-visible:outline-ring!",
  )

  const numberClass = cn(
    "w-12 shrink-0 text-center font-sfx leading-none tabular-nums @sm/rank:w-16",
    big ? "text-5xl @sm/rank:text-6xl" : "text-3xl tracking-tighter @sm/rank:text-4xl @sm/rank:tracking-normal",
    first ? "text-destructive" : "text-foreground",
    interactive && (first ? "group-hover:text-background group-active:text-destructive!" : "group-hover:text-background group-active:text-foreground!"),
  )

  const body = (
    <>
      <span className={numberClass}>{rank}</span>
      {cover !== undefined && cover !== null && (
        // the cover keeps its own ink and paper when the row inverts on hover
        <span className="relative block aspect-[2/3] w-10 shrink-0 overflow-hidden bg-background text-foreground ink-case-inner @sm/rank:w-12">
          {typeof cover === "string" ? (
            <img src={cover} alt="" className="absolute inset-0 size-full object-cover" />
          ) : (
            <span className="absolute inset-0 block">{cover}</span>
          )}
        </span>
      )}
      <span className="grid min-w-0 flex-1 gap-0.5">
        <span className="block font-letter text-lg leading-tight break-words uppercase">{title}</span>
        {subtitle != null && <span className="block text-sm break-words">{subtitle}</span>}
        {/* narrow: the score joins the text column, so the title keeps its width */}
        {score != null && <span className="block font-mono text-sm tabular-nums @md/rank:hidden">{score}</span>}
      </span>
      {score != null && <span className="hidden shrink-0 font-mono text-sm tabular-nums @md/rank:inline">{score}</span>}
      <ChangeMark change={change} />
    </>
  )

  if (href)
    return (
      <a data-manga="ranking-row" data-rank={rank} {...rowProps} href={href} className={rowClass}>
        {body}
      </a>
    )
  if (onSelect)
    return (
      <button data-manga="ranking-row" data-rank={rank} type="button" {...rowProps} onClick={onSelect} className={rowClass}>
        {body}
      </button>
    )
  return (
    <div data-manga="ranking-row" data-rank={rank} {...rowProps} className={rowClass}>
      {body}
    </div>
  )
}

function RankingList({ entries, onSelect, start = 1, highlightTop = 3, className, ...props }: RankingListProps) {
  return (
    <ol data-manga="ranking-list" className={cn("@container/rank relative isolate ink-case m-0 list-none p-0", className)} {...props}>
      {entries.map((entry, i) => {
        const rank = start + i
        return (
          <li key={entry.id} className="border-b-2 border-border last:border-b-0">
            <RankingRow
              entry={entry}
              rank={rank}
              big={rank <= highlightTop}
              onSelect={onSelect ? () => onSelect(entry, i) : undefined}
            />
          </li>
        )
      })}
    </ol>
  )
}

export { RankingList, RankingRow }
