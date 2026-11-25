"use client"

import * as React from "react"
import { cn } from "cn"

import {
  type CarouselApi,
  Carousel as ShadcnCarousel,
  CarouselContent as ShadcnCarouselContent,
  CarouselItem as ShadcnCarouselItem,
  useCarousel,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/manga/button"

/*
 * Gestures: every slide is a panel (G1 inner case, 2px). Previous / Next are kit outline icon buttons with a
 * brush arrow (G3 hover-lift, G4 pressed negative + impact, focus-ink, disabled dashed). CarouselDots (an
 * addition of mangacn): square dots, the current one an ink flat that sweeps in (G2), hover thickens (G3).
 * Manga reading order: under data-reading="rtl" (or opts.direction "rtl", or dir="rtl") embla runs right to
 * left, the slides flow right to left, the arrows turn and the arrow keys follow; text stays left to right.
 * Under 640px the buttons are 44px and sit inside the carousel width, in a row under the slides.
 */

type CarouselProps = React.ComponentProps<typeof ShadcnCarousel>

/** Reading order of the page around the carousel (not the carousel itself): data-reading and dir. */
function usePageOrder(ref: React.RefObject<HTMLDivElement | null>) {
  const [order, setOrder] = React.useState({ reading: false, dir: false })
  React.useEffect(() => {
    const read = () => {
      const parent = ref.current?.parentElement
      const reading = parent?.closest("[data-reading]")?.getAttribute("data-reading") === "rtl"
      const dir = parent?.closest("[dir]")?.getAttribute("dir") === "rtl"
      setOrder((o) => (o.reading === reading && o.dir === dir ? o : { reading, dir }))
    }
    read()
    const observer = new MutationObserver(read)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-reading", "dir"], subtree: true })
    return () => observer.disconnect()
  }, [ref])
  return order
}

function Carousel({ opts, setApi, orientation = "horizontal", className, onKeyDownCapture, ref, ...props }: CarouselProps) {
  const rootRef = React.useRef<HTMLDivElement | null>(null)
  const page = usePageOrder(rootRef)
  const direction = opts?.direction ?? (page.reading || page.dir ? "rtl" : "ltr")
  const options = React.useMemo(() => ({ ...opts, direction }), [opts, direction])
  const apiRef = React.useRef<CarouselApi>(undefined)

  const handleApi = React.useCallback(
    (api: CarouselApi) => {
      apiRef.current = api
      setApi?.(api)
    },
    [setApi],
  )

  const setRef = React.useCallback(
    (el: HTMLDivElement | null) => {
      rootRef.current = el
      if (typeof ref === "function") ref(el)
      else if (ref) ref.current = el
    },
    [ref],
  )

  // Replaces the stock handler: arrow keys follow the orientation and the reading order.
  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    onKeyDownCapture?.(event)
    const api = apiRef.current
    if (event.defaultPrevented || !api) return
    const rtl = direction === "rtl"
    const back = orientation === "vertical" ? "ArrowUp" : rtl ? "ArrowRight" : "ArrowLeft"
    const forward = orientation === "vertical" ? "ArrowDown" : rtl ? "ArrowLeft" : "ArrowRight"
    if (event.key === back) {
      event.preventDefault()
      api.scrollPrev()
    } else if (event.key === forward) {
      event.preventDefault()
      api.scrollNext()
    }
  }

  return (
    <ShadcnCarousel
      ref={setRef}
      data-manga="carousel"
      data-orientation={orientation}
      data-reading={direction === "rtl" && !page.dir ? "rtl" : undefined}
      opts={options}
      setApi={handleApi}
      orientation={orientation}
      onKeyDownCapture={handleKeyDown}
      className={cn(
        "group/carousel",
        // manga order: the buttons and dots swap sides with the flow (slide content is reset to ltr)
        direction === "rtl" && !page.dir && "[direction:rtl]",
        orientation === "horizontal" && "max-sm:has-[>[data-slot=carousel-previous]]:not-has-[>[data-slot=carousel-dots]]:pb-14",
        className,
      )}
      {...props}
    />
  )
}

function CarouselContent({ className, ...props }: React.ComponentProps<typeof ShadcnCarouselContent>) {
  const { opts, orientation } = useCarousel()
  return (
    <ShadcnCarouselContent
      className={cn(orientation === "horizontal" && opts?.direction === "rtl" && "[direction:rtl]", className)}
      {...props}
    />
  )
}

/** A slide: its content is drawn as a panel (2px ink frame on paper). Text stays left to right in manga order. */
function CarouselItem({ className, ...props }: React.ComponentProps<typeof ShadcnCarouselItem>) {
  return (
    <ShadcnCarouselItem
      data-manga="carousel-item"
      className={cn("*:ink-case-inner reading-rtl:*:[direction:ltr]", className)}
      {...props}
    />
  )
}

const nav = "absolute! z-10 touch-manipulation max-sm:size-11 disabled:pointer-events-auto"

const place = {
  previous: {
    // under 640px the button sits on the edge: its outward impact line would stick out of the page
    horizontal: "max-sm:[&>[data-manga=impact-lines]:first-child]:hidden bottom-0 start-0 sm:top-0 sm:my-auto sm:-start-12 sm:group-has-[>[data-slot=carousel-dots]]/carousel:bottom-9",
    vertical: "inset-x-0 mx-auto -top-14 sm:-top-12",
  },
  next: {
    horizontal: "max-sm:[&>[data-manga=impact-lines]:nth-child(2)]:hidden bottom-0 end-0 sm:top-0 sm:my-auto sm:-end-12 sm:group-has-[>[data-slot=carousel-dots]]/carousel:bottom-9",
    vertical: "inset-x-0 mx-auto -bottom-14 sm:-bottom-12",
  },
} as const

// mark-arrow points up: turned toward the previous / next slide, mirrored in manga order and in rtl.
const arrow = {
  previous: {
    horizontal: "-rotate-90 rtl:rotate-90 reading-rtl:rotate-90",
    vertical: "rotate-0",
  },
  next: {
    horizontal: "rotate-90 rtl:-rotate-90 reading-rtl:-rotate-90",
    vertical: "rotate-180",
  },
} as const

function CarouselPrevious({ className, variant = "outline", size = "icon", ...props }: React.ComponentProps<typeof Button>) {
  const { orientation = "horizontal", scrollPrev, canScrollPrev } = useCarousel()
  return (
    <Button
      data-slot="carousel-previous"
      variant={variant}
      size={size}
      className={cn(nav, place.previous[orientation], className)}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <span aria-hidden className={cn("mark-arrow text-lg", arrow.previous[orientation])} />
      <span className="sr-only">Previous slide</span>
    </Button>
  )
}

function CarouselNext({ className, variant = "outline", size = "icon", ...props }: React.ComponentProps<typeof Button>) {
  const { orientation = "horizontal", scrollNext, canScrollNext } = useCarousel()
  return (
    <Button
      data-slot="carousel-next"
      variant={variant}
      size={size}
      className={cn(nav, place.next[orientation], className)}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <span aria-hidden className={cn("mark-arrow text-lg", arrow.next[orientation])} />
      <span className="sr-only">Next slide</span>
    </Button>
  )
}

/** Look of one dot: a 24px hit area (44px under 640px) around a 12px square; current = ink flat. */
const dot = {
  hit: "group/dot grid size-6 cursor-pointer place-items-center rounded-(--radius) focus-ink focus-visible:outline-solid! focus-visible:outline-2! focus-visible:outline-offset-[-2px]! focus-visible:outline-ring! focus-visible:shadow-none! max-sm:size-11",
  mark: "size-3 rounded-(--radius) border-[length:var(--mg-bw)] border-border bg-background group-hover/dot:shadow-[inset_0_0_0_1px_var(--border)] group-aria-[current=true]/dot:ink-fill group-aria-[current=true]/dot:fill-in",
}

/** mangacn addition: one square dot per snap point, built on useCarousel. */
function CarouselDots({ className, ...props }: React.ComponentProps<"div">) {
  const { api } = useCarousel()
  const [snaps, setSnaps] = React.useState({ count: 0, current: 0 })

  React.useEffect(() => {
    if (!api) return
    const read = () => setSnaps({ count: api.scrollSnapList().length, current: api.selectedScrollSnap() })
    read()
    api.on("select", read)
    api.on("reInit", read)
    return () => {
      api.off("select", read)
      api.off("reInit", read)
    }
  }, [api])

  return (
    <div
      role="group"
      aria-label="Choose a slide"
      data-slot="carousel-dots"
      data-manga="carousel-dots"
      className={cn("mt-3 flex items-center justify-center reading-rtl:[direction:rtl]", className)}
      {...props}
    >
      {Array.from({ length: snaps.count }, (_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`Slide ${i + 1} of ${snaps.count}`}
          aria-current={i === snaps.current ? "true" : undefined}
          onClick={() => api?.scrollTo(i)}
          className={dot.hit}
        >
          <span aria-hidden className={dot.mark} />
        </button>
      ))}
    </div>
  )
}

export { type CarouselApi, Carousel, CarouselContent, CarouselDots, CarouselItem, CarouselNext, CarouselPrevious, useCarousel }
