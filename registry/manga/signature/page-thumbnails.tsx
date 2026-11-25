"use client"

import * as React from "react"
import { cn } from "cn"

import type { ReaderStripPage } from "@/components/manga/reader-strip"

/*
 * Page thumbnails: every page of a chapter in a grid, to jump anywhere. In manga order the grid runs right
 * to left, like the pages. Gestures: G1 each page is a small case (2px), G3 hover-lift, focus ring
 * (focus-ink), pressed offset (press), G2 the page being read: its number plate is an ink flat that sweeps in
 * (fill-in); pages already read carry a brush check. Scans stay light in dark mode, on a paper mat.
 */

export type PageThumbnailsProps = Omit<React.ComponentProps<"nav">, "onSelect"> & {
  pages: ReaderStripPage[]
  /** The page or pages on screen (a spread is two). */
  current?: number | number[]
  /** Pages before this index are marked as read. */
  readUntil?: number
  onSelect?: (page: number) => void
  /** rtl: the grid runs right to left (manga order) · ltr: left to right. */
  direction?: "rtl" | "ltr"
  /** Smallest thumbnail width (CSS length). Three columns fit at 375 px with the default. */
  minWidth?: string
}

function PageThumbnails({
  pages,
  current,
  readUntil = 0,
  onSelect,
  direction = "rtl",
  minWidth = "5.5rem",
  className,
  style,
  "aria-label": ariaLabel = "All pages",
  ...props
}: PageThumbnailsProps) {
  const on = new Set(current === undefined ? [] : Array.isArray(current) ? current : [current])
  const first = Math.min(...on)
  const currentRef = React.useRef<HTMLButtonElement>(null)
  // opened on a far page: bring the page being read into view (no scrolling of the window itself)
  React.useEffect(() => {
    const el = currentRef.current
    const parent = el?.closest<HTMLElement>("[data-slot=page-thumbnails-scroll], [role=dialog]")
    if (!el || !parent) return
    const box = el.getBoundingClientRect()
    const frame = parent.getBoundingClientRect()
    if (box.top < frame.top || box.bottom > frame.bottom) parent.scrollTop += box.top - frame.top - frame.height / 3
  }, [])
  return (
    <nav
      data-manga="page-thumbnails"
      data-reading={direction}
      aria-label={ariaLabel}
      className={cn("w-full", className)}
      style={style}
      {...props}
    >
      <ol
        className="m-0 grid list-none gap-3 p-1 pe-2 pb-2"
        style={{ gridTemplateColumns: `repeat(auto-fill, minmax(min(${minWidth}, 100%), 1fr))`, direction }}
      >
        {pages.map((p, i) => {
          const isOn = on.has(i)
          const read = i < readUntil && !isOn
          return (
            <li key={`${i}-${p.src}`} className="min-w-0 [direction:initial]">
              <button
                ref={i === first ? currentRef : undefined}
                type="button"
                aria-current={isOn ? "page" : undefined}
                aria-label={`Page ${i + 1}${isOn ? " (on screen)" : read ? " (read)" : ""}`}
                onClick={() => onSelect?.(i)}
                className="relative isolate block w-full cursor-pointer ink-case-inner p-1 text-start text-foreground hover-lift focus-ink press aria-[current=page]:border-[3px] aria-[current=page]:p-[3px]"
              >
                <span className="block bg-background dark:bg-foreground dark:p-1">
                  <span className="relative block overflow-hidden bg-background" style={{ aspectRatio: `${p.width} / ${p.height}` }}>
                    <img
                      src={p.src}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                      className="absolute inset-0 block size-full object-cover"
                    />
                  </span>
                </span>
                <span
                  className={cn(
                    "mt-1 flex h-6 items-center justify-between gap-1 border-ink-fine px-1.5 font-mono text-xs",
                    isOn && "ink-fill fill-in border-primary",
                  )}
                >
                  <span>{i + 1}</span>
                  {read && <span aria-hidden className="mark-check text-sm" />}
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export { PageThumbnails }
