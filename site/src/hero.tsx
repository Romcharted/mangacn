import { useRef, useState } from "react"
import { Button } from "@registry/manga/ui/button"
import { SpeechBubble } from "@registry/manga/signature/speech-bubble"
import { SpeedLines } from "@registry/manga/signature/speed-lines"
import { Art } from "./mapless"

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
      <div className="relative col-span-4 col-start-1 row-span-4 row-start-1 overflow-hidden border-ink-panel reading-rtl:col-start-3">
        <div className="@container relative h-full min-h-40">
          <Art
            name="suzu-portrait"
            shown="(min-width: 64rem) 30rem, 60vw"
            loading="eager"
            className="absolute inset-0 size-full object-cover object-[50%_28%]"
          />
          {/* on the speed lines of the top corner, clear of the face: sized with the panel (container units) */}
          <SpeechBubble
            className="absolute end-[3%] top-[4%] max-w-[34%]! px-[max(0.4rem,3cqi)]! py-[max(0.25rem,2cqi)]! text-[max(0.7rem,5cqi)]! leading-none! reading-rtl:start-[3%] reading-rtl:end-auto"
            tail="bottom"
            tailAlign="start"
          >
            Ready?
          </SpeechBubble>
        </div>
      </div>
      <div className="relative col-span-2 col-start-5 row-span-2 row-start-1 overflow-hidden border-ink-panel reading-rtl:col-start-1">
        <Art name="kuro-sleeping" shown="(min-width: 64rem) 13rem, 34vw" loading="eager" className="absolute inset-0 size-full object-cover" />
      </div>
      <SpeedLines variant="motion" animated seed={5} className="col-span-2 col-start-5 row-span-2 row-start-3 border-ink-panel reading-rtl:col-start-1">
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
