import type { ReactNode } from "react"
import { Button } from "@registry/manga/ui/button"
import { Carousel, CarouselContent, CarouselDots, CarouselItem, CarouselNext, CarouselPrevious } from "@registry/manga/ui/carousel"
import { Eyes, Figure, Runner, Skyline } from "../art"
import { force, Tile, Tiles } from "../state-grid"

/** Rain over an umbrella: drawn for this demo. */
function Rain({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 150" className={className} aria-hidden>
      <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        {Array.from({ length: 22 }, (_, i) => {
          const x = (i * 37) % 200
          const y = (i * 23) % 70
          return <path key={i} d={`M${x} ${y}l-8 18`} />
        })}
      </g>
      <path d="M50 92c8-30 92-30 100 0-12-6-22-6-33 0-11-6-23-6-34 0-11-6-22-6-33 0z" fill="currentColor" />
      <path d="M100 92v38c0 8-12 8-12 0" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
    </svg>
  )
}

/** A small boat on three rows of waves. */
function Harbour({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 150" className={className} aria-hidden>
      <path d="M70 92h64l-12 18H82z" fill="currentColor" />
      <path d="M100 30v60M100 34l30 46h-30z" fill="var(--background)" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
      {[112, 126, 140].map((y) => (
        <path
          key={y}
          d={`M0 ${y}c12-8 22-8 34 0s22 8 34 0 22-8 34 0 22 8 34 0 22-8 34 0 22 8 30 0`}
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />
      ))}
    </svg>
  )
}

/** A paper lantern hanging from a line. */
function Lantern({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 150" className={className} aria-hidden>
      <path d="M0 18c60 14 140 14 200 0" fill="none" stroke="currentColor" strokeWidth="3" />
      <path d="M100 26v14" stroke="currentColor" strokeWidth="4" />
      <rect x="84" y="38" width="32" height="8" fill="currentColor" />
      <path d="M78 46h44c10 18 10 52 0 70H78c-10-18-10-52 0-70z" fill="var(--background)" stroke="currentColor" strokeWidth="4" />
      <path d="M80 70h40M80 92h40" stroke="currentColor" strokeWidth="3" />
      <rect x="84" y="116" width="32" height="8" fill="currentColor" />
      <path d="M100 124v16" stroke="currentColor" strokeWidth="3" />
    </svg>
  )
}

type Art = (p: { className?: string }) => ReactNode

const chapters: { n: number; title: string; art: Art }[] = [
  { n: 12, title: "The long night", art: Skyline },
  { n: 13, title: "After the rain", art: Rain },
  { n: 14, title: "Harbour", art: Harbour },
  { n: 15, title: "Paper lanterns", art: Lantern },
  { n: 16, title: "Wide awake", art: Eyes },
]

/** One slide: art on top (a light tone around it, never under text), the caption on paper. */
function ChapterSlide({ n, title, art: A }: { n: number; title: string; art: Art }) {
  return (
    <figure className="flex h-full flex-col">
      <div className="grid aspect-[4/3] place-items-center overflow-hidden border-b-[length:var(--mg-bw)] border-border bg-background p-3">
        <A className="h-full w-full" />
      </div>
      <figcaption className="flex items-baseline gap-2 px-3 py-2">
        <span className="font-mono text-sm">Ch. {n}</span>
        <span className="font-letter text-lg leading-tight tracking-wide uppercase">{title}</span>
      </figcaption>
    </figure>
  )
}

function Heading({ children }: { children: ReactNode }) {
  return <h3 className="mb-3 font-letter text-xl tracking-wide uppercase">{children}</h3>
}

const pages: { n: number; art: Art; line: string }[] = [
  { n: 1, art: Figure, line: "She looks up." },
  { n: 2, art: Runner, line: "Then she runs." },
  { n: 3, art: Rain, line: "The rain starts." },
  { n: 4, art: Harbour, line: "The last boat." },
]

function PageSlide({ n, art: A, line }: { n: number; art: Art; line: string }) {
  return (
    <figure className="flex h-full items-stretch">
      <div className="grid w-2/5 shrink-0 place-items-center border-e-[length:var(--mg-bw)] border-border p-2">
        <A className="h-full max-h-28 w-full" />
      </div>
      <figcaption className="grid content-center gap-1 p-3">
        <span className="font-sfx text-3xl leading-none">{n}</span>
        <span>{line}</span>
      </figcaption>
    </figure>
  )
}

export function Preview() {
  return (
    <div className="grid gap-10">
      <section>
        <Heading>Chapter preview</Heading>
        <div className="sm:px-12">
          <Carousel opts={{ align: "start" }} className="@container">
            <CarouselContent>
              {chapters.map((c) => (
                <CarouselItem key={c.n} className="@md:basis-1/2 @3xl:basis-1/3">
                  <ChapterSlide {...c} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
            <CarouselDots />
          </Carousel>
        </div>
      </section>

      <section>
        <Heading>Manga order · right to left</Heading>
        <div className="sm:px-12" data-reading="rtl">
          <Carousel opts={{ direction: "rtl" }} className="@container">
            <CarouselContent>
              {pages.map((p) => (
                <CarouselItem key={p.n} className="@md:basis-1/2">
                  <PageSlide {...p} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
            <CarouselDots />
          </Carousel>
        </div>
      </section>

      <section>
        <Heading>Vertical</Heading>
        <div className="mx-auto max-w-sm py-14 sm:py-12">
          <Carousel orientation="vertical" opts={{ align: "start" }}>
            <CarouselContent className="h-80">
              {pages.map((p) => (
                <CarouselItem key={p.n} className="basis-1/2">
                  <PageSlide {...p} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>
    </div>
  )
}

/* Static twins of the controls (same classes as the wrapper), so the states can be frozen. */
function Arrow({ dir, state, disabled }: { dir: "previous" | "next"; state?: string; disabled?: boolean }) {
  return (
    <Button variant="outline" size="icon" disabled={disabled} aria-label={dir === "previous" ? "Previous slide" : "Next slide"} className="max-sm:size-11" {...force(state ?? "")}>
      <span
        aria-hidden
        className={
          "mark-arrow text-lg " + (dir === "previous" ? "-rotate-90 rtl:rotate-90 reading-rtl:rotate-90" : "rotate-90 rtl:-rotate-90 reading-rtl:-rotate-90")
        }
      />
    </Button>
  )
}

const dotHit = "group/dot grid size-6 cursor-pointer place-items-center rounded-(--radius) focus-ink focus-visible:outline-solid! focus-visible:outline-2! focus-visible:outline-offset-[-2px]! focus-visible:outline-ring! focus-visible:shadow-none! max-sm:size-11"
const dotMark =
  "size-3 rounded-(--radius) border-[length:var(--mg-bw)] border-border bg-background group-hover/dot:shadow-[inset_0_0_0_1px_var(--border)] group-aria-[current=true]/dot:ink-fill group-aria-[current=true]/dot:fill-in"

function Dots({ current = 1, state }: { current?: number; state?: { at: number; force: string } }) {
  return (
    <div className="flex items-center justify-center">
      {[0, 1, 2, 3].map((i) => (
        <button
          key={i}
          type="button"
          aria-label={`Slide ${i + 1} of 4`}
          aria-current={i === current ? "true" : undefined}
          className={dotHit}
          {...(state?.at === i ? force(state.force) : {})}
        >
          <span aria-hidden className={dotMark} />
        </button>
      ))}
    </div>
  )
}

export function States() {
  return (
    <Tiles>
      <Tile label="live · first slide, previous disabled" size="full">
        <div className="w-full min-w-0 max-w-xl sm:px-12">
          <Carousel opts={{ align: "start" }} className="@container">
            <CarouselContent>
              {chapters.slice(0, 3).map((c) => (
                <CarouselItem key={c.n} className="@md:basis-1/2">
                  <ChapterSlide {...c} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
            <CarouselDots />
          </Carousel>
        </div>
      </Tile>
      <Tile label="next · rest">
        <Arrow dir="next" />
      </Tile>
      <Tile label="next · hover">
        <Arrow dir="next" state="hover" />
      </Tile>
      <Tile label="next · focus">
        <Arrow dir="next" state="focus" />
      </Tile>
      <Tile label="next · pressed">
        <Arrow dir="next" state="active" />
      </Tile>
      <Tile label="previous · disabled">
        <Arrow dir="previous" disabled />
      </Tile>
      <Tile label="manga order · previous, next">
        <div data-reading="rtl" className="flex gap-3 [direction:rtl]">
          <Arrow dir="previous" />
          <Arrow dir="next" />
        </div>
      </Tile>
      <Tile label="dots · current = ink flat" size="lg">
        <Dots />
      </Tile>
      <Tile label="dots · hover on the 3rd" size="lg">
        <Dots state={{ at: 2, force: "hover" }} />
      </Tile>
      <Tile label="dots · focus on the 3rd" size="lg">
        <Dots state={{ at: 2, force: "focus" }} />
      </Tile>
      <Tile label="slide · a panel" size="lg">
        <div className="w-60 ink-case-inner">
          <ChapterSlide {...chapters[1]} />
        </div>
      </Tile>
    </Tiles>
  )
}

export function Thumb() {
  return (
    <div className="grid w-56 gap-2" aria-hidden>
      <div className="flex gap-2">
        {[Skyline, Rain, Lantern].map((A, i) => (
          <div key={i} className="grid h-20 flex-1 place-items-center ink-case-inner p-1">
            <A className="h-full w-full" />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-3">
        {[0, 1, 2].map((i) => (
          <span key={i} className={"size-3 border-[length:var(--mg-bw)] border-border " + (i === 0 ? "ink-fill" : "bg-background")} />
        ))}
      </div>
    </div>
  )
}
