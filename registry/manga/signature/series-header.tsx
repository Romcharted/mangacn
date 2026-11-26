"use client"

import * as React from "react"
import { cn } from "cn"

import { Badge } from "@/components/ui/manga/badge"
import { Button } from "@/components/ui/manga/button"
import { Stamp } from "@/components/manga/stamp"

/*
 * Series header: the cover, the title in lettering, author, status as a stamp, genres as badges, a few
 * figures, a summary that folds to a few lines, and the actions. Gestures: G1 the header is a case and the
 * cover a 2px case inside it · G8 the status is a Stamp (accent for "new", ink otherwise) · G5 the unfolded
 * summary drops in (animate-drop-in). Laid out at 375 px first: the cover sits beside the title, the summary
 * and the actions take the full width; from a wide container on, everything but the cover forms one column.
 */

export type SeriesStatus = "new" | "ongoing" | "completed" | "hiatus"
export type SeriesStat = { label: React.ReactNode; value: React.ReactNode }

export type SeriesHeaderProps = Omit<React.ComponentProps<"header">, "title"> & {
  title: React.ReactNode
  /** Image URL or any node, drawn in a 2:3 box. Without it, a screentone. */
  cover?: React.ReactNode
  /** Original or alternative title, under the title. */
  altTitle?: React.ReactNode
  author?: React.ReactNode
  status?: SeriesStatus
  genres?: string[]
  /** A few figures (chapters, volumes, readers…), up to four. */
  stats?: SeriesStat[]
  summary?: React.ReactNode
  /** Lines shown while the summary is folded. */
  summaryLines?: 2 | 3 | 4 | 5
  /** Buttons or links, e.g. "Start reading" and "Add to shelf". */
  actions?: React.ReactNode
  /** Heading level of the title. */
  as?: "h1" | "h2" | "h3"
}

const STATUS: Record<SeriesStatus, string> = { new: "New", ongoing: "Ongoing", completed: "Completed", hiatus: "Hiatus" }
// written out so Tailwind sees every class
const CLAMP = { 2: "line-clamp-2", 3: "line-clamp-3", 4: "line-clamp-4", 5: "line-clamp-5" } as const

function SeriesHeader({
  title,
  cover,
  altTitle,
  author,
  status,
  genres,
  stats,
  summary,
  summaryLines = 3,
  actions,
  as: Heading = "h1",
  className,
  ...props
}: SeriesHeaderProps) {
  const [open, setOpen] = React.useState(false)
  const [folds, setFolds] = React.useState(false)
  const textRef = React.useRef<HTMLDivElement>(null)
  const id = React.useId()

  // the toggle only shows when the folded summary actually hides something
  React.useLayoutEffect(() => {
    const el = textRef.current
    if (!el || open) return
    const measure = () => setFolds(el.scrollHeight - el.clientHeight > 1)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [open, summary, summaryLines])

  const art =
    typeof cover === "string" ? (
      <img src={cover} alt="" className="absolute inset-0 size-full object-cover" />
    ) : cover ? (
      <span className="absolute inset-0 block">{cover}</span>
    ) : (
      <span aria-hidden className="absolute inset-0 block tone-lines" />
    )

  return (
    <header
      data-manga="series-header"
      data-status={status}
      className={cn("@container/series relative w-full min-w-0 ink-case p-3 text-foreground sm:p-4", className)}
      {...props}
    >
      <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-3 gap-y-4 @md/series:grid-cols-[9rem_minmax(0,1fr)] @2xl/series:grid-cols-[12rem_minmax(0,1fr)] @2xl/series:gap-x-6">
        <div className="relative aspect-[2/3] w-full self-start overflow-hidden bg-background ink-case-inner @2xl/series:row-span-4">{art}</div>

        <div className="flex min-w-0 flex-col gap-2">
          {status && (
            <div className="flex">
              <Stamp tone={status === "new" ? "accent" : "ink"} rotate={-4} className="text-sm @md/series:text-base">
                {STATUS[status]}
              </Stamp>
            </div>
          )}
          <Heading className="font-letter text-3xl leading-[0.95] tracking-wide break-words uppercase @md/series:text-4xl @2xl/series:text-5xl">{title}</Heading>
          {altTitle && <p className="text-sm break-words italic">{altTitle}</p>}
          {author && <p className="font-mono text-sm break-words">{author}</p>}
          {genres && genres.length > 0 && (
            <ul aria-label="Genres" className="m-0 hidden list-none flex-wrap gap-1.5 p-0 @md/series:flex">
              {genres.map((g) => (
                <li key={g}>
                  <Badge variant="outline">{g}</Badge>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* phones: the genres get their own full-width row, under the cover */}
        {genres && genres.length > 0 && (
          <ul aria-label="Genres" className="col-span-2 m-0 flex list-none flex-wrap gap-1.5 p-0 @md/series:hidden">
            {genres.map((g) => (
              <li key={g}>
                <Badge variant="outline">{g}</Badge>
              </li>
            ))}
          </ul>
        )}

        {stats && stats.length > 0 && (
          <dl className="col-span-2 m-0 grid grid-cols-[repeat(auto-fit,minmax(5.5rem,1fr))] border-[length:var(--mg-bw)] border-border @2xl/series:col-span-1 @2xl/series:col-start-2">
            {stats.slice(0, 4).map((s, i) => (
              <div key={i} className="grid min-w-0 gap-0.5 border-border px-2.5 py-2 not-first:border-s-[length:var(--mg-bw)]">
                <dt className="font-mono text-xs">{s.label}</dt>
                <dd className="m-0 font-letter text-xl leading-none break-words">{s.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {summary && (
          <div className="col-span-2 grid gap-1 @2xl/series:col-span-1 @2xl/series:col-start-2">
            <div
              ref={textRef}
              id={`${id}-summary`}
              className={cn("max-w-prose text-base leading-relaxed", !open && CLAMP[summaryLines], open && "animate-drop-in")}
            >
              {summary}
            </div>
            {(folds || open) && (
              <div>
                <Button
                  variant="link"
                  size="sm"
                  aria-expanded={open}
                  aria-controls={`${id}-summary`}
                  onClick={() => setOpen((o) => !o)}
                  className="max-sm:min-h-11"
                >
                  {open ? "Show less" : "Read more"}
                </Button>
              </div>
            )}
          </div>
        )}

        {actions && (
          <div className="col-span-2 flex flex-wrap gap-2 @2xl/series:col-span-1 @2xl/series:col-start-2 max-sm:[&>*]:min-h-11 max-sm:[&>*]:flex-1">{actions}</div>
        )}
      </div>
    </header>
  )
}

export { SeriesHeader }
