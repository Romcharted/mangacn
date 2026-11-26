import type { ReactNode } from "react"
import { Button } from "@registry/manga/ui/button"
import { Carousel, CarouselContent, CarouselDots, CarouselItem, CarouselNext, CarouselPrevious } from "@registry/manga/ui/carousel"
import { artSrc, type ArtName } from "../mapless"
import { force, Tile, Tiles } from "../state-grid"

type Art = (p: { className?: string }) => ReactNode

/* Crops of "Mapless", the showcase's series (AI-generated pictures, see public/art/CREDITS.md). */
const pic =
  (name: ArtName): Art =>
  ({ className }) => <img src={artSrc(name, 200)} alt="" draggable={false} className={(className ?? "") + " object-cover"} />
const Skyline = pic("lighthouse-night")
const Rain = pic("bridge-far")
const Harbour = pic("kuro-sleeping")
const Lantern = pic("map")
const Eyes = pic("suzu-shock")
const Figure = pic("suzu-profile")
const Runner = pic("spear-clash")

const chapters: { n: number; title: string; art: Art }[] = [
  { n: 12, title: "The lighthouse", art: Skyline },
  { n: 13, title: "The ink bridge", art: Rain },
  { n: 14, title: "Kuro sleeps", art: Harbour },
  { n: 15, title: "A new map", art: Lantern },
  { n: 16, title: "The Eraser", art: Eyes },
]

/** One slide: art on top (a light tone around it, never under text), the caption on paper. */
function ChapterSlide({ n, title, art: A }: { n: number; title: string; art: Art }) {
  return (
    <figure className="flex h-full flex-col">
      <div className="grid aspect-[4/3] place-items-center overflow-hidden border-b-[length:var(--mg-bw)] border-border bg-background">
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
  { n: 1, art: Figure, line: "Suzu looks up." },
  { n: 2, art: Runner, line: "The spear falls." },
  { n: 3, art: Rain, line: "The bridge holds." },
  { n: 4, art: Harbour, line: "Kuro sleeps." },
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

/** Live: the arrows, the dots and a swipe move the slides. */
export function Thumb() {
  return (
    <div className="w-48">
      <Carousel opts={{ align: "start" }}>
        <CarouselContent>
          {[Skyline, Rain, Lantern, Eyes].map((A, i) => (
            <CarouselItem key={i} className="basis-1/2">
              <div className="h-20 overflow-hidden ink-case-inner">
                <A className="size-full" />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="mt-2 flex items-center justify-center gap-2">
          <CarouselPrevious className="static! size-7! translate-0!" />
          <CarouselDots />
          <CarouselNext className="static! size-7! translate-0!" />
        </div>
      </Carousel>
    </div>
  )
}
