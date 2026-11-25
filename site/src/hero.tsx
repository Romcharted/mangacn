import { useState } from "react"
import { Button } from "@registry/manga/ui/button"
import { SpeechBubble } from "@registry/manga/signature/speech-bubble"
import { SpeedLines } from "@registry/manga/signature/speed-lines"

/** Opening page: the style in five seconds. Built from the kit's own components. */
export function Hero() {
  const [hit, setHit] = useState(0)
  return (
    <div
      key={hit}
      className={`grid aspect-[4/3] grid-cols-6 grid-rows-6 gap-2 ${hit ? "animate-impact" : ""}`}
      role="group"
      aria-label="Sample manga page"
    >
      <SpeedLines hole={0.42} className="col-span-4 row-span-4 border-ink-panel">
        <div className="relative h-full min-h-40">
          <Figure className="absolute inset-x-0 bottom-0 mx-auto h-[78%] text-foreground" />
          <SpeechBubble className="absolute end-3 top-3 text-base" tail="bottom" tailAlign="start">
            Ready?
          </SpeechBubble>
        </div>
      </SpeedLines>
      <div aria-hidden className="col-span-2 row-span-2 border-ink-panel tone-fade-b" />
      <SpeedLines variant="motion" className="col-span-2 row-span-2 border-ink-panel">
        <div className="grid h-full place-items-center">
          <span aria-hidden className="-rotate-6 font-sfx text-3xl knockout">
            ザッ
          </span>
        </div>
      </SpeedLines>
      <div className="relative col-span-6 row-span-2 grid place-items-center overflow-hidden border-ink-panel tone-20">
        <Button variant="shout" size="lg" onClick={() => setHit((h) => h + 1)}>
          Hit me!
        </Button>
        {hit > 0 && (
          <span aria-hidden className="absolute end-6 top-1 animate-sfx font-sfx text-4xl text-foreground knockout">
            DON!
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
