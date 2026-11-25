import { useRef, useState } from "react"
import { Button } from "@registry/manga/ui/button"
import { SpeechBubble } from "@registry/manga/signature/speech-bubble"
import { SpeedLines } from "@registry/manga/signature/speed-lines"

/**
 * Opening page: the style in five seconds, built from the kit's own components.
 * In manga reading order (data-reading="rtl") the panels flow right to left; text does not.
 */
export function Hero() {
  const [hit, setHit] = useState(0)
  const page = useRef<HTMLDivElement>(null)
  const onHit = () => {
    setHit((h) => h + 1)
    // restart the shake + negative without remounting (keeps focus on the button)
    const el = page.current
    if (!el) return
    el.classList.remove("animate-page-hit")
    void el.offsetWidth
    el.classList.add("animate-page-hit")
  }
  return (
    <div
      ref={page}
      className="grid aspect-[4/3] grid-cols-6 grid-rows-6 gap-2"
      role="group"
      aria-label="Sample manga page"
    >
      <SpeedLines hole={0.42} animated="slow" className="col-span-4 col-start-1 row-span-4 row-start-1 border-ink-panel reading-rtl:col-start-3">
        <div className="relative h-full min-h-40">
          <Figure className="absolute inset-x-0 bottom-0 mx-auto h-[74%] text-foreground" />
          <SpeechBubble className="absolute end-2 top-2 text-base reading-rtl:start-2 reading-rtl:end-auto" tail="bottom" tailAlign="start">
            Ready?
          </SpeechBubble>
        </div>
      </SpeedLines>
      <div aria-hidden className="col-span-2 col-start-5 row-span-2 row-start-1 border-ink-panel tone-fade-b reading-rtl:col-start-1" />
      <SpeedLines variant="motion" animated="slow" seed={5} className="col-span-2 col-start-5 row-span-2 row-start-3 border-ink-panel reading-rtl:col-start-1">
        <div className="grid h-full place-items-center">
          <span aria-hidden className="-rotate-6 font-sfx text-3xl knockout">
            ザッ
          </span>
        </div>
      </SpeedLines>
      <div className="relative col-span-6 row-span-2 row-start-5 grid place-items-center overflow-hidden border-ink-panel bg-background">
        <span aria-hidden className="absolute inset-y-0 start-0 w-1/4 border-e-[length:var(--mg-bw-fine)] border-border tone-fade-l reading-rtl:start-auto reading-rtl:end-0 reading-rtl:border-e-0 reading-rtl:border-s-[length:var(--mg-bw-fine)] reading-rtl:tone-fade-r" />
        <span aria-hidden className="absolute inset-y-0 end-0 w-1/4 border-s-[length:var(--mg-bw-fine)] border-border tone-fade-r reading-rtl:end-auto reading-rtl:start-0 reading-rtl:border-s-0 reading-rtl:border-e-[length:var(--mg-bw-fine)] reading-rtl:tone-fade-l" />
        <Button variant="shout" size="lg" onClick={onHit}>
          Hit me!
        </Button>
        {hit > 0 && (
          <span key={hit} className="contents">
            <span aria-hidden className="pointer-events-none absolute end-[6%] top-0 rotate-6 animate-sfx font-sfx text-5xl text-foreground knockout sm:text-6xl">
              DON!
            </span>
            <span aria-hidden className="pointer-events-none absolute start-[8%] bottom-1 -rotate-12 animate-sfx font-sfx text-2xl text-foreground knockout [animation-delay:83ms]">
              ドッ
            </span>
          </span>
        )}
      </div>
    </div>
  )
}

function Figure({ className }: { className?: string }) {
  // Abstract head-and-shoulders silhouette, drawn for this page.
  return (
    <svg viewBox="0 0 200 160" className={className} aria-hidden>
      <path
        d="M100 18c22 0 38 17 38 40 0 16-7 29-17 36l3 10c26 6 46 20 54 56H22c8-36 28-50 54-56l3-10c-10-7-17-20-17-36 0-23 16-40 38-40z"
        fill="var(--background)"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path d="M62 56c4-26 26-40 48-38 22 2 34 20 30 40-10-14-26-18-40-14-14 4-26 6-38 12z" fill="currentColor" />
    </svg>
  )
}
